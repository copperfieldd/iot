import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  //warning list
  warningList,
  exportWarningExcl,

} from '../services/warning';
import {count, start, ExcelDownload, callStatusInfo} from "../utils/utils";

export default {
  namespace: 'warningList',

  state: {
    warningList: {},
    warning_params: {
      count: count,
      start: start,
    },
  },

  effects: {
    * fetch_warningList_action({payload}, {call, put}) {
      const response = yield call(warningList, payload);
      try {
        if (response.status == 0) {
          yield put({
            type: 'warningListResult',
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

    * fetch_exportWarningExcl_export({payload}, {call, put, select}) {
      const response = yield call(exportWarningExcl, payload);
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob => {
            ExcelDownload(blob, filename);
            //payload.callback();//关闭弹窗
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(response.status,window,response.value);
      }
    },
  },

  reducers: {
    warningListResult(state, {payload}) {
      return {
        ...state,
        warningList: payload.response,
        warning_params: payload.params,
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        warningList: {},
        warning_params: {
          count: count,
          start: start,
        },
      }
    }
  }
}
