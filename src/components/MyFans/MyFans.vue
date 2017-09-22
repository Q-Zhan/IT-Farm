<template>
  <div id="myFans">
    <header>
      <span>我的消息</span>
      <img :src="back_arrow" class="back_arrow" @click="turnToBack"/>
    </header>
  </div>
</template>

<script>
import { api } from '../../api'
import { mapState } from 'vuex'
import Loading from '../Common/Loading/Loading.vue'
import back_arrow from './back_arrow.svg'
import avatar_img from './avatar.svg'

export default {
  components: {
    Loading
  },
  data () {
    return {
      back_arrow,
      avatar_img
    }
  },
  computed: mapState({
    isLoading: state => state.isLoading,
    user: state => state.user
  }),
  mounted() {
    
  },
  methods: {
    turnToBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" >
#myFans {
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
  
}
</style>
