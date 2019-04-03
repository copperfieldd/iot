import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {adapterList,addAdpater,updAdpater,adapterItem,delAdapter} from '../services/equipment'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'equipmentAdapter',


  state:{
    adapterList:{},
    adapter_params:{
      start:start,
      count:count,
    },
    adapterItems:{

    },

  },

  effects:{
    * fetch_adapterList_action({payload},{call,put}){
      const response = yield call(adapterList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'adapterListResult',
            payload:{
              response:response.value,
              params:payload,
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addAdpater_action({payload,callback},{call,put}){
      const response = yield call(addAdpater,payload);
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

    * fetch_updAdpater_action({payload},{call,put,select}){
      const response = yield call(updAdpater,payload);
      const params  = yield select(state=>state.equipmentAdapter.adapter_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_adapterList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_adapterItem_action({payload},{call,put}){
      const response = yield call(adapterItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'adapterItemResult',
            payload:response.value,
            id:payload.id
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delAdapter_action({payload,params},{call,put}){
      const response = yield call(delAdapter,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_adapterList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
  },

  reducers:{
    adapterListResult(state,{payload}){
      return{
        ...state,
        adapterList:payload.response,
        adapter_params:payload.params,
      }
    },
    adapterItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload},
      };
      return{
        ...state,
        adapterItems:{
          ...state.adapterItems,
          ...item,
        }
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        adapterList:{},
        adapter_params:{
          start:start,
          count:count,
        },
        adapterItems:{

        },

      }
    }
  },
}
