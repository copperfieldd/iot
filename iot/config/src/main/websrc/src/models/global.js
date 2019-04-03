import { unit_tree, asset_type,menuData,changePassword,changeCurrentPassword } from '../services/global';
import { message } from 'antd';
import {callStatusInfo, formatter,} from "../utils/utils";
import { refreshRouterData } from "../common/router";
import { getAuthority, setAuthority } from '../utils/authority';
let locale = localStorage.getItem('locale');
let language  = locale;
if(language !== 'cn' && language !== 'en'){
  language = 'cn';
}
export default {
  namespace: 'global',

  state: {
    unit_tree:[],
    asset_type:[],
    collapsed: false,
    menuTree:[],
    local: language || 'cn',
  },

  effects: {
    *fetch_asset_type({ payload }, { call, put, select }) {
      const response = yield call(asset_type, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'asset_type',
            payload: {
              response:response
            }
          });
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },
    *fetch_unit_tree({ payload }, { call, put, select }) {
      const response = yield call(unit_tree, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'unit_tree',
            payload: response.value
          });
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },
    *fetch_menu_data({ payload }, { call, put, select }) {
      const response = yield call(menu_data, payload);
      try {
        if (response.status === 0) {
          const menu = response.value.map(e=>{
            return {
              name:e.text,
              path:'dashboard'
            }
          })

          refreshRouterData(formatter(menuData));
          yield put({
            type: 'menu_data',
            payload: formatter(menuData)
          });
          // refreshRouterData(menu);
          // yield put({
          //   type: 'menu_data',
          //   payload: menu
          // });
        }else{
          callStatusInfo(response.status,window,response.value);
        }
      } catch (error) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getPlatMenu_action({payload},{call,put}){
      const response = yield call(menuData,payload);
      try {
        if(response.status===0){
          yield put({
            type:'menuTree',
            payload:response.value.length>0?response.value[0].children:[]
          });
          sessionStorage.setItem('plat_menu',JSON.stringify(response.value.length>0?response.value[0].children:null))
        }else{
          sessionStorage.removeItem('plat_menu')
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
      }
    },

    *changeLocale({ payload }, { call, put }) {
      localStorage.setItem('locale',payload);
      yield put({
        type: 'local',
        payload: payload,
      });
    },

    * fetch_changePassword_action({payload},{call,put}){
      const response = yield call(changePassword,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
        }else {
          callStatusInfo(response.status,window,response.value);
        }

      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_changeCurrentPassword_action({payload,callback},{call,put}){
      const response = yield call(changeCurrentPassword,payload);
      try {
        if(response.status===0){
          callStatusInfo(response.status,window,response.value);
          if(callback){
            yield call(callback,response)
          }
        }else {
          callStatusInfo(response.status,window,response.value);
        }
      }catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },
  },

  reducers: {
    asset_type(state, {payload}) {
      return {
        ...state,
        asset_type: payload.response.value,
      };
    },
    unit_tree(state, {payload}) {
      return {
        ...state,
        unit_tree: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },

    menuTree(state,{payload}){
      return{
        ...state,
        menuTree:payload
      }
    },
    local(state, { payload }) {
      return {
        ...state,
        local: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
