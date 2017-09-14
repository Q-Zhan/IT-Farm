<template>
  <div id="home">
    <header>
      <div class="name">匿密</div>
      <div class="add"><img :src="add_img" @click="openAreaOption"/></div>
      <div class="clear"></div>
    </header>
    <div class="area_option" v-if="isAreaOptionOpend" @click="closeAreaOption">
      <div class="area_list">
        <div v-for="(item, index) in locationList" :key="item.lid" class="area_item" >
          <router-link :to="{name: 'createMessage', params: { area : item.lid }}">
            <div :style="{ borderBottom: index == locationList.length-1 ? '0' : '1px solid black'}">
              {{ item.locale }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <List :items="messages" @saveImgSrc="openImgToast"/>
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
      isAreaOptionOpend: false,
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
    locationList() {
      return this.$store.state.locationList
    },
    stomp() {
      return this.$store.state.socket.stomp
    },
    uid() {
      return this.$store.state.user.uid
    },
    secret() {
      return this.$store.state.user.secret
    },
    messages() {
      let arr = []
      let messageList = this.messageList
      for (let i = 0, len = messageList.length; i < len; i++) {
        arr[i] = {
          id: messageList[i].mid,
          name: messageList[i].isFake ? '楼主' : messageList[i].user.nname,
          area: messageList[i].location.locale,
          content: messageList[i].content,
          comment_num: messageList[i].commentCount,
          praise_num: messageList[i].likeCount,
          images: messageList[i].messageImageSet
        }
      }
      return arr
    }
  },
  mounted() {
    if (this.messageList.length == 0) { // 第一次进入
      this.$store.dispatch('getInitializedMessageAndLocationList', { page: 0 })
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
    openAreaOption() {
      this.isAreaOptionOpend = true
      // 屏蔽滚动
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    },
    closeAreaOption() {
      this.isAreaOptionOpend = false
      // 恢复滚动
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
    },
    openImgToast(src) {
      this.$refs.img_toast.open()
      this.img_toast_src = src
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
    border-bottom: 1px solid #D6D6D6;
    background: white;
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
  .area_option {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    .area_list {
      width: 2.6rem;
      position: fixed;
      z-index: 91;
      right: 0.9rem;
      top: 0.8rem;
      background: white;
      border: 1px solid gray;
      box-shadow: 0.05rem 0.05rem 0.05rem 2px gray;
      .area_item div {
        width: 80%;
        margin: 0 auto;
        height: 1.2rem;
        border-bottom: 1px solid black;
        color: #252526;
        line-height: 1.2rem;
        text-align: center;
        font-size: 0.5rem;
      }
    }
  }
  #list {
    padding-top: 1.4rem; 
  }
}
</style>