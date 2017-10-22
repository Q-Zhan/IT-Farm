<template>
  <div id="user">
    <header>
      <span>匿秘</span>
    </header>
    <div class="bg">
      <router-link to="/userDetail">
        <div class="user_info">
          <img :src="getAvatar()" class="avatar" @click.stop="openImgToast"/>
          <div class="word">
            <span>{{ user.nname }}</span>
            <span>账号：{{ user.uname }}</span>
          </div>
        </div>
      </router-link>
      <router-link to="/myConcern">
        <div class="myconcern">
          <div class="img_bg"><img :src="concern"/></div>
          <span>我的关注</span>
        </div>
      </router-link>
      <router-link to="/myFans">
        <div class="myfans">
          <div class="img_bg"><img :src="fans"/></div>
          <span>我的粉丝</span>
        </div>
      </router-link>
      <router-link to="/myMessage">
        <div class="mymessage">
          <div class="img_bg"><img :src="message_img"/></div>
          <span>我的消息</span>
        </div>
      </router-link>
      <div class="auth" @click="authen">
        <div class="img_bg"><img :src="auth"/></div>
        <span>校园认证</span>
      </div>
      <div class="logout" @click="logout">
        退出登录
      </div>
    </div>
    <Loading v-show="isLoading"/>
    <Toast ref="toast"/>
    <img-toast :src="img_toast_src" ref="img_toast"/>
  </div>
</template>

<script>
import { api } from '../../api'
import Toast from '../Common/Toast/Toast.vue'
import Loading from '../Common/Loading/Loading.vue'
import ImgToast from '../Common/ImgToast/ImgToast.vue'
import avatar from '../commonImg/avatar.svg'
import concern from './concern.svg'
import fans from './fans.svg'
import message_img from './message.svg'
import auth from './auth.svg'
import { mapState } from 'vuex'

export default {
  components: {
    Loading,
    ImgToast,
    Toast
  },
  data () {
    return {
      avatar,
      concern,
      fans,
      message_img,
      auth,
      img_toast_src: ''
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user
  }),
  mounted() {
    this.$store.commit('changeFooterChosen', {value: 'user'})
    // 检测store是否被清空
    if (!this.user.secret) {
      this.$router.push('/app/home')
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/logo')
      })
    },
    getAvatar() {
      if (this.user.userPic) {
        return api + this.user.userPic.webPath
      } else {
        return avatar
      }
    },
    openImgToast(e) {
      e.preventDefault()
      this.$refs.img_toast.open()
      this.img_toast_src = e.target.src
    },
    authen() {
      this.$refs.toast.showToast('内网维护中')
      // this.$router.push('/auth')
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
      letter-spacing: 1px;
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
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      .avatar {
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
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
          font-size: 0.5rem;
          display: inline-block;
          margin-bottom: 0.1rem;
        }
        span:nth-of-type(2) {
          font-size: 0.36rem;
          letter-spacing: 1px;
          color: gray;
        }
      }
    }
    .myconcern, .myfans, .mymessage, .auth {
      height: 1.2rem;
      margin-top: 0.4rem;
      background: white;
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      .img_bg {
        width: 0.7rem;
        height: 0.7rem;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 0.5rem;
          height: 0.5rem;
        }
      }
      span {
        font-size: 0.5rem;
        margin-left: 0.3rem;
      }
    }
    .myconcern {
      .img_bg {
        background: #FEA006;
      }
    }
    .myfans {
      .img_bg {
        background: #FB6A5C;
      }
    }
    .mymessage {
      .img_bg {
        background: #6292EC;
      }
    }
    .auth {
      .img_bg {
        background: #40B680;
      }
    }
    .logout {
      width: 100%;
      height: 1.2rem;
      margin-top: 0.5rem;
      background: #EA2000;
      line-height: 1.2rem;
      font-size: 0.45rem;
      color: white;
      text-align: center;
    }
  }
}
</style>
