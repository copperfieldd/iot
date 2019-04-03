import moment from 'moment';
import {parse, stringify} from 'qs';
import {connect} from "dva";
import {notification, message} from 'antd';

const isDebug = true ;
export const getURLRoot = () => window.location.protocol + '//' + window.location.host;
export const getDebugRoot = () => 'http://192.168.3.8:8020';
export const CHURl = 'http://120.79.148.212:8086';
//export const getDebugRoot = () => 'http://47.94.154.65:8020';
//export const getDebugRoot = () => 'http://192.168.31.176:8030';
export const getApiUrl = () => (isDebug ? getDebugRoot() : getURLRoot());
export const getUrl = (url) => (getApiUrl() + url);
export const count = 10;
export const start = 0;
export const smallCount = 5;
export const bigCount = 15;
export const starttime = moment().subtract(7, 'days').format('YYYY/MM/DD');
export const endtime = moment().subtract(1, 'days').format('YYYY/MM/DD');
import basicMessages from "../messages/common/basicTitle";

export function ExcelDownload(blob, filename) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, decodeURI(filename));
  }else{
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = decodeURI(filename);
    const href = window.URL.createObjectURL(blob);
    a.href = href;
    a.click();
    document.body.removeChild(a);
  }
}

export function menuDataList(menu) {
  if (!menu || menu.length === 0) {
    return [];
  }
  let menuData = menu.map(o => {
    const children = menuDataList(o.children);

    if (o.tag === '用户管理') {
      let child = children.map(i => {
        if (i.tag === "租户类别") {
          return {
            name: i.name,
            id: i.id,
            path: 'tenantType',
          }
        }
        if (i.tag === "租户管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'tenantManage',
          }
        }
        if (i.tag === "组织机构") {
          return {
            name: i.name,
            id: i.id,
            path: 'organization',
          }
        }
        if (i.tag === "平台管理员") {
          return {
            name: i.name,
            id: i.id,
            path: 'platManager',
          }
        }
      });

      let newChild = child.filter(item => item);
      return {
        name: o.name,
        //name:o.name,
        id: o.id,
        icon: 'yonghu',
        path: 'customer',
        children: [...newChild]
      }
    }
    if (o.tag === '权限管理') {
      let child = children.map(i => {
        if (i.tag === "接口管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'apiManage',
          }
        }
        if (i.tag === "菜单管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'menuManage',
          }
        }
        if (i.tag === "角色管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'roleManage',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'quanxian',
        path: 'permissions',
        children: [...newChild]
      }
    }
    if (o.tag === '应用管理') {
      let child = children.map(i => {
        if (i.tag === "应用列表") {
          return {
            name: i.name,
            id: i.id,
            path: 'userApplication',
          }
        }
        if (i.tag === "终端用户") {
          return {
            name: i.name,
            id: i.id,
            path: 'terminalCustomer',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'yingyong',
        path: 'application',
        children: [...newChild]
      }
    }
    if (o.tag === '设备管理') {
      let child = children.map(i => {
        if (i.tag === "适配管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'adapterManage',
          }
        }
        if (i.tag === "设备类型") {
          return {
            name: i.name,
            id: i.id,
            path: 'equipmentType',
          }
        }
        if (i.tag === "设备管理S") {
          return {
            name: i.name,
            id: i.id,
            path: 'equipmentManage',
          }
        }
        if (i.tag === "数据管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'dataManage',
          }
        }
        // if (i.tag === "组件管理") {
        //   return {
        //     name: i.name,
        //     id: i.id,
        //     path: 'componentManage',
        //   }
        // }
        if (i.tag === "规则管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'ruleManage',
          }
        }
        if (i.tag === "插件管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'plugManage',
          }
        }
        if(i.tag==='type_manage'){
          return {
            name: i.name,
            id: i.id,
            path: 'typeManage',
          }
        }
        // if (i.name === "日志管理") {
        //   return {
        //     name: i.name,
        //     id: i.id,
        //     path: 'logManage',
        //   }
        // }
      });
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'shebei',
        path: 'equipment',
        children: [...newChild]
      }
    }
    if (o.tag === '支付管理') {
      let child = children.map(i => {
        if (i.tag === "应用列表") {
          return {
            name: i.name,
            id: i.id,
            path: 'applicationList',
          }
        }
        if (i.tag === "订单管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'orderManage',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'zhifu',
        path: 'payManage',
        children: [...newChild]
      }
    }
    if (o.tag === '消息推送') {
      let child = children.map(i => {
        if (i.tag === "租户管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgTenant',
          }
        }
        if (i.tag === "应用管理msg") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgApplication',
          }
        }
        if (i.tag === "短信服务管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgService',
          }
        }
        if (i.tag === "消息管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgManage',
          }
        }
      });
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'xiaoxi',
        path: 'beingPushed',
        children: [...newChild]
      }
    }
    if (o.tag === '地理位置') {
      let child = children.map(i => {

        if (i.tag === "国家信息") {
          return {
            name: i.name,
            id: i.id,
            path: 'countriesInfo',
          }
        }
        if (i.tag === "行政区域") {
          return {
            name: i.name,
            id: i.id,
            path: 'administrativeAreas',
          }
        }
      })
      let newChild = child.filter(item => item);
      return {
        name: o.name,
        id: o.id,
        icon: 'weizhi',
        path: 'position',
        children: [...newChild]
      }
    }
    if (o.tag === '告警管理') {
      let child = children.map(i => {
        if (i.tag === "告警列表") {
          return {
            name: i.name,
            id: i.id,
            path: 'warningList',
          }
        }
        if (i.tag === "服务配置") {
          return {
            name: i.name,
            id: i.id,
            path: 'serviceConfig',
          }
        }
        if (i.tag === "告警类型") {
          return {
            name: i.name,
            id: i.id,
            path: 'warningType',
          }
        }
        if (i.tag === "通知策略") {
          return {
            name: i.name,
            id: i.id,
            path: 'informStrategy',
          }
        }
        if (i.tag === "告警规则") {
          return {
            name: i.name,
            id: i.id,
            path: 'warningRule',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'gaojing',
        path: 'warning',
        children: [...newChild]
      }
    }
    if (o.tag === '安全审计') {
      let child = children.map(i => {

        if (i.tag === "审计查询") {
          return {
            name: i.name,
            id: i.id,
            path: 'auditQuery',
          }
        }
        if (i.tag === "审计类型") {
          return {
            name: i.name,
            id: i.id,
            path: 'auditType',
          }
        }

      })
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'anquan',
        path: 'securityAudit',
        children: [...newChild]
      }
    }
    if (o.tag === '平台运维') {
      let child = children.map(i => {
        if (i.tag === "配置管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'configManage',
          }
        }
        if (i.tag === "实例管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'demoManage',
          }
        }
        if (i.tag === "服务实例") {
          return {
            name: i.name,
            id: i.id,
            path: 'serviceDemo',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.name,
        id: o.id,
        icon: 'pingtai',
        path: 'platformOperation',
        children: [...newChild]
      }
    }
    if (o.tag === 'MenuDataSti') {
      let child = children.map(i => {
        if (i.tag === "DataSti") {
          return {
            name: i.name,
            id: i.id,
            path: 'dataSti',
          }
        }
        if (i.tag === "ChildService") {
          return {
            name: i.name,
            id: i.id,
            path: 'childService',
          }
        }
        if (i.tag === "DataTable") {
          return {
            name: i.name,
            id: i.id,
            path: 'dataTable',
          }
        }
        // if (i.tag === "ScriptManage") {
        //   return {
        //     name: i.name,
        //     id: i.id,
        //     path: 'scriptManage',
        //   }
        // }
      });
      let newChild = child.filter(item => item);
      return {
        name: o.name,
        id: o.id,
        icon: 'tongji',
        path: 'menuDataSti',
        children: [...newChild]
      }
    }
    if (o.tag === 'FirmwareUpdate') {
      let child = children.map(i => {
        if (i.tag === "HardwareUpdate") {
          return {
            name: i.name,
            id: i.id,
            path: 'hardwareUpdate',
          }
        }
        if (i.tag === "HardwareUpdateBag") {
          return {
            name: i.name,
            id: i.id,
            path: 'hardwareUpdateBag',
          }
        }
        if (i.tag === "APPUpdateBag") {
          return {
            name: i.name,
            id: i.id,
            path: 'appUpdateBag',
          }
        }

      })
      let newChild = child.filter(item => item);
      return {
        name: o.name,
        id: o.id,
        icon: 'gujian',
        path: 'firmwareUpdate',
        children: [...newChild]
      }
    }


    return {
      name: o.name,
      id: o.id,
      tag: o.tag,
      //icon:'yonghu',
      path: '',
      //children:[...children]
    }
  });
  let index = {
    name: <span>首&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;页</span>,
    icon:'tianchongxing-',
    path:"index"
  }
  menuData.unshift(index);

  return menuData
}

export function menuEngDataList(menu) {
  if (!menu || menu.length === 0) {
    return [];
  }
  let menuData = menu.map(o => {
    const children = menuEngDataList(o.children);
    if (o.tag === '用户管理') {
      let child = children.map(i => {
        if (i.tag === "租户类别") {
          return {
            name: i.name,
            id: i.id,
            path: 'tenantType',
          }
        }
        if (i.tag === "租户管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'tenantManage',
          }
        }
        if (i.tag === "组织机构") {
          return {
            name: i.name,
            id: i.id,
            path: 'organization',
          }
        }
        if (i.tag === "平台管理员") {
          return {
            name: i.name,
            id: i.id,
            path: 'platManager',
          }
        }
      })
      let newChild = child.filter(item => item);
      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'yonghu',
        path: 'customer',
        children: [...newChild]
      }
    }
    if (o.tag === '权限管理') {
      let child = children.map(i => {
        if (i.tag === "接口管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'apiManage',
          }
        }
        if (i.tag === "菜单管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'menuManage',
          }
        }
        if (i.tag === "角色管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'roleManage',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'quanxian',
        path: 'permissions',
        children: [...newChild]
      }
    }
    if (o.tag === '应用管理') {
      let child = children.map(i => {
        if (i.tag === "应用列表") {
          return {
            name: i.name,
            id: i.id,
            path: 'userApplication',
          }
        }
        if (i.tag === "终端用户") {
          return {
            name: i.name,
            id: i.id,
            path: 'terminalCustomer',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'yingyong',
        path: 'application',
        children: [...newChild]
      }
    }
    if (o.tag === '设备管理') {
      let child = children.map(i => {
        if (i.tag === "适配管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'adapterManage',
          }
        }
        if (i.tag === "设备类型") {
          return {
            name: i.name,
            id: i.id,
            path: 'equipmentType',
          }
        }
        if (i.tag === "设备管理S") {
          return {
            name: i.name,
            id: i.id,
            path: 'equipmentManage',
          }
        }
        if (i.tag === "数据管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'dataManage',
          }
        }
        // if (i.tag === "组件管理") {
        //   return {
        //     name: i.name,
        //     id: i.id,
        //     path: 'componentManage',
        //   }
        // }
        if (i.tag === "规则管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'ruleManage',
          }
        }
        if (i.tag === "插件管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'plugManage',
          }
        }
        // if (i.name === "日志管理") {
        //   return {
        //     name: i.name,
        //     id: i.id,
        //     path: 'logManage',
        //   }
        // }
        if(i.tag==='type_manage'){
          return {
            name: i.name,
            id: i.id,
            path: 'typeManage',
          }
        }
      });
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'shebei',
        path: 'equipment',
        children: [...newChild]
      }
    }
    if (o.tag === '支付管理') {
      let child = children.map(i => {
        if (i.tag === "应用列表") {
          return {
            name: i.name,
            id: i.id,
            path: 'applicationList',
          }
        }
        if (i.tag === "订单管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'orderManage',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'zhifu',
        path: 'payManage',
        children: [...newChild]
      }
    }
    if (o.tag === '消息推送') {
      let child = children.map(i => {
        if (i.tag === "租户管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgTenant',
          }
        }
        if (i.tag === "应用管理msg") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgApplication',
          }
        }
        if (i.tag === "短信服务管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgService',
          }
        }
        if (i.tag === "消息管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'msgManage',
          }
        }
      });
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'xiaoxi',
        path: 'beingPushed',
        children: [...newChild]
      }
    }
    if (o.tag === '地理位置') {
      let child = children.map(i => {

        if (i.tag === "国家信息") {
          return {
            name: i.name,
            id: i.id,
            path: 'countriesInfo',
          }
        }
        if (i.tag === "行政区域") {
          return {
            name: i.name,
            id: i.id,
            path: 'administrativeAreas',
          }
        }
      })
      let newChild = child.filter(item => item);
      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'weizhi',
        path: 'position',
        children: [...newChild]
      }
    }
    if (o.tag === '告警管理') {
      let child = children.map(i => {
        if (i.tag === "告警列表") {
          return {
            name: i.name,
            id: i.id,
            path: 'warningList',
          }
        }
        if (i.tag === "服务配置") {
          return {
            name: i.name,
            id: i.id,
            path: 'serviceConfig',
          }
        }
        if (i.tag === "告警类型") {
          return {
            name: i.name,
            id: i.id,
            path: 'warningType',
          }
        }
        if (i.tag === "通知策略") {
          return {
            name: i.name,
            id: i.id,
            path: 'informStrategy',
          }
        }
        if (i.tag === "告警规则") {
          return {
            name: i.name,
            id: i.id,
            path: 'warningRule',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'gaojing',
        path: 'warning',
        children: [...newChild]
      }
    }
    if (o.tag === '安全审计') {
      let child = children.map(i => {

        if (i.tag === "审计查询") {
          return {
            name: i.name,
            id: i.id,
            path: 'auditQuery',
          }
        }
        if (i.tag === "审计类型") {
          return {
            name: i.name,
            id: i.id,
            path: 'auditType',
          }
        }

      })
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'anquan',
        path: 'securityAudit',
        children: [...newChild]
      }
    }
    if (o.tag === '平台运维') {
      let child = children.map(i => {
        if (i.tag === "配置管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'configManage',
          }
        }
        if (i.tag === "实例管理") {
          return {
            name: i.name,
            id: i.id,
            path: 'demoManage',
          }
        }
        if (i.tag === "服务实例") {
          return {
            name: i.name,
            id: i.id,
            path: 'serviceDemo',
          }
        }
      })
      let newChild = child.filter(item => item);

      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'pingtai',
        path: 'platformOperation',
        children: [...newChild]
      }
    }
    if (o.tag === 'MenuDataSti') {
      let child = children.map(i => {
        if (i.tag === "DataSti") {
          return {
            name: i.name,
            id: i.id,
            path: 'dataSti',
          }
        }
        if (i.tag === "ChildService") {
          return {
            name: i.name,
            id: i.id,
            path: 'childService',
          }
        }
        if (i.tag === "DataTable") {
          return {
            name: i.name,
            id: i.id,
            path: 'dataTable',
          }
        }
        // if (i.tag === "ScriptManage") {
        //   return {
        //     name: i.name,
        //     id: i.id,
        //     path: 'scriptManage',
        //   }
        // }
      });
      let newChild = child.filter(item => item);
      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'tongji',
        path: 'menuDataSti',
        children: [...newChild]
      }
    }
    if (o.tag === 'FirmwareUpdate') {
      let child = children.map(i => {
        if (i.tag === "HardwareUpdate") {
          return {
            name: i.name,
            id: i.id,
            path: 'hardwareUpdate',
          }
        }
        if (i.tag === "HardwareUpdateBag") {
          return {
            name: i.name,
            id: i.id,
            path: 'hardwareUpdateBag',
          }
        }
        if (i.tag === "APPUpdateBag") {
          return {
            name: i.name,
            id: i.id,
            path: 'appUpdateBag',
          }
        }

      })
      let newChild = child.filter(item => item);
      return {
        name: o.englishName?o.englishName:o.name,
        id: o.id,
        icon: 'gujian',
        path: 'firmwareUpdate',
        children: [...newChild]
      }
    }
    return {
      name: o.englishName?o.englishName:o.name,
      id: o.id,
      tag: o.tag,
      path: '',
    }
  });

  let index = {
    name:'Home Page',
    icon:'tianchongxing-',
    path:"index"
  }
  menuData.unshift(index);

  return menuData
}




export function getLoginUserType() {
  const type = JSON.parse(localStorage.getItem('config_userInfo')).value.type;
  return type;
}
export function getLoginUserInfo() {
  const info = JSON.parse(localStorage.getItem('config_userInfo')).value.appId?JSON.parse(localStorage.getItem('config_userInfo')).value.appId:JSON.parse(localStorage.getItem('config_userInfo')).value.tenantId;
  return info;
}


export function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let {path} = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export function isInArray(arr, val) {
  let testStr = ',' + arr.join(",") + ",";
  return testStr.indexOf("," + val + ",") != -1;
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function dateFormat(time, fmt = 'yyyy/MM/dd hh:mm:ss') {
  if (!time) {
    return;
  }
  const date = new Date(time);
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
}

export function treeDateLoad(unitTree, newTree, id) {
  return unitTree.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        children: newTree,
        //isLeaf:true?false:false,
      }
    } else if (item.children) {
      const children = treeDateLoad(item.children, newTree, id);
      return ({
        ...item,
        children: children,
      });
    } else {
      return item
    }
  })
}

//模糊查询
export function selectData(data, keyWord) {
  if (!keyWord) {
    return data;
  }
  let len = data.length;
  let arr = [];
  for (let i = 0; i < len; i++) {
    //如果字符串中不包含目标字符会返回-1
    if (data[i].name.indexOf(keyWord) >= 0 || data[i].complexName.indexOf(keyWord) >= 0) {
      arr.push(data[i]);
    }
  }
  return arr;
}

export function formatChartData(data) {
  if(data.length===0||!data){
    return [];
  }
  let formatData = data.map((item)=>{
    let year = item.year;
    let month = item.month&&item.month<10?'0'+item.month:item.month;
    let day = item.day&&item.day<10?'0'+item.day:item.day;
    let date = month&&day?year+'-'+month+'-'+day:month&&!day?year+'-'+month:year+'年';
    return {
      acc:item.count,
      date:date,
    }
  })
  return formatData
}

export function formatTenantTableData(data) {
  if(data.length===0||!data){
    return [];
  }
  let formatData = data.map((item)=>{
    return {
      acc:item.count,
      name:item.tenantName,
    }
  })
  return formatData
}

export function formatAPPTableData(data) {
  if(data.length===0||!data){
    return [];
  }
  let formatData = data.map((item)=>{
    return {
      acc:item.count,
      name:item.appName,
    }
  })
  return formatData
}

export function formatStructure(obj){
  // let testObj = {
  //   1: { id: 1, pid: 0, name: "1" },
  //   2: { id: 2, pid: 0, name: "2" },
  //   3: { id: 3, pid: 1, name: "3" },
  //   4: { id: 4, pid: 2, name: "4" },
  //   5: { id: 5, pid: 1, name: "5" },
  //   6: { id: 6, pid: 3, name: "6" }
  // };

  //function parse(obj) {
    let result = [];
    let item;

    for (let i in obj) {
      item = obj[i];

      // 检查父亲节点是否存在，不存在则创建一个空的
      if (!result[item.pid]) {
        result[item.pid] = { childFields: [] };
      }
      // 将当前元素放到父节点的structure中
      result[item.pid].childFields.push(item);


      // 检查当前节点是否存在，不存在则将当前元素放入，并初始化一个空的structure
      if (!result[item.uid]) {
        item.childFields = [];
        result[item.uid] = item;
      } else {
        // 当前节点存在，将当前元素放入属性拷贝进去即可
        result[item.uid] = Object.assign(result[item.uid], item);
      }
    }
    return result

}


export function formatMenuId(data){
  return data.map(o=>{
    if(o.children.length>0){
      const menuChildId =  formatMenuId(o.children);
      return {id:o.id,childId:menuChildId}
    }else{
      return o.id
    }
  })
}

export function formatCheckedMenuIds(menuId,checkedKeys){
  return menuId.map(o=>{
    if(checkedKeys.includes(o.id)){
      let menuChildIds = o.childId.map(i=>{
        return i
      })
      let checkedMenuKeys;
      checkedMenuKeys = menuChildIds.concat(checkedKeys)
      return checkedMenuKeys
    }else {
      return checkedKeys
    }
  })
}

export function delArray(arr,unCheckedKey) {
  if(unCheckedKey){
    arr.splice(arr.findIndex(item => {
      item === unCheckedKey;
    }), 1)
    return arr
  }else{
    return arr
  }

}


export function getInervalHour(endDate,startDate ) {
  let ms = endDate.getTime() - startDate.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms/1000/60/60);
}

export function regUrl(url) {
  let pattern = /^\/userservice\/api\/login.*/;
  let myreg= new RegExp(pattern);
  if (!myreg.test(url)) {
    return false;
  } else {
    return true;
  }
}

export function formatParams(list,params) {
  return {
    ...params,
    start:list.length===1&&params.start-10>=0?params.start-10:params.start
  }
}

export function formatParamsRowKeys(list,params,selectedRowKeys) {
  return {
    ...params,
    start:list.length===selectedRowKeys.length&&params.start>0?params.start-10:params.start
  }
}


export function readTextFile(filename) {
  let fso = new ActiveXObject("Scripting.FileSystemObject");
  let f = fso.OpenTextFile(filename,1);
  let s = "";
  while (!f.AtEndOfStream)
    s += f.ReadLine()+"\n";
  f.Close();
  return s;
}



window.treeUtil = {
  childrenTag: 'children',
  keyMap: {id: 'id', parentId: 'parentId'},
  toSingle: function (obj) {
    if (obj instanceof Array) {
      let result = [];
      for (let i in obj) {
        result.push(obj[i]);
        if (obj[i][this.childrenTag]) {
          result = result.concat(this.toSingle(obj[i][this.childrenTag]));
          delete obj[i][this.childrenTag];
        }
      }
      return result;
    } else if (obj instanceof Object) {
      return obj;
    } else {
      throw Error('It not is a Array or Object.');
    }
  },
  toList: function (arr) {
    // 查询根节点
    let temp = this.findRootList(arr);
    return this.findChildList(temp.rootNds, temp.otherNds);
  },
  findChildList: function (rootNds, childNds) {
    for (let i in rootNds) {
      let recordIndex = [];
      rootNds[i][this.childrenTag] = [];
      for (let j in childNds) {
        if (childNds[j][this.keyMap.parentId] === rootNds[i][this.keyMap.id]) {
          rootNds[i][this.childrenTag].push(childNds[j]);
          recordIndex.push(j);
        }
      }
      // 尽可能的删去已经使用过的对象，用来减少递归时的循环次数。
      // 这里为了不让数组长度影响循环，从大到小遍历
      for (let k = recordIndex.length - 1; k >= 0; k--) {
        childNds.splice(recordIndex[k], 1);
      }
      if (childNds.length > 0) {
        this.findChildList(rootNds[i][this.childrenTag], childNds);
      }
    }
    return rootNds;
  },
  findRootList: function (arr) {
    let rootNds = [], otherNds = [];
    for (let i = 0; i < arr.length; i++) {
      let flag = true;
      for (let j = 0; i !== j && j < arr.length; j++) {
        if (arr[i][this.keyMap.parentId] === arr[j][this.keyMap.id]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        rootNds.push(arr[i]);
      } else {
        otherNds.push(arr[i]);
      }
    }
    return {rootNds: rootNds, otherNds: otherNds};
  }
};

export function callStatusInfo(status,props,value) {
  const {intl:{formatMessage}} = props;
  switch (status) {
    case 0:
      message.success(formatMessage(basicMessages.request_success));
      break;
    case 1001:
      message.error(formatMessage(basicMessages.request_failed));
      break;
    case 1002:
      message.error(formatMessage(basicMessages.username_password_wrong));
      break;
    case 1003:
      message.error(formatMessage(basicMessages.code_wrong));
      break;
    case 1004:
      message.error(formatMessage(basicMessages.parameter_error));
      break;
    case 1005:
      message.error(formatMessage(basicMessages.token_expired));
      break;
    case 1006:
      message.error(formatMessage(basicMessages.authorization_error));
      break;
    case 1007:
      message.error(formatMessage(basicMessages.upload_failed));
      break;
    case 1008:
      message.error(formatMessage(basicMessages.download_failed));
      break;
    case 1009:
      message.error(formatMessage(basicMessages.no_empty,{key:value[0]}));
      break;
    case 1010:
      message.error(formatMessage(basicMessages.already_exists,{key:value[0]}));
      break;
    case 1011:
      message.error(formatMessage(basicMessages.data_already_exists));
      break;
    case 1012:
      message.error(formatMessage(basicMessages.date_no_found));
      break;
    case 1013:
      message.error(formatMessage(basicMessages.no_delete));
      break;
    case 1014:
      message.error(formatMessage(basicMessages.import_error,{key1:value[0],key2:value[1]}));
      break;
    case 1015:
      message.error(formatMessage(basicMessages.file_big));
      break;
    case 1017:
      message.error(formatMessage(basicMessages.params_error,{key:value[0]}));
      break;
    case 401:
      message.error(formatMessage(basicMessages.authentication_failed));
      break;
    default:
  }
}
