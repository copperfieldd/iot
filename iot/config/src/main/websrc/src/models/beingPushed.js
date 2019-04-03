import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {getTaskList,messageItemList,messagePieChart,messageTypeCount,messageLineChart,messgeCancel,getAllTenantList,messageDownload,getAllApplicationByTenant,taskAdd,pullAutograph,pullTemp,templateItem } from '../services/beingPushed'
import {count, start,ExcelDownload} from "../utils/utils";
import moment from "moment";

export default {
  namespace:'beingPushed',


  state:{
    rememberDataChildTabs:'D',

    getTaskList:{},
    getTaskList_params:{
      start:start,
      count:count,
      state:6,
      queryType:0,
      field:'',
      type:3,
    },

    messageItemList:{},
    messageItemList_params:{
      type:0,
      state:6,
      start:start,
      count:count,
      queryType:0,
      smsType:0,
      startTime:'2000-01-01',
      end:moment().subtract(0, 'days').format('YYYY-MM-DD'),
    },

    messagePieChart:{},
    messagePieChart_params:{
      message_type:0,
    },
    messageTypeCount:{},
    messageTypeCount_params:{},

    messageLineChart:[],
    messageLineChart_params:{
      start:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      end:moment().subtract(0, 'days').format('YYYY/MM/DD'),
    },

    messageApplicationLineChart:{},
    messageApplicationLineChart_params:{
      start:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      end:moment().subtract(0, 'days').format('YYYY-MM-DD'),
    },
    getAllTenantList:[],
    getAllApplicationByTenant:[],
    pullAutograph:null,
    pullTemp:null,
    templateItem:null,
  },

  effects:{
    * fetch_getTaskList_action({payload},{call,put}){
      const response = yield call(getTaskList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getTaskList',
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

    * fetch_messageItemList_action({payload},{call,put}){
      const response = yield call(messageItemList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'messageItemList',
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

    * fetch_messagePieChart_action({payload,callback},{call,put}){
      const response = yield call(messagePieChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'messagePieChart',
            payload:response.value,
            params:payload,
          })
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

    * fetch_messageTypeCount_action({payload},{call,put}){
      const response = yield call(messageTypeCount,payload);
      try {
        if(response.status===0){
          yield put({
            type:'messageTypeCount',
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

    * fetch_messageLineChart_action({payload},{call,put}){
      const response = yield call(messageLineChart,payload);
      try {
        if(response.status==0){
          if(payload.type===1){
            yield put({
              type:'messageLineChart',
              payload:response.value,
              params:payload
            })
          }else{
            yield put({
              type:'messageApplicationLineChart',
              payload:response.value,
              params:payload
            })
          }

        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_messageCancel_action({payload,callback},{call,put}){
      const response = yield call(messgeCancel,payload);
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

    * fetch_getAllTenantList_action({payload,callback},{call,put}){
      const response = yield call(getAllTenantList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getAllTenantList',
            payload:response.value
          })
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

    * fetch_taskAdd_action({payload,callback},{call,put}){
      const response = yield call(taskAdd,payload)
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

    * fetch_getAllApplicationByTenant_action({payload},{call,put}){
      const response = yield call(getAllApplicationByTenant,payload);
      try {
        if(response.status===0){
          yield put({
            type:'getAllApplicationByTenant',
            payload:response.value
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_exportItem_action({payload},{call,put}){
      const response = yield call(messageDownload,payload);
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob=>{
            ExcelDownload(blob,filename);
          })
        }else{
          message.error('下载失败，请稍后再试！');
        }
      } catch (error) {
        message.error('请求失败，请稍后再试！');
      }
    },

    * fetch_pullAutograph_action({payload},{call,put}){
      const response = yield call(pullAutograph,payload);
      try {
        if(response.status===0){
          yield put({
            type:'pullAutograph',
            payload:response.value||response.value.length!==0?response.value.list:[],
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_pullTemp_action({payload},{call,put}){
      const response = yield call(pullTemp,payload);
      try {
        if(response.status===0){
          yield put({
            type:'pullTemp',
            payload:response.value||response.value.length!==0>0?response.value:[]
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败')
      }
    },

    * fetch_templateItem_action({payload,callback},{call,put}){
      const response = yield call(templateItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'templateItem',
            payload:response.value
          })
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
  },

  reducers:{
    rememberDataChildTabs(state,{payload}){
      return{
        ...state,
        rememberDataChildTabs:payload
      }
    },

    getTaskList(state,{payload,params}){
      return{
        ...state,
        getTaskList:payload,
        getTaskList_params:params,
      }
    },

    messageItemList(state,{payload,params}){
      console.log(params)
      return{
        ...state,
        messageItemList:payload,
        messageItemList_params:params
      }
    },

    messagePieChart(state,{payload,params}){
      return{
        ...state,
        messagePieChart:payload,
        messagePieChart_params:params,
      }
    },
    messageTypeCount(state,{payload,params}){
      return{
        ...state,
        messageTypeCount:payload,
        messageTypeCount_params:params
      }
    },
    messageLineChart(state,{payload,params}){
      return{
        ...state,
        messageLineChart:payload,
        messageLineChart_params:params
      }
    },
    messageApplicationLineChart(state,{payload,params}){
      return{
        ...state,
        messageApplicationLineChart:payload,
        messageApplicationLineChart_params:params
      }
    },
    getAllTenantList(state,{payload}){
      return{
        ...state,
        getAllTenantList:payload,
      }
    },
    getAllApplicationByTenant(state,{payload}){
      return{
        ...state,
        getAllApplicationByTenant:payload,
      }
    },
    pullAutograph(state,{payload}){
      return{
        ...state,
        pullAutograph:payload,
      }
    },
    pullTemp(state,{payload}){
      return{
        ...state,
        pullTemp:payload
      }
    },
    templateItem(state,{payload}){
      return{
        ...state,
        templateItem:payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        rememberDataChildTabs:'D',

        getTaskList:{},
        getTaskList_params:{
          start:start,
          count:count,
          state:6,
          queryType:0,
          field:'',
          type:3,
        },

        messageItemList:{},
        messageItemList_params:{
          type:0,
          state:6,
          start:start,
          count:count,
          queryType:0,
          smsType:0,
          startTime:'2000-01-01',
          end:moment().subtract(0, 'days').format('YYYY-MM-DD'),
        },

        messagePieChart:{},
        messagePieChart_params:{
          message_type:0,
        },
        messageTypeCount:{},
        messageTypeCount_params:{},

        messageLineChart:[],
        messageLineChart_params:{
          start:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          end:moment().subtract(0, 'days').format('YYYY/MM/DD'),
        },

        messageApplicationLineChart:{},
        messageApplicationLineChart_params:{
          start:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          end:moment().subtract(0, 'days').format('YYYY-MM-DD'),
        },
        getAllTenantList:[],
        getAllApplicationByTenant:[],
        pullAutograph:null,
        pullTemp:null,
        templateItem:null,
      }
    }
  },
}
