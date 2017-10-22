<template>
  <div id="Notice">
    <header>
      <img :src="back_arrow" @click="turnToBack"/>
      <span>{{type == 'comment' ? '新评论' : '新点赞'}}</span>
    </header>
    <div class="notice_list">
      <div v-for="(item, index) in noticeList" :key="index" class="item" @click="turnToDetail(item.ntcBody.mid)">
        <div class="avatar"><img :src="getAvatar(item)"/></div>
        <div class="word">
          <div class="title"><span class="Nname">{{item.ntcBody.lkNname || item.ntcBody.cNname}} </span><span>{{type=='comment'? '评论' : '赞'}}了你的{{(item.ntcType=='cLikee'||item.ntcType=='rCmmnt')? '评论' : '消息'}}</span></div>
          <div class="content">{{parseContent(item)}}</div>
        </div>
      </div>
      <div v-if="noticeList.length == 0" class="hint">还没有新的{{type == 'comment' ? '评论' : '点赞'}}~</div>
    </div>
  </div>
</template>

<script>
import { api } from '../../api'
import back_arrow from '../commonImg/back_arrow_white.svg'
import avatar from '../commonImg/avatar.svg'

export default {
  data () {
    return {
      back_arrow,
      avatar
    }
  },
  computed: {
    newComment() {
      return this.$store.state.socket.newComment
    },
    newPraise() {
      return this.$store.state.socket.newPraise
    },
    noticeList() {
      return this.$route.params.type == 'comment' ? this.newComment.comments : this.newPraise.praises
    },
    type() {
      return this.$route.params.type
    },
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    // 检测store是否被清空
    if (!this.user.secret) {
      this.$router.push('/app/home')
    }
  },
  methods: {
    turnToDetail(mid) {
      this.$router.push({name: 'detail', params: {mid}})
    },
    turnToBack() {
      this.$router.go(-1)
    },
    getAvatar(item) {
      let ntcBody = item.ntcBody
      let userInfo = ntcBody.cUser || ntcBody.lkUser
      if (userInfo.userPic) {
        return api + userInfo.userPic.webPath
      } else {
        return this.avatar
      }
    },
    // 添加省略号
    parseContent(item) {
      let body = item.ntcBody
      if (body.mShrtCntnt) {
        return body.mShrtCntnt.length >= 18 ? (body.mShrtCntnt + '...') : (body.mShrtCntnt)
      } else {
        return body.cShrtCntnt.length >= 18 ? (body.cShrtCntnt + '...') : (body.cShrtCntnt)
      }
    }
  }
}
</script>

<style lang="scss">
#Notice {
  width: 100%;
  height: 100%;
  header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 1.4rem;
    background: #3A393E;
    color: white;
    line-height: 1.4rem;
    text-align: center;
    font-size: 0.5rem;
    letter-spacing: 1px;
    img {
      position: absolute;
      width: 0.54rem;
      height: 0.54rem;
      top: 0.42rem;
      left: 0.45rem;
    }
  }
  .notice_list {
    height: calc(100% - 1.4rem);
    padding-top: 1.4rem;
    width: 100%;
    overflow: scroll;
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
      border-bottom: 1px solid #E8E8E8;
      padding-bottom: 0.6rem;
      display: flex;
      .avatar {
        width: 1.5rem;
        height: 1.5rem;
        margin-left: 0.5rem;
        margin-top: 0.3rem;
        border-radius: 50%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .word {
        width: 7rem;
        margin: 0.3rem 0 0 0.3rem;
        .title {
          font-size: 0.4rem;
          color: #9FA4A7;
        }
        .content {
          margin-top: 0.25rem;
          font-size: 0.5rem;
          color: #C8C8C8;
          letter-spacing: 1px;
        }
      }
    }
  }
}
</style>
