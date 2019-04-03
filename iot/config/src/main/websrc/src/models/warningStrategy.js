import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {

  //warning strategy
  warningStrategyList,
  addWarningStrategyList,
  updWarningStrategyList,
  delWarningStrategyList,


} from '../services/warning';
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'warningStrategy',

  state:{
    warningStrategyList:{},
    warningStrategy_params:{
      count:count,
      start:start,
    },

  },

  effects:{
    * fetch_warningStrategyList_action({payload},{call,put}){
      const response = yield call(warningStrategyList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warningStrategyListResult',
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

    * fetch_addWarningStrategyList_action({payload},{call,put}){
      const response = yield call(addWarningStrategyList,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updWarningStrategyList_action({payload},{call,put,select}){
      const response = yield call(updWarningStrategyList,payload);
      const params = yield select(state=>state.warningStrategy.warningStrategy_params)
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_warningStrategyList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delWarningStrategyList_action({payload,params},{call,put}){
      const response = yield call(delWarningStrategyList,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_warningStrategyList_action',
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
    warningStrategyListResult(state,{payload}){
      return{
        ...state,
        warningStrategyList:payload.response,
        warningStrategy_params:payload.params
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        warningStrategyList:{},
        warningStrategy_params:{
          count:count,
          start:start,
        },
      }
    }
  },
}
