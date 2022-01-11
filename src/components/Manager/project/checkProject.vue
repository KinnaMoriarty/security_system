<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理项目</el-breadcrumb-item>
      <el-breadcrumb-item>审核报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <h3>未审核报表</h3>
    <el-card>
      <!-- 申请列表区 -->
      <el-table :data="unCheckList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="报表编号" prop="reportID"> </el-table-column>
        <el-table-column label="项目编号" prop="projectID"> </el-table-column>
        <el-table-column label="项目名称" prop="projectName"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 查看报表 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="reportDetail(scope.$index, 1)"
            ></el-button>
            <!-- 通过按钮 -->
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              @click="reportPass(scope.$index)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-close"
              size="mini"
              @click="reportFailed(scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="queryInfo.pagenum1"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="unCheckTotal"
      >
      </el-pagination>
    </el-card>
    <h3>已审核报表</h3>
    <el-card>
      <!-- 申请列表区 -->
      <el-table :data="checkedList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="项目编号" prop="projectID"> </el-table-column>
        <el-table-column label="项目名称" prop="projectName"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 1是审核通过，2是审核未通过 -->
            <el-tag :type="isPass(scope.$index)">{{
              checkedList[scope.$index].result == 1 ? "通过" : "未通过"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="报表">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="reportDetail(scope.$index, 2)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="queryInfo.pagenum2"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="checkedTotal"
      >
      </el-pagination>
    </el-card>

    <!-- 查看报表对话框 -->
    <el-dialog
      :title="reportProject"
      :visible.sync="reportDetailDialog"
      width="50%"
      center
    >
      <!-- 主题内容 -->
      <el-image :src="reportSource"></el-image>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reportDetailDialog = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取工列表的参数对象
      queryInfo: {
        //1:未审核 2:已审核
        pagenum1: 1,
        pagesize1: 2,
        pagenum2: 1,
        pagesize2: 2,
      },
      // 已审核列表
      checkedList: [],
      checkedTotal: 0,
      // 未审核列表
      unCheckList: [],
      unCheckTotal: 0,
      // 查看报表对话框
      reportDetailDialog: false,
      reportSource: "",
      reportProject: "",
    };
  },
  created() {
    this.getUncheckList();
    this.getcheckedList();
  },
  methods: {
    // 🎃🎃1.未审核报表分页改变
    //监听pagesize改变的事件
    handleSizeChange1(newSize) {
      this.queryInfo.pagesize1 = newSize;
      this.getUncheckList();
    },
    //监听页码值改变的事件
    handleCurrentChange1(newPage) {
      this.queryInfo.pagenum1 = newPage;
      this.getUncheckList();
    },
    // 🎃🎃2.已审核报表分页改变
    //监听pagesize改变的事件
    handleSizeChange2(newSize) {
      this.queryInfo.pagesize2 = newSize;
      this.getcheckedList();
    },
    //监听页码值改变的事件
    handleCurrentChange2(newPage) {
      this.queryInfo.pagenum2 = newPage;
      this.getcheckedList();
    },
    // 3.更新已审核列表
    async getcheckedList() {
      this.checkedList = [];
      let requestParams = `/projectServlet?action=reportList&inspectorID=${this.$root.mangerId}&reportStatus=2&pageSize=${this.queryInfo.pagesize2}&pageNo=${this.queryInfo.pagenum2}`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      this.checkedTotal = res.reportPage.totalCount;
      for (let i = 0; i < res.reportPage.items.length; i++) {
        this.checkedList.push({
          projectID: res.reportPage.items[i].projectID,
          projectName: res.projectPage[res.reportPage.items[i].projectID],
          result: res.reviewResult[res.reportPage.items[i].reportID],
          file:
            "http://192.168.0.110:8080/SecurityManagementSystem/" +
            res.reportPage.items[i].file,
        });
      }
    },
    // 4.查看审核报表
    reportDetail(index, isChecked) {
      if (isChecked == 2) {
        this.reportDetailDialog = true;
        this.reportSource = this.checkedList[index].file;
        this.reportProject = this.checkedList[index].projectName;
      } else {
        this.reportDetailDialog = true;
        this.reportSource = this.unCheckList[index].file;
        this.reportProject = this.unCheckList[index].projectName;
      }
    },
    // 5.审核报表结果
    isPass(index) {
      // 1是审核通过，2是审核未通过
      return this.checkedList[index].result == 1 ? "success" : "danger";
    },
    // 6.更新未审核列表
    async getUncheckList() {
      this.unCheckList = [];
      let requestParams = `/projectServlet?action=reportList&inspectorID=${this.$root.mangerId}&reportStatus=1&pageSize=${this.queryInfo.pagesize1}&pageNo=${this.queryInfo.pagenum1}`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      this.unCheckTotal = res.reportPage.totalCount;
      for (let i = 0; i < res.reportPage.items.length; i++) {
        this.unCheckList.push({
          projectID: res.reportPage.items[i].projectID,
          projectName: res.projectPage[res.reportPage.items[i].projectID],
          reportID: res.reportPage.items[i].reportID,
          file:
            "http://192.168.0.110:8080/SecurityManagementSystem/" +
            res.reportPage.items[i].file,
        });
      }
    },
    // 7.审核通过
    async reportPass(index) {
      console.log(index);
      const confirmResult = await this.$confirm(
        `是否通过${this.checkedList[index].projectName}的安检报表?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作");
      }
      // 1表示审核通过；2表示审核未通过
      let requestParams = `/projectServlet?action=reviewReport&reportID=${this.unCheckList[index].reportID}&reviewResult=1`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      this.getUncheckList();
      this.getcheckedList();
    },
    // 8.审核未通过
    async reportFailed(index) {
      const confirmResult = await this.$confirm(
        `是否不通过${this.checkedList[index].projectName}的安检报表?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作");
      }
      // 1表示审核通过；2表示审核未通过
      let requestParams = `/projectServlet?action=reviewReport&reportID=${this.unCheckList[index].reportID}&reviewResult=2`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      this.getUncheckList();
      this.getcheckedList();
    },
  },
};
</script>

<style lang="less" scoped>
</style>