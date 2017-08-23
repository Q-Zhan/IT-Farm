export default {
  startLoading(state) {
    state.isLoading = true
  },
  stopLoading(state) {
    state.isLoading = false
  },
  register(state, { message }) {
    state.register.registerReply = message
    state.register.registerToast = true
  },
  registerToasted(state) {
    state.register.registerToast = false
  },
  login(state, { code }) {
    if (code == '-500') {
      state.login.loginReply = 'failed'
    }
    if (code == '200') {
      state.login.loginReply = 'success'
    }
    state.login.loginToast = true
  },
  loginToasted(state) {
    state.login.loginToast = false
  },
  saveUserInfo(state, content) {
    let user = state.user 
    user.secret = content.secret
    user.uid = content.user.uid 
    user.uname = content.user.uname 
    user.nname = content.user.nname 
  }
}