<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <span>安检管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧栏区 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单:项目-->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-management"></i>
              <span>项目</span>
            </template>
            <!-- 二级菜单：代办项目 -->
            <el-menu-item
              @click="saveNavState('/todoProject')"
              index="/todoProject"
            >
              <template slot="title">
                <span>代办项目</span>
              </template>
            </el-menu-item>
            <!-- 二级菜单：历史项目 -->
            <el-menu-item
              @click="saveNavState('/doneProject')"
              index="/doneProject"
            >
              <template slot="title">
                <span>历史项目</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- 一级菜单:工具-->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span>工具</span>
            </template>
            <!-- 二级菜单：借用工具 -->
            <el-menu-item @click="saveNavState('/borrow')" index="/borrow">
              <template slot="title">
                <span>借用工具</span>
              </template>
            </el-menu-item>
            <!-- 二级菜单：工具 -->
            <el-menu-item @click="saveNavState('/return')" index="/return">
              <template slot="title">
                <span>归还工具</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题内容区 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 菜单是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  // created() {
  //   this.getMenuList();
  // },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear();
      //   重定向
      this.$router.push("/login");
    },
    // 菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: rgb(51, 55, 68);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      font-family: Microsoft YaHei;
      letter-spacing: 1.5px;
      margin-left: 15px;
      font-weight: 550;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2px;
  cursor: pointer;
}
</style>