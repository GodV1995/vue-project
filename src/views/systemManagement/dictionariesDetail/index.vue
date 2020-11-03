<template>
  <div class="app-container dictionaries-detail">
    <div class="table-wrap">
      <el-aside width="20%">
        <div class="tree-tit">代码集分类</div>
        <el-tree :data="treeData" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <div class="table-right">
        <div class="tree-tit">代码集列表</div>
        <el-form class="top" :model="form">
          <el-form-item label="分类名称：">
            <el-input placeholder="请输入" v-model="form.name" class="role-name"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
          </el-form-item>
        </el-form>
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
    </div>
    <el-dialog class="dialog" :before-close="closeDialog" :title="formDialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" label-width="90px" ref="ruleForm">
        <el-form-item prop="name" :rules="{required: true, message: '明细名称不能为空', trigger: 'blur'}" label="明细名称：">
          <el-input :disabled="isLook" v-model="ruleForm.name" :placeholder="isLook ? '' : '请输入明细名称'"></el-input>
        </el-form-item>
        <el-form-item label="明细编号：" prop="code" :rules="{required: true, message: '明细编号不能为空', trigger: 'blur'}">
          <el-input :disabled="isLook" v-model="ruleForm.code" :placeholder="isLook ? '' : '请输入明细编号'"></el-input>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input :disabled="isLook" v-model="ruleForm.describes" :placeholder="isLook ? '' : '请输入描述'"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="enable" :rules="{required: true, message: '请选择启用状态', trigger: 'change'}">
          <el-select :disabled="isLook" v-model="ruleForm.enable" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
import { getDictionariesDetailList, getTreeList, addDictionariesDetail, updateDictionariesDetail, getDictionariesDetail, deleteDictionariesDetail } from '@/api/dictionariesDetail'
export default {
  data() {
    return {
      isRefresh: false,
      form: {
        name: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      tableData: [],
      currentPage: 1,
      limit: 10,
      total: 0,
      treeCode: '',
      selectOptions: [],
      options: [{
        value: '0',
        label: '可用'
      }, {
        value: '1',
        label: '禁用'
      }],
      formDialogTitle: '',
      ruleForm: {
        name: '',
        code: '',
        describes: '',
        enable: ''
      },
      classificationCode: '',
      dialogFormVisible: false,
      isLook: false,
      isAdd: false,
      isUpdate: false
    }
  },
  created() {
    getTreeList().then(res => {
      this.treeData = res.data
    })
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.getMenuList(this.treeCode)
      }
    }
  },
  methods: {
    handleNodeClick(res) {
      this.treeCode = this.classificationCode = res.code
      this.getMenuList(this.treeCode)
    },
    handleSizeChange(val) {
      this.limit = val
      this.getMenuList(this.treeCode, this.form.name)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMenuList(this.treeCode, this.form.name)
    },
    handleSelectionChange(selectVal) {
      this.selectOptions = selectVal
    },
    searchUser() {
      this.getMenuList(this.treeCode, this.form.name)
    },
    handleLook(row) {
      this.dialogFormVisible = this.isLook = true
      getDictionariesDetail({ id: row.id }).then(res => {
        this.ruleForm = res.data
      })
    },
    updateShow() {
      if (this.selectOptions.length === 1) {
        this.isUpdate = this.dialogFormVisible = true
        let req = {
          id: this.selectOptions[0].id.toString()
        }
        getDictionariesDetail(req).then(res => {
          this.ruleForm = res.data
        })
      } else {
        this.$message({
          message: '请选择一个字典明细！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = this.selectOptions[0].id
          updateDictionariesDetail(this.ruleForm).then(res => {
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
      if (this.classificationCode) {
        this.dialogFormVisible = this.isAdd = true
      } else {
        this.$message({
          message: '请选择一个代码集分类！',
          type: 'warning',
          center: true
        })
      }
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.classificationCode = this.classificationCode
          addDictionariesDetail(this.ruleForm).then(res => {
            this.$message({
              message: '添加成功！',
              type: 'success',
              center: true
            })
            this.isRefresh = !this.isRefresh
            this.dialogFormVisible = false
            this.isAdd = false
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
            id: this.selectOptions[0].id
          }
          deleteDictionariesDetail(req).then(res => {
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
    deleteBtn() {

    },
    closeDialog() {
      this.dialogFormVisible = this.isAdd = this.isLook = this.isUpdate = false
      this.$refs['ruleForm'].resetFields()
    },
    getMenuList(code, name) {
      let req = {
        page: this.currentPage,
        limit: this.limit,
        classification_code: code ? code : '',
        name: name ? name : ''
      }
      getDictionariesDetailList(req).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.isRefresh = false
      })
    },
    getDetailList() {
      // let req = {
      //   name: '',
      //   classification_code: '',
      //   page: this.currentPage,
      //   limit: this.limit
      // }
      // getDictionariesDetailList(req).then(res => {

      // })
    }
  }
}
</script>

<style lang="scss" scoped>
  .top {
    border: 1px solid #e6e6e6;
    border-bottom: 0;
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
    overflow: hidden;
    margin-top: 15px;
    .el-aside {
      float: left;
      border: 1px solid #e6e6e6;
      .tree-tit {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
      }
    }
    .table-right {
      width: 80%;
      padding-left: 15px;
      float: left;
      .tree-tit {
        border: 1px solid #e6e6e6;
        border-bottom: 0;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
      }
      .table-top {
        padding: 10px 15px;
        background-color: white;
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
    }
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);
  }
</style>