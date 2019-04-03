import { stringify } from 'qs';
import request from '../utils/request';

export async function unit_tree(params) {
  return request(`/unit/tree?${stringify(params)}`);
}

export async function asset_type(params) {
  return request(`/api/systemconfig/assettype?${stringify(params)}`);
}
export async function menu_data(params) {
  return request(`/api/web/nav?${stringify(params)}`);
}
export async function menuData(params) {
  return request(`/permissionservice/api/menu/tree?${stringify(params)}`)
}
export async function changePassword(params) {
  return request(`/userservice/api/user/password/upd/designation`,{
    method:"POST",
    body:params
  })
}
export async function changeCurrentPassword(params) {
  return request(`/userservice/api/user/password/upd`,{
    method:"POST",
    body:params
  })
}
