import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {

  //warning service
  warningServiceList,
  addWarningService,
  updWarningService,
  delWarningService,

} from '../services/warning';
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'warningService',

  state:{
    warningServiceList:{},
    warningService_params:{
      count:count,
      start:start,
    },
  },

  effects: {
    * fetch_warningServiceList_action({payload}, {call, put}) {
      const response = yield call(warningServiceList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'warningServiceListResult',
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

    * fetch_addWarningService_action({payload}, {call, put}) {
      const response = yield call(addWarningService, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updWarningService_action({payload}, {call, put,select}) {
      const response = yield call(updWarningService, payload);
      const params = yield select(state=>state.warningService.warningService_params);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_warningServiceList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delWarningService_action({payload, params}, {call, put}) {
      const response = yield call(delWarningService, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_warningServiceList_action',
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

    warningServiceListResult(state,{payload}){
      return{
        ...state,
        warningServiceList:payload.response,
        warningService_params:payload.params,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        warningServiceList:{},
        warningService_params:{
          count:count,
          start:start,
        },
      }
    }
  },
}
