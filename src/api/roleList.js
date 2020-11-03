import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/admin/role/getRoleList',
    method: 'get',
    params: data
  })
}

export function addRoleList(data) {
  return request({
    url: '/admin/role/addOrUpdateRole',
    method: 'get',
    params: data
  })
}

export function getRole(data) {
  return request({
    url: '/admin/role/queryRoleById',
    method: 'get',
    params: data
  })
}

export function updateRole(data) {
  return request({
    url: '/admin/resourceRela/upateRelations',
    method: 'get',
    params: data
  })
}

export function updateUser(data) {
  return request({
    url: '/admin/userRoleRelation/updateRelation',
    method: 'get',
    params: data
  })
}

export function getRoleForUser(data) {
  return request({
    url: '/admin/userRoleRelation/queryAssignRole',
    method: 'get',
    params: data
  })
}