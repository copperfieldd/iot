import { stringify } from 'qs';
import request from '../utils/request';

export async function countryList(params) {
  const filter = params.filter?encodeURIComponent(JSON.stringify(params.filter)):''
  return request(`/geography/api/country/list?start=${params.start}&count=${params.count}&filter=${filter}`)
}

export async function addCountry(params) {
  return request('/geography/api/country/add',{
    method:'POST',
    body:params,
  })
}

export async function editCountry(params) {
  return request('/geography/api/country/upd',{
    method:'POST',
    body:params,
  })
}

export async function delCountry(params) {
  return request(`/geography/api/country/del?${stringify(params)}`)
}

export async function getAreasTree(params) {
  return request(`/geography/api/region/children?${stringify(params)}`)
}


export async function delAreaTree(params) {
  return request(`/geography/api/region/del?${stringify(params)}`)
}

export async function areaItem(params) {
  return request(`/geography/api/region/item?${stringify(params)}`)
}


