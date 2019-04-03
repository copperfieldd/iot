import { stringify } from 'qs';
import request from '../utils/request';

//
export async function serviceList(params) {
  return request(`/statsservice/api/application/list?${stringify(params)}`);
};

export async function analyticList(params) {
   return request(`/statsservice/api/script/analytic/list?${stringify(params)}`)
};

export async function addAnalytic(params) {
  return request(`/statsservice/api/script/analytic/add`,{
    method:"POST",
    body:params,
  })
};

export async function editAnalytic(params) {
  return request('/statsservice/api/script/analytic/upd',{
    method:"POST",
    body:params,
  })
};

export async function delAnalytic(params) {
  return request(`/statsservice/api/script/analytic/del?${stringify(params)}`)
}

export async function addStiService(params) {
  return request('/statsservice/api/application/add',{
    method:"POST",
    body:params,
  })
}

export async function updStiService(params) {
  return request('/statsservice/api/application/upd',{
    method:"POST",
    body:params
  })
}

export async function delStiService(params) {
  return request(`/statsservice/api/application/del?${stringify(params)}`)
};

export async function getStiDateList(params) {
  return request(`/statsservice/api/data/structure/list?${stringify(params)}`)
}

export async function addStiDate(params) {
  return request('/statsservice/api/data/structure/add',{
    method:'POST',
    body:params,
  })
}

export async function updStiDate(params) {
  return request('/statsservice/api/data/structure/upd',{
    method:'POST',
    body:params,
  })
}

export async function delStiDate(params) {
  return request(`/statsservice/api/data/structure/del?${stringify(params)}`)
}

export async function stiDateItem(params) {
  return request(`/statsservice/api/data/structure/item`,{
    method:'POST',
    body:params
  })
}


export async function allTenantNum(params) {
  return request(`/statsservice/api/index/data/user/tenantsum?${stringify(params)}`);
}

export async function addTenantNum(params) {
  return request(`/statsservice/api/index/data/user/newtenantsum?${stringify(params)}`);
}

export async function clientUserNum(params) {
  return request(`/statsservice/api/index/data/user/clientsum?${stringify(params)}`);
}

export async function getAllTenant(params) {
  return request(`/userservice/api/tenant/all?${stringify(params)}`)
}

export async function addTenantNumChart(params) {
  return request(`/statsservice/api/index/data/user/newtenanttrend?${stringify(params)}`)
}

export async function totalTenantNumChart(params) {
  return request(`/statsservice/api/index/data/user/tenanttrend?${stringify(params)}`)
}

export async function clientNewUserNumChart(params) {
  return request(`/statsservice/api/index/data/user/newclienttrend?${stringify(params)}`)
}

export async function clientTotalUserNumChart(params) {
  return request(`/statsservice/api/index/data/user/clienttrend?${stringify(params)}`)
}

export async function getAppByTenantId(params) {
  return request(`/userservice/api/app/all?${stringify(params)}`)
}

export async function applicationNumByTenantId(params) {
  return request(`/statsservice/api/index/data/user/tenantappsum?${stringify(params)}`)
}

export async function clientNewUserByTenantChart(params) {
  return request(`/statsservice/api/index/data/user/newclienttrendbytenant?${stringify(params)}`)
}

export async function clientTotalUserByTenantChart(params) {
  return request(`/statsservice/api/index/data/user/clienttrendbytenant?${stringify(params)}`)
}

export async function clientTotalUserByAppId(params) {
  return request(`/statsservice/api/index/data/user/clientsumbyapp?${stringify(params)}`)
}

export async function clientNewUserByApp(params) {
  return request(`/statsservice/api/index/data/user/newclienttrendbyapp?${stringify(params)}`)
}

export async function clientTotalUserByApp(params) {
  return request(`/statsservice/api/index/data/user/clienttrendbyapp?${stringify(params)}`)
}


/**
 * 权限
 * */

export async function perTotalApi(params) {
  return request(`/statsservice/api/index/data/permission/interfacesum?${stringify(params)}`)
}

export async function perApiUserTime(params) {
  return request(`/statsservice/api/index/data/permission/interfaceusesum?${stringify(params)}`)
}

// export async function perApiUseTimeChart(params) {
//   return request(`/statsservice/api/index/data/permission/interfaceusetrend?${stringify(params)}`)
// }

export async function perApiUseTimeChart(params) {
  return request(`/statsservice/api/index/data/permission/interfacetrend?${stringify(params)}`)
}


export async function perApiUseTimeByTenant(params) {
  return request(`/statsservice/api/index/data/permission/interfaceusebytenant?${stringify(params)}`)
}

export async function perApiByTenant(params) {
  return request(`/permissionservice/api/interface/listByOrg?${stringify(params)}`)
}

export async function perApiUseTimeByApi(params) {
  return request(`/statsservice/api/index/data/permission/interfaceusetrendbyid?${stringify(params)}`)
}
export async function perTenantUseApiByApi(params) {
  return request(`/statsservice/api/index/data/permission/tenantuseinterfacetrend?${stringify(params)}`)
}
export async function perAppUseApiByApi(params) {
  return request(`/statsservice/api/index/data/permission/appuseinterfacetrend?${stringify(params)}`)
}


/****
 * 设备
 */
//接入租户
export async function eqTenantNum(params) {
  return request(`/statsservice/api/index/data/device/tenantsum?${stringify(params)}`)
}
//总接入设备数
export async function eqDeviceNum(params) {
  return request(`/statsservice/api/index/data/device/devicesum?${stringify(params)}`)
}
//总类型数
export async function eqAllTypeNum(params) {
  return request(`/statsservice/api/index/data/device/typesum?${stringify(params)}`)
}
//不同设备类型
export async function eqdefTypeDeviceNum(params) {
  return request(`/statsservice/api/index/data/device/devicesumbytype?${stringify(params)}`)
}
//新增设备
export async function eqAddDeviceNum(params) {
  return request(`/statsservice/api/index/data/device/newdevicesum?${stringify(params)}`)
}
//新增设备类型趋势
export async function eqAddDeviceTypeChart(params) {
  return request(`/statsservice/api/index/data/device/newtypetrend?${stringify(params)}`)
}
//新增设备数
export async function eqAddDeviceChart(params) {
  return request(`/statsservice/api/index/data/device/newdevicetrend?${stringify(params)}`)
}
//新增应用
export async function eqAddAppChart(params) {
  return request(`/statsservice/api/index/data/device/newapptrend?${stringify(params)}`)
}
//累计设备类型

export async function eqTotalDeviceTypeChart(params) {
  return request(`/statsservice/api/index/data/device/typetrend?${stringify(params)}`)
}
//累计设备总数
export async function eqTotalDeviceChart(params) {
  return request(`/statsservice/api/index/data/device/devicetrend?${stringify(params)}`)
}
//累计应用
export async function eqTotalAppChart(params) {
  return request(`/statsservice/api/index/data/device/apptrend?${stringify(params)}`)
}
//租户新增应用
export async function eqAddAppByTenant(params) {
  return request(`/statsservice/api/index/data/device/appsumbytenant?${stringify(params)}`)
}
//应用累计
export async function eqTotalDeviceByApp(params) {
  return request(`/statsservice/api/index/data/device/clientsumbyapp?${stringify(params)}`)
}
//设备类型设备
export async function eqDeviceBytType(params) {
  return request(`/statsservice/api/index/data/device/devicesumbytype?${stringify(params)}`)
}

//设备类型
export async function eqDeviceType(params) {
  return request(`/deviceservice/api/devicesetting/pulldown/list?${stringify(params)}`)
}

//设备类型下的设备趋势图
export async function eqNumByEqTypeChart(params) {
  return request(`/statsservice/api/index/data/device/devicesumtrendbytype?${stringify(params)}`)
}

/****
 * 支付
 * @param value
 */
//接入租户数（汇总）
export async function payTenantSum(params) {
  return request(`/statsservice/api/index/data/pay/tenantsum?${stringify(params)}`)
}
//总应用数（汇总）
export async function payAppSum(params) {
  return request(`/statsservice/api/index/data/pay/appsum?${stringify(params)}`)
}
//新增应用数（汇总）
export async function payAddAppSum(params) {
  return request(`/statsservice/api/index/data/pay/newappsum?${stringify(params)}`)
}
//订单总数（汇总）
export async function payOrderSum(params) {
  return request(`/statsservice/api/index/data/pay/ordersum?${stringify(params)}`)
}
//新增订单数（汇总）
export async function payAddOrderSum(params) {
  return request(`/statsservice/api/index/data/pay/newordersum?${stringify(params)}`)
}
//总订单数（趋势）
export async function payOrderChart(params) {
  return request(`/statsservice/api/index/data/pay/ordertrend?${stringify(params)}`)
}
//新增订单数（趋势）
export async function payAddOrderChart(params) {
  return request(`/statsservice/api/index/data/pay/newordertrend?${stringify(params)}`)
}
//租户下应用订单总数（汇总）
export async function payOrderByTenantSum(params) {
  return request(`/statsservice/api/index/data/pay/appordersumbytenant?${stringify(params)}`)
}
//租户下新增应用订单数（汇总）
export async function payAddOrderByTenantSum(params) {
  return request(`/statsservice/api/index/data/pay/newappordersumbytenant?${stringify(params)}`)
}
//租户下订单数（趋势）
export async function payOrderByTenantChart(params) {
  return request(`/statsservice/api/index/data/pay/ordertrendbytenant?${stringify(params)}`)
}
//租户下新增应用订单数（趋势）
export async function payAddOrderByTenantChart(params) {
  return request(`/statsservice/api/index/data/pay/newappordertrendbytenant?${stringify(params)}`)
}
//应用订单总数（趋势）
export async function payOrderByAppChart(params) {
  return request(`/statsservice/api/index/data/pay/ordertrendbyapp?${stringify(params)}`)
}
//应用下新增订单数（趋势）
export async function payAddOrderByAppChart(params) {
  return request(`/statsservice/api/index/data/pay/newordertrendbyapp?${stringify(params)}`)
}

//总告警次数（汇总）
export async function warnTimeSum(params) {
  return request(`/statsservice/api/index/data/alarm/sum?${stringify(params)}`)
}

//短信告警次数（汇总）
export async function warningMsgTimeSum(params) {
  return request(`/statsservice/api/index/data/alarm/smssum?${stringify(params)}`)
}

//邮件告警次数（汇总）
export async function warningEmailTimeSum(params) {
  return request(`/statsservice/api/index/data/alarm/emailsum?${stringify(params)}`)
}

//总告警次数（趋势）
export async function warnTimeChart(params) {
  return request(`/statsservice/api/index/data/alarm/trend?${stringify(params)}`)
}

//短信告警次数（趋势）
export async function warningMsgTimeChart(params) {
  return request(`/statsservice/api/index/data/alarm/smstrend?${stringify(params)}`)
}

//邮件告警次数（趋势）
export async function warningEmailTimeChart(params) {
  return request(`/statsservice/api/index/data/alarm/emailtrend?${stringify(params)}`)
}

//总租户（汇总）
export async function positionTenantSum(params) {
  return request(`/statsservice/api/index/data/position/tenantsum?${stringify(params)}`)
}

//总应用数（汇总）
export async function positionAppSum(params) {
  return request(`/statsservice/api/index/data/position/appsum?${stringify(params)}`)
}
//删除数据表
export async function delDataTable(params) {
  return request(`/statsservice/api/data/structure/del?${stringify(params)}`)
}
