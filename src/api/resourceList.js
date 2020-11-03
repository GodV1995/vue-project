import request from '@/utils/request'

export function getResourceList(data) {
  return request({
    url: '/admin/resource/selectTree',
    method: 'get',
    params: data
  })
}

export function addResourceList(data) {
  return request({
    url: '/admin/resource/addOrUpdateResource',
    method: 'get',
    params: data
  })
}

export function deleteResourceList(data) {
  return request({
    url: '/admin/resource/delSRes',
    method: 'get',
    params: data
  })
}

export function getResource(data) {
  return request({
    url: '/admin/resource/view',
    method: 'get',
    params: data
  })
}