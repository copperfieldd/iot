import { stringify } from 'qs';
import request from '../utils/request';
//订单列表
export async function orderList(params) {
  return request(`/payservice/pay/order/list?${stringify(params)}`);
};

//订单详情接口
export async function orderItem(params) {
  return request(`/payservice/pay/order/item?${stringify(params)}`);
}

//应用列表
export async function applicationList(params) {
  return request(`/payservice/application/list?${stringify(params)}`)
}

//新增应用列表
export async function addApplication(params) {
  return request('/payservice/application/add',{
    method:'POST',
    body:params,
  })
}

//修改应用列表
export async function updApplication(params) {
  return request('/payservice/application/upd',{
    method:'POST',
    body:params,
  })
}

//删除
export async function delApplication(params) {
   return request(`?${stringify(params)}`)
}

//修改应用状态
export async function updApplicationStatus(params) {
  return request('/payservice/application/updstatus',{
    method:'POST',
    body:params
  })
}
export async function getSecretKey(params) {
  return request(`/payservice/application/makekey`)
}

//应用详情
export async function applicationItem(params) {
  return request(`/payservice/application/item?${stringify(params)}`)
}
