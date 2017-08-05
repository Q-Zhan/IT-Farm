<template>
  <div id="foo">
    <router-link :to="{path: '/bar'}">跳转</router-link>
    foo
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
#foo {
  width: 100px;
  height: 800px;
  background: red;
  display: flex;
}
</style>
