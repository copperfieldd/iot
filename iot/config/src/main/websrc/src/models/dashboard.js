import { leaderboard, todo, compare, alarm_list, statistics, asset_type, distributed, curve } from '../services/dashboard';
import { message } from 'antd';

export default {
  namespace: 'dashboard',

  state: {
    unit:{
      value:'',
      label:''
    },
    leaderboard: [],
    todo:{
      totalCount:0,
      value:[]
    },
    compare:{},
    alarm_list:[],
    statistics:{
      totalCount:0,
      value:[]
    },
    asset_type:{
      totalCount:1,
      value:[]
    },
    distributed:{},
    curve:{
      x:{
        addCount:0,
        transferCount:0,
        alarmCount:0,
        ldleCount:0,
      }
    }
  },

  effects: {
    *fetch_leaderboard({payload}, { call, put }) {
      const response = yield call(leaderboard,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'leaderboard',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_todo({payload}, { call, put }) {
      const response = yield call(todo,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'todo',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_compare({payload}, { call, put }) {
      const response = yield call(compare,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'compare',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_alarm_list({payload}, { call, put }) {
      const response = yield call(alarm_list,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'alarm_list',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_statistics({payload}, { call, put }) {
      const response = yield call(statistics,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'statistics',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_asset_type({payload}, { call, put }) {
      const response = yield call(asset_type,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'asset_type',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_distributed({payload}, { call, put }) {
      const response = yield call(distributed,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'distributed',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
    *fetch_curve({payload}, { call, put }) {
      const response = yield call(curve,payload);
      try {
        if(response.status === 0){
          yield put({
            type: 'curve',
            payload: {
              response:response,
            }
          });
        }else{
          message.error(response.message);
        }
      } catch (error) {
        message.error('请求失败，请稍后再试!');
      }
    },
  },

  reducers: {
    change_unit(state, {payload}) {
      return {
        ...state,
        unit: payload,
      };
    },
    leaderboard(state, {payload}) {
      return {
        ...state,
        leaderboard: payload.response.value,
      };
    },
    todo(state, {payload}) {
      return {
        ...state,
        todo: payload.response.value,
      };
    },
    compare(state, {payload}) {
      return {
        ...state,
        compare: payload.response.value,
      };
    },
    alarm_list(state, {payload}) {
      return {
        ...state,
        alarm_list: payload.response.value,
      };
    },
    statistics(state, {payload}) {
      return {
        ...state,
        statistics: payload.response.value,
      };
    },
    asset_type(state, {payload}) {
      return {
        ...state,
        asset_type: payload.response.value,
      };
    },
    distributed(state, {payload}) {
      return {
        ...state,
        distributed: payload.response.value,
      };
    },
    curve(state, {payload}) {
      return {
        ...state,
        curve: payload.response.value,
      };
    },
  },
};
