import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  appList,
  addAppcalition,
  applicationItems,
  updApplication,
  terminalUserList,
  addTerminalUser,
  updTerminalUser,
  terminalUserItem,
  delTerminalUser,
  getApplication,
  delApplication,
} from '../services/application';
import {callStatusInfo, count, start} from "../utils/utils";
import {tenantList,tenantRoleList,deletePlateManager} from "../services/customer";

export default {
  namespace:'application',

  state:{
    appList:{},
    appList_params:{
      start:start,
      count:count,
    },

    //下拉加载列表
    tenantHasMore: true,
    modal_tenant_params: {
      count: count,
      start: start,
    },
    modal_tenant_list: [],


    //下拉加载列表
    tenantRoleHasMore: true,
    modal_tenantRole_params: {
      count: count,
      start: start,
    },
    modal_tenantRole_list: [],

    //下拉加载列表
    tenantAppHasMore: true,
    modal_tenantApp_params: {
      count: count,
      start: start,
    },
    modal_tenantApp_list: [],


    terminalUserList:{},
    terminalUserList_params:{
      count: count,
      start: start,
    },

    terminalUserItems:{},

    //下拉加载列表
    terminalUserListHasMore: true,
    modal_terminalUserList_params: {
      count: count,
      start: start,
    },
    modal_terminalUserList_list: [],


  },

  effects:{
    * fetch_appList_action({payload},{call,put}){
      const response = yield call(appList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'appListResult',
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

    //下拉租户
    * fetch_tenant_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(tenantList, payload);
      let tenantHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            tenantHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            tenantHasMore = true;
          }
          yield put({
            type: 'tenantListResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              tenantHasMore: tenantHasMore,
              callBack: callBack
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }

    },

    //下拉角色
    * fetch_tenantRole_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(tenantRoleList, payload);
      let tenantRoleHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            tenantRoleHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            tenantRoleHasMore = true;
          }
          yield put({
            type: 'tenantRoleListResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              tenantRoleHasMore: tenantRoleHasMore,
              callBack: callBack,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }

    },

    //下拉应用
    * fetch_tenantApp_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(getApplication, payload);
      let tenantAppHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            tenantAppHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            tenantAppHasMore = true;
          }
          yield put({
            type: 'tenantAppListResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              tenantAppHasMore: tenantAppHasMore,
              callBack: callBack,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }

    },

    //新增
    * fetch_addApplication_action({payload,callback},{call,put}){
      const response = yield call(addAppcalition,payload);
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

    //详情
    * fetch_applicationItems_action({payload,callback},{call,put}){
      const response = yield call(applicationItems,payload);
      try {
        if(response.status===0){
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

    //修改应用
    * fetch_updApplication_action({payload},{call,put,select}){
      const response =yield call(updApplication,payload);
      const params  = yield select(state=>state.application.terminalUserList_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_appList_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //删除应用
    * fetch_delApplication_action({payload,params},{call,put}){
      const response = yield call(delApplication,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_appList_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //终端用户列表
    * fetch_terminalUserList_action({payload},{call,put}){
      const response = yield call(terminalUserList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'terminalUserListResult',
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

    * fetch_deletePlateManager_action({payload,params},{call,put}){
      const response = yield call(deletePlateManager,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_terminalUserList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //下拉终端
    * fetch_terminalUserList_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(terminalUserList, payload);
      let terminalUserListHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            terminalUserListHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            terminalUserListHasMore = true;
          }
          yield put({
            type: 'terminalUserList_listResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              terminalUserListHasMore: terminalUserListHasMore,
              callBack: callBack,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(response.status,window,response.value);
      }

    },

    //新增终端用户
    * fetch_addTerminalUser_action({payload},{call,put}){
      const response = yield call(addTerminalUser,payload);
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

    //修改终端用户
    * fetch_updTerminalUser_action({payload},{call,put,select}){
      const response = yield call(updTerminalUser,payload);
      const params  = yield select(state=>state.application.terminalUserList_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_terminalUserList_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //终端用户详情

    * fetch_terminalUserItem_action({payload,callback},{call,put}){
      const response = yield call(terminalUserItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'terminalUserItemResult',
            payload:response.value,
            id:payload.id,
          })
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

    * fetch_delTerminalUser_action({payload,params},{call,put}){
      const response = yield call(delTerminalUser,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_terminalUserList_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    }

  },

  reducers:{
    appListResult(state,{payload,params}){
      return{
        ...state,
        appList:payload,
        appList_params:params
      }
    },


    tenantListResult(state,{payload}){
      if (payload.isSearch) {
        state.modal_tenant_list = payload.response.list;
        payload.callBack(state.modal_tenant_list);
      } else {
        state.modal_tenant_list = state.modal_tenant_list.concat(payload.response.list);
        payload.callBack(state.modal_tenant_list);
      }
      return {
        ...state,
        tenantHasMore: payload.tenantHasMore,
        modal_tenant_params: payload.params,
      };
    },


    tenantRoleListResult(state,{payload}){
      if (payload.isSearch||payload.params.tenantId!==state.modal_tenantRole_params.tenantId) {
        state.modal_tenantRole_list = payload.response.list;
        payload.callBack&&payload.callBack(state.modal_tenantRole_list);
      } else {
        state.modal_tenantRole_list = state.modal_tenantRole_list.concat(payload.response.list);
        payload.callBack&&payload.callBack(state.modal_tenantRole_list);
      }
      return {
        ...state,
        tenantRoleHasMore: payload.tenantRoleHasMore,
        modal_tenantRole_params: payload.params,
      };
    },

    terminalUserList_listResult(state,{payload}){
      if (payload.isSearch) {
        state.modal_terminalUserList_list = payload.response.list;
        payload.callBack&&payload.callBack(state.modal_terminalUserList_list);
      } else {
        state.modal_terminalUserList_list = state.modal_terminalUserList_list.concat(payload.response.list);
        payload.callBack&&payload.callBack(state.modal_terminalUserList_list);
      }
      return {
        ...state,
        terminalUserListHasMore: payload.terminalUserListHasMore,
        modal_terminalUserList_params: payload.params,
      };
    },

    tenantAppListResult(state,{payload}){
      if (payload.isSearch||payload.params.tenantId!==state.modal_tenantApp_params.tenantId) {
        state.modal_tenantApp_list = payload.response.list;
        payload.callBack&&payload.callBack(state.modal_tenantApp_list);
      } else {
        state.modal_tenantApp_list = state.modal_tenantApp_list.concat(payload.response.list);
        payload.callBack&&payload.callBack(state.modal_tenantApp_list);
      }
      return {
        ...state,
        tenantAppHasMore: payload.tenantAppHasMore,
        modal_tenantApp_params: payload.params,
      };
    },

    terminalUserListResult(state,{payload,params}){
      return{
        ...state,
        terminalUserList:payload,
        terminalUserList_params:params,
      }
    },

    terminalUserItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload},
      }
      return{
        ...state,
        terminalUserItems:{
          ...state.terminalUserItems,
          ...item
        }
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        appList:{},
        appList_params:{
          start:start,
          count:count,
        },

        //下拉加载列表
        tenantHasMore: true,
        modal_tenant_params: {
          count: count,
          start: start,
        },
        modal_tenant_list: [],


        //下拉加载列表
        tenantRoleHasMore: true,
        modal_tenantRole_params: {
          count: count,
          start: start,
        },
        modal_tenantRole_list: [],

        //下拉加载列表
        tenantAppHasMore: true,
        modal_tenantApp_params: {
          count: count,
          start: start,
        },
        modal_tenantApp_list: [],


        terminalUserList:{},
        terminalUserList_params:{
          count: count,
          start: start,
        },

        terminalUserItems:{},

        //下拉加载列表
        terminalUserListHasMore: true,
        modal_terminalUserList_params: {
          count: count,
          start: start,
        },
        modal_terminalUserList_list: [],

      }
    }
  },
}
