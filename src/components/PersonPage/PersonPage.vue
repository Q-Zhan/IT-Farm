<template>
  <div id="personPage">
    <header>
      <span>个人主页</span>
      <img :src="back_arrow" class="back_arrow" @click="turnToBack"/>
    </header>
    <div class="content">
      <div class="avatar"><img :src="getAvatar()"/></div>
      <div class="name">{{ personInfo.nname }}</div>
      <div class="operation">
        <div class="concern" @click="concern" :class="{'concerned': isConcerned}">{{isConcerned ? '已关注' : '关注'}}</div>
        <div class="chat" @click="turnToChat">私聊</div>
      </div>
      <div class="tab">
        <div class="tab_info" :class="{'tab_chosen': isInfoShowed}" @click="changeTab('info')">基本信息</div>
        <div class="tab_message" :class="{'tab_chosen': isMessageShowed}" @click="changeTab('message')">已发消息</div>
      </div>
      <div class="info" v-show="isInfoShowed">
        <div class="faculty container">
          <span>学院</span>
          <span>{{ personInfo.faculty }}</span>
        </div>
        <div class="gender container">
          <span>性别</span>
          <span>{{ gender}}</span>
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
      <div class="message" v-show="isMessageShowed" id="list">
        <div v-for="(item, index) in messageList"
             :key="item.mid" class="item"
            :style="{ background: getBackground(index)}"
            @click="turnToDetail(index)">
          <div class="header">
            <img :src="getAvatar()" />
            <div class="text">
              <span :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">楼主</span><br/>
              <span>{{ item.location.locale }}</span>
            </div>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="images">
            <img v-for="(image, image_index) in item.messageImageSet" 
                :key="image_index" 
                :src="getImageSrc(image.webPath)" 
                @error="setErrorImg" 
                @click.stop="openImgToast" />
          </div>
          <div class="footer">
            <div class="comment" :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">评论{{ item.commentCount }}</div>
            <div class="praise">
              <img :src="praise" />
              <span>{{ item.likeCount }}</span>
            </div>
            <div class="clear"></div>
          </div>
        </div>
        <div class="nomore" v-if="noMoreMessage">没有更多信息了</div>
      </div>
    </div>
    <Loading v-show="isLoading"/>
    <img-toast :src="img_toast_src" ref="img_toast"/>
  </div>
</template>

<script>
import { api } from '../../api'
import { mapState } from 'vuex'
import Loading from '../Common/Loading/Loading.vue'
import ImgToast from '../Common/ImgToast/ImgToast.vue'
import back_arrow from './back_arrow.svg'
import avatar from './avatar.svg'
import praise from './praise.svg'
import error_img from './error_img.jpg'

export default {
  components: {
    Loading,
    ImgToast
  },
  data () {
    return {
      back_arrow,
      avatar,
      error_img,
      praise,
      isInfoShowed: true,
      isMessageShowed: false,
      personInfo: {
        faculty: '无',
        gender: '无',
        site: '无',
        grade: '无',
        signature: '无'
      },
      BgColors: [
        '#96C4E6', '#67B5A2'
      ],
      background_array: [], // true表示有颜色，false表示白色
      isConcerned: false,
      messageList: [],
      img_toast_src: '',
      noMoreMessage: false
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    user() {
      return this.$store.state.user
    },
    chatList() {
      return this.$store.state.chat.chatList
    },
    gender() {
      if (this.personInfo.gender == '无') {
        return '无'
      } else {
        return (this.personInfo.gender ? '男' : '女')
      }
    }
  },
  mounted() {
    this.getPersonInfo()
  },
  methods: {
    changeTab(value) {
      if (value == 'message') {
        this.isInfoShowed = false
        this.isMessageShowed = true
        if (this.messageList.length == 0) {
          this.getMessage()
          this.addScrollListener()
        }
      } else {
        this.isInfoShowed = true
        this.isMessageShowed = false
      }
    },
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
          let userInfo = data.content.user
          let item
          for (item in userInfo) {
            if (userInfo[item]) {
              this.personInfo[item] = userInfo[item]
            }
          }
          this.isConcerned = data.content.isAttention
          this.$store.commit('stopLoading')
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('stopLoading')
        })
    },
    concern() {
      let reqApi = ''
      let uname = this.$route.params.uname
      if (this.isConcerned) {
        // 取消关注
        reqApi = api + '/api/user/relationship/cancel'
      } else {
        // 关注
        reqApi = api + '/api/user/relationship/add'
      }
      this.$store.commit('startLoading')
      fetch(reqApi, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        },
        body: 'objectUname=' + uname
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        this.isConcerned = !this.isConcerned
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    turnToChat() {
      let receiverId = this.personInfo.uid
      let receiverName = this.personInfo.nname
      let flag = 0
      let len = this.chatList.length
      let i = 0
      for (i = 0; i < len; i++) {
        if (receiverId == this.chatList[i].chatId) {
          flag = 1
          break
        }
      }
      // chatList中不存在与此人的聊天
      if (flag == 0) {
        this.$store.commit('addChat', { receiverId, receiverName })
        this.$router.push({ name: 'chat', params: { chatIndex: this.chatList.length - 1 }})
      }
      else {
        this.$router.push({ name: 'chat', params: { chatIndex: i}})
      }
    },
    getMessage() {
      this.$store.commit('startLoading')
      let time = new Date().getTime()
      let uname = this.personInfo.uname
      return fetch(`${api}/api/message/user/${uname}/${time}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        this.messageList = data.content.messageList
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    getBackground(index) {
      if (index % 2 == 0) {
        this.background_array[index] = true
        return this.BgColors[index /2 % 2]
      } else {
        this.background_array[index] = false
        return 'white'
      }
    },
    getImageSrc(webPath) {
      return api + webPath
    },
    setErrorImg(e) {
      e.target.src = this.error_img
    },
    openImgToast(e) {
      this.$refs.img_toast.open()
      this.img_toast_src = e.target.src
    },
    addScrollListener() {
      let self = this
      let list = document.getElementById('list')
      list.addEventListener('scroll', throttle(scrollHandle, 50))
      function scrollHandle() {
        if (self.noMoreMessage == true || self.isLoading == true) {
          return
        }
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 800) {
          self.getOldMessage()
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
    getOldMessage() {
      console.log('fetch')
      this.$store.commit('startLoading')
      let uname = this.personInfo.uname
      let time = this.messageList[this.messageList.length - 1].tmCreated -1
      return fetch(`${api}/api/message/user/${uname}/${time}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.content.messageList.length > 0) {
          this.messageList = this.messageList.concat(data.content.messageList)
        } else {
          this.noMoreMessage = true
        }
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    turnToDetail(index) {
      let mid = this.messageList[index].mid
      this.$router.push({name: 'detail', params: { mid}})
    },
    getAvatar() {
      if (this.personInfo.userPic) {
        return api + this.personInfo.userPic.webPath
      } else {
        return avatar
      }
    }
  }
}
</script>

<style lang="scss">
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
    overflow: hidden;
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
      margin-top: 0.2rem;
      margin-bottom: 0.4rem;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.5rem;
    }
    .operation {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 0.5rem;
      .concern, .chat{
        height: 0.75rem;
        background: white;
        color: #007ACC;
        font-size: 0.4rem;
        border: 1px solid #007ACC;
        border-radius: 0.1rem;
        text-align: center;
        line-height: 0.75rem;
        position: relative;
      }
      .concern {
        right: 0.4rem;
        padding: 0 0.25rem;
      }
      .chat {
        width: 1.3rem;
        background: #007ACC;
        color: white;
        left: 0.4rem;
      }
      .concerned {
        background: #007ACC;
        color: white;
      }
    }
    .tab {
      display: flex;
      width: 100%;
      height: 1.2rem;
      background: #F6F6F6;
      color: #919191;
      justify-content: space-around;
      align-items: center;
      font-size: 0.45rem;
    }
    .tab_chosen {
      color: #2A2A2A;
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
    #list {
      height: calc(100% - 6.15rem);
      .content {
        padding: 0;
      }
    }
  }
}
</style>
