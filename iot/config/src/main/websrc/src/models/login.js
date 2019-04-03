import { routerRedux } from 'dva/router';
import { accountLogin } from '../services/login';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { message } from 'antd';
import moment from "moment";
import {callStatusInfo} from "../utils/utils";
const loginType = JSON.parse(localStorage.getItem('config_loginType'));
const userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
export default {
  namespace: 'login',

  state: {
    status: 0,
    autoLogin:loginType?loginType:false,
    loginInfo:userInfo&&userInfo.value,
  },

  effects: {
    *login({payload,callback}, { call, put, select }) {
      const response = yield call(accountLogin, payload);
      const autoLogin = yield select(state => state.login.autoLogin);
      try {
        if (response.status === 0) {
          // Login successfully
          yield put({
            type:'loginIn',
            payload:response.value
          })
          yield put({
            type: 'changeLoginStatus',
            payload: response,
          });
          if(callback){
            yield call(callback,response)
          }
          if(autoLogin){
            localStorage.setItem('config_user',JSON.stringify(payload));
          }else{
            localStorage.removeItem('config_user');
          }
          reloadAuthorized();
          yield put(routerRedux.push('/'));
        }else{
          // Login failed
          yield put({
            type: 'changeLoginStatus',
            payload: {
              ...response,
              time:moment().format('x')
            },
          });
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },
    *logout(payload, { call, put }) {
      // let response = yield call(accountLogout, payload);
      // const { status } =response;
      // if (status === 0) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 0,
          message:'',
        },
      });
      reloadAuthorized();
      yield put(routerRedux.push('/user/login'));
      // }else{
      //   message.error(response.message)
      // }
    },
    *changeAutoLogin({ payload },{ put }){
      yield put({
        type: 'change',
        payload: payload,
      })
    }
  },

  reducers: {
    change(state, { payload }) {
      localStorage.setItem('config_loginType',JSON.stringify(payload.autoLogin));
      return {
        ...state,
        autoLogin:payload.autoLogin,
      };
    },
    changeLoginStatus(state, { payload }) {
      localStorage.setItem('config_userMenu',JSON.stringify(state.menuData));
      setAuthority(payload);
      return {
        ...state,
        message:payload.message,
        status: payload.status,
        type: payload.type,
        time: payload.time || null,

      };
    },
    loginIn(state,{payload}){
      return{
        ...state,
        loginInfo:payload
      }
    }
  },
};
