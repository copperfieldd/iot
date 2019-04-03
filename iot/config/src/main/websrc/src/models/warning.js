import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {

  warningServiceList,
  warningTypeList,
  warningStrategyList,
  warningExport,
} from '../services/warning';
import {count, start, ExcelDownload, callStatusInfo} from "../utils/utils";

export default {
  namespace:'warning',

  state:{

    //告警服务下拉加载列表
    warningService_list_params:{
      count:count,
      start:start,
    },
    warningServiceHasMore:true,
    warningService_list_list:[],

    //告警类型下拉加载列表
    warningType_list_params:{
      count:count,
      start:start,
    },
    warningTypeHasMore:true,
    warningType_list_list:[],


    //告警类型下拉加载列表
    warningStrategy_list_params:{
      count:count,
      start:start,
    },
    warningStrategyHasMore:true,
    warningStrategy_list_list:[],


    serviceConfigCheckedValue:{},
    ruleServiceConfigCheckedValue:{},
    ruleAlarmTypeCheckedValue:{},
  },

  effects:{
    //告警服务下拉加载列表
    * fetch_warningServiceList_list_action({payload,isSearch,callBack},{call,put,select}){
      let warningServiceHasMore = true;
      const response = yield call(warningServiceList,payload);
      const stateValue  = yield select(state=>state.warning.warningService_list_list);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            warningServiceHasMore = false;
            //message.warning('数据加载完毕');
          }else{
            warningServiceHasMore = true;
          }

          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }

          yield put({
            type:'warningServiceListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              warningServiceHasMore:warningServiceHasMore,
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //告警类型下拉加载列表
    * fetch_warningTypeListResult_list_action({payload,isSearch,callBack},{call,put,select}){
      let warningTypeHasMore = true;
      const response = yield call(warningTypeList,payload);
      const stateValue  = yield select(state=>state.warning.warningType_list_list);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            warningTypeHasMore = false;
            //message.warning('数据加载完毕');
          }else{
            warningTypeHasMore = true;
          }

          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'warningTypeListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              warningTypeHasMore:warningTypeHasMore,
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_warningStrategyListResult_list_action({payload,isSearch,callBack},{call,put}){
      let warningStrategyHasMore = true;
      const response = yield call(warningStrategyList,payload);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            warningStrategyHasMore = false;
            //message.warning('数据加载完毕');
          }else{
            warningStrategyHasMore = true;
          }
          yield put({
            type:'warningStrategyListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              warningTypeHasMore:warningStrategyHasMore,
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

    * fetch_warningExport_action({payload},{call,put}){
      const response = yield call(warningExport,payload)
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob=>{
            ExcelDownload(blob,filename);
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(response.status,window,response.value);
      }
    },
  },

  reducers:{

    //List下拉刷新
    warningServiceListResult_list(state,{payload}){
      if(payload.isSearch){
        state.warningService_list_list = payload.response.value;
        //payload.callBack(state.warningService_list_list);
      }else{
        state.warningService_list_list = state.warningService_list_list.concat(payload.response.value);
        //payload.callBack(state.warningService_list_list);
      }
      return {
        ...state,
        warningServiceHasMore:payload.warningServiceHasMore,
        warningService_list_params:payload.params,
      };
    },

    warningTypeListResult_list(state,{payload}){
      if(payload.isSearch){
        state.warningType_list_list = payload.response.value;
      }else{
        state.warningType_list_list = state.warningType_list_list.concat(payload.response.value);
      }
      return {
        ...state,
        warningTypeHasMore:payload.warningTypeHasMore,
        warningType_list_params:payload.params,
      };
    },

    warningStrategyListResult_list(state,{payload}){
      if(payload.isSearch){
        state.warningStrategy_list_list = payload.response.value;
        payload.callBack(state.warningStrategy_list_list);
      }else{
        state.warningStrategy_list_list = state.warningStrategy_list_list.concat(payload.response.value);
        payload.callBack(state.warningStrategy_list_list);
      }
      return {
        ...state,
        warningStrategyHasMore:payload.warningStrategyHasMore,
        warningStrategy_list_params:payload.params,
      };
    },

    serviceConfigCheckedValue(state,{payload}){
      return{
        ...state,
        serviceConfigCheckedValue:payload,
      }
    },
    ruleServiceConfigCheckedValue(state,{payload}){
      return{
        ...state,
        ruleServiceConfigCheckedValue:payload,
      }
    },
    ruleAlarmTypeCheckedValue(state,{payload}){
      return{
        ...state,
        ruleAlarmTypeCheckedValue:payload
      }
    },
    warningRuleItemResult(state,{payload}){
      let value = {
        [payload.id]:{...payload.response}
      }
      return{
        ...state,
        warningRuleItems:{
          ...state.warningRuleItems,
          ...value,
        }
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,

        //告警服务下拉加载列表
        warningService_list_params:{
          count:count,
          start:start,
        },
        warningServiceHasMore:true,
        warningService_list_list:[],

        //告警类型下拉加载列表
        warningType_list_params:{
          count:count,
          start:start,
        },
        warningTypeHasMore:true,
        warningType_list_list:[],


        //告警类型下拉加载列表
        warningStrategy_list_params:{
          count:count,
          start:start,
        },
        warningStrategyHasMore:true,
        warningStrategy_list_list:[],


        serviceConfigCheckedValue:{},
        ruleServiceConfigCheckedValue:{},
        ruleAlarmTypeCheckedValue:{},
      }
    }
  },
}
