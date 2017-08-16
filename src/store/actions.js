export default {
  getData({ commit,state }) {
    setTimeout(function() {
      commit('add')
    }, 3000)
  }
}