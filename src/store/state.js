export default {
  isLoading: false,
  register: {
    registerReply: '',
    registerToast: false //该项为true时说明注册信息无法通过后端检验，需弹框提示
  },
  user: {
    faculty: '',
    gender: '',
    grade: '',
    nname: '',
    secret: '',
    signature: '',
    site: '',
    tmCreated: '',
    uid: '',
    uname: ''
  },
  chat: {
    chatList: [
      // {
      //   chatId: '',
      //   chatName: '',
      //   isRead: false,
      //   message: [
      //     { position: 'left', content: '123', time: '1231231432'}
      //   ]
      // }
    ],
    chatIndex: ''
  },
  socket: {
    stomp: ''
  },
  messageList: [],
  locationList: []
}