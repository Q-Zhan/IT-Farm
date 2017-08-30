import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/device' // 动态计算rem font-size
import './utils/scroll' // 引入滚动监听库

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
