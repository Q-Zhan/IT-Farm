<template>
  <div id="home">
    <header>
      <div class="name">匿密</div>
      <div class="add"><img :src="add_img" @click="turnToCreateMessage"/></div>
      <div class="clear"></div>
    </header>
    <List @saveImgSrc="openImgToast"/>
    <Loading v-show="isLoading"/>
    <img-toast :src="img_toast_src" ref="img_toast"/>
  </div>
</template>

<script>
import List from '../Common/List/List.vue'
import Loading from '../Common/Loading/Loading.vue'
import ImgToast from '../Common/ImgToast/ImgToast.vue'
import add_img from './add.svg'
import { api } from '../../api'

export default {
  components: {
    List,
    Loading,
    ImgToast
  },
  data () {
    return {
      add_img,
      img_toast_src: ''
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    messageList() {
      return this.$store.state.messageList
    },
    stomp() {
      return this.$store.state.socket.stomp
    },
    uid() {
      return this.$store.state.user.uid
    },
    secret() {
      return this.$store.state.user.secret
    }
  },
  mounted() {
    if (this.messageList.length == 0) { // 第一次进入
      this.$store.dispatch('getInitializedMessageAndLocationList')
      this.connect() // 连接socket开始监听消息
    }
  },
  methods: {
    connect() {
      let sock = ''
      let stomp = ''
      if (window.WebSocket) {
        sock = new SockJS(api + "/socketServer?srect=" + this.secret)
        stomp = Stomp.over(sock)
        stomp.connect(
          { "src": "iamaheader" },
          (frame) => {
            // 在此端点接收该用户收到的聊天信息(3)
            stomp.subscribe("/user/" + this.uid + "/recive", (message) => {
              let chatMsg = JSON.parse(message.body)
              this.$store.commit('receiveChatMessage', { chatMsg })
              // 成功接收消息后要推送以确认接收(4)
              stomp.send("/socket/chat/recive", {},
                JSON.stringify({
                  'msgID': chatMsg.chatID
                })
              )
            })
            // 建立socket连接之后发送此初始化信息,获取还未接收的聊天消息
            stomp.send("/socket/chat/init", {}, null)
            this.$store.commit('connectSocket', { stomp})
          }
        )
      } else {
        alert("不支持websocket,无法使用聊天功能")
      }
    },
    openImgToast(src) {
      this.$refs.img_toast.open()
      this.img_toast_src = src
    },
    turnToCreateMessage() {
      this.$router.push('/createMessage')
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.4rem;
    background: #3A393E;
    color: white;
    .name {
      float: left;
      height: 1.4rem;
      width: 2rem;
      text-align: center;
      line-height: 1.4rem;
      font-size: 0.5rem;
    }
    .add {
      width: 1rem;
      height: 1.4rem;
      float: right;
      display: flex;
      align-items: center;
      img {
        width: 0.6rem;
        height: 0.6rem;
      }
    }
  }
  #list {
    padding-top: 1.4rem;
    padding-bottom: 1.5rem; 
  }
}
</style>