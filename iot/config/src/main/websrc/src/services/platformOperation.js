import { stringify } from 'qs';
import request from '../utils/request';
//获取配置文件列表
export async function platformConfigList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  return request(`/config/api-eoms/config/file/list?start=${params.start}&count=${params.count}&filter=${filter}`);
};
export async function platformConfigItem(params) {
  return request(`/config/api-eoms/config/file/item?${stringify(params)}`);
}

//新增配置文件
export async function addPlatformConfig(params) {
  return request('/config/api-eoms/config/file/add',{
    method:'POST',
    body:params,
  })
};

export async function updPlatformConfig(params) {
  return request('/config/api-eoms/config/file/upd',{
    method:'POST',
    body:params,
  })
}

//删除配置文件列表
export async function delConfigFile(params) {
  return request(`/config/api-eoms/config/file/del?${stringify(params)}`)
};

//获取实例服务列表
export async function getDemoConfigList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):''
  return request(`/config/api-eoms/service/instances/list?start=${params.start}&count=${params.count}&filter=${filter}`)
};
//添加服务实例
export async function addDemoConfig(params) {
  return request('/config/api-eoms/service/instances/add',{
    method:'POST',
    body:params,
  })
};
//修改服务实例
export async function editDemoConfig(params) {
  return request('/config/api-eoms/service/instances/upd',{
    method:'POST',
    body:params
  })
};
//删除实例服务列表
export async function delConfigDemo(params) {
  return request(`/config/api-eoms/service/instances/del?${stringify(params)}`)
};

//暂停/启用服务实例
export async function changeConfigDemoStatus(params) {
  return request('/config/api-eoms/service/instances/updStatus',{
    method:'POST',
    body:params,
  })
}

export async function queryParams(params) {
  return request(`/config/api/instance/${params.node}?serviceId=${params.serviceId}`)
}

export async function getServiceDemo(params) {
  return request(`/config/api-eoms/service/instances/opt?${stringify(params)}`)
}


export async function getLifeList(params) {
  return request(`/config/api/state/list?${stringify(params)}`)
}

export async function getDiskList(params) {
  return request(`/config/api/disk/list?${stringify(params)}`)
}


export async function getMemoryList(params) {
  return request(`/config/api/memory/list?${stringify(params)}`)
}

export async function updLifeState(params) {
  return request('/config/api/state/upd',{
    method:'POST',
    body:params,
  })
}

export async function getLifeState(params) {
  return request(`/config/api/state/item?${params}`)
}

export async function updMemoryState(params) {
  return request('/config/api/memory/upd',{
    method:'POST',
    body:params,
  })
}

export async function getMemoryState(params) {
  return request(`/config/api/memory/item?${params}`)
}


export async function updDiskState(params) {
  return request('/config/api/disk/upd',{
    method:'POST',
    body:params,
  })
}

export async function getDiskState(params) {
  return request(`/config/api/disk/item?${params}`)
}


// export async function getLifeList(params) {
//   return request(`/config/api/state/list?${stringify(params)}`)
// }
