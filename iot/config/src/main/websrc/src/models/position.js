import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {countryList,addCountry,editCountry,getAreasTree,delAreaTree,areaItem,delCountry} from '../services/position';
import {count, start, bigCount, callStatusInfo} from "../utils/utils";

export default {
  namespace:'position',


  state:{
    countryList_params:{
      start:start,
      count:count,
    },
    countryList:{

    },


    //下拉加载列表
    countryHasMore: true,
    country_params: {
      count: bigCount,
      start: start,
    },
    country_list: [],
    areasTree:[],

    areaItems:{},
  },

  effects:{
    * fetch_countryList_action({payload},{call,put}){
      const response = yield call(countryList,payload);
      try {
        if(response.status===0){
          yield put({
            type:'countryListResult',
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

    * fetch_delCountry_action({payload,params},{call,put}){
      const response = yield call(delCountry,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_countryList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    //下拉加载角色列表
    * fetch_countryList_list_action({payload, callBack, isSearch}, {call, put}) {
      const response = yield call(countryList, payload);
      let countryHasMore = true;
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            countryHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            countryHasMore = true;
          }
          yield put({
            type: 'positionCountryResult',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              countryHasMore: countryHasMore,
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

    * fetch_addCountry_action({payload,callback},{call,put}){
      const response = yield call(addCountry,payload);
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

    * fetch_editCountry_action({payload},{call,put,select}){
      const response = yield call(editCountry,payload);
      const params = yield select(state=>state.position.countryList_params);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          yield put({
            type:'fetch_countryList_action',
            payload:params,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    *fetch_areasTree_action({payload},{call,put}){
      const response = yield call(getAreasTree,payload);
      try {
        if(response.status===0){
          yield put({
            type:'areasTreeResult',
            payload:response.value,
          })
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delAreaTree_action({payload,callback},{call,put}){
      const response  = yield call(delAreaTree,payload);
      try {
        if(response.status===0){
          if(callback){
            yield call(callback,response)
          }
          callStatusInfo(response.status,window,response.value);
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_areaItem_action({payload},{call,put}){
      const response = yield call(areaItem,payload);
      try {
        if(response.status===0){
          yield put({
            type:'areaItemResult',
            payload:response.value,
            id:payload.id,
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
    countryListResult(state,{payload,params}){
      return{
        ...state,
        countryList_params:params,
        countryList:payload,
      }
    },


    positionCountryResult(state,{payload}){
      if (payload.isSearch) {
        state.country_list = payload.response.list;
        payload.callBack&&payload.callBack(state.country_list);
      } else {
        state.country_list = state.country_list.concat(payload.response.list);
        payload.callBack&&payload.callBack(state.country_list);
      }
      return {
        ...state,
        countryHasMore: payload.countryHasMore,
        country_params: payload.params,
      };
    },

    areasTreeResult(state,{payload}){
      return{
        ...state,
        areasTree:payload
      }
    },

    areaItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      }
      return{
        ...state,
        areaItems:{
          ...state.areaItems,
          ...item,
        }
      }
    },
    clearCache(state,{payload}){
      return{
        ...state,
        countryList_params:{
          start:start,
          count:count,
        },
        countryList:{

        },


        //下拉加载列表
        countryHasMore: true,
        country_params: {
          count: bigCount,
          start: start,
        },
        country_list: [],
        areasTree:[],

        areaItems:{},
      }
    }
  },
}
