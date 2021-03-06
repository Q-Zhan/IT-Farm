import { api, api_scau } from '../api'
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
  login({ commit, state }, { uname, passwd, isAutoLogin }) {
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
        commit('saveUserInfo', data.content.user)
        commit('saveSecret', {secret: data.content.secret})
        if (isAutoLogin) {
          localStorage[SECRET] = data.content.secret
        } else {
          localStorage[SECRET] = 'noAutoLogin'
        }
      }
      commit('stopLoading')
      return data.code
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  // 第三方登录，外网无法访问学校内网，所以关闭该功能
  hometownLogin({ commit, state }, { uname, passwd, hmtUid, isAutoLogin }) {
    commit('startLoading')
    return fetch(api_scau + '/api/OAuth2/bind', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'passwd=' + passwd + '&' + 'uname=' + uname + '&' + 'hmtUid=' + hmtUid
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      if (data.code == '200') {
        commit('saveUserInfo', data.content.user)
        commit('saveSecret', {secret: data.content.secret})
        if (isAutoLogin) {
          localStorage[SECRET] = data.content.secret
        } else {
          localStorage[SECRET] = 'noAutoLogin'
        }
      }
      commit('stopLoading')
      return data.code
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  hometownRegister({ commit, state }, {uname, nname, passwd, rpasswd, hmtUid}) {
    localStorage[SECRET] = 'noAutoLogin'
    commit('startLoading')
    return fetch(api_scau + '/api/OAuth2/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'passwd=' + passwd + '&' + 'uname=' + uname + '&' + 'hmtUid=' + hmtUid + '&' + 'nname=' + nname + '&' + 'rpasswd=' + rpasswd 
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      if (data.code == '200') {
        commit('saveUserInfo', data.content.user)
        commit('saveSecret', {secret: data.content.secret})
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
    return fetch(api + '/api/user/me', {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      // secret未过期
      if(data.code == 200) {
        commit('saveUserInfo', data.content)
        commit('saveSecret', {secret: localStorage[SECRET]})
      }
      commit('stopLoading')
      return data.code
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
      localStorage.removeItem(SECRET)
      commit('logout')
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  getMessageListAndLocationList({ commit, state }) {
    commit('startLoading')
    let time = new Date().getTime()
    let getMessage =  fetch(`${api}/api/message/tmbefore/${time}`, {
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
  getNewMessage({ commit, state }, { condition, isLoading }) {
    if (isLoading) {
      commit('startLoading')
    }
    let time = new Date().getTime()
    let url = ''
    if (condition == '全部') {
      url = '/api/message/tmbefore/'
    } else if (condition == '我的关注') {
      url = '/api/message/attention/tmbefore/'
    } else {
      for (let i = 0, len = state.locationList.length; i < len; i++) {
        if (state.locationList[i].locale == condition) {
          let lid = state.locationList[i].lid
          url = `/api/message/lid/${lid}/tmbefore/`
        }
      }
    }
    return fetch(api + url + time, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      commit('getNewMessage', { newMessage: data.content.messageList })
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  getOldMessage({ commit, state }, { condition }) {
    let messageList = state.messageList
    let time = messageList[messageList.length - 1].tmCreated - 1
    let url = ''
    if (condition == '全部') {
      url = '/api/message/tmbefore/'
    } else if (condition == '我的关注') {
      url = '/api/message/attention/tmbefore/'
    } else {
      for (let i = 0, len = state.locationList.length; i < len; i++) {
        if (state.locationList[i].locale == condition) {
          let lid = state.locationList[i].lid
          url = `/api/message/lid/${lid}/tmbefore/`
        }
      }
    }
    return fetch(api + url + time, {
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
    })
  },
  changeMessagePraiseNum({ commit, state }, {mid}) {
    commit('startLoading')
    fetch(api + '/api/likee/message/' + mid, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      commit('changeMessagePraiseNum', {mid})
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
  },
  getUserInfo({ commit, state }) {
    commit('startLoading')
    return fetch(api + '/api/user/me', {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': localStorage[SECRET]
      }
    })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data)
      commit('saveUserInfo', data.content)
      commit('saveSecret', { secret: localStorage[SECRET]})
      commit('stopLoading')
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  },
  getChatAvatar( { commit, state }, { uname, index }) {
    commit('startLoading')
    return fetch(api + '/api/user/profile/' + uname, {
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'janke-authorization': state.user.secret
      }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.content.user.userPic && data.content.user.userPic.webPath) {
        commit('saveChatAvatar', { webPath: data.content.user.userPic.webPath, index})
        commit('stopLoading')
        return data.content.user.userPic.webPath
      } else {
        commit('stopLoading')
        return 'avatar'
      }
    })
    .catch(err => {
      console.log(err)
      commit('stopLoading')
    })
  }
}