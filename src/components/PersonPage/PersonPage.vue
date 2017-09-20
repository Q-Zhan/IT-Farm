<template>
  <div id="personPage">
    <header>
      <span>个人主页</span>
      <img :src="back_arrow" class="back_arrow" @click="turnToBack"/>
    </header>
    <div class="content">
      <div class="avatar"><img :src="avatar_img"/></div>
      <div class="name">{{ personInfo.nname }}</div>
      <div class="block"></div>
      <div class="info">
        <div class="faculty container">
          <span>学院</span>
          <span>{{ personInfo.faculty }}</span>
        </div>
        <div class="gender container">
          <span>性别</span>
          <span>{{ personInfo.gender ? '男' : '女'}}</span>
        </div>
        <div class="site container">
          <span>宿舍区</span>
          <span>{{ personInfo.site }}</span>
        </div>
        <div class="grade container">
          <span>入学年份</span>
          <span>{{ personInfo.grade }}</span>
        </div>
        <div class="signature">
          <div class="word">
            <span>个性签名</span>
            <span>{{personInfo.signature}}</span>
          </div>
        </div>
      </div>
    </div>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import { api } from '../../api'
import { mapState } from 'vuex'
import Loading from '../Common/Loading/Loading.vue'
import back_arrow from './back_arrow.svg'
import avatar_img from './avatar.svg'

export default {
  components: {
    Loading
  },
  data () {
    return {
      back_arrow,
      avatar_img,
      personInfo: {
        faculty: '',
        gender: '',
        site: '',
        grade: '',
        signature: ''
      }
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user
  }),
  mounted() {
    this.getPersonInfo()
  },
  methods: {
    turnToBack() {
      this.$router.go(-1)
    },
    getPersonInfo() {
      this.$store.commit('startLoading')
      let uname = this.$route.params.uname
      fetch(api + `/api/user/profile/${uname}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data)
          this.personInfo = data.content
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
#personPage {
  width: 100%;
  height: 100%;
  header {
    width: 100%;
    height: 1.4rem;
    position: fixed;
    background: white;
    line-height: 1.4rem;
    font-size: 0.5rem;
    border-bottom: 1px solid #D6D6D6;
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
  .content {
    width: 100%;
    height: calc(100% - 1.4rem);
    overflow: scroll;
    padding-top: 1.4rem;
    .avatar {
      width: 1.8rem;
      height: 1.8rem;
      border-radius: 50%;
      margin: 0 auto;
      margin-top: 0.3rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      text-align: center;
      margin-top: 0.3rem;
      margin-bottom: 0.5rem;
      font-size: 0.5rem;
    }
    .block {
      width: 100%;
      height: 0.5rem;
      background: #EFEFEF;
    }
    .info {
      width: 100%;
      .container {
        width: 90%;
        margin: 0 auto;
        height: 1.5rem;
        background: white;
        border-bottom: 1px solid #C1C1C1;
        display: flex;
        align-items: center;
        font-size: 0.45rem;
        span:nth-of-type(1) {
          color: gray;
          display: inline-block;
          width: 2.6rem;
        }
      }
      .signature {
        width: 90%;
        margin: 0 auto;
        padding: 0.4rem 0;
        font-size: 0.45rem;
        .word {
          display: flex;
          span:nth-of-type(1) {
            flex: 0 0 2.6rem;
            color: gray;
          }
          span:nth-of-type(2) {
            text-align: justify;
          }
        }
      }
    }
  }
}
</style>
