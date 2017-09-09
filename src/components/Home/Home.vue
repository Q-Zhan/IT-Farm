<template>
  <div id="home">
    <header>
      <div class="name">匿密</div>
      <div class="add"><img :src="add_img" @click="openAreaOption"/></div>
      <div class="clear"></div>
    </header>
    <div class="area_option" v-if="isAreaOptionOpend" @click="closeAreaOption">
      <div class="area_list">
        <div v-for="(item, index) in locationList" :key="item.lid" class="area_item" >
          <router-link :to="{name: 'createMessage', params: { area : item.lid }}">
            <div :style="{ borderBottom: index == locationList.length-1 ? '0' : '1px solid black'}">
              {{ item.locale }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <List :items="messages"/>
    <Loading v-show="isLoading"/>
  </div>
</template>

<script>
import List from '../Common/List/List.vue'
import Loading from '../Common/Loading/Loading.vue'
import add_img from './add.svg'

export default {
  components: {
    List,
    Loading
  },
  data () {
    return {
      add_img,
      isAreaOptionOpend: false
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    messageList() {
      return this.$store.state.messageList
    },
    locationList() {
      return this.$store.state.locationList
    },
    messages() {
      let arr = []
      let messageList = this.messageList
      for (let i = 0, len = messageList.length; i < len; i++) {
        arr[i] = {
          id: messageList[i].mid,
          name: messageList[i].isFake ? '楼主' : messageList[i].user.nname,
          area: messageList[i].location.locale,
          content: messageList[i].content,
          comment_num: messageList[i].commentCount,
          praise_num: messageList[i].likeCount,
          images: messageList[i].messageImageSet
        }
      }
      return arr
    }
  },
  mounted() {
    if (this.messageList.length == 0) { // 第一次进入
      this.$store.dispatch('getInitializedMessageAndLocationList', { page: 0 })
    }
    
  },
  methods: {
    openAreaOption() {
      this.isAreaOptionOpend = true
      // 屏蔽滚动
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    },
    closeAreaOption() {
      this.isAreaOptionOpend = false
      // 恢复滚动
      document.getElementsByTagName('body')[0].style.overflow = 'auto'
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
    border-bottom: 1px solid #D6D6D6;
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
  .area_option {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 90;
    .area_list {
      width: 2.6rem;
      position: fixed;
      z-index: 91;
      right: 0.9rem;
      top: 0.8rem;
      background: white;
      border: 1px solid gray;
      box-shadow: 0.05rem 0.05rem 0.05rem 2px gray;
      .area_item div {
        width: 80%;
        margin: 0 auto;
        height: 1.2rem;
        border-bottom: 1px solid black;
        color: #252526;
        line-height: 1.2rem;
        text-align: center;
        font-size: 0.5rem;
      }
    }
  }
  #list {
    padding-top: 1.4rem; 
  }
}
</style>