import { message } from 'antd';
import {count, start,smallCount} from "../utils/utils";
import {
  tenantAllList,addTenantList,addTenantConfig,stopTenant,updateTenantNum,tenantItemConfig,applicationByTenant,updateTenantConfig,applicationAllList,applicationNewList,
  addApplicationConfig,applicationItemByAppId,editApplicationConfig,editApplicationNumber,changeAppStatus
} from '../services/beingPushed'


export default {
  namespace: 'msgTenant',

  state: {
    tenantList:{

    },
    tenantList_params:{
      start:start,
      count:smallCount,
    },
    tenantAllList:{},
    tenantAllList_params:{
      start:start,
      count:count,
    },

    tenantConfigItem: {

    },
    applicationByTenant:[],//租户应用信息



    applicationAllList:{},
    applicationAllList_params:{
      start:start,
      count:count,
    },
    applicationNewList:{},
    applicationNewList_params:{
      start:start,
      count:smallCount,
    },
    applicationItemByAppId:{},
  },

  effects: {
    * fetch_tenantList_action({payload},{call,put}){
      const response = yield call(addTenantList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'tenantListResult',
            payload:response.value,
            params:payload,
          })
        }
      }catch (e) {
        message.error('请求失败，请稍后再试！')
      }
    },

    * fetch_tenantAllList_action({payload},{call,put}){
      const response = yield call(tenantAllList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'tenantAllList',
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

    * fetch_addTenantConfig_action({payload,callback},{call,put}){
      const response = yield call(addTenantConfig,payload);
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

    * fetch_stopTenant_action({payload,params,callback},{call,put}){
      const response = yield call(stopTenant,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type:'fetch_tenantAllList_action',
            payload:params
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_updateTenantNum_action({payload,params,callback},{call,put}){
      const response = yield call(updateTenantNum,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          yield put({
            type:'fetch_tenantAllList_action',
            payload:params
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

    * fetch_tenantItemConfig_action({payload,callback},{call,put}){
      const response = yield call(tenantItemConfig,payload);
      try {
        if(response.status===0){
          yield put({
            type:'tenantItemConfig',
            payload:response.value
          })
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message);
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_applicationByTenant_action({payload},{call,put}){
      const response = yield call(applicationByTenant,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationByTenant',
            payload:response.value
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_updateTenantConfig_action({payload},{call,put}){
      const response = yield call(updateTenantConfig,payload);
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

    * fetch_applicationAllList_action({payload},{call,put}){
      const response = yield call(applicationAllList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationAllList',
            payload:response.value,
            params:payload
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_applicationNewList_action({payload},{call,put}){
      const response = yield call(applicationNewList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationNewList',
            payload:response.value,
            params:payload
          })
        }else{
          message.error(response.message);
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_addApplicationConfig_action({payload},{call,put}){
      const response = yield call(addApplicationConfig,payload);
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

    * fetch_applicationItemByAppId_action({payload,callback},{call,put}){
      const response = yield call(applicationItemByAppId,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationItemByAppId',
            payload:response.value,
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

    * fetch_editApplicationConfig_action({payload},{call,put}){
      const response = yield call(editApplicationConfig,payload);
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


    * fetch_editApplicationNumber_action({payload,params,callback},{call,put}){
      const response = yield call(editApplicationNumber,payload);
      try {
        if(response.status===0){
          yield put({
            type:'fetch_applicationAllList_action',
            payload:params
          })
          if(callback){
            yield call(callback,response.value)
          }
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_changeAppStatus_action({payload,params,callback},{call,put}){
      const response = yield call(changeAppStatus,payload);
      try {
        if(response.status===0){
          yield put({
            type:'fetch_applicationAllList_action',
            payload:params
          })
          if(callback){
            yield call(callback,response.value)
          }
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    }
  },

  reducers: {
    tenantListResult(state,{payload,params}){
      return{
        ...state,
        tenantList:payload,
        tenantList_params:params,
      }
    },

    tenantAllList(state,{payload,params}){
      return{
        ...state,
        tenantAllList:payload,
        tenantAllList_params:params,
      }
    },

    tenantItemConfig(state,{payload}){
      return{
        ...state,
        tenantConfigItem:payload
      }
    },

    applicationByTenant(state,{payload}){
      return{
        ...state,
        applicationByTenant:payload,
      }
    },

    applicationAllList(state,{payload,params}){
      return{
        ...state,
        applicationAllList:payload,
        applicationAllList_params:params
      }
    },


    applicationNewList(state,{payload,params}){
      return{
        ...state,
        applicationNewList:payload,
        applicationNewList_params:params
      }
    },

    applicationItemByAppId(state,{payload,params}){
      return{
        ...state,
        applicationItemByAppId:payload,
      }
    },


    clearCache(state,{payload}){
      return{
        ...state,
        tenantList:{

        },
        tenantList_params:{
          start:start,
          count:smallCount,
        },
        tenantAllList:{},
        tenantAllList_params:{
          start:start,
          count:count,
        },

        tenantConfigItem: {

        },
        applicationByTenant:[],//租户应用信息



        applicationAllList:{},
        applicationAllList_params:{
          start:start,
          count:count,
        },
        applicationNewList:{},
        applicationNewList_params:{
          start:start,
          count:smallCount,
        },
        applicationItemByAppId:{},
      }
    }

  },
};
