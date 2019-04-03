import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {

  /** Role **/
  roleList,
  delRole,
  addRole,
  userMenuList,
  getRoleList,
  getAppRoleList,
  roleItem,
  updRole,
} from '../services/permissions'
import {callStatusInfo, count, start} from "../utils/utils";

export default {
  namespace: 'permissionsRole',

  state: {
    //角色管理
    roleManageList: {},
    role_params: {
      count: count,
      start: start,
    },
    userMenuList:[],

  },

  effects: {
    //角色列表
    * fetch_roleList_action({payload}, {call, put}) {
      const response = yield call(roleList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'roleListResult',
            payload: response.value,
            params:payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getRoleList_action({payload},{call,put}){
      const response = yield call(getRoleList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'roleListResult',
            payload: response.value,
            params:payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getAppRoleList_action({payload},{call,put}){
      const response = yield call(getAppRoleList,payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'roleListResult',
            payload: response.value,
            params:payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //删除角色
    * fetch_delRole_action({payload, params,userType}, {call, put}) {
      const response = yield call(delRole, payload);
      try {
        if (response.status === 0) {
          if(userType!==3){
            yield put({
              type: 'fetch_roleList_action',
              payload: params,
            })
          }else{
            yield put({
              type: 'fetch_getAppRoleList_action',
              payload: params,
            })
          }
          callStatusInfo(response.status,window,response.value);

        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //新增角色
    * fetch_addRole_action({payload,callback},{call,put}){
      const response = yield call(addRole,payload);
      try{
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

    //修改角色

    * fetch_updRole_action({payload},{call,put,select}){
      const response = yield call(updRole,payload);
      const params  = yield select(state=>state.permissionsRole.role_params);
      try{
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_roleList_action",
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_userMenuList_action({payload},{call,put}){
      const response = yield call(userMenuList,payload);
      try{
        if(response.status === 0){
          yield put({
            type:'userMenuListResult',
            payload:response.value
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_roleItem_action({payload,callback},{call,put}){
      const response = yield call(roleItem,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'roleItemResult',
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

  },

  reducers: {
    roleListResult(state, {payload,params}) {
      return {
        ...state,
        roleManageList: payload,
        role_params:params
      }
    },
    //菜单树形接口
    userMenuListResult(state,{payload}){
      return{
        ...state,
        userMenuList:payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
//角色管理
        roleManageList: {},
        role_params: {
          count: count,
          start: start,
        },
        userMenuList:[],
      }
    }
  },
}
