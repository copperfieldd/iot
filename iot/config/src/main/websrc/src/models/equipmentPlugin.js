import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {pluginList,addPlugin,delPlugin,pluginItem,updPlugin} from '../services/equipment';
import {callStatusInfo, count, start} from "../utils/utils";


export default {
  namespace:'equipmentPlugin',


  state:{
    pluginList:{},
    pluginList_params:{
      start:start,
      count:count,
    },
    pluginItems:{},

  },

  effects:{
    * fetch_pluginList_action({payload},{call,put}){
      const response = yield call(pluginList,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'pluginListResult',
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

    * fetch_addPlugin_action({payload,callback},{call,put}){
      const response = yield call(addPlugin,payload);
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

    * fetch_delPlugin_action({payload,params},{call,put}){
      const response = yield call(delPlugin,payload);
      try {
        if(response.status === 0){
          callStatusInfo(response.status,window,response.value);

          yield put({
            type:'fetch_pluginList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);

        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);

      }
    },

    * fetch_pluginItem_action({payload},{call,put}){
      const response = yield call(pluginItem,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'pluginItemResult',
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

    * fetch_updPlugin_action({payload},{call,put,select}){
      const response = yield call(updPlugin,payload);
      const params = yield select(state=>state.equipmentPlugin.pluginList_params);
      try {
        if(response.status === 0){
          callStatusInfo(response.status,window,response.value);

          yield put({
            type:'fetch_pluginList_action',
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
    pluginListResult(state,{payload,params}){
      return{
        ...state,
        pluginList:payload,
        pluginList_params:params,
      }
    },

    pluginItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      }

      return{
        ...state,
        pluginItems:{
          ...state.pluginItems,
          ...item,
        }
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        pluginList:{},
        pluginList_params:{
          start:start,
          count:count,
        },
        pluginItems:{},

      }
    }
  },
}
