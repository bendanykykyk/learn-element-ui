<template>
  <!--分配权限对话框-->
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    @close="close"
    :before-close="handleClose"
  >
    <slot>
      <p>自定义弹框内容</p>
    </slot>
    <span slot="footer" class="dialog-footer" v-if="isButtonGroupShow">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "Popup",
  props: {
    //对话框标题
    title: {
      type: String,
      default: "标题",
    },
    //对话框宽度，百分比
    width: {
      type: String,
      default: "30%",
    },
    //对话框显示
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    isButtonGroupShow: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit("handleClose");
    },
    //dialog关闭的回调事件
    close() {
      this.$emit("close");
    },
    save() {
      this.$emit("save");
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped></style>
