import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import './utils/device' // 动态计算rem font-size


// 将参数转为application/x-www-form-urlencoded
axios.interceptors.request.use((config) => {
  config.data = qs.stringify(config.data);
  return config;
}, function(error) {
  return Promise.reject(error);
});
// 使用axios进行数据请求
Vue.use(VueAxios, axios)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
