<template>
  <transition name="fade">
    <div id="toast" v-show="isShowed">
      <div class="message">
        {{ message }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      message: '',
      isShowed: false
    }
  },
  methods: {
    showToast(message) {
      this.message = message
      this.isShowed = true
      setTimeout(() => {
        this.isShowed = false
      }, 1400)
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.4s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
#toast {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .message {
    text-align: center;
    color: white;
    background: gray;
    font-size: 0.4rem;
    padding: 0.3rem 0.3rem;
    border-radius: 0.1rem;
    letter-spacing: 1px;
  }
}
</style>
