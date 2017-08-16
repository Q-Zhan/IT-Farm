<template>
  <div id="Navigation">
    <router-view class="router"></router-view>
    <VFooter />
  </div>
</template>

<script>
import VFooter from '../Common/Footer/Footer.vue'
import { mapState } from 'vuex'
export default {
  components: {
    VFooter
  },
  data () {
    return {
      
    }
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit('add')
      console.log(this.count)
    }, 2000)
    
  },
  computed: mapState([
    'count'
  ])
}
</script>

<style lang="scss" scoped>
.router {
  padding-bottom: 1.5rem;
}
</style>
