<template>
  <div id="loading">
    <div class="loading_effect">
      <div><span></span></div>
      <div><span></span></div>
      <div><span></span></div>
      <div><span></span></div>
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
#loading {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading_effect {
    width: 2.6rem;
    height: 2.2rem;
    border-radius: 0.2rem;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 1rem;
      height: 0.6rem;
      position: absolute;
      animation: load 1.8s linear infinite;
      span {
        display: inline-block;
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        background: white;
        position: absolute;
        left: 50%;
        margin-top: -0.3rem;
        margin-left: -0.4rem;
      }
    }
    div:nth-child(1) {
      animation-delay: 0.2s;
    }
    div:nth-child(2) {
      animation-delay: 0.4s;
    }
    div:nth-child(3) {
      animation-delay: 0.6s;
    }
    div:nth-child(4) {
      animation-delay: 0.8s;
    }
  }
}
@keyframes load {
  0%{
    transform: rotate(0deg);
  }
  10%{
    transform: rotate(36deg);
  }
  50%{
    opacity: 1;
    transform: rotate(180deg);
  }
  62%{
    opacity: 0;
  }
  65%{
    opacity: 0;
    transform: rotate(200deg);
  }
  90%{
    transform: rotate(340deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>
