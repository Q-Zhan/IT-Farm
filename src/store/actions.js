import { api } from '../api'
import 'whatwg-fetch'

export default {
  register({ commit, state }, { uname, nname, passwd, rpasswd }) {
    commit('startLoading')
    fetch(api + '/api/user/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'uname=' + uname + '&' + 'nname=' + nname + '&' + 'passwd=' + passwd + '&' + 'rpasswd=' + rpasswd
    })
    .then((res) => res.json())
    .then((data) => {
      // 用户名重复
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
    fetch(api + '/api/user/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'passwd=' + passwd + '&' + 'uname=' + uname
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
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
  getMessageAndLocationList({ commit, state }, { page }) {
    commit('startLoading')
    let getMessage = fetch(api + '/api/message/page/' + page + '?page=' + page, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    let getLocation = fetch(api + '/api/locale/list', {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    Promise.all([getMessage, getLocation])
      .then(async (data) => {
        let message_data = await data[0].json();
        let location_data = await data[1].json();
        commit('saveMessageList', { messageList: message_data.content.messageList })
        commit('saveLocationList', { locationList: location_data.content.locationList })
        commit('stopLoading')
      })
      .catch(err => {
        console.log(err)
        commit('stopLoading')
      })
  },
  getNewMessage({ commit, state }) {
    commit('startLoading')
    let time = state.messageList[0].tmCreated + 1
    fetch(api + '/api/message/tmafter/' + time, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      if (data.content.messageList.length > 0) {
        commit('addNewMessage', { newMessage: data.content.messageList })
      }
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  getOldMessage({ commit, state }) {
    commit('startLoading')
    let messageList = state.messageList
    let time = messageList[messageList.length - 1].tmCreated - 1
    fetch(api + '/api/message/tmbefore/' + time, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      if (data.content.messageList.length > 0) {
        commit('addOldMessage', { oldMessage: data.content.messageList })
      }
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  }
}