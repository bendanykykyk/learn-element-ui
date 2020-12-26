<template>
  <div class="main">
    <el-container class="el-container">
      <el-header class="header">
        <div class="header-left">
          <img src="~assets/img/main/cart.png" alt="" />
          <span>小天才后台管理系统</span>
        </div>
        <div class="header-right">
          <el-button type="info" @click="exitLogin" round>退出</el-button>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
          <!--导航菜单-->
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#3C3F4B"
            text-color="#fff"
            active-text-color="#4397C5"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="$route.path"
          >
            <!--折叠处-->
            <div class="foldButton" @click="foldContentClick">
              |||
            </div>
            <el-submenu
              :index="String(item.id)"
              v-for="item in menuList"
              :key="item.id"
            >
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>

              <el-menu-item
                :index="'/' + childItem.path"
                v-for="childItem in item.children"
                :key="childItem.users"
                ><i class="el-icon-menu"></i>
                <span>{{ childItem.authName }}</span></el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenuData } from "network/main";
export default {
  name: "Main",
  data() {
    return {
      menuList: [],
      isCollapse: false,
    };
  },
  methods: {
    exitLogin() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    foldContentClick() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    getMenuData().then((res) => {
      this.menuList = res.data;
    });
  },
};
</script>

<style lang="less" scoped>
.main {
  height: 100%;
}
.el-container {
  height: 100%;
  .header {
    background: #414549;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      display: flex;
      align-items: center;
      color: #fff;
      img {
        width: 50px;
        margin-right: 10px;
      }
    }
  }
  .aside {
    background: #3b3f4c;
    color: #fff;
    .el-menu {
      border-right: none;
      .foldButton {
        text-align: center;
        letter-spacing: 0.2em;
      }
      .icon {
        margin-right: 10px;
      }
    }
  }
}
</style>
