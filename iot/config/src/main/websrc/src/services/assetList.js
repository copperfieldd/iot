import { stringify } from 'qs';
import request from '../utils/request';

export async function asset_list(params) {
    return request(`/api/asset/list?${stringify(params)}`);
}

export async function asset_item(params) {
    return request(`/api/asset/item?${stringify(params)}`);
}

export async function lifecycle_list(params) {
    return request(`/api/lifecycle/list?${stringify(params)}`);
}

export async function history_list(params) {
    return request(`/api/track/list?${stringify(params)}`);
}
//导出
export async function asset_export(params) {
    return request(`/api/asset/exportexcle?${stringify(params)}`,{export:true});
}
//关联
export async function bind(params) {
    return request(`/api/asset/bind?${stringify(params)}`);
}
//解除关联
export async function unbind(params) {
    return request(`/api/asset/unbind?${stringify(params)}`);
}
//未关联标签列表
export async function bluetoothTag_list(params) {
    return request(`/api/bluetoothTag/unrelevance?${stringify(params)}`);
}
//资产修改
export async function asset_upd(params) {
    return request('/api/asset/upd', {
      method: 'POST',
      body: params,
    });
  }
