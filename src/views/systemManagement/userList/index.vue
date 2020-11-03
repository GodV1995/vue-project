<template>
  <div class="app-container role-list">
    <el-form class="top" :model="form" label-width="110px">
      <el-form-item label="账户名称：">
        <el-input placeholder="请输入" v-model="form.name" class="role-name"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchUser()">搜索</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div class="table-top">
        <el-row class="btn-div">
          <el-button type="primary"  @click="updateShow">修改</el-button>
          <el-button type="primary" @click="addShow">新增</el-button>
          <el-button type="primary" @click="handleDelete">删除</el-button>
          <el-button type="primary" @click="assignShow">分配角色</el-button>
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
          prop="userAccount"
          label="账户"
          width="180">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="unitName"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="position"
          label="职位">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="手机号码">
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
      <!-- 分页 -->
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
    <el-dialog :title="formDialogTitle" :before-close="closeDialog" :visible.sync="showDialog" class="add-user" :class="isUpdate ? 'update-user' : ''">
      <el-form :model="ruleForm" :rules="isLook || isUpdate ? {} : rules" ref="ruleForm" label-width="30%" class="demo-ruleForm">
        <el-form-item v-show="!isUpdate" label="机构名称" prop="unitName">
          <el-input :disabled="isLook" :span="12" v-model="ruleForm.unitName" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="!isUpdate" label="登录名" prop="loginName">
          <el-input :disabled="isLook" :span="12" v-model="ruleForm.loginName" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input :disabled="isLook" v-model="ruleForm.password" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="!isUpdate" label="真实姓名" prop="realName">
          <el-input :disabled="isLook" v-model="ruleForm.realName" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="!isUpdate" label="身份证号" prop="identityNo">
          <el-input :disabled="isLook" v-model="ruleForm.identityNo" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="isLook" label="生日" prop="birthday">
          <el-input :disabled="isLook" v-model="ruleForm.birthday" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="isLook" label="性别" prop="gender">
          <el-input :disabled="isLook" v-model="ruleForm.gender" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNo">
          <el-input :disabled="isLook" v-model="ruleForm.phoneNo" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="!isUpdate" label="电子邮箱" prop="email">
          <el-input :disabled="isLook" v-model="ruleForm.email" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item v-show="!isUpdate" label="账号状态">
          <el-select :disabled="isLook" v-model="ruleForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input :disabled="isLook" v-model="ruleForm.department" class="input-wd"></el-input>
        </el-form-item>
        <el-form-item label="职务" prop="position">
          <el-input :disabled="isLook" v-model="ruleForm.position" class="input-wd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="isAdd" type="primary" @click="addBtn()">确定</el-button>
        <el-button v-show="isUpdate" type="primary" @click="updateBtn()">确定</el-button>
        <el-button v-show="!isLook" @click="closeDialog()">取消</el-button>
        <el-button v-show="isLook" type="primary" @click="closeDialog()">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="assignRoles">
      <div class="assignrole-main">
        <el-transfer v-model="values" :data="data"></el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" @click="addDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getUserInfo, updateUser, addUser, delUser } from '@/api/userList'
import Pagination from '@/components/Pagination' // 导入分页插件
export default {
  components: { Pagination },
  data() {
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项${i}`
        })
      }
      return data
    }
    // 手机验证
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value))
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      data: generateData(),
      values: [],
      form: {
        name: ''
      },
      tableData: [],
      total: 0,
      currentPage: 1,
      limit: 10,
      showDialog: false,
      formLabelWidth: '120px',
      ruleForm: {
        unitName: '',
        loginName: '',
        password: '',
        realName: '',
        identityNo: '',
        birthday: '',
        gender: '',
        phoneNo: '',
        email: '',
        position: '',
        department: '',
        state: ''
      },
      rules: {
        unitName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        identityNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { min: 18, max: 18, message: '身份证号必须为18位', trigger: 'blur' }
        ],
        phoneNo: [
          { validator: checkPhone, required: true, trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的电子邮箱', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职务', trigger: 'blur' }
        ]
      },
      options: [{
        value: '0',
        label: '可用'
      }, {
        value: '1',
        label: '禁用'
      }],
      genderOptions: [{
        value: '0',
        label: '女性'
      }, {
        value: '1',
        label: '男性'
      }],
      value: '',
      assignRoles: false, // 分配角色弹窗
      lookShow: false, // 查看弹窗
      isLook: false,
      isAdd: false,
      isUpdate: false,
      selectOptions: [],
      formDialogTitle: '',
      isRefresh: false
    }
  },
  created() {
    this.showTableList()
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.showTableList()
      }
    }
  },
  methods: {
    handleSelectionChange(selectVal) {
      this.selectOptions = selectVal
    },
    handleSizeChange(val) {
      this.limit = val
      this.showTableList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.showTableList()
    },
    searchUser() {
      this.showTableList()
    },
    showTableList() {
      let res = {
        unitId: '1',
        userName: this.form.name,
        pageNum: this.currentPage,
        pageSize: this.limit
      }
      getUserList(res).then(data => {
        this.total = data.data.total
        this.tableData = data.data.list
        this.isRefresh = false
      })
    },
    // 添加
    addShow() {
      this.ruleForm = {
        unitName: '',
        account: '',
        loginName: '',
        password: '',
        realName: '',
        identityNo: '',
        birthday: '',
        gender: '',
        phoneNo: '',
        email: '',
        position: '',
        department: '',
        state: ''
      }
      this.formDialogTitle = '添加用户'
      this.showDialog = this.isAdd = true
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let req = this.ruleForm
          if (req.identityNo.length === 18) {
            let year = req.identityNo.substring(6, 10)
            let month = req.identityNo.substring(10, 12)
            let day = req.identityNo.substring(12, 14)
            req.birthday = year + '-' + month + '-' + day
          }
          let idGender = req.identityNo.substr(req.identityNo.length - 2, 1) / 2
          if (idGender === 0 || idGender === 1) {
            req.gender = 0
          } else {
            req.gender = 1
          }
          req.unitId = '1'
          addUser(req).then(res => {
            this.$message({
              message: '添加用户成功！',
              type: 'warning',
              center: true
            })
            this.showDialog = false
            this.isAdd = false
            this.isRefresh = !this.isRefresh
          })
        } else {
          return false
        }
      })
    },
    // 修改
    updateShow() {
      this.isUpdate = true
      if (this.selectOptions.length === 1) {
        this.formDialogTitle = '修改用户'
        getUserInfo({userUnitId: this.selectOptions[0].id.toString()}).then(res => {
          this.ruleForm = res.data
          if (this.ruleForm.gender === 0) {
            this.ruleForm.gender = '女性'
          } else {
            this.ruleForm.gender = '男性'
          }
          this.showDialog = true
        })
      } else {
        this.$message({
          message: '请选择一位用户！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      let req = {
        userUnitId: this.ruleForm.userUnitid.toString(),
        password: this.ruleForm.password.toString(),
        phoneNo: this.ruleForm.phoneNo.toString(),
        department: this.ruleForm.department.toString(),
        position: this.ruleForm.position.toString()
      }
      updateUser(req).then(res => {
        this.$message({
          message: '修改信息成功！',
          type: 'warning',
          center: true
        })
        this.isRefresh = !this.isRefresh
        this.showDialog = false
        this.isUpdate = false
      })
    },
    // 分配角色
    assignShow() {
      if (this.selectOptions.length === 1) {
        this.formDialogTitle = '编辑资源'
        this.ruleForm = this.selectOptions[0]
        this.assignRoles = true
      } else {
        this.$message({
          message: '请选择一位用户！',
          type: 'warning',
          center: true
        })
      }
    },
    // 查看
    handleLook(row) {
      this.showDialog = true
      this.isLook = true
      this.formDialogTitle = '查看用户'
      var req = {
        userUnitId: row.id.toString()
      }
      getUserInfo(req).then(res => {
        this.ruleForm = res.data
        if (this.ruleForm.gender === 0) {
          this.ruleForm.gender = '女性'
        } else {
          this.ruleForm.gender = '男性'
        }
      })
    },
    // 删除
    handleDelete(row) {
      if (this.selectOptions.length > 0) {
        this.$confirm('确定删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let arr = []
          this.selectOptions.forEach(ele => {
            arr.push(ele.id)
          })
          let req = {
            ids: arr.toString()
          }
          delUser(req).then(res => {
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
          message: '请选择用户！',
          type: 'warning',
          center: true
        })
      }
    },
    closeDialog() {
      this.showDialog = this.isAdd = this.isLook = this.isUpdate = false
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
  .table-page {
    display: flex;
    align-items: center;
    padding-left: 7px;
    height: 41px;
    background: white;
    border: 1px solid #e6e6e6;
    border-top: 0;
  }
  .has-gutter tr th{
    text-align: center
  }
  .btn-div{
    button{
      padding: 6px 10px;
    }
  }
  .-container[data-v-72233bcd] {
    padding: 12px 16px;
  }
  .add-user{
    .demo-ruleForm{
      height: 400px !important;
      overflow-y: scroll;
    }
    .input-wd{
      width: 60% !important;
    }
    .el-select{
      width: 60%;
      .el-input__inner{
        width: 100% !important;
      }
    }
  }
  .update-user {
    .demo-ruleForm{
      height: auto !important;
      overflow-y: auto;
    }
  }
  .assignrole-main{
    width: 84%;
    margin: 0 auto;
  }
  .table-top {
    padding: 10px 15px;
    background-color: #f2f2f2;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
    margin-top: 20px;
  }
  .look-btn{
    padding: 0 5px;
    height: 22px;
  }
</style>
