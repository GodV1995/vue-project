import request from '@/utils/request'

export function getDictionariesList(data) {
  return request({
    url: '/admin/DictionaryClassification/selectAllByCondition',
    method: 'get',
    params: data
  })
}

export function addDictionaries(data) {
  return request({
    url: '/admin/DictionaryClassification/add',
    method: 'get',
    params: data
  })
}


export function getDictionaries(data) {
  return request({
    url: '/admin/DictionaryClassification/view',
    method: 'get',
    params: data
  })
}

export function deleteDictionaries(data) {
  return request({
    url: '/admin/DictionaryClassification/delete',
    method: 'get',
    params: data
  })
}

export function updateDictionaries(data) {
  return request({
    url: '/admin/DictionaryClassification/update',
    method: 'get',
    params: data
  })
}
