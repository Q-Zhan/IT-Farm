import Vue from 'vue'
import Router from 'vue-router'
import { SECRET } from './constant'
const Navigation = () => import('./components/Navigation/Navigation.vue')
const Home = () => import('./components/Home/Home.vue')
const User = () => import('./components/User/User.vue')
const Detail = () => import('./components/Detail/Detail.vue')
const Logo = () => import('./components/Logo/Logo.vue')
const Register = () => import('./components/Register/Register.vue')
const Login = () => import('./components/Login/Login.vue')
const CreateMessage = () => import('./components/CreateMessage/CreateMessage.vue')
const Chat = () => import('./components/Chat/Chat.vue')
const ChatList = () => import('./components/ChatList/ChatList.vue')
const UserDetail = () => import('./components/UserDetail/UserDetail.vue')
const ModifyUser = () => import('./components/ModifyUser/ModifyUser.vue')
const PersonPage = () => import('./components/PersonPage/PersonPage.vue')
const MyMessage = () => import('./components/MyMessage/MyMessage.vue')
const MyFans = () => import('./components/MyFans/MyFans.vue')
const MyConcern = () => import('./components/MyConcern/MyConcern.vue')
const Notice = () => import('./components/Notice/Notice.vue')


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
      path: '/detail/:mid',
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
      path: '/createMessage',
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
    },
    {
      path: '/notice/:type',
      component: Notice,
      name: 'notice'
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