<template>
  <div>
    <!--面包屑-->
    <breadcrumb
      :breadcrumbItemList="['商品管理', '商品列表', '添加商品']"
    ></breadcrumb>

    <el-card>
      <!--提示语句-->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>

      <!--steps进度条-->
      <el-steps
        :active="+activeIndex"
        finish-status="success"
        class="step"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="AddRules"
        ref="addForm"
        label-width="100px"
        label-position="top"
      >
        <!--左侧tab-->
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          @tab-click="handleTabClick"
          :before-leave="beforeLeaveTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <!--基本信息的表单项-->
            <el-form-item label="商品名称" prop="goods_name">
              <el-col :span="24">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model.number="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model.number="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model.number="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="selectKey"
                :options="allGoodsCategories"
                :props="categoryCasProps"
                @change="handleChange"
                :checkStrictly="true"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单项-->
            <el-form-item
              v-for="item in manyParams"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(checkItem, index) in item.attr_vals"
                  :key="index"
                  :label="checkItem"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyParams"
              :label="item.attr_name"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals[0]"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--图片上传-->
            <el-upload
              class="upload-demo"
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccessUpload"
              list-type="picture-card"
            >
              <el-button size="small" type="primary">上传图片</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <!--预览图片-->
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="previewImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              v-model="addForm.goods_introduce"
              class="quill-height"
            ></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
//引入富文本框依赖
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
//引入lodash
import _ from "lodash";
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
//导入网络请求
import {
  queryGoodsCategories,
  queryGoodsParams,
  addGoods,
} from "network/addGoods";
export default {
  name: "addGoods",
  components: {
    Breadcrumb,
    quillEditor,
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      AddRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      allGoodsCategories: [],
      selectKey: [],
      categoryCasProps: {
        label: "cat_name",
        value: "cat_id",
        expandTrigger: "hover",
      },
      manyParams: [],
      onlyParams: [],
      previewImageUrl: "",
      dialogVisible: false,
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },

  created() {
    this.queryGoodsCategories();
  },
  computed: {
    cateId() {
      return this.selectKey;
    },
  },
  methods: {
    queryGoodsCategories() {
      queryGoodsCategories({}).then((res) => {
        this.allGoodsCategories = res.data;
      });
    },
    handleTabClick() {
      if (this.activeIndex == "1") {
        this.queryGoodsParams("many");
      }
      if (this.activeIndex == "2") {
        this.queryGoodsParams("only");
      }
    },
    queryGoodsParams(sel) {
      queryGoodsParams({
        sel: sel,
        id: this.cateId[2],
      }).then((res) => {
        //将attr_vals变成数组形式
        res.data.forEach((x) => {
          // x.attr_vals == ""?
          x.attr_vals = x.attr_vals.length === 0 ? [] : x.attr_vals.split(",");
        });
        sel === "many"
          ? (this.manyParams = res.data)
          : (this.onlyParams = res.data);
      });
    },
    handleChange() {
      this.addForm.goods_cat = this.selectKey;
    },
    beforeLeaveTab(to, from) {
      let result = true;
      //从第一个tab标签切换出去时，进行验证
      if (from === "0") {
        this.$refs.addForm.validateField(
          ["goods_name", "goods_price", "goods_weight", "goods_number"],
          (errorMessage) => {
            if (errorMessage) {
              result = false;
            }
          }
        );
      }
      //从第二个tab标签切换出去时，进行验证
      //从第三个tab标签切换出去时，进行验证
      //从第四个tab标签切换出去时，进行验证
      //从第五个tab标签切换出去时，进行验证

      return result;
    },
    handleRemove(file, fileList) {
      const delIndex = this.addForm.pics.findIndex((x) => {
        x.pic == file.response.data.tmp_path;
      });
      this.addForm.pics.splice(delIndex, 1);
    },
    handlePreview(file) {
      this.dialogVisible = true;
      this.previewImageUrl = file.response.data.url;
    },
    handleSuccessUpload(response, file, fileList) {
      //拼接一个图片信息对象,并且push到addForm的pics中
      this.addForm.pics.push({ pic: response.data.tmp_path });
    },
    addGoods() {
      //将动态参数和静态属性全部赋值到addForm中的attrs中
      [...this.manyParams.concat(this.onlyParams)].forEach((x) => {
        const attrObj = {
          attr_id: x.attr_id,
          attr_value: x.attr_vals.join(","),
        };
        this.addForm.attrs.push(attrObj);
      });
      //将addForm对象的goods_cats由数组拼接成字符串
      const form = _.clone(this.addForm);
      form.goods_cat = form.goods_cat.join(",");
      //表单预验证
      this.$refs.addForm.validate((valid) => {
        !valid
          ? this.$message.error("请填写所有必填项")
          : (() => {
              addGoods(form).then((res) => {
                res.meta.status === 201
                  ? (() => {
                      //提示添加成功
                      this.$message.success(res.meta.msg);
                      //返回商品列表页面
                      this.$router.push("/goods");
                    })()
                  : this.$message.error(res.meta.msg);
              });
            })();
      });
    },
  },
};
</script>

<style scoped>
.el-checkbox {
  margin: 0 10px !important;
}

.addBtn {
  margin-top: 15px;
}
</style>
