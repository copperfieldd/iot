import { stringify } from 'qs';
import request from '../utils/request';

/****
 *
 * Api Service
 *
 * *****/
//API列表
export async function apiList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  delete params.filter;
  return request(`/permissionservice/api/interface/list?${stringify(params)}&filter=${filter}`);
};

//API详情
export async function apiItem(params) {
  return request(`/permissionservice/api/interface/item?${stringify(params)}`);
};

//添加API
export async function addApi(params) {
  return request('/permissionservice/api/interface/add',{
    method:'POST',
    body:params,
  })
};

//添加的时候的菜单列表和API接口
export async function getAPIandMenu(params) {
  return request('/permissionservice/api/assign')
}

export async function getMenuApi(params) {
  return request('/permissionservice/api/interface/listByOrg')
}

//修改API
export async function updApi(params) {
  return request('/permissionservice/api/interface/upd',{
    method:'POST',
    body:params,
  })
};

//删除API
export async function delApi(params) {
  return request(`/permissionservice/api/interface/del?${stringify(params)}`)
};

//查询角色API
export async function roleApiItem(params) {
  return request(`/permission/api/interface/listByRole?${stringify(params)}`)
};

//查询组织结构API
export async function organizationApiItem(params) {
  return request(`/permission/api/interface/listByOrg?${stringify(params)}`)
};

//查询租户Api
export async function customerApiItem(params) {
  return request(`/permission/api/interface/listByTenant?${stringify(params)}`)
};

/****
 *
 * Menu Service
 *
 * *****/

//菜单详情
export async function menuItem(params) {
  return request(`/permissionservice/api/menu/item?${stringify(params)}`)
};

//添加菜单
export async function addMenu(params) {
  return request('/permissionservice/api/menu/add',{
    method:'POST',
    body:params,
  })
};

//修改菜单
export async function updMenu(params) {
  return request('/permissionservice/api/menu/upd',{
    method:'POST',
    body:params,
  })
};

//批量添加菜单
// export async function addMenus(params) {
//   return request('/permission/api/menu/batch',{
//     method:'POST',
//     body:params,
//   })
// }

//菜单列表
export async function menuList(params) {
  return request(`/permission/api/menu/list?${stringify(params)}`)
};

//删除菜单
export async function delMenuList(params) {
  return request(`/permissionservice/api/menu/del?${stringify(params)}`)
};

//租户的菜单列表
// export async function customerMenuList(params) {
//   return request(`/permission/api/menu/listByTenant?${stringify(params)}`)
// };


//租户的菜单列表
// export async function roleMenuList(params) {
//   return request(`/permission/api/menu/listByRole?${stringify(params)}`)
// };

//用户的菜单列表
export async function userMenuList(params) {
  return request(`/permissionservice/api/menu/tree?${stringify(params)}`)
};


/****
 *
 * Role Service
 *
 * *****/

//角色详情
export async function roleItem(params) {
  return request(`/permissionservice/api/role/item?${stringify(params)}`)
};
//角色列表
export async function roleList(params) {
  return request(`/permissionservice/api/role/list?${stringify(params)}`)
};

export async function delRole(params) {
  return request(`/permissionservice/api/role/del?${stringify(params)}`)
};

//新增角色
export async function addRole(params) {
  return request('/permissionservice/api/role/add',{
    method:'POST',
    body:params,
  })
}
export async function updRole(params) {
  return request('/permissionservice/api/role/upd',{
    method:'POST',
    body:params,
  })
}

export async function getServiceList(params) {
  return request(`/permissionservice/api/service/opt`)
}

export async function getAppList(params) {
  return request(`/userservice/api/app/opt`)
}

export async function getPlatMenu(params) {
  return request(`/permissionservice/api/menu/tree`)
}

export async function getAppMenu(params) {
  return request(`/permissionservice/api/menu/treeByAppId?${stringify(params)}`)
}


export async function getRoleList(params) {
  return request(`/permissionservice/api/role/list?${stringify(params)}`)
}

export async function getAppRoleList(params) {
  return request(`/permissionservice/api/role/listByAppId?${stringify(params)}`)
}

export async function getTenantMenu(params) {
  return request(`/permissionservice/api/menu/listByTenant?${stringify(params)}`)
}

//查询租户的接口
export async function getTenantApi(params) {
  return request(`/permissionservice/api/interface/listByTenant?${stringify(params)}`)
}
