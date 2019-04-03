import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {serviceList,analyticList,addAnalytic,addStiService,updStiService,delStiService,editAnalytic,delAnalytic,
  getStiDateList,
  addStiDate,
  updStiDate,
  delStiDate,
  stiDateItem,
  allTenantNum,
  addTenantNum,
  clientUserNum,
  getAllTenant,
  getAppByTenantId,
  addTenantNumChart,
  totalTenantNumChart,
  clientNewUserNumChart,
  clientTotalUserNumChart,
  applicationNumByTenantId,
  clientNewUserByTenantChart,
  clientTotalUserByTenantChart,
  clientTotalUserByAppId,
  clientNewUserByApp,
  clientTotalUserByApp,
  delDataTable,


  perTotalApi,
  perApiUserTime,
  perApiUseTimeChart,
  perApiUseTimeByTenant,
  perApiByTenant,
  perApiUseTimeByApi,
  perTenantUseApiByApi,
  perAppUseApiByApi,

  eqTenantNum,
  eqDeviceNum,
  eqAllTypeNum,
  eqdefTypeDeviceNum,
  eqAddDeviceNum,
  eqAddDeviceTypeChart,
  eqAddDeviceChart,
  eqAddAppChart,
  eqTotalDeviceTypeChart,
  eqTotalDeviceChart,
  eqTotalAppChart,
  eqAddAppByTenant,
  eqTotalDeviceByApp,
  eqDeviceBytType,
  eqDeviceType,
  eqNumByEqTypeChart,

  /****
   * 支付
   * @param value
   */
  payTenantSum,//接入租户数（汇总）
  payAppSum,//总应用数（汇总）
  payAddAppSum,//新增应用数（汇总）
  payOrderSum,//订单总数（汇总）
  payAddOrderSum,//新增订单数（汇总）
  payOrderChart,//订单数（趋势）
  payAddOrderChart,//新增订单数（趋势）
  payOrderByTenantSum,//租户下应用订单总数（汇总）
  payAddOrderByTenantSum,//租户下新增应用订单数（汇总）
  payOrderByTenantChart,//租户下订单数（趋势）
  payAddOrderByTenantChart,//租户下新增应用订单数（趋势）
  payOrderByAppChart,//应用订单总数（趋势）
  payAddOrderByAppChart,//应用下新增订单数（趋势）

  /***
   * 告警and地理
   * @param key
   */
  warnTimeSum,
  warningMsgTimeSum,
  warningEmailTimeSum,
  warnTimeChart,
  warningMsgTimeChart,
  warningEmailTimeChart,
  positionTenantSum,
  positionAppSum,



} from '../services/statistics'
import {callStatusInfo, count, start} from "../utils/utils";
import moment from "moment";

export default {
  namespace:'dataSti',
  state:{
    hasMore:true,
    serviceListPull_Result:[],
    serviceListPull_params:{
      start:start,
      count:count,
    },
    analyticList:{},
    analytic_params:{
      start:start,
      count:count,
    },
    serviceListTable:{},
    serviceListTable_params:{
      start:start,
      count:count,
    },
    StiDateList:{},
    StiDateList_params:{
      start:start,
      count:count,
    },
    structure:[],
    stiDateItem:{},

    allTenant:[],
    appByTenantId:[],
    allTenantNum:{},
    addTenantNum:{},
    clientUserNum:{},
    applicationNumByTenantId:{},
    clientTotalUserByAppId:{},

    addTenantNumChart:[],
    addTenantNumChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    totalTenantNumChart:[],
    totalTenantNumChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    clientNewUserNumChart:[],
    clientNewUserNumChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    clientTotalUserNumChart:[],
    clientTotalUserNumChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    clientNewUserByTenantChart:[],
    clientNewUserByTenantChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    clientTotalUserByTenantChart:[],
    clientTotalUserByTenantChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    clientNewUserByApp:[],
    clientNewUserByAppParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    clientTotalUserByApp:[],
    clientTotalUserByAppParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },



    /**
     * 权限
     * */
    perTotalApi:null,
    perApiUserTime:null,
    perApiUseTimeChart:[],
    perApiUseTimeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
      interfaceid:'*',
      tenantid:'*',
      appid:'*'
    },
    perApiUseTimeByTenant:null,
    perApiByTenant:[],
    perApiUseTimeByApi:[],
    perApiUseTimeByApiParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    perTenantUseApiByApi:[],
    perTenantUseApiByApiParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    perAppUseApiByApi:[],
    perAppUseApiByApiParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },

    /***
     * 设备
     */

    eqTenantNum:null,
    eqDeviceNum:null,
    eqAllTypeNum:null,
    eqdefTypeDeviceNum:null,
    eqAddDeviceNum:null,
    eqAddDeviceTypeChart:[],
    eqAddDeviceTypeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    eqAddDeviceChart:[],
    eqAddDeviceChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
      tenantid:'*',
      appid:'*'
    },

    eqNumByEqTypeChart:[],
    eqNumByEqTypeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
      typeid:'*',
    },
    eqAddAppChart:[],
    eqAddAppChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },

    eqTotalDeviceTypeChart:[],
    eqTotalDeviceTypeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    eqTotalDeviceChart:[],
    eqTotalDeviceChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
      tenantid:'*',
      appid:'*'
    },
    eqTotalAppChart:[],
    eqTotalAppChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },

    eqAddAppByTenant:null,
    eqTotalDeviceByApp:null,
    eqDeviceBytType:null,
    eqDeviceType:[],

    /****
     * 支付
     * @param value
     */
    payTenantSum:null,
    payAppSum:null,
    payAddAppSum:null,
    payOrderSum:null,
    payAddOrderSum:null,
    payOrderChart:[],//订单数（趋势）
    payOrderChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
      tenantid:'*',
      appid:'*'
    },
    payAddOrderChart:[],//新增订单数（趋势）
    payAddOrderChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
      tenantid:'*',
      appid:'*'
    },
    payOrderByTenantSum:null,
    payAddOrderByTenantSum:null,
    payOrderByTenantChart:[],
    payOrderByTenantChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    payAddOrderByTenantChart:[],
    payAddOrderByTenantChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    payOrderByAppChart:[],
    payOrderByAppChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    payAddOrderByAppChart:[],
    payAddOrderByAppChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },


    /***
     * 告警and地理
     * @param key
     */
    warnTimeSum:null,
    warningMsgTimeSum:null,
    warningEmailTimeSum:null,
    warnTimeChart:[],
    warnTimeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    warningMsgTimeChart:[],
    warningMsgTimeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    warningEmailTimeChart:[],
    warningEmailTimeChartParams:{
      starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
      endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
      group:'day',
    },
    positionTenantSum:null,
    positionAppSum:null,

  },

  effects:{
    * fetch_serviceList_action({payload,isSearch,callBack},{call,put}){
      const response = yield call(serviceList,payload);
      let hasMore = true;
      try {
        if(response.status===0){
          if (response.value.list.length != 10) {
            hasMore = false;
            //message.warning('数据加载完毕');
          } else {
            hasMore = true;
          }
          yield put({
            type:"serviceListResult",
            payload:{
              list:response.value.list,
              isSearch: isSearch,
              hasMore: hasMore,
              callBack: callBack,
              params:payload,
            }
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_analyticList_action({payload},{call,put}){
      const response = yield call(analyticList,payload);
      try {
        if(response.status===0){
          yield put({
            type:"analyticListResult",
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
    * fetch_addAnalytic_action({payload,callback},{call,put}){
      const response = yield call(addAnalytic,payload);
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
    * fetch_delAnalytic_aciton({payload,params},{call,put}){
      const response = yield call(delAnalytic,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_analyticList_action",
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_serviceListTable_action({payload},{call,put}){
      const response = yield call(serviceList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'serviceListTableResult',
            payload:response.value,
            params:payload
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_addStiService_action({payload,callback},{call,put}){
      const response = yield call(addStiService,payload);
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
    * fetch_updStiService_action({payload},{call,put,select}){
      const response = yield call(updStiService,payload);
      const params = yield select(state=>state.dataSti.serviceListTable_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_serviceListTable_action",
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_delStiService_action({payload,params},{call,put}){
      const response = yield call(delStiService,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_serviceListTable_action",
            payload:params,
          })
        }else{
          callStatusInfo(1001,window,response.value);
        }
      } catch (e) {
        callStatusInfo(response.status,window,response.value);
      }
    },
    * fetch_editAnalytic_action({payload},{call,put,select}){
      const response = yield call(editAnalytic,payload);
      const params = yield select(state=>state.dataSti.analytic_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:"fetch_analyticList_action",
            payload:params
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getStiDateList_action({payload},{call,put}){
      const response = yield call(getStiDateList,payload)
      try {
        if(response.status===0){
          yield put({
            type:'StiDateList',
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
    * fetch_addStiDate_action({payload,callback},{call,put}){
      const response = yield call(addStiDate,payload);
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
    * fetch_updStiDate_action({payload},{call,put,select}){
      const response = yield call(updStiDate,payload);
      const params = yield select(state=>state.dataSti.StiDateList_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getStiDateList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_delStiDate_action({payload,params},{call,put}){
      const response = yield call(delStiDate,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getStiDateList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_stiDateItem_action({payload},{call,put}){
      const response = yield call(stiDateItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'stiDateItem',
            payload:response.value,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    * fetch_getAllTenant_action({payload,callback},{call,put}){
      const response = yield call(getAllTenant,payload);
      try {
        if(response.status ===0 ){
          yield put({
            type:'allTenant',
            payload:response.value,
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
    * fetch_getAppByTenantId_action({payload,callback},{call,put}){
      const response = yield call(getAppByTenantId,payload);
      try {
        if(response.status===0){
          yield put({
            type:'appByTenantId',
            payload:response.value,
          });
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
    * fetch_allTenantNum_action({payload},{call,put}){
      const response = yield call(allTenantNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'allTenantNum',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_addTenantNum_action({payload},{call,put}){
      const response = yield call(addTenantNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:"addTenantNum",
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_clientUserNum_action({payload},{call,put}){
      const response = yield call(clientUserNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:"clientUserNum",
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_addTenantNumChart_action({payload},{call,put}){
      const response = yield call(addTenantNumChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:"addTenantNumChart",
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
    * fetch_totalTenantNumChart_action({payload},{call,put}){
      const response = yield call(totalTenantNumChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'totalTenantNumChart',
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
    * fetch_clientNewUserNumChart_action({payload},{call,put}){
      const response = yield call(clientNewUserNumChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'clientNewUserNumChart',
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
    * fetch_clientTotalUserNumChart_action({payload},{call,put}){
      const response = yield call(clientTotalUserNumChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'clientTotalUserNumChart',
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
    * fetch_applicationNumByTenantId_action({payload},{call,put}){
      const response = yield call(applicationNumByTenantId,payload);
      try {
        if(response.status===0){
          yield put({
            type:'applicationNumByTenantId',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_clientNewUserByTenantChart_action({payload},{call,put}){
      const response = yield call(clientNewUserByTenantChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'clientNewUserByTenantChart',
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
    * fetch_clientTotalUserByTenantChart_action({payload},{call,put}){
      const response = yield call(clientTotalUserByTenantChart,payload);
      try {
        if(response.status===0) {
          yield put({
            type:'clientTotalUserByTenantChart',
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
    * fetch_clientTotalUserByAppId_action({payload},{call,put}){
      const response = yield call(clientTotalUserByAppId,payload);
      try {
        if(response.status===0){
          yield put({
            type:'clientTotalUserByAppId',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_clientNewUserByApp_action({payload},{call,put}){
      const response = yield call(clientNewUserByApp,payload);
      try {
        if(response.status===0){
          yield put({
            type:'clientNewUserByApp',
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
    * fetch_clientTotalUserByApp_action({payload},{call,put}){
      const response = yield call(clientTotalUserByApp,payload);
      try {
        if(response.status===0){
          yield put({
            type:'clientTotalUserByApp',
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

    /**
     * 权限
     * */
    * fetch_perTotalApi_action({payload},{call,put}){
      const response = yield call(perTotalApi,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perTotalApi',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_perApiUserTime_action({payload},{call,put}){
      const response = yield call(perApiUserTime,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perApiUserTime',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_perApiUseTimeChart_action({payload},{call,put}){
      const response = yield call(perApiUseTimeChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perApiUseTimeChart',
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
    * fetch_perApiUseTimeByTenant_action({payload},{call,put}){
      const response = yield call(perApiUseTimeByTenant,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perApiUseTimeByTenant',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_perApiByTenant_action({payload,callback},{call,put}){
      const response = yield call(perApiByTenant,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perApiByTenant',
            payload:response.value,
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
    * fetch_perApiUseTimeByApi_action({payload},{call,put}){
      const response = yield call(perApiUseTimeByApi,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perApiUseTimeByApi',
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
    * fetch_perTenantUseApiByApi_action({payload},{call,put}){
      const response = yield call(perTenantUseApiByApi,payload);
      try {
        if (response.status===0){
          yield put({
            type:'perTenantUseApiByApi',
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
    * fetch_perAppUseApiByApi_action({payload},{call,put}){
      const response = yield call(perAppUseApiByApi,payload);
      try {
        if(response.status===0){
          yield put({
            type:'perAppUseApiByApi',
            payload:response.value,
            params:payload
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    /***
     * 设备
     */

    * fetch_eqTenantNum_action({payload},{call,put}){
      const response = yield call(eqTenantNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqTenantNum',
            payload:response.value[0]
          })
        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqDeviceNum_action({payload},{call,put}){
      const response = yield call(eqDeviceNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqDeviceNum',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqAllTypeNum_action({payload},{call,put}){
      const response = yield call(eqAllTypeNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqAllTypeNum',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqdefTypeDeviceNum_action({payload},{call,put}){
      const response = yield call(eqdefTypeDeviceNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqdefTypeDeviceNum',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqAddDeviceNum_action({payload},{call,put}){
      const response = yield call(eqAddDeviceNum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqAddDeviceNum',
            payload:response.value[0],
          })
        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqAddDeviceTypeChart_action({payload},{call,put}){
      const response = yield call(eqAddDeviceTypeChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqAddDeviceTypeChart',
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
    * fetch_eqAddDeviceChart_action({payload},{call,put}){
      const response = yield call(eqAddDeviceChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqAddDeviceChart',
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
    * fetch_eqAddAppChart_action({payload},{call,put}){
      const response = yield call(eqAddAppChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqAddAppChart',
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
    * fetch_eqTotalDeviceTypeChart_action({payload},{call,put}){
      const response = yield call(eqTotalDeviceTypeChart,payload)
      try {
        if(response.status===0){
          yield put({
            type:'eqTotalDeviceTypeChart',
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
    * fetch_eqTotalDeviceChart_action({payload},{call,put}){
      const response = yield call(eqTotalDeviceChart,payload)
      try {
        if(response.status===0){
          yield put({
            type:'eqTotalDeviceChart',
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
    * fetch_eqTotalAppChart_action({payload},{call,put}){
      const response = yield call(eqTotalAppChart,payload)
      try {
        if(response.status===0){
          yield put({
            type:'eqTotalAppChart',
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
    * fetch_eqAddAppByTenant_action({payload},{call,put}){

      const response = yield call(eqAddAppByTenant,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqAddAppByTenant',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqTotalDeviceByApp_action({payload},{call,put}){
      const response = yield call(eqTotalDeviceByApp,payload)
      try {
        if(response.status===0){
          yield put({
            type:'eqTotalDeviceByApp',
            payload:response.value[0]
          })
        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqDeviceBytType_action({payload},{call,put}){
      const response = yield call(eqDeviceBytType,payload);
      try {
        if(response.status ===0 ){
          yield put({
            type:'eqDeviceBytType',
            payload:response.value[0],
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_eqDeviceType_action({payload,callback},{call,put}){
      const response = yield call(eqDeviceType,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqDeviceType',
            payload:response.value.value,
          })
          if(callback){
            yield call(callback,response.value.value)
          }
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_eqNumByEqTypeChart_action({payload,callback},{call,put}){
      const response = yield call(eqNumByEqTypeChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'eqNumByEqTypeChart',
            payload:response.value,
            params:payload,
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

    /****
     * 支付
     * @param value
     */
    //接入租户数（汇总）
    * fetch_payTenantSum_action({payload},{call,put}){
      const response = yield call(payTenantSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payTenantSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //总应用数（汇总）
    * fetch_payAppSum_action({payload},{call,put}){
      const response = yield call(payAppSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAppSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //新增应用数（汇总）
    * fetch_payAddAppSum_action({payload},{call,put}){
      const response = yield call(payAddAppSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAddAppSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //订单总数（汇总）
    * fetch_payOrderSum_action({payload},{call,put}){
      const response = yield call(payOrderSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payOrderSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //新增订单数（汇总）
    * fetch_payAddOrderSum_action({payload},{call,put}){
      const response = yield call(payAddOrderSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAddOrderSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //总订单数（趋势）
    * fetch_payOrderChart_action({payload},{call,put}) {
      const response = yield call(payOrderChart, payload);
      try {
        if(response.status===0){
          yield put({
            type:'payOrderChart',
            payload:response.value,
            params:payload,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //新增订单数（趋势）
    * fetch_payAddOrderChart_action({payload},{call,put}) {
      const response = yield call(payAddOrderChart, payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAddOrderChart',
            payload:response.value,
            params:payload,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //租户下应用订单总数（汇总）
    * fetch_payOrderByTenantSum_action({payload},{call,put}){
      const response = yield call(payOrderByTenantSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payOrderByTenantSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //租户下新增应用订单数（汇总）
    * fetch_payAddOrderByTenantSum_action({payload},{call,put}){
      const response = yield call(payAddOrderByTenantSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAddOrderByTenantSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //租户下订单数（趋势）
    * fetch_payOrderByTenantChart_action({payload},{call,put}) {
      const response = yield call(payOrderByTenantChart, payload);
      try {
        if(response.status===0){
          yield put({
            type:'payOrderByTenantChart',
            payload:response.value,
            params:payload,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    //租户下新增应用订单数（趋势）
    * fetch_payAddOrderByTenantChart_action({payload},{call,put}) {
      const response = yield call(payAddOrderByTenantChart, payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAddOrderByTenantChart',
            payload:response.value,
            params:payload,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
    * fetch_payOrderByAppChart_action({payload},{call,put}){
      const response = yield call(payOrderByAppChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payOrderByAppChart',
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
    * fetch_payAddOrderByAppChart_action({payload},{call,put}){
      const response = yield call(payAddOrderByAppChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'payAddOrderByAppChart',
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


    /***
     * 告警and地理
     * @param key
     */
    * fetch_warnTimeSum_action({payload},{call,put}){
      const response = yield call(warnTimeSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warnTimeSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_warningMsgTimeSum_action({payload},{call,put}){
      const response = yield call(warningMsgTimeSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warningMsgTimeSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_warningEmailTimeSum_action({payload},{call,put}){
      const response = yield call(warningEmailTimeSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warningEmailTimeSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_warnTimeChart_action({payload},{call,put}){
      const response = yield call(warnTimeChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warnTimeChart',
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

    * fetch_warningMsgTimeChart_action({payload},{call,put}){
      const response = yield call(warningMsgTimeChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warningMsgTimeChart',
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

    * fetch_warningEmailTimeChart_action({payload},{call,put}){
      const response = yield call(warningEmailTimeChart,payload);
      try {
        if(response.status===0){
          yield put({
            type:'warningEmailTimeChart',
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

    * fetch_positionTenantSum_action({payload},{call,put}){
      const response = yield call(positionTenantSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'positionTenantSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_positionAppSum_action({payload},{call,put}){
      const response = yield call(positionAppSum,payload);
      try {
        if(response.status===0){
          yield put({
            type:'positionAppSum',
            payload:response.value[0]
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delDataTable_action({payload,params},{call,put}){
      const response = yield call(delDataTable,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_getStiDateList_action',
            payload:params
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
    serviceListResult(state,{payload}){
      if (payload.isSearch) {
        state.serviceListPull_Result = payload.list;
        payload.callBack&&payload.callBack(state.serviceListPull_Result);
      } else {
        state.serviceListPull_Result = state.serviceListPull_Result.concat(payload.list);
        payload.callBack&&payload.callBack(state.serviceListPull_Result);
      }
      return {
        ...state,
        hasMore: payload.hasMore,
        serviceListPull_params: payload.params,
      };
    },
    analyticListResult(state,{payload,params}){
      return{
        ...state,
        analyticList:payload,
        analytic_params:params,
      }
    },
    serviceListTableResult(state,{payload,params}){
      return{
        ...state,
        serviceListTable:payload,
        serviceListTable_params:params,
      }
    },
    StiDateList(state,{payload,params}){
      return{
        ...state,
        StiDateList:payload,
        StiDateList_params:params
      }
    },
    structure(state,{payload}){
      return{
        ...state,
        structure:payload,
      }
    },
    stiDateItem(state,{payload}){
      return{
        ...state,
        stiDateItem:payload
      }
    },


    allTenant(state,{payload}){
      return{
        ...state,
        allTenant:payload
      }
    },
    appByTenantId(state,{payload}){
      return{
        ...state,
        appByTenantId:payload,
      }
    },
    allTenantNum(state,{payload}){
      return{
        ...state,
        allTenantNum:payload
      }
    },
    addTenantNum(state,{payload}){
      return{
        ...state,
        addTenantNum:payload,
      }
    },
    clientUserNum(state,{payload}){
      return{
        ...state,
        clientUserNum:payload,
      }
    },
    addTenantNumChart(state,{payload,params}){
      return{
        ...state,
        addTenantNumChart:payload,
        addTenantNumChartParams:params,
      }
    },
    totalTenantNumChart(state,{payload,params}){
      return{
        ...state,
        totalTenantNumChart:payload,
        totalTenantNumChartParams:params,
      }
    },
    clientNewUserNumChart(state,{payload,params}){
      return{
        ...state,
        clientNewUserNumChart:payload,
        clientNewUserNumChartParams:params,
      }
    },
    eqNumByEqTypeChart(state,{payload,params}){
      return{
        ...state,
        eqNumByEqTypeChart:payload,
        eqNumByEqTypeChartParams:params,
      }
    },
    clientTotalUserNumChart(state,{payload,params}){
      return{
        ...state,
        clientTotalUserNumChart:payload,
        clientTotalUserNumChartParams:params,
      }
    },
    applicationNumByTenantId(state,{payload,params}){
      return{
        ...state,
        applicationNumByTenantId:payload,
      }
    },
    clientNewUserByTenantChart(state,{payload,params}){
      return{
        ...state,
        clientNewUserByTenantChart:payload,
        clientNewUserByTenantChartParams:params,
      }
    },
    clientTotalUserByTenantChart(state,{payload,params}){
      return{
        ...state,
        clientTotalUserByTenantChart:payload,
        clientTotalUserByTenantChartParams:params,
      }
    },
    clientTotalUserByAppId(state,{payload}){
      return{
        ...state,
        clientTotalUserByAppId:payload,
      }
    },
    clientNewUserByApp(state,{payload,params}){
      return{
        ...state,
        clientNewUserByApp:payload,
        clientNewUserByAppParams:params
      }
    },
    clientTotalUserByApp(state,{payload,params}){
      return{
        ...state,
        clientTotalUserByApp:payload,
        clientTotalUserByAppParams:params,
      }
    },


    perTotalApi(state,{payload}){
      return{
        ...state,
        perTotalApi:payload,
      }
    },
    perApiUserTime(state,{payload}){
      return{
        ...state,
        perApiUserTime:payload,
      }
    },
    perApiUseTimeChart(state,{payload,params}){
      return{
        ...state,
        perApiUseTimeChart:payload,
        perApiUseTimeChartParams:params,
      }
    },
    perApiUseTimeByTenant(state,{payload}){
      return {
        ...state,
        perApiUseTimeByTenant:payload
      }
    },
    perApiByTenant(state,{payload}){
      return{
        ...state,
        perApiByTenant:payload,
      }
    },
    perApiUseTimeByApi(state,{payload,params}){
      return{
        ...state,
        perApiUseTimeByApi:payload,
        perApiUseTimeByApiParams:params,
      }
    },
    perTenantUseApiByApi(state,{payload,params}){
      return{
        ...state,
        perTenantUseApiByApi:payload,
        perTenantUseApiByApiParams:params,
      }
    },
    perAppUseApiByApi(state,{payload,params}){
      return{
        ...state,
        perAppUseApiByApi:payload,
        perAppUseApiByApiParams:params,
      }
    },


    eqTenantNum(state,{payload}){
      return{
        ...state,
        eqTenantNum:payload,
      }
    },
    eqDeviceNum(state,{payload}){
      return{
        ...state,
        eqDeviceNum:payload,
      }
    },
    eqAllTypeNum(state,{payload}){
      return{
        ...state,
        eqAllTypeNum:payload,
      }
    },
    eqdefTypeDeviceNum(state,{payload}){
      return{
        ...state,
        eqdefTypeDeviceNum:payload,
      }
    },
    eqAddDeviceNum(state,{payload}){
      return{
        ...state,
        eqAddDeviceNum:payload
      }
    },
    eqAddDeviceTypeChart(state,{payload,params}){
      return{
        ...state,
        eqAddDeviceTypeChart:payload,
        eqAddDeviceTypeChartParams:params,
      }
    },
    eqAddDeviceChart(state,{payload,params}){
      return{
        ...state,
        eqAddDeviceChart:payload,
        eqAddDeviceChartParams:params
      }
    },
    eqAddAppChart(state,{payload,params}){
      return {
        ...state,
        eqAddAppChart:payload,
        eqAddAppChartParams:params,
      }
    },

    eqTotalDeviceTypeChart(state,{payload,params}){
      return {
        ...state,
        eqTotalDeviceTypeChart:payload,
        eqTotalDeviceTypeChartParams:params,
      }
    },
    eqTotalDeviceChart(state,{payload,params}){
      return {
        ...state,
        eqTotalDeviceChart:payload,
        eqTotalDeviceChartParams:params,
      }
    },
    eqTotalAppChart(state,{payload,params}){
      return {
        ...state,
        eqTotalAppChart:payload,
        eqTotalAppChartParams:params,
      }
    },
    eqAddAppByTenant(state,{payload}){
      return{
        ...state,
        eqAddAppByTenant:payload,
      }
    },
    eqTotalDeviceByApp(state,{payload}){
      return{
        ...state,
        eqTotalDeviceByApp:payload
      }
    },
    eqDeviceBytType(state,{payload}){
      return{
        ...state,
        eqDeviceBytType:payload,
      }
    },
    eqDeviceType(state,{payload}){
      return{
        ...state,
        eqDeviceType:payload,
      }
    },

    /****
     * 支付
     * @param value
     */
    payTenantSum(state,{payload}){
      return{
        ...state,
        payTenantSum:payload,
      }
    },
    payAppSum(state,{payload}){
      return{
        ...state,
        payAppSum:payload,
      }
    },
    payAddAppSum(state,{payload}){
      return{
        ...state,
        payAddAppSum:payload
      }
    },
    payOrderSum(state,{payload}){
      return{
        ...state,
        payOrderSum:payload,
      }
    },
    payAddOrderSum(state,{payload}){
      return{
        ...state,
        payAddOrderSum:payload
      }
    },

    payOrderChart(state,{payload,params}){
      return{
        ...state,
        payOrderChart:payload,
        payOrderChartParams:params,
      }
    },
    payAddOrderChart(state,{payload,params}){
      return{
        ...state,
        payAddOrderChart:payload,
        payAddOrderChartParams:params,
      }
    },
    payOrderByTenantSum(state,{payload}){
      return{
        ...state,
        payOrderByTenantSum:payload,
      }
    },
    payAddOrderByTenantSum(state,{payload}){
      return{
        ...state,
        payAddOrderByTenantSum:payload,
      }
    },
    payOrderByTenantChart(state,{payload,params}){
      return{
        ...state,
        payOrderByTenantChart:payload,
        payOrderByTenantChartParams:params,
      }
    },
    payAddOrderByTenantChart(state,{payload,params}){
      return{
        ...state,
        payAddOrderByTenantChart:payload,
        payAddOrderByTenantChartParams:params,
      }
    },
    payOrderByAppChart(state,{payload,params}){
      return{
        ...state,
        payOrderByAppChart:payload,
        payOrderByAppChartParams:params,
      }
    },
    payAddOrderByAppChart(state,{payload,params}){
      return{
        ...state,
        payAddOrderByAppChart:payload,
        payAddOrderByAppChartParams:params,
      }
    },



    /***
     * 告警and地理
     * @param key
     */

    warnTimeSum(state,{payload}){
      return{
        ...state,
        warnTimeSum:payload,
      }
    },

    warningMsgTimeSum(state,{payload}){
      return{
        ...state,
        warningMsgTimeSum:payload
      }
    },

    warningEmailTimeSum(state,{payload}){
      return{
        ...state,
        warningEmailTimeSum:payload
      }
    },

    warnTimeChart(state,{payload,params}){
      return{
        ...state,
        warnTimeChart:payload,
        warnTimeChartParams:params,
      }
    },
    warningMsgTimeChart(state,{payload,params}){
      return{
        ...state,
        warningMsgTimeChart:payload,
        warningMsgTimeChartParams:params,
      }
    },

    warningEmailTimeChart(state,{payload,params}){
      return{
        ...state,
        warningEmailTimeChart:payload,
        warningEmailTimeChartParams:params,
      }
    },

    positionTenantSum(state,{payload}){
      return{
        ...state,
        positionTenantSum:payload,
      }
    },
    positionAppSum(state,{payload}){
      return{
        ...state,
        positionAppSum:payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        hasMore:true,
        serviceListPull_Result:[],
        serviceListPull_params:{
          start:start,
          count:count,
        },
        analyticList:{},
        analytic_params:{
          start:start,
          count:count,
        },
        serviceListTable:{},
        serviceListTable_params:{
          start:start,
          count:count,
        },
        StiDateList:{},
        StiDateList_params:{
          start:start,
          count:count,
        },
        structure:[],
        stiDateItem:{},

        allTenant:[],
        appByTenantId:[],
        allTenantNum:{},
        addTenantNum:{},
        clientUserNum:{},
        applicationNumByTenantId:{},
        clientTotalUserByAppId:{},

        addTenantNumChart:[],
        addTenantNumChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        totalTenantNumChart:[],
        totalTenantNumChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        clientNewUserNumChart:[],
        clientNewUserNumChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        clientTotalUserNumChart:[],
        clientTotalUserNumChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        clientNewUserByTenantChart:[],
        clientNewUserByTenantChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        clientTotalUserByTenantChart:[],
        clientTotalUserByTenantChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        clientNewUserByApp:[],
        clientNewUserByAppParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        clientTotalUserByApp:[],
        clientTotalUserByAppParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },



        /**
         * 权限
         * */
        perTotalApi:null,
        perApiUserTime:null,
        perApiUseTimeChart:[],
        perApiUseTimeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
          interfaceid:'*',
          tenantid:'*',
          appid:'*'
        },
        perApiUseTimeByTenant:null,
        perApiByTenant:[],
        perApiUseTimeByApi:[],
        perApiUseTimeByApiParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        perTenantUseApiByApi:[],
        perTenantUseApiByApiParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        perAppUseApiByApi:[],
        perAppUseApiByApiParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },

        /***
         * 设备
         */

        eqTenantNum:null,
        eqDeviceNum:null,
        eqAllTypeNum:null,
        eqdefTypeDeviceNum:null,
        eqAddDeviceNum:null,
        eqAddDeviceTypeChart:[],
        eqAddDeviceTypeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        eqAddDeviceChart:[],
        eqAddDeviceChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
          tenantid:'*',
          appid:'*'
        },
        eqAddAppChart:[],
        eqAddAppChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },

        eqTotalDeviceTypeChart:[],
        eqTotalDeviceTypeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        eqTotalDeviceChart:[],
        eqTotalDeviceChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
          tenantid:'*',
          appid:'*'
        },
        eqNumByEqTypeChart:[],
        eqNumByEqTypeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
          typeid:'*',
        },
        eqTotalAppChart:[],
        eqTotalAppChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },

        eqAddAppByTenant:null,
        eqTotalDeviceByApp:null,
        eqDeviceBytType:null,
        eqDeviceType:[],

        /****
         * 支付
         * @param value
         */
        payTenantSum:null,
        payAppSum:null,
        payAddAppSum:null,
        payOrderSum:null,
        payAddOrderSum:null,
        payOrderChart:[],//订单数（趋势）
        payOrderChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        payAddOrderChart:[],//新增订单数（趋势）
        payAddOrderChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        payOrderByTenantSum:null,
        payAddOrderByTenantSum:null,
        payOrderByTenantChart:[],
        payOrderByTenantChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        payAddOrderByTenantChart:[],
        payAddOrderByTenantChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        payOrderByAppChart:[],
        payOrderByAppChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        payAddOrderByAppChart:[],
        payAddOrderByAppChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },


        /***
         * 告警and地理
         * @param key
         */
        warnTimeSum:null,
        warningMsgTimeSum:null,
        warningEmailTimeSum:null,
        warnTimeChart:[],
        warnTimeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        warningMsgTimeChart:[],
        warningMsgTimeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        warningEmailTimeChart:[],
        warningEmailTimeChartParams:{
          starttime:moment().subtract(7, 'days').format('YYYY/MM/DD'),
          endtime:moment().subtract(1, 'days').format('YYYY/MM/DD'),
          group:'day',
        },
        positionTenantSum:null,
        positionAppSum:null,
      }
    }
  },
}
