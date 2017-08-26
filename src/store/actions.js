import { api } from '../api'
import Vue from 'vue'

export default {
  register({ commit, state }, { uname, nname, passwd, rpasswd }) {
    commit('startLoading')
    Vue.axios.post(api + 'api/user/create',{},{
        data: {
          uname,
          nname,
          passwd,
          rpasswd
        }
      })
      .then(res => {
        // console.log(res.data)
        let data = res.data
        // 账号重复
        if (data.message.substring(0,4) == 'User') {
          commit('register', { message: 'user name repeat'})
        }
        // 昵称重复
        if (data.message.substring(0,4) == 'Nick') {
          commit('register', { message: 'nick name repeat'})
        }
        // 注册成功
        if (data.message == '成功') {
          commit('register', { message: 'success'})
        }
        commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        commit('stopLoading')
      })
  },
  login({ commit, state }, { uname, passwd }) {
    commit('startLoading')
    Vue.axios.post(api + 'api/user/login', {}, {
        data: {
          uname,
          passwd
        }
      })
      .then(res => {
        // console.log(res.data)
        let data = res.data
        commit('login', { code: data.code })
        if (data.code == '200') {
          commit('saveUserInfo', data.content)
        }
        commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        commit('stopLoading')
      })
  },
  getMessageList({ commit, state }, { page }) {
    commit('startLoading')
    Vue.axios.get(api + 'api/message/page/' + page)
      .then(res => {
        let data = res.data 
        // console.log(data)
        commit('saveMessageList', { messageList: data.content.messageList })
        commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        commit('stopLoading')
      })
  },
  getLocationList({ commit, state }) {
    Vue.axios.get(api + 'api/locale/list')
      .then(res => {
        let data = res.data 
        // console.log(data)
        commit('saveLocationList', { locationList: data.content.locationList })
      })
      .catch(err => {
        console.log(err)
      })
  }
}