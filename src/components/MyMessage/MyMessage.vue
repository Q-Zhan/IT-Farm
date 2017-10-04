<template>
  <div id="myMessage">
    <header>
      <span>我的消息</span>
      <img :src="back_arrow" class="back_arrow" @click="turnToBack"/>
    </header>
    <div id="list" ref="list">
      <div v-for="(item, index) in messageList"
           :key="item.mid" class="item" 
           :style="{ background: getBackground(index)}"
           @click="turnToDetail(index)">
        <div class="header">
          <img :src="getAvatar(index)" />
          <div class="text">
            <span :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">{{item.fake ? item.fakeName : item.user.nname}}</span><br/>
            <span>{{ item.location.locale }}</span>
          </div>
        </div>
        <div class="content">
          {{parseEmoji(index)}}
        </div>
        <div class="images">
          <img v-for="(image, image_index) in item.messageImageSet" 
               :key="image_index" 
               :src="getImageSrc(image.webPath)" 
               @error="setErrorImg" 
               @click.stop="openImgToast" />
        </div>
        <div class="footer">
          <div class="comment" :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">评论{{ item.commentCount }}</div>
          <div class="praise">
            <img :src="praise" />
            <span>{{ item.likeCount }}</span>
          </div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="nomore" v-if="noMoreMessage">没有更多信息了</div>
    </div>
    <Loading v-show="isLoading"/>
    <img-toast :src="img_toast_src" ref="img_toast"/>
  </div>
</template>

<script>
import { api } from '../../api'
import { EMOJI } from '../../constant'
import { mapState } from 'vuex'
import Loading from '../Common/Loading/Loading.vue'
import ImgToast from '../Common/ImgToast/ImgToast.vue'
import back_arrow from './back_arrow.svg'
import avatar from './avatar.svg'
import praise from './praise.svg'
import error_img from './error_img.jpg'

export default {
  components: {
    Loading,
    ImgToast
  },
  data () {
    return {
      back_arrow,
      avatar,
      praise,
      error_img,
      messageList: [],
      BgColors: [
        '#96C4E6', '#67B5A2'
      ],
      background_array: [], // true表示有颜色，false表示白色
      img_toast_src: '',
      noMoreMessage: false
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user
  }),
  mounted() {
    this.getMyMessage()
    this.addScrollListener()
  },
  methods: {
    getMyMessage() {
      this.$store.commit('startLoading')
      let time = new Date().getTime()
      return fetch(api + '/api/message/me/' + time, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        this.messageList = data.content.messageList
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    getBackground(index) {
      if (index % 2 == 0) {
        this.background_array[index] = true
        return this.BgColors[index /2 % 2]
      } else {
        this.background_array[index] = false
        return 'white'
      }
    },
    getImageSrc(webPath) {
      return api + webPath
    },
    setErrorImg(e) {
      e.target.src = this.error_img
    },
    openImgToast(e) {
      this.$refs.img_toast.open()
      this.img_toast_src = e.target.src
    },
    addScrollListener() {
      let self = this
      let list = document.getElementById('list')
      list.addEventListener('scroll', throttle(scrollHandle, 50))
      function scrollHandle() {
        if (self.noMoreMessage == true || self.isLoading == true) {
          return
        }
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 800) {
          self.getOldMessage()
        }
      }
      function throttle(func, wait = 100) {
        let context, args;
        let previous = 0;
        return function() {
          let now = +new Date();
          context = this;
          args = arguments;
          if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
          }
        }
      }
    },
    getOldMessage() {
      console.log('fetch')
      this.$store.commit('startLoading')
      let time = this.messageList[this.messageList.length - 1].tmCreated -1
      return fetch(api + '/api/message/me/' + time, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.content.messageList.length > 0) {
          this.messageList = this.messageList.concat(data.content.messageList)
        } else {
          this.noMoreMessage = true
        }
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    turnToBack() {
      this.$router.go(-1)
    },
    turnToDetail(index) {
      let mid = this.messageList[index].mid
      this.$router.push({name: 'detail', params: { mid}})
    },
    getAvatar(index) {
      if (this.messageList[index].user && this.messageList[index].user.userPic) {
        return api + this.messageList[index].user.userPic.webPath
      } else {
        return avatar
      }
    },
    parseEmoji(index) {
      let content = this.messageList[index].content
      let reg = /\[.*?\]/g
      let newStr = content.replace(reg, (matchStr) => {
        if (matchStr != '[]' && EMOJI[matchStr]) {
          return `<img src='/static/emoji/${EMOJI[matchStr]}'/>`
        }
        return matchStr
      })
      // parseEmoji函数返回undefined后再插入dom节点
      setTimeout(() => {
        let contentNode = document.getElementsByClassName('content')[index]
        contentNode.innerHTML = newStr
      }, 0)
    }
  }
}
</script>

<style lang="scss" >
#myMessage {
  width: 100%;
  height: 100%;
  header {
    width: 100%;
    height: 1.4rem;
    position: fixed;
    background: white;
    line-height: 1.4rem;
    font-size: 0.5rem;
    border-bottom: 1px solid #D6D6D6;
    text-align: center;
    .back_arrow {
      display: inline-block;
      width: 0.54rem;
      height: 0.54rem;
      position: absolute;
      left: 0.45rem;
      top: 0.42rem;
    }
  }
  .content {
    img {
      width: 0.7rem;
      height: 0.7rem;
      margin: 0 0.1rem;
    }
  }
  #list {
    padding-top: 1.4rem;
    overflow: scroll;
  }
}
</style>
