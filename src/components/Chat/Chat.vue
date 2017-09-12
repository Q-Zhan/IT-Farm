<template>
  <div id="Chat">
    <header>
      <div class="img" @click="turnBack"><img :src="back_arrow"/></div>
      <span>{{receiverName}}</span>
    </header>
    <div class="chat_list">
      <div v-for="(item, index) in message_list"
           :key="index" 
           :class="[item.position=='left' ? 'left' : 'right', 'chat_item']"
           :style="{marginBottom: index == message_list.length - 1 ? '0.35rem' : '0'}">
        <div class="avatar"><img :src="avatar"/></div>
        <div class="message_content">
          {{item.content}}
          <div class="triangle"></div>
        </div>
        <div class="clear"></div>
      </div>
    </div>
    <footer>
      <div class="message_input">
        <input type="text" v-model="message"/>
      </div>
      <div class="send_arrow" @click="sendMsg">
        <img :src="send_arrow"/>
      </div>
      <div class="clear"></div>
    </footer>
  </div>
</template>

<script>
import back_arrow from './back_arrow.svg'
import send_arrow from './send_arrow.svg'
import avatar from './avatar.svg'

export default {
  data() {
    return {
      back_arrow,
      send_arrow,
      avatar,
      message_list: [
        
      ],
      message: '',
      stomp: ''
    }
  },
  computed: {
    secret() {
      return this.$store.state.user.secret
    },
    uid() {
      return this.$store.state.user.uid
    },
    receiverId() {
      return this.$store.state.chat.receiverId
    },
    receiverName() {
      return this.$store.state.chat.receiverName
    }
  },
  mounted() {
    this.connect()
  },
  methods: {
    connect() {
      let sock = ''
      let stomp = ''
      if (window.WebSocket) {
        this.$store.commit('startLoading')
        sock = new SockJS("http://104.224.174.146:8080/Mimi-2.0/socketServer?srect=" + this.secret)

        stomp = this.stomp =  Stomp.over(sock)
        stomp.connect(
          { "src": "iamaheader" },
          (frame) => {
            // console.info("Connected: " + frame)
            // 成功发送消息后会在此端点接收到来自服务器的推送(2)
            stomp.subscribe("/user/queue/send/status", (message) => {
              // console.info("send status: " + message)
            })
            // 在此端点接收该用户收到的聊天信息(3)
            stomp.subscribe("/user/" + this.uid + "/recive", (message) => {
              let chatMsg = JSON.parse(message.body)
              // console.warn(chatMsg.content)
              this.message_list.push({
                position: 'left',
                content: chatMsg.content
              })
              this.reciveMsg(chatMsg.chatID)
            })
            // 成功发送确认接收消息后会在此端点接收到来自服务器的推送(5)
            stomp.subscribe("/user/queue/recive/status", (message) => {
              // console.info("recive status: " + message)
            })
            // 订阅用户的错误通知
            stomp.subscribe("/user/queue/status", (message) => {
              // console.info("exception: " + message)
            })
            this.$store.commit('stopLoading')
            this.sendInit()
          }
        )
      } else {
        alert("您的浏览器不支持websocket")
        this.$router.go(-1)
      }
    },
    sendInit() {
      // 建立socket连接之后发送此初始化信息,获取还未接收的聊天消息
      this.stomp.send("/socket/chat/init", {}, null)
    },
    reciveMsg(chatId) {
      // 成功接收消息后要推送以确认接收(4)
      this.stomp.send("/socket/chat/recive", {},
				JSON.stringify({
          'msgID': chatId
        })
      )
    },
    sendMsg() {
      let data = {
				"reciverId": this.receiverId,
				"message": this.message
			}
      data.msgID = sha1.hex(data + (new Date()).getTime())
      this.message_list.push({
        position: 'right',
        content: this.message
      })
      this.stomp.send("/socket/chat/send", {}, JSON.stringify(data))
      this.message = ''
    },
    turnBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
#Chat {
  width: 100%;
  height: 100%;
  header {
    position: relative;
    height: 1.4rem;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.4rem;
    background: #FAFAFA;
    border-bottom: 1px solid #D6D6D6;
    .img {
      width: 0.54rem;
      height: 0.5rem;
      position: absolute;
      top: 0.1rem;
      left: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .chat_list {
    width: 100%;
    height: calc(100% - 1.4rem - 1.4rem);
    overflow: auto;
    overflow-x: hidden;
    background: #ECECEC;
    .chat_item {
      width: 100%;
      margin-top: 0.3rem;
      .avatar {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        vertical-align: top;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .message_content {
        display: inline-block;
        position: relative;
        border-radius: 0.15rem;
        max-width: 6rem;
        background: white;
        font-size: 0.45rem;
        text-align: justify;
        letter-spacing: 1px;
        line-height: 0.75rem;
        padding: 0.15rem 0.3rem;
        margin-left: 0.25rem;
        .triangle {
          position: absolute;
          top: 0.35rem;
          width: 0;
          height: 0;
          border-top: 0.18rem solid transparent;
          border-right: 0.24rem solid white;
          border-bottom: 0.18rem solid transparent;
        }
      }
    }
    .left {
      float: left;
      padding-left: 0.2rem;
      .message_content {
        .triangle {
          left: -0.2rem;
        }
      }
    }
    .right {
      float: right;
      padding-right: 0.2rem;
      .avatar {
        float: right;
      }
      .message_content {
        float: right;
        margin-left: 0;
        margin-right: 0.25rem;
        background: #98E165;
        .triangle {
          right: -0.2rem;
          border: 0;
          border-top: 0.18rem solid transparent;
          border-left: 0.24rem solid #98E165;
          border-bottom: 0.18rem solid transparent;
        }
      }
    }
  }
  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.4rem;
    border-top: 1px solid #D6D6D6;
    background: #FAFAFA;
    .message_input {
      width: 7.7rem;
      height: 0.7rem;
      float: left;
      margin: 0.4rem 0 0 0.5rem;
      border-radius: 0.3rem;
      input {
        width: 7.7rem;
        height: 0.7rem;
        font-size: 0.5rem;
        outline: none;
        border: 1px solid #EFEFEF;
        padding-left: 0.15rem;
      }
    }
    .send_arrow {
      float: left;
      width: 0.75rem;
      height: 0.75rem;
      margin: 0.4rem 0 0 0.6rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
