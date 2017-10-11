<template>
  <div id="list" ref="list">
    <pull-to :top-load-method="refresh" 
             :bottom-load-method="loadmore"
             :top-config="scrollConfig"
             :bottom-config="scrollConfig">
      <template slot="top-block" scope="props">
        <div class="scroll-load-wrapper">
          <div></div>
        </div>
      </template>
      <div v-for="(item, index) in messageList" 
          :key="item.mid" class="item" 
          :style="{ background: getBackground(index)}"
          @click="turnToDetail(index)">
          <div class="header">
            <img :src="getAvatar(index)"/>
            <div class="text">
              <span :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">{{item.fake ? item.fakeName : item.user.nname}}</span><br/>
              <span>{{ item.location.locale }}</span>
            </div>
          </div>
          <div class="content">
            {{parseEmoji(index)}}
          </div>
          <div class="images">
            <img 
              v-for="(image, image_index) in item.messageImageSet"
              :key="image_index" 
              :src="getImageSrc(image.webPath)"
              @error="setErrorImg"
              @click.stop="openImgToast"
            />
          </div>
        <div class="footer">
          <div class="comment" :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">评论{{ item.commentCount }}</div>
          <div class="praise" @click.stop="changePraiseNum(index)"><img :src="item.likee && item.likee.like ? praise_chose : praise"/><span>{{ item.likeCount }}</span></div>
          <div class="clear"></div>
        </div>
      </div>
      <template slot="bottom-block" scope="props">
        <div class="scroll-load-wrapper">
          <div></div>
        </div>
      </template>
      <div class="nomore" v-if="noMoreMessage">没有更多信息了</div>
    </pull-to>
  </div>
</template>

<script>
import { api } from '../../../api'
import { SCROLL_POSITION, EMOJI } from '../../../constant'
import PullTo from 'vue-pull-to'
import avatar from './avatar.svg'
import praise from './praise.svg'
import praise_chose from './praise_chose.svg'
import error_img from './error_img.jpg'

export default {
  props: [
    'messageCondition'
  ],
  components: {
    PullTo
  },
  data () {
    return {
      avatar,
      error_img,
      praise,
      praise_chose,
      BgColors: [
        '#96C4E6', '#67B5A2'
      ],
      background_array: [], // true表示有颜色，false表示白色
      scrollPosition: '',
      noMoreMessage: false,
      scrollConfig: {
        stayDistance: 75
      }
    }
  },
  computed: {
    messageList() {
      return this.$store.state.messageList
    }
  },
  watch: {
    messageCondition(newCondition) {
      this.$store.dispatch('getNewMessage', {condition: newCondition, isLoading: true})
      this.noMoreMessage = false
    }
  },
  mounted(){
    if (sessionStorage[SCROLL_POSITION]) {
      document.getElementsByClassName('scroll-container')[0].scrollTop = sessionStorage[SCROLL_POSITION]
    }
    this.saveScrollPosition()
  },
  beforeDestroy() {
    // 保留滚动位置
    sessionStorage.setItem(SCROLL_POSITION, this.scrollPosition)
  },
  methods: {
    refresh(loaded) {
      let block = document.getElementsByClassName('action-block')[0]
      block.style.height = '75px'
      block.style.marginTop = '-75px'
      this.$store.dispatch('getNewMessage', {condition: this.messageCondition, isLoading: false})
      .then(() => {
        loaded('done')
      })
      this.noMoreMessage = false
    },
    loadmore(loaded) {
      if (this.noMoreMessage == true) {
        loaded('done')
        return 0
      }
      let block = document.getElementsByClassName('action-block')[1]
      block.style.height = '75px'
      block.style.marginBottom = '-75px'
      this.$store.dispatch('getOldMessage', {condition: this.messageCondition})
      .then((length) => {
        if (length < 15) {
          this.noMoreMessage = true
        }
        loaded('done')
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
    saveScrollPosition() {
      let self = this
      let container = document.getElementsByClassName('scroll-container')[0]
      container.addEventListener('scroll', throttle(scrollHandle, 100))
      function scrollHandle() {
        self.scrollPosition = container.scrollTop
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
    turnToDetail(index) {
      let mid = this.messageList[index].mid
      this.$router.push({name: 'detail', params: { mid}})
    },
    openImgToast(e) {
      this.$emit('saveImgSrc', e.target.src)
    },
    changePraiseNum(index) {
      let mid = this.messageList[index].mid
      this.$store.dispatch('changeMessagePraiseNum', {mid})
    },
    getAvatar(index) {
      if (this.messageList[index].user && this.messageList[index].user.userPic) {
        return api + this.messageList[index].user.userPic.webPath
      } else {
        return avatar
      }
    },
    parseEmoji(index) {
      let content = this.messageList[index].content
      let reg = /\[.*?\]/g
      let newStr = content.replace(reg, (matchStr) => {
        if (matchStr != '[]' && EMOJI[matchStr]) {
          // return `<img src='./static/emoji/${EMOJI[matchStr]}'/>`
          return `<img src='${EMOJI[matchStr]}'/>`
        }
        return matchStr
      })
      // parseEmoji函数返回undefined后再插入dom节点
      setTimeout(() => {
        let contentNode = document.getElementById('list').getElementsByClassName('content')[index]
        contentNode.innerHTML = newStr
      }, 0)
    }
  }
}
</script>

<style lang="scss">
#list {
  width: 100%;
  height: calc(100% - 1.4rem);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .scroll-load-wrapper {
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 4px solid;
      border-color: #38BAF8 #38BAF8 transparent transparent;
      animation: load 1.5s linear infinite;
    }
  }
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
  .item {
    .header {
      width: 90%;
      margin: 0 auto;
      height: 1rem;
      padding-top: 0.25rem;
      display: flex;
      align-items: center;
      img {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }
      .text {
        display: inline-block;
        font-size: 0.4rem;
        margin-left: 0.2rem;
        line-height: 0.5rem;
        span:nth-of-type(1) {
          color: #AAADB1;
        }
        span:nth-of-type(2) {
          color: #5A86A4;
        }
      }
    }
    .content {
      width: 90%;
      margin: 0 auto;
      margin-top: 0.3rem;
      margin-bottom: 0.2rem;
      font-size: 0.5rem;
      letter-spacing: 3px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
      img {
        width: 0.7rem;
        height: 0.7rem;
        margin: 0 0.1rem;
        
      }
    }
    .images {
      width: 9rem;
      margin: 0 auto;
      display: flex;
      img {
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.1rem;
      }
    }
    .footer {
      width: 90%;
      margin: 0 auto;
      margin-top: 0.4rem;
      padding-bottom: 0.4rem;
      .comment {
        float: left;
        letter-spacing: 1px;
        font-size: 0.35rem;
      }
      .praise {
        float: right;
        display: flex;
        align-items: center;
        margin-right: 0.2rem;
        color: #8a8a8a;
        font-size: 0.35rem;
        img {
          width: 0.5rem;
          height: 0.5rem;
          margin-right: 0.1rem;
        }
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