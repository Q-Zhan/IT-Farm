<template>
  <div id="create_message">
    <header>
      <div class="back_arrow">
        <router-link to="/app/home">
          <img :src="back_arrow"/>
        </router-link>
      </div>
      <div class="avatar">
        <img :src="getAvatar()"/>
        <div class="triangle"></div>
      </div>
      <div class="fakename">{{name}}</div>
      <div class="send_arrow"><img :src="send_arrow" @click="sendImg"/></div>
      <div class="location" @click="openPicker">
        <span>{{choseValue}}</span>
        <div class="triangle"></div>
      </div>
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
      <div :class="['fake_button', isFake ? 'faked' : '']" @click="changeIsFake" >
        匿名
      </div>
      <div class="button">
        <input type="file" @change="encodeImg" accept=""/>
        <img :src="picture" class="add_img"/>
        <img :src="delete_img" class="delete" @click="deleteContent"/>
      </div>
    </footer>
    <Toast ref="toast"/>
    <Loading v-show="isLoading"/>
    <picker v-model="isPickerShowed" :data-items="pickerItems" @change="changePickerValue">
      <div class="top-content" slot="top-content" >
        <span @click="closePicker">取消</span>
        <span @click="closePicker">确定</span>
      </div>
    </picker>
  </div>
</template>

<script>
import { api } from '../../api'
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
      back_arrow,
      avatar,
      send_arrow,
      picture,
      delete_img,
      delete_button,
      message_content: '',
      img_list: [],
      img_list_encoded: [],
      send_message_params: '',
      isFake: false,
      isPickerShowed: false,
      pickerItems: [],
      choseValue: '图书馆'
    }
  },
  computed: mapState({
    user: state => state.user,
    secret: state => state.user.secret,
    isLoading: state => state.isLoading,
    locationList: state => state.locationList,
    messageCondition: state => state.messageCondition,
    name() {
      return this.isFake ? '匿名' : this.user.nname
    }
  }),
  mounted() {
    if (!this.user.secret) {
      this.$router.go(-1)
    }
    // 避免高度100%被虚拟键盘顶起
    let _body = document.getElementsByTagName('body')[0]
    _body.style.height = _body.clientHeight + 'px'
  },
  beforeDestroy() {
    let _body = document.getElementsByTagName('body')[0]
    _body.style.height = '100%'
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
        let img_size = e.target.files[0].size / 1024
        let reader = new FileReader()
        let imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)/i
        let prefixReg = /^data:image\/(bmp|cis\-cod|gif|ief|jpeg|png|tiff);base64,/gi
        let self = this
        reader.onload = function() {
          let result = this.result
          // 压缩图片
          let cvs = document.createElement('canvas')
          let ctx = cvs.getContext('2d')
          let img = new Image()
          img.onload = () => {
            // 如果图片大小大于300k
            if (img_size >= 300) {
              let compress_proportion = 300 / img_size
              cvs.width = img.width
              cvs.height = img.height
              ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
              result = cvs.toDataURL('image/jpeg', compress_proportion)
            }
            self.img_list.push(result)
            // 去除base64前缀
            let new_result = result.replace(prefixReg, '')
            // 编码
            self.img_list_encoded.push(encodeURIComponent(new_result))
            self.$store.commit('stopLoading')
            // 清空value以便传同一文件时可以触发input的change事件
            e.target.value = ''
          }
          img.src = result
        }
        // 检测是否为图片类型
        if (imgFilter.test(e.target.files[0].type)) {
          reader.readAsDataURL(e.target.files[0])
        } else {
          this.$store.commit('stopLoading')
          e.target.value = ''
          this.$refs.toast.showToast('请上传图片类型')
        }
      }
    },
    sendImg() {
      // 检测信息完整性
      if (this.message_content == '') {
        this.$refs.toast.showToast('消息内容不能为空')
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
              this.send_message_params += ('imageidList=' + item.content.imageid + '&')
            }
            this.sendMessage()
          })
          .catch(err => {
            console.log(err)
            this.$refs.toast.showToast('图片上传失败')
          })
      } else {
        this.sendMessage()
      }
    },
    sendMessage() {
      let params = this.send_message_params
      let lid = ''
      for (let i = 0, len = this.locationList.length; i < len; i++) {
        if (this.locationList[i].locale == this.choseValue) {
          lid = this.locationList[i].lid
        }
      }
      params += ('lid=' + lid + '&content=' + this.message_content)
      if (this.isFake) {
        params += ('&isFake=' + this.isFake)
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
        this.$store.commit('stopLoading')
        this.$store.dispatch('getNewMessage', {condition: this.messageCondition, isLoading: true})
        this.$router.push('/app/home')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
        this.$refs.toast.showToast('上传失败')
      })
    },
    changeIsFake() {
      this.isFake = !this.isFake
    },
    openPicker() {
      let data = this.locationList.map((item) => {
        return item.locale
      })
      this.pickerItems = [{
        values: data
      }]
      this.isPickerShowed = true
    },
    changePickerValue(value) {
      if (value) {
        this.choseValue = value
      } else {
        this.choseValue = this.locationList[0].locale
      }
    },
    closePicker() {
      this.isPickerShowed = false
    },
    getAvatar() {
      if ((!this.isFake) && this.user.userPic) {
        return api + this.user.userPic.webPath
      } else {
        return avatar
      }
    }
  }
}
</script>

<style lang="scss">
#create_message {
  width: 100%;
  height: 100%;
  position: relative;
  .top-content {
    height: 1.3rem;
    line-height: 1.3rem;
    background: white;
    font-size: 0.5rem;
    letter-spacing: 2px;
    display: flex;
    justify-content: space-between;
    span {
      padding: 0 0.3rem;
    }
    span:nth-of-type(2) {
      color: #007ACC;
    }
  }
  .picker-backdrop {
    overflow: hidden;
  }
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
    .location {
      position: absolute;
      right: 1.6rem;
      top: 0.42rem;
      font-size: 0.4rem;
      letter-spacing: 1px;
      .triangle {
        display: inline-block;
        margin-left: -0.1rem;
        width: 0;
        height: 0;
        border-left: 0.15rem solid transparent;
        border-right: 0.15rem solid transparent;
        border-top: 0.2rem solid #007ACC;
        vertical-align: middle;
      }
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
    justify-content: space-between;
    .fake_button {
      font-size: 0.53rem;
      margin-left: 0.5rem;
      letter-spacing: 0.05rem;
    }
    .faked {
      font-size: 0.55rem;
      color: #007ACC;
    }
    .button {
      position: relative;
      margin-right: 0.5rem;
      .add_img {
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
        vertical-align: middle;
        margin-right: 1.2rem;
      }
      input {
        position: absolute;
        opacity: 0;
        width: 0.6rem;
        height: 0.6rem;
        padding: 0;
        left: -0.5rem;
        top: 0;
      }
      .delete {
        width: 0.6rem;
        height: 0.6rem;
        vertical-align: middle;
      }
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
