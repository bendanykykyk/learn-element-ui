<template>
  <div>
    <!--面包屑-->
    <breadcrumb
      sperator="/"
      :breadcrumbItemList="['订单管理', '订单列表']"
    ></breadcrumb>
    <!--卡片-->
    <el-card>
      <!--复合搜索框-->
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="ordersQuery.query"
            :clearable="true"
            @clear="queryOrdersList(ordersQuery)"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryOrdersList(ordersQuery)"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="orders" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="order_id" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.pay_status === '1'">是</el-tag>
            <el-tag v-if="scope.row.pay_status === '0'" type="danger"
              >否</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template v-slot:default="scope">
            {{ createTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作列">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditAddressDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showKuaiDi(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="ordersQuery.pagenum"
        :pageSize="ordersQuery.pagesize"
        :total="total"
      ></pagination>
    </el-card>
    <!--编辑地址对话框-->
    <popup
      title="编辑地址"
      :dialogVisible="addressDialogVisible"
      width="50%"
      @handleClose="handleClose"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRule"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address"></el-input>
        </el-form-item>
        <el-form-item label="省/市/区" prop="address2">
          <el-cascader
            size="large"
            :options="options"
            v-model="addressForm.address2"
            @change="handleCasChange"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
    </popup>
    <!--展示物流信息对话框-->
    <popup
      title="物流信息"
      :dialogVisible="kuaiDiDialogVisible"
      width="50%"
      @handleClose="handleKuaiDiClose"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in kuaiDiForm"
          :key="index"
          :timestamp="item.ftime"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </popup>
  </div>
</template>

<script>
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
import Pagination from "components/common/pagination/Pagination";
import Popup from "components/common/popup/Popup";
//导入省市区
import { regionData } from "element-china-area-data";
//导入网络请求
import { queryOrdersList, queryKuaiDi } from "network/ordersList";
//导入工具类
import { formatDate } from "common/utils";
export default {
  name: "OrderList",
  components: {
    Breadcrumb,
    Pagination,
    Popup,
  },
  data() {
    return {
      ordersQuery: {
        query: "",
        pagenum: 1,
        pagesize: 5,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        consignee_addr: "",
      },
      orders: [],
      total: 0,
      addressDialogVisible: false,

      //城市三级联动
      selectedOptions: [],
      options: regionData,

      addressForm: {
        address: "",
        address2: "",
      },
      addressFormRule: {
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        address2: [
          { required: true, message: "请选择省市区", trigger: "blur" },
        ],
      },
      kuaiDiDialogVisible: false,
      kuaiDiForm: [],
    };
  },
  created() {
    this.queryOrdersList(this.ordersQuery);
  },
  computed: {
    createTime() {
      return function(time) {
        return formatDate(new Date(time * 1000), "yyyy-MM-dd hh:mm:ss");
      };
    },
  },
  methods: {
    queryOrdersList(paramsObject) {
      queryOrdersList(paramsObject).then((res) => {
        res.meta.status === 200
          ? (() => {
              this.orders = res.data.goods;
              this.total = res.data.total;
              this.ordersQuery.pagenum = 1;
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    handleSizeChange(pageSize) {
      this.ordersQuery.pagesize = pageSize;
      this.queryOrdersList(this.ordersQuery);
    },
    handleCurrentChange(currentPage) {
      this.ordersQuery.pagenum = currentPage;
      this.queryOrdersList(this.ordersQuery);
    },
    showEditAddressDialog() {
      this.addressDialogVisible = true;
    },
    handleClose() {
      this.$refs.addressFormRef.resetFields();
      this.addressDialogVisible = false;
    },
    handleKuaiDiClose() {
      this.kuaiDiDialogVisible = false;
    },
    handleCasChange() {},
    showKuaiDi(row) {
      // 1106975712662
      this.kuaiDiDialogVisible = true;
      //查询物流信息
      queryKuaiDi("1106975712662").then((res) => {
        res.meta.status === 200
          ? (this.kuaiDiForm = res.data)
          : this.$message.error(res.meta.msg);
      });
    },
  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
