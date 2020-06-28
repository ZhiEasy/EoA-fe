import request from '../utils/request'

// 创建主机监控任务
export function addHostInfoTask(data) {
  return request({
    url: 'task/host',
    method: 'post',
    data
  })
}

// 删除主机监控
export function deleteHostInfoTask(data) {
  return request({
    url: 'task/host',
    method: 'delete',
    params: data
  })
}
