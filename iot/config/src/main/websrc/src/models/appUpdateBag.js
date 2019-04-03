import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {count, start} from "../utils/utils";
import {getUpgradePackageApp,delHardwarePackage} from '../services/updateDevice';


export default {
  namespace: 'appUpdateBag',

  state: {
    getUpgradePackageApp:{},
    getUpgradePackageApp_params:{
      start:start,
      count:count,
      type:1
    },
  },

  effects: {
    * fetch_getUpgradePackageApp_action({payload},{call,put}){
      const response = yield call(getUpgradePackageApp,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradePackageApp',
            payload:response.value,
            params:payload,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_delHardwarePackage_action({payload,params},{call,put}){
      const response = yield call(delHardwarePackage,payload);
      try {
        if(response.status===0){
          message.success(response.message)
          yield put({
            type:'fetch_getUpgradePackageApp_action',
            payload:params
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    }
  },

  reducers: {
    getUpgradePackageApp(state,{payload,params}){
      return{
        ...state,
        getUpgradePackageApp:payload,
        getUpgradePackageApp_params:params,
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        getUpgradePackageApp:{},
        getUpgradePackageApp_params:{
          start:start,
          count:count,
          type:1
        },
      }
    }
  },
};
