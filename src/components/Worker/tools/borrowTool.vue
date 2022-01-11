<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/whome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工具</el-breadcrumb-item>
      <el-breadcrumb-item>借用工具</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入要搜索的工具"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList">
            </el-button>
          </el-input>
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
        <el-table-column label="借用">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
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

    <!-- 借用（修改）工具的对话框 -->
    <el-dialog
      title="借用工具"
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
        <el-form-item label="型号">
          <el-input v-model="editForm.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="借用数量">
          <el-input-number
            controls-position="right"
            size="small"
            :min="1"
            :max="this.editForm.amount"
            v-model.number="editForm.borrowNumber"
            autocomplete="off"
          ></el-input-number>
          （库存:{{ this.editForm.amount }}件）
        </el-form-item>
        <el-form-item label="归还日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="editForm.returnDate"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="项目">
          <el-select
            v-model="editForm.projectID"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="pj in relativeProject"
              :key="pj.projectID"
              :label="pj.projectName"
              :value="pj.projectID"
            >
              <span style="float: left">{{ pj.projectID }}</span>
              <span
                style="
                  float: right;
                  color: #8492a6;
                  font-size: 11px;
                  width: 200px;
                "
                >{{ pj.projectName }}</span
              >
            </el-option>
          </el-select>
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
      // 控制修改工具对话框的显示与隐藏
      editDialogVisible: false,
      //申请工具的表单数据
      editForm: {},
      // 申请工具的相关项目
      relativeProject: {},
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

    // 2.展示申请工具的对话框
    async showEditDialog(id) {
      // console.log(this.$root.nowLoginId);
      let requestParams1 = `/toolServlet?action=getTool&id=${id}`;
      let requestParams2 = `/projectServlet?action=getProjects&workerID=${this.$root.nowLoginId}&status=1`;
      console.log(requestParams2);
      // console.log("查询id：" + requestParams1);
      // 发送ajax请求
      const { data: res } = await this.$http.post(requestParams1);
      const { data: project } = await this.$http.post(requestParams2);
      if (res.status !== 200) {
        return this.$message.error("查询工具信息失败");
      }
      // 工具信息
      this.editForm = res.tool;
      this.editForm.status = parseInt(this.editForm.status);
      this.editForm.borrowNumber = 0;
      // 项目信息
      this.relativeProject = project.projects;
      console.log(this.relativeProject);
      this.editDialogVisible = true;
    },
    // 3.提交借用申请
    async editToolInfo() {
      // // 发起修改工具信息的数据请求
      let requestParams = `/toolServlet?action=applyTools&workerID=${this.$root.nowLoginId}&toolID=${this.editForm.id}&projectID=${this.editForm.projectID}&returnDate=${this.editForm.returnDate}&borrowNumber=${this.editForm.borrowNumber}`;
      console.log(requestParams);
      // // 发送ajax请求
      const { data: res } = await this.$http.post(requestParams);
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("申请工具失败");
      }
      // 关闭对话框
      this.editDialogVisible = false;
      // 刷新数据列表
      this.getUserList();
      // 提示修改成功
      this.$message.success("更新用户信息成功");
    },
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
    // 监听修改工具对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.editD {
  width: 400px;
}
</style>