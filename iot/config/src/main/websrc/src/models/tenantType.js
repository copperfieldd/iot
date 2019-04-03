import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {callStatusInfo} from '../utils/utils'
import {

  /** Grade **/

  gradeList,
  delGrade,
  addGradeList,
  gradeItem,
  updGradeList,

} from '../services/customer'

import {


  userMenuList,

} from '../services/permissions'
import {count, start} from "../utils/utils";
import basicMessages from "../messages/common/basicTitle";
export default {
  namespace:'tenantType',

  state:{
    //租户等级
    gradeList: {},
    grade_params: {
      count: count,
      start: start,
    },
    userMenuList:[],
    gradeItems:{},
  },

  effects: {
    //租户等级列表
    * fetch_gradeList_action({payload}, {call, put}) {
      const response = yield call(gradeList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'gradeListResult',
            payload: response.value,
            params:payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        //callStatusInfo(1001,window)
      }
    },
    //新增租户等级
    * fetch_addGradeList_action({payload,callback}, {call, put}) {
      const response = yield call(addGradeList, payload);
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
        callStatusInfo(1001,props)
      }
    },

    * fetch_updGradeList_action({payload},{call, put,select}) {
      const params  = yield select(state=>state.tenantType.grade_params);
      const response = yield call(updGradeList, payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_gradeList_action",
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //删除租户等级
    * fetch_delGrade_action({payload, params}, {call, put}) {
      const response = yield call(delGrade, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_gradeList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
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


    * fetch_gradeItem_action({payload,callback},{call,put}){
      const response = yield call(gradeItem,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'gradeItemResult',
            payload:response.value,
            id:payload.id
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
    //租户等级
    gradeListResult(state, {payload,params}) {
      return {
        ...state,
        gradeList: payload,
        grade_params:params,
      }
    },

    //菜单树形接口
    userMenuListResult(state,{payload}){
      return{
        ...state,
        userMenuList:payload,
      }
    },

    //详情
    gradeItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      };
      return{
        ...state,
        gradeItems:{
          ...state.gradeItems,
          ...item,
        }
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        //租户等级
        gradeList: {},
        grade_params: {
          count: count,
          start: start,
        },
        userMenuList:[],
        gradeItems:{},
      }
    }
  },
}
