<template>
  <div id="Chat">
    <header>
      <div class="img"><img :src="back_arrow"/></div>
      <span>你好吗</span>
    </header>
  </div>
</template>

<script>
import back_arrow from './back_arrow.svg'

export default {
  data () {
    return {
      back_arrow
    }
  }
}
</script>

<style lang="scss" scoped>
#Chat {
  width: 100%;
  height: 100%;
  header {
    position: relative;
    height: 1.4rem;
    text-align: center;
    line-height: 1.4rem;
    font-size: 0.4rem;
    background: white;
    border-bottom: 1px solid #D6D6D6;
    .img {
      width: 0.54rem;
      height: 0.5rem;
      position: absolute;
      top: 0.1rem;
      left: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
