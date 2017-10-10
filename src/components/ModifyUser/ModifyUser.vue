<template>

  <div id="modifyUser">
    <header>
      <img :src="back_arrow" @click="turnToBack"/>
      <span>更改信息</span>
      <div class="save_button" @click="modify">保存</div>
    </header>
    <div class="modify_input">
      <input type="text" class="input" maxlength="30" v-model="input_content" >
    </div>
    <div class="hint">
      {{ 30 - input_content.length}}
    </div>
  </div>

</template>

<script>
import back_arrow from './back_arrow_white.svg'

export default {
  data () {
    return {
      back_arrow,
      input_content: ''
    }
  },
  computed: {
    item() {
      return this.$route.params.item
    },
    isLoading() {
      return this.$store.state.isLoading
    },
    user() {
      return this.$store.state.user
    }
  },
  mounted() {
    if (!this.user.secret) {
      this.$router.push('/app/home')
    }
  },
  watch: {
    isLoading: function(newValue) {
      if (newValue == false) {
        this.turnToBack()
      }
    }
  },
  methods: {
    turnToBack() {
      this.$router.go(-1)
    },
    modify() {
      if (this.input_content != '') {
        this.$store.dispatch('modifyUserInfo', { item: 'signature', value: this.input_content})
      }
    }
  }
}
</script>

<style lang="scss">

#modifyUser {
  header {
    width: 100%;
    height: 1.4rem;
    border-bottom: 1px solid #D6D6D6;
    background: #3A393E;
    color: white;
    display: flex;
    align-items: center;
    position: relative;
    img {
      width: 0.54rem;
      height: 0.5rem;
      margin-left: 0.45rem;
    }
    span {
      display: inline-block;
      margin-left: 0.4rem;
      font-size: 0.5rem;
    }
    .save_button {
      position: absolute;
      right: 0.3rem;
      top: 0.35rem;
      width: 1.7rem;
      height: 0.8rem;
      background: #007ACC;
      color: white;
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.4rem;
      border-radius: 0.1rem;
    }
  }
  .modify_input {
    width: 90%;
    margin: 0 auto;
    margin-top: 0.5rem;
    .input {
      width: 100%;
      height: 0.8rem;
      font-size: 0.45rem;
      letter-spacing: 1px;
      outline: none;
      border: 1px solid #007ACC;
      background: white;
    }
  }
  .hint {
    width: 88%;
    margin: 0 auto;
    margin-top: 0.15rem;
    text-align: right;
    color: gray;
    font-size: 0.35rem;
    letter-spacing: 1px;
  }
}
</style>
