<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :layout="layout"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default() {
        return [1, 2, 5, 10];
      },
    },
    pageSize: {
      type: Number,
      default: 1,
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleSizeChange(pageSize) {
      this.$emit("handleSizeChange", pageSize);
    },
    handleCurrentChange(currentPage) {
      this.$emit("handleCurrentChange", currentPage);
    },
  },
};
</script>

<style scoped></style>
