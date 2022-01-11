<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理工具</el-breadcrumb-item>
      <el-breadcrumb-item>借还申请</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <h3>未处理申请</h3>
    <el-card>
      <!-- 申请列表区 -->
      <el-table :data="applyList1" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="申请时间"
          prop="applicationTime"
          sortable
        ></el-table-column>
        <el-table-column label="工号" prop="workerID"> </el-table-column>
        <el-table-column label="项目编号" prop="projectID"> </el-table-column>
        <el-table-column label="申请工具" prop="toolName"> </el-table-column>
        <el-table-column label="借用数量" prop="borrowNumber">
        </el-table-column>
        <el-table-column label="库存" prop="amount"> </el-table-column>
        <el-table-column label="归还日期" prop="returnTime"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 通过按钮 -->
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="agreeApplication(scope.$index)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-close"
              size="mini"
              @click="disagressApplication(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange0"
        @current-change="handleCurrentChange0"
        :current-page="queryInfo.pagenum1"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total01"
      >
      </el-pagination>
    </el-card>
    <h3>已处理申请</h3>
    <el-card>
      <!-- 申请列表区 -->
      <el-table :data="applyList2" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="工号" prop="workerID"> </el-table-column>
        <el-table-column label="项目编号" prop="projectID"> </el-table-column>
        <el-table-column label="申请工具" prop="toolName"> </el-table-column>
        <el-table-column label="借用数量" prop="borrowNumber">
        </el-table-column>
        <el-table-column label="借用日期" prop="borrowTime"> </el-table-column>
        <el-table-column label="归还日期" prop="returnTime"> </el-table-column>
        <el-table-column label="状态" prop="process">
          <template slot-scope="scope">
            <el-tag :type="isPass(scope.$index)">{{ permission }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="queryInfo.pagenum2"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total02"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取工具列表的参数对象
      queryInfo: {
        query: "",
        pagenum1: 1,
        pagesize1: 2,
        pagenum2: 1,
        pagesize2: 2,
        action: "listForBorrow",
        processed: 3,
      },
      // 是否通过
      isAllow: "",
      permission: "",
      // 过渡的
      applyList01: [],
      toolList01: [],
      applyList02: [],
      toolList02: [],
      // 未处理
      applyList1: [],
      total1: 0,
      total01: 0,
      // 已处理
      applyList2: [],
      total2: 0,
      total02: 0,
      // 控制添加工具对话框的显示与隐藏
      addDialogVisible: false,
      // 添加工具的表单数据
      addForm: {
        name: "",
        type: "",
        condition: "",
        status: "",
      },
      //查询到的用户信息对象
      editForm: {},
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 判断是否通过
    isPass(index) {
      if (this.applyList2[index].process == 1) {
        this.isAllow = "success";
        this.permission = "通过";
      } else {
        this.isAllow = "danger";
        this.permission = "拒绝";
      }
      return this.isAllow;
      console.log(index);
    },
    // 🎃🎃未处理
    //监听pagesize改变的事件
    handleSizeChange0(newSize) {
      this.queryInfo.pagesize1 = newSize;
      this.queryInfo.processed = 1;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange0(newPage) {
      this.queryInfo.pagenum1 = newPage;
      this.queryInfo.processed = 1;
      this.getUserList();
    },
    // 🎃🎃已处理
    //监听pagesize改变的事件
    handleSizeChange1(newSize) {
      this.queryInfo.pagesize2 = newSize;
      this.queryInfo.processed = 2;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange1(newPage) {
      this.queryInfo.pagenum2 = newPage;
      this.queryInfo.processed = 2;
      this.getUserList();
    },
    // 合并表格
    bindList(toolList, workerList, length, applylist) {
      for (let i = 0; i < length; i++) {
        applylist.push({
          status: toolList[i].status,
          projectID: workerList[i].projectID,
          returnTime: workerList[i].returnTime,
          process: workerList[i].process,
          borrowTime: workerList[i].borrowTime,
          borrowNumber: workerList[i].borrowNumber,
          applicationTime: this.getYMDHMS(workerList[i].applicationTime),
          workerID: workerList[i].workerID,
          toolName: toolList[i].name,
          amount: toolList[i].amount,
        });
      }
    },
    // 1.🎶更新列表
    async getUserList() {
      let requestParams;
      if (this.queryInfo.processed == 1 || this.queryInfo.processed == 3) {
        //未处理
        this.applyList1 = [];
        requestParams = `/toolServlet?processed=1&action=${this.queryInfo.action}&pageSize=${this.queryInfo.pagesize1}&pageNo=${this.queryInfo.pagenum1}`;
        const { data: res } = await this.$http.post(requestParams);
        this.applyList01 = res.未处理page.items;
        this.toolList01 = res.未处理tools;
        this.total1 = res.未处理page.items.length;
        this.total01 = res.未处理page.totalCount;
        this.bindList(
          this.toolList01,
          this.applyList01,
          this.total1,
          this.applyList1
        );
        this.queryInfo.processed = 3;
      }
      if (this.queryInfo.processed == 2 || this.queryInfo.processed == 3) {
        //已处理
        this.applyList2 = [];
        requestParams = `/toolServlet?processed=2&action=${this.queryInfo.action}&pageSize=${this.queryInfo.pagesize2}&pageNo=${this.queryInfo.pagenum2}`;
        const { data: res } = await this.$http.post(requestParams);
        console.log(res);
        this.applyList02 = res.已处理page.items;
        this.toolList02 = res.已处理tools;
        this.total2 = res.已处理page.items.length;
        this.total02 = res.已处理page.totalCount;
        console.log("!!!!total02:", this.total02);
        this.bindList(
          this.toolList02,
          this.applyList02,
          this.total2,
          this.applyList2
        );
        this.queryInfo.processed = 3;
      }
    },
    // 规范化时间
    getYMDHMS(timestamp) {
      let time = new Date(timestamp);
      let year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, "0");
      const date = time.getDate().toString().padStart(2, "0");
      const hours = time.getHours().toString().padStart(2, "0");
      const minute = time.getMinutes().toString().padStart(2, "0");
      const second = time.getSeconds().toString().padStart(2, "0");

      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minute +
        ":" +
        second
      );
    },
    // 🎄通过申请
    async agreeApplication(index) {
      const confirmResult = await this.$confirm("是否同意该借用申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消同意操作");
      }

      // 1是通过
      let ms = Date.parse(this.applyList1[index].applicationTime);
      ms = this.getYMDHMS(ms);
      let requestParams = `/toolServlet?action=processApplication&workerID=${this.applyList1[index].workerID}&applicationTime=${ms}&process=1`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("同意申请失败");
      }
      this.$message.success("同意申请成功");
      this.queryInfo.processed = 1;
      this.getUserList();
    },
    // 📍拒绝申请
    async disagressApplication(index) {
      const confirmResult = await this.$confirm("是否拒绝该借用申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消拒绝操作");
      }

      // 1是通过
      let ms = Date.parse(this.applyList1[index].applicationTime);
      ms = this.getYMDHMS(ms);
      let requestParams = `/toolServlet?action=processApplication&workerID=${this.applyList1[index].workerID}&applicationTime=${ms}&process=2`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("拒绝申请失败");
      }
      this.$message.success("拒绝申请成功");
      this.queryInfo.processed = 1;
      this.getUserList();
    },
    // 3.展示通过的对话框
    async showEditDialog(id) {
      console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询工具信息失败");
      }
      this.editForm = res.data;
      this.editForm.mobile = parseInt(this.editForm.mobile);
      this.editDialogVisible = true;
    },
    // 4.确定通过申请
    editToolInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        // 发起修改工具信息的数据请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );

        if (res.meta.status !== 200) {
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
    //5.根据id删除对应的申请
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
    //6.监听添加用户对话框的事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //7.监听修改工具对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
</style>