<template>
  <div id="list" ref="list">
    <div v-for="(item, index) in items" 
         :key="item.id" class="item" 
         :style="{ background: getBackground(index)}"
         @click="turnToDetail(index)">
        <div class="header">
          <img :src="avatar_img"/>
          <div class="text">
            <span :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">楼主</span><br/>
            <span>{{ item.area }}</span>
          </div>
        </div>
        <div class="content">
          {{ item.content }}
        </div>
        <div class="images">
          <img 
            v-for="(image, image_index) in item.images"
            :key="image_index" 
            :src="getImageSrc(image.webPath)"
            @error="setErrorImg"
            @click.stop="openImgToast"
          />
        </div>
      <div class="footer">
        <div class="comment" :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">评论{{ item.comment_num }}</div>
        <div class="praise"><img :src="praise"/><span>{{ item.praise_num }}</span></div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '../../../api'
import avatar_img from './avatar.svg'
import praise from './praise.svg'
import praise_chose from './praise_chose.svg'
import error_img from './error_img.jpg'
export default {
  props: [
    'items'
  ],
  components: {
    
  },
  data () {
    return {
      avatar_img,
      error_img,
      praise,
      praise_chose,
      colors: [
        '#669ACA', '#61CA92', '#F2BE73', '#E897BD', '#81C467'
      ],
      background_array: [], // true表示有颜色，false表示白色
      scrollPosition: ''
    }
  },
  computed: {
    
  },
  mounted(){
    if (sessionStorage.scauwumi_scrollPosition) {
      document.getElementById('list').scrollTop = sessionStorage.scauwumi_scrollPosition
    }
    this.addScrollListener()
    this.saveScrollPosition()
  },
  beforeDestroy() {
    sessionStorage.setItem('scauwumi_scrollPosition', this.scrollPosition)
  },
  methods: {
    getBackground(index) {
      if (index % 2 == 0) {
        this.background_array[index] = true
        return this.colors[index % 5]
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
      let list = this.$refs.list
      list.addEventListener('scroll', throttle(scrollHandle, 100))
      function scrollHandle() {
        self.scrollPosition = list.scrollTop
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
    addScrollListener() {
      let list = document.getElementById('list')
      let self = this
      let dragger = new DragLoader(list, {
        dragDownRegionCls: 'latest',
        dragUpRegionCls: 'more',
        dragDownHelper: function(status) {
          return '<div class="down_loading"><div></div></div>'
        },
        dragUpHelper: function(status) {
          return '<div class="down_loading"><div></div></div>'
        }
      });
      dragger.on('dragDownLoad', () => {
        document.getElementsByClassName('latest')[0].style.height = '1rem'
        this.$store.dispatch('getNewMessage')
        dragger.reset();
      });
      dragger.on('dragUpLoad', () => {
        document.getElementsByClassName('more')[0].style.height = '1rem'
        this.$store.dispatch('getOldMessage')
        dragger.reset();
      });
    },
    turnToDetail(index) {
      this.$router.push({name: 'detail', params: { index : index}})
    },
    openImgToast(e) {
      this.$emit('saveImgSrc', e.target.src)
    },
    tailorContent(content) {
      
    }
  }
}
</script>

<style lang="scss">
#list {
  width: 100%;
  height: calc(100% - 1.4rem);
  padding-bottom: 1.5rem;
  overflow-y: scroll;
  .down_loading {
    width: 100%;
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
  .item {
    .header {
      width: 90%;
      margin: 0 auto;
      height: 1rem;
      padding-top: 0.25rem;
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
    .content {
      width: 90%;
      margin: 0 auto;
      margin-top: 0.2rem;
      margin-bottom: 0.2rem;
      font-size: 0.5rem;
      letter-spacing: 3px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
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