import request from '@/utils/request'

export function getDictionariesDetailList(data) {
  return request({
    url: '/admin/DictionaryDetailed/selectAllByCondition',
    method: 'get',
    params: data
  })
}

export function getTreeList(data) {
  return request({
    url: '/admin/DictionaryClassification/selectTreeAllByCondition',
    method: 'get',
    params: data
  })
}

export function addDictionariesDetail(data) {
  return request({
    url: '/admin/DictionaryDetailed/add',
    method: 'get',
    params: data
  })
}

export function getDictionariesDetail(data) {
  return request({
    url: '/admin/DictionaryDetailed/view',
    method: 'get',
    params: data
  })
}

export function updateDictionariesDetail(data) {
  return request({
    url: '/admin/DictionaryDetailed/update',
    method: 'get',
    params: data
  })
}

export function deleteDictionariesDetail(data) {
  return request({
    url: '/admin/DictionaryDetailed/delete',
    method: 'get',
    params: data
  })
}
