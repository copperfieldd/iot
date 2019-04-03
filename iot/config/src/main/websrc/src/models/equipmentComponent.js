import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  componentList,
  updComponent,
  addComponent,
  delComponent,
  componentItem,
} from '../services/equipment';
import {count, start} from "../utils/utils";


export default {
  namespace:'equipmentComponent',

  state:{
    componentList:{},
    componentList_params:{
      start:start,
      count:count,
    },
    componentItems:{},
  },

  effects:{
    * fetch_componentList_action({payload},{call,put}){
      const response = yield call(componentList,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'componentListResult',
            payload:response.value,
            params:payload,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败，请稍后再试！')
      }
    },

    * fetch_updComponent_action({payload},{call,put}){
      const response = yield call(updComponent,payload);
      try {
        if(response.status === 0){
          message.success(response.message);
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败，请稍后再试！')
      }
    },

    * fetch_addComponent_action({payload,callback},{call,put}){
      const response = yield call(addComponent,payload);
      try {
        if(response.status === 0){
          message.success(response.message);
          if(callback){
            yield call(callback,response.value)
          }
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败，请稍后再试！')
      }
    },

    * fetch_delComponent_action({payload,params},{call,put}){
      const response = yield call(delComponent,payload);
      try {
        if(response.status === 0){
          message.success(response.message);
          yield put({
            type:'fetch_componentList_action',
            payload:params,
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败，请稍后再试！')
      }
    },

    * fetch_componentItem_action({payload},{call,put}){
      const response = yield call(componentItem,payload);
      try {
        if(response.status === 0){
          yield put({
            type:'componentItemResult',
            payload:response.value,
            id:payload.id
          })
        }else{
          message.error(response.message)
        }
      }catch (e) {
        message.error('请求失败，请稍后再试！')
      }
    },
  },

  reducers:{
    componentListResult(state,{payload,params}){
      return{
        ...state,
        componentList:payload,
        componentList_params:params
      }
    },

    componentItemResult(state,{payload,id}){
      const item = {
        [id]:{...payload}
      };
      return{
        ...state,
        componentItems:{
          ...state.componentItems,
          ...item
        }
      }
    },
  },
}
