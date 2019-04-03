import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  /** Tenant **/
  tenantList,
  addTenant,
  editTenant,
  tenantItem,
  appListByTenant,
  delTenantList,
} from '../services/customer'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace: 'tenantManage',

  state: {

    //租户管理
    tenantList: {},
    tenant_params: {
      count: count,
      start: start,
    },

    tenantItems:{},
    appListByTenant:[],
  },

  effects: {

    //租户管理列表
    * fetch_tenantList_action({payload}, {call, put}) {
      const response = yield call(tenantList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'tenantListResult',
            payload: response.value,
            params:payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delTenantList_action({payload,params},{call,put}){
      const response = yield call(delTenantList,payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_tenantList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addTenant_action({payload,callback}, {call, put}) {
      const response = yield call(addTenant, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response.value)
          }
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_editTenant_action({payload},{call,put,select}){
      const params  = yield select(state=>state.tenantManage.tenant_params);
      const response = yield call(editTenant,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_tenantList_action",
            payload:params,
          })
        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_tenantItem_action({payload,callback},{call,put}){
      const response = yield call(tenantItem,payload);
      try {
        if(response.status===0){
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type:'tenantItemResult',
            payload:response.value,
            id:payload.id,
          })
        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_appListByTenant_action({payload},{call,put}){
      const response = yield call(appListByTenant,payload);
      try {
        if(response.status===0){
          yield put({
            type:'appListByTenantResult',
            payload:response.value,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
  },

  reducers: {
    /**
     * 租户管理
     **/
    tenantListResult(state, {payload,params}) {
      return {
        ...state,
        tenantList: payload,
        tenant_params:params,
      }
    },

    tenantItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      }
      return{
        ...state,
        tenantItems:{
          ...state.tenantItems,
          ...item,
        }
      }
    },

    appListByTenantResult(state,{payload}){
      return{
        ...state,
        appListByTenant:payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        tenantList: {},
        tenant_params: {
          count: count,
          start: start,
        },
        tenantItems:{},
        appListByTenant:[],
      }
    }
  },
}
