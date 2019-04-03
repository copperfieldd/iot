import { stringify } from 'qs';
import request from '../utils/request';

export async function getTypeList(params) {
  return request(`/audit/api/type/list?${stringify(params)}`)
}

export async function delType(params) {
  return request(`/audit/api/type/del?${stringify(params)}`)
}

export async function updType(params) {
  return request('/audit/api/type/upd',{
    method:'POST',
    body:params,
  })
}

export async function typeItem(params) {
   return request(`/audit/api/type/item?${stringify(params)}`)
}

export async function addType(params) {
   return request('/audit/api/type/add',{
     method:'POST',
     body:params,
   })
}

export async function auditQuery(params) {
  return request(`/audit/api/log/list?${stringify(params)}`)
}

export async function exportExcl(params) {
  return request(`/audit/api/log/exportExcle?${stringify(params)}`,{export:true})
}
