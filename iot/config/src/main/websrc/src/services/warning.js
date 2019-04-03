import { stringify } from 'qs';
import request from '../utils/request';

/**
 *
 * Warning List
 *
 * **/
export async function warningList(params) {
  return request(`/alarmservice/api/alarm/list?${stringify(params)}`)
}

export async function exportWarningExcl(params) {
  return request(`/alarmservice/api/alarm/exportExcel?${stringify(params)}`,{export:true})
}

/***
 *
 * Warning Service
 *
 * ***/
export async function warningServiceList(params){
  return request(`/alarmservice/api/alarmService/list?${stringify(params)}`)
}

export async function addWarningService(params){
  return request('/alarmservice/api/alarmService/add',{
    method:'POST',
    body:params,
  })
}

export async function updWarningService(params) {
  return request('/alarmservice/api/alarmService/upd',{
    method:'POST',
    body:params,
  })
}

export async function delWarningService(params) {
  return request(`/alarmservice/api/alarmService/del?${stringify(params)}`)
}


/***
 *
 * Warning Type
 *
 * ***/

export async function warningTypeList(params) {
  return request(`/alarmservice/api/type/list?${stringify(params)}`)
}

export async function addWarningTypeList(params) {
  return request('/alarmservice/api/type/add',{
    method:'POST',
    body:params
  })
}

export async function updWarningTypeList(params) {
  return request('/alarmservice/api/type/upd',{
    method:'POST',
    body:params,
  })
}

export async function delWarningTypeList(params) {
  return request(`/alarmservice/api/type/del?${stringify(params)}`)
}

/***
 *
 * Warning Strategy
 *
 * ***/
export async function warningStrategyList(params) {
  return request(`/alarmservice/api/policy/list?${stringify(params)}`)
}

export async function addWarningStrategyList(params) {
  return request('/alarmservice/api/policy/add',{
    method:'POST',
    body:params,
  })
}

export async function updWarningStrategyList(params) {
  return request('/alarmservice/api/policy/upd',{
    method:'POST',
    body:params,
  })
}

export async function delWarningStrategyList(params) {
  return request(`/alarmservice/api/policy/del?${stringify(params)}`)
}


/***
 *
 * Warning Rule
 *
 * **/

export async function warningRuleList(params) {
  return request(`/alarmservice/api/rule/list?${stringify(params)}`)
}

export async function addWarningRuleList(params) {
  return request('/alarmservice/api/rule/add',{
    method:'POST',
    body:params,
  })
}
export async function updWarningRuleList(params) {
  return request('/alarmservice/api/rule/upd',{
    method:'POST',
    body:params,
  })
}

export async function delWarningRuleList(params) {
  return request(`/alarmservice/api/rule/del?${stringify(params)}`)
}

export async function warningRuleItem(params) {
  return request(`/alarmservice/api/rule/item?${stringify(params)}`)
}


//导出
export async function warningExport(params) {
  return request(`/alarmservice/api/alarm/exportExcel?${stringify(params)}`,{export:true})
}
