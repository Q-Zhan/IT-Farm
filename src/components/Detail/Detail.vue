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
            <span>五山区</span>
          </div>
        </div>
        <div class="word">
          今天校巴又迟到了。。
        </div>
        <div class="footer">
          <div class="comment_num" >评论 4</div>
          <div class="praise"><img :src="praise"/><span>2</span></div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="comment_list">
        <div v-for="(item, index) in comment_list" :key="item.content">
          <div class="list_left">
            <img :src="item.avatar"/>
          </div>
          <div class="list_right">
            <div class="list_right_title">{{ item.name }} ▪ {{ item.area }}</div>
            <div class="list_right_content">{{ item.content }}</div>
            <div class="list_right_bottom">
              <div class="time">{{ item.time }}</div>
              <div class="praise"><img :src="praise"/>0</div>
              <div class="clear"></div>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <div class="reply">
      <div class="reply_input">
        <input type="text" placeholder="匿名评论"/>
        <div class="underline"></div>
      </div>
      <div class="send_arrow">
        <img :src="send_arrow"/>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
import back_arrow from './back_arrow.svg'
import avatar_img from './avatar.svg'
import praise from './praise.svg'
import praise_chose from './praise_chose.svg'
import send_arrow from './send_arrow.svg'
export default {
  data () {
    return {
      back_arrow,
      praise,
      avatar_img,
      send_arrow,
      comment_list: [
        {
          avatar: avatar_img,
          name: '古猜',
          area: '华山区',
          content: 'hhhhhh',
          time: '3月前'
        },
        {
          avatar: avatar_img,
          name: '朱可夫',
          area: '五山区',
          content: '什么什么什么',
          time: '3月前'
        },
        {
          avatar: avatar_img,
          name: '阿伯拉尔',
          area: '启林区',
          content: '正常的啦',
          time: '3月前'
        },
        {
          avatar: avatar_img,
          name: '乔治',
          area: '五山区',
          content: '啦啦啦拉拉啦啦啦',
          time: '3月前'
        },
        {
          avatar: avatar_img,
          name: '乔治',
          area: '五山区',
          content: '啦啦啦拉拉啦啦啦1',
          time: '3月前'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#detail {
  width: 100%;
  min-height: calc(100% - 1.5rem);
  background: #EFEFEF;
  padding-bottom: 1.5rem;
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
    background: #EFEFEF;
    padding-top: 1.4rem;
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
    } 
    .comment_list {
      margin-top: 0.4rem;
      width: 100%;
      background: white;
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
</style>
