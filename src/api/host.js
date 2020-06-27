import request from '../utils/request'

// 获取主机列表
export function getHostInfo() {
  return request({
    url: 'host',
    method: 'get',
  })
}

// 添加主机
export function addHost(data) {
  return request({
    url: 'host',
    method: 'post',
    data
  })
}

// 删除主机
export function deleteHost(data) {
  return request({
    url: 'host',
    method: 'delete',
    params: data
  })
}

// 测试ssh连接主机
export function testHostConn(data) {
  return request({
    url: 'host/ssh',
    method: 'post',
    data
  })
}

// 测试 svr 连接主机
export function testSvrConn(data) {
  return request({
    url: 'host/svr',
    method: 'post',
    data
  })
}

// 关注主机
export function addHostWatch(data) {
  return request({
    url: 'host/watch',
    method: 'post',
    data
  })
}

// 取消关注主机
export function deleteHostWatch(data) {
  return request({
    url: 'host/watch',
    method: 'delete',
    params: data
  })
}

// 增加负责人邮件
export function addHostBlameEmail(data) {
  return request({
    url: 'host/blame',
    method: 'post',
    data
  })
}

// 删除负责人邮件
export function deleteHostBlameEmail(data) {
  return request({
    url: 'host/blame',
    method: 'delete',
    params: data
  })
}
