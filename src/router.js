import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home/Home.vue'
import User from './components/User/User.vue'
import Message from './components/Message/Message.vue'

// 异步载入
// const Bar = resolve => require(['./components/Bar.vue'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/message',
      component: Message
    },
    {
      path: '/user',
      component: User
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition
  }
})