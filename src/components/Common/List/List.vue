<template>
  <div id="list">
    <div v-for="(item, index) in items" :key="item.id" class="item" :style="{ background: getBackground(index)}">
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
      <div class="footer">
        <div class="comment" :style="{ color: background_array[index] ? 'white' : '#8a8a8a'}">评论{{ item.comment_num }}</div>
        <div class="praise"><img :src="praise"/><span>{{ item.praise_num }}</span></div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar_img from './avatar.svg'
import praise from './praise.svg'
import praise_chose from './praise_chose.svg'
export default {
  props: [
    'items'
  ],
  data () {
    return {
      avatar_img,
      praise,
      praise_chose,
      colors: [
        '#669ACA', '#61CA92', '#F2BE73', '#E897BD', '#81C467'
      ],
      background_array: [] // true表示有颜色，false表示白色
    }
  },
  computed: {
    
  },
  methods: {
    getBackground: function(index) {
      if (index % 2 == 0) {
        this.background_array[index] = true
        return this.colors[index % 5]
      } else {
        this.background_array[index] = false
        return 'white'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#list {
  width: 100%;
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
      margin-bottom: 0.4rem;
      font-size: 0.45rem;
      letter-spacing: 3px;
    }
    .footer {
      width: 90%;
      margin: 0 auto;
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
</style>
