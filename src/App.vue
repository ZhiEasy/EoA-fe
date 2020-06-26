<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {getUserInfo} from './api/user'

  export default {
    name: 'App',
    mounted() {
      getUserInfo().then(res => {
        this.$store.state.user_info = res.data;
        if (res.status === 0) {
          this.$router.push("/")
        }
      });
    },
  }
</script>

<style>
</style>
