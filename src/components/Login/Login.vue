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
    <div class="autoLogin">
      <input type="radio" id="autoLogin" name="autoLogin" @click="chooseAutoLogin"/>
      <label for="autoLogin">自动登录</label>
    </div>
    <div class="button" @click="verifyInfo">
      <button>登录</button>
    </div>
    <div class="hometown_login" @click="turnToHomeTown">红满堂账号登录</div>
    <Toast  ref="toast"/>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import { SECRET } from '../../constant'
import { redirect_uri } from '../../api'
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
      password: '',
      isAutoLogin: false
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading
  }),
  mounted() {
    this.autoLogin()
  },
  methods: {
    autoLogin() {
      if (localStorage[SECRET] && (localStorage[SECRET] != 'noAutoLogin')) {
        this.$store.commit('saveSecret', { secret: localStorage[SECRET] })
        this.$store.dispatch('autoLogin')
        .then((code) => {
          console.log(code)
          if (code == '200') {
            this.$refs.toast.showToast('登录成功')
            setTimeout(() => {
              this.$router.replace('/app/home')
            }, 800)
          } else {
            this.$refs.toast.showToast('请重新登录')
            localStorage.removeItem(SECRET)
          }
        })
      }
    },
    verifyInfo() {
      // 检测账号密码
      if (this.account == '' || this.password == '') {
        this.$refs.toast.showToast('请输入账号密码')
        return 0
      }
      this.$store.dispatch('login', {
        uname: this.account,
        passwd: this.password,
        isAutoLogin: this.isAutoLogin
      })
      .then((code) => {
        if (code == '200') {
          this.$refs.toast.showToast('登录成功')
          setTimeout(() => {
            this.$router.replace('/app/home')
          }, 800)
        } else if (code == '-202') {
          this.$refs.toast.showToast('自动登录已过期')
        } else {
          this.$refs.toast.showToast('账号或密码错误')
        }
      })
    },
    chooseAutoLogin() {
      let radio = document.getElementById('autoLogin')
      this.isAutoLogin = !this.isAutoLogin
      radio.checked = this.isAutoLogin
    },
    turnBack() {
      this.$router.go(-1)
    },
    turnToHomeTown() {
      let str = ''
      for (let i = 0; i < 15; i++) {
        str = str + '' + Math.floor(Math.random() * 10 + 1)
      }
      window.location.href = `http://hometown.scau.edu.cn/open/OAuth/authorize?client_id=30&response_type=code&redirect_uri=${redirect_uri}&state=${str}&scope=`
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
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
  .account, .password {
    width: 90%;
    margin: 0 auto;
    margin-top: 0.6rem;
    input {
      width: 100%;
      height: 1rem;
      font-size: 0.5rem;
      letter-spacing: 2px;
      outline: none;
      border: 0;
      padding-left: 0.2rem;
      background: white;
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
  .autoLogin {
    width: 90%;
    height: 1rem;
    margin: 0 auto;
    margin-top: 0.1rem;
    margin-bottom: 0.5rem;
    font-size: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    #autoLogin {
      width: 0.42rem;
      height: 0.42rem;
      margin-right: 0.15rem;
    }
  }
  .button {
    width: 90%;
    margin: 0 auto;
    button {
      width: 100%;
      height: 1.3rem;
      background: #282D33;
      color: white;
      text-align: center;
      line-height: 1.3rem;
      font-size: 0.45rem;
      letter-spacing: 1px;
      border-radius: 0.1rem;
    }
  }
  .hometown_login {
    width: 90%;
    margin: 0 auto;
    margin-top: 0.4rem;
    height: 1.3rem;
    background: #C8452B;
    color: white;
    text-align: center;
    line-height: 1.3rem;
    font-size: 0.45rem;
    letter-spacing: 1px;
    border-radius: 0.1rem;
  }
}
</style>