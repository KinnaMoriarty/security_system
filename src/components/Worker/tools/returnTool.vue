

<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/whome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>工具</el-breadcrumb-item>
      <el-breadcrumb-item>归还工具</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 项目列表区 -->
      <el-table :data="relativeList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="申请时间" prop="applicationTime" sortable>
        </el-table-column>
        <el-table-column label="工具名称" prop="toolName"> </el-table-column>
        <el-table-column label="型号" prop="toolType" width="130px">
        </el-table-column>
        <el-table-column label="借用数量" prop="borrowNumber" width="100px">
        </el-table-column>
        <el-table-column label="借用日期" prop="borrowTime"> </el-table-column>
        <el-table-column label="归还日期" prop="returnTime"> </el-table-column>
        <el-table-column
          label="申请状态"
          :filters="[
            { text: '未处理', value: 0 },
            { text: '通过', value: 1 },
            { text: '拒绝', value: 2 },
          ]"
          :filter-method="filterTag"
        >
          <template slot-scope="scope">
            <!-- 报表提交【2】/未提交【1】：reportStatus -->
            <el-tag :type="isHandled(scope.row)">
              {{
                scope.row.process == 0
                  ? "未处理"
                  : scope.row.process == 1
                  ? "通过"
                  : "拒绝"
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="归还">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-button
              type="primary"
              icon="el-icon-finished"
              size="mini"
              :disabled="scope.row.process != 1"
              @click="returnTool(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 申请列表
      relativeList: [],
    };
  },
  mounted() {
    this.getApplicationList();
  },
  methods: {
    // 1.规范化时间
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
    // 2.获取所有申请
    async getApplicationList() {
      this.relativeList = [];
      let requestParams = `/toolServlet?action=getBorrowTools&workerID=${this.$root.nowLoginId}`;
      console.log(requestParams);
      // 发送ajax请求
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      for (let i = 0; i < res.borrows.length; i++) {
        this.relativeList.push({
          toolID: res.tools[i].id,
          toolName: res.tools[i].name,
          toolType: res.tools[i].type,
          applicationTime: this.getYMDHMS(res.borrows[i].applicationTime),
          process: res.borrows[i].process,
          borrowNumber: res.borrows[i].borrowNumber,
          borrowTime:
            res.borrows[i].process == 1
              ? res.borrows[i].borrowTime
              : "尚未借用",
          returnTime: res.borrows[i].returnTime,
        });
      }
    },
    // 3.判断申请状态
    isHandled(row) {
      if (row.process == 0) {
        return "info";
      } else if (row.process == 1) {
        return "success";
      } else {
        return "danger";
      }
    },
    // 4.筛选申请记录
    filterTag(value, row) {
      console.log(row.process, value);
      return row.process === value;
    },
    // 5.归还工具
    async returnTool(row) {
      console.log(row);
      const confirmResult = await this.$confirm("是否归还该工具?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消归还操作");
      }

      let ms = this.getYMDHMS(row.applicationTime);
      let requestParams = `/toolServlet?action=returnTool&workerID=${this.$root.nowLoginId}&applicationTime=${ms}&borrowNumber=${row.borrowNumber}&toolID=${row.toolID}`;
      console.log(requestParams);
      const { data: res } = await this.$http.get(requestParams);
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("归还工具失败");
      }
      this.$message.success("归还工具成功");
      this.getApplicationList();
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