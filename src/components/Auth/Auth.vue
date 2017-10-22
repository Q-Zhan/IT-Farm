<template>
  <div id="Auth">
    <header>
      <span>校园认证</span>
      <router-link :to="'/app/user'"><img :src="back_arrow" class="back_arrow"/></router-link>
    </header>
    <div class="account">
      <input type="text" placeholder="学号" v-model="account"/>
      <div class="input_bottom"></div>
    </div>
    <div class="password">
      <input type="password" placeholder="密码" v-model="password"/>
      <div class="input_bottom"></div>
    </div>
    <div class="code">
      <input type="text" placeholder="验证码" v-model="code" maxlength="4"/>
      <img :src="code_img" @click="getCode"/>
      <div class="input_bottom"></div>
    </div>
    <div class="button" @click="verifyInfo">
      <button>认证</button>
    </div>
    <Loading v-show="isLoading"/>
    <Toast  ref="toast"/>
  </div>
</template>

<script>
import { api_auth } from '../../api'
import { mapState } from 'vuex'
import Loading from '../Common/Loading/Loading.vue'
import Toast from '../Common/Toast/Toast.vue'
import back_arrow from '../commonImg/back_arrow_white.svg'

export default {
  components: {
    Loading,
    Toast
  },
  data () {
    return {
      back_arrow,
      account: '',
      password: '',
      code: '',
      code_img: '',
      session: '',
      view_state: ''
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user
  }),
  mounted() {
    this.getCode()
  },
  methods: {
    getCode() {
      this.$store.commit('startLoading')
      fetch(api_auth + '/auth/get', {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(res => res.json())
      .then(data => {
        this.code_img = api_auth + data.path
        this.session = data.session
        this.view_state = data.view_state
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      }) 
    },
    verifyInfo() {
      if (this.password == '' || this.account == '') {
        this.$refs.toast.showToast('学号和密码不能为空')
        return 0
      }
      if (this.code == '') {
        this.$refs.toast.showToast('验证码不能为空')
        return 0
      }
      this.$store.commit('startLoading')
      fetch(api_auth + '/auth/post', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `session=${this.session}&view_state=${this.view_state}&username=${this.account}&passwd=${this.password}&code=${this.code}`
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.state == 'success') {
          this.$refs.toast.showToast(`${data.name},恭喜你认证成功`)
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        } else {
          this.$refs.toast.showToast(`认证失败`)
        }
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      }) 
    }
  }
}
</script>

<style lang="scss" scoped>
#Auth {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  header {
    width: 100%;
    height: 1.4rem;
    position: relative;
    background: #3A393E;
    line-height: 1.4rem;
    font-size: 0.5rem;
    color: white;
    text-align: center;
    .back_arrow {
      display: inline-block;
      width: 0.54rem;
      height: 0.54rem;
      position: absolute;
      left: 0.45rem;
      top: 0.42rem;
    }
  }
  .account, .password, .code {
    width: 90%;
    margin: 0 auto;
    margin-top: 0.6rem;
    position: relative;
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
    img {
      position: absolute;
      width: 2rem;
      height: 1rem;
      top: 0;
      right: 0;
    }
  }
  .button {
    width: 90%;
    margin: 0 auto;
    margin-top: 1rem;
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
</style>
