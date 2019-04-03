import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getDeviceList,//设备列表
  addDevice,//新增设备管理
  getDeviceToken,//随机token
  refreshToken,//重置token
  deviceAuhorizationItem,//设备详情认证信息
  deviceBaiscItem,//设备详情基础信息
  deviceDataItem,//设备数据
  deviceEventItem,//设备事件详情
  deviceItemDataItem,//设备数据详情
  deviceImportItem,//导入记录详情
  delDeviceItem,//删除导入记录
  tokenExport,//token导出
  delDevice,//删除设备
  devicesImport,//批量导入
  updDevice,//修改
  deviceImportList,
  deviceImportPerview,
  exportReocrd,
  dataExport,
} from '../services/equipment';
import {count, start, smallCount, ExcelDownload, callStatusInfo} from "../utils/utils";


export default {
  namespace:'equipmentManage',


  state:{
    deviceList:{
    },
    deviceList_params:{
      start:start,
      count:count
    },
    deviceToken:null,
    deviceBaiscItems:{},
    deviceAuhorizationItems:{},


    deviceDataItemList:null,

    deviceDataItem_params:{
      start:start,
      count:count,
    },

    dataDataItemList:null,

    dataDataItem_params:{
      start:start,
      count:count,
    },

    deviceEventItemList:{},
    deviceEventItem_params:{
      start:start,
      count:count,
    },
    deviceItemDataItems:{},


    deviceImportList:{},
    deviceImportList_params:{
      start:start,
      count:count,
    },

    deviceImportPerview:{},
    deviceImportPerview_params:{
      start:start,
      count:count,
    },


    deviceImportItem:{},
    deviceImportItem_params:{
      start:start,
      count:count,
    },
  },

  effects:{
    * fetch_getDeviceList_action({payload},{call,put}){
      const response = yield call(getDeviceList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceListResult',
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

    * fetch_addDevice_action({payload,callback},{call,put}){
      const response = yield call(addDevice,payload);
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

    * fetch_updDevice_action({payload},{call,put,select}){
      const params  = yield select(state=>state.equipmentManage.deviceList_params);
      const response = yield call(updDevice,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getDeviceList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_getDeviceToken_action({payload,callback},{call,put}){
      const response = yield call(getDeviceToken,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceTokenResult',
            payload:response.value,
          })
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
    * fetch_refreshToken_action({payload,callback},{call,put}){
      const response = yield call(refreshToken,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceRefreshTokenResult',
            payload:{token:response.value},
            id:payload.id,
          })
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

    * fetch_deviceBaiscItem_action({payload},{call,put}){
      const response = yield call(deviceBaiscItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceBaiscItemResult',
            payload:response.value,
            id:payload.id,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_deviceAuhorizationItem_action({payload},{call,put}){
      const response = yield call(deviceAuhorizationItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceAuhorizationItemResult',
            payload:response.value,
            id:payload.id,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_deviceDataItem_action({payload,callback},{call,put}){
      const response = yield call(deviceDataItem,payload);
      try {
        if(response.status===0){
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type:'deviceDataItemResult',
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

    * fetch_dataDataItem_action({payload,callback},{call,put}){
      const response = yield call(deviceDataItem,payload);
      try {
        if(response.status===0){
          if(callback){
            yield call(callback,response.value)
          }
          yield put({
            type:'dataDataItemResult',
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

    * fetch_deviceEventItem_action({payload},{call,put}){
      const response = yield call(deviceEventItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceEventItemResult',
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

    * fetch_deviceItemDataItem_action({payload},{call,put}){
      const response = yield call(deviceItemDataItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceItemDataItemResult',
            payload:response.value,
            id:payload.id,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delDevice_action({payload,params},{call,put}){
      const response = yield call(delDevice,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getDeviceList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_tokenExport_action({payload,callback},{call,put}){
      const response = yield call(tokenExport, payload);
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob=>{
            ExcelDownload(blob,filename);
            callback&&callback();//关闭弹窗
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_dataExport_action({payload,callback},{call,put}){
      const response = yield call(dataExport, payload);
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob=>{
            ExcelDownload(blob,filename);
            callback&&callback();//关闭弹窗
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_exportReocrd_action({payload},{call,put}){
      const response = yield call(exportReocrd,payload);
      try {
        if (response.filename) {
          const filename = response.filename;
          response.blob.then(blob=>{
            ExcelDownload(blob,filename);
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_deviceImportList_action({payload},{call,put}){
      const response = yield call(deviceImportList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceImportList',
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

    * fetch_delDeviceItem_action({payload,params},{call,put}){
      const response = yield call(delDeviceItem,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_deviceImportList_action',
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_deviceImportPerview_action({payload},{call,put}){
      const response  = yield call(deviceImportPerview,payload);
      try {
        if(response.status===0) {
          yield put({
            type: 'deviceImportPerview',
            payload: response.value,
            params:payload
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_devicesImport_action({payload},{call,put}){
      const response = yield call(devicesImport,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_deviceImportItem_action({payload},{call,put}){
      const response= yield call(deviceImportItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'deviceImportItem',
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
    deviceListResult(state, {payload, params}) {
      return {
        ...state,
        deviceList: payload,
        deviceList_params: params
      }
    },
    deviceTokenResult(state, {payload}) {
      return {
        ...state,
        deviceToken: payload,
      }
    },
    deviceBaiscItemResult(state, {payload, id}) {
      const item = {
        [id]: {...payload}
      }
      return {
        ...state,
        deviceBaiscItems: {
          ...state.deviceBaiscItems,
          ...item,
        }
      }
    },

    deviceAuhorizationItemResult(state, {payload, id}) {
      const item = {
        [id]: {...payload}
      }
      return {
        ...state,
        deviceAuhorizationItems: {
          ...state.deviceAuhorizationItems,
          ...item,
        }
      }
    },
    deviceRefreshTokenResult(state, {payload, id}) {
      const item = {
        [id]: {...payload}
      }
      return {
        ...state,
        deviceAuhorizationItems: {
          ...state.deviceAuhorizationItems,
          ...item,
        }
      }
    },
    deviceDataItemResult(state, {payload, params}) {
      return {
        ...state,
        deviceDataItemList: payload,
        deviceDataItem_params: params,
      }
    },

    dataDataItemResult(state, {payload, params}) {
      return {
        ...state,
        dataDataItemList: payload,
        dataDataItem_params: params,
      }
    },
    deviceEventItemResult(state, {payload, params}) {
      return {
        ...state,
        deviceEventItemList: payload,
        deviceEventItem_params: params,
      }
    },

    deviceItemDataItemResult(state, {payload, id}) {
      const item = {
        [id]: {...payload}
      }
      return {
        ...state,
        deviceItemDataItems: {
          ...state.deviceItemDataItems,
          ...item,
        }
      }
    },

    deviceImportList(state, {payload, params}) {
      return {
        ...state,
        deviceImportList: payload,
        deviceImportList_params: params

      }
    },
    deviceImportPerview(state,{payload,params}){
      return{
        ...state,
        deviceImportPerview:payload,
        deviceImportPerview_params:params,
      }
    },

    deviceImportItem(state,{payload,params}){
      return{
        ...state,
        deviceImportItem:payload,
        deviceImportItem_params:params,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        deviceList:{},
        deviceList_params:{
          start:start,
          count:count
        },
        deviceToken:null,
        deviceBaiscItems:{},
        deviceAuhorizationItems:{},
        deviceDataItemList:null,

        deviceDataItem_params:{
          start:start,
          count:count,
        },

        dataDataItemList:null,

        dataDataItem_params:{
          start:start,
          count:count,
        },

        deviceEventItemList:{},
        deviceEventItem_params:{
          start:start,
          count:count,
        },
        deviceItemDataItems:{},


        deviceImportList:{},
        deviceImportList_params:{
          start:start,
          count:count,
        },

        deviceImportPerview:{},
        deviceImportPerview_params:{
          start:start,
          count:count,
        },


        deviceImportItem:{},
        deviceImportItem_params:{
          start:start,
          count:count,
        },
      }
    }
  }
}
