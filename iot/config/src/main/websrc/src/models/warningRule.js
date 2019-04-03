import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  //warning rule
  warningRuleList,
  addWarningRuleList,
  updWarningRuleList,
  delWarningRuleList,
  warningRuleItem,

} from '../services/warning';
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace: 'warningRule',

  state: {

    warningRule_params: {
      count: count,
      start: start,
    },
    warningRuleList: {},

    warningRuleItems: {},
  },

  effects: {
    * fetch_warningRuleList_action({payload}, {call, put}) {
      const response = yield call(warningRuleList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'warningRuleResult',
            payload: {
              response: response.value,
              params: payload,
            }
          })
        }
        else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(response.status,window,response.value);
      }
    },

    * fetch_addWarningRuleList_action({payload,callback}, {call, put}) {
      const response = yield call(addWarningRuleList, payload);
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

    * fetch_updWarningRuleList_action({payload}, {call, put,select}) {
      const response = yield call(updWarningRuleList, payload);
      const params = yield select(state=>state.warningRule.warningRule_params)
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_warningRuleList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delWarningRuleList_action({payload, params}, {call, put}) {
      const response = yield call(delWarningRuleList, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_warningRuleList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_warningRuleItem_action({payload,callback}, {call, put}) {
      const response = yield call(warningRuleItem, payload);
      try {
        if (response.status === 0) {
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type: 'warningRuleItemResult',
            payload: {
              response: response.value,
              id: payload.id
            }
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

    warningRuleResult(state, {payload}) {
      return {
        ...state,
        warningRuleList: payload.response,
        warningRule_params: payload.params,
      }
    },

    warningRuleItemResult(state, {payload}) {
      let value = {
        [payload.id]: {...payload.response}
      };
      return {
        ...state,
        warningRuleItems: {
          ...state.warningRuleItems,
          ...value,
        }
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        warningRule_params: {
          count: count,
          start: start,
        },
        warningRuleList: {},

        warningRuleItems: {},
      }
    }
  },
}
