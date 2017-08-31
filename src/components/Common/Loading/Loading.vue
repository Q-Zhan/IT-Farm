<template>
  <div id="loading">
    <div class="loading_effect">
      <div></div>
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

<style lang="scss">
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
      height: 1rem;
      border-radius: 50%;
      border: 0.1rem solid;
      border-color: white white transparent transparent;
      animation: load 1.5s linear infinite;
    }
  }
}

@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
