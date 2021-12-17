import request from '@/utils/request'

export function getProviderList(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/provider',
    method: 'get',
    params
  })
}

export function getConsumerList(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/consumer',
    method: 'get',
    params
  })
}


export function getProcessList(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/process',
    method: 'get',
    params
  })
}

export function getProcessHost(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/process/host',
    method: 'get',
    params
  })
}

export function getProviderHost(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/provider/host',
    method: 'get',
    params
  })
}

export function getConsumerHost(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/consumer/host',
    method: 'get',
    params
  })
}

// 此处应该用POST，由于在测试阶段，暂不解决跨域问题
export function editConsumerRemark(params) {
  return request({
    url: 'http://localhost:8080/update/consumer/remark',
    method: 'get',
    params
  })
}

export function getProviderDetail(params) {
  return request({
    // url: '/vue-admin-template/table/list',
    url: 'http://localhost:8080/find/provider/detail',
    method: 'get',
    params
  })
}

// 此处应该用POST，由于在测试阶段，暂不解决跨域问题
export function editProviderRemark(params) {
  return request({
    url: 'http://localhost:8080/update/provider/remark',
    method: 'get',
    params
  })
}