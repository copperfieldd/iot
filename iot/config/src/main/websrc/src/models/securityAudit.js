import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {getTypeList,delType,updType,typeItem,addType,auditQuery,exportExcl} from '../services/securityAudit';
import {count, start, bigCount, ExcelDownload, callStatusInfo} from "../utils/utils";
import {dataExport} from "../services/equipment";

export default {
  namespace:'securityAudit',


  state:{
    typeList_params:{
      start:start,
      count:count,
    },
    typeList:{

    },
    typeItemResult:{

    },

    auditQueryList:{},
    auditQuery_params:{
      start:start,
      count:count,
    }
  },

  effects:{
    * fetch_getTypeList_action({payload},{call,put}){
      const response = yield call(getTypeList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'typeListResult',
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

    * fetch_delType_action({payload,params},{call,put}){
      const response = yield call(delType,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getTypeList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updType_action({payload},{call,put,select}){
      const response = yield call(updType,payload);
      const params = yield select(state=>state.securityAudit.typeList_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getTypeList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addType_action({payload,callback},{call,put}){
      const response = yield call(addType,payload);
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

    * fetch_typeItem_action({payload},{call,put}){
      const response = yield call(typeItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'typeItemResult',
            payload:response.value,
            id:payload.id,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_auditQuery_action({payload},{call,put}){
      const response = yield call(auditQuery,payload);
      try {
        if(response.status===0){
          yield put({
            type:'auditQueryResult',
            payload:response.value,
            params:payload
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_exportExcl_action({payload},{call,put}){
      const response = yield call(exportExcl, payload);
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob=>{
            ExcelDownload(blob,filename);
            callback&&callback();//关闭弹窗
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    }
  },

  reducers:{
    typeListResult(state,{payload,params}){
      return{
        ...state,
        typeList:payload,
        typeList_params:params,
      }
    },
    typeItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      };
      return{
        ...state,
        typeItems:{
          ...state.typeItems,
          ...item,
        }
      }
    },
    auditQueryResult(state,{payload,params}){
      return{
        ...state,
        auditQueryList:payload,
        auditQuery_params:params,
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        typeList_params:{
          start:start,
          count:count,
        },
        typeList:{

        },
        typeItemResult:{

        },

        auditQueryList:{},
        auditQuery_params:{
          start:start,
          count:count,
        }
      }
    }
  },
}
