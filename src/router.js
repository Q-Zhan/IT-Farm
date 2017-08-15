import Vue from 'vue'
import Router from 'vue-router'
import Navigation from './components/Navigation/Navigation.vue'
import Home from './components/Home/Home.vue'
import User from './components/User/User.vue'
import Message from './components/Message/Message.vue'
import Detail from './components/Detail/Detail.vue'

// 异步载入
// const Bar = resolve => require(['./components/Bar.vue'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/app/home'
    },
    {
      path: '/app', component: Navigation,
      children: [
        { path: 'home', component: Home },
        { path: 'message', component: Message },
        { path: 'user', component: User }
      ]
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: Detail
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition
  }
})