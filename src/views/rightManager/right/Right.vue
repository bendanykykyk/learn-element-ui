<template>
  <div>
    <!--面包屑-->
    <breadcrumb
      :breadcrumbItemList="['权限管理', '权限列表']"
      separator="/"
    ></breadcrumb>

    <!--卡片-->
    <el-card shadow="always">
      <el-table stripe :border="true" :data="rightsList">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template v-slot:default="slotScope">
            <el-tag v-if="slotScope.row.level === '0'">等级一</el-tag>
            <el-tag v-if="slotScope.row.level === '1'" type="success"
              >等级二</el-tag
            >
            <el-tag v-if="slotScope.row.level === '2'" type="warning"
              >等级三</el-tag
            >
            <el-tag v-if="slotScope.row.level === '3'" type="info"
              >等级四</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
//导入网络请求
import { queryRightData } from "network/right";
export default {
  name: "Right",
  data() {
    return {
      rightsList: [],
      rightsType: "list",
    };
  },
  created() {
    this.queryRightData(this.rightsType);
  },
  methods: {
    queryRightData(type) {
      queryRightData(type).then((res) => {
        res.meta.status === 200
          ? (this.rightsList = res.data)
          : this.$message.error(res.meta.msg);
      });
    },
  },
  computed: {},
  components: {
    Breadcrumb,
  },
};
</script>

<style scoped></style>
