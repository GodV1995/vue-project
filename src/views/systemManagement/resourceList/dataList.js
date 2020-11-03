const tableList = [{
  id: 1,
  name: '32',
  url: '',
  type: '菜单',
  code: ''
}, {
  id: 2,
  name: '资源门户',
  url: 'index',
  type: '菜单',
  code: ''
}, {
  id: 3,
  name: '数据汇聚',
  url: '',
  type: '菜单',
  code: '',
  children: [{
    id: 31,
    name: '数据采集',
    url: '',
    type: '菜单',
    code: '',
    children: [{
      id: 311,
      name: '任务分组',
      url: '/collect/system/taskGroupPage',
      type: '菜单',
      code: ''
    }, {
      id: 312,
      name: '任务配置',
      url: '/collect/sysTaskConfig/taskConfigurationPage',
      type: '菜单',
      code: ''
    }, {
      id: 313,
      name: '上传采集',
      url: '/upload/uploadCollectPage',
      type: '菜单',
      code: ''
    }]
  }, {
    id: 32,
    name: '数据处理',
    url: '',
    type: '菜单',
    code: '',
    children: [{
      id: 321,
      name: '处理配置',
      url: '/clean/cleanTaskConfig/cleanConfigPage',
      type: '菜单',
      code: ''
    }, {
      id: 322,
      name: '日志与警告',
      url: '/cleanLog/cleanLogPage',
      type: '菜单',
      code: ''
    }, {
      id: 323,
      name: '数据清洗',
      url: '/cleanLog/dataCleanPage',
      type: '菜单',
      code: ''
    }]
  }]
}, {
  id: 4,
  name: '资源目录',
  url: '',
  type: '菜单',
  code: '',
  children: [{
    id: 41,
    name: '元数据管理',
    url: '',
    type: '菜单',
    code: '',
    children: [{
      id: 411,
      name: '元数据查询',
      url: '/metadata/dataSearch',
      type: '菜单',
      code: ''
    }]
  }, {
    id: 42,
    name: '资源目录管理',
    url: '',
    type: '菜单',
    code: '',
    children: [{
      id: 421,
      name: '目录管理',
      url: '/resourceDirectory/dierctoryManager',
      type: '菜单',
      code: '',
      children: [{
        id: 4211,
        name: '启用/禁用',
        url: '',
        type: '按钮',
        code: 'BtnModifyStatus'
      }, {
        id: 4212,
        name: '删除',
        url: '',
        type: '按钮',
        code: 'BtnDel'
      }, {
        id: 4213,
        name: '修改',
        url: '',
        type: '按钮',
        code: 'BtnUpdate'
      }, {
        id: 4214,
        name: '新增',
        url: '',
        type: '按钮',
        code: 'BtnAdd'
      }]
    }, {
      id: 422,
      name: '目录审核',
      url: '/directoryCheckOpinion/listCheckPage',
      type: '菜单',
      code: '',
      children: [{
        id: 4221,
        name: '审核',
        url: '',
        type: '按钮',
        code: 'BtnAudit'
      }]
    }, {
      id: 423,
      name: '资源管理',
      url: '/directoryResource/resourceManager',
      type: '菜单',
      code: '',
      children: [{
        id: 4231,
        name: '元数据映射',
        url: '',
        type: '按钮',
        code: 'BtnMapping'
      }]
    }]
  }]
}]
const cascaderList = [{
  value: '无',
  label: '无'
}, {
  value: '32',
  label: '32'
}, {
  value: '资源门户',
  label: '资源门户'
}, {
  value: '数据汇聚',
  label: '数据汇聚',
  children: [{
    value: '数据采集',
    label: '数据采集',
    children: [{
      value: '任务分组',
      label: '任务分组'
    }, {
      value: '任务配置',
      label: '任务配置'
    }, {
      value: '上传采集',
      label: '上传采集'
    }, {
      value: '采集查询',
      label: '采集查询'
    }, {
      value: '采集监管',
      label: '采集监管'
    }]
  }, {
    value: '数据处理',
    label: '数据处理',
    children: [{
      value: '处理配置',
      label: '处理配置'
    }, {
      value: '日志与警告',
      label: '日志与警告'
    }, {
      value: '数据清洗',
      label: '数据清洗'
    }]
  }]
}, {
  value: '资源目录',
  label: '资源目录',
  children: [{
    value: '元数据管理',
    label: '元数据管理',
    children: [{
      value: '元数据查询',
      label: '元数据查询'
    }]
  }, {
    value: '资源目录管理',
    label: '资源目录管理',
    children: [{
      value: '目录管理',
      label: '目录管理'
    }, {
      value: '目录审核',
      label: '目录审核'
    }, {
      value: '资源管理',
      label: '资源管理'
    }]
  }]
}]
const treeList = [{
  id: 1,
  label: '一级 1',
  children: [{
    id: 11,
    label: '二级 1-1',
    children: [{
      id: 111,
      label: '三级 1-1-1'
    }, {
      id: 112,
      label: '三级 1-1-2'
    }]
  }]
}, {
  id: 2,
  label: '一级 2',
  children: [{
    id: 21,
    label: '二级 2-1'
  }, {
    id: 22,
    label: '二级 2-2'
  }]
}, {
  id: 3,
  label: '一级 3',
  children: [{
    id: 31,
    label: '二级 3-1'
  }, {
    id: 32,
    label: '二级 3-2'
  }]
}, {
  id: 4,
  label: '一级 4',
  children: [{
    id: 41,
    label: '二级 4-1'
  }, {
    id: 42,
    label: '二级 4-2'
  }]
}, {
  id: 5,
  label: '一级 5',
  children: [{
    id: 51,
    label: '二级 5-1'
  }, {
    id: 52,
    label: '二级 5-2'
  }]
}, {
  id: 6,
  label: '一级 6',
  children: [{
    id: 61,
    label: '二级 6-1'
  }, {
    id: 62,
    label: '二级 6-2'
  }]
}]
const dataList = {
  tableList: tableList,
  cascaderList: cascaderList,
  treeList: treeList
}
export default dataList
