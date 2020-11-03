import request from '@/utils/request'

export function getSystemList(data) {
  return request({
    url: '/admin/sysInfo/selectAllByCondition',
    method: 'get',
    params: data
  })
}

export function addSystem(data) {
  return request({
    url: '/admin/sysInfo/add',
    method: 'get',
    params: data
  })
}

export function deleteSystem(data) {
  return request({
    url: '/admin/sysInfo/delete',
    method: 'get',
    params: data
  })
}

export function updateSystem(data) {
  return request({
    url: '/admin/sysInfo/update',
    method: 'get',
    params: data
  })
}

export function getSystem(data) {
  return request({
    url: '/admin/sysInfo/view',
    method: 'get',
    params: data
  })
}