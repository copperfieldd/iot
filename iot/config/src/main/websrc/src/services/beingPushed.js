import { stringify } from 'qs';
import request from '../utils/request';

export async function tenantAllList(params){
  return request(`http://120.79.148.212:8085/message/tenant/tenantAllList?${stringify(params)}`)
}
export async function addTenantList(params) {
  return request(`http://120.79.148.212:8085/message/tenant/tenantList?${stringify(params)}`)
}
export async function addTenantConfig(params) {
  return request(`http://120.79.148.212:8085/message/tenant/config`,{
    method:'POST',
    body:params,
  })
}
//租户暂停
export async function stopTenant(params) {
  return request(`http://120.79.148.212:8085/message/tenant/updateTenantStatus`,{
    method:'POST',
    body:params,
  })
}
//调整租户
export async function updateTenantNum(params) {
  return request(`http://120.79.148.212:8085/message/tenant/adjustment`,{
    method:'POST',
    body:params,
  })
}
//修改租户配置
export async function updateTenantConfig(params) {
  return request(`http://120.79.148.212:8085/message/tenant/updateTenant`,{
    method:'POST',
    body:params,
  })
}
//租户详情配置
export async function tenantItemConfig(params) {
  return request(`http://120.79.148.212:8085/message/tenant/getTenantById?${stringify(params)}`)
}
//租户应用信息
export async function applicationByTenant(params) {
  return request(`http://120.79.148.212:8085/message/tenant/getApplicationById?${stringify(params)}`)
}

//应用列表
export async function applicationAllList(params) {
  return request(`http://120.79.148.212:8085/message/application/applicationAllList?${stringify(params)}`)
}
//新应用列表
export async function applicationNewList(params) {
  return request(`http://120.79.148.212:8085/message/application/applicationList?${stringify(params)}`)
}
//新增应用配置
export async function addApplicationConfig(params) {
  return request(`http://120.79.148.212:8085/message/application/config`,{
    method:'POST',
    body:params
  })
}
//应用详情
export async function applicationItemByAppId(params) {
  return request(`http://120.79.148.212:8085/message/application/getApplicationById?${stringify(params)}`)
}
//修改应用
export async function editApplicationConfig(params) {
  return request(`http://120.79.148.212:8085/message/application/updateApplication`,{
    method:'POST',
    body:params,
  })
}
//调整应用
export async function editApplicationNumber(params) {
  return request(`http://120.79.148.212:8085/message/application/adjustment`,{
    method:'POST',
    body:params,
  })
}
//暂停应用
export async function changeAppStatus(params) {
  return request(`http://120.79.148.212:8085/message/application/updateApplicationStatus`,{
    method:'POST',
    body:params,
  })
}

//新建模板
export async function addPlatTemplate(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/newTemplate.action`,{
    method:'POST',
    body:params
  })
}

//修改模板
export async function editPlatTemplate(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/updateTemplate.action`,{
    method:'POST',
    body:params
  })
}
//删除模板
export async function delPlatTemplate(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/deleteTemplate.action`,{
    method:'POST',
    body:params
  })
}


export async function commentTemplate(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/commonTemplateList.action`,{
    method:'POST',
    body:params
  })
}

//短信模板
export async function getPlatTemplateList(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/getTemplateList.action`,{
    method:'POST',
    body:params,
  })
}
//模板审核
export async function examinTemplate(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/examineTemplate.action`,{
    method:'POST',
    body:params
  })
}
//签名审核
export async function examineAutograph(params) {
  return request(`http://120.79.148.212:8085/message/sign/v1/examineSign.action`,{
    method:'POST',
    body:params
  })
}

//新增签名
export async function addAutograph(params) {
  return request(`http://120.79.148.212:8085/message/sign/v1/newSign.action`,{
    method:'POST',
    body:params,
  })
}

//签名修改
export async function editAutograph(params) {
  return request(`http://120.79.148.212:8085/message/sign/v1/modifySign.action`,{
    method:'POST',
    body:params
  })
}

//用户模板
export async function getUserTemplateList(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/getUserTemplateList.action`,{
    method:'POST',
    body:params
  })
}

//用户签名
export async function userAutograph(params) {
  return request(`http://120.79.148.212:8085/message/sign/v1/signList.action`,{
    method:'POST',
    body:params
  })
}

//删除签名
export async function delUserAutograph(params) {
  return request(`http://120.79.148.212:8085/message/sign/v1/deleteSign.action`,{
    method:'POST',
    body:params,
  })
}


//任务列表
export async function getTaskList(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/messageList.action`,{
    method:'POST',
    body:params,
  })
}
//明细列表
export async function messageItemList(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/messageDetail.action`,{
    method:'POST',
    body:params
  })
}
//消息饼状图
export async function messagePieChart(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/pieChart.action`,{
    method:'POST',
    body:params,
  })
}
export async function messageLineChart(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/lineChart.action`,{
    method:'POST',
    body:params,
  })
}
//总条数
export async function messageTypeCount(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/typeCount.action`,{
    method:'POST',
    body:params,
  })
}
//取消发送
export async function messgeCancel(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/stateChange.action`,{
    method:'POST',
    body:params,
  })
}
//明细下载
export async function messageDownload(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/download.action?${stringify(params)}`,{export:true})
}
//获取所有租户
export async function getAllTenantList(params) {
  return request(`/userservice/api/tenant/all?${stringify(params)}`)
}
//获取租户下应用
export async function getAllApplicationByTenant(params) {
  return request(`/userservice/api/app/all?${stringify(params)}`)
}

//新建任务
export async function taskAdd(params) {
  return request(`http://120.79.148.212:8085/message/task/v1/messageAdd.action`,{
    method:'POST',
    body:params,
  })
}
export async function pullAutograph(params) {
  return request(`http://120.79.148.212:8085/message/sign/v1/signList.action`,{
    method:'POST',
    body:params
  })
}
export async function pullTemp(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/availableTemplate.action`,{
    method:'POST',
    body:params,
  })
}
export async function templateItem(params) {
  return request(`http://120.79.148.212:8085/message/sms/v1/templateDetail.action`,{
    method:'POST',
    body:params
  })
}
