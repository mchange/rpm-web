<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="form" label-width="120px">
      <el-form-item label="主机">
        <el-select v-model="form.host" clearable placeholder="请选择">
          <el-option
            v-for="item in hosts"
            :key="item.host"
            :label="item.host"
            :value="item.host">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="PID">
        <el-input v-model="form.pid" />
      </el-form-item>
      <el-form-item label="用户">
        <el-input v-model="form.userName" />
      </el-form-item>
      <el-form-item label="命令">
        <el-input v-model="form.command" />
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
      :default-sort = "{prop: 'userName', order: 'descending'}"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主机" width="150" sortable="true" >
        <template slot-scope="scope">
          {{ scope.row.host}}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="100" prop="userName" sortable="true" >
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="PID" width="110" align="center" sortable="true" >
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="启动时间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="命令"  align="left">
        <template slot-scope="scope">
          <span>{{scope.row.command }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getProcessList, getProcessHost } from '@/api/table'

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
        host: '',
        pid: '',
        userName: '',
        command:''
      },
      totalCount: 0,
      hosts: []
    }
  },
  created() {
    // this.fetchData()
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
      getProcessHost().then(response => {
        this.hosts = response.data.items
      })
    },
    fetchData() {
      this.listLoading = true
      getProcessList(this.form).then(response => {
        this.list = response.data.items
        this.listLoading = false
        this.totalCount = this.list.length
      })
    }
  }
}
</script>
