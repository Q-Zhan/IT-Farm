<template>
  <div id="detail">
    <header>
      <router-link to="/app/home"><img :src="back_arrow"/></router-link>
      <span class="title">无秘</span>
    </header>
    <div class="content">
      <div class="detail">
        <div class="header">
          <img :src="avatar_img"/>
          <div class="text">
            <span>楼主</span><br/>
            <span>{{message.location.locale}}</span>
          </div>
        </div>
        <div class="word">
          {{message.content}}
        </div>
        <div class="footer">
          <div class="comment_num" >评论 {{message.commentCount}}</div>
          <div class="praise"><img :src="praise"/><span>{{message.likeCount}}</span></div>
          <div class="clear"></div>
        </div>
        <div class="block"></div>
      </div>
      <div class="comment_list" id="comment_list">
          <div v-for="(item, index) in commentList" :key="item.cid">
            <div class="list_left">
              <img :src="avatar_img"/>
            </div>
            <div class="list_right">
              <div class="list_right_title">{{ item.user.nname }}</div>
              <div class="list_right_content">{{ item.content }}</div>
              <div class="list_right_bottom">
                <div class="time">{{ formatTime(item.tmCreated) }}</div>
                <div class="praise"><img :src="praise"/>{{ item.likeCount }}</div>
                <div class="clear"></div>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="comment_loading" v-show="commentIsLoading">
            <div>
            </div>
          </div>
          <div class="nomore" v-if="noMoreComment">没有更多内容</div>
      </div>
    </div>
    <div class="reply">
      <div class="reply_input">
        <input type="text" placeholder="匿名评论" v-model="newComment"/>
        <div class="underline"></div>
      </div>
      <div class="send_arrow" @click="createComment">
        <img :src="send_arrow"/>
      </div>
      <div class="clear"></div>
    </div>
    <Loading v-show="isLoading"/>
    <Toast ref="toast"/>
  </div>
</template>

<script>
import { api } from '../../api'
import Loading from '../Common/Loading/Loading.vue'
import Toast from '../Common/Toast/Toast.vue'
import back_arrow from './back_arrow.svg'
import avatar_img from './avatar.svg'
import praise from './praise.svg'
import praise_chose from './praise_chose.svg'
import send_arrow from './send_arrow.svg'
export default {
  components: {
    Loading,
    Toast
  },
  data () {
    return {
      back_arrow,
      praise,
      avatar_img,
      send_arrow,
      newComment: '',
      commentList: [],
      noMoreComment: false,
      commentIsLoading: false
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    message() {
      return this.$store.state.messageList[this.$route.params.index]
    },
    secret() {
      return this.$store.state.user.secret
    }
  },
  mounted() {
    // 修正评论list高度
    this.calculateListHeight()
    // 添加滚动事件
    this.addScrollListener()
    // 获取最新评论
    this.getInitializedComment()
  },
  methods: {
    getInitializedComment() {
      this.$store.commit('startLoading')
      let mid = this.message.mid
      fetch(api + `/api/comment/message/${mid}/page/0`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data)
          this.commentList = data.content.commentList
          this.$store.commit('stopLoading')
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('stopLoading')
          this.$refs.toast.showToast('获取评论失败')
        })
    },
    createComment() {
      this.$store.commit('startLoading')
      let params = `content=${this.newComment}&mid=${this.message.mid}`
      fetch(`${api}/api/comment/create`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.secret
        },
        body: params
      })
        .then((res) => res.json())
        .then((data) => {
          this.$store.commit('stopLoading')
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('stopLoading')
          this.$refs.toast.showToast('发送评论失败')
        })
    },
    formatTime(time) {
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let dealt_month = month > 10 ? month : '0' + month
      let day = date.getDate()
      let dealt_day = day > 10 ? day : '0' + day
      return `${year}/${dealt_month}/${dealt_day}`
    },
    calculateListHeight() {
      let list = document.getElementById('comment_list')
      let content = document.getElementsByClassName('content')[0]
      let detail = document.getElementsByClassName('detail')[0]
      let content_height = getComputedStyle(content).height
      let detail_height = getComputedStyle(detail).height
      list.style.height = content_height.substr(0, content_height.length - 2) - detail_height.substr(0, detail_height.length - 2) + 'px'
    },
    addScrollListener() {
      let self = this
      let comment_list = document.getElementById('comment_list')
      comment_list.addEventListener('scroll', throttle(scrollHandle, 100))
      function scrollHandle() {
        if (self.noMoreComment == true || self.commentIsLoading == true) {
          return
        }
        if (comment_list.scrollTop + comment_list.clientHeight >= comment_list.scrollHeight - 200) {
          self.getNewComment()
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
    getNewComment() {
      this.commentIsLoading = true
      console.log('fetch')
      let mid = this.message.mid
      let time = this.commentList[this.commentList.length - 1].tmCreated + 1
      fetch(api + `/api/comment/message/${mid}/tmafter/${time}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        let comments = data.content.commentList
        let len = comments.length
        if (len > 0) {
          for (let i = len - 1; i >= 0; i--) {
            this.commentList.push(comments[i])
          }
        } else {
          console.log('nomore')
          this.noMoreComment = true
        }
        this.commentIsLoading = false
      })
      .catch(err => {
        console.log(err)
        this.commentIsLoading = false
        this.$refs.toast.showToast('获取新评论失败')
      })
    }
  }
}
</script>

<style lang="scss">
#detail {
  width: 100%;
  height: 100%;
  background: #EFEFEF;
  .latest, .more {
    font-size: 0.5rem;
    text-align: center;
    line-height: 1rem;
    background: #D6D6D6;
  }
  header {
    position: fixed;
    top: 0;
    height: 1.4rem;
    width: 100%;
    border-bottom: 1px solid #D6D6D6;
    background: white;
    display: flex;
    align-items: center;
    img {
      width: 0.54rem;
      height: 0.54rem;
      margin-left: 0.45rem;
    }
    .title {
      display: inline-block;
      margin-left: 0.4rem;
      font-size: 0.45rem;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 2.9rem);
    overflow: hidden;
    background: #EFEFEF;
    padding-top: 1.4rem;
    padding-bottom: 1.5rem;
    .detail {
      background: white;
      .header {
        width: 90%;
        margin: 0 auto;
        margin-bottom: 0.1rem;
        height: 1rem;
        padding-top: 0.35rem;
        background: white;
        img {
          display: inline-block;
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
        }
        .text {
          display: inline-block;
          font-size: 0.32rem;
          margin-left: 0.1rem;
          line-height: 0.45rem;
          span:nth-of-type(1) {
            color: #AAADB1;
          }
          span:nth-of-type(2) {
            color: #5A86A4;
          }
        }
      }
      .word {
        width: 90%;
        margin: 0 auto;
        margin-top: 0.3rem;
        margin-bottom: 0.6rem;
        font-size: 0.5rem;
        letter-spacing: 3px;
        background: white;
      }
      .footer {
        width: 90%;
        margin: 0 auto;
        padding-bottom: 0.5rem;
        background: white;
        .comment_num {
          float: left;
          letter-spacing: 1px;
        }
        .praise {
          float: right;
          display: flex;
          align-items: center;
          color: #8a8a8a;
          img {
            width: 0.4rem;
            height: 0.4rem;
            margin-right: 0.1rem;
          }
        }
      }
      .block {
        height: 0.4rem;
        width: 100%;
        background: #EFEFEF;
      }
    } 
    .comment_list {
      width: 100%;
      height: 5rem;
      background: white;
      overflow: auto;
      .nomore {
        width: 100%;
        height: 1.2rem;
        background: #EFEFEF;
        text-align: center;
        font-size: 0.4rem;
        color: gray;
        line-height: 1.2rem;
        letter-spacing: 1px;
      }
      .comment_loading {
        width: 100%;
        height: 1.5rem;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        div {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          border: 0.1rem solid;
          border-color: #38BAF8 #38BAF8 transparent transparent;
          animation: load 1.5s linear infinite;
        }
      }
      .list_left {
        width: 20%;
        float: left;
        display: flex;
        justify-content: center;
        img {
          display: inline-block;
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          padding-top: 0.5rem;
        }
      }
      .list_right {
        width: 80%;
        float: right;
        .list_right_title {
          margin-top: 0.5rem;
          font-size: 0.35rem;
          color: #AAADB1;
        }
        .list_right_content {
          margin: 0.3rem 0;
          font-size: 0.4rem;
        }
        .list_right_bottom {
          width: 100%;
          padding-bottom: 0.2rem;
          color: #AAADB1;
          font-size: 0.35rem;
          border-bottom: 1px solid #EFEFEF;
          .time {
            float: left;
          }
          .praise {
            float: right;
            margin-right: 0.45rem;
            display: flex;
            align-items: center;
            img {
              width: 0.4rem;
              height: 0.4rem;
              margin-right: 0.1rem;
            }
          }
        }
      }
    }
  }
  .reply {
    width: 100%;
    height: 1.5rem;
    position: fixed;
    bottom: 0;
    background: white;
    border-top: 1px solid #D6D6D6;
    .reply_input {
      width: 8rem;
      float: left;
      margin-top: 0.5rem;
      margin-left: 0.4rem;
      input {
        width: 8rem;
        height: 0.5rem;
        margin-left: 0.1rem;
        font-size: 0.4rem;
        outline: none;
        border: 0;
      }
      .underline {
        width: 8.2rem;
        height: 0.12rem;
        margin-top: -0.05rem;
        border: 1px solid black;
        border-top: 0;
      }
    }
    .send_arrow {
      float: right;
      width: 0.75rem;
      height: 0.75rem;
      margin-right: 0.3rem;
      margin-top: 0.5rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  
}
@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>