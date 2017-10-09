export default {
  isLoading: false,
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
      //   chatUname: '',
      //   chatAvatar: '',
      //   chatNname: '',
      //   isRead: false,
      //   message: [
      //     { position: 'left', content: '123', time: '1231231432'}
      //   ]
      // }
    ],
    chatIndex: ''
  },
  socket: {
    stomp: '',
    newPraise: {
      isRead: true,
      praises: []
    },
    newComment: {
      isRead: true,
      comments: []
    },
  },
  messageList: [],
  locationList: []
}