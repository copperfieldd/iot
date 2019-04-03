import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  ruleList,
  addRule,
  updRule,
  delRule,
  ruleItem, componentPullList,getFilterConfig,
} from '../services/equipment';
import {callStatusInfo, count, start} from "../utils/utils";


export default {
  namespace:'equipmentRule',


  state:{
    ruleList:{

    },
    ruleList_params:{
      start:start,
      count:count
    },
    ruleItems:{},


    componentPullList:[],
    componentPullList_params:{
      start:start,
      count:count,
    },
    componentPullMore:true,
  },

  effects:{
    * fetch_ruleList_action({payload},{call,put}){
      const response = yield call(ruleList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'ruleListResult',
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

    * fetch_getFilterConfig_action({payload,callback},{call,put}){
      const response = yield call(getFilterConfig,payload);
      try {
        if(response.status===0){
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

    * fetch_addRule_action({payload,callback},{call,put}){
      const response = yield call(addRule,payload);
      try {
        if(response.status === 0){
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

    * fetch_updRule_action({payload},{call,put,select}){
      const params = yield select(state=>state.equipmentRule.ruleList_params);
      const response = yield call(updRule,payload);
      try {
        if(response.status === 0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_ruleList_action',
            payload:params,
          });
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delRule_action({payload,params},{call,put}){
      const response = yield call(delRule,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'fetch_ruleList_action',
            payload:params,
          });
          callStatusInfo(response.status,window,response.value);
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_ruleItem_action({payload,callback},{call,put}) {
      const response = yield call(ruleItem, payload);
      try {
        if(response.status===0){
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type:'ruleItemsResult',
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

    //组件管理下拉加载列表
    * fetch_componentPullList_list_action({payload,isSearch,callBack},{call,put}){
      let componentPullMore = true;
      const response = yield call(componentPullList,payload);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            componentPullMore = false;
            //message.warning('数据加载完毕');
          }else{
            componentPullMore = true;
          }
          yield put({
            type:'componentPullListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              componentPullMore:componentPullMore,
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
  },

  reducers:{
    ruleListResult(state,{payload,params}){
      return{
        ...state,
        ruleList:payload,
        ruleList_params:params,
      }
    },
    ruleItemsResult(state,{payload,id}){
      const item = {
        [id]:{...payload},
      };
      return{
        ...state,
        ruleItems:{
          ...state.ruleItems,
          ...item,
        }
      }
    },
    componentPullListResult_list(state,{payload}){
      if(payload.isSearch){
        state.componentPullList = payload.response.value;
        payload.callBack(state.componentPullList);
      }else{
        state.componentPullList = state.componentPullList.concat(payload.response.value);
        payload.callBack(state.componentPullList);
      }
      return {
        ...state,
        componentPullMore:payload.componentPullMore,
        componentPullList_params:payload.params,
      };
    },

    clearCache(state,{payload}){
      return{
        ...state,
        ruleList:{

        },
        ruleList_params:{
          start:start,
          count:count
        },
        ruleItems:{},


        componentPullList:[],
        componentPullList_params:{
          start:start,
          count:count,
        },
        componentPullMore:true,
      }
    }
  },
}
