<template>
  <div id="footer">
    <div class="button" @click="switchTo('home')">
      <router-link to="/app/home">
        <img :src="footerChosen=='home' ? home_chose : home"/>
        <span :style="{color: footerChosen=='home' ? '#282D33':'#A1A5A8'}">无秘</span>
      </router-link>
    </div>
    <div class="button"  @click="switchTo('chatList')">
      <router-link to="/app/chatList">
        <div class="chatList">
          <img :src="footerChosen=='chatList' ? inform_chose : inform" />
          <span :style="{color: footerChosen=='chatList' ? '#282D33':'#A1A5A8'}">消息</span>
          <div class="dot" v-show="!isAllRead"></div>
        </div>
      </router-link>
    </div>
    <div class="button"  @click="switchTo('user')">
      <router-link to="/app/user">
        <img :src="footerChosen=='user' ? user_chose : user"/>
        <span :style="{color: footerChosen=='user' ? '#282D33':'#A1A5A8'}">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import home from './home.svg'
import home_chose from './home_chose.svg'
import inform from './inform.svg'
import inform_chose from './inform_chose.svg'
import user from './user.svg'
import user_chose from './user_chose.svg'

export default {
  data () {
    return {
      home,
      home_chose,
      inform,
      inform_chose,
      user,
      user_chose
    }
  },
  computed: {
    chatList() {
      return this.$store.state.chat.chatList
    },
    newPraise() {
      return this.$store.state.socket.newPraise
    },
    newComment() {
      return this.$store.state.socket.newComment
    },
    isAllRead() {
      let chatList = this.chatList
      let len = chatList.length
      for (let i = 0; i < len; i++) {
        if(chatList[i].isRead == false) {
          return false
        }
      }
      if (this.newPraise.isRead == false || this.newComment.isRead == false) {
        return false
      }
      return true
    },
    footerChosen() {
      return this.$store.state.footerChosen
    }
  },
  mounted() {
    // this.chosen = this.$route.path.slice(5)
  },
  methods: {
    switchTo(value) {
      this.$store.commit('changeFooterChosen', {value})
    }
  }
}
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  height: 1.5rem;
  background: white;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #D6D6D6;
  display: flex;
  justify-content: space-around;
  .button {
    a {
      display: inline-block;
      width: 2rem;
      height: 1.5rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      font-size: 0.35rem;
      img {
        display: block;
        width: 0.7rem;
        height: 0.7rem;
      }
      .chatList {
        position: relative;
      }
      .dot {
        position: absolute;
        top: -0.03rem;
        right: -0.05rem;
        width: 0.25rem;
        height: 0.25rem;
        background: red;
        border-radius: 50%;
      }
    }
  }
}
</style>
