import { stringify } from 'qs';
import request from '../utils/request';


/**
 *
 * 下拉列表
 *
 * **/

//设备类型下拉列表
export async function deviceTypePullList(params) {
  return request(`/deviceservice/api/devicesetting/pulldown/list?${stringify(params)}`);
}

//适配器下拉列表
export async function adapterPullList(params) {
  return request(`/deviceservice/api/adapter/pulldown/list?${stringify(params)}`);
}

//插件下拉列表
export async function pluginPullList(params) {
  return request(`/deviceservice/api/plugin/pulldown/list?${stringify(params)}`);
}

//组件下拉列表

export async function componentPullList(params) {
  return request(`/deviceservice/api/component/pulldown/list?${stringify(params)}`);
}

export async function pluginPullLists(params) {
  return request(`/deviceservice/api/plugin/list?${stringify(params)}`)
}

/**
 *
 * Equipment Type Service
 *
 * **/

export async function deviceTypeList(params) {
  return request(`/deviceservice/api/devicesetting/list?${stringify(params)}`);
}

export async function addDeviceType(params) {
  return request('/deviceservice/api/devicesetting/add',{
    method:'POST',
    body:params
  });
}

export async function updDeviceType(params) {
  return request('/deviceservice/api/devicesetting/upd',{
    method:'POST',
    body:params
  });
}


export async function deviceTypeItem(params) {
  return request(`/deviceservice/api/devicesetting/item?${stringify(params)}`);
}


export async function delDeviceTypeList(params) {
  return request(`/deviceservice/api/devicesetting/del?${stringify(params)}`);
}

/**
 *
 * Adapter  Service
 *
 * **/

export async function adapterList(params) {
  return request(`/deviceservice/api/adapter/list?${stringify(params)}`);
}


export async function addAdpater(params) {
  return request(`/deviceservice/api/adapter/add?${stringify(params)}`);
}

export async function updAdpater(params) {
  return request(`/deviceservice/api/adapter/upd?${stringify(params)}`);
}

export async function adapterItem(params) {
  return request(`/deviceservice/api/adapter/item?${stringify(params)}`);
}

export async function delAdapter(params) {
  return request(`/deviceservice/api/adapter/del?${stringify(params)}`);
}


/**
 *
 * Equipment Manage  Service
 *
 * **/
//新增设备管理
export async function addDevice(params) {
  return request('/deviceservice/api/device/add',{
    method:'POST',
    body:params,
  })
}

export async function updDevice(params) {
  return request('/deviceservice/api/device/upd',{
    method:'POST',
    body:params,
  })
}
//随机token
export async function getDeviceToken() {
  return request(`/deviceservice/api/device/token`);
}
//设备列表
export async function getDeviceList(params) {
  return request(`/deviceservice/api/device/list?${stringify(params)}`)
}
//重置token
export async function refreshToken(params) {
  return request(`/deviceservice/api/device/refresh/token?${stringify(params)}`)
}
//设备详情认证信息
export async function deviceAuhorizationItem(params) {
  return request(`/deviceservice/api/device/item/authorization?${stringify(params)}`)
}
//设备详情基础信息
export async function deviceBaiscItem(params) {
  return request(`/deviceservice/api/device/item/basic?${stringify(params)}`)
}
//设备数据信息
export async function deviceDataItem(params) {
  return request(`/deviceservice/api/device/item/data?${stringify(params)}`)
}
//设备数据详情
export async function deviceItemDataItem(params) {
  return request(`/deviceservice/api/device/item/data/item?${stringify(params)}`)
}
//设备事件详情
export async function deviceEventItem(params) {
  return request(`/deviceservice/api/device/item/event?${stringify(params)}`)
}

//导入记录详情
export async function deviceImportItem(params) {
  return request(`/deviceservice/api/device/importrecord/item?${stringify(params)}`)
}
//删除导入记录
export async function delDeviceItem(params) {
  return request(`/deviceservice/api/device/importrecord/del?${stringify(params)}`)
}
//token导出
export async function tokenExport(params) {
  return request(`/deviceservice/api/device/exportexcle?${stringify(params)}`,{export:true})
}
export async function dataExport(params) {
  return request(`/deviceservice/api/device/data/exportexcle?${stringify(params)}`,{export:true})
}
//删除设备
export async function delDevice(params) {
  return request(`/deviceservice/api/device/del?${stringify(params)}`)
}
//批量导入
export async function devicesImport(params) {
  return request(`/deviceservice/api/device/importexcel?${stringify(params)}`)
}

/**
 *
 * Data Deal  Service
 *
 * **/

export async function getDataDealList(params) {
  return request(`/deviceservice/api/rule/list?${stringify(params)}`)
}


/**
 *
 * Component  Service
 *
 * **/
export async function componentList(params) {
  return request(`/deviceservice/api/component/list?${stringify(params)}`);
}

export async function updComponent(params) {
  return request(`/deviceservice/api/component/upd?${stringify(params)}`);
}

export async function addComponent(params) {
  return request(`/deviceservice/api/component/add?${stringify(params)}`);
}

export async function delComponent(params) {
  return request(`/deviceservice/api/component/del?${stringify(params)}`);
}

export async function componentItem(params) {
  return request(`/deviceservice/api/component/item?${stringify(params)}`);
}




/**
 *
 * Rule  Service
 *
 * **/

export async function ruleList(params) {
  return request(`/deviceservice/api/rule/list?${stringify(params)}`)
}

export async function addRule(params) {
  return request('/deviceservice/api/rule/add',{
    method:'POST',
    body:params,
  })
}

export async function updRule(params) {
  return request('/deviceservice/api/rule/upd',{
    method:'POST',
    body:params,
  })
}

export async function delRule(params) {
  return request(`/deviceservice/api/rule/del?${stringify(params)}`)
}

export async function ruleItem(params) {
  return request(`/deviceservice/api/rule/item?${stringify(params)}`)
}


/**
 *
 * Plugin  Service
 *
 * **/

export async function pluginList(params) {
  return request(`/deviceservice/api/plugin/list?${stringify(params)}`);
}

export async function addPlugin(params) {
  return request(`/deviceservice/api/plugin/add`,{
    method:'POST',
    body:params,
  });
}



export async function delPlugin(params) {
  return request(`/deviceservice/api/plugin/del?${stringify(params)}`);
}

export async function pluginItem(params) {
  return request(`/deviceservice/api/plugin/item?${stringify(params)}`);
}

export async function updPlugin(params) {
  return request(`/deviceservice/api/plugin/upd`,{
    method:'POST',
    body:params,
  });
}
/**
 *
 * Log  Service
 *
 * **/
export async function getLogList(params) {
  return request(`/deviceservice/api/event/list?${stringify(params)}`)
}

export async function deDataItem(params) {
  return request(`/deviceservice/api/device/item/data/item?${stringify(params)}`)
}

export async function getFilterConfig(params) {
  return request(`/deviceservice/api/component/config?${stringify(params)}`)
}


//导入记录列表
export async function deviceImportList(params) {
  return request(`/deviceservice/api/device/importrecord/list?${stringify(params)}`)
}
//导入预览列表
export async function deviceImportPerview(params) {
  return request(`/deviceservice/api/device/preview?${stringify(params)}`)
}
//导出导入记录
export async function exportReocrd(params) {
  return request(`/deviceservice/api/device/exportrecord?${stringify(params)}`,{export:true})
}


//获取一级列表
export async function getFirstTypeList(params) {
  return request(`/deviceservice/api/devicetype/list?${stringify(params)}`)
}
//新增一级类别
export async function addFirstType(params) {
  return request(`/deviceservice/api/devicetype/add`,{
    method:'POST',
    body:params,
  })
}
//新增二级类别
export async function addSecondType(params) {
  return request(`/deviceservice/api/devicemodel/add`,{
    method:'POST',
    body:params
  })
};
//获取一级
export async function getFirstType(params) {
  return request(`/deviceservice/api/devicetype/list?${stringify(params)}`)
};
//获取二级类别
export async function getSecondType(params) {
  return request(`/deviceservice/api/devicemodel/list?${stringify(params)}`)
}

//二级类别详情
export async function getSecondTypeItem(params) {
  return request(`/deviceservice/api/devicemodel/item?${stringify(params)}`)
}

//修改一级类别
export async function editFirstType(params) {
  return request(`/deviceservice/api/devicetype/upd`,{
    method:'POST',
    body:params,
  })
}

//修改二级类别
export async function editSecondType(params) {
  return request(`/deviceservice/api/devicemodel/upd`,{
    method:'POST',
    body:params
  })
}

//删除二级类别
export async function delSecondType(params) {
  return request(`/deviceservice/api/devicemodel/del?${stringify(params)}`);
}

//删除一级类别
export async function delFirstType(params) {
  return request(`/deviceservice/api/devicetype/del?${stringify(params)}`)
}
