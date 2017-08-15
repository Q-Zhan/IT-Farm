<template>
  <div id="Navigation">
    <router-view class="router"></router-view>
    <VFooter />
  </div>
</template>

<script>
import VFooter from '../Common/Footer/Footer.vue'
export default {
  components: {
    VFooter
  },
  data () {
    return {
      
    }
  }
  
}
</script>

<style lang="scss" scoped>
.router {
  padding-bottom: 1.5rem;
}
</style>
