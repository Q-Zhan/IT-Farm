<template>
  <div id="footer">
    <div class="button" @click="switchTo('home')">
      <router-link to="/app/home">
        <img :src="chosen=='home' ? home_chose : home"/>
        <span :style="{color: chosen=='home' ? '#282D33':'#A1A5A8'}">无秘</span>
      </router-link>
    </div>
    <div class="button" @click="switchTo('find')">
      <router-link to="/app/find">
        <img :src="chosen=='find' ? find_chose : find"/>
        <span :style="{color: chosen=='find' ? '#282D33':'#A1A5A8'}">发现</span>
      </router-link>
    </div>
    <div class="button"  @click="switchTo('chatList')">
      <router-link to="/app/chatList">
        <div class="chatList">
          <img :src="chosen=='chatList' ? chat_chose : chat" />
          <span :style="{color: chosen=='chatList' ? '#282D33':'#A1A5A8'}">消息</span>
          <div class="dot" v-show="!isAllChatRead"></div>
        </div>
      </router-link>
    </div>
    <div class="button"  @click="switchTo('user')">
      <router-link to="/app/user">
        <img :src="chosen=='user' ? user_chose : user"/>
        <span :style="{color: chosen=='user' ? '#282D33':'#A1A5A8'}">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import home from './home.svg'
import home_chose from './home_chose.svg'
import find from './find.svg'
import find_chose from './find_chose.svg'
import chat from './message.svg'
import chat_chose from './message_chose.svg'
import user from './user.svg'
import user_chose from './user_chose.svg'

export default {
  data () {
    return {
      home,
      home_chose,
      find,
      find_chose,
      chat,
      chat_chose,
      user,
      user_chose,
      chosen: ''
    }
  },
  computed: {
    chatList() {
      return this.$store.state.chat.chatList
    },
    isAllChatRead() {
      let chatList = this.chatList
      let len = chatList.length
      for (let i = 0; i < len; i++) {
        if(chatList[i].isRead == false) {
          return false
        }
      }
      return true
    }
  },
  mounted() {
    this.chosen = this.$route.path.slice(5)
  },
  methods: {
    switchTo(value) {
      this.chosen = value
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
        top: -0.1rem;
        right: -0.1rem;
        width: 0.3rem;
        height: 0.3rem;
        background: red;
        border-radius: 50%;
      }
    }
  }
}
</style>
