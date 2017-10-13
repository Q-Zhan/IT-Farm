<template>
  <div id="app">
    <transition name="fade">
    <router-view></router-view>
    </transition>
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
.fade-enter-active {
  transition: all 0.2s linear;
}
.fade-enter {
   opacity: 0;
   transform:translateX(500px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateX(0px);
}
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
