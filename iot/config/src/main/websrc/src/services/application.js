import { stringify } from 'qs';
import request from '../utils/request';
//应用列表
export async function appList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  return request(`/userservice/api/app/list?start=${params.start}&count=${params.count}&filter=${filter}`);
};

//新增应用
export async function addAppcalition(params) {
  return request('/userservice/api/app/add',{
    method:'POST',
    body:params
  })
}


export async function applicationItems(params) {
   return request(`/userservice/api/app/items?${stringify(params)}`)
}

export async function updApplication(params) {
  return request('/userservice/api/app/upd',{
    method:'POST',
    body:params,
  })
}

//删除应用
export async function delApplication(params) {
  return request(`/userservice/api/app/del?${stringify(params)}`)
}

//终端用户列表
export async function terminalUserList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):'';
  return request(`/userservice/api/user/endList?start=${params.start}&count=${params.count}&filter=${filter}`)
}

//新建终端用户
export async function addTerminalUser(params) {
  return request(`/userservice/api/user/add`,{
    method:'POST',
    body:params,
  })
}

//修改终端用户
export async function updTerminalUser(params) {
  return request(`/userservice/api/user/upd`,{
    method:'POST',
    body:params,
  })
}

//终端用户详情
export async function terminalUserItem(params) {
  return request(`/userservice/api/user/item?${stringify(params)}`)
}

//删除用户
export async function delTerminalUser(params) {
  return request(`/userservice/api/user/del?${stringify(params)}`)
}

//获取应用

export async function getApplication(params) {
  return request(`/userservice/api/app/list?${stringify(params)}`)
}


