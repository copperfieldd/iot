import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getOrganizationTree,//获取树
  getDepartItem,//部门详情
  getUserItem,//用户详情
  updDepart,//修改部门
  updAppOrganzationUserTreeNode,//修改
  addOrganizationTree,//新增部门
  addAppOrganzationUserTreeNode,//新增用户
  deleteOrganizationTree,//删除部门
  delOrganzationUserTreeNode,//删除用户
  appRoleList,
} from '../services/customer';
import {callStatusInfo, count, start, treeDateLoad} from "../utils/utils";
export default {
  namespace:'organization',


  state:{
    organizationTree:[],
    departItems:{},
    userItems:{},

    //下拉加载角色列表
    permissions_role_list:[],
    permissions_role_params:{
      count: count,
      start: start,
    },
    permissionsRoleHasMore:true,
  },

  effects:{
    * fetch_getOrganizationTree_action({payload,callback},{call,put}){
      const response = yield call(getOrganizationTree,payload);
      try {
        if (response.status === 0) {
          if(!payload.id){
            yield put({
              type:'treeResult',
              payload:response.value,
            })
          }else{
            yield put({
              type: 'treeResult1',
              payload: {
                response:response.value,
                pid:payload.id,
              },

            });
            if(callback){
              yield call(callback,response.value)
            }
          }
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getDepartItem_action({payload,callback},{call,put}){
      const response = yield call(getDepartItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'departItemResult',
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

    * fetch_getUserItem_action({payload,callback},{call,put}){
      const response = yield call(getUserItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'userItemResult',
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

    * fetch_updOrganizationTree_action({payload,callback},{call,put}){
      const response = yield call(updDepart,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response,payload)
          }
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updAppOrganzationUserTreeNode_action({payload,callback},{call,put}){
      const response = yield call(updAppOrganzationUserTreeNode,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response,payload)
          }
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addOrganizationTree_action({payload,id,callback},{call,put}){
      const response = yield call(addOrganizationTree,payload);
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

    * fetch_addAppOrganzationUserTreeNode_action({payload,callback},{call,put}){
      const response = yield call(addAppOrganzationUserTreeNode,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response.value)
          }
          // yield put({
          //   type:'fetch_getOrganizationTree_action',
          //   payload:id,
          // })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_deleteOrganizationTree_action({payload,callback},{call,put}){
      const response = yield call(deleteOrganizationTree,payload);
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

    * fetch_delOrganzationUserTreeNode_action({payload,callback},{call,put}){
      const response = yield call(delOrganzationUserTreeNode,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response.value)
          }

        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //下拉加载角色列表
    * fetch_permissions_role_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(appRoleList, payload);
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
  },

  reducers:{
    treeResult(state,{payload}){
      return{
        ...state,
        organizationTree:payload,
      }
    },

    treeResult1(state, {payload}) {
      let tree = state.organizationTree;
      let date = treeDateLoad(tree,payload.response,payload.pid);

      state.organizationTree = date;

      return {
        ...state,
        //unit_tree: payload,
      };
    },

    departItemResult(state,{payload,id}){
      const item = {
        [id] : {...payload}
      };
      return{
        ...state,
        departItems:{
          ...state.departItems,
          ...item,
        }
      }
    },
    userItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      };
      return{
        ...state,
        userItems:{
          ...state.userItems,
          ...item
        }
      }
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

    clearCache(state,{payload}){
      return{
        ...state,
        organizationTree:[],
        departItems:{},
        userItems:{},

        //下拉加载角色列表
        permissions_role_list:[],
        permissions_role_params:{
          count: count,
          start: start,
        },
        permissionsRoleHasMore:true,
      }
    }
  },
}
