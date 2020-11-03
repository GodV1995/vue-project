<template>
  <el-container class="mechanism-list">
    <el-header>
      <el-form class="top" :model="form" label-width="110px">
        <el-form-item label="账号名称：">
          <el-input placeholder="请输入" v-model="form.name" class="role-name"></el-input>
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-tree :data="treeData" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <div class="table-top">
          <el-row class="btn-div">
            <el-button size="mini" type="primary" @click="reviseBtn">修改</el-button>
            <el-button size="mini" type="primary" @click="addTableData">新增</el-button>
            <el-button size="mini" type="primary" @click="deleteBtn">删除</el-button>
            <el-button size="mini" type="primary" @click="treeSort">机构排序</el-button>
          </el-row>
        </div>
        <el-table :data="tableData" border height="400" style="width: 100%" @selection-change="changeFun">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="unitName" label="机构名称"></el-table-column>
          <el-table-column prop="preUnitId" :formatter="preUnitFormatter" label="上级机构"></el-table-column>
          <el-table-column prop="preUnitRelation" :formatter="preUnitRelationFormatter" label="与上级机构关系"></el-table-column>
          <el-table-column prop="unitType" :formatter="unitTypeFormatter" label="机构类型"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                @click="handleLook(scope.row)"
                class="look-btn"
                type="primary"
                size="mini"
                >查看</el-button>
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
        <el-dialog :title="formDialogTitle" :before-close="closeDialog" :visible.sync="showDialog" class="add-user">
          <el-form
            :model="organData"
            :rules="isLook ? {} : rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm">
            <el-form-item label="机构名称" prop="unitName">
              <el-input v-model="organData.unitName" class="input-wd" :disabled="isLook"></el-input>
            </el-form-item>
            <el-form-item label="机构类型" prop="unitType">
              <el-select v-model="organData.unitType" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" @change="selorganType">
                <el-option
                  v-for="item in organTypeData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="机构级别" prop="unitLevel">
              <el-select v-model="organData.unitLevel" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" @change="selorganLevel">
                <el-option
                  v-for="item in organLevelData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="!isLook" label="行政区划" prop="adCode" class="is-required">
              <div class="pre-select">
                <el-select v-model="levelData.province" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" clearable @change="provinceChange" class="select-input">
                  <el-option
                    v-for="item in provinceList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    ></el-option>
                </el-select>
                <el-select v-model="levelData.city" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" clearable @change="cityChange" class="select-input">
                  <el-option
                    v-for="item in cityList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    ></el-option>
                </el-select>
                <el-select v-model="levelData.district" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" clearable @change="districtChange" class="select-input">
                  <el-option
                    v-for="item in districtList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    ></el-option>
                </el-select>
                <el-select v-model="levelData.station" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" clearable @change="stationChange" class="select-input">
                  <el-option
                    v-for="item in stationList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    ></el-option>
                </el-select>
              </div>
              <!-- <area-select v-model="organData.adCode"></area-select> -->
            </el-form-item>
            <el-form-item v-show="!isUpdate" label="上级机构" prop="preUnitId">
              <el-cascader
                :placeholder="isLook ? '' : '请选择'"
                :disabled="isLook"
                expand-trigger="hover"
                :options="upOrganData"
                v-model="organData.preUnitId"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item v-show="!isUpdate" label="与上级机构关系" prop="preUnitRelation">
              <el-select v-model="organData.preUnitRelation" :placeholder="isLook ? '' : '请选择'" :disabled="isLook" @change="selorganship">
                <el-option
                  v-for="item in organshipData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  ></el-option>
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
      </el-main>
    </el-container>
    <el-dialog  title="机构排序" :before-close="closeTreeDialog" :visible.sync="showTreeDialog">
      <el-tree @node-drop="nodeDrop" draggable :allow-drop="allowDrop" :data="treeData" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
    </el-dialog>
  </el-container>
</template>

<script>
import { getMechanismList, getCityData, getMechanism, addMechanism, deleteMechanism, updateMechanism } from '@/api/mechanism'
import { deepClone } from '@/utils'
import dataList from './dataList'
export default {
  data() {
    let validMobile = (rule,value,callback) => {
      console.log(value)
      if (value) {
        callback()
      } else {
        callback(new Error('请选择行政划区'))
      }
    }
    return {
      form: {
        name: ''
      },
      treeData: dataList.treeData,
      showTreeDialog: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      showDialog: false,
      isUpdate: false,
      formLabelWidth: '120px',
      isLook: false,
      isAdd: false,
      isRefresh: false,
      // 上级机构
      upOrganData: dataList.treeData,
      // 与上级机构关系
      organshipData: dataList.organshipData,
      // 机构类型
      organTypeData: dataList.organTypeData,
      // 机构级别
      organLevelData: dataList.organLevelData,
      organData: {
        unitName: '',
        unitType: '',
        unitLevel: '',
        adCode: '',
        preUnitId: '',
        preUnitRelation: ''
      },
      levelData: {
        province: '',
        city: '',
        district: '',
        station: ''
      },
      provinceList: [],
      cityList: [],
      districtList: [],
      stationList: [],
      oldOrganData: {},
      rules: {
        unitName: { required: true, message: '请输入机构名称', trigger: 'blur' },
        unitType: { required: true, message: '请选择机构类型' },
        unitLevel: { required: true, message: '请选择机构级别' },
        adCode: { validator: validMobile }
      },
      total: 0,
      currentPage: 1,
      limit: 10,
      selectOptions: [],
      formDialogTitle: ''
    }
  },
  created() {
    this.getMechanismListData()
    getCityData({ classificationCode: '000200020001', sjCode: '' }).then(res => {
      this.provinceList = res.data
      this.cityList = []
      this.districtList = []
      this.stationList = []
    })
  },
  watch: {
    isRefresh(val) {
      if (val) {
        this.getMechanismListData()
      }
    }
  },
  methods: {
    provinceChange(val) {
      this.organData.adCode = val
      if (val) {
        getCityData({ classificationCode: '000200020001', sjCode: val }).then(res => {
          this.cityList = res.data
        })
      } else {
        this.cityList = []
      }
      this.levelData.city = this.levelData.district = this.levelData.station = ''
      this.districtList = []
      this.stationList = []
    },
    cityChange(val) {
      if (val) {
        this.organData.adCode = val
        getCityData({ classificationCode: '000200020001', sjCode: val }).then(res => {
          this.districtList = res.data
        })
      } else {
        this.districtList = []
        this.organData.adCode = this.levelData.province
      }
      this.levelData.district = this.levelData.station = ''
      this.stationList = []
    },
    districtChange(val) {
      if (val) {
        this.organData.adCode = val
        getCityData({ classificationCode: '000200020001', sjCode: val }).then(res => {
          this.stationList = res.data
        })
      } else {
        this.stationList = []
        this.organData.adCode = this.levelData.city
      }
      this.levelData.station = ''
    },
    stationChange(val) {
      if (val) {
        this.organData.adCode = val
      } else {
        this.organData.adCode = this.levelData.district
      }
    },
    getMechanismListData() {
      let req = {}
      req.page = this.currentPage
      req.unit_name = ''
      req.ad_code = ''
      req.limit = this.limit
      getMechanismList(req).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
        this.isRefresh = false
      })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleChange(val) {
      this.organData.preUnitId = val[val.length - 1]
    },
    // 添加
    addTableData() {
      this.organData = {
        unitName: '',
        unitType: '',
        unitLevel: '',
        adCode: '',
        preUnitId: '',
        preUnitRelation: ''
      }
      this.levelData = {
        province: '',
        city: '',
        district: '',
        station: ''
      }
      this.isAdd = true
      this.formDialogTitle = '添加机构'
      this.showDialog = true
    },
    addBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let req = {
            unitName: this.organData.unitName.toString(),
            unitType: this.organData.unitType.toString(),
            unitLevel: this.organData.unitLevel.toString(),
            adCode: this.organData.adCode.toString(),
            preUnitId: this.organData.preUnitId.toString(),
            preUnitRelation: this.organData.preUnitRelation.toString()
          }
          addMechanism(this.organData).then(res => {
            this.isRefresh = !this.isRefresh
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.showDialog = this.isAdd = false
            this.levelData = {
              province: '',
              city: '',
              district: '',
              station: ''
            }
          })
        }
      })
    },
    // 修改
    reviseBtn() {
      if (this.selectOptions.length === 1) {
        this.levelData = {
          province: '',
          city: '',
          district: '',
          station: ''
        }
        this.formDialogTitle = '修改机构'
        getMechanism({ unitId: this.selectOptions[0].unitId }).then(res => {
          this.organData = res.data
          this.levelData.province = this.organData.adCode.substring(0, 2)
          let code = this.organData.adCode
          switch (code.length) {
            case 2:
              getCityData({ classificationCode: '000200020001', sjCode: code }).then(res => {
                this.cityList = res.data
              })
              break
            case 4: 
              getCityData({ classificationCode: '000200020001', sjCode: code.substring(0, 2) }).then(res => {
                this.cityList = res.data
              })
              this.levelData.city = this.organData.adCode
              break
            case 6: 
              getCityData({ classificationCode: '000200020001', sjCode: code.substring(0, 2) }).then(res => {
                this.cityList = res.data
              })
              this.levelData.city = this.organData.adCode.substring(0, 4)
              getCityData({ classificationCode: '000200020001', sjCode: code.substring(0, 4) }).then(res => {
                this.districtList = res.data
              })
              this.levelData.district = this.organData.adCode
              break
            case 8: 
              getCityData({ classificationCode: '000200020001', sjCode: code.substring(0, 2) }).then(res => {
                this.cityList = res.data
              })
              this.levelData.city = this.organData.adCode.substring(0, 4)
              getCityData({ classificationCode: '000200020001', sjCode: code.substring(0, 4) }).then(res => {
                this.districtList = res.data
              })
              this.levelData.district = this.organData.adCode.substring(0, 6)
              getCityData({ classificationCode: '000200020001', sjCode: code.substring(0, 6) }).then(res => {
                this.stationList = res.data
              })
              this.levelData.station = this.organData.adCode
              break
            default:
              this.levelData = {
                province: '',
                city: '',
                district: '',
                station: ''
              }
          }
          this.showDialog = this.isUpdate = true
        })
      } else {
        this.$message({
          message: '请选择一个机构！',
          type: 'warning',
          center: true
        })
      }
    },
    updateBtn() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let req = {
            unitId: this.organData.unitId.toString(),
            unitName: this.organData.unitName.toString(),
            unitType: this.organData.unitType.toString(),
            unitLevel: this.organData.unitLevel.toString(),
            adCode: this.organData.adCode.toString()
          }
          updateMechanism(req).then(res => {
            this.isRefresh = !this.isRefresh
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.showDialog = this.isUpdate = false
          })
        }
      })
    },
    // 删除
    deleteBtn() {
      if (this.selectOptions.length === 1) {
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMechanism({ unitId: this.selectOptions[0].unitId }).then(res => {
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
          message: '请选择一个机构！',
          type: 'warning',
          center: true
        })
      }
    },
    // 与上级机构关系
    selorganship(val) {
      this.organData.preUnitRelation = val
    },
    // 机构类型
    selorganType(val) {
      this.organData.unitType = val
    },
    // 机构级别
    selorganLevel(val) {
      this.organData.unitLevel = val
    },
    // 查看
    handleLook(row) {
      this.showDialog = this.isLook = true
      getMechanism({ unitId: row.unitId }).then(res => {
        this.organData = res.data
      })
    },
    handleSizeChange(val) {
      this.limit = val
      this.getMechanismListData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMechanismListData()
    },
    changeFun(selectVal) {
      this.selectOptions = selectVal
    },
    closeDialog() {
      this.showDialog = this.isLook = this.isUpdate = this.isAdd = false
      this.$refs['ruleForm'].resetFields()
    },
    closeTreeDialog() {
      this.showTreeDialog = false
    },
    treeSort() {
      this.showTreeDialog = true
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level && type !=='inner') {
        return true
      } else {
        return false
      }
    },
    nodeDrop(dropNode, a, b ,c) {
      console.log(dropNode, a, b ,c)
    },
    deep(val, row) {
      if (val instanceof Array) {
        val.forEach((e, i) => {
          if (e.value === row) {
            // console.log(e)
            return e.label
          } else {
            this.deep(e.children, row)
          }
        })
      }
    },
    preUnitFormatter(row) {
      this.deep(this.upOrganData, row.preUnitId)
    },
    preUnitRelationFormatter(row) {
      switch (row.preUnitRelation) {
        case '01':
          return '内设部门'
          break
        case '02':
          return '下设单位'
          break
        case '03':
          return '下级单位'
          break
        case '04':
          return '无上级单位'
          break 
      }
    },
    unitTypeFormatter(row) {
      switch (row.unitType) {
        case '0101':
          return '司法行政机关'
          break
        case '0102':
          return '监狱单位'
          break
        case '0103':
          return '戒毒单位'
          break
        case '0201':
          return '律师协会'
          break
        case '0202':
          return '公证协会'
          break
        case '0203':
          return '司法鉴定协会'
          break
        case '0301':
          return '律师事务所'
          break
        case '0302':
          return '公证处'
          break
        case '0303':
          return '司法鉴定机构'
          break
        case '0304':
          return '基层法律服务所'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    margin-top: 40px;
  }
  .look-btn{
    padding: 0 5px;
    height: 22px;
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
        background-color: #1e9fff;
        color: white;
        margin-left: 5px;
        border-radius: 2px;
        .icon-search {
          margin-right: 2px;
        }
      }
    }
  }
  .el-main {
    padding: 0 20px;
  }
  .table-top {
    padding: 10px 15px;
    background-color: #f2f2f2;
    border: 1px solid #e6e6e6;
    border-bottom: 0;
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
  .add-user {
    .input-wd {
      width: 60% !important;
    }
    .el-select {
      width: 60%;
      .el-input__inner {
        width: 100% !important;
      }
    }
  }
  .-container[data-v-72233bcd] {
      padding: 12px 10px;
  }
  .el-aside {
    .el-tree {
      width: fit-content;
      min-width: 200px;
    }
  }
</style>
