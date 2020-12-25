<template>
  <div class="login_container">
    <i class="iconfont "></i>
    <!--登录表单-->
    <div class="login-box">
      <el-form ref="formRef" label-width="0px" :model="form" :rules="rules">
        <div class="usernameAndPassword">
          <!--用户名-->
          <el-form-item prop="username">
            <el-input
              prefix-icon="iconfont icon-account"
              v-model="form.username"
            >
            </el-input>
          </el-form-item>
          <!--密码-->
          <el-form-item prop="password">
            <el-input
              prefix-icon="iconfont icon-password"
              v-model="form.password"
            >
            </el-input>
          </el-form-item>
        </div>

        <div class="button-group">
          <el-form-item>
            <el-button type="info" @click="resetContentClick">重置</el-button>
            <el-button type="primary" @click="loginClick">提交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
//* 网络请求
import { getLoginData } from "network/login.js";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //重置表单内容事件
    resetContentClick() {
      console.log("123");
      this.$refs.formRef.resetFields();
    },
    //登录事件
    loginClick() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) {
          return;
        }
        this.getLoginData(this.form);
      });
    },

    //登录网络请求
    getLoginData({ username, password }) {
      getLoginData(this.form).then((res) => {
        if (res.meta.status === 200) {
          this.$message.success("登录成功");
          this.$router.push("/main");
        } else {
          this.$message.error("账号或者密码错误");
        }

        console.log(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b4b6b;

  height: 100%;
  .login-box {
    border: 1px solid #fff;
    width: 600px;
    height: 300px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .usernameAndPassword {
      width: 350px;
    }
    .button-group {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
