<template>
  <div>
    <breadcrumb :breadcrumbItemList="['商品管理', '商品分类']"></breadcrumb>
    <el-card>
      <!--添加分类按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCategoryDialog"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!--表格-->
      <el-table
        :data="goodsCategoriesList"
        border
        row-key="cat_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template v-slot:default="slotScope">
            <i
              v-if="slotScope.row.cat_deleted == true"
              class="el-icon-check"
            ></i>
            <i else class="el-icon-close"></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template v-slot:default="slotScope">
            <el-tag v-if="slotScope.row.cat_level == '0'">等级一</el-tag>
            <el-tag type="success" v-if="slotScope.row.cat_level == '1'"
              >等级二</el-tag
            >
            <el-tag type="warning" v-if="slotScope.row.cat_level == '2'"
              >等级三</el-tag
            >
            <el-tag type="danger" v-if="slotScope.row.cat_level == '3'"
              >等级四</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作列">
          <template v-slot:default="slotScope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditCategoryDialog(slotScope.row.cat_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteMessageBox(slotScope.row.cat_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :currentPage="queryGoodsCategoriesParams.pagenum"
        :pageSizes="pageSizes"
        :pageSize="queryGoodsCategoriesParams.pagesize"
        :total="total"
      >
      </pagination>

      <!--添加商品分类弹窗-->
      <popup
        title="添加分类"
        :dialogVisible="addCategoryDialogVisible"
        width="50%"
        :isButtonGroupShow="false"
        @handleClose="handleAddCategoryDialogClose"
      >
        <el-form
          :model="addCategoryParams"
          :rules="addCategoryRules"
          ref="addCategoryForm"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input
              v-model="addCategoryParams.cat_name"
              placeholder="请输入分类"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择分类">
            <!--props用来指定配置对象-->
            <el-cascader
              v-model="selectKeys"
              :options="allCategoryList"
              :props="cascaderProps"
              @change="handleChange"
              :clearable="true"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button @click="addCategory" type="primary">确 认</el-button>
          </el-form-item>
        </el-form>
      </popup>

      <!--编辑商品分类弹窗-->
      <popup
        title="编辑分类"
        :dialogVisible="editCategoryDialogVisible"
        width="50%"
        :isButtonGroupShow="false"
        @handleClose="handleEditCategoryDialogClose"
      >
        <el-form
          :model="editCategoryParams"
          :rules="addCategoryRules"
          ref="editCategoryForm"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input
              v-model="editCategoryParams.cat_name"
              placeholder="请输入分类"
            ></el-input>
          </el-form-item>
          <el-form-item label="选择分类">
            <!--props用来指定配置对象-->
            <el-cascader
              v-model="selectKeys"
              :options="allCategoryList"
              :props="cascaderProps"
              @change="handleEditChange"
              :clearable="true"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button @click="editCategory" type="primary">确 认</el-button>
          </el-form-item>
        </el-form>
      </popup>
    </el-card>
  </div>
</template>

<script>
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
import Pagination from "components/common/pagination/Pagination";
import Popup from "components/common/popup/Popup";
//导入网络请求
import {
  queryGoodsCategories,
  addCategory,
  deleteCategory,
  queryCategoryById,
  editCategoryById,
} from "network/goodsCategory";
export default {
  name: "GoodsCategory",
  data() {
    return {
      goodsCategoriesList: [],
      queryGoodsCategoriesParams: {
        type: 3,
        pagenum: 1,
        pagesize: 2,
      },
      pageSizes: [1, 2, 5, 10],
      total: 0,
      addCategoryDialogVisible: false,
      addCategoryParams: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addCategoryRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      allCategoryList: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
        checkStrictly: true,
      },
      selectKeys: [],
      editCategoryDialogVisible: false,
      editCategoryParams: {},
    };
  },
  components: {
    Breadcrumb,
    Pagination,
    Popup,
  },
  created() {
    this.queryGoodsCategories(this.queryGoodsCategoriesParams);
  },
  methods: {
    //请求查询商品种类
    queryGoodsCategories(paramsObject) {
      queryGoodsCategories(paramsObject).then((res) => {
        //存储商品种类列表
        this.goodsCategoriesList = res.data.result;
        this.total = res.data.total;
      });
    },
    //监听列表pagesize的改变事件
    handleSizeChange(pageSize) {
      this.queryGoodsCategoriesParams.pagesize = pageSize;
      this.queryGoodsCategories(this.queryGoodsCategoriesParams);
    },
    //监听目前page的事件
    handleCurrentChange(page) {
      this.queryGoodsCategoriesParams.pagenum = page;
      this.queryGoodsCategories(this.queryGoodsCategoriesParams);
    },
    showAddCategoryDialog() {
      this.addCategoryDialogVisible = true;
      //查询出所有的分类
      queryGoodsCategories({ type: 2 }).then((res) => {
        this.allCategoryList = res.data;
      });
    },
    addCategory() {
      this.$refs.addCategoryForm.validate((valid) => {
        !valid
          ? ""
          : (() => {
              addCategory(this.addCategoryParams).then((res) => {
                res.meta.status === 201
                  ? (() => {
                      this.$message.success(res.meta.msg);
                      this.queryGoodsCategoriesParams.pagenum = 1;
                      this.queryGoodsCategories(
                        this.queryGoodsCategoriesParams
                      );
                      this.addCategoryDialogVisible = false;
                      this.selectKeys = [];
                    })()
                  : this.$message.error(res.meta.msg);
              });
            })();
      });
    },
    handleChange() {
      //赋值cat_pid
      this.selectKeys.length === 0
        ? (() => {
            this.addCategoryParams.cat_pid = 0;
            this.addCategoryParams.cat_level = 0;
          })()
        : (this.addCategoryParams.cat_pid = this.selectKeys[
            this.selectKeys.length - 1
          ]);
      this.addCategoryParams.cat_level = this.selectKeys.length;

      //addCategoryParams
    },
    handleAddCategoryDialogClose() {
      this.addCategoryDialogVisible = false;
      this.selectKeys = [];
      this.$refs.addCategoryForm.resetFields();
    },
    showDeleteMessageBox(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //发送删除分类请求
          deleteCategory(id).then((res) => {
            //提示删除成功
            res.meta.status === 200
              ? (() => {
                  this.$message({
                    type: "success",
                    message: res.meta.msg,
                  });
                  //重新查询第一页数据，
                  this.queryGoodsCategoriesParams.pagenum = 1;
                  this.queryGoodsCategories(this.queryGoodsCategoriesParams);
                })()
              : this.$messgae.error(res.meta.msg);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    showEditCategoryDialog(id) {
      //显示编辑对话框
      this.editCategoryDialogVisible = true;
      //查询分类id
      queryCategoryById(id).then((res) => {
        this.editCategoryParams = res.data;
      });
      //查询出最新的所有的分类
      queryGoodsCategories({ type: 2 }).then((res) => {
        this.allCategoryList = res.data;
      });
    },
    handleEditChange() {
      //赋值cat_pid
      this.selectKeys.length === 0
        ? (() => {
            this.editCategoryParams.cat_pid = 0;
            this.editCategoryParams.cat_level = 0;
          })()
        : (this.editCategoryParams.cat_pid = this.selectKeys[
            this.selectKeys.length - 1
          ]);
      this.editCategoryParams.cat_level = this.selectKeys.length;
    },
    editCategory() {
      editCategoryById(this.editCategoryParams).then((res) => {
        res.meta.status === 200
          ? (() => {
              this.$message.success(res.meta.msg);
              this.queryGoodsCategoriesParams.pagenum = 1;
              this.queryGoodsCategories(this.queryGoodsCategoriesParams);
              this.editCategoryDialogVisible = false;
              this.selectKeys = [];
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    handleEditCategoryDialogClose() {
      this.editCategoryDialogVisible = false;
      this.selectKeys = [];
      this.$refs.editCategoryForm.resetFields();
    },
  },
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
