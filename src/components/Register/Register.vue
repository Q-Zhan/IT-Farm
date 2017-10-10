<template>
  <div id="register">
    <header>
      <img :src="back_arrow" @click="turnBack"/>
      <span>注册匿密</span>
    </header>
    <div class="account">
      <input type="text" placeholder="请输入6至12位英文字母、数字" v-model="account"/>
      <div class="input_bottom"></div>
    </div>
    <div class="name">
      <input type="text" placeholder="请输入您的昵称" v-model="name"/>
      <div class="input_bottom"></div>
    </div>
    <div class="password">
      <input type="password" placeholder="请输入6位以上密码" v-model="password"/>
      <div class="input_bottom"></div>
    </div>
    <div class="password_again">
      <input type="password" placeholder="请再次输入密码" v-model="password_again"/>
      <div class="input_bottom"></div>
    </div>
    <div class="button" @click="verifyInfo">
      <button>注册</button>
    </div>
    <div class="hint">
      请牢记您的密码！
    </div>
    <Toast ref="toast"/>
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
      name: '',
      password: '',
      password_again: ''
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading
  }),
  methods: {
    verifyInfo() {
      // 检测账号名
      let patt = new RegExp('^[A-Za-z0-9]+$')
      if (!patt.test(this.account) || this.account.length < 6 || this.account.length > 12) {
        this.$refs.toast.showToast('账号名不符合要求')
        return 0
      }
      // 检测密码
      if (this.password.length < 6) {
        this.$refs.toast.showToast('密码位数过少')
        return 0
      }
      // 检测密码重复
      if (this.password != this.password_again ) {
        this.$refs.toast.showToast('两次密码输入不一致')
        return 0
      }
      this.$store.dispatch('register', {
        uname: this.account,
        nname: this.name,
        passwd: this.password,
        rpasswd: this.password_again
      })
      .then((message) => {
        if (message == '注册成功') {
          this.$store.dispatch('login', {
            uname: this.account,
            passwd: this.password,
            isAutoLogin: false
          })
          .then((code) => {
            if (code == '200') {
              this.$refs.toast.showToast('登录成功')
              setTimeout(() => {
                this.$router.replace('/app/home')
              }, 800)
            } else {
              this.$router.replace('/login')
            }
          })
        } else {
          this.$refs.toast.showToast(message)
        }
      })
    },
    turnBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
#register {
  width: 100%;
  height: 100%;
  background: white;
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
  .account, .name, .password, .password_again {
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
  .hint {
    margin-top: 0.3rem;
    text-align: center;
    font-size: 0.35rem;
    color: #007ACC;
    letter-spacing: 1px;
  }
}
</style>
