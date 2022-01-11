<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="" />
      </div>
      <!-- 登陆表单区 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="id">
          <el-input
            v-model="loginForm.id"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        action: "login",
        id: "ag18032002",
        password: "anguan002",
        // username: "admin",
        // password: "123456",
      },
      // 表单验证规则对象
      loginFormRules: {
        id: [
          // 验证用户名合法性
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在3到11个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          // 验证用户名合法性
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在3到11个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登陆表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 自己
    login() {
      let requestParams = `/userServlet?action=${this.loginForm.action}&id=${this.loginForm.id}&password=${this.loginForm.password}`;
      // console.log(requestParams);
      // 表单的预验证
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        // 解构获得的数据的data部分
        // 发起请求
        const { data: res } = await this.$http.post(requestParams);
        console.log(res);
        if (res.status !== "200") return this.$message.error("登陆失败");
        this.$message.success("登陆成功");
        // 登陆成功后的操作
        // 1.将登录成功之后的token，保存到客户端的sessionStorage中（sessionStorage是会话期间的存储机制）
        // 1.1项目中除了登陆之前的其他API接口，必须在登录之后才能访问（检验是否有token）
        // 1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        window.sessionStorage.setItem("token", res.token);
        // 2.通过编程式导航跳转到后台主页，路由地址是/home
        if (res.identity == "安检管理员") {
          this.$root.mangerId = res.id;
          this.$router.push("/mwelcome");
        } else {
          this.$root.nowLoginId = res.id;
          console.log(this.$root.nowLoginId);
          this.$router.push("/wwelcome");
        }
      });
    },
  },
};
</script>



<style lang="less" scoped>
.login_container {
  background-color: rgb(49, 49, 49);
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 7px #ddd;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 25px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>