<template>
  <div id="home">
    <header>
      <div class="name">匿密</div>
      <div class="add"><img :src="add_img"/></div>
      <div class="clear"></div>
    </header>
    <List :items="items"/>
  </div>
</template>

<script>
import List from '../Common/List/List.vue'
import add_img from './add.svg'
export default {
  components: {
    List
  },
  data () {
    return {
      add_img,
      items: [
        {
          id: '0',
          area: '五山区',
          content: '今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊今天校巴好慢啊啊',
          comment_num: '13',
          praise_num: '3'
        },
        {
          id: '1',
          area: '启林区',
          content: '卢萨卡活动啊是广东哈市到时候偶的好似活动按时偶的好似以后大神哦等会奥豪斯',
          comment_num: '1',
          praise_num: '2'
        },
        {
          id: '2',
          area: '华山区',
          content: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
          comment_num: '12',
          praise_num: '0'
        },
        {
          id: '3',
          area: '其他宿舍区',
          content: '哈哈哈哈哈哈撒大声地哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
          comment_num: '2',
          praise_num: '0'
        },
        {
          id: '4',
          area: '嵩山区',
          content: '哈哈哈阿达哈哈哈哈哈哈哈哈规范与而他哈哈哈哈哈哈哈哈',
          comment_num: '122',
          praise_num: '0'
        },
        {
          id: '5',
          area: '嵩山区',
          content: '哈哈哈阿达哈哈哈哈哈哈哈哈规范与而他哈哈哈哈哈哈哈哈',
          comment_num: '12',
          praise_num: '0'
        }

      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.4rem;
    border-bottom: 1px solid #F2F2F2;
    background: white;
    .name {
      float: left;
      height: 1.4rem;
      width: 2rem;
      text-align: center;
      line-height: 1.4rem;
      font-size: 0.5rem;
    }
    .add {
      width: 1rem;
      height: 1.4rem;
      float: right;
      display: flex;
      align-items: center;
      img {
        width: 0.6rem;
        height: 0.6rem;
      }
    }
  }
  #list {
    padding-top: 1.4rem; 
  }
}
</style>
