import Vue from 'vue'
import Router from 'vue-router'
import Foo from './components/Foo.vue'
import Bar from './components/Bar.vue'
// 异步载入
// const Bar = resolve => require(['./components/Bar.vue'], resolve)

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/foo',
      component: Foo
    },
    {
      path: '/bar',
      component: Bar
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return savedPosition
  }
})