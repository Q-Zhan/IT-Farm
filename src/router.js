import Vue from 'vue'
import Router from 'vue-router'
import Navigation from './components/Navigation/Navigation.vue'
import Home from './components/Home/Home.vue'
import User from './components/User/User.vue'
import Message from './components/Message/Message.vue'
import Detail from './components/Detail/Detail.vue'
import Logo from './components/Logo/Logo.vue'
import Register from './components/Register/Register.vue'
import Login from './components/Login/Login.vue'
import CreateMessage from './components/CreateMessage/CreateMessage.vue'
import Chat from './components/Chat/Chat.vue'

// 异步载入
// const Bar = resolve => require(['./components/Bar.vue'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/logo'
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
      path: '/detail/:index',
      name: 'detail',
      component: Detail
    },
    {
      path: '/logo',
      component: Logo
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/createMessage/:area',
      name: 'createMessage',
      component: CreateMessage
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition
  }
})