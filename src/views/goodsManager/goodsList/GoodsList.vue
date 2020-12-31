<template>
  <div>
    <breadcrumb :breadcrumbItemList="['商品管理', '商品列表']"></breadcrumb>
    <el-card shadow="always">
      <!--layout布局，栅格-->
      <el-row :gutter="20">
        <el-col :span="6">
          <!--复合搜索框-->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryGoodsParam.query"
            :clearable="true"
            @clear="queryGoodsData(queryGoodsParam)"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryGoodsData(queryGoodsParam)"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <!--添加用户按钮-->
          <el-button type="primary" @click="goToAddGoodsPage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="100px"
        ></el-table-column>
        <el-table-column label="上传时间" prop="upd_time" width="200px">
          <template v-slot:default="scope">
            {{ uploadTime(scope.row.upd_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditParamsDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteGoodsMessageBox(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
        :pageSizes="pageSizes"
        :pageSize="queryGoodsParam.pagesize"
        :total="total"
        :currentPage="queryGoodsParam.pagenum"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentPageChange"
      >
      </pagination>
    </el-card>
  </div>
</template>

<script>
//导入网络请求
import { queryGoodsData, deleteGoods } from "network/goodsList";
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
import Popup from "components/common/popup/Popup";
import Pagination from "components/common/pagination/Pagination";
//导入工具类
import { formatDate } from "common/utils";
export default {
  name: "GoodsList",
  data() {
    return {
      queryGoodsParam: {
        query: "",
        pagesize: 5,
        pagenum: 1,
      },
      goodsList: [],
      total: 0,
      pageSizes: [1, 2, 5, 10],
    };
  },
  components: {
    Breadcrumb,
    Popup,
    Pagination,
  },
  created() {
    this.queryGoodsData(this.queryGoodsParam);
  },
  computed: {
    uploadTime() {
      return function(time) {
        return formatDate(new Date(time * 1000), "yyyy-MM-dd hh:mm:ss");
      };
    },
  },
  methods: {
    queryGoodsData(paramsObject) {
      queryGoodsData(paramsObject).then((res) => {
        res.meta.status === 200
          ? (() => {
              //将请求到的数据res的data存放到goodsList中存储
              this.goodsList = res.data.goods;
              this.total = res.data.total;
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    handleSizeChange(pagesize) {
      this.queryGoodsParam.pagesize = pagesize;
      this.queryGoodsData(this.queryGoodsParam);
    },
    handleCurrentPageChange(pagenum) {
      this.queryGoodsParam.pagenum = pagenum;
      this.queryGoodsData(this.queryGoodsParam);
    },
    showDeleteGoodsMessageBox(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ///发起删除商品请求
          deleteGoods(row.goods_id).then((res) => {
            res.meta.status === 200
              ? this.queryGoodsData(this.queryGoodsParam)
              : this.$message.error(res.meta.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goToAddGoodsPage() {
      this.$router.push("/goods/addGoods");
    },
  },
};
</script>

<style scoped></style>
