<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/mhome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理项目</el-breadcrumb-item>
      <el-breadcrumb-item>定制项目</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 定制区域 -->
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <span>定制项目</span>
      </div>
      <!-- 填写区域 -->
      <el-form class="card-form" ref="form" :model="form" label-width="380px">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="安检员">
          <el-card>
            <!-- 安检员列表区 -->
            <el-table :data="form.worker" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="工号" prop="id"> </el-table-column>
              <el-table-column label="姓名" prop="username"> </el-table-column>
              <el-table-column label="联系电话" prop="phone"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- 删除按钮 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeWorkerById(scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 添加按钮 -->
            <el-button
              style="float: right; padding: 3px 3px"
              type="text"
              @click="addWorkers"
              >添加</el-button
            >
          </el-card>
        </el-form-item>
        <el-form-item label="安检时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="date1"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="选择时间"
              value-format="HH:mm:ss"
              format="HH:mm:ss"
              v-model="date2"
              style="width: 100%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="工具">
          <el-card>
            <!-- 工具列表区 -->
            <el-table :data="form.tool" :key="Math.random()" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="工具名称" prop="name"> </el-table-column>
              <el-table-column label="型号" prop="type"> </el-table-column>
              <el-table-column label="数量" prop="needNumber">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- 修改按钮 -->
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="mini"
                    @click="editToolById(scope.row.id)"
                  ></el-button>
                  <!-- 删除按钮 -->
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeToolById(scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 添加按钮 -->
            <el-button
              style="float: right; padding: 3px 3px"
              type="text"
              @click="addTools"
              >添加</el-button
            >
          </el-card>
        </el-form-item>
        <el-form-item label="被检单位">
          <el-input v-model="form.unit"></el-input>
        </el-form-item>
        <el-form-item label="单位地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.manager"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话">
          <el-input v-model="form.moblie"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="clearForm">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 🧧添加工具对话框 -->
    <el-dialog
      title="添加工具"
      :visible.sync="addToolsDialog"
      width="30%"
      center
    >
      <!-- 主题内容 -->
      <el-table
        ref="multipleTable"
        :data="toolList"
        tooltip-effect="dark"
        height="250"
        border
        style="width: 100%"
        @selection-change="handleSelectionChangeTool"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="名称" width="100">
        </el-table-column>
        <el-table-column prop="type" label="型号" width="70"> </el-table-column>
        <el-table-column prop="amount" label="库存" width="60">
        </el-table-column>
        <el-table-column label="需要数量">
          <template v-slot="scope">
            <el-input-number
              v-model.number="toolList[scope.$index].needNumber"
              :min="1"
              :max="toolList[scope.$index].amount"
              position="right"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sumbitTools">确 定</el-button>
        <el-button @click="addToolsDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 🧧修改工具对话框 -->
    <el-dialog
      :model="chosen"
      title="修改数量"
      :visible.sync="toolEditDialogVisible"
      width="30%"
      center
    >
      <!-- 🎈🎈内容主题区 -->
      <el-form label-width="85px">
        <el-form-item label="工具名称">
          <el-input v-model="chosen.Name" disabled></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="chosen.Type" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="Number">
          <el-input-number
            :min="1"
            :max="chosen.Amount"
            controls-position="right"
            size="small"
            v-model.number="chosen.Number"
            autocomplete="off"
          ></el-input-number>
          （库存:{{ this.chosen.Amount }}件）
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfirmEditTool">确 定</el-button>
        <el-button @click="toolEditDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 🎄添加安检员对话框 -->
    <el-dialog
      title="选择安检员"
      :visible.sync="addWorkerDialog"
      width="30%"
      center
    >
      <!-- 主题内容 -->
      <el-table
        ref="multipleTable"
        :data="workerList"
        tooltip-effect="dark"
        height="250"
        border
        style="width: 100%"
        @selection-change="handleSelectionChangeWorker"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sumbitWorkers">确 定</el-button>
        <el-button @click="addWorkerDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date1: "",
      date2: "",
      // 修改的id
      chosen: {
        Id: 0,
        Name: "",
        Type: "",
        Number: "",
        Amount: 0,
      },
      //查询到的用户信息对象
      editForm: {},
      // 展示对话框
      editDialogVisible: false,
      addToolsDialog: false,
      addWorkerDialog: false,
      toolEditDialogVisible: false,
      // 添加的所有列表
      toolList: [],
      workerList: [],
      number: 10,
      // 过渡列表
      chosenWorker: [],
      chosenTool: [],
      // 最终要提交的
      form: {
        worker: [],
        tool: [],
        name: " ",
        date: "",
        unit: "",
        address: "",
        manager: "",
        moblie: "",
      },
    };
  },
  methods: {
    // 🧧加载所有工具信息
    async addTools() {
      this.addToolsDialog = true;
      let requestParams = `/toolServlet?query=&action=getTools`;
      console.log("工具列表：" + requestParams);
      // 发送ajax请求
      const { data: res } = await this.$http.post(requestParams);
      console.log("工具列表");
      console.log(res);
      this.toolList = res.tools;
      this.addNeededNumber();
      console.log(this.toolList);
    },
    addNeededNumber() {
      for (let i = 0; i < this.toolList.length; i++) {
        this.toolList[i].needNumber = 1;
      }
      console.log(this.toolList);
    },
    // 🎄加载所有安检人员信息
    async addWorkers() {
      this.addWorkerDialog = true;
      let requestParams = `/userServlet?action=getWorkers`;
      console.log("人员列表：" + requestParams);
      // 发送ajax请求
      const { data: res } = await this.$http.post(requestParams);
      console.log(res);
      this.workerList = res.workers;
    },
    //  🧧复选框被选了的工具
    handleSelectionChangeTool(val) {
      this.multipleSelection = val;
      this.chosenTool = val;
      console.log(this.chosenTool);
    },
    // 🎄复选框被选了的工作人员
    handleSelectionChangeWorker(val) {
      this.multipleSelection = val;
      this.chosenWorker = val;
    },

    // 🎄确定选择的安检员
    sumbitWorkers() {
      this.addWorkerDialog = false;
      this.form.worker = this.chosenWorker;
    },
    // 🧧确定选择的工具
    sumbitTools() {
      this.addToolsDialog = false;
      this.form.tool = this.chosenTool;
    },
    // 🎄删除选择的安检员
    async removeWorkerById(index) {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将删除该安检员，是否继续?",
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

      this.form.worker.splice(index, 1);
      this.$message.success("删除成功");
    },
    // 🧧删除选择的工具
    async removeToolById(index) {
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

      this.form.tool.splice(index, 1);
      this.$message.success("删除成功");
    },
    // 🧧修改选择的工具数量
    editToolById(id) {
      id = id - 1;
      this.toolEditDialogVisible = true;
      this.chosen.Id = id;
      this.chosen.Name = this.form.tool[id].name;
      this.chosen.Type = this.form.tool[id].type;
      this.chosen.Amount = this.form.tool[id].amount;
      this.chosen.Number = this.form.tool[id].needNumber;
    },
    // 🧧确定修改
    comfirmEditTool() {
      this.form.change++;
      this.form.tool[this.chosen.Id].needNumber = this.chosen.Number;
      console.log(this.form.tool[this.chosen.Id].needNumber);
      this.toolEditDialogVisible = false;
    },
    // 🎫清空
    async clearForm() {
      // 弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将清空所填写的内容，是否继续?",
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
        return this.$message.info("已取消清空操作");
      }

      this.form = {};
      this.$message.success("清空成功");
    },
    // 🎫提交数据
    async onSubmit() {
      // 发起网络请求
      this.form.date = `${this.date1} ${this.date2}`;
      this.form.inspectorID = this.$root.mangerId;
      console.log(this.form);
      const { data: res } = await this.$http.post(
        "/ProjectServlet?action=add",
        this.form
      );
      console.log(res);
      // this.form = {};
      if (res.status !== 200) {
        this.$message.error("提交项目失败!");
        return;
      }
      this.$message.success("提交项目成功！");
      this.form = {};
      this.date1 = "";
      this.date2 = "";
    },
  },
};
</script>

<style>
.card-form {
  width: 980px;
}
</style>