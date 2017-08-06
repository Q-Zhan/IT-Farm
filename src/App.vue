<template>
  <div id="app">
    <router-view class="router"></router-view>
    <VFooter />
  </div>
</template>

<script>
import VFooter from './components/Common/Footer/Footer.vue'
export default {
  name: 'app',
  components: {
    VFooter
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
.router {
  padding-bottom: 1.5rem;
}
a {
  text-decoration: none;
  color: black;
}
.clear {
  clear: both;
  height: 0px;
  font-size: 0;
}
</style>
