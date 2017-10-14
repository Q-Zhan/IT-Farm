<template>
  <div id="HometownBind">
    <header>
      <img :src="back_arrow" @click="turnToLogin"/>
      <span>匿密</span>
    </header>
    <div class="form">
      <div class="login_form" v-if="isloginFromShowed">
        <div class="account">
          <input type="text" placeholder="账号" v-model="loginAccount" />
          <div class="input_bottom"></div>
        </div>
        <div class="password">
          <input type="password" placeholder="密码" v-model="loginPassword" />
          <div class="input_bottom"></div>
        </div>
        <div class="autoLogin">
          <div class="hint" @click="changeForm('login')">
            新建并绑定匿密账号
          </div>
          <div>
            <input type="radio" id="autoLogin" name="autoLogin" @click="chooseAutoLogin" />
            <label for="autoLogin">自动登录</label>
          </div>
        </div>
        <div class="button" @click="verifyLoginInfo">
          <button>登录并绑定</button>
        </div>
      </div>
      <div class="register_form" v-if="isRegisterFromShowed">
        <div class="account">
          <input type="text" placeholder="请输入6至12位英文字母、数字" v-model="registerAccount" />
          <div class="input_bottom"></div>
        </div>
        <div class="name">
          <input type="text" placeholder="请输入您的昵称" v-model="registerName" />
          <div class="input_bottom"></div>
        </div>
        <div class="password">
          <input type="password" placeholder="请输入6位以上密码" v-model="registerPassword" />
          <div class="input_bottom"></div>
        </div>
        <div class="password_again">
          <input type="password" placeholder="请再次输入密码" v-model="registerPasswordAgain" />
          <div class="input_bottom"></div>
        </div>
        <div class="hint" @click="changeForm('register')">绑定已有的匿密账号</div>
        <div class="button" @click="verifyRegisterInfo">
          <button>注册并绑定</button>
        </div>
      </div>
    </div>
    <Toast  ref="toast"/>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import back_arrow from '../commonImg/back_arrow.svg'
import { api_scau, api, redirect_uri } from '../../api'
import Toast from '../Common/Toast/Toast.vue'
import Loading from '../Common/Loading/Loading.vue'

export default {
  components: {
    Toast,
    Loading
  },
  data () {
    return {
      back_arrow,
      hometownUid: '',
      loginAccount: '',
      loginPassword: '',
      registerAccount: '',
      registerName: '',
      registerPassword: '',
      registerPasswordAgain: '',
      isAutoLogin: false,
      isloginFromShowed: true,
      isRegisterFromShowed: false,
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  mounted() {
    this.testIfBinded()
  },
  methods: {
    testIfBinded() {
      this.$store.commit('startLoading')
      let code = this.$route.query.code
      fetch(api_scau + '/api/OAuth2/request.info', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `code=${code}&redirectUri=${redirect_uri}`
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.content.secret) { // 红满堂账号已经绑定了匿密账号
          this.$store.commit('saveUserInfo', data.content.user)
          this.$store.commit('saveSecret', { secret: data.content.secret })
          this.$store.commit('stopLoading')
          this.$router.push('/app/home')
        } else {
          this.hometownUid = data.content.uid
        }
        this.$store.commit('stopLoading')
      })
      .catch((err) => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    changeForm(value) {
      if (value == 'login') {
        this.isloginFromShowed = false
        this.isRegisterFromShowed = true
      } else {
        this.isloginFromShowed = true
        this.isRegisterFromShowed = false
      }
    },
    chooseAutoLogin() {
      let radio = document.getElementById('autoLogin')
      this.isAutoLogin = !this.isAutoLogin
      radio.checked = this.isAutoLogin
    },
    verifyLoginInfo() {
      // 检测账号密码
      if (this.loginAccount == '' || this.loginPassword == '') {
        this.$refs.toast.showToast('请输入账号密码')
        return 0
      }
      this.$store.dispatch('hometownLogin', {
        uname: this.loginAccount,
        passwd: this.loginPassword,
        hmtUid: this.hometownUid,
        isAutoLogin: this.isAutoLogin
      })
      .then((code) => {
        if (code == '200') {
          this.$refs.toast.showToast('登录成功')
          setTimeout(() => {
            this.$router.replace('/app/home')
          }, 800)
        } else {
          this.$refs.toast.showToast('账号或密码错误')
        }
      })
    },
    verifyRegisterInfo() {
      // 检测账号名
      let patt = new RegExp('^[A-Za-z0-9]+$')
      if (!patt.test(this.registerAccount) || this.registerAccount.length < 6 || this.registerAccount.length > 12) {
        this.$refs.toast.showToast('账号名不符合要求')
        return 0
      }
      // 检测密码
      if (this.registerPassword.length < 6) {
        this.$refs.toast.showToast('密码位数过少')
        return 0
      }
      // 检测密码重复
      if (this.registerPassword != this.registerPasswordAgain ) {
        this.$refs.toast.showToast('两次密码输入不一致')
        return 0
      }
      this.$store.dispatch('hometownRegister', {
        uname: this.registerAccount,
        nname: this.registerName,
        passwd: this.registerPassword,
        rpasswd: this.registerPasswordAgain,
        hmtUid: this.hometownUid
      })
      .then((code) => {
        if (code == 200) {
          this.$refs.toast.showToast('注册成功')
        } else {
          this.$refs.toast.showToast('注册失败')
        }
      })
    },
    turnToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss">
#HometownBind {
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
  .form {
    width: 100%;
    .login_form {
      .account,.password {
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
        margin-top: 0.2rem;
        margin-bottom: 0.5rem;
        font-size: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        #autoLogin {
          width: 0.42rem;
          height: 0.42rem;
          margin-right: 0.15rem;
        }
        .hint {
          color: #007ACC;
          letter-spacing: 1px;
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
    }
    .register_form {
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
      .hint {
        width: 90%;
        margin: 0 auto;
        margin-top: 0.4rem;
        color: #007ACC;
        font-size: 0.4rem;
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
  }
}
</style>
