<template>
  <div>
    <breadcrumb :breadcrumbItemList="['商品管理', '分类参数']"></breadcrumb>
    <el-card>
      <el-alert
        title="只能选择三级分类哦"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
      <!--选择分类级联选择器-->

      <el-row class="row">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectKeys"
            :options="allCategoryList"
            :props="cascaderProps"
            @change="handleChange"
            :clearable="true"
          ></el-cascader>
        </el-col>
      </el-row>
      <!--动态参数tab-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many" :disabled="isTabClickable">
          <el-button
            type="primary"
            @click="showAddParamsDialog"
            :disabled="isTabClickable"
            >添加参数</el-button
          >
          <!--动态参数table-->
          <el-table :data="manyParamsList" stripe border>
            <!--展开行-->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!--参数下的属性标签-->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="deleteAttr(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <!--添加参数的属性标签-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="slot">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsDialog(slot.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="showDeleteParamsMessageBox(slot.row)"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态属性tab-->
        <el-tab-pane label="静态属性" name="only" :disabled="isTabClickable">
          <el-button
            type="primary"
            @click="showAddParamsDialog"
            :disabled="isTabClickable"
            >添加属性</el-button
          >
          <!--静态属性table-->
          <el-table :data="onlyParamsList" stripe border>
            <!--展开行-->
            <!--展开行-->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!--参数下的属性标签-->
                <el-tag
                  closable
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  @close="deleteAttr(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <!--添加参数的属性标签-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="slot">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamsDialog(slot.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="showDeleteParamsMessageBox(slot.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--弹出添加静态/动态参数对话框-->
    <popup
      :title="activeName === 'many' ? '添加动态参数' : '添加静态参数'"
      :dialogVisible="addParamsDialogVisible"
      width="50%"
      @save="saveParams"
      @handleClose="handleAddClose"
    >
      <!--表单-->
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        ref="addParamsForm"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </popup>

    <!--弹出修改静态/动态参数对话框-->
    <popup
      :title="activeName === 'many' ? '修改动态参数' : '修改静态参数'"
      :dialogVisible="editParamsDialogVisible"
      width="50%"
      @handleClose="handleEditClose"
      @save="editParams"
    >
      <!--表单-->
      <el-form
        :model="editParamsForm"
        :rules="editParamsRules"
        ref="editParamsForm"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
    </popup>
  </div>
</template>

<script>
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
import Popup from "components/common/popup/Popup";
//导入网络请求
import {
  queryGoodsCategories,
  queryGoodsParams,
  addParams,
  deleteParams,
  queryParamsById,
  editParam,
} from "network/goodsParams";
export default {
  name: "GoodsParams",
  data() {
    return {
      allCategoryList: [],
      selectKeys: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      activeName: "many",
      isTabClickable: true,
      queryGoodsParamsParams: {
        id: "",
        sel: "",
      },
      manyParamsList: [],
      onlyParamsList: [],
      addParamsDialogVisible: false,
      addParamsForm: {},
      addParamsRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editParamsDialogVisible: false,
      editParamsForm: {},
      editParamsRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Breadcrumb,
    Popup,
  },
  created() {
    this.queryGoodsCategories({});
  },
  methods: {
    queryGoodsCategories(paramsObject) {
      queryGoodsCategories(paramsObject).then((res) => {
        res.meta.status === 200
          ? (() => {
              this.allCategoryList = res.data;
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    queryGoodsParams(paramsObject) {
      queryGoodsParams(paramsObject).then((res) => {
        res.meta.status === 200
          ? (() => {
              //处理一下数据，将，分隔的字符串变为数组
              res.data.forEach((item) => {
                item.attr_vals =
                  item.attr_vals == [""] ? [] : item.attr_vals.split(",");
                item.inputVisible = false;
                item.inputValue = "";
              });

              //将处理过后的数据赋值
              this.activeName === "many"
                ? (this.manyParamsList = res.data)
                : (this.onlyParamsList = res.data);
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    //添加表单请求
    addParams(paramsObject) {
      //将cateId保存至添加参数请求参数对象中
      this.addParamsForm.attr_id = this.cateId;
      //将activeName存至添加参数请求参数对象中
      this.addParamsForm.attr_sel = this.activeName;
      addParams(paramsObject).then((res) => {
        res.meta.status === 201
          ? (() => {
              this.addParamsDialogVisible = false;
              //重新查询最新数据
              this.queryGoodsParams(this.queryGoodsParamsParams);
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    //保存参数
    saveParams() {
      this.addParams(this.addParamsForm);
    },
    //处理级联选择器切换
    handleChange() {
      this.isTabClickable = this.selectKeys.length == 0 ? true : false;
      //对当前选中的分类 以及 激活的tab，进行查询
      this.queryGoodsParamsParams.id = this.cateId;
      this.queryGoodsParamsParams.sel = this.activeName;
      this.queryGoodsParams(this.queryGoodsParamsParams);
    },
    //处理tab切换
    handleTabClick() {
      //对当前选中的分类 以及 激活的tab，进行查询
      this.queryGoodsParamsParams.id = this.cateId;
      this.queryGoodsParamsParams.sel = this.activeName;
      this.queryGoodsParams(this.queryGoodsParamsParams);
    },
    showAddParamsDialog() {
      //显示添加静态/动态的对话框
      this.addParamsDialogVisible = true;
    },
    showDeleteParamsMessageBox(param) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //点击确定后，获取cateId 以及 attrid
          ///同时发起请求
          this.deleteParams(param);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    deleteParams(param) {
      deleteParams(param.cat_id, param.attr_id).then((res) => {
        res.meta.status === 200
          ? (() => {
              //重新查询最新数据
              this.queryGoodsParams(this.queryGoodsParamsParams);
            })()
          : this.$message.error(res.meta.msg);
      });
      //提示删除成功
      this.$message({
        type: "success",
        message: "删除成功!",
      });
    },
    showEditParamsDialog(param) {
      //显示编辑对话框
      this.editParamsDialogVisible = true;
      //查询编辑的参数值
      const editParamsFormParams = {
        cat_id: param.cat_id,
        attr_id: param.attr_id,
        attr_sel: this.activeName,
        attr_vals: param.attr_vals,
      };
      queryParamsById(editParamsFormParams).then((res) => {
        this.editParamsForm = res.data;
      });
    },
    handleEditClose() {
      this.editParamsDialogVisible = false;
    },
    handleAddClose() {
      this.addParamsDialogVisible = false;
    },
    editParams() {
      //隐藏对话框
      this.editParamsDialogVisible = false;
      //提交编辑参数请求
      editParam(this.editParamsForm).then((res) => {
        //重新查询列表值
        this.queryGoodsParams(this.queryGoodsParamsParams);
      });
    },

    //失焦，键入/键抬的时候都会调用该方法
    handleInputConfirm(row) {
      let inputValue = row.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }

      row.inputVisible = false;
      row.inputValue = "";

      //查询编辑的参数值
      const editParamsFormParams = {
        cat_id: row.cat_id,
        attr_id: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(","),
      };

      editParam(editParamsFormParams).then((res) => {
        //重新查询列表值
        this.queryGoodsParams(this.queryGoodsParamsParams);
      });
    },
    //展示Input
    showInput(row) {
      row.inputVisible = true;
      //自动获得焦点
      //$nextTick 页面被重新渲染完毕后，才会指定回调函数中的代码
      //如果没这个的话，可能点击tag的时，inputVisible确实被改成true了，
      //但是元素还没有被渲染出来
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    deleteAttr(param, i) {
      param.attr_vals.splice(i, 1);
      this.deleteParams(param);
    },
  },
  computed: {
    //若选择了，必定是取最后一个，三级分类，若未选择，随便赋了个0，查出空数组处理
    cateId() {
      return this.selectKeys.length > 0 ? this.selectKeys[2] : 0;
    },
  },
};
</script>

<style scoped>
.row {
  margin: 15px 0px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
