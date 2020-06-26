import request from '../utils/request'

// 获取语雀OAuth地址
export function getYuQueOAuth(query) {
  return request({
    url: 'oauth/yuque',
    method: 'get',
    query: query
  })
}

// 登录
export function userLogin(data) {
  return request({
    url: 'login',
    method: 'post',
    data
  })
}

// 退出登录
export function userLogout() {
  return request({
    url: 'logout',
    method: 'delete'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: 'user',
    method: 'get',
  })
}

// 完善用户信息
export function updateUserInfo(data) {
  return request({
    url: 'user',
    method: 'post',
    data
  })
}
