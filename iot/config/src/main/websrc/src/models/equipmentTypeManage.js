import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {addFirstType,getFirstTypeList,addSecondType,getSecondType,getSecondTypeItem,editSecondType,delSecondType,getFirstType,editFirstType,delFirstType} from '../services/equipment'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'equipmentTypeManage',


  state:{
    getFirstTypeList:[],
    getFirstTypeList_params:{
      start:start,
      count:count,
    },
    getFirstTypeHasMore:true,

    getSecondTypeList:[],
    getSecondTypeList_params:{
      start:start,
      count:count,
    },
    getSecondTypeHasMore:true,

    getSecondType:{

    },
    getSecondType_params:{
      start:start,
      count:count,
    },
    getSecondTypeItem:{

    },

    getFirstType:{},
    getFirstType_params:{
      start:start,
      count:count,
    }
  },

  effects:{
    //类别管理下拉加载列表
    * fetch_getFirstType_list_action({payload,isSearch,callBack},{call,put,select}){
      let getFirstTypeHasMore = true;
      const response = yield call(getFirstTypeList,payload);
      const stateValue = yield select(state=>state.equipmentTypeManage.getFirstTypeList);
      console.log(stateValue)
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            getFirstTypeHasMore = false;
            //message.warning('数据加载完毕');
          }else{
            getFirstTypeHasMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'getFirstTypeListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              getFirstTypeHasMore:getFirstTypeHasMore,
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getSecondType_list_action({payload,isSearch,callBack},{call,put}){
      let getSecondTypeHasMore = true;
      const response = yield call(getSecondType,payload);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            getSecondTypeHasMore = false;
            //message.warning('数据加载完毕');
          }else{
            getSecondTypeHasMore = true;
          }
          yield put({
            type:'getSecondTypeListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              getSecondTypeHasMore:getSecondTypeHasMore,
              callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getFirstType_action({payload},{call,put}){
      const response = yield call(getFirstType,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getFirstType',
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

    * fetch_addFirstType_action({payload,callback},{call,put}){
      const response = yield call(addFirstType,payload);
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

    * fetch_editFirstType_action({payload},{call,put,select}){
      const response = yield call(editFirstType,payload);
      const params = yield select(state=>state.equipmentTypeManage.getFirstTypeList_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getFirstType_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delFirstType_action({payload,params},{call,put}){
      const response = yield call(delFirstType,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getFirstType_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addSecondType_action({payload,callback},{call,put}){
      const response = yield call(addSecondType,payload);
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

    * fetch_getSecondType_action({payload,callback},{call,put}){
      const response = yield call(getSecondType,payload);
      try {
       if(response.status===0){
        yield put({
          type:'getSecondType',
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

    * fetch_getSecondTypeItem_action({payload},{call,put}){
      const response = yield call(getSecondTypeItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getSecondTypeItem',
            payload:response.value,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_editSecondType_action({payload},{call,put,select}){
      const response = yield call(editSecondType,payload);
      const params = yield select(state=>state.equipmentTypeManage.getSecondType_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getSecondType_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delSecondType_action({payload,params},{call,put}){
      const response = yield call(delSecondType,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getSecondType_action',
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
    getFirstTypeListResult_list(state,{payload}){
      if(payload.isSearch){
        state.getFirstTypeList = payload.response.value;
      }else{
        state.getFirstTypeList = state.getFirstTypeList.concat(payload.response.value);
      }
      return {
        ...state,
        getFirstTypeHasMore:payload.getFirstTypeHasMore,
        getFirstTypeList_params:payload.params,
      };
    },

    getSecondTypeListResult_list(state,{payload}){
      if(payload.isSearch){
        state.getSecondTypeList = payload.response.value;
        payload.callBack(state.getSecondTypeList);
      }else{
        state.getSecondTypeList = state.getSecondTypeList.concat(payload.response.value);
        payload.callBack(state.getSecondTypeList);
      }
      return {
        ...state,
        getSecondTypeHasMore:payload.getSecondTypeHasMore,
        getSecondTypeList_params:payload.params,
      };
    },

    getSecondType(state,{payload,params}){
      return{
        ...state,
        getSecondType:payload,
        getSecondType_params:params,
      }
    },

    getSecondTypeItem(state,{payload}){
      return{
        ...state,
        getSecondTypeItem:payload,
      }
    },

    getFirstType(state,{payload,params}){
      return{
        ...state,
        getFirstType:payload,
        getFirstType_params:params,
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        getFirstTypeList:[],
        getFirstTypeList_params:{
          start:start,
          count:count,
        },
        getFirstTypeHasMore:true,

        getSecondTypeList:[],
        getSecondTypeList_params:{
          start:start,
          count:count,
        },
        getSecondTypeHasMore:true,

        getSecondType:{

        },
        getSecondType_params:{
          start:start,
          count:count,
        },
        getSecondTypeItem:{

        },

        getFirstType:{},
        getFirstType_params:{
          start:start,
          count:count,
        }
      }
    }
  },
}
