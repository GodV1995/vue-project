import request from '@/utils/request'

export function getCityData(data) {
  return request({
    url: '/admin/DictionaryDetailed/getXjByCondition',
    method: 'get',
    params: data
  })
}

export function getMechanismList(data) {
  return request({
    url: '/admin/UnitInfo/selectAllByCondition',
    method: 'get',
    params: data
  })
}

export function getMechanism(data) {
  return request({
    url: '/admin/UnitInfo/view',
    method: 'get',
    params: data
  })
}

export function addMechanism(data) {
  return request({
    url: '/admin/UnitInfo/add',
    method: 'get',
    params: data
  })
}

export function deleteMechanism(data) {
  return request({
    url: '/admin/UnitInfo/delete',
    method: 'get',
    params: data
  })
}

export function updateMechanism(data) {
  return request({
    url: '/admin/UnitInfo/update',
    method: 'get',
    params: data
  })
}
