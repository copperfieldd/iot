import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {deviceTypePullList,adapterPullList,getDataDealList,componentPullList,pluginPullList,getLogList,pluginPullLists} from '../services/equipment'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace:'equipment',


  state:{
    adapterPullList:[],
    adapterPullList_params:{
      start:start,
      count:count,
    },
    adapterPullHasMore:true,

    deviceTypePullList:[],
    deviceTypePullList_params:{
      start:start,
      count:count,
    },
    deviceTypePullMore:true,

    dataDealPullList:[

    ],
    dataDealPullList_params:{
      start:start,
      count:count,
    },
    dataDealPullMore:true,


    componentPullList:[],
    componentPullList_params:{
      start:start,
      count:count,
    },
    componentPullMore:true,


    pluginPullList:[],
    pluginPullList1:[],
    pluginPullList_params:{
      start:start,
      count:count,
    },
    pluginPullMore:true,

    pluginPullLists:[],
    pluginPullLists1:[],
    pluginPullLists_params:{
      start:start,
      count:count,
    },
    pluginPullsMore:true,


    logList:{},
    logList_params: {
      start:start,
      count:count,
    }
  },

  effects:{
    //适配器下拉加载列表
    * fetch_adapterPullList_list_action({payload,isSearch,callBack},{call,put,select}){
      let adapterPullHasMore = true;
      const response = yield call(adapterPullList,payload);
      const stateValue = yield select(state=>state.equipment.adapterPullList);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            adapterPullHasMore = false;
            //message.warning('数据加载完毕');
          }else{
            adapterPullHasMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'adapterPullListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              adapterPullHasMore:adapterPullHasMore,
              //callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },



    //设备类型下拉加载列表
    * fetch_deviceTypePullList_list_action({payload,isSearch,callBack},{call,put,select}){
      let deviceTypePullMore = true;
      const response = yield call(deviceTypePullList,payload);
      const stateValue = yield select(state=>state.equipment.deviceTypePullList);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            deviceTypePullMore = false;
            //message.warning('数据加载完毕');
          }else{
            deviceTypePullMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'deviceTypePullListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              deviceTypePullMore:deviceTypePullMore,
              //callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //数据处理下拉加载列表
    * fetch_getDataDealList_list_action({payload,isSearch,callBack},{call,put,select}){
      let dataDealPullMore = true;
      const response = yield call(getDataDealList,payload);
      const stateValue = yield select(state=>state.equipment.dataDealPullList)
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            dataDealPullMore = false;
            //message.warning('数据加载完毕');
          }else{
            dataDealPullMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'dataDealPullListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              dataDealPullMore:dataDealPullMore,
              //callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //组件管理下拉加载列表
    * fetch_componentPullList_list_action({payload,isSearch,callBack},{call,put,select}){
      let componentPullMore = true;
      const response = yield call(componentPullList,payload);
      const stateValue = yield select(state=>state.equipment.componentPullList);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            componentPullMore = false;
            //message.warning('数据加载完毕');
          }else{
            componentPullMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }

          yield put({
            type:'componentPullListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              componentPullMore:componentPullMore,
              //callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //插件管理下拉加载列表
    * fetch_pluginPullList_list_action({payload,isSearch,callBack},{call,put,select}){
      let pluginPullMore = true;
      const response = yield call(pluginPullList,payload);
      const stateValue  = yield select(state=>state.equipment.pluginPullList);
      console.log(response);
      console.log(stateValue);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            pluginPullMore = false;
            //message.warning('数据加载完毕');
          }else{
            pluginPullMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'pluginPullListResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              pluginPullMore:pluginPullMore,
              //callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_pluginPullLists_list_action({payload,isSearch,callBack},{call,put,select}){
      let pluginPullsMore = true;
      const response = yield call(pluginPullLists,payload);
      const stateValue = yield select(state=>state.equipment.pluginPullLists);
      try {
        if(response.status===0){
          if(response.value.value.length != 10){
            pluginPullsMore = false;
            //message.warning('数据加载完毕');
          }else{
            pluginPullsMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.value)
          }else{
            yield call(callBack,stateValue.concat(response.value.value));
          }
          yield put({
            type:'pluginPullListsResult_list',
            payload: {
              response:response.value,
              params:payload,
              isSearch:isSearch,
              pluginPullMore:pluginPullsMore,
              //callBack:callBack
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //日志管理
    * fetch_getLogList_action({payload},{call,put}){
      const response = yield call(getLogList,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'logListResult',
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
  },

  reducers:{
    adapterPullListResult_list(state,{payload}){
      if(payload.isSearch||payload.params.status!==state.adapterPullList_params.status){
        state.adapterPullList = payload.response.value;
        //payload.callBack(state.adapterPullList);
      }else{
        state.adapterPullList = state.adapterPullList.concat(payload.response.value);
        //payload.callBack(state.adapterPullList);
      }
      return {
        ...state,
        adapterPullHasMore:payload.adapterPullHasMore,
        adapterPullList_params:payload.params,
      };
    },

    deviceTypePullListResult_list(state,{payload}){
      if(payload.isSearch){
        state.deviceTypePullList = payload.response.value;
        //payload.callBack(state.deviceTypePullList);
      }else{
        state.deviceTypePullList = state.deviceTypePullList.concat(payload.response.value);
        //payload.callBack(state.deviceTypePullList);
      }
      return {
        ...state,
        deviceTypePullMore:payload.deviceTypePullMore,
        deviceTypePullList_params:payload.params,
      };
    },

    dataDealPullListResult_list(state,{payload}){
      if(payload.isSearch){
        state.dataDealPullList = payload.response.value;
        payload.callBack(state.dataDealPullList);
      }else{
        state.dataDealPullList = state.dataDealPullList.concat(payload.response.value);
        payload.callBack(state.dataDealPullList);
      }
      return {
        ...state,
        dataDealPullMore:payload.dataDealPullMore,
        dataDealPullList_params:payload.params,
      };
    },

    componentPullListResult_list(state,{payload}){
      if(payload.isSearch||payload.params.type!==state.pluginPullList_params.type){
        state.componentPullList = payload.response.value;
        //payload.callBack(state.componentPullList);
      }else{
        state.componentPullList = state.componentPullList.concat(payload.response.value);
        //payload.callBack(state.componentPullList);
      }
      return {
        ...state,
        componentPullMore:payload.componentPullMore,
        componentPullList_params:payload.params,
      };
    },


    pluginPullListResult_list(state,{payload}){
      if(payload.isSearch||payload.params.status!==state.pluginPullList_params.status){
        state.pluginPullList = payload.response.value;
        //payload.callBack(state.pluginPullList);

      }else{
        state.pluginPullList = state.pluginPullList.concat(payload.response.value);
        //payload.callBack(state.pluginPullList);
      }
      return {
        ...state,
        pluginPullMore:payload.pluginPullMore,
        pluginPullList_params:payload.params,
      };
    },

    pluginPullListsResult_list(state,{payload}){
      if(payload.isSearch||payload.params.status!==state.pluginPullLists_params.status){
        state.pluginPullLists = payload.response.value;
        //payload.callBack(state.pluginPullLists);

      }else{
        state.pluginPullLists = state.pluginPullLists.concat(payload.response.value);
        //payload.callBack(state.pluginPullLists);
      }
      return {
        ...state,
        pluginPullsMore:payload.pluginPullsMore,
        pluginPullLists_params:payload.params,
      };
    },



    logListResult(state,{payload,params}){
      return{
        ...state,
        logList:payload,
        logList_params:params
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        adapterPullList:[],
        adapterPullList_params:{
          start:start,
          count:count,
        },
        adapterPullHasMore:true,

        deviceTypePullList:[],
        deviceTypePullList_params:{
          start:start,
          count:count,
        },
        deviceTypePullMore:true,

        dataDealPullList:[

        ],
        dataDealPullList_params:{
          start:start,
          count:count,
        },
        dataDealPullMore:true,


        componentPullList:[],
        componentPullList_params:{
          start:start,
          count:count,
        },
        componentPullMore:true,


        pluginPullList:[],
        pluginPullList1:[],
        pluginPullList_params:{
          start:start,
          count:count,
        },
        pluginPullMore:true,

        pluginPullLists:[],
        pluginPullLists1:[],
        pluginPullLists_params:{
          start:start,
          count:count,
        },
        pluginPullsMore:true,


        logList:{},
        logList_params: {
          start:start,
          count:count,
        }
      }
    }
  },
}
