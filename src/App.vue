<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      
    }
  },
  mounted() {
    document.getElementsByTagName('body')[0].contentEditable = false
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  user-select:  none !important;
}
#app {
  height: 100%;
  width: 100%;
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
