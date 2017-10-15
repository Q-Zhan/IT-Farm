<template>
  <div id="myFans">
    <header>
      <span>我的粉丝</span>
      <router-link :to="'/app/user'"><img :src="back_arrow" class="back_arrow"/></router-link>
    </header>
    <ul class="list" id="list">
      <li v-for="(item, index) in fansList" :key="index" class="item" @click="turnToPersonPage(item.user.uname)">
        <div class="avatar"><img :src="getAvatar(index)"/></div>
        <div class="text">
          <div class="name">{{item.user.nname}}</div>
          <div class="signature">{{item.user.signature || '这个人很懒，还没有自我介绍'}}</div>
        </div>
      </li>
      <div v-if="fansList.length == 0" class="hint">还没有人关注你~</div>
    </ul>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import { api } from '../../api'
import { mapState } from 'vuex'
import Loading from '../Common/Loading/Loading.vue'
import back_arrow from '../commonImg/back_arrow_white.svg'
import avatar from '../commonImg/avatar.svg'

export default {
  components: {
    Loading
  },
  data () {
    return {
      back_arrow,
      avatar,
      fansList: [],
      noMoreFans: false
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user
  }),
  mounted() {
    if (!this.user.secret) {
      this.$router.push('/app/home')
    }
    this.getMyFans()
    this.addScrollListener()
  },
  methods: {
    getMyFans() {
      this.$store.commit('startLoading')
      let time = new Date().getTime()
      return fetch(api + '/api/user/relationship/asobject/' + time, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        this.fansList = data.content.mainUserList
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    addScrollListener() {
      let self = this
      let list = document.getElementById('list')
      list.addEventListener('scroll', throttle(scrollHandle, 50))
      function scrollHandle() {
        if (self.noMoreFans == true || self.isLoading == true) {
          return
        }
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 200) {
          self.getOldFans()
        }
      }
      function throttle(func, wait = 100) {
        let context, args;
        let previous = 0;
        return function() {
          let now = +new Date();
          context = this;
          args = arguments;
          if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
          }
        }
      }
    },
    getOldFans() {
      this.$store.commit('startLoading')
      let time = this.fansList[this.fansList.length - 1].tmAttention -1
      return fetch(api + '/api/user/relationship/asobject/' + time, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.content.mainUserList.length > 0) {
          this.fansList = this.fansList.concat(data.content.mainUserList)
        } else {
          this.noMoreFans = true
        }
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    turnToPersonPage(uname) {
      console.log(uname)
      this.$router.push({ name: 'personPage', params: { uname }})
    },
    getAvatar(index) {
      if (this.fansList[index].user.userPic) {
        return api + this.fansList[index].user.userPic.webPath
      } else {
        return avatar
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#myFans {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  header {
    width: 100%;
    height: 1.4rem;
    position: fixed;
    top: 0;
    z-index: 2;
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
  .list {
    height: calc(100% - 1.4rem);
    width: 100%;
    margin: 0;
    padding: 0;
    padding-top: 1.4rem;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    .hint {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 0.5rem;
      letter-spacing: 1px;
      color: gray;
    }
    .item {
      width: 100%;
      height: 2.2rem;
      border: 1px solid #E7E7E7;
      display: flex;
      align-items: center;
      .avatar {
        width: 2rem;
        height: 2rem;
        flex: 0 0 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;
        }
      }
      .text {
        margin-left: 0.2rem;
        letter-spacing: 1px;
        .name {
          font-size: 0.5rem;
          margin-bottom: 0.2rem;
        }
        .signature {
          font-size: 0.35rem;
          color: #A1A1A1;
          width: 6.5rem; 
          overflow: hidden; 
          text-overflow: ellipsis; 
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
