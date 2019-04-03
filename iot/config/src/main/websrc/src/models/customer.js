import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {

  /** Grade **/

    gradeList,

  /** Tenant **/

    tenantList,


  getCustomerTree,


} from '../services/customer'
import {count, start, bigCount, callStatusInfo} from "../utils/utils";

export default {
  namespace: 'customer',

  state: {


    //下拉加载租户等级列表
    tenant_grade_list:[],
    tenant_grade_params:{
      count: count,
      start: start,
    },
    tenantGradeHasMore:true,



    //下拉加载租户管理列表
    organization_tenantList:[],
    organTenantHasMore:true,
    organization_tenant_params: {
      count: bigCount,
      start: start,
    },

    tenantTree:[],
  },

  effects: {

    //下拉加载租户等级列表
    * fetch_tenant_grade_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(gradeList, payload);
      let tenantGradeHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            tenantGradeHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            tenantGradeHasMore = true;
          }
          yield put({
            type: 'tenantGradeListResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              tenantGradeHasMore: tenantGradeHasMore,
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



    //下拉加载租户管理列表
    * fetch_organization_tenant_list_action({payload,isSearch,callBack},{call,put}){
      const response = yield call(tenantList, payload);
      let organTenantHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            organTenantHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            organTenantHasMore = true;
          }
          yield put({
            type: 'organTenantListResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              organTenantHasMore: organTenantHasMore,
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



    * fetch_getCustomerTree_action({payload},{call,put}){
      const response = yield call(getCustomerTree,payload);
      try {
        if(response.status===0){
          yield put({
            type:'tenantTreeResult',
            payload:response.value,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    }
  },

  reducers: {
    checkedRoleList(state, {payload}) {
      return {
        ...state,
        checkedRoleList: payload,
      }
    },

    organTenantListResult(state, {payload}){
      if (payload.isSearch) {
        state.organization_tenantList = payload.response.list;
        payload.callBack(state.organization_tenantList);
      } else {
        state.organization_tenantList = state.organization_tenantList.concat(payload.response.list);
        payload.callBack(state.organization_tenantList);
      }
      return {
        ...state,
        organTenantHasMore: payload.organTenantHasMore,
        organization_tenant_params: payload.params,
      };
    },

    tenantGradeListResult(state,{payload}){
      if (payload.isSearch) {
        state.tenant_grade_list = payload.response.list;
        payload.callBack(state.tenant_grade_list);
      } else {
        state.tenant_grade_list = state.tenant_grade_list.concat(payload.response.list);
        payload.callBack(state.tenant_grade_list);
      }
      return {
        ...state,
        tenantGradeHasMore: payload.tenantGradeHasMore,
        tenant_grade_params: payload.params,
      };
    },

    tenantTreeResult(state,{payload}){
      return{
        ...state,
        tenantTree:payload
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,

        //下拉加载租户等级列表
        tenant_grade_list:[],
        tenant_grade_params:{
          count: count,
          start: start,
        },
        tenantGradeHasMore:true,



        //下拉加载租户管理列表
        organization_tenantList:[],
        organTenantHasMore:true,
        organization_tenant_params: {
          count: bigCount,
          start: start,
        },

        tenantTree:[],
      }
    }
  },
}
