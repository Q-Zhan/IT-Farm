<template>
  <div id="ChatList">
    <header>
      <span class="title">匿密</span>
    </header>
    <div class="chat_list">
      <div class="new_comment" @click="turnToNewComment">
        <div class="bg">
          <img :src="new_comment"/>
          <div class="dot" v-show="!newComment.isRead"></div>
        </div>
        <div class="word">新评论</div>
      </div>
      <div class="new_praise" @click="turnToNewPraise">
        <div class="bg">
          <img :src="new_praise"/>
          <div class="dot" v-show="!newPraise.isRead"></div>
        </div>
        <div class="word">新点赞</div>
      </div>
      <div v-for="(item, index) in chatList" :key="index" class="chat_item" @click="turnToChat(index)">
        <div class="avatar">
          <img :src="getAvatar(index)"/>
          <div class="dot" v-show="!item.isRead"></div>
        </div>
        <div class="word">
          <div class="name">{{ item.chatNname }}</div>
          <div class="last_message">{{ parseEmoji(index)}}</div>
        </div>
        <div class="time">
          {{ formatTime(item.message[item.message.length-1].time) }}
        </div>
      </div>
    </div>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import Loading from '../Common/Loading/Loading.vue'
import avatar from './avatar.svg'
import new_comment from './new_comment.svg'
import new_praise from './new_praise.svg'
import { api } from '../../api'
import { EMOJI } from '../../constant'

export default {
  components: {
    Loading
  },
  data () {
    return {
      avatar,
      new_comment,
      new_praise,
      avatarList: []
    }
  },
  computed: {
    chatList() {
      return this.$store.state.chat.chatList
    },
    isLoading() {
      return this.$store.state.isLoading
    },
    newPraise() {
      return this.$store.state.socket.newPraise
    },
    newComment() {
      return this.$store.state.socket.newComment
    },
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    if (!this.user.secret) {
      this.$router.push('/app/home')
    }
    this.getAvatar()
  },
  methods: {
    turnToChat(index) {
      this.$router.push({ name: 'chat', params: { chatIndex: index}})
    },
    formatTime(time) {
      let timeStamp = new Date(time)
      let hour = timeStamp.getHours()
      let minute = timeStamp.getMinutes()
      if (hour > 18) {
        hour = '晚上' + (hour - 12)
      } else if (hour > 12) {
        hour = '下午' + (hour - 12)
      } else {
        hour = '上午' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      return hour + ':' + minute
    },
    parseEmoji(index) {
      let item = this.chatList[index]
      let content = item.message[item.message.length-1].content
      let reg = /\[.*?\]/g
      let newStr = content.replace(reg, (matchStr) => {
        if (matchStr != '[]' && EMOJI[matchStr]) {
          return `<img src='/static/emoji/${EMOJI[matchStr]}'/>`
        }
        return matchStr
      })
      // parseEmoji函数返回undefined后再插入dom节点
      setTimeout(() => {
        let contentNode = document.getElementsByClassName('last_message')[index]
        contentNode.innerHTML = newStr
      }, 0)
    },
    getAvatar(index) {
      if (this.chatList[index]) {
        if (this.chatList[index].chatAvatar) {
          return api + this.chatList[index].chatAvatar
        } else {
          if (this.avatarList[index]) {
            return this.avatar
          }
          this.$store.dispatch('getChatAvatar', {uname: this.chatList[index].chatUname, index})
          .then((data) => {
            if (data != 'avatar') {
              return api + data
            } else {
              return this.avatar
            }
          })
          this.avatarList[index] = true   
        }
      } else {
        return this.avatar
      }
      
    },
    turnToNewComment() {
      this.$store.commit('changeNoticeRead', { type: 'comment'})
      this.$router.push({ name: 'notice', params: { type: 'comment'}})
    },
    turnToNewPraise() {
      this.$store.commit('changeNoticeRead', { type: 'praise'})
      this.$router.push({ name: 'notice', params: { type: 'praise'}})
    }    
  }
}
</script>

<style lang="scss">
#ChatList {
  position: relative;
  header {
    height: 1.4rem;
    background: #3A393E;
    .title {
      display: inline-block;
      width: 2rem;
      height: 1.4rem;
      text-align: center;
      line-height: 1.4rem;
      color: white;
      font-size: 0.5rem;
      letter-spacing: 1px;
    }
  }
  .chat_list {
    height: calc(100% - 1.4rem);
    overflow: scroll;
    position: relative;
    .new_comment, .new_praise {
      width: 100%;
      height: 2rem;
      border-bottom: 1px solid #E8E8E8;
      display: flex;
      align-items: center;
      position: relative;
      .bg {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.5rem;
        border-radius: 50%;
        position: relative;
        background: #2EBB84;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 0.84rem;
          height: 0.84rem;
        }
        .dot {
          position: absolute;
          top: -0.15rem;
          right: -0.15rem;
          width: 0.3rem;
          height: 0.3rem;
          background: red;
          border-radius: 50%;
        }
      }
      .word {
        height: 1.5rem;
        margin-left: 0.4rem;
        line-height: 1.5rem;
        font-size: 0.52rem;
      }
    }
    .new_praise {
      .bg {
        background: #FBA504;
        img {
          width: 0.9rem;
          height: 0.9rem;
        }
      }
    }
    .chat_item {
      width: 100%;
      height: 2rem;
      border: 1px solid #E8E8E8;
      border-left: 0;
      border-right: 0;
      display: flex;
      align-items: center;
      position: relative;
      .avatar {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.5rem;
        border-radius: 50%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .dot {
          position: absolute;
          top: -0.15rem;
          right: -0.15rem;
          width: 0.3rem;
          height: 0.3rem;
          background: red;
          border-radius: 50%;
        }
      }
      .word {
        margin-left: 0.4rem;
        height: 1.5rem;
        .name, .last_message {
          max-width: 6rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .name {
          font-size: 0.52rem;
          margin-top: 0.05rem;
        }
        .last_message {
          font-size: 0.4rem;
          margin-top: 0.16rem;
          color: gray;
          img {
            width: 0.5rem;
            height: 0.5rem;
            margin: 0 0.08rem;
          }
        }
      }
      .time {
        height: 1.5rem;
        position: absolute;
        top: 0.35rem;
        right: 0.25rem;
        font-size: 0.4rem;
        color: gray;
      }
    }
  }

}
</style>
