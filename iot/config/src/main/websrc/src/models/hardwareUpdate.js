import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {count, start} from "../utils/utils";
import {
  getUpgradeList,
  getUpgradeSti,
  getHistoryList,
  getTenantItem,
  getApplicationItem,
  addUpgrade,
  getDeviceModalList,
  getAddDutyBag,
  addUpdateDuty,
  addUpdateTimeConfig,
  addUpdateDeviceConfig,
  addUpdateVersionConfig,
  addUpdateConfig,
  getUpgradeStatistics,
  getUpgradeResult,
  getUpgradeInfo,
  getUpgradeDeviceConfigInfo,
  getUpgradeTimeConfig,
  getUpgradeVersionConfig,
  getDeviceTypeList,
  updateUpdateDuty,
  upgradeControl,
  delUpdateDuty,
  upgradeItem,
} from '../services/updateDevice'

export default {
  namespace: 'hardwareUpdate',

  state: {
    getUpgradeList:{},
    getUpgradeList_params:{
      start:start,
      count:count,
    },
    getHistoryList:{},
    getHistoryList_params:{
      start:start,
      count:count,
    },
    getUpgradeResult:{},
    getUpgradeResult_params:{
      start:start,
      count:count,
    },
    getDeviceTypeList:[],

    getTenantItem:{},
    getUpgradeSti:{},
    getApplicationItem:{},
    getDeviceModalList:null,
    getAddDutyBag:null,
    getUpgradeStatistics:{},
    getUpgradeInfo:{},
    getUpgradeDeviceConfigInfo:{},
    getUpgradeTimeConfig:{},
    getUpgradeVersionConfig:{},
    upgradePackageDetails:{},
    upgradePackageDetails_params:{
      start:start,
      count:count,
    },
    tabKey:'1',
  },
  effects: {
    * fetch_getUpgradeList_action({payload},{call,put}){
      const response = yield call(getUpgradeList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeList',
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


    * fetch_upgradeControl_action({payload},{call,put,select}){
      const response = yield call(upgradeControl,payload);
      let params = yield select(state=>state.hardwareUpdate.getUpgradeList_params);
      try {
        if(response.status===0){
          yield put({
            type:"fetch_getUpgradeList_action",
            payload:params
          })
          message.success(response.message)
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_delUpdateDuty_action({payload},{call,put,select}){
      const response = yield call(delUpdateDuty,payload);
      let params = yield select(state=>state.hardwareUpdate.getUpgradeList_params);
      try {
        if(response.status===0){
          yield put({
            type:"fetch_getUpgradeList_action",
            payload:params
          })
          message.success(response.message)
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_upgradeItem_action({payload},{call,put}){
      const response = yield call(upgradeItem,payload);
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


    * fetch_getUpgradeSti_action({payload},{call,put}){
      const response = yield call(getUpgradeSti,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeSti',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getHistoryList_action({payload},{call,put}){
      const response = yield call(getHistoryList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getHistoryList',
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

    * fetch_getTenantItem_action({payload},{call,put}){
      const response = yield call(getTenantItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getTenantItem',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getApplicationItem_action({payload},{call,put}){
      const response = yield call(getApplicationItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getApplicationItem',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addUpgrade_action({payload},{call,put}){
      const response = yield call(addUpgrade,payload);
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


    * fetch_getDeviceModalList_action({payload},{call,put}){
      const response = yield call(getDeviceModalList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getDeviceModalList',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getAddDutyBag_action({payload},{call,put}){
      const response = yield call(getAddDutyBag,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getAddDutyBag',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addUpdateDuty_action({payload,callback},{call,put}){
      const response = yield call(addUpdateDuty,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value.id)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_updateUpdateDuty_action({payload,callback},{call,put}){
      const response = yield call(updateUpdateDuty,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addUpdateTimeConfig_action({payload},{call,put}){
      const response = yield call(addUpdateTimeConfig,payload);
      try {
        if(response.status===0){
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },


    * fetch_addUpdateDeviceConfig_action({payload},{call,put}){
      const response = yield call(addUpdateDeviceConfig,payload);
      try {
        if(response.status===0){
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addUpdateVersionConfig_action({payload},{call,put}){
      const response = yield call(addUpdateVersionConfig,payload);
      try {
        if(response.status===0){
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addUpdateConfig_action({payload},{call,put}){
      const response = yield call(addUpdateConfig,payload);
      try {
        if(response.status===0){
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getUpgradeStatistics_action({payload},{call,put}){
      const response = yield call(getUpgradeStatistics,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeStatistics',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getUpgradeResult_action({payload},{call,put}){
      const response = yield call(getUpgradeResult,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeResult',
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

    * fetch_getUpgradeInfo_action({payload},{call,put}){
      const response = yield call(getUpgradeInfo,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeInfo',
            payload:response.value,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getUpgradeDeviceConfigInfo_action({payload,callback},{call,put}){
      const response = yield call(getUpgradeDeviceConfigInfo,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeDeviceConfigInfo',
            payload:response.value
          });
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getUpgradeTimeConfig_action({payload,callback},{call,put}){
      const response = yield call(getUpgradeTimeConfig,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeTimeConfig',
            payload:response.value,
          });
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getUpgradeVersionConfig_action({payload,callback},{call,put}){
      const response = yield call(getUpgradeVersionConfig,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUpgradeVersionConfig',
            payload:response.value
          })
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_getDeviceTypeList_action({payload},{call,put}){
      const response = yield call(getDeviceTypeList,payload);
      try {
        if(response.status===0){
          yield put({
            type:"getDeviceTypeList",
            payload:response.value.value,
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
    change_tabKey(state,{payload}){
      return{
        ...state,
        tabKey:payload,
      }
    },

    getUpgradeList(state,{payload,params}){
      return{
        ...state,
        getUpgradeList:payload,
        getUpgradeList_params:params
      }
    },

    getUpgradeSti(state,{payload}){
      return{
        ...state,
        getUpgradeSti:payload,
      }
    },

    upgradePackageDetails(state,{payload,params}){
      return{
        ...state,
        upgradePackageDetails:payload,
        upgradePackageDetails_params:params
      }
    },


    getHistoryList(state,{payload,params}){
      return{
        ...state,
        getHistoryList:payload,
        getHistoryList_params:params,
      }
    },

    getTenantItem(state,{payload}){
      return{
        ...state,
        getTenantItem:payload,
      }
    },

    getApplicationItem(state,{payload}){
      return{
        ...state,
        getApplicationItem:payload,
      }
    },

    getDeviceModalList(state,{payload}){
      return{
        ...state,
        getDeviceModalList:payload,
      }
    },
    getAddDutyBag(state,{payload}){
      return{
        ...state,
        getAddDutyBag:payload
      }
    },

    getUpgradeStatistics(state,{payload}){
      return{
        ...state,
        getUpgradeStatistics:payload,
      }
    },
    getUpgradeResult(state,{payload,params}){
      return{
        ...state,
        getUpgradeResult:payload,
        getUpgradeResult_params:params,
      }
    },

    getUpgradeInfo(state,{payload}){
      return{
        ...state,
        getUpgradeInfo:payload,
      }
    },

    getUpgradeDeviceConfigInfo(state,{payload}){
      return{
        ...state,
        getUpgradeDeviceConfigInfo:payload,
      }
    },

    getUpgradeTimeConfig(state,{payload}){
      return{
        ...state,
        getUpgradeTimeConfig:payload,
      }
    },
    getUpgradeVersionConfig(state,{payload}){
      return{
        ...state,
        getUpgradeVersionConfig:payload,
      }
    },

    getDeviceTypeList(state,{payload}){
      return{
        ...state,
        getDeviceTypeList:payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        getUpgradeList:{},
        getUpgradeList_params:{
          start:start,
          count:count,
        },
        getHistoryList:{},
        getHistoryList_params:{
          start:start,
          count:count,
        },
        getUpgradeResult:{},
        getUpgradeResult_params:{
          start:start,
          count:count,
        },

        getTenantItem:{},
        getUpgradeSti:{},
        getApplicationItem:{},
        tabKey:'1',
      }
    }
  },
};
