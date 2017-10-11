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
  addCommentCount(state, { mid, num }) {
    for (let i = 0, len = state.messageList.length; i < len; i++) {
      if (state.messageList[i].mid == mid) {
        state.messageList[i].commentCount += num
      }
    }
  },
  connectSocket(state, { stomp }) {
    state.socket.stomp = stomp
  },
  addChat(state, { receiverId, Nname, Uname }) {
    state.chat.chatList.push({
      chatId: receiverId,
      chatNname: Nname,
      chatUname: Uname,
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
        chatNname: chatMsg.nSender,
        chatUname: chatMsg.sender,
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
  receiveNoticeMessage(state, { noticeMsg }) {
    if (noticeMsg.ntcType == 'mLikee' || noticeMsg.ntcType == 'cLikee') {
      state.socket.newPraise.praises.push(noticeMsg)
      state.socket.newPraise.isRead = false
    } else {
      state.socket.newComment.comments.push(noticeMsg)
      state.socket.newComment.isRead = false
    }
  },
  changeNoticeRead(state, { type }) {
    type == 'comment' ? state.socket.newComment.isRead = true : state.socket.newPraise.isRead = true
  },
  changeMessagePraiseNum(state, {mid}) {
    if (state.messageList) {
      for (let i = 0, len = state.messageList.length; i < len; i++) {
        if (state.messageList[i].mid == mid) { //找到需要改变点赞状态的message
          if (state.messageList[i].likee) {
            state.messageList[i].likee.like ? state.messageList[i].likeCount -= 1 : state.messageList[i].likeCount += 1
            state.messageList[i].likee.like = !state.messageList[i].likee.like
          } else {
            state.messageList[i].likee = {like: true}
            state.messageList[i].likeCount += 1
          }
        }
      }
    }
  },
  modifyUserInfo(state, {item, value}) {
    state.user[item] = value
  },
  saveUserPic(state, { webPath, imageid }) {
    if(state.user.userPic) {
      state.user.userPic.webPath = webPath
    } else {
      state.user.userPic = {
        delete: false,
        imageid: imageid,
        webPath: webPath
      }
    }
  },
  saveChatAvatar(state, { webPath, index}) {
    state.chat.chatList[index].chatAvatar = webPath
  },
  changeMessageCondition(state, { value }) {
    state.messageCondition = value
  },
  changeFooterChosen(state, {value }) {
    state.footerChosen = value
  }
}