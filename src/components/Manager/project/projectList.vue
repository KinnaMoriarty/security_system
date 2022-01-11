

<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理项目</el-breadcrumb-item>
      <el-breadcrumb-item>查看项目</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 项目列表区 -->
      <el-table :data="relativeProject" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="安排时间" prop="arrangeTime" sortable>
        </el-table-column>
        <el-table-column label="项目编号" prop="projectID"> </el-table-column>
        <el-table-column label="项目名称" prop="projectName"> </el-table-column>
        <el-table-column label="安检单位" prop="unitName"> </el-table-column>
        <el-table-column
          label="报表状态"
          :filters="[
            { text: '未完成', value: 1 },
            { text: '已完成', value: 2 },
          ]"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            <!-- 报表提交【2】/未提交【1】：reportStatus -->
            <el-tag :type="isHandled(scope.row)">{{
              scope.row.status == 1 ? "未完成" : "已完成"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="查看">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showProjectDetail(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 查看项目对话框 -->
    <el-dialog
      title="项目详情"
      :visible.sync="projectDialogVisible"
      width="35%"
      center
    >
      <!-- 主题内容 -->
      <el-descriptions
        class="margin-top"
        :column="1"
        border
        :labelStyle="labelStyle"
      >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document"></i>
            项目名称
          </template>
          {{ projectDetail.projectName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document"></i>
            项目编号
          </template>
          {{ projectDetail.projectID }}
        </el-descriptions-item>
        <!-- 安检员 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            负责安检员
          </template>
          <ul class="listStyle">
            <li
              class="liListStyle"
              v-for="(p, index) of projectDetail.workers"
              :key="index"
            >
              <el-tag type="success">{{ p }}</el-tag>
            </li>
          </ul>
        </el-descriptions-item>
        <!-- 工具 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-setting"></i>
            所需工具
          </template>
          <el-table
            :data="projectDetail.tools"
            stripe
            style="width: 100%"
            border
          >
            <el-table-column prop="toolName" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="toolType" label="型号" width="180">
            </el-table-column>
            <el-table-column prop="needNumber" label="需要数量">
            </el-table-column>
          </el-table>
        </el-descriptions-item>
        <!-- 单位 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-time"></i>
            安检时间
          </template>

          <el-tag size="small" effect="plain" type="info">{{
            projectDetail.arrangeTime
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-school"></i>
            被检单位
          </template>
          {{ projectDetail.unitName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-place"></i>
            单位地址
          </template>
          {{ projectDetail.unitAddress }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-s-custom"></i>
            负责人
          </template>
          {{ projectDetail.unitManager }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            联系方式
          </template>
          {{ projectDetail.unitPhone }}
        </el-descriptions-item>
        <!-- 安检报表 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-document-checked"></i>
            安检报表
          </template>
          <!-- 当报表上传了 -->
          <el-image :src="reportSource" v-show="reportIsHandled"></el-image>
          <!-- 当没有上传时 -->
          <span v-show="!reportIsHandled">报表待上传或尚未通过</span>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 底部内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="projectDialogVisible = false"
          >确 定</el-button
        >
        <el-button @click="projectDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制查看项目对话框的显示与隐藏
      projectDialogVisible: false,
      // 该安检员的所有项目列表
      relativeProject: [],
      // 当前查看项目是否有上传报表
      reportIsHandled: false,
      reportSource: "",
      // 查看的项目的详细信息
      projectDetail: {
        projectName: "",
        projectID: "",
        workers: [],
        tools: [],
        arrangeTime: "",
        unitName: "",
        unitAddress: "",
        unitManager: "",
        unitPhone: "",
      },
      labelStyle: {
        width: "130px",
        "font-size": "15px",
        height: "55px",
      },
      fileList: [],
    };
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    // 1.获取项目列表
    async getProjectList() {
      this.relativeProject = [];
      let requestParams = `/projectServlet?action=getProjectsOfInspector&inspectorID=${this.$root.mangerId}`;
      console.log(requestParams);
      // 发送ajax请求
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("查询代办项目失败");
      }
      // 加载未完成项目
      for (let i = 0; i < res.UnfinishedProjects.length; i++) {
        this.relativeProject.push({
          projectID: res.UnfinishedProjects[i].projectID,
          projectName: res.UnfinishedProjects[i].projectName,
          unitName: res.UnfinishedProjects[i].unitName,
          arrangeTime: this.getYMDHMS(
            res.arrangeTime[res.UnfinishedProjects[i].projectID]
          ).slice(0, 11),
          status: 1,
        });
      }
      // 加载已完成项目
      for (let i = 0; i < res.HistoryProjects.length; i++) {
        this.relativeProject.push({
          projectID: res.HistoryProjects[i].projectID,
          projectName: res.HistoryProjects[i].projectName,
          unitName: res.HistoryProjects[i].unitName,
          arrangeTime: this.getYMDHMS(
            res.arrangeTime[res.HistoryProjects[i].projectID]
          ).slice(0, 11),
          status: 2,
        });
      }
    },
    // 2.判断报表状态
    isHandled(row) {
      if (row.status == 1) {
        return "info";
      } else {
        return "success";
      }
    },
    // 2.规范化时间
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
    // 3.查看项目
    async showProjectDetail(row) {
      let requestParams = `/projectServlet?action=getAllOfProject&projectID=${row.projectID}`;
      let requestParams1 = `/projectServlet?action=getReport&projectID=${row.projectID}`;
      let report;

      if (row.status == 1) {
        this.reportIsHandled = false;
      }
      const { data: res } = await this.$http.post(requestParams);
      if (row.status == 2) {
        this.reportIsHandled = true;
        report = await this.$http.post(requestParams1);
        report = report.data;
        report = report.report.file;

        this.reportSource =
          "http://192.168.0.110:8080/SecurityManagementSystem/" + report;
      }
      console.log(report);
      this.projectDetail.projectName = res.project.projectName;
      this.projectDetail.projectID = res.project.projectID;
      for (let i = 0; i < res.workers.length; i++) {
        this.projectDetail.workers[i] = res.workers[i].username;
      }
      this.projectDetail.arrangeTime = this.getYMDHMS(
        res.arrangeTime[0].arrangeTime
      );
      this.projectDetail.unitName = res.unit.unitName;
      this.projectDetail.unitAddress = res.unit.unitAddress;
      this.projectDetail.unitManager = res.unit.unitManager;
      this.projectDetail.unitPhone = res.unit.unitPhone;
      this.projectDetail.tools = [];
      for (let i = 0; i < res.tools.length; i++) {
        this.projectDetail.tools.push({
          toolName: res.tools[i].name,
          toolType: res.tools[i].type,
          toolID: res.tools[i].id,
          needNumber: res.needNumber[i].needNum,
        });
      }
      this.projectDetail.isUpLoaded =
        res.projectStatus == "代办" ? false : true;
      this.projectDialogVisible = true;
    },
    // 4.上传报表
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess(response, file, fileList) {
      console.log(response);
    },
    // 5.筛选报表
    filterTag(value, row) {
      console.log(row.status, value);
      return row.status === value;
    },
  },
};
</script>

<style lang="less" scoped>
.editD {
  width: 400px;
}
.listStyle {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.liListStyle {
  margin: 0px;
  padding: 0px;
  float: left;
  margin-right: 15px;
}
.toolListStyle {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.liToolListStyle {
  height: 100px;
  margin: 0px;
  padding: 0px;
  float: left;
  margin-right: 15px;
}
</style>