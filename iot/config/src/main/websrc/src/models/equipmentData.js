import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getDeviceList,//设备列表
  deviceDataItem,//设备数据详情
  tokenExport,//token导出
  delDevice,//删除设备
  devicesImport,//批量导入,
  deDataItem,
} from '../services/equipment';
import {count, start, smallCount, callStatusInfo} from "../utils/utils";


export default {
  namespace:'equipmentData',


  state:{
    deviceList:{
    },
    deviceList_params:{
      start:start,
      count:count
    },



    deviceDataItemList:null,

    deviceDataItem_params:{
      start:start,
      count:smallCount,
    },

    deDataItem:[],

  },

  effects: {
    * fetch_getDeviceList_action({payload}, {call, put}) {
      const response = yield call(getDeviceList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'deviceListResult',
            payload: response.value,
            params: payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_delDevice_action({payload, params}, {call, put}) {
      const response = yield call(delDevice, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_getDeviceList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_deviceDataItem_action({payload}, {call, put}) {
      const response = yield call(deviceDataItem, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'deviceDataItemResult',
            payload: response.value,
            params: payload,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_deDataItem_action({payload},{call,put}){
      const response = yield call(deDataItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deDataItem',
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

  reducers:{
    deviceListResult(state,{payload,params}){
      return{
        ...state,
        deviceList:payload,
        deviceList_params:params
      }
    },

    deviceDataItemResult(state,{payload,params}){
      return{
        ...state,
        deviceDataItemList:payload,
        deviceDataItem_params:params,
      }
    },

    deDataItem(state,{payload}){
      return{
        ...state,
        deDataItem:payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        deviceList:{
        },
        deviceList_params:{
          start:start,
          count:count
        },



        deviceDataItemList:null,

        deviceDataItem_params:{
          start:start,
          count:smallCount,
        },

        deDataItem:[],
      }
    }

  },
}
