<template>
  <div class="app-container system-list">
    <el-form class="top" :model="form" label-width="110px">
      <el-form-item label="系统名称：">
        <el-input placeholder="请输入" v-model="form.name" class="role-name"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div class="table-top">
        <el-row class="btn-div">
          <el-button type="primary" @click="updateShow">修改</el-button>
          <el-button type="primary" @click="addShow">新增</el-button>
          <el-button type="primary" @click="handleDelete">删除</el-button>
        </el-row>
      </div>
      <el-table
        :data="tableData"
        border
        height="400"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="sysName"
          label="系统名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sysDomain"
          label="系统域名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sysDescription"
          label="系统描述">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleLook(scope.row)" class="look-btn" type="primary" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialog" :before-close="closeDialog" :title="formDialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" label-width="90px" ref="ruleForm">
        <el-form-item prop="sysName" label="系统名称：" :rules="{required: true, message: '系统名称不能为空', trigger: 'blur'}">
          <el-input :disabled="isLook" v-model="ruleForm.sysName" :placeholder="isLook ? '' : '请输入系统名称'"></el-input>
        </el-form-item>
        <el-form-item prop="sysDomain" :rules="{required: true, message: '系统域名不能为空', trigger: 'blur'}" label="系统域名：">
          <el-input :disabled="isLook" v-model="ruleForm.sysDomain" :placeholder="isLook ? '' : '请输入系统域名'"></el-input>
        </el-form-item>
        <el-form-item label="系统描述：">
          <el-input :disabled="isLook" v-model="ruleForm.sysDescription" :placeholder="isLook ? '' : '请输入系统描述'"></el-input>
        </el-form-item>
        <el-form-item v-show="isLook" label="创建时间：">
          <el-input disabled v-model="ruleForm.createTime"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isAdd" type="primary" @click="addBtn()">确定</el-button>
        <el-button v-show="isUpdate" type="primary" @click="updateBtn()">确定</el-button>
        <el-button v-show="!isLook" @click="closeDialog()">取消</el-button>
        <el-button v-show="isLook" type="primary" @click="closeDialog()">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSystemList, addSystem, deleteSystem, updateSystem, getSystem } from '@/api/systemList'

export default {
  name: 'systemManagement-systemList',
  data() {
    return {
      isRefresh: false,
      form: {
        name: ''
      },
      selectOptions: [],
      tableData: [],
      ruleForm: {
        sysDomain: '',
        sysName: '',
        sysDescription: '',
        createTime: ''
      },
      currentPage: 1,
      limit: 10,
      total: 0,
      dialogFormVisible: false,
      formDialogTitle: '',
      isAdd: false,
      isUpdate: false,
      isLook: false
    }
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.getSystemData()
      }
    }
  },
  created() {
    this.getSystemData()
  },
  methods: {
    handleSelectionChange(selectVal) {
      this.selectOptions = selectVal
    },
    handleLook(row) {
      this.dialogFormVisible = this.isLook = true
      this.formDialogTitle = '查看系统'
      getSystem({ unitId: row.id }).then(res => {
        this.ruleForm = res.data
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getSystemData()
    },
    handleCurrentChange() {
      this.currentPage = val
      this.getSystemData()
    },
    getSystemData() {
      let req = {
        name: this.form.name,
        page: this.currentPage,
        limit: this.limit
      }
      getSystemList(req).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.isRefresh = false
      })
    },
    searchUser() {
      this.getSystemData()
    },
    updateShow() {
      if (this.selectOptions.length === 1) {
        this.isUpdate = this.dialogFormVisible = true
        this.formDialogTitle = '修改系统'
        getSystem({ unitId: this.selectOptions[0].id }).then(res => {
          this.ruleForm = res.data
        })
      } else {
        this.$message({
          message: '请选择一个系统！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = this.selectOptions[0].id
          let req = {
            id: this.ruleForm.id,
            sysDomain: this.ruleForm.sysDomain,
            sysName: this.ruleForm.sysName,
            sysDescription: this.ruleForm.sysDescription
          }
          updateSystem(req).then(res => {
            this.$message({
              message: '修改成功！',
              type: 'success',
              center: true
            })
            this.isRefresh = !this.isRefresh
            this.dialogFormVisible = this.isUpdate = false
          })
        }
      })
    },
    addShow() {
      this.ruleForm = {
        sysDomain: '',
        sysName: '',
        sysDescription: ''
      }
      this.formDialogTitle = '添加系统'
      this.dialogFormVisible = this.isAdd = true
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          addSystem(this.ruleForm).then(res => {
            this.isRefresh = !this.isRefresh
            this.dialogFormVisible = this.isAdd = false
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          })
        }
      })
    },
    handleDelete() {
      if (this.selectOptions.length === 1) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSystem({ unitId: this.selectOptions[0].id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.isRefresh = !this.isRefresh
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '请选择一个系统！',
          type: 'warning',
          center: true
        })
      }
    },
    closeDialog() {
      this.dialogFormVisible = this.isLook = this.isUpdate = this.isAdd = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .top {
    background: white;
    padding: 15px;
    .el-form-item {
      margin: 0;
      .role-name {
        width: 130px;
      }
      .name-search {
        background-color: #1E9FFF;
        color: white;
        margin-left: 5px;
        border-radius: 2px;
        .icon-search {
          margin-right: 2px;
        }
      }
    }
  }
  .btn-div{
    button{
      padding: 6px 10px;
    }
  }
  .table-page {
    display: flex;
    align-items: center;
    padding-left: 7px;
    height: 41px;
    background: white;
    border: 1px solid #e6e6e6;
    border-top: 0;
  }
  .table-top {
    padding: 10px 15px;
    background-color: #f2f2f2;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    margin-top: 20px;
  }
</style>