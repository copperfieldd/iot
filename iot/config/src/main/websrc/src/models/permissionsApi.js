import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  /** Api **/

  apiList,
  addApi,
  apiItem,
  updApi,
  delApi,
  getTenantApi,

} from '../services/permissions'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace: 'permissionsApi',

  state: {
    //API
    apiList: {},
    api_params: {
      count: count,
      start: start,
    },
    apiItems: {},
  },

  effects: {
    //接口管理列表
    * fetch_apiList_action({payload}, {call, put}) {
      const response = yield call(apiList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'apiListResult',
            payload: response.value,
            params: payload,
          });
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getTenantApi_action({payload},{call,put}){
      const response = yield call(getTenantApi,payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'apiListResult',
            payload: response.value,
            params: payload,
          });
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    //添加接口
    * fetch_addApi_action({payload}, {call, put}) {
      const response = yield call(addApi, payload);
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

    //修改接口
    * fetch_updApi_action({payload}, {call, put,select}) {
      const response = yield call(updApi, payload);
      const params  = yield select(state=>state.permissionsApi.api_params);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_apiList_action",
            payload:params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //接口详情
    * fetch_apiItem_action({payload}, {call, put}) {
      const response = yield call(apiItem, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'apiItemResult',
            payload: response.value,
            id: payload.id,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //删除接口
    * fetch_delApi_action({payload, params}, {call, put}) {
      const response = yield call(delApi, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_apiList_action',
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

  reducers: {
    //接口管理
    apiListResult(state, {payload, params}) {
      return {
        ...state,
        apiList: payload ? payload : state.apiList,
        api_params: params,
      }
    },

    apiItemResult(state, {payload, id}) {
      let value = {
        [id]: {...payload}
      };
      return {
        ...state,
        apiItems: {
          ...state.apiItems,
          ...value,
        }
      }
    },
    change_api_params(state,{payload}){
      return{
        ...state,
        api_params: {
          count: count,
          start: start,
        },
      }
    },


    clearCache(state,{payload}){
      return{
        ...state,
//API
        apiList: {},
        api_params: {
          count: count,
          start: start,
        },
        apiItems: {},
      }
    }
  },
}
