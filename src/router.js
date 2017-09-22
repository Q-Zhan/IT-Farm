import Vue from 'vue'
import Router from 'vue-router'
import { SECRET } from './constant'
import Navigation from './components/Navigation/Navigation.vue'
import Home from './components/Home/Home.vue'
import User from './components/User/User.vue'
import Detail from './components/Detail/Detail.vue'
import Logo from './components/Logo/Logo.vue'
import Register from './components/Register/Register.vue'
import Login from './components/Login/Login.vue'
import CreateMessage from './components/CreateMessage/CreateMessage.vue'
import Chat from './components/Chat/Chat.vue'
import ChatList from './components/ChatList/ChatList.vue'
import UserDetail from './components/UserDetail/UserDetail.vue'
import ModifyUser from './components/ModifyUser/ModifyUser.vue'
import PersonPage from './components/PersonPage/PersonPage.vue'
import MyMessage from './components/MyMessage/MyMessage.vue'
import MyFans from './components/MyFans/MyFans.vue'
import MyConcern from './components/MyConcern/MyConcern.vue'


// 异步载入
// const Bar = resolve => require(['./components/Bar.vue'], resolve)

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/', redirect: '/logo'
    },
    {
      path: '/app', component: Navigation,
      children: [
        { path: 'home', component: Home },
        { path: 'chatList', component: ChatList },
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
      path: '/chat/:chatIndex',
      name: 'chat',
      component: Chat
    },
    {
      path: '/userDetail',
      component: UserDetail
    },
    {
      path: '/modifyUser/:item',
      component: ModifyUser,
      name: 'modifyUser'
    },
    {
      path: '/personPage/:uname',
      component: PersonPage,
      name: 'personPage'
    },
    {
      path: '/myConcern',
      component: MyConcern
    },
    {
      path: '/myFans',
      component: MyFans
    },
    {
      path: '/myMessage',
      component: MyMessage
    }
  ]
})
router.beforeEach((to, from, next) => {
  if(localStorage[SECRET]) {
    next()
  } else {
    // 处于已注销状态或第一次进入时，只能跳到logo、login、register
    if(to.path == '/' || to.path == '/logo' || to.path == '/register' || to.path == '/login') {
      next()
    } else {
      next('/logo')
    }
  }
})

export default router