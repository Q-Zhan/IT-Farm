<template>
  <div id="detail">
    <header>
      <img :src="back_arrow" @click="turnBack"/>
      <span class="title">无秘</span>
      <span class="delete_reply" @click="deleteReply" v-show="rcid">取消回复</span>
    </header>
    <div class="content" id="content">
      <div class="detail">
        <div class="header">
          <img :src="getMessageAvatar()" @click="turnToPersonPage(message.user ? message.user.uname : 'fake')"/>
          <div class="text">
            <span>{{ message.fake ? '匿名' : (message.user ? message.user.nname : '')}}</span><br/>
            <span>{{message.location ? message.location.locale: ''}}</span>
          </div>
        </div>
        <div class="word">
        </div>
        <div class="img_list">
          <img 
            v-for="(image, image_index) in imgList"
            :key="image_index" 
            :src="getImageSrc(image.webPath)"
            @error="setErrorImg"
            @click="openImgToast"
          />
        </div>
        <div class="footer">
          <div class="comment_num" >评论 {{message.commentCount}}</div>
          <div class="praise" @click="changeMessagePraiseNum"><img :src="message.likee && message.likee.like ? praise_chose : praise"/><span>{{message.likeCount}}</span></div>
          <div class="clear"></div>
        </div>
        <div class="block"></div>
      </div>
      <div :class="['comment_list', commentList.length == 0 ? 'hint' : '']" id="comment_list">
        <div v-for="(item, index) in commentList" :key="index" class="list_item">
          <div class="list_left" @click="turnToPersonPage(commentList[index].user.uname)">
            <img :src="getCommentAvatar(index)"/>
          </div>
          <div class="list_right" @click="openMask(index)">
            <div class="list_right_title" >{{ item.user.nname}}</div>
            <div class="list_right_content">
              <span v-if="item.rcNname" class="at">@{{ item.rcNname }}: </span>
              <span>{{ parseCommentEmoji(index) }}</span>
            </div>
            <div class="list_right_bottom">
              <div class="time">{{ formatTime(item.tmCreated) }}</div>
              <div class="praise" @click.stop="changeCommentPraiseNum(index)"><img :src="item.likee && item.likee.like ? praise_chose : praise"/>{{ item.likeCount }}</div>
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
        <input type="text" :placeholder="placeholder" v-model="newComment"/>
        <div class="underline"></div>
      </div>
      <div class="send_arrow" @click="createComment">
        <img :src="send_arrow"/>
      </div>
      <div class="clear"></div>
    </div>
    <div class="mask_layer" v-show="isMaskShowed" @click="closeMask">
      <ul>
        <li @click="turnToChat">私聊</li>
        <li @click="replyComment">评论他</li>
        <li @click="closeMask">取消</li>
      </ul>
    </div>
    <Loading v-show="isLoading"/>
    <Toast ref="toast"/>
    <img-toast :src="img_toast_src" ref="img_toast"/>
  </div>
</template>

<script>
import { api } from '../../api'
import { EMOJI } from '../../constant'
import Loading from '../Common/Loading/Loading.vue'
import Toast from '../Common/Toast/Toast.vue'
import ImgToast from '../Common/ImgToast/ImgToast.vue'
import back_arrow from '../commonImg/back_arrow_white.svg'
import avatar from '../commonImg/avatar.svg'
import praise from '../commonImg/praise.svg'
import praise_chose from '../commonImg/praise_chose.svg'
import send_arrow from '../commonImg/send_arrow.svg'
import error_img from '../commonImg/error_img.jpg'

export default {
  components: {
    Loading,
    Toast,
    ImgToast
  },
  data () {
    return {
      back_arrow,
      praise,
      praise_chose,
      avatar,
      send_arrow,
      error_img,
      newComment: '',
      commentList: [],
      img_toast_src: '',
      noMoreComment: false,
      commentIsLoading: false,
      isMaskShowed: false,
      receiverId: '',
      receiverNname: '',
      receiverUname: '',
      receiverIndex: '',
      receiverAvatar: '',
      rcid: '',
      placeholder: '发表评论',
      message: ''
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    user() {
      return this.$store.state.user
    },
    secret() {
      return this.$store.state.user.secret
    },
    imgList() {
      return this.message.messageImageSet
    },
    uid() {
      return this.$store.state.user.uid
    },
    chatList() {
      return this.$store.state.chat.chatList
    }
  },
  mounted() {
    if (!this.user.secret) {
      this.$router.push('/app/home')
    }
    // 获取最新评论和message信息
    this.getInitializedInfo()
    // 添加滚动事件
    this.addScrollListener()
  },
  methods: {
    getInitializedInfo() {
      this.$store.commit('startLoading')
      document.getElementById('comment_list').style.display = 'none'
      let mid = this.$route.params.mid
      let time = 1451581261000 // 时间是16年
      let getComment = fetch(api + `/api/comment/message/${mid}/tmafter/${time}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      let getMessage = fetch(api + `/api/message/get/${mid}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      Promise.all([getMessage, getComment])
      .then(async (data) => {
        let messageData = await data[0].json();
        let commentData = await data[1].json();
        // 处理message
        this.message = messageData.content
        this.parseMessageEmoji()
        // 处理comment
        let comments = commentData.content.commentList
        let len = comments.length
        for (let i = len - 1; i >= 0; i--) {
          this.commentList.push(comments[i])
        }
        if (this.commentList.length == 0) {
          let contentHeight = getComputedStyle(document.getElementById('content')).height
          let detailHeight = getComputedStyle(document.getElementsByClassName('detail')[0]).height
          let hint = document.getElementsByClassName('hint')[0]
          hint.style.height = contentHeight.substr(0, contentHeight.length -2) - detailHeight.substr(0, detailHeight.length - 2) + 'px'
          document.getElementById('content').style.overflow = 'hidden'
          document.getElementById('comment_list').style.display = 'block'
        } else {
          document.getElementById('comment_list').style.display = 'block'
        }
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    createComment() {
      if (this.newComment == '') {
        this.$refs.toast.showToast('评论不能为空')
        return 0
      }
      let params = `content=${this.newComment}&mid=${this.message.mid}`
      if (this.rcid != '') { // 如果该评论回复了其他某条评论
        params = params + '&rcid=' + this.rcid
      }
      this.newComment = ''
      this.$store.commit('startLoading')
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
        this.message.commentCount++
        this.$store.commit('addCommentCount', {mid: this.message.mid, num: 1})
        this.$store.commit('stopLoading')
        this.getNewComment()
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
      let dealt_month = month >= 10 ? month : '0' + month
      let day = date.getDate()
      let dealt_day = day >= 10 ? day : '0' + day
      return `${year}/${dealt_month}/${dealt_day}`
    },
    addScrollListener() {
      let self = this
      let content = document.getElementById('content')
      content.addEventListener('scroll', throttle(scrollHandle, 50))
      function scrollHandle() {
        if (self.noMoreComment == true || self.commentIsLoading == true) {
          return
        }
        if (content.scrollTop + content.clientHeight >= content.scrollHeight - 300) {
          self.getNewComment()
        }
      }
      // 函数节流
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
      let mid = this.message.mid
      let time = ''
      if (this.commentList.length > 0) {
        time = this.commentList[this.commentList.length - 1].tmCreated + 1
        fetch(api + `/api/comment/message/${mid}/tmafter/${time}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((res) => res.json())
        .then((data) => {
          let comments = data.content.commentList
          let len = comments.length
          if (len > 0) {
            for (let i = len - 1; i >= 0; i--) {
              this.commentList.push(comments[i])
            }
          } else {
            this.noMoreComment = true
          }
          this.commentIsLoading = false
        })
        .catch(err => {
          console.log(err)
          this.commentIsLoading = false
          this.$refs.toast.showToast('获取新评论失败')
        })
      } else {
        time = new Date().getTime() + 1
        fetch(api + `/api/comment/message/${mid}/tmbefore/${time}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          let comments = data.content.commentList
          this.commentList.push(comments[0])
          this.commentIsLoading = false
        })
        .catch(err => {
          console.log(err)
          this.commentIsLoading = false
          this.$refs.toast.showToast('获取新评论失败')
        })
      }
      
    },
    getImageSrc(webPath) {
      return api + webPath
    },
    setErrorImg(e) {
      e.target.src = this.error_img
    },
    openMask(index) {
      let receiverId = this.commentList[index].user.uid
      let receiverNname = this.commentList[index].user.nname
      this.receiverId = receiverId
      this.receiverNname = receiverNname
      this.receiverIndex = index
      this.receiverUname = this.commentList[index].user.uname
      this.receiverAvatar = this.commentList[index].user.userPic && this.commentList[index].user.userPic.webPath
      if (receiverId == this.uid) {
        this.$refs.toast.showToast('不能回复自己')
        return 0
      }
      this.isMaskShowed = true
    },
    closeMask() {
      this.isMaskShowed = false
    },
    turnToPersonPage(uname) {
      if (uname == 'fake' || uname == this.user.uname) {
        return 0
      }
      this.$router.push({ name: 'personPage', params: { uname }})
    },
    turnToChat() {
      let receiverId = this.receiverId
      let receiverNname = this.receiverNname
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
        this.$store.commit('addChat', { receiverId, Nname: receiverNname, Uname: this.receiverUname, avatar: this.receiverAvatar})
        this.$router.push({ name: 'chat', params: { chatIndex: this.chatList.length - 1 }})
      }
      else {
        this.$router.push({ name: 'chat', params: { chatIndex: i}})
      }
    },
    replyComment() {
      this.rcid = this.commentList[this.receiverIndex].cid
      this.placeholder = `回复 ${this.receiverNname} 的评论：`
      this.isMaskShowed = false
    },
    deleteReply() {
      this.rcid = ''
      this.placeholder = '发表评论'
    },
    turnBack() {
      this.$router.go(-1)
    },
    openImgToast(e) {
      this.$refs.img_toast.open()
      this.img_toast_src = e.target.src
    },
    getMessageAvatar() {
      if (this.message.user && this.message.user.userPic) {
        return api + this.message.user.userPic.webPath
      } else {
        return avatar
      }
    },
    getCommentAvatar(index) {
      if (this.commentList[index] && this.commentList[index].user.userPic) {
        return api + this.commentList[index].user.userPic.webPath
      } else {
        return avatar
      }
    },
    changeCommentPraiseNum(index) {
      this.$store.commit('startLoading')
      let cid = this.commentList[index].cid
      fetch(api + `/api/likee/comment/${cid}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'janke-authorization': this.user.secret
        }
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          if (this.commentList[index].likee) {
            this.commentList[index].likee.like ? this.commentList[index].likeCount -= 1 : this.commentList[index].likeCount += 1
            this.commentList[index].likee = !this.commentList[index].likee
          } else {
            this.commentList[index].likee = {like: true}
            this.commentList[index].likeCount += 1
          }
        }
        this.$store.commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        this.$store.commit('stopLoading')
      })
    },
    changeMessagePraiseNum(){
      let mid = this.message.mid
      if (this.message.likee) {
        this.message.likee.like ? this.message.likeCount -= 1 : this.message.likeCount += 1
        this.message.likee = !this.message.likee
      } else {
        this.message.likee = {like: true}
        this.message.likeCount += 1
      }
      this.$store.dispatch('changeMessagePraiseNum', {mid})
    },
    parseMessageEmoji() {
      let content = this.message.content
      let reg = /\[.*?\]/g
      let newStr = content.replace(reg, (matchStr) => {
        if (matchStr != '[]' && EMOJI[matchStr]) {
          return `<img src='${EMOJI[matchStr]}'/>`
        }
        return matchStr
      })
      let wordNode = document.getElementsByClassName('word')[0]
      wordNode.innerHTML = newStr
    },
    parseCommentEmoji(index) {
      let content = this.commentList[index].content
      let rcNname = this.commentList[index].rcNname
      let reg = /\[.*?\]/g
      let newStr = content.replace(reg, (matchStr) => {
        if (matchStr != '[]' && EMOJI[matchStr]) {
          return `<img src='${EMOJI[matchStr]}'/>`
        }
        return matchStr
      })
      // parseEmoji函数返回undefined后再插入dom节点
      setTimeout(() => {
        let contentNode = document.getElementsByClassName('list_right_content')[index]
        if (rcNname) {
          newStr = `<span class="at">@${rcNname}: </span>` + newStr
        }
        contentNode.innerHTML = newStr
      }, 0)
    }
  }
}
</script>

<style lang="scss">
#detail {
  width: 100%;
  height: 100%;
  background: #EFEFEF;
  .mask_layer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    ul {
      padding: 0;
      list-style: none;
      width: 4rem;
      background: #F8F8F8;
      border-radius: 0.15rem;
      li {
        display: block;
        width: 90%;
        margin: 0 auto;
        height: 1.2rem;
        font-size: 0.5rem;
        text-align: center;
        letter-spacing: 1px;
        line-height: 1.2rem;
        border-bottom: 1px solid gray;
      }
      li:nth-of-type(3) {
        border: 0;
      }
    }
  }
  .latest, .more {
    font-size: 0.5rem;
    text-align: center;
    line-height: 1rem;
    background: #D6D6D6;
  }
  header {
    position: fixed;
    top: 0;
    z-index: 2;
    height: 1.4rem;
    width: 100%;
    color: white;
    background: #3A393E;
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
    .delete_reply {
      font-size: 0.45rem;
      position: absolute;
      right: 0.2rem;
      top: 0.4rem;
      letter-spacing: 1px;
      color: white;
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 2.9rem);
    background: #EFEFEF;
    padding-top: 1.4rem;
    padding-bottom: 1.5rem;
    overflow: scroll;
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
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          vertical-align: top;
        }
        .text {
          display: inline-block;
          font-size: 0.4rem;
          margin-left: 0.1rem;
          line-height: 0.5rem;
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
        img {
          width: 0.7rem;
          height: 0.7rem;
          margin: 0 0.1rem;
          
        }
      }
      .img_list {
        width: 90%;
        margin: 0 auto;
        img {
          height: 2.5rem;
          width: 2.5rem;
          margin-right: 0.1rem;
        }
      }
      .footer {
        width: 90%;
        margin: 0 auto;
        margin-top: 0.1rem;
        padding-bottom: 0.5rem;
        background: white;
        .comment_num {
          float: left;
          letter-spacing: 1px;
          font-size: 0.35rem;
        }
        .praise {
          float: right;
          display: flex;
          align-items: center;
          color: #8a8a8a;
          font-size: 0.35rem;
          img {
            width: 0.5rem;
            height: 0.5rem;
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
    .hint {
      background: white;
      position: relative;
      text-align: center;
    }
    .hint::after {
      content: '来抢沙发吧 ~';
      font-size: 0.45rem;
      color: gray;
      letter-spacing: 1px;
      position: absolute;
      width: 100%;
      left: 0;
      top: 2.5rem;
    }
    .comment_list {
      width: 100%;
      background: white;
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
      .list_item {
        width: 100%;
        overflow-x: hidden;
      }
      .list_left {
        width: 18%;
        float: left;
        display: flex;
        justify-content: center;
        img {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 50%;
          margin-top: 0.5rem;
        }
      }
      .list_right {
        width: 82%;
        float: right;
        .list_right_title {
          margin-top: 0.5rem;
          font-size: 0.35rem;
          color: #AAADB1;
        }
        .list_right_content {
          margin: 0.3rem 0;
          margin-right: 0.4rem;
          font-size: 0.4rem;
          word-wrap: break-word;
          .at {
            color: #007ACC;
          }
          img {
            width: 0.6rem;
            height: 0.6rem;
            margin: 0 0.05rem;
          }
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