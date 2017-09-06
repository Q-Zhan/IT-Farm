<template>
  <div id="login">
    <header>
      <img :src="back_arrow" @click="turnBack"/>
      <span>登录匿密</span>
    </header>
    <div class="account">
      <input type="text" placeholder="账号" v-model="account"/>
      <div class="input_bottom"></div>
    </div>
    <div class="password">
      <input type="password" placeholder="密码" v-model="password"/>
      <div class="input_bottom"></div>
    </div>
    <div class="button" @click="verifyInfo">
      <button>登录</button>
    </div>
    <Toast  ref="toast"/>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Toast from '../Common/Toast/Toast.vue'
import Loading from '../Common/Loading/Loading.vue'
import back_arrow from './back_arrow.svg'
export default {
  components: {
    Toast,
    Loading
  },
  data () {
    return {
      back_arrow,
      account: '',
      password: ''
    }
  },
  computed: mapState({
    //'registerReply'
    isLoading: state => state.isLoading,
    loginReply: state => state.login.loginReply,
    loginToast: state => state.login.loginToast
  }),
  watch: {
    loginToast: function(newToast) {
      if (newToast == true) {
        this.$store.commit('loginToasted')
        this.$refs.toast.showToast(this.loginReply)
        if (this.loginReply == '登录成功') {
          setTimeout(() => {
            this.$router.push('/app/home')
          }, 800)
        }
      }
    }
  },
  methods: {
    verifyInfo() {
      // 检测账号密码
      if (this.account == '' || this.password == '') {
        this.$refs.toast.showToast('请输入账号密码')
        return 0
      }
      this.$store.dispatch('login', {
        uname: this.account,
        passwd: this.password
      })
    },
    turnBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  width: 100%;
  height: 100%;
  header {
    height: 1.4rem;
    border-bottom: 1px solid #D6D6D6;
    background: white;
    display: flex;
    align-items: center;
    img {
      width: 0.54rem;
      height: 0.54rem;
      margin-left: 0.45rem;
    }
    span {
      display: inline-block;
      margin-left: 0.4rem;
      font-size: 0.45rem;
      letter-spacing: 1px;
    }
  }
  .account, .password {
    width: 90%;
    margin: 0 auto;
    margin-top: 0.5rem;
    input {
      width: 100%;
      height: 1rem;
      font-size: 0.5rem;
      letter-spacing: 2px;
      outline: none;
      border: 0;
      padding-left: 0.2rem;
    }
    .input_bottom {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 0.1rem;
      border: 1px solid black;
      border-top: 0;
      margin-top: -0.1rem;
    }
  }
  .button {
    width: 90%;
    margin: 0 auto;
    button {
      width: 100%;
      height: 1.3rem;
      margin-top: 0.7rem;
      background: #282D33;
      color: white;
      text-align: center;
      line-height: 1.3rem;
      font-size: 0.45rem;
      letter-spacing: 1px;
      border-radius: 0.1rem;
    }
  }
}
</style>