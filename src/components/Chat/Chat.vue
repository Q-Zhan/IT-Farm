<template>
  <div id="Chat">
    <header>
      <div class="back_arrow" @click="turnToBack"><img :src="back_arrow"/></div>
      <span>{{chat.chatNname}}</span>
      <div class="user" @click="turnToPersonPage"><img :src="user_img"/></div>
    </header>
    <div class="chat_list">
      <div v-for="(item, index) in message_list"
           :key="index" 
           :class="[item.position=='left' ? 'left' : 'right', 'chat_item']"
           :style="{marginBottom: index == message_list.length - 1 ? '0.35rem' : '0'}">
        <div class="avatar"><img :src="getAvatar(item.position)"/></div>
        <div class="message_content">
          {{parseEmoji(index)}}
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
import { EMOJI } from '../../constant'
import { api } from '../../api'
import back_arrow from '../commonImg/back_arrow_white.svg'
import send_arrow from '../commonImg/send_arrow.svg'
import avatar from '../commonImg/avatar.svg'
import user_img from './user.svg'

export default {
  data() {
    return {
      back_arrow,
      send_arrow,
      avatar,
      user_img,
      message: '',
      chatIndex: ''
    }
  },
  computed: {
    secret() {
      return this.$store.state.user.secret
    },
    uid() {
      return this.$store.state.user.uid
    },
    chatList() {
      return this.$store.state.chat.chatList
    },
    chat() {
      return this.chatList[this.$route.params.chatIndex]
    },
    message_list() {
      return this.chat.message
    },
    stomp() {
      return this.$store.state.socket.stomp
    },
    myAvatar() {
      return this.$store.state.user.userPic ? (api + this.$store.state.user.userPic.webPath) : this.avatar
    },
    chatAvatar() {
      return this.chat.chatAvatar ? (api + this.chat.chatAvatar) : this.avatar
    }
  },
  mounted() {
    if (!this.secret) {
      this.$router.push('/app/home')
    }
    this.chatIndex = this.$route.params.chatIndex
  },
  beforeDestroy() {
    this.$store.commit('changeChatRead', { chatIndex: this.chatIndex})
  },
  methods: {
    sendMsg() {
      let data = {
				"reciverId": this.chat.chatId,
				"message": this.message
			}
      data.msgID = sha1.hex(data + (new Date()).getTime())
      this.$store.commit('addChatMessage', {chatIndex: this.$route.params.chatIndex, content: this.message})
      this.stomp.send("/socket/chat/send", {}, JSON.stringify(data))
      this.message = ''
    },
    turnToBack() {
      this.$router.go(-1)
    },
    turnToPersonPage() {
      let uname = this.chat.chatUname
      this.$router.push({ name: 'personPage', params: { uname }})
    },
    parseEmoji(index) {
      let content = this.message_list[index].content
      let reg = /\[.*?\]/g
      let newStr = content.replace(reg, (matchStr) => {
        if (matchStr != '[]' && EMOJI[matchStr]) {
          return `<img src='/static/emoji/${EMOJI[matchStr]}'/>`
        }
        return matchStr
      })
      // parseEmoji函数返回undefined后再插入dom节点
      setTimeout(() => {
        let contentNode = document.getElementsByClassName('message_content')[index]
        contentNode.innerHTML = newStr
      }, 0)
    },
    getAvatar(position) {
      if (position == 'left') {
        return this.chatAvatar
      } else {
        return this.myAvatar
      }
    }
  }  
}
</script>

<style lang="scss">
#Chat {
  width: 100%;
  height: 100%;
  header {
    position: relative;
    height: 1.4rem;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.5rem;
    background: #3A393E;
    color: white;
    border-bottom: 1px solid #D6D6D6;
    .back_arrow {
      width: 0.54rem;
      height: 0.54rem;
      position: absolute;
      top: 0.1rem;
      left: 0.45rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user {
      position: absolute;
      width: 0.7rem;
      height: 0.65rem;
      top: 0.14rem;
      right: 0.4rem;
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
        img {
          width: 0.7rem;
          height: 0.7rem;
          margin: 0 0.05rem;
          vertical-align: sub;
        }
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
