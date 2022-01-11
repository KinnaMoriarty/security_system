<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理工具</el-breadcrumb-item>
      <el-breadcrumb-item>工具情况</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入要搜索的工具"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <!-- 以后在这里加enter事件 -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加</el-button
          >
        </el-col>
      </el-row>
      <!-- 工具列表区 -->
      <el-table :data="toolList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="工具编号" prop="id"> </el-table-column>
        <el-table-column label="名称" prop="name"> </el-table-column>
        <el-table-column label="型号" prop="type"> </el-table-column>
        <el-table-column label="状况" prop="condition"> </el-table-column>
        <el-table-column label="库存" prop="amount"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeToolById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加工具的对话框 -->
    <el-dialog
      title="添加工具"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="工具名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="状况" prop="condition">
          <el-input v-model="addForm.condition"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="status">
          <el-input
            v-model.number="addForm.status"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTool">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改工具的对话框 -->
    <el-dialog
      title="修改工具"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <!-- 🎈🎈内容主题区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="85px"
      >
        <el-form-item label="工具名称">
          <el-input v-model="editForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="状况" prop="condition">
          <el-input v-model="editForm.condition"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="status">
          <el-input-number
            controls-position="right"
            size="small"
            v-model.number="editForm.status"
            autocomplete="off"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editToolInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取工具列表的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
        action: "page",
      },
      toolList: [],
      total: 0,
      // 控制添加工具对话框的显示与隐藏
      addDialogVisible: false,
      // 添加工具的表单数据
      addForm: {
        name: "",
        type: "",
        condition: "",
        status: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        name: [
          { required: true, message: "请输入工具名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "工具名的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        type: [
          { required: true, message: "请输入工具型号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "工具型号的长度在3~10个字符之间",
            trigger: "blur",
          },
        ],
        condition: [
          { required: true, message: "请输入工具情况", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "工具情况不能为空",
            trigger: "blur",
          },
        ],
        status: [
          { required: true, message: "请输入工具库存", trigger: "blur" },
          { type: "number", message: "库存必须为数字值" },
        ],
      },
      // 控制修改工具对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        condition: [
          { required: true, message: "请输入工具情况", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "工具情况不能为空",
            trigger: "blur",
          },
        ],
        status: [
          { required: true, message: "请输入工具库存", trigger: "blur" },
          { type: "number", message: "库存必须为数字值" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听添加用户对话框的事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听修改工具对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 1.更新列表
    async getUserList() {
      let requestParams = `/toolServlet?query=${this.queryInfo.query}&action=${this.queryInfo.action}&pageSize=${this.queryInfo.pagesize}&pageNo=${this.queryInfo.pagenum}`;
      console.log("更新列表：" + requestParams);
      // 发送ajax请求
      const { data: res } = await this.$http.post(requestParams);
      console.log(res);
      this.toolList = res.page.items;
      this.total = res.page.totalCount;
    },
    // 2.点击按钮添加新工具信息
    addTool() {
      let requestParams = `/toolServlet?action=add&name=${this.addForm.name}&type=${this.addForm.type}&status=${this.addForm.status}&condition=${this.addForm.condition}`;
      console.log("添加新工具：" + requestParams);
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起网络请求
        const { data: res } = await this.$http.post(requestParams);
        if (res.status !== 200) {
          this.$message.error("添加工具失败!");
        }
        this.$message.success("添加工具成功！");
        this.addDialogVisible = false;
        // 重新添加工具列表
        this.getUserList();
      });
    },
    // 3.展示编辑工具的对话框
    async showEditDialog(id) {
      let requestParams = `/toolServlet?action=getTool&id=${id}`;
      console.log("查询id：" + requestParams);
      // 发送ajax请求
      const { data: res } = await this.$http.post(requestParams);
      // console.log(res);
      if (res.status !== 200) {
        return this.$message.error("查询工具信息失败");
      }
      this.editForm = res.tool;
      this.editForm.status = parseInt(this.editForm.status);
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    // 4.修改工具信息并提交
    editToolInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        let requestParams = `/toolServlet?action=update&id=${this.editForm.id}&status=${this.editForm.status}&condition=${this.editForm.condition}`;
        console.log("修改工具：" + requestParams);
        // 发送ajax请求
        const { data: res } = await this.$http.post(requestParams);

        if (res.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getUserList();
        // 提示修改成功
        this.$message.success("更新用户信息成功");
      });
    },
    //5.根据id删除对应的工具
    async removeToolById(id) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将删除该工具，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      // 用户是否确认删除
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除操作");
      }
      let requestParams = `/toolServlet?action=delete&id=${id}`;
      console.log("添加新工具：" + requestParams);
      const { data: res } = await this.$http.post(requestParams);
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("删除工具失败");
      }
      this.$message.success("删除工具成功");
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
.editD {
  width: 400px;
}
</style>