<template>
  <div id="footer">
    <div class="button" @click="switchTo('home')">
      <router-link to="/home">
        <img :src="chosen=='home' ? home_chose : home"/>
        <span :style="{color: chosen=='home' ? '#282D33':'#A1A5A8'}">无秘</span>
      </router-link>
    </div>
    <div class="button" @click="switchTo('find')">
      <router-link to="/find">
        <img :src="chosen=='find' ? find_chose : find"/>
        <span :style="{color: chosen=='find' ? '#282D33':'#A1A5A8'}">发现</span>
      </router-link>
    </div>
    <div class="button"  @click="switchTo('message')">
      <router-link to="/message">
        <img :src="chosen=='message' ? message_chose : message"/>
        <span :style="{color: chosen=='message' ? '#282D33':'#A1A5A8'}">消息</span>
      </router-link>
    </div>
    <div class="button"  @click="switchTo('user')">
      <router-link to="/user">
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
import message from './message.svg'
import message_chose from './message_chose.svg'
import user from './user.svg'
import user_chose from './user_chose.svg'

export default {
  data () {
    return {
      home,
      home_chose,
      find,
      find_chose,
      message,
      message_chose,
      user,
      user_chose,
      chosen: 'home'
    }
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  .button {
    a {
      display: inline-block;
      width: 0.7rem;
      text-align: center;
      font-size: 0.35rem;
      img {
        display: block;
        width: 0.7rem;
        height: 0.7rem;
      }
    }
    
    
  }
}
</style>
