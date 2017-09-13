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
      state.login.loginReply = '账号或密码错误'
    }
    if (code == '200') {
      state.login.loginReply = '登录成功'
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
  },
  saveLocationList(state, { locationList }) {
    state.locationList = locationList
  },
  saveMessageList(state, { messageList }) {
    state.messageList = messageList
  },
  addNewMessage(state, { newMessage }) {
    state.messageList = newMessage.concat(state.messageList)
  },
  addOldMessage(state, { oldMessage }) {
    state.messageList = state.messageList.concat(oldMessage)
  },
  addCommentCount(state, { index, count }) {
    state.messageList[index].commentCount = count
  },
  connectSocket(state, { stomp }) {
    state.socket.stomp = stomp
  },
  addChat(state, { receiverId, receiverName }) {
    state.chat.chatList.push({
      chatId: receiverId,
      chatName: receiverName,
      message: []
    })
  },
  receiveChatMessage(state, { chatMsg }) {
    let len = state.chat.chatList.length
    let flag = 0
    for (let i = 0; i < len; i++) {
      if (state.chat.chatList[i].chatId == chatMsg.senderId) {
        state.chat.chatList[i].message.push({position: 'left', content: chatMsg.content})
        flag = 1
        break
      }
    }
    if (flag == 0) {
      state.chat.chatList.push({
        chatId: chatMsg.senderId,
        chatName: chatMsg.sender,
        message: [
          {position: 'left', content: chatMsg.content}
        ]
      })
    }
  },
  addChatMessage(state, { chatIndex, content}) {
    state.chat.chatList[chatIndex].message.push({
      position: 'right',
      content: content
    })
  }
}