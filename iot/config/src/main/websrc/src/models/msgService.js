import { tenantList } from '../services/customer';
import { message } from 'antd';
import {count, start} from "../utils/utils";
import {addAutograph,userAutograph,addPlatTemplate,getPlatTemplateList,getUserTemplateList,commentTemplate,editPlatTemplate,delPlatTemplate,delUserAutograph,examinTemplate,
  examineAutograph,
  editAutograph,
} from '../services/beingPushed'


export default {
  namespace: 'msgService',

  state: {
    commentTemplate:{},
    commentTemplate_params:{
      start:start,
      count:count,
    },

    userAutographList:{},
    userAutographList_params:{
      start:start,
      count:count,
    },
    getPlatTemplateList:{},
    getPlatTemplateList_params:{
      start:start,
      count:count,
      field: "",
    },

    getUserTemplateList:{},
    getUserTemplateList_params:{
      start:start,
      count:count,
    },

  },

  effects: {
    //公共模板
    * fetch_commentTemplate_action({payload},{call,put}){
      const response = yield call(commentTemplate,payload);
      try {
        if(response.status===0){
          yield put({
            type:'commentTemplate',
            payload:response.value,
            params:payload,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败');
      }
    },


    * fetch_addAutograph_action({payload,callback,params},{call,put}){
      const response = yield call(addAutograph,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type:'fetch_userAutograph_action',
            payload:params,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_userAutograph_action({payload},{call,put}){
      const response = yield call(userAutograph,payload);
      try {
        if(response.status===0){
          yield put({
            type:'userAutographList',
            payload:response.value,
            params:payload,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }

    },
    //新增模板
    * fetch_addPlatTemplate_action({payload,callback},{call,put}){
      const response = yield call(addPlatTemplate,payload);
      try {
        if(response.status===0){
          message.success(response.message)
          // yield put({
          //   type:'fetch_commentTemplate_action',
          //   payload:params,
          // })
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },
    //审核模板
    * fetch_examineTemplate_action({payload,callback},{call,put}){
      const response = yield call(examinTemplate,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },
    //签名审核
    * fetch_examineAutograph_action({payload,callback},{call,put}){
      const response = yield call(examineAutograph,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    //修改签名
    * fetch_editAutograph_action({payload,callback},{call,put}){
      const response = yield call(editAutograph,payload);
      try {
        if(response.status===0){
          message.success(response.message)
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_editPlatTemplate_action({payload,callback},{call,put}){
      const response = yield call(editPlatTemplate,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_delPlatTemplate_action({payload,callback},{call,put}){
      const response = yield call(delPlatTemplate,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },


    //模板列表
    * fetch_getPlatTemplateList_action({payload},{call,put}){
      const response = yield call(getPlatTemplateList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getPlatTemplateList',
            payload:response.value,
            params:payload
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    //用户模板
    * fetch_getUserTemplateList_action({payload},{call,put}){
      const response = yield call(getUserTemplateList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getUserTemplateList',
            payload:response.value,
            params:payload,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    //删除签名
    * fetch_delUserAutograph_action({payload,params},{call,put}){
      const response = yield call(delUserAutograph,payload);
      try {
        if(response.status===0){
          message.success(response.message);
          yield put({
            type:'fetch_userAutograph_action',
            payload:params,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },
  },

  reducers: {
    commentTemplate(state,{payload,params}){
      return{
        ...state,
        commentTemplate:payload,
        commentTemplate_params:params
      }
    },
    userAutographList(state,{payload,params}){
      return{
        ...state,
        userAutographList:payload,
        userAutographList_params:params
      }
    },

    getPlatTemplateList(state,{payload,params}){
      return {
        ...state,
        getPlatTemplateList:payload,
        getPlatTemplateList_params:params,
      }
    },

    getUserTemplateList(state,{payload,params}){
      return{
        ...state,
        getUserTemplateList:payload,
        getUserTemplateList_params:params,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        commentTemplate:{},
        commentTemplate_params:{
          start:start,
          count:count,
        },

        userAutographList:{},
        userAutographList_params:{
          start:start,
          count:count,
        },
        getPlatTemplateList:{},
        getPlatTemplateList_params:{
          start:start,
          count:count,
          field: "",
        },

        getUserTemplateList:{},
        getUserTemplateList_params:{
          start:start,
          count:count,
        },
      }
    }
  },
};
