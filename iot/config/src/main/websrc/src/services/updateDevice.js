import { stringify } from 'qs';
import request from '../utils/request';

export async function getUpgradeList(params){
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/list?${stringify(params)}`)
}

export async function getUpgradeSti(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/statistics`)
}

export async function getHistoryList(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/historylist?${stringify(params)}`)
}

export async function getUpgradePackageHardWare(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/list.action?${stringify(params)}`)
}
export async function getUpgradePackageApp(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/list.action?${stringify(params)}`)
}
export async function getTenantItem(params) {
  return request(`/userservice/api/tenant/item?${stringify(params)}`)
}
export async function getApplicationItem(params) {
  return request(`/userservice/api/app/item?${stringify(params)}`)
}
export async function addUpgrade(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1`,{
    method:'POST',
    body:params
  })
};
export async function getDeviceTypeList(params) {
  return request(`/deviceservice/api/devicetype/list?${stringify(params)}`)
}
export async function getDeviceModalList(params) {
  return request(`/deviceservice/api/devicemodel/list?${stringify(params)}`)
};

export async function getAddDutyBag(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/list.action?${stringify(params)}`)
}

export async function addUpdateDuty(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1`,{
    method:"POST",
    body:params
  })
}

export async function updateUpdateDuty(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1`,{
    method:"PUT",
    body:params
  })
}

export async function delUpdateDuty(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1`,{
    method:"DELETE",
    body:params,
  })
}

export async function addUpdateTimeConfig(params) {
  return request(`http://120.79.148.212:8086/upgrade/time/api/v1/timePlug`,{
    method:'POST',
    body:params,
  })
}

export async function addUpdateDeviceConfig(params) {
  return request(`http://120.79.148.212:8086/upgrade/driver/api/v1/driveConfig`,{
    method:'POST',
    body:params,
  })
}

export async function addUpdateVersionConfig(params) {
  return request(`http://120.79.148.212:8086/upgrade/version/api/v1/config.action`,{
    method:'POST',
    body:params
  })
}

export async function addUpdateConfig(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/completeconfig`,{
    method:'PUT',
    body:params
  })
}

export async function delHardwarePackage(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/delete.action`,{
    method:'DELETE',
    body:params,
  })
}

export async function addUpgradePackage(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/new.action`,{
    method:'POST',
    body:params
  })
}

export async function updUpgradePackage(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/modify.action`,{
    method:'PUT',
    body:params,
  })
}

export async function upgradePackageDetails(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgradePackage/api/v1/detailList.action?${stringify(params)}`)
}


export async function getUpgradeStatistics(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/statistics?${stringify(params)}`)
}
//获取升级情况列表
export async function getUpgradeResult(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/resultlist?${stringify(params)}`)
}
//获取升级信息
export async function getUpgradeInfo(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1?${stringify(params)}`)
}
//获取设备信息
export async function getUpgradeDeviceConfigInfo(params) {
  return request(`http://120.79.148.212:8086/upgrade/driver/api/v1/info.action?${stringify(params)}`)
}
//获取时间配置
export async function getUpgradeTimeConfig(params) {
  return request(`http://120.79.148.212:8086/upgrade/time/api/v1/info?${stringify(params)}`)
}
//版本控制
export async function getUpgradeVersionConfig(params) {
  return request(`http://120.79.148.212:8086/upgrade/version/api/v1/info.action`,{
    method:'POST',
    body:params,
  })
}
//改变状态
export async function upgradeControl(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/control`,{
    method:"PUT",
    body:params,
  })
}

//升级任务详情
export async function upgradeItem(params) {
  return request(`http://120.79.148.212:8086/upgrade/upgrade/api/v1/resultlist?${stringify(params)}`)
}
