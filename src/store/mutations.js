export default {
  startLoading(state) {
    state.isLoading = true
  },
  stopLoading(state) {
    state.isLoading = false
  },
  logout(state) {
    state.user.secret = '注销'
  },
  saveUserInfo(state, content) {
    state.user = content
  },
  saveSecret(state, { secret }) {
    state.user.secret = secret
  },
  saveLocationList(state, { locationList }) {
    state.locationList = locationList
  },
  saveMessageList(state, { messageList }) {
    state.messageList = messageList.map((item, index) => {
      item.isPraised = item.likee == null ? false : true
      return item
    })
  },
  getNewMessage(state, { newMessage }) {
    state.messageList = newMessage
  },
  addOldMessage(state, { oldMessage }) {
    state.messageList = state.messageList.concat(oldMessage)
  },
  addCommentCount(state, { index, num }) {
    state.messageList[index].commentCount += num
  },
  connectSocket(state, { stomp }) {
    state.socket.stomp = stomp
  },
  addChat(state, { receiverId, receiverName }) {
    state.chat.chatList.push({
      chatId: receiverId,
      chatName: receiverName,
      isRead: false,
      message: []
    })
  },
  receiveChatMessage(state, { chatMsg }) {
    let len = state.chat.chatList.length
    let flag = 0
    for (let i = 0; i < len; i++) {
      if (state.chat.chatList[i].chatId == chatMsg.senderId) {
        state.chat.chatList[i].message.push({position: 'left', content: chatMsg.content, time: chatMsg.time})
        state.chat.chatList[i].isRead = false
        flag = 1
        break
      }
    }
    if (flag == 0) {
      state.chat.chatList.push({
        chatId: chatMsg.senderId,
        chatName: chatMsg.sender,
        isRead: false,
        message: [
          {position: 'left', content: chatMsg.content, time: chatMsg.time}
        ]
      })
    }
  },
  addChatMessage(state, { chatIndex, content}) {
    state.chat.chatList[chatIndex].message.push({
      position: 'right',
      content: content,
      time: new Date().getTime()
    })
  },
  changeChatRead(state, { chatIndex }) {
    state.chat.chatList[chatIndex].isRead = true
  },
  changeMessagePraiseNum(state, {index}) {
    if (state.messageList[index].isPraised) {
      state.messageList[index].likeCount -= 1
    } else {
      state.messageList[index].likeCount += 1
    }
    state.messageList[index].isPraised = !state.messageList[index].isPraised
  },
  modifyUserInfo(state, {item, value}) {
    state.user[item] = value
  }
}