<template>
  <div id="home">
    <header>
      <div class="add"><img :src="add_img" @click="turnToCreateMessage"/></div>
      <div class="message_condition">
        <span @click="triggerConditionList">
          {{messageCondition}}
          <div class="triangle"></div>
        </span>
      </div>
      <div class="condition_list" v-show="isConditionListShowed">
        <div v-for="(item, index) in conditionList" 
             :key="index" 
             @click="closeConditionList(item)"
             :style="{borderWidth: index == conditionList.length-1 ? '0' : '1px'}">
          {{ item }}
        </div>
      </div>
      <div class="clear"></div>
    </header>
    <List @saveImgSrc="openImgToast" :messageCondition="messageCondition"/>
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
      img_toast_src: '',
      messageCondition: '全部',
      isConditionListShowed: false
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
    },
    conditionList() {
      let arr = ['全部']
      this.$store.state.locationList.forEach(function(element) {
        arr.push(element.locale)
      })
      arr.push('我的关注')
      return arr
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
    },
    triggerConditionList() {
      this.isConditionListShowed = !this.isConditionListShowed
    },
    closeConditionList(item) {
      this.messageCondition = item
      this.isConditionListShowed = false
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
    .message_condition {
      position: absolute;
      height: 1.4rem;
      width: 3rem;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      line-height: 1.4rem;
      font-size: 0.5rem;
      text-align: center;
      letter-spacing: 0.1rem;
      span {
        position: relative;
      }
      .triangle {
        position: absolute;
        top: 0.24rem;
        right: -0.32rem;
        width: 0;
        height: 0;
        border-left: 0.12rem solid transparent;
        border-right: 0.12rem solid transparent;
        border-top: 0.2rem solid white;
      }
    }
    .condition_list {
      position: absolute;
      top: 1.4rem;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      font-size: 0.5rem;
      color: black;
      text-align: center;
      padding: 0.1rem 0.2rem;
      border: 1px solid #888888;
      border-top: 0;
      box-shadow: 0.04rem 0.04rem 0.02rem #888888;
      div {
        border-bottom: 1px solid #DDDDDD;
        padding: 0.2rem 0;
      }
    }
  }
  #list {
    padding-top: 1.4rem;
    padding-bottom: 1.5rem; 
  }
}
</style>