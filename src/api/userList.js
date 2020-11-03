import request from '@/utils/request'

export function getUserList(data) {
  return request({
    url: '/admin/user/queryUserUnit',
    method: 'get',
    params: data
  })
}

export function getUserInfo(data) {
  return request({
    url: '/admin/user/queryUserUnitInfo',
    method: 'get',
    params: data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/user/updateUserInfo',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/admin/user/saveUser',
    method: 'get',
    params: data
  })
}

export function delUser(data) {
  return request({
    url: '/admin/user/deleteUserUnit',
    method: 'get',
    params: data
  })
}