import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './utils/device' // 动态计算rem font-size

// 使用axios进行数据请求
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
