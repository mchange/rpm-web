<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="120px">
      <el-form-item label="服务主机">
        <el-select v-model="form.providerHost" clearable placeholder="请选择">
          <el-option
            v-for="item in hosts"
            :key="item.host"
            :label="item.host"
            :value="item.host">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务端口">
        <el-input v-model="form.providerPort" />
      </el-form-item>
      <el-form-item label="服务PID">
        <el-input v-model="form.providerPid" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onCancel">清空</el-button>
      </el-form-item>
    </el-form>

    <span> 共：{{totalCount}} 条 </span>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      height="700px"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="Provider命令">
                <span>{{ scope.row.p_command }}</span>
              </el-form-item>
              <el-form-item label="Consumer命令">
                <span>{{ scope.row.c_command }}</span>
              </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="服务方" align="center">
        <el-table-column align="center" label="主机" sortable>
          <template slot-scope="scope">
            {{ scope.row.p_host}}
          </template>
        </el-table-column>
        <el-table-column label="用户名" sortable>
          <template slot-scope="scope">
            {{ scope.row.p_user_name }}
          </template>
        </el-table-column>
        <el-table-column label="PID"  align="center" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.p_pid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="程序"  align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.p_program }}</span>
          </template>
        </el-table-column>
        <el-table-column label="监听端口"  align="center" sortable=true>
          <template slot-scope="scope">
            <span>{{ scope.row.p_port }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.p_remark}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="启动时间"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.p_start_date }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEditRemarkClick(scope.row),remarkDialogTableVisible = true" type="text" size="small">修改备注</el-button>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="消费方" align="center">
        <el-table-column align="center" label="主机" >
          <template slot-scope="scope">
            {{ scope.row.c_host}}
          </template>
        </el-table-column>
        <el-table-column label="用户名" >
          <template slot-scope="scope">
            {{ scope.row.c_user_name }}
          </template>
        </el-table-column>
        <el-table-column label="PID"  align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.c_pid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="程序"  align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.c_program }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.c_remark}}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="启动时间"  align="center">
          <template slot-scope="scope">
            <span>{{scope.row.c_start_date }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>


    <el-dialog title="编辑备注" :visible.sync="remarkDialogTableVisible" width="50%">
      <el-form :model="remarkForm">
        <el-form-item label="Provider：备注">
          <el-input v-model="remarkForm.remark" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRemarkCommit(), remarkDialogTableVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getProviderList,getProviderHost,editProviderRemark } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      form: {
        providerHost: '',
        providerPid: '',
        providerPort: ''
      },
      totalCount: 0,
      hosts: [],
      remarkDialogTableVisible: false,
      remarkForm: {
        remark: '',
        host: '',
        pid: ''
      }
    }
  },
  created() {
    this.initHostSelect()
  },
  methods: {
    onSubmit() {
      this.fetchData()
    },
    onCancel() {
      this.form = ''
    },
    initHostSelect(){
      getProviderHost().then(response => {
        this.hosts = response.data.items
      })
    },
    fetchData() {
      this.listLoading = true
      getProviderList(this.form).then(response => {
        this.list = response.data.items
        this.listLoading = false
        this.totalCount = this.list.length
      })
    },
    // 编辑备注
    handleEditRemarkClick(row) {
      // console.log(row)
      this.remarkForm.remark = row["p_remark"]
      this.remarkForm.host = row["p_host"]
      this.remarkForm.pid = row["p_pid"]

      // row["c_host"] = '127.0.0.1'
    },
    // 提交备注修改
    editRemarkCommit() {
      // console.log(this.remarkForm)
      editProviderRemark(this.remarkForm).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
        this.remarkDialogTableVisible = false
        this.fetchData()
      })
    }
  }
}
</script>
