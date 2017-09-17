<template>
  <div id="user">
    <header>
      <span>匿密</span>
    </header>
    <div class="bg">
      <div class="user_info" @click="turnToUserDeatil">
        <img :src="avatar" class="avatar"/>
        <div class="word">
          <span>{{ user.nname }}</span>
          <span>账号：{{ user.uname }}</span>
        </div>
      </div>
      <div class="logout" @click="logout">
        退出登录
      </div>
    </div>
  </div>
</template>

<script>
import avatar from './avat.svg'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      avatar,
      aa: 0
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user,
    secret: state => state.user.secret
  }),
  watch: {
    secret: function(newValue) {
      console.log(newValue)
      // if (newValue == '注销') {
      //   this.$router.push('/logo')
      // }
    },
    aa: function(newValue) {
      if (newValue == '') {
        this.$router.push('/logo')
      }
    }
  },
  methods: {
    turnToUserDeatil() {
      this.$router.push('/userDetail')
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.replace('/logo')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#user {
  width: 100%;
  header {
    width: 100%;
    height: 1.4rem;
    line-height: 1.4rem;
    font-size: 0.5rem;
    border-bottom: 1px solid #D6D6D6;
    background: #3A393E;
    color: white;
    span {
      display: inline-block;
      width: 2rem;
      text-align: center;
    }
  }
  .bg {
    height: calc(100% - 1.4rem);
    overflow: auto;
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
    .logout {
      width: 100%;
      height: 1rem;
      margin-top: 0.5rem;
      background: #EA2000;
      line-height: 1rem;
      font-size: 0.45rem;
      color: white;
      text-align: center;
    }
  }
}
</style>
