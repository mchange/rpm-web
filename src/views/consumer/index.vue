<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="120px">
      <el-form-item label="消费主机">
        <el-select v-model="form.consumerHost" clearable placeholder="请选择">
          <el-option
            v-for="item in hosts"
            :key="item.host"
            :label="item.host"
            :value="item.host">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消费PID">
        <el-input v-model="form.consumerPid" />
      </el-form-item>
      <el-form-item label="服务主机">
        <el-input v-model="form.providerHost" />
      </el-form-item>
      <el-form-item label="服务端口">
        <el-input v-model="form.providerPort" />
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
              <el-form-item label="Consumer命令">
                <span>{{ scope.row.c_command }}</span>
              </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>

      <el-table-column label="消费方" align="center">
        <el-table-column align="center" label="主机" prop="c_host" :filters="hostFilters" :filter-method="filterHostHandler">
          <template slot-scope="scope">
            {{ scope.row.c_host}}
          </template>
        </el-table-column>
        <el-table-column label="用户名"  >
          <template slot-scope="scope">
            {{ scope.row.c_user_name }}
          </template>
        </el-table-column>
        <el-table-column label="PID" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.c_pid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="程序" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.c_program }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="启动时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.c_start_date }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.c_remark}}</span>
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
      
      <el-table-column label="服务方" align="center">
        <el-table-column align="center" label="主机" >
          <template slot-scope="scope">
            {{ scope.row.p_host}}
          </template>
        </el-table-column>
        <el-table-column label="服务端口" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.p_port }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="备注" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.p_remark}}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleDetailClick(scope.row),dialogTableVisible = true" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
        
      </el-table-column>
      
    </el-table>

    <el-dialog title="服务方信息" :visible.sync="dialogTableVisible" width="80%">
      <el-table :data="processDetail" border fit >
        <el-table-column property="host" label="主机" width="130px"></el-table-column>
        <el-table-column property="port" label="服务端口" width="100px" ></el-table-column>
        <el-table-column property="pid" label="PID" width="100px" ></el-table-column>
        <el-table-column property="program" label="程序" width="100px" ></el-table-column>
        <el-table-column property="user_name" label="用户" width="100px" ></el-table-column>
        <el-table-column property="start_date" label="启动日期" width="100px"></el-table-column>
        <el-table-column property="command" label="命令"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="编辑备注" :visible.sync="remarkDialogTableVisible" width="50%">
      <el-form :model="remarkForm">
        <el-form-item label="Consumer：备注">
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
import { getConsumerList,getConsumerHost,getProviderDetail, editConsumerRemark } from '@/api/table'

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
      // 表单数据
      form: {
        consumerHost: '',
        consumerPid: '',
        providerHost: '',
        providerPort: ''
      },
      // 数据量
      totalCount: 0,
      // 主机列表
      hosts: [],
      // 服务方进程信息
      processDetail: [],
      // 弹出框显示标志
      dialogTableVisible: false,
      // 主机过滤数据
      hostFilters: [],
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
      getConsumerHost().then(response => {
        this.hosts = response.data.items
        // 初始化主机过滤字段值
        for(const i in this.hosts){
          this.hostFilters.push({text:this.hosts[i].host, value:this.hosts[i].host})
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getConsumerList(this.form).then(response => {
        this.list = response.data.items
        this.listLoading = false
        this.totalCount = this.list.length
      })
    },
    // 根据服务方host 和 port 查询详细信息
    handleDetailClick(row) {
        this.listLoading = true
        var params = {"providerHost": row.p_host, "providerPort": row.p_port}
        getProviderDetail(params).then(response => {
          this.processDetail = response.data.items
          this.listLoading = false
        })
        console.log(row)
    },
    // 处理“主机”字段筛选
    filterHostHandler(value, row, column){
      console.log(row)
      const property = column['property'];
      return row[property] === value;
    },
    // 编辑备注
    handleEditRemarkClick(row) {
      // console.log(row)
      this.remarkForm.remark = row["c_remark"]
      this.remarkForm.host = row["c_host"]
      this.remarkForm.pid = row["c_pid"]

      // row["c_host"] = '127.0.0.1'
    },
    // 提交备注修改
    editRemarkCommit() {
      // console.log(this.remarkForm)
      editConsumerRemark(this.remarkForm).then(response => {
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
