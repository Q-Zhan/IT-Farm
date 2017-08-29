<template>
  <div id="navigation">
    <router-view class="router"></router-view>
    
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
  },
  mounted() {
    
  }
}
</script>

<style lang="scss" scoped>
#navigation {
  height: 100%;
}
.router {
  height: calc(100% - 1.5rem);
}
</style>
