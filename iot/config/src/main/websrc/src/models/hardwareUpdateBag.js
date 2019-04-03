import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {count, start} from "../utils/utils";
import {getUpgradePackageHardWare,delHardwarePackage,addUpgradePackage,updUpgradePackage,upgradePackageDetails} from '../services/updateDevice'

export default {
  namespace: 'hardwareUpdateBag',

  state: {
    getUpgradePackageHardWare:{},
    getUpgradePackageHardWare_params:{
      start:start,
      count:count,
      type:0,
    },
    upgradePackageDetails:{},
    upgradePackageDetails_params:{
      start:start,
      count:count,
    }
  },

  effects: {
    * fetch_getUpgradePackageHardWare_action({payload},{call,put}){
      const response = yield call(getUpgradePackageHardWare,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradePackageHardWare',
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
          message.success(response.message);
          yield put({
            type:'fetch_getUpgradePackageHardWare_action',
            payload: params,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addUpgradePackage_action({payload},{call,put}){
      const response = yield call(addUpgradePackage,payload);
      try {
        if(response.status===0){
          message.success(response.message)
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_updUpgradePackage_action({payload},{call,put}){
      const response = yield call(updUpgradePackage,payload);
      try {
        if(response.status===0){
          message.success(response.message)
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_upgradePackageDetails_action({payload},{call,put}){
      const response = yield call(upgradePackageDetails,payload);
      try {
        if(response.status===0){
          yield put({
            type:'upgradePackageDetails',
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


  },

  reducers: {
    getUpgradePackageHardWare(state,{payload,params}){
      return{
        ...state,
        getUpgradePackageHardWare:payload,
        getUpgradePackageHardWare_params:params
      }
    },

    upgradePackageDetails(state,{payload,params}){
      return{
        ...state,
        upgradePackageDetails:payload,
        upgradePackageDetails_params:params
      }
    },



    clearCache(state,{payload}){
      return{
        ...state,
        getUpgradePackageHardWare:{},
        upgradePackageDetails:{},
        upgradePackageDetails_params:{},
        getUpgradePackageHardWare_params:{
          start:start,
          count:count,
          type:0,
        },
      }
    }
  },
};
