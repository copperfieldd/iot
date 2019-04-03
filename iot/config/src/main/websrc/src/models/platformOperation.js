import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {
  platformConfigList,
  addPlatformConfig,
  delConfigFile,
  getDemoConfigList,
  delConfigDemo,
  addDemoConfig,
  editDemoConfig,
  updPlatformConfig,
  platformConfigItem,
  changeConfigDemoStatus,
  queryParams,
  getServiceDemo,
  getLifeList,
  getDiskList,
  getMemoryList,
  updLifeState,
  updMemoryState,
  updDiskState,
  getLifeState,
  getMemoryState,
  getDiskState,
} from '../services/platformOperation';
import {callStatusInfo, count, start} from '../utils/utils';

export default {
  namespace: 'platformOperation',


  state: {
    config_params: {
      count: count,
      start: start,
    },


    config_list_params: {
      count: count,
      start: start,
    },
    configListHasMore: true,
    configManage_list_list: [],

    demo_params: {
      count: count,
      start: start,
    },
    platformConfigList: {},
    demoConfigList: {},

    configManageCheckedValue: {},

    configItem: {},

    life_params: {
      count: count,
      start: start,
    },
    lifeList: {},
    RAM_params: {
      count: count,
      start: start,
    },
    RAMList: {},
    disk_params: {
      count: count,
      start: start,
    },
    diskList: {},

    queryParams: null,
    pullServiceList: [],

    lifeState: {},
    memoryState: {},
    diskState: {},
    tabsKey: '1',
  },

  effects: {
    * fetch_platformConfigList_action({payload}, {call, put}) {
      const response = yield call(platformConfigList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'platformListResult',
            payload: {
              response: response.value,
              params: payload,
            },
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_platformConfigItem_action({payload}, {call, put}) {
      const response = yield call(platformConfigItem, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'platformConfigItemResult',
            payload: response,
            id: payload.id,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_platformConfigList_list_action({payload, isSearch, callBack}, {call, put,select}) {
      let configListHasMore = true;
      const response = yield call(platformConfigList, payload);
      const stateValue = yield select(state=>state.platformOperation.configManage_list_list);
      try {
        if (response.status === 0) {
          if (response.value.list.length != 10) {
            configListHasMore = false;
            //message.warning('数据加载完毕');
          } else {
            configListHasMore = true;
          }
          if(isSearch){
            yield call(callBack,response.value.list)
          }else{
            yield call(callBack,stateValue.concat(response.value.list));
          }
          yield put({
            type: 'platformListResult_list',
            payload: {
              response: response.value,
              params: payload,
              isSearch: isSearch,
              configListHasMore: configListHasMore,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addPlatformConfig_action({payload}, {call, put}) {
      const response = yield call(addPlatformConfig, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updPlatformConfig_action({payload}, {call, put,select}) {
      const response = yield call(updPlatformConfig, payload);
      const params = yield select(state=>state.platformOperation.config_params);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_platformConfigList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delConfigFile_action({payload, params}, {call, put}) {
      const response = yield call(delConfigFile, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_platformConfigList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getDemoConfigList_action({payload}, {call, put}) {
      const response = yield call(getDemoConfigList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'demoConfigListResult',
            payload: {
              response: response.value,
              params: payload,
            }
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_addDemoConfig_action({payload,callBack}, {call, put}) {
      const response = yield call(addDemoConfig, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          if(callBack){
            yield call(callBack,response.value)
          }
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_editDemoConfig_action({payload}, {call, put,select}) {
      const response = yield call(editDemoConfig, payload);
      const params = yield select(state=>state.platformOperation.demo_params);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_getDemoConfigList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_delConfigDemo_action({payload, params}, {call, put}) {
      const response = yield call(delConfigDemo, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_getDemoConfigList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);

      }
    },

    * fetch_changeConfigDemoStatus_action({payload, params}, {call, put}) {
      const response = yield call(changeConfigDemoStatus, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
          yield put({
            type: 'fetch_getDemoConfigList_action',
            payload: params,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_queryParams_action({payload}, {call, put}) {
      const response = yield call(queryParams, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'queryParamsResult',
            payload: response.value,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getServiceDemo_action({payload}, {call, put}) {
      const response = yield call(getServiceDemo, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'pullServiceList',
            payload: response.value,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getLifeList_action({payload}, {call, put}) {
      const response = yield call(getLifeList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'lifeListResult',
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

    * fetch_getDiskList_action({payload}, {call, put}) {
      const response = yield call(getDiskList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'diskListResult',
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

    * fetch_getMemoryList_action({payload}, {call, put}) {
      const response = yield call(getMemoryList, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'memoryListResult',
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

    // updLifeState,
    // updMemoryState,
    // updDiskState,

    * fetch_updLifeState_action({payload}, {call, put}) {
      const response = yield call(updLifeState, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updMemoryState_action({payload}, {call, put}) {
      const response = yield call(updMemoryState, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_updDiskState_action({payload}, {call, put}) {
      const response = yield call(updDiskState, payload);
      try {
        if (response.status === 0) {
          callStatusInfo(response.status,window,response.value);
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },


    // getLifeState,
    // getMemoryState,
    // getDiskState,

    * fetch_getLifeState_action({payload}, {call, put}) {
      const response = yield call(getLifeState, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'lifeStateResult',
            payload: response.value,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getMemoryState_action({payload}, {call, put}) {
      const response = yield call(getMemoryState, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'memoryStateResult',
            payload: response.value,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

    * fetch_getDiskState_action({payload}, {call, put}) {
      const response = yield call(getDiskState, payload);
      try {
        if (response.status === 0) {
          yield put({
            type: 'diskStateResult',
            payload: response.value,
          })
        } else {
          callStatusInfo(response.status,window,response.value);
        }
      } catch (e) {
        callStatusInfo(1001,window,response.value);
      }
    },

  },

  reducers: {
    platformListResult(state, {payload}) {
      return {
        ...state,
        platformConfigList: payload.response,
        config_params: payload.params,
      }
    },

    platformConfigItemResult(state, {payload, id}) {
      let value = {
        [id]: {...payload.value},
      };
      return {
        ...state,
        configItem: {
          ...state.configItem,
          ...value,
        }
      }
    },

    demoConfigListResult(state, {payload}) {
      return {
        ...state,
        demoConfigList: payload.response,
        demo_params: payload.params,
      }
    },

    platformListResult_list(state, {payload}) {
      if (payload.isSearch) {
        state.configManage_list_list = payload.response.list;
      } else {
        state.configManage_list_list = state.configManage_list_list.concat(payload.response.list);
      }

      return {
        ...state,
        configListHasMore: payload.configListHasMore,
        config_list_params: payload.params,
      };
    },

    configManageCheckedValue(state, {payload}) {
      return {
        ...state,
        configManageCheckedValue: payload,
      }
    },

    queryParamsResult(state, {payload}) {
      return {
        ...state,
        queryParams: payload,
      }
    },

    pullServiceList(state, {payload}) {
      return {
        ...state,
        pullServiceList: payload
      }
    },

    lifeListResult(state, {payload, params}) {
      return {
        ...state,
        lifeList: payload,
        life_params: params,
      }
    },

    diskListResult(state, {payload, params}) {
      return {
        ...state,
        diskList: payload,
        disk_params: params,

      }
    },

    memoryListResult(state, {payload, params}) {
      return {
        ...state,
        RAMList: payload,
        RAM_params: params,
      }
    },

    lifeStateResult(state, {payload}) {
      return {
        ...state,
        lifeState: payload,
      }
    },

    memoryStateResult(state, {payload}) {
      return {
        ...state,
        memoryState: payload,
      }
    },

    diskStateResult(state, {payload}) {
      return {
        ...state,
        diskState: payload,
      }
    },

    fetch_tabsKey_action(state, {payload}) {
      return {
        ...state,
        tabsKey: payload,
      }
    },

    clearCache(state,{payload}){
      return{
        ...state,
        config_params: {
          count: count,
          start: start,
        },

        config_list_params: {
          count: count,
          start: start,
        },
        configListHasMore: true,
        configManage_list_list: [],

        demo_params: {
          count: count,
          start: start,
        },
        platformConfigList: {},
        demoConfigList: {},

        configManageCheckedValue: {},


        configItem: {},

        life_params: {
          count: count,
          start: start,
        },
        lifeList: {},
        RAM_params: {
          count: count,
          start: start,
        },
        RAMList: {},
        disk_params: {
          count: count,
          start: start,
        },
        diskList: {},

        queryParams: null,
        pullServiceList: [],

        lifeState: {},
        memoryState: {},
        diskState: {},
        tabsKey: '1',
      }
    }


  },
}
