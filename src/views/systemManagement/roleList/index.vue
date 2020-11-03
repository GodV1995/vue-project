<template>
  <div class="app-container role-list">
    <el-form class="top" :model="form" label-width="110px">
      <el-form-item label="角色名称：">
        <el-input placeholder="请输入" v-model="form.name" class="role-name"></el-input>
        <el-button type="primary" class="name-search"  @click="searchUser()"><svg-icon class="icon-search" icon-class="search"/>查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <div class="table-top">
        <el-button type="primary" size="small" @click="assignmentBtn">权限分配</el-button>
        <el-button type="primary" size="small" @click="updateShow">修改</el-button>
        <el-button type="primary" size="small" @click="addShow">新增</el-button>
      </div>
      <el-table
        class="role-table"
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          align="center"
          width="48">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleCode"
          label="角色代码">
        </el-table-column>
        <el-table-column
          prop="descrption"
          label="信息描述">
        </el-table-column>
        <el-table-column
          width="102"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" class="see" @click="handleClick(scope.row)" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 5000]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="dialog" :title="formDialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="formDialog" label-width="35%" ref="ruleForm">
        <el-form-item label="角色名称" prop="roleName" :rules="{required: true, message: '角色名称不能为空', trigger: 'blur'}">
          <el-input :disabled="isLook" v-model="formDialog.roleName" :placeholder="isLook ? '' : '如：超级管理员'"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode" :rules="{required: true, message: '角色代码不能为空', trigger: 'blur'}">
          <el-input :disabled="isLook" v-model="formDialog.roleCode" :placeholder="isLook ? '' : '如：super_admin'"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input :disabled="isLook" v-model="formDialog.descrption" :placeholder="isLook ? '' : '如：权限分配者'"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isAdd" type="primary" @click="addBtn()">确定</el-button>
        <el-button v-show="isUpdate" type="primary" @click="updateBtn()">确定</el-button>
        <el-button v-show="!isLook" @click="closeDialog()">取消</el-button>
        <el-button v-show="isLook" type="primary" @click="closeDialog()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配权限" width='350px' :visible.sync="dialogTreeVisible">
      <el-scrollbar>
        <el-tree
          :data="treeList"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          @check="handleNodeClick"
          :expand-on-click-node="false">
        </el-tree>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, addRoleList, getRole, updateRole, updateUser, getRoleForUser } from '@/api/roleList'
import { getResourceList } from '@/api/resourceList'
export default {
  data() {
    return {
      form: {
        name: ''
      },
      formDialog: {
        roleName: '',
        roleCode: '',
        descrption: ''
      },
      formDialogTitle: '',
      dialogFormVisible: false,
      dialogTreeVisible: false,
      currentPage: 1,
      limit: 10,
      total: 0,
      selectOptions: [],
      tableData: [],
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isRefresh: false,
      isLook: false,
      isUpdate: false,
      isAdd: false
    }
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.getRoleListData()
      }
    }
  },
  created() {
    this.getRoleListData()
    getResourceList({ sysId: 1 }).then(res => {
      console.log(res.data)
      this.treeList = res.data
    })
  },
  methods: {
    handleSelectionChange(selectList) {
      this.selectOptions = selectList
    },
    handleClick(row) {
      this.formDialogTitle = '查看角色'
      this.dialogFormVisible = this.isLook = true
      getRole({ roleId: row.id }).then(res => {
        this.formDialog = res.data
      })
    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    handleNodeClick(a, b, c) {
      console.log(a, b, c)
    },
    searchUser() {

    },
    getRoleListData() {
      let req = {
        name: this.form.name,
        pageNum: this.currentPage,
        limit: this.limit
      }
      getRoleList(req).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.isRefresh = false
      })
    },
    assignmentBtn() {
      if (this.selectOptions.length === 1) {
        this.dialogTreeVisible = true
      } else {
        this.$message({
          message: '请选择一个角色！',
          type: 'warning',
          center: true
        })
      }
    },
    updateShow() {
      if (this.selectOptions.length === 1) {
        this.formDialogTitle = '编辑角色'
        getRole({ roleId: this.selectOptions[0].id }).then(res => {
          this.formDialog = res.data
        })
        this.dialogFormVisible = this.isUpdate = true
      } else {
        this.$message({
          message: '请选择一个角色！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let req = {
            id: this.formDialog.id,
            roleName: this.formDialog.roleName,
            roleCode: this.formDialog.roleCode,
            descrption: this.formDialog.descrption
          }
          addRoleList(req).then(res => {
            this.$message({
              message: '修改成功！',
              type: 'success',
              center: true
            })
            this.dialogFormVisible = this.isUpdate = false
            this.isRefresh = !this.isRefresh
          })
        }
      })
    },
    addShow() {
      this.formDialog = {
        roleName: '',
        roleCode: '',
        descrption: ''
      }
      this.formDialogTitle = '添加角色'
      this.dialogFormVisible = this.isAdd = true
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let req = {
            id: '',
            roleName: this.formDialog.roleName,
            roleCode: this.formDialog.roleCode,
            descrption: this.formDialog.descrption
          }
          addRoleList(req).then(res => {
            this.$message({
              message: '添加成功！',
              type: 'success',
              center: true
            })
            this.dialogFormVisible = this.isAdd = false
            this.isRefresh = !this.isRefresh
          })
        }
      })
    },
    closeDialog() {
      this.dialogFormVisible = this.isUpdate = this.isAdd = this.isLook = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .top {
    background: white;
    padding: 15px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
    .el-form-item {
      margin: 0;
      .role-name {
        width: 130px;
      }
      .name-search {
        margin-left: 5px;
        .icon-search {
          margin-right: 2px;
        }
      }
    }
  }
  .table-wrap {
    margin-top: 15px;
    .table-top {
      padding: 10px 15px;
      background-color: #f2f2f2;
      border: 1px solid #e6e6e6;
      border-bottom: 0;
    }
    .role-table {
      border-color: #e6e6e6;
      .see {
        padding: 0 5px;
        height: 22px;
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
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  }
  .dialog {
    .el-input {
      width: 190px;
    }
  }
  .el-scrollbar {
    height: 450px;
  }
</style>