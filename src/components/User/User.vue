<template>
  <div id="user">
    <header>
      <span>匿密</span>
    </header>
    <div class="bg">
      <div class="user_info">
        <img :src="avatar" class="avatar"/>
        <div class="word">
          <span>Z.</span>
          <span>账号：a380776762314</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from './avat.svg'

export default {
  data () {
    return {
      avatar
    }
  }
}
</script>

<style lang="scss" scoped>
#user {
  width: 100%;
  height: 100%;
  header {
    width: 100%;
    height: 1.4rem;
    line-height: 1.4rem;
    font-size: 0.5rem;
    border-bottom: 1px solid #D6D6D6;
    background: white;
    span {
      display: inline-block;
      width: 2rem;
      text-align: center;
    }
  }
  .bg {
    height: calc(100% - 1.4rem);
    width: 100%;
    background: #EBEBEB;
    display: inline-block;
    .user_info {
      height: 2rem;
      background: white;
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      .avatar {
        width: 1.6rem;
        height: 1.6rem;
        margin-left: 0.45rem;
      }
      .word {
        width: 4rem;
        height: 2rem;
        margin-left: 0.5rem;
        display: flex;
        align-items: center;
        align-content: center;
        flex-wrap: wrap;
        span {
          flex: 0 0 5rem;
          white-space:nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span:nth-of-type(1) {
          font-size: 0.45rem;
          display: inline-block;
          margin-bottom: 0.1rem;
        }
        span:nth-of-type(2) {
          font-size: 0.36rem;
          color: gray;
        }
      }
    }
  }
}
</style>
