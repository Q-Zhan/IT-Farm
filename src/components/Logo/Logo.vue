<template>
  <div id="logo">
    <header>
      <div class="logo_name">
        <img src="./logo.png"/>
        <span>匿密</span>
      </div>
      <div class="subhead">
        华农人的<br/>匿名朋友圈
      </div>
    </header>
    <div class="register">
      <div class="register_button">
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
    <div class="login">
      <router-link to="/login">已有账号? 点此登录</router-link>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
#logo {
  width: 100%;
  height: 100%;
  background: url('./timg.jpg') no-repeat;
  background-size: cover;
  display: inline-block;
  position: relative;
  header {
    margin-top: 3.5rem;
    width: 100%;
    .logo_name {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      letter-spacing: 0.15rem;
      color: white;
      font-weight: 600;
      img {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 0.25rem;
        margin-right: 0.5rem;
      }
    }
    .subhead {
      width: 100%;
      margin-top: 0.2rem;
      text-align: center;
      color: white;
      font-size: 0.55rem;
      letter-spacing: 0.45rem;
      line-height: 0.8rem;
    }
  }
  .register {
    width: 100%;
    height: 1.1rem;
    position: absolute;
    bottom: 1.5rem;
    .register_button {
      width: 68%;
      margin: 0 auto;
      height: 1.1rem;
      line-height: 1.1rem;
      font-size: 0.45rem;
      letter-spacing: 1px;
      text-align: center;
      background: #007ACC;
      border-radius: 0.12rem;
    }
    a {
      color: white;
    }
  }
  .login {
    width: 100%;
    position: absolute;
    bottom: 0.6rem;
    text-align: center;
    font-size: 0.35rem;
    letter-spacing: 2px;
    a {
      color: white;
    }
  }
}
</style>
