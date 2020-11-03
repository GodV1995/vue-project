<template>
  <div class="app-container dictionaries-list">
    <el-form class="top" :model="form" label-width="110px">
      <el-form-item label="分类名称：">
        <el-input placeholder="请输入" v-model="form.name" class="role-name"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <div class="table-top">
        <el-button type="primary" size="small" @click="updateShow">修改</el-button>
        <el-button type="primary" size="small" @click="addShow">新增</el-button>
        <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
      </div>
      <el-table
        class="role-table"
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
          prop="name"
          label="分类名称">
        </el-table-column>
        <el-table-column
          prop="code"
          label="分类编号">
        </el-table-column>
        <el-table-column
          prop="describes"
          label="描述">
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
        <el-form-item prop="name" :rules="{required: true, message: '分类名称不能为空', trigger: 'blur'}" label="分类名称：">
          <el-input :disabled="isLook" v-model="ruleForm.name" :placeholder="isLook ? '' : '如：超级管理员'"></el-input>
        </el-form-item>
        <el-form-item label="分类编号：">
          <el-input :disabled="isLook || isUpdate" v-model="ruleForm.preCode" :placeholder="isLook ? '' : '如：super_admin'"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input :disabled="isLook" v-model="ruleForm.describes" :placeholder="isLook ? '' : '如：权限分配者'"></el-input>
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
import { getDictionariesList, addDictionaries, getDictionaries, deleteDictionaries, updateDictionaries } from '@/api/dictionariesMenu'
export default {
  data() {
    return {
      isRefresh: false,
      form: {
        name: ''
      },
      tableData: [],
      currentPage: 1,
      limit: 10,
      total: 0,
      dialogFormVisible: false,
      formDialogTitle: '',
      ruleForm: {
        name: '',
        preCode: '',
        describes: ''
      },
      selectOptions: [],
      isDisabled: false,
      isAdd: false,
      isUpdate: false,
      isLook: false
    }
  },
  created() {
    this.getDictionariesData()
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.getDictionariesData()
      }
    }
  },
  methods: {
    handleSelectionChange(selectVal) {
      this.selectOptions = selectVal
    },
    handleSizeChange(val) {
      this.limit = val
      this.getDictionariesData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDictionariesData()
    },
    getDictionariesData() {
      let req = {
        page: this.currentPage,
        limit: this.limit,
        name: this.form.name
      }
      getDictionariesList(req).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.isRefresh = false
      })
    },
    searchUser() {
      this.getDictionariesData()
    },
    updateShow() {
      if (this.selectOptions.length === 1) {
        this.isUpdate = this.dialogFormVisible = true
        let req = {
          id: this.selectOptions[0].id.toString()
        }
        getDictionaries(req).then(res => {
          this.ruleForm = res.data
        })
      } else {
        this.$message({
          message: '请选择一个字典目录！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      let req = {
        name: this.ruleForm.name,
        describes: this.ruleForm.describes,
        id: this.selectOptions[0].id
      }
      updateDictionaries(req).then(res => {
        this.$message({
          message: '修改成功！',
          type: 'success',
          center: true
        })
        this.dialogFormVisible = false
        this.isRefresh = !this.isRefresh
        this.isUpdate = false
      })
    },
    addShow() {
      this.ruleForm = {
        name: '',
        preCode: '',
        describes: ''
      }
      this.dialogFormVisible = true
      this.isAdd = true
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let req = {
            name: this.ruleForm.name.toString(),
            preCode: this.ruleForm.preCode.toString(),
            describes: this.ruleForm.describes.toString()
          }
          addDictionaries(req).then(res => {
            this.$message({
              message: '添加成功！',
              type: 'success',
              center: true
            })
            this.dialogFormVisible = false
            this.isAdd = false
            this.isRefresh = !this.isRefresh
          })
        }
      })
    },
    handleDelete() {
      if (this.selectOptions.length === 1) {
        this.$confirm('确定删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let req = {
            id: this.selectOptions[0].id.toString()
          }
          deleteDictionaries(req).then(res => {
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
          });         
        })
      } else {
        this.$message({
          message: '请选择一个字典目录！',
          type: 'warning',
          center: true
        })
      }
    },
    handleLook(row) {
      this.isLook = this.dialogFormVisible = true
      getDictionaries({ id: row.id }).then(res => {
        this.ruleForm = res.data
      })
    },
    closeDialog() {
      this.dialogFormVisible = this.isLook = this.isAdd = this.isUpdate = false
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
</style>