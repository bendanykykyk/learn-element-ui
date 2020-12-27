<template>
  <div>
    <!--面包屑-->
    <breadcrumb
      sperator="/"
      :breadcrumbItemList="['权限管理', '角色列表']"
    ></breadcrumb>
    <!--卡片-->
    <el-card shadow="always">
      <!--添加角色按钮-->
      <el-button type="primary">添加角色</el-button>

      <!--表格-->
      <el-table :data="rolesList" stripe style="width: 100%">
        <!--展开子列-->
        <el-table-column type="expand">
          <template v-slot:default="slotScope">
            <el-row
              v-for="(item1, index) in slotScope.row.children"
              :key="item1.id"
              :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRoleById(slotScope.row.id, item1.id)"
                >
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二，三级权限列-->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[index2 == 0 ? '' : 'bdtop']"
                >
                  <!--第二列-->
                  <el-col :span="6">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRoleById(slotScope.row.id, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--第三列-->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="danger"
                      closable
                      @close="removeRoleById(slotScope.row.id, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--父列-->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:default="slotScope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
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
    </el-card>
    <!--分配权限对话框-->
    <popup
      title="分配权限"
      :dialogVisible="dispatchRightDialogVisible"
      width="45%"
      @handleClose="handleClosePopup"
      @save="saveRoleRight"
    >
      <!--树形控件-->
      <el-tree
        :data="rightList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="currentRightList"
        ref="treeRef"
      ></el-tree>
    </popup>
  </div>
</template>

<script>
//导入公共组件
import Breadcrumb from "components/common/breadcrumb/Breadcrumb";
import Popup from "components/common/popup/Popup";
//导入网络请求
import {
  queryRole,
  deleteRoleById,
  queryRightList,
  dispatchRoleRight,
} from "network/role";
export default {
  name: "Role",
  data() {
    return {
      rolesList: [], //所有角色的数组
      deleteRoleQuery: {},
      dispatchRightDialogVisible: false,
      rightList: [], //所有权限的数组
      //权限弹出框文本显示
      defaultProps: {
        children: "children",
        label: "authName",
      },
      //当前角色的权限列表,直接存放id
      currentRightList: [],
      roleId: 0,
    };
  },
  created() {
    this.queryRole();
  },
  methods: {
    queryRole() {
      queryRole().then((res) => {
        res.meta.status === 200
          ? (this.rolesList = res.data)
          : this.$message.error(res.meta.msg);
      });
    },
    removeRoleById(roleId, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteRoleById(roleId, rightId);
        })
        .catch(() => {});
    },
    deleteRoleById(roleId, rightId) {
      deleteRoleById(roleId, rightId).then((res) => {
        res.meta.status === 200
          ? (() => {
              this.queryRole();
              this.$message.success(res.meta.msg);
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    showDispatchDialog(role) {
      //保存角色id
      this.roleId = role.id;
      //获取权限列表
      this.queryRightList("tree");
      //显示对话框
      this.dispatchRightDialogVisible = true;
      //存储当前角色的权限列表
      this.getAllRightIdList(role, this.currentRightList);
    },
    //从treeObject对象中拿到所有id，存放到arr中
    getAllRightIdList(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        return this.getAllRightIdList(item, arr);
      });
    },
    //查询权限列表
    queryRightList(type) {
      queryRightList(type).then((res) => {
        res.meta.status === 200
          ? (() => {
              this.rightList = res.data;
            })()
          : this.$message.error(res.meta.msg);
      });
    },
    saveRoleRight() {
      dispatchRoleRight(this.roleId, this.getCheckedString()).then((res) => {
        res.meta.status === 200
          ? (() => {
              this.dispatchRightDialogVisible = false;
              this.$message.success(res.meta.msg);
              this.queryRole();
            })()
          : this.$message.error(res.meta.msg);
      });
    },

    //获取tree中半选全选的的节点，返回形式为逗号拼接的字符串
    getCheckedString() {
      const checkedStr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      return checkedStr.join(",");
    },
    closePopup() {
      this.dispatchRightDialogVisible = false;
      this.currentRightList = [];
    },
    handleClosePopup() {
      this.dispatchRightDialogVisible = false;
      this.currentRightList = [];
    },
  },
  components: {
    Breadcrumb,
    Popup,
  },
};
</script>

<style scoped>
.vcenter {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
