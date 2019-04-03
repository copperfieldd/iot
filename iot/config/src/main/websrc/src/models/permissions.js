import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  /** Api **/

  apiList,

  getAPIandMenu,

  /** Role **/
  roleList,

  getServiceList,
  getAppList,
  getPlatMenu,
  getMenuApi,
  getAppMenu,
} from '../services/permissions'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace: 'permissions',

  state: {

    //下拉加载列表
    apiHasMore: true,
    modal_api_params: {
      count: count,
      start: start,
    },
    modal_api_list: [],
    menuTree:[],


    //下拉加载角色列表
    permissions_role_list:[],
    permissions_role_params:{
      count: count,
      start: start,
    },
    permissionsRoleHasMore:true,

    serviceList:[],

    //menuList:[],
    modal_menuApi_list:[],


    //menuList_params:{},
  },

  effects: {
    //下拉加载菜单列表
    * fetch_getAPIandMenu_action({payload}, {call, put}) {
      const response = yield call(getAPIandMenu, payload);
      //let apiHasMore = true;
      try {
        if (response.status === 0) {
          yield put({
            type: 'modalApiList',
            payload: {
              response: response.value.apis,
            }
          });
          yield put({
            type: 'menuTree',
            payload: {
              response: response.value.menus,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        //callStatusInfo(1001,window,response&&response.value);
      }

    },


    //下拉加载角色列表
    * fetch_permissions_role_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(roleList, payload);
      let permissionsRoleHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            permissionsRoleHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            permissionsRoleHasMore = true;
          }
          yield put({
            type: 'permissionRoleListResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              permissionsRoleHasMore: permissionsRoleHasMore,
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

    * fetch_getServiceList_action({payload},{call,put}){
      const response = yield call(getServiceList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'serviceListResult',
            payload:response.value
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getAppList_action({payload},{call,put}){
      const response = yield call(getAppList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'serviceListResult',
            payload:response.value
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },



    * fetch_getMenuApi_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(getMenuApi, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'modalMenuApiList',
            payload: {
              response: response.value,
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


    // * fetch_getPlatMenu_action({payload},{call,put}){
    //   const response = yield call(getPlatMenu,payload);
    //   try {
    //     if(response.status===0){
    //       yield put({
    //         type:'platMenuResult',
    //         payload:response.value,
    //       })
    //     }else{
    //
    //     }
    //   }catch (e) {
    //     message.error('请求失败，请稍后再试！')
    //   }
    // },
    //
    // * fetch_getAppMenu_action({payload},{call,put}){
    //   const response = yield call(getAppMenu,payload);
    //   try {
    //     if(response.status===0){
    //       yield put({
    //         type:'platMenuResult',
    //         payload:response.value,
    //         params:payload,
    //       })
    //     }else{
    //
    //     }
    //   }catch (e) {
    //     message.error('请求失败，请稍后再试！')
    //   }
    // },


  },

  reducers: {
    checkedRoleList(state, {payload}) {
      return {
        ...state,
        checkedRoleList: payload,
      }
    },

    modalApiList(state, {payload}) {
      return {
        ...state,
        modal_api_list:payload.response
      };
    },
    menuTree(state,{payload}){
      return {
        ...state,

        menuTree:payload.response
      };
    },

    modalMenuApiList(state, {payload}){
      return {
        ...state,
        modal_menuApi_list:payload.response
      };
    },

    permissionRoleListResult(state,{payload}){
      if (payload.isSearch) {
        state.permissions_role_list = payload.response.list;
        payload.callBack(state.permissions_role_list);
      } else {
        state.permissions_role_list = state.permissions_role_list.concat(payload.response.list);
        payload.callBack(state.permissions_role_list);
      }
      return {
        ...state,
        permissionsRoleHasMore: payload.permissionsRoleHasMore,
        permissions_role_params: payload.params,
      };
    },

    serviceListResult(state,{payload}){
      return{
        ...state,
        serviceList:payload
      }
    },

    platMenuResult(state,{payload,params}){
      return{
        ...state,
        menuList:payload,
        menuList_params:params,
      }
    },


    clearCache(state,{payload}){
      return{
        ...state,
        //下拉加载列表
        apiHasMore: true,
        modal_api_params: {
          count: count,
          start: start,
        },
        modal_api_list: [],
        menuTree:[],


        //下拉加载角色列表
        permissions_role_list:[],
        permissions_role_params:{
          count: count,
          start: start,
        },
        permissionsRoleHasMore:true,

        serviceList:[],

        //menuList:[],
        modal_menuApi_list:[],


        //menuList_params:{},
      }
    }
  },
}
