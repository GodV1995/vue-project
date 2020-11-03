<template>
  <div class="app-container resource-list">
    <el-form class="top" :model="form" label-width="110px">
      <el-form-item label="所属系统：">
        <el-select v-model="form.sysId" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" @change="systemChange">
          <el-option
            v-for="item in systemData"
            :key="item.id"
            :label="item.sysName"
            :value="item.id"
            ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <div class="top">
        <el-button type="primary" size="small" @click="deleteShow">删除资源</el-button>
        <el-button type="primary" size="small" @click="updateShow">修改资源</el-button>
        <el-button type="primary" size="small" @click="addShow">新增资源</el-button>
        <!-- <el-button type="primary" size="small" @click="sortBtn">资源排序</el-button> -->
      </div>
      <el-table
        class="table"
        :data="tableData"
        row-key="id"
        border
        default-expand-all
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          type="selection"
          align="center"
          width="48">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源URL"
          width="180">
        </el-table-column>
        <el-table-column
          prop="type"
          :formatter="typeFormatter"
          label="资源类型">
        </el-table-column>
        <el-table-column
          prop="resourceCode"
          label="资源代码">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" class="see" @click="handleClick(scope.row)" size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog class="dialog" :before-close="closeDialog" :title="formDialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" label-width="90px" ref="ruleForm">
        <el-form-item prop="name" :rules="{required: true, message: '资源名称不能为空', trigger: 'blur'}" label="资源名称：">
          <el-input :disabled="isLook" v-model="ruleForm.name" :placeholder="isLook ? '' : '请输入资源名称'"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源URL：">
          <el-input :disabled="isLook" v-model="ruleForm.url" :placeholder="isLook ? '' : '菜单URL'"></el-input>
        </el-form-item>
        <el-form-item label="资源图标：">
          <el-input :disabled="isLook" v-model="ruleForm.iconId"></el-input>
        </el-form-item>
        <el-form-item label="资源编码：">
          <el-input :disabled="isLook" v-model="ruleForm.resourceCode"></el-input>
        </el-form-item>
        <el-form-item label="资源类型：" :rules="{required: true, message: '资源类型不能为空', trigger: 'change'}">
          <el-select v-model="ruleForm.type" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" @change="typeChange">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级资源" prop="preId">
          <el-cascader
            :disabled="isLook"
            clearable
            :options="tableData"
            v-model="ruleForm.preId"
            @change="handleChange"
            :props="{value: 'id', label: 'name', checkStrictly: true}">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isAdd" type="primary" @click="addBtn()">确定</el-button>
        <el-button v-show="isUpdate" type="primary" @click="updateBtn()">确定</el-button>
        <el-button v-show="!isLook" @click="closeDialog()">取消</el-button>
        <el-button v-show="isLook" type="primary" @click="closeDialog()">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="系统菜单排序" width='350px' :visible.sync="dialogTreeVisible">
      <el-scrollbar>
        <el-tree
          :data="treeList"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
        </el-tree>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { getSystemList } from '@/api/systemList'
import { getResourceList, addResourceList, deleteResourceList, getResource } from '@/api/resourceList'
import { deepClone } from '@/utils'
import dataList from './dataList'
export default {
  name: 'systemManagement-resourceList',
  data() {
    return {
      isRefresh: false,
      tableData: [],
      dialogFormVisible: false,
      form: {
        sysId: ''
      },
      formDialogTitle: '',
      ruleForm: {
        name: '',
        url: '',
        iconId: '',
        resourceCode: '',
        type: '',
        preId: ''
      },
      oldFormDialog: {},
      dialogTreeVisible: false,
      treeList: dataList.treeList,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      systemData: [],
      selectOptions: [],
      typeData: [{
          value: '0',
          label: '菜单'
        }, {
          value: '1',
          label: '按钮'
        }
      ],
      menuOptions: dataList.cascaderList,
      isAdd: false,
      isUpdate: false,
      isLook: false
    }
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.getResourceData(this.form.sysId)
      }
    }
  },
  created() {
    const req = {
      page: 1,
      limit: 20,
      name: ''
    }
    getSystemList(req).then(res => {
      this.systemData = res.data.list
      this.form.sysId = this.systemData[0].id
      this.getResourceData(this.form.sysId)
    })
  },
  methods: {
    handleSelectionChange(selectList) {
      this.selectOptions = selectList
    },
    handleClick(row) {
      this.formDialogTitle = '查看资源'
      this.dialogFormVisible = this.isLook = true
      getResource({ resourceId: row.id }).then(res => {
        this.ruleForm = res.data
      })
    },
    handleChange(val) {
      if (val.length > 0) {
        this.ruleForm.preId = val[val.length - 1]
      } else {
        this.ruleForm.preId = ''
      }
    },
    typeFormatter(row) {
      let rowType = row.type
      if (rowType == 0) {
        return '菜单'
      } else if(rowType == 1) {
        return '按钮'
      }
    },
    getResourceData(id) {
      getResourceList({ sysId: id }).then(res => {
        this.tableData = res.data
        this.isRefresh = false
      })
    },
    typeChange() {

    },
    systemChange() {

    },
    deleteShow() {
      if (this.selectOptions.length > 0) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          this.selectOptions.forEach(e => {
            arr.push(e.id)
          })
          deleteResourceList({ ids: arr.toString() }).then(res => {
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
          message: '请选择数据！',
          type: 'warning',
          center: true
        })
      }
    },
    updateShow() {
      if (this.selectOptions.length === 1) {
        this.formDialogTitle = '修改资源'
        this.dialogFormVisible = this.isUpdate =  true
        getResource({ resourceId: this.selectOptions[0].id }).then(res => {
          this.ruleForm = res.data
        })
      } else {
        this.$message({
          message: '请选择一条数据！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = this.selectOptions[0].id
          this.ruleForm.sysId = this.form.sysId
          let req = {
            id: this.ruleForm.id.toString(),
            sysId: this.ruleForm.sysId.toString(),
            name: this.ruleForm.name.toString(),
            url: this.ruleForm.url.toString(),
            iconId: this.ruleForm.iconId.toString(),
            resourceCode: this.ruleForm.resourceCode.toString(),
            type: this.ruleForm.type.toString(),
            preId: this.ruleForm.preId.toString()
          }
          addResourceList(this.ruleForm).then(res => {
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
      this.formDialogTitle = '新增资源'
      this.ruleForm = {
        name: '',
        url: '',
        iconId: '',
        resourceCode: '',
        type: '',
        preId: ''
      },
      this.dialogFormVisible = this.isAdd =  true
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = ''
          this.ruleForm.sysId = this.form.sysId
          addResourceList(this.ruleForm).then(res => {
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
    sortBtn() {
      this.dialogTreeVisible = true
    },
    closeDialog() {
      this.dialogFormVisible = this.isAdd = this.isUpdate = this.isLook = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-wrap {
    margin-top: 15px;
    background: white;
    .top {
      padding: 10px 15px;
      background-color: #f2f2f2;
      border: 1px solid #e6e6e6;
      border-bottom: 0;
    }
    .table {
      border-color: #e6e6e6;
      .see {
        padding: 0 5px;
        height: 22px;
      }
    }
  }
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
</style>