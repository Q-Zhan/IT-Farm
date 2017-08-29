<template>
  <div id="create_message">
    <header>
      <div class="back_arrow">
        <router-link to="/app/home">
          <img :src="back_arrow"/>
        </router-link>
      </div>
      <div class="avatar">
        <img :src="avatar"/>
        <div class="triangle"></div>
      </div>
      <div class="fakename">匿名</div>
      <div class="send_arrow"><img :src="send_arrow" @click="sendImg"/></div>
    </header>
    <div class="hint">发秘密到朋友圈...</div>
    <div class="message_content">
      <textarea maxlength="150" v-model="message_content" placeholder="请善用匿名，不要发表人身攻击、低俗等不友善内容，否则可能会被禁言"></textarea>
      <div class="limit">{{ message_content.length }} / 150</div>
    </div>
    <div class="img_list">
      <div v-for="(item, index) in img_list" :key="index" class="img_item">
        <img :src="item"/>
        <div class="delete_button" @click="deleteImg(index)"><img :src="delete_button"/></div>
      </div>
    </div>
    <footer>
      <img :src="delete_img" @click="deleteContent" class="delete"/>
      <input type="file" @change="encodeImg" accept=""/>
      <img :src="picture" class="add_img"/>
    </footer>
    <Toast :message="toast.message" v-show="toast.isShowed"/>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import { api } from '../../api'
import Vue from 'vue'
import { mapState } from 'vuex'
import Toast from '../Common/Toast/Toast.vue'
import Loading from '../Common/Loading/Loading.vue'
import back_arrow from './back_arrow.svg'
import avatar from './avatar.svg'
import send_arrow from './send_arrow.svg'
import picture from './picture.svg'
import delete_img from './delete.svg'
import delete_button from './delete_button.svg'

export default {
  components: {
    Toast,
    Loading
  },
  data () {
    return {
      toast: {
        timer: '',
        message: '',
        isShowed: ''
      },
      back_arrow,
      avatar,
      send_arrow,
      picture,
      delete_img,
      delete_button,
      message_content: '',
      img_list: [],
      img_list_encoded: [],
      send_message_params: ''
    }
  },
  computed: mapState({
    secret: state => state.user.secret,
    isLoading: state => state.isLoading
  }),
  mounted() {
    // 避免高度100%被虚拟键盘顶起
    var _body = document.getElementsByTagName('body')[0]
    _body.style.height = _body.clientHeight + 'px'
  },
  methods: {
    deleteContent() {
      this.message_content = ''
    },
    deleteImg(index){
      this.img_list.splice(index, 1)
      this.img_list_encoded.splice(index, 1)
    },
    encodeImg(e) {
      if (e.target.files[0]) {
        this.$store.commit('startLoading')
        let reader = new FileReader()
        let imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)/i
        let prefixReg = /^data:image\/(bmp|cis\-cod|gif|ief|jpeg|png|tiff);base64,/gi
        let self = this
        reader.onload = function() {
          let result = this.result
          self.img_list.push(result)
          // 去除base64前缀
          let new_result = result.replace(prefixReg, '')
          // 编码
          self.img_list_encoded.push(encodeURIComponent(new_result))
          self.$store.commit('stopLoading')
        }
        // 检测是否为图片类型
        if (imgFilter.test(e.target.files[0].type)) {
          reader.readAsDataURL(e.target.files[0])
        } else {
          this.$store.commit('stopLoading')
          this.showToast('请上传图片类型')
        }
      }
    },
    sendImg() {
      // 检测信息完整性
      if (this.message_content == '') {
        this.showToast('消息内容不能为空')
        return 0
      }
      this.$store.commit('startLoading')
      if (this.img_list_encoded.length > 0) {
        let fetchs = []
        let len = this.img_list_encoded.length
        for (let i = 0; i < len; i++) {
          fetchs[i] = fetch(api + '/api/image/create', {
            method: 'post',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'janke-authorization': this.secret
            },
            body: 'image=' + this.img_list_encoded[i]
          })
        }
        Promise.all(fetchs)
          .then(async (data) => {
            for (let i = 0; i<len; i++) {
              let item = await data[i].json()
              if (this.send_message_params == '') {
                this.send_message_params += ('imageidList=' + item.content.imageid)
              } else {
                this.send_message_params += ('&imageidList=' + item.content.imageid)
              }
            }
            this.sendMessage()
          })
          .catch(err => {
            console.log(err)
            this.showToast('图片上传失败')
          })
      } else {
        this.sendMessage()
      }
    },
    sendMessage() {
      let params = this.send_message_params
      if (params == '') {
        params += ('lid=' + this.$route.params.area + '&content=' + this.message_content)
      } else {
        params += ('&lid=' + this.$route.params.area + '&content=' + this.message_content)
      }
      fetch(api + '/api/message/create', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.secret
        },
        body: params
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        this.$store.commit('stopLoading')
        this.$router.push('/app/home')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
        this.showToast('上传失败')
      })
    },
    showToast(message) {
      if (this.toast.timer != '') {
        clearTimeout(this.toast.timer)
      }
      this.toast.isShowed = true
      this.toast.message = message
      this.toast.timer = setTimeout(() => {
        this.toast.isShowed = false
      }, 1200)
    }
  }
}
</script>

<style lang="scss" scoped>
#create_message {
  width: 100%;
  height: 100%;
  position: relative;
  header {
    height: 1.4rem;
    border-bottom: 1px solid #D6D6D6;
    background: white;
    position: relative;
    display: flex;
    align-items: center;
    .back_arrow img {
      width: 0.54rem;
      height: 0.54rem;
      margin-left: 0.45rem;
    }
    .avatar {
      width: 0.95rem;
      height: 0.95rem;
      margin-left: 0.4rem;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .triangle {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 0;
        border-bottom: 0.18rem solid gray;
        border-left: 0.18rem solid transparent;
      }
    }
    .fakename {
      font-size: 0.45rem;
      margin-left: 0.3rem;
    }
    .send_arrow {
      position: absolute;
      width: 0.75rem;
      height: 0.75rem;
      top: 0.32rem;
      right: 0.3rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .hint {
    width: 90%;
    margin: 0 auto;
    margin-top: 0.4rem;
    font-size: 0.5rem;
  }
  .message_content {
    width: 90%;
    position: relative;
    margin: 0 auto;
    margin-top: 0.3rem;
    textarea {
      width: 100%;
      height: 6.2rem;
      font-size: 0.4rem;
      letter-spacing: 1px;
      line-height: 0.6rem;
      border: 0;
      resize: none;
      outline: 0;
    }
    .limit {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 0.4rem;
    }
  }
  footer {
    width: 100%;
    height: 1.4rem;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #D6D6D6;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    img {
      float: right;
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.7rem;
    }
    .add_img {
      margin-right: -0.5rem;
    }
    input {
      opacity: 0;
      width: 0.5rem;
      height: 0.5rem;
      margin-right: 0.7rem;
    }
  }
  .img_list {
    position: absolute;
    bottom: 1.4rem;
    height: 6rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .img_item {
      width: 2rem;
      position: relative;
      img {
        width: 100%;
        max-height: 5rem;
      }
      .delete_button img {
        position: absolute;
        width: 0.7rem;
        height: 0.7rem;
        top: -0.2rem;
        right: -0.2rem;
      }
    }
  }
}
</style>
