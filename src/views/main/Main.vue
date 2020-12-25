<template>
  <div>
    我是首页
    <el-button type="info" @click="exitLogin" round>退出</el-button>
  </div>
</template>

<script>
export default {
  name: "Main",
  methods: {
    exitLogin() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped></style>
