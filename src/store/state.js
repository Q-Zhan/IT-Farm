export default {
  isLoading: false,
  register: {
    registerReply: '',
    registerToast: false //该项为true时说明注册信息无法通过后端检验，需弹框提示
  },
  login: {
    loginReply: '',
    loginToast: false
  },
  user: {
    secret: '',
    uid: '',
    uname: '',
    nname: ''
  },
  messageList: [],
  locationList: []
}