import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function goLogin(data) {
  return request({
    url: '/shiro/login',
    method: 'get',
    params: data
  })
}

export function getMenu() {
  return request({
    url: '/shiro/index',
    method: 'post'
  })
}

export function goLogout() {
  return request({
    url: '/shiro/logout',
    method: 'get'
  })
}
