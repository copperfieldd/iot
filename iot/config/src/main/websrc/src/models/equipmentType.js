import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {deviceTypeList, addDeviceType,updDeviceType, deviceTypeItem, delDeviceTypeList, adapterItem} from '../services/equipment';
import {callStatusInfo, count, start} from "../utils/utils";


export default {
  namespace:'equipmentType',


  state:{
    deviceTypeList:{},
    deviceType_params:{
      count:count,
      start:start,
    },
  },

  effects:{
    //列表
    * fetch_deviceTypeList_action({payload,callback},{call,put}){
      const response = yield call(deviceTypeList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceTypeListResult',
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

    //新增
    * fetch_addDeviceType_action({payload,callback},{call,put}){
      const response = yield call(addDeviceType,payload);
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


    //修改
    * fetch_updDeviceType_action({payload},{call,put,select}){
      const params  = yield select(state=>state.equipmentType.deviceType_params);
      const response = yield call(updDeviceType,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_deviceTypeList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //详情
    * fetch_deviceTypeItem_action({payload,callback},{call,put}){
      const response = yield call(deviceTypeItem,payload);
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


    * fetch_adapterItem_action({payload,callback},{call,put}){
      const response = yield call(adapterItem,payload);
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

    //删除
    * fetch_delDeviceTypeList_action({payload,params},{call,put}){
      const response = yield call(delDeviceTypeList,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_deviceTypeList_action',
            payload:params,
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
    deviceTypeListResult(state,{payload,params}){
      return{
        ...state,
        deviceTypeList:payload,
        deviceType_params:params,
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        deviceTypeList:{},
        deviceType_params:{
          count:count,
          start:start,
        },
      }
    }
  },
}
