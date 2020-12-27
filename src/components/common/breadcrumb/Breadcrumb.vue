<template>
  <el-breadcrumb :separator="separator">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbItemList"
      :key="index"
      >{{ item }}</el-breadcrumb-item
    >
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    breadcrumbItemList: {
      type: Array,
      default() {
        return [];
      },
    },
    separator: {
      type: String,
      default: "/",
    },
  },
};
</script>

<style scoped></style>
