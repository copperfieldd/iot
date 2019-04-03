import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  orderList,
  orderItem,
  applicationList,
  addApplication,
  updApplication,
  delApplication,
  updApplicationStatus,
  getSecretKey,
  applicationItem,
} from '../services/payManage';
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'payManage',

  state:{
    order_params:{
      start:start,
      count:count,
    },
    orderList:{

    },

    orderItems:{},

    applicationList:{},
    application_params:{
      start:start,
      count:count,
    },

    applicationItems:{}
  },

  effects:{
    * fetch_orderList_action({payload},{call,put}){
      const response = yield call(orderList,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'orderListResult',
            payload:response.value,
            params:payload,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_orderItem_action({payload},{call,put}){
      const response = yield call(orderItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'orderItemResult',
            payload:response.value,
            orderSn:payload.orderSn
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_applicationList_action({payload},{call,put}){
      const response = yield call(applicationList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationListResult',
            payload:response.value,
            params:payload,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addApplication_action({payload,callback},{call,put}){
      const response = yield call(addApplication,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_updApplication_action({payload},{call,put,select}){
      const response = yield call(updApplication,payload);
      const params = yield select(state=>state.payManage.application_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_applicationList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delApplication_action({payload,params},{call,put}){
      const response = yield call(delApplication,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_applicationList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updApplicationStatus_action({payload,params},{call,put}){
      const response = yield call(updApplicationStatus,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_applicationList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_getSecretKey_action({payload,callback},{call,put}){
      const response = yield call(getSecretKey,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_applicationItem_action({payload},{call,put}){
      const response = yield call(applicationItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationItemResult',
            payload:response.value,
            appId:payload.appId,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    }
  },

  reducers: {
    orderListResult(state, {payload, params}) {
      return {
        ...state,
        order_params: params,
        orderList: payload,

      }
    },
    orderItemResult(state,{payload,orderSn}) {
      let item = {
        [orderSn]: {...payload}
      };
      return{
        ...state,
        orderItems:{
          ...state.orderItems,
          ...item,
        }
      }
    },

    applicationListResult(state,{payload,params}){
       return{
         ...state,
         applicationList:payload,
         application_params:params,
       }
    },

    applicationItemResult(state,{payload,appId}){
      const item = {
        [appId]:{...payload},
      }
      return{
        ...state,
        applicationItems:{
          ...state.applicationItems,
          ...item,
        }
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        order_params:{
          start:start,
          count:count,
        },
        orderList:{

        },

        orderItems:{},

        applicationList:{},
        application_params:{
          start:start,
          count:count,
        },

        applicationItems:{}
      }
    }
  }
}
