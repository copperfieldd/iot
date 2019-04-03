import { stringify } from 'qs';
import request from '../utils/request';

export async function leaderboard(params) {
  return request(`/api/home/leaderboard?${stringify(params)}`);
}

export async function todo(params) {
  return request(`/api/todo/list?${stringify(params)}`);
}

export async function compare(params) {
  return request(`/api/home/compare?${stringify(params)}`);
}

export async function alarm_list(params) {
  return request(`/api/home/alarm/list?${stringify(params)}`);
}

export async function statistics(params) {
  return request(`/api/home/alarm/statistics?${stringify(params)}`);
}

export async function asset_type(params) {
  return request(`/api/home/asset/type?${stringify(params)}`);
}

export async function distributed(params) {
  return request(`/api/home/asset/distributed?${stringify(params)}`);
}

export async function curve(params) {
  return request(`/api/home/asset/curve?${stringify(params)}`);
}


