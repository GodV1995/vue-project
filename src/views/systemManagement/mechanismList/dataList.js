const treeData = [{
  label: '贵州省司法厅',
  value: '1',
  children: [
    {
      label: '下级单位',
      value: '11',
      children: [
        {
          label: '遵义市司法局',
          value: '111',
          children: [
            {
              label: '下级单位',
              value: '1111',
              children: [
                {
                  label: '播州区司法局',
                  value: '11111',
                  children: [
                    {
                      label: '下级单位',
                      value: '111111',
                      children: [
                        {
                          label: '播州区司法局南白街道司法所',
                          value: '1111111'
                        }, {
                          label: '播州区司法局龙坑司法所',
                          value: '1111112'
                        }
                      ]
                    }
                  ]
                }
              ]
            }, {
              label: '内设部门',
              value: '1112',
              children: [
                {
                  label: '遵义市社区矫正局',
                  value: '11121'
                }
              ]
            }
          ]
        }
      ]
    }, {
      label: '下设单位',
      value: '12',
      children: [
        {
          label: '贵州省监狱管理科',
          value: '121'
        }
      ]
    }
  ]
}]

const organTypeData = [{
  value: '0101',
  label: '司法行政机关'
}, {
  value: '0102',
  label: '监狱单位'
}, {
  value: '0103',
  label: '戒毒单位'
}, {
  value: '0201',
  label: '律师协会'
}, {
  value: '0202',
  label: '公证协会'
}, {
  value: '0203',
  label: '司法鉴定协会'
}, {
  value: '0301',
  label: '律师事务所'
}, {
  value: '0302',
  label: '公证处'
}, {
  value: '0303',
  label: '司法鉴定机构'
}, {
  value: '0304',
  label: '基层法律服务所'
}]

const organLevelData = [{
  value: '01',
  label: '部级'
}, {
  value: '02',
  label: '省级'
}, {
  value: '03',
  label: '市级'
}, {
  value: '04',
  label: '县级'
}, {
  value: '05',
  label: '所级'
}]

const organshipData = [{
  value: '01',
  label: '内设部门'
}, {
  value: '02',
  label: '下设单位'
}, {
  value: '03',
  label: '下级单位'
}, {
  value: '04',
  label: '无上级单位'
}]

const dataList = {
  treeData: treeData,
  organTypeData: organTypeData,
  organLevelData: organLevelData,
  organshipData: organshipData
}
export default dataList
