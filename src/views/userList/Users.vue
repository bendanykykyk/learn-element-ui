<template>
  <div>
    <!--面包屑-->
    <breadcrumb
      sperator="/"
      :breadcrumbItemList="['用户管理', '用户列表']"
    ></breadcrumb>
    <!--卡片-->

    <el-card shadow="always">
      <!--layout布局，栅格-->
      <el-row :gutter="20">
        <el-col :span="6">
          <!--复合搜索框-->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="usersQuery.query"
            :clearable="true"
            @clear="getUsersData(usersQuery)"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersData(usersQuery)"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="6">
          <!--添加用户按钮-->
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="180"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot:default="slotScope">
            <el-switch
              v-model="slotScope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserState(slotScope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:default="slotScope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdateUserDialog(slotScope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="openDeleteComfirm(slotScope.row)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="设置"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showDispatchDialog(slotScope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersQuery.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersQuery.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!--添加用户对话框-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @closed="closeDialog"
    >
      <!--添加用户表单验证-->
      <el-form
        :model="addFormQuery"
        :rules="addFormQueryRules"
        ref="addFormQueryRef"
        label-width="120px"
      >
        <!--表单项-->
        <el-form-item label="用户名" prop="username" class="input-width">
          <el-input v-model="addFormQuery.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" class="input-width">
          <el-input v-model="addFormQuery.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="input-width">
          <el-input v-model="addFormQuery.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" class="input-width">
          <el-input v-model="addFormQuery.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--更新用户对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="updateDialogVisible"
      width="50%"
      @closed="closeUpdateUserDialog"
      ref="updateUserDialogRef"
    >
      <!--修改用户表单验证-->
      <el-form
        :model="editForm"
        ref="updateUserFormQueryRef"
        label-width="120px"
      >
        <!--表单项-->
        <el-form-item label="用户名" prop="username" class="input-width">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="input-width">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" class="input-width">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区域-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配权限对话框-->
    <popup
      title="分配角色"
      :dialogVisible="dispatchRightDialogVisible"
      width="45%"
      @handleClose="handleClosePopup"
      @save="saveRoleRight"
      @cancel="cancelDialog"
    >
      <!--角色权限内容-->
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前角色:{{ userInfo.role_name }}</p>
        <el-select v-model="currentRight" placeholder="请选择角色">
          <el-option
            v-for="item in rightList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </popup>
  </div>
</template>

<script>
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
import Popup from "components/common/popup/Popup";
//导入网络请求
import {
  getUsersData,
  updatedUserState,
  addUser,
  queryUser,
  updateUser,
  deleteUser,
  queryRole,
  dispatchUserRole,
} from "network/users";
//导入正则
import { checkEmail, checkPhone } from "common/regex";

export default {
  name: "UserList",
  data() {
    return {
      usersQuery: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userStateQuery: {
        uId: "",
        type: "",
      },
      addFormQuery: {
        username: "admin",
        password: "12345",
        email: "2@qq.com",
        mobile: "18758580112",
      },
      addFormQueryRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkPhone, trigger: "blur" }],
      },
      queryUser: {
        id: 0,
      },
      editForm: {},

      users: [],
      total: 0,
      addDialogVisible: false,
      updateDialogVisible: false,
      dispatchRightDialogVisible: false,
      userInfo: {},
      rightList: [],
      currentRight: "",
    };
  },
  created() {
    this.getUsersData(this.usersQuery);
  },
  methods: {
    getUsersData(paramsObject) {
      getUsersData(paramsObject).then((res) => {
        this.users = res.data.users;
        this.total = res.data.total;
      });
    },
    //改变用户状态
    changeUserState(userInfo) {
      this.userStateQuery.uId = userInfo.id;
      this.userStateQuery.type = userInfo.mg_state;

      updatedUserState(this.userStateQuery).then((res) => {
        res.meta.status === 200
          ? this.$message.success("修改成功")
          : (() => {
              this.$message.error("修改失败");
              this.userStateQuery.type = !this.userStateQuery.type;
            })();
      });
    },
    //添加用户
    addUser() {
      this.$refs.addFormQueryRef.validate((valid) => {
        !valid
          ? ""
          : (() => {
              //调用添加User的请求
              addUser(this.addFormQuery).then((res) => {
                res.meta.status !== 201
                  ? this.$message.error(res.meta.msg)
                  : (() => {
                      this.$message.success(res.meta.msg);
                      this.addDialogVisible = false;
                      this.usersQuery.pagenum = 1;
                      this.getUsersData(this.usersQuery);
                    })();
              });
            })();
        // (addDialogVisible = false)
      });
    },
    updateUser() {
      updateUser(this.editForm).then((res) => {
        res.meta.status !== 200
          ? this.$message.error(res.meta.msg)
          : (() => {
              this.$message.success(res.meta.msg);
              this.updateDialogVisible = false;
              this.getUsersData(this.usersQuery);
            })();
      });
    },
    //监听列表pagesize的改变事件
    handleSizeChange(pageSize) {
      this.usersQuery.pagesize = pageSize;
      this.getUsersData(this.usersQuery);
    },
    //监听目前page的事件
    handleCurrentChange(page) {
      this.usersQuery.pagenum = page;
      this.getUsersData(this.usersQuery);
    },
    //关闭添加用户对话框
    closeDialog() {
      this.$refs.addFormQueryRef.resetFields();
    },
    //关闭更新对话框时，准备做什么 预备
    closeUpdateUserDialog() {
      this.$refs.updateUserFormQueryRef.resetFields();
    },
    //展示更新用户对话框
    showUpdateUserDialog(userInfo) {
      this.updateDialogVisible = true;
      this.queryUser.id = parseInt(userInfo.id);
      queryUser(this.queryUser).then((res) => {
        this.editForm = res.data;
      });
    },

    openDeleteComfirm(userInfo) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(userInfo).then((res) => {
            //其他操作
            res.meta.status === 200
              ? (() => {
                  this.$message.success(res.meta.msg);
                  this.usersQuery.pagenum = 1;
                  this.getUsersData(this.usersQuery);
                })()
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
    //展示分配权限对话框
    showDispatchDialog(userInfo) {
      //存储当前选中的用户信息
      this.userInfo = userInfo;
      //请求角色列表
      queryRole().then((res) => {
        res.meta.status === 200
          ? (() => {
              this.rightList = res.data;
            })()
          : this.$message.error(res.meta.msg);
      });
      //设置为可见
      this.dispatchRightDialogVisible = true;
    },
    saveRoleRight() {
      //发出分配角色用户请求
      dispatchUserRole(this.userInfo.id, this.currentRight).then((res) => {
        res.meta.status === 200
          ? (() => {
              //关闭弹窗
              this.dispatchRightDialogVisible = false;
              //重新查询用户列表
              this.getUsersData(this.usersQuery);
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    handleClosePopup() {
      this.dispatchRightDialogVisible = false;
      this.currentRight = "";
    },
    cancelDialog() {
      this.dispatchRightDialogVisible = false;
    },
  },
  components: {
    Breadcrumb,
    Popup,
  },
};
</script>

<style scoped>
.input-width {
  width: 80%;
}
</style>
