<template>
  <div id="ChatList">
    <header>
      <span class="title">匿密</span>
    </header>
    <div class="chat_list">
      <div v-for="(item, index) in chatList" :key="index" class="chat_item" @click="turnToChat(index)">
        <div class="avatar"><img :src="avatar"/></div>
        <div class="word">
          <div class="name">{{ item.chatName }}</div>
          <div class="last_message">{{ item.message[item.message.length-1].content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from './测试图片.jpg'

export default {
  data () {
    return {
      avatar
    }
  },
  computed: {
    chatList() {
      return this.$store.state.chat.chatList
    }
  },
  methods: {
    turnToChat(index) {
      this.$router.push({ name: 'chat', params: { chatIndex: index}})
    }
  }
}
</script>

<style lang="scss" scoped>
#ChatList {
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
    overflow: auto;
    .chat_item {
      width: 100%;
      height: 2rem;
      border: 1px solid #E8E8E8;
      border-left: 0;
      border-right: 0;
      display: flex;
      align-items: center;
      .avatar {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.5rem;
        img {
          width: 100%;
          height: 100%;
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
          color: gray;
        }
      }
    }
  }
}
</style>
