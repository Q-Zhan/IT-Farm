import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/device' // 动态计算rem font-size

// 引入picker组件
import picker from 'vue-3d-picker';
Vue.component(picker.name, picker);

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

