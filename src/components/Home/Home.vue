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
import { api } from '../../api'
import { SECRET } from '../../constant'
import List from '../Common/List/List.vue'
import Loading from '../Common/Loading/Loading.vue'
import ImgToast from '../Common/ImgToast/ImgToast.vue'
import add_img from './add.svg'

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
    chatList() {
      return this.$store.state.chat.chatList
    },
    uid() {
      return this.$store.state.user.uid
    },
    secret() {
      return this.$store.state.user.secret
    },
    user() {
      return this.$store.state.user
    },
    messageCondition() {
      return this.$store.state.messageCondition
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
    this.$store.commit('changeFooterChosen', {value: 'home'})
    if (this.$store.state.messageList.length == 0) {
      if (!this.$store.state.user.secret) { // 刷新页面store被清空
        if (localStorage[SECRET] && (localStorage[SECRET] != 'noAutoLogin')) { // 用户选择了自动登录
          this.$store.dispatch('getUserInfo')
          .then(() => {
            this.$store.dispatch('getMessageListAndLocationList') // 获取列表数据
            this.connect() // 连接websocket
          })
        } else {
          this.$router.push('/logo') // 跳转到首页
        }
      } else if (this.messageCondition == '全部') { // 第一次进入
        this.$store.dispatch('getMessageListAndLocationList') // 获取列表数据
        this.connect() // 连接websocket
      }
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
              console.log(chatMsg)
              this.$store.commit('receiveChatMessage', { chatMsg })
              // 成功接收消息后要推送以确认接收(4)
              stomp.send("/socket/chat/recive", {},
                JSON.stringify({
                  'msgID': chatMsg.chatID
                })
              )
            })
            stomp.subscribe('/user/' + this.user.uname + '/notice', (message) => {
              let noticeMsg = JSON.parse(message.body)
              console.log(noticeMsg)
              this.$store.commit('receiveNoticeMessage', { noticeMsg })
              // 成功接收消息后要推送以确认接收
              stomp.send('/socket/ntc/rcv', {}, 
                JSON.stringify({
                  "ntcType": noticeMsg.ntcType,
                  'id': noticeMsg.ntcBody.id
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
      this.$store.commit('changeMessageCondition', { value: item})
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
    z-index: 99;
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
        display: inline-block;
      }
      .triangle {
        position: absolute;
        top: 0.56rem;
        right: -0.32rem;
        width: 0;
        height: 0;
        border-left: 0.12rem solid transparent;
        border-right: 0.12rem solid transparent;
        border-top: 0.2rem solid white;
      }
    }
    .condition_list {
      z-index: 99;
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