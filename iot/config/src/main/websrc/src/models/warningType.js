import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  //warning type
  warningTypeList,
  addWarningTypeList,
  updWarningTypeList,
  delWarningTypeList,


} from '../services/warning';
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'warningType',

  state:{
    warningTypeList:{},
    warningType_params:{
      count:count,
      start:start,
    },
  },

  effects: {
    * fetch_warningTypeList_action({payload}, {call, put}) {
      const response = yield call(warningTypeList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'warningTypeListResult',
            payload: {
              response: response.value,
              params: payload,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_addWarningTypeList_action({payload,callback}, {call, put}) {
      const response = yield call(addWarningTypeList, payload);
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

    * fetch_updWarningTypeList_action({payload}, {call, put, select}) {
      const response = yield call(updWarningTypeList, payload);
      const params = yield select(state=>state.warningType.warningType_params);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_warningTypeList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delWarningTypeList_action({payload, params}, {call, put}) {
      const response = yield call(delWarningTypeList, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_warningTypeList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
  },

  reducers:{
    warningTypeListResult(state,{payload}){
      return{
        ...state,
        warningTypeList:payload.response,
        warningType_params:payload.params,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        warningTypeList:{},
        warningType_params:{
          count:count,
          start:start,
        },
      }
    }
  },
}
