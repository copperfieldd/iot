import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {getPlatMangerList,deletePlateManager,addPlatManager,updPlatManager} from '../services/customer';
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'platManage',


  state:{
    platManagerList:{},
    platManager_params:{
      start:start,
      count:count,
    }
  },

  effects:{
    * fetch_getPlatMangerList_action({payload},{call,put}){
      const response = yield call(getPlatMangerList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'platManagerListResult',
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

    * fetch_deletePlateManager_action({payload,params},{call,put}){
      const response = yield call(deletePlateManager,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getPlatMangerList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updPlatManager_action({payload},{call,put,select}){
      const response = yield call(updPlatManager,payload);
      const params = yield select(state=>state.platManage.platManager_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getPlatMangerList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_addPlatManager_action({payload,callback},{call,put}){
      const response = yield call(addPlatManager,payload);
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
  },

  reducers:{
    platManagerListResult(state,{payload,params}){
      return{
        ...state,
        platManagerList:payload,
        platManager_params:params,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        platManagerList:{},
        platManager_params:{
          start:start,
          count:count,
        }
      }
    }
  },
}
