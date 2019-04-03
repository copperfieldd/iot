import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {

  /** Menu **/
    addMenu,
  delMenuList,
  updMenu,
  menuItem, getPlatMenu, getAppMenu,getTenantMenu,

} from '../services/permissions'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace: 'permissionsMenu',

  state: {
    menuItems:{},
    menuList_params:{},
    menuList:[],
    getTenantMenu,
    userTypeItem:null,
  },

  effects: {
    //删除菜单
    * fetch_delMenuList_action({payload,params}, {call, put}) {
      const response = yield call(delMenuList, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          if(params){
            yield put({
              type:'fetch_getAppMenu_action',
              payload:params,
            })
          }else{
            yield put({
              type:'fetch_getPlatMenu_action',
              payload:params,
            })
          }
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //新增菜单
    * fetch_addMenu_action({payload,params}, {call, put}) {
      const response = yield call(addMenu, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          console.log(params);
          if(params){
            yield put({
              type:'fetch_getAppMenu_action',
              payload:params,
            })
          }else{
            yield put({
              type:'fetch_getPlatMenu_action',
              payload:params,
            })
          }
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updMenu_action({payload,params},{call,put}){
      const response = yield call(updMenu,payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          if(params){
            yield put({
              type:'fetch_getAppMenu_action',
              payload:params,
            })
          }else{
            yield put({
              type:'fetch_getPlatMenu_action',
              payload:params,
            })
          }
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_menuItem_action({payload},{call,put}){
      const response = yield call(menuItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'menuItemResult',
            payload:response.value,
            id:[payload.id],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getPlatMenu_action({payload},{call,put}){
      const response = yield call(getPlatMenu,payload);
      try {
        if(response.status===0){
          yield put({
            type:'platMenuResult',
            payload:response.value,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getAppMenu_action({payload},{call,put}){
      const response = yield call(getAppMenu,payload);
      try {
        if(response.status===0){
          yield put({
            type:'platMenuResult',
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

    * fetch_getTenantMenu_action({payload},{call,put}){
      const response = yield call(getTenantMenu,payload);
      try {
        if(response.status===0){
          yield put({
            type:'platMenuResult',
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

  },

  reducers: {
    menuItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      }
      return{
        ...state,
        menuItems:{
          ...state.menuItems,
          ...item,
        }
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
        menuItems:{},
        menuList_params:{},
        menuList:[],
      }
    },

    getTenantMenu(state,{payload}){
      return {
        ...state,
        getTenantMenu:payload
      }
    },
    userTypeItem(state,{payload}){
      return{
        ...state,
        userTypeItem:payload,
      }
    }
  },
}
