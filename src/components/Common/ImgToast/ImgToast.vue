<template>
  <div id="ImgToast" v-show="isShowed" @click="close">
    <img :src="src" @click.stop/>
  </div>
</template>

<script>

export default {
  props: [
    'src'
  ],
  data () {
    return {
      isShowed: false
    }
  },
  methods: {
    open() {
      this.isShowed = true
    },
    close() {
      this.isShowed = false
    }
  }
}
</script>

<style lang="scss" scoped>
#ImgToast {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  img {
    max-width: 100%;
    min-width: 50%;
  }
}
</style>
