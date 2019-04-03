import { stringify } from 'qs';
import request from '../utils/request';
//订单列表
export async function orderList(params) {
  return request(`/pay/orderlist?${stringify(params)}`);
};

//订单详情接口
export async function orderItem(params) {
  return request(`/pay/order/item?${stringify(params)}`);
}

//应用列表
export async function applicationList(params) {
  return request(`/pay?${stringify(params)}`)
}

//新增应用列表
export async function addApplication(params) {
  return request('',{
    method:'POST',
    body:params,
  })
}

//修改应用列表
export async function updApplication(params) {
  return request('',{
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
  return request(`?${stringify(params)}`)
}

export async function getSecretKey(params) {
  return request(`?${stringify(params)}`)
}
