import { api } from '../api'
import { SECRET } from '../constant'
import 'whatwg-fetch'

export default {
  register({ commit, state }, { uname, nname, passwd, rpasswd }) {
    commit('startLoading')
    return fetch(api + '/api/user/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'uname=' + uname + '&' + 'nname=' + nname + '&' + 'passwd=' + passwd + '&' + 'rpasswd=' + rpasswd
    })
    .then((res) => res.json())
    .then((data) => {
      let message = ''
      // 用户名重复
      if (data.message.substring(0,4) == 'User') {
        message = '账号名已被注册' 
      }
      // 昵称重复
      if (data.message.substring(0,4) == 'Nick') {
        message = '昵称已被注册'
      }
      // 注册成功
      if (data.message == '成功') {
        message = '注册成功'
      }
      commit('stopLoading')
      return message
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  login({ commit, state }, { uname, passwd }) {
    commit('startLoading')
    return fetch(api + '/api/user/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'passwd=' + passwd + '&' + 'uname=' + uname
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      if (data.code == '200') {
        commit('saveUserInfo', data.content)
        commit('saveSecret', {secret: data.content.secret})
        localStorage[SECRET] = data.content.secret
      }
      commit('stopLoading')
      return data.code
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  autoLogin({ commit, state }) {
    commit('startLoading')
    fetch(api + '/api/user/me', {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      commit('login', { code: data.code })
      // secret未过期
      if(data.code == 200) {
        commit('saveUserInfo', data.content)
      }
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  logout({ commit, state }) {
    commit('startLoading')
    return fetch(api + '/api/user/logout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      localStorage.removeItem(SECRET)
      commit('logout')
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  getInitializedMessageAndLocationList({ commit, state }) {
    commit('startLoading')
    let time = new Date().getTime()
    let getMessage = fetch(`${api}/api/message/tmbefore/${time}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
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
    let time = state.messageList[0].tmCreated + 1
    return fetch(api + '/api/message/tmafter/' + time, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      if (data.content.messageList.length > 0) {
        commit('addNewMessage', { newMessage: data.content.messageList })
      }
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  getOldMessage({ commit, state }) {
    let messageList = state.messageList
    let time = messageList[messageList.length - 1].tmCreated - 1
    return fetch(api + '/api/message/tmbefore/' + time, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      if (data.content.messageList.length > 0) {
        commit('addOldMessage', { oldMessage: data.content.messageList })
      }
      return data.content.messageList.length
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  changeMessagePraiseNum({ commit, state }, {index}) {
    commit('startLoading')
    let mid = state.messageList[index].mid
    fetch(api + '/api/message/likee/' + mid, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      commit('changeMessagePraiseNum', {index})
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  modifyUserInfo({ commit, state }, { item, value }) {
    commit('startLoading')
    fetch(api + '/api/user/profile/edit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      },
      body: item + '=' + value
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      commit('modifyUserInfo', {item, value})
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  }
}