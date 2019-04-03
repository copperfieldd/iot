import { stringify } from 'qs';
import request from '../utils/request';


export async function userMenuList(params){
  return request(`/api/menu/tree`)
}

/****
 *
 * Grade Service
 *
 * *****/
export async function gradeList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  //delete params.filter;
  return request(`/userservice/api/grade/list?start=${params.start}&count=${params.count}&filter=${filter}`)
};


export async function addGradeList(params) {
  return request('/userservice/api/grade/add',{
    method:'POST',
    body:params,
  })
}

export async function updGradeList(params) {
  return request('/userservice/api/grade/upd',{
    method:'POST',
    body:params,
  })
}

export async function delGrade(params) {
  return request(`/userservice/api/grade/del?${stringify(params)}`)
};

export async function gradeItem(params) {
  return request(`/userservice/api/grade/item?${stringify(params)}`)
}

/****
 *
 * Tenant Service
 *
 * *****/
//租户管理列表
export async function tenantList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  //delete params.filter;
  return request(`/userservice/api/tenant/list?start=${params.start}&count=${params.count}&filter=${filter}`)
};
//租户角色列表
export async function tenantRoleList(params) {
  return request(`/permissionservice/api/role/list?${stringify(params)}`)
}

//新增租户
export async function addTenant(params) {
  return request('/userservice/api/tenant/add',{
    method:'POST',
    body:params,
  })
};

//修改租户
export async function editTenant(params) {
  return request('/userservice/api/tenant/upd',{
    method:'POST',
    body:params,
  })
}
//租户详情
export async function tenantItem(params) {
  return request(`/userservice/api/tenant/items?${stringify(params)}`)
}

//删除租户
export async function delTenantList(params) {
  return request(`/userservice/api/tenant/del?${stringify(params)}`)
}

/****
 *
 * Organization Service
 *
 * *****/
export async function getOrganizationTree(params) {
  return request(`/userservice/api/unit/children?${stringify(params)}`)
}

//添加部门
export async function addOrganizationTree(params) {
  return request('/userservice/api/unit/add',{
    method:'POST',
    body:params
  })
}
//添加组织树用户
export async function addAppOrganzationUserTreeNode(params) {
  return request('/userservice/api/user/add',{
    method:'POST',
    body:params,
  })
}
//修改部门
export async function updDepart(params) {
  return request('/userservice/api/unit/upd',{
    method:'POST',
    body:params
  })
}
//修改树用户
export async function updAppOrganzationUserTreeNode(params) {
  return request('/userservice/api/user/upd',{
    method:'POST',
    body:params,
  })
}
// //修改用户
//
// export async function updOrgUserTreeNode(params) {
//   return request('/userservice/api/user/upd',{
//     method:'POST',
//     body:params,
//   })
// }

//删除用户
export async function delOrganzationUserTreeNode(params) {
  return request(`/userservice/api/user/del?${stringify(params)}`)
}
//删除部门
export async function deleteOrganizationTree(params) {
  return request(`/userservice/api/unit/del?${stringify(params)}`)
}

//用户详情
export async function getUserItem(params) {
  return request(`/userservice/api/user/item?${stringify(params)}`)
}
//树详情
export async function getDepartItem(params) {
  return request(`/userservice/api/unit/item?${stringify(params)}`)
}


/******
 *
 * PlatManage
 *
 * **/

export async function getPlatMangerList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  return request(`/userservice/api/user/listPlatformManager?start=${params.start}&count=${params.count}&filter=${filter}`)
}

export async function deletePlateManager(params) {
  return request(`/userservice/api/user/del?${stringify(params)}`)
}

export async function addPlatManager(params) {
  return request('/userservice/api/user/addPlatformManager',{
    method:'POST',
    body:params,
  })
}

export async function updPlatManager(params) {
  return request('/userservice/api/user/updPlatformManager',{
    method:'POST',
    body:params,
  })
}


export async function getCustomerTree(params) {
  return request(`/userservice/api/tree?${stringify(params)}`)
}

// roleList

export async function appRoleList(params) {
  return request(`/permissionservice/api/role/listByAppId?${stringify(params)}`)
}


//应用列表
export async function appListByTenant(params) {
  return request(`/userservice/api/app/all?${stringify(params)}`)
}
