import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Form, Card, Tabs, Row, Col, Select,DatePicker,Spin} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import messages from "../../../messages/statistics";
import cus_messages from "../../../messages/customer";
import basicMessages from '../../../messages/common/basicTitle';
import StatisticChart from "../../../components/StatisticChart";
import listToChart from '../../../assets/listToChart.png';
import {formatChartData,starttime,endtime} from '../../../utils/utils'
import {injectIntl} from "react-intl";


const {RangePicker } = DatePicker;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

const TabPane = Tabs.TabPane;

@connect(({dataSti, loading}) => ({
  dataSti,
  allTenantNumLoading: loading.effects['dataSti/fetch_allTenantNum_action'],
  addTenantNumLoading: loading.effects['dataSti/fetch_addTenantNum_action'],
  clientUserNumLoading: loading.effects['dataSti/fetch_clientUserNum_action'],
  loading1:loading.effects['dataSti/fetch_addTenantNumChart_action'],
  loading2:loading.effects['dataSti/fetch_totalTenantNumChart_action'],
  loading3:loading.effects['dataSti/fetch_clientNewUserNumChart_action'],
  loading4:loading.effects['dataSti/fetch_clientTotalUserNumChart_action'],
  loading5:loading.effects['dataSti/fetch_clientNewUserByTenantChart_action'],
  loading6:loading.effects['dataSti/fetch_clientTotalUserByTenantChart_action'],
  loading7:loading.effects['dataSti/fetch_applicationNumByTenantId_action'],
  loading8:loading.effects['dataSti/fetch_clientTotalUserByAppId_action'],
  loading9:loading.effects['dataSti/fetch_clientNewUserByApp_action'],
  loading10:loading.effects['dataSti/fetch_clientTotalUserByApp_action'],
  loading11:loading.effects['dataSti/fetch_perTotalApi_action'],
  loading12:loading.effects['dataSti/fetch_perApiUserTime_action'],
  loading13:loading.effects['dataSti/fetch_perApiUseTimeChart_action'],
  loading14:loading.effects['dataSti/fetch_perApiUseTimeByTenant_action'],
  loading15:loading.effects['dataSti/fetch_perApiUseTimeByApi_action'],
  loading16:loading.effects['dataSti/fetch_perTenantUseApiByApi_action'],
  loading17:loading.effects['dataSti/fetch_perAppUseApiByApi_action'],
  loading18:loading.effects['dataSti/fetch_eqTenantNum_action'],
  loading19:loading.effects['dataSti/fetch_eqDeviceNum_action'],
  loading20:loading.effects['dataSti/fetch_eqAllTypeNum_action'],
  loading21:loading.effects['dataSti/fetch_eqNumByEqTypeChart_action'],
  loading22:loading.effects['dataSti/fetch_eqAddDeviceNum_action'],
  loading23:loading.effects['dataSti/fetch_eqAddDeviceTypeChart_action'],
  loading24:loading.effects['dataSti/fetch_eqAddDeviceChart_action'],
  loading25:loading.effects['dataSti/fetch_eqAddAppChart_action'],
  loading26:loading.effects['dataSti/fetch_eqTotalDeviceTypeChart_action'],
  loading27:loading.effects['dataSti/fetch_eqTotalDeviceChart_action'],
  loading28:loading.effects['dataSti/fetch_eqTotalAppChart_action'],
  loading29:loading.effects['dataSti/fetch_eqAddAppByTenant_action'],
  loading30:loading.effects['dataSti/fetch_payTenantSum_action'],
  loading31:loading.effects['dataSti/fetch_payAppSum_action'],
  loading32:loading.effects['dataSti/fetch_payAddAppSum_action'],
  loading33:loading.effects['dataSti/fetch_payOrderSum_action'],
  loading34:loading.effects['dataSti/fetch_payAddOrderSum_action'],
  loading35:loading.effects['dataSti/fetch_payOrderChart_action'],
  loading36:loading.effects['dataSti/fetch_payAddOrderChart_action'],
  loading37:loading.effects['dataSti/fetch_payOrderByTenantChart_action'],
  loading38:loading.effects['dataSti/fetch_payAddOrderByTenantChart_action'],
  loading39:loading.effects['dataSti/fetch_payOrderByAppChart_action'],
  loading40:loading.effects['dataSti/fetch_payAddOrderByAppChart_action'],
  loading41:loading.effects['dataSti/fetch_warnTimeChart_action'],
  loading42:loading.effects['dataSti/fetch_warningMsgTimeChart_action'],
  loading43:loading.effects['dataSti/fetch_warningEmailTimeChart_action'],
}))
@injectIntl
@Form.create()
export default class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      modalVisible: false,
      addTenantData:true,//true是chart false list
      addCUserNumberData:true,
      tenantTotalData:true,
      tenantCTotalData:true,
      tenantCNewUserData:true,
      tenantUserTotalData:true,
      appCNewUserData:true,
      appUserTotalData:true,
      totalApiUseTimeData:true,
      ApiUserTimeData:true,
      tenantUseApiData:true,
      appUseApiData:true,
      addEqTypeData:true,
      totalEqTypeData:true,
      addEqNumData:true,
      totalEqNumData:true,
      eqNumByTypeData:true,
      addAppNumData:true,
      totalAppNumData:true,
      totalOrderData:true,
      addTotalOrderData:true,
      orderNumData:true,
      addOrderNumData:true,
      appOrderNumData:true,
      appAddOrderNumData:true,
      warnStiData:true,
      emailWarningData:true,
      msgWarningData:true,
      tenantValue:null,
      tenantValueId:null,
      perTenantValue:null,
      perTenantValueId:null,
      applicationValue:null,
      applicationValueId:null,
      starttime:starttime,
      endtime:endtime,
      groupType:'day',
      apiValue:null,
      apiValueId:null,
      eqTenantValue:null,
      eqTenantValueId:null,
      eqApplicationValue:null,
      eqApplicationValueId:null,
      eqDeviceTypeId:null,
      payTenantValue:null,
      payTenantValueId:null,
      permissionTenant:[],
      permissionTenantId:null,
      permissionAppList:[],
      permissionAppListId:null,
      deviceTenantId:null,
      deviceAppListId:null,
      deviceAppList:[],
      payTenantId:null,
      payAppList:[],
      payAppId:null,
    }
  };
  componentDidMount(){
    const {endtime,groupType} = this.state;
    const {dataSti:{addTenantNumChartParams,totalTenantNumChartParams,clientNewUserNumChartParams,clientTotalUserNumChartParams}} = this.props;
    let nowDay={
      starttime:endtime,
      endtime:endtime,
      group:groupType
    };

    this.loadAllTenantNum(nowDay);
    this.loadClientUserNum(nowDay);
    this.loadAddTenantNumChart(addTenantNumChartParams);
    this.loadTenantList();
    this.totalTenantNumChart(totalTenantNumChartParams);
    this.clientNewUserNumChart(clientNewUserNumChartParams);
    this.clientTotalUserNumChart(clientTotalUserNumChartParams)
  }

  addTenant=()=>{
    this.setState({
      addTenantData:!this.state.addTenantData,
    })
  };
  addCUserNumber=()=>{
    this.setState({
      addCUserNumberData:!this.state.addCUserNumberData,
    })
  };
  tenantTotal=()=>{
    this.setState({
      tenantTotalData:!this.state.tenantTotalData,
    })
  };
  tenantCTotal=()=>{
    this.setState({
      tenantCTotalData:!this.state.tenantCTotalData,
    })
  };
  tenantCNewUser=()=>{
    this.setState({
      tenantCNewUserData:!this.state.tenantCNewUserData,
    })
  };
  tenantUserTotal=()=>{
    this.setState({
      tenantUserTotalData:!this.state.tenantUserTotalData,
    })
  };
  appCNewUser=()=>{
    this.setState({
      appCNewUserData:!this.state.appCNewUserData
    })
  };
  appUserTotal=()=>{
    this.setState({
      appUserTotalData:!this.state.appUserTotalData,
    })
  };
  totalApiUseTime=()=>{
    this.setState({
      totalApiUseTimeData:!this.state.totalApiUseTimeData,
    })
  };
  ApiUserTime=()=>{
    this.setState({
      ApiUserTimeData:!this.state.ApiUserTimeData,
    })
  };
  tenantUseApi=()=>{
    this.setState({
      tenantUseApiData:!this.state.tenantUseApiData,
    })
  };
  appUseApi=()=>{
    this.setState({
      appUseApiData:!this.state.appUseApiData,
    })
  };
  addEqType=()=>{
    this.setState({
      addEqTypeData:!this.state.addEqTypeData
    })

  };
  totalEqType=()=>{
    this.setState({
      totalEqTypeData:!this.state.totalEqTypeData,
    })
  };
  addEqNum=()=>{
    this.setState({
      addEqNumData:!this.state.addEqNumData,
    })
  };
  totalEqNum=()=>{
    this.setState({
      totalEqNumData:!this.state.totalEqNumData,
    })
  };
  eqNumByType=()=>{
    this.setState({
      eqNumByTypeData:!this.state.eqNumByTypeData,
    })
  };
  addAppNum=()=>{
    this.setState({
      addAppNumData:!this.state.addAppNumData,
    })
  };
  totalAppNum=()=>{
    this.setState({
      totalAppNumData:!this.state.totalAppNumData,
    })
  };
  totalOrder=()=>{
    this.setState({
      totalOrderData:!this.state.totalOrderData,
    })
  };
  addTotalOrder=()=>{
    this.setState({
      addTotalOrderData:!this.state.addTotalOrderData,
    })
  };
  orderNum=()=>{
    this.setState({
      orderNumData:!this.state.orderNumData,
    })
  };
  addOrderNum=()=>{
    this.setState({
      addOrderNumData:!this.state.addOrderNumData,
    })
  };
  appOrderNum=()=>{
    this.setState({
      appOrderNumData:!this.state.appOrderNumData,
    })
  };
  appAddOrderNum=()=>{
    this.setState({
      appAddOrderNumData:!this.state.appAddOrderNumData,
    })
  };
  warnSti=()=>{
    this.setState({
      warnStiData:!this.state.warnStiData,
    })
  };
  emailWarning=()=>{
    this.setState({
      emailWarningData:!this.state.emailWarningData,
    })
  };
  msgWarning=()=>{
    this.setState({
      msgWarningData:!this.state.msgWarningData,
    })
  }


  loadTenantList=()=>{
    const {dataSti:{clientNewUserByTenantChartParams,clientTotalUserByTenantChartParams}} = this.props
    this.props.dispatch({
      type:'dataSti/fetch_getAllTenant_action',
      payload:null,
      callback:(res)=>{
        let resArr = [];
        res.map(item=>{
          resArr.push(item)
        });
        resArr.unshift({id:'*',name:'全部'});
        this.setState({
          tenantValue:res[0],
          tenantValueId:res[0].id,
          permissionTenant:resArr,
          permissionTenantId:resArr[0].id,
          deviceTenantId:resArr[0].id,
          payTenantId:resArr[0].id,
        });
        const params = {
          ...clientNewUserByTenantChartParams,
          tenantid:res[0].id,
        };
        const clientTotalUserByTenantChartParams_params={
          ...clientTotalUserByTenantChartParams,
          tenantid:res[0].id
        };
        this.clientNewUserByTenantChart(params);
        this.clientTotalUserByTenantChart(clientTotalUserByTenantChartParams_params);
        this.loadTotalAppNum(res[0].id);
        this.loadAppByTenantId(res[0].id);
        this.loadPermissionAppList(res[0].id);
        this.loadDeviceAppList(res[0].id);
      }
    })
  };


  loadAllTenantNum=(params)=>{
    this.props.dispatch({
      type:"dataSti/fetch_allTenantNum_action",
      payload:params
    })
  }

  loadTotalAppNum=(id)=>{
    this.props.dispatch({
      type:'dataSti/fetch_applicationNumByTenantId_action',
      payload:{
        tenantid:id,
        starttime:this.state.endtime,
        endtime:this.state.endtime,
        group:this.state.groupType
      }
    })
  };
  //获取应用
  loadAppByTenantId=(id)=>{
    const {dataSti:{clientNewUserByAppParams,clientTotalUserByAppParams}} = this.props;
    this.props.dispatch({
      type:'dataSti/fetch_getAppByTenantId_action',
      payload:{
        tenantId:id
      },
      callback:(res)=>{
        if(res.length>0){
          this.setState({
            applicationValue:res[0],
            applicationValueId:res[0].id,
          });
          const params1={
            ...clientNewUserByAppParams,
            appid:res[0].id,
          };
          const params2={
            ...clientTotalUserByAppParams,
            appid:res[0].id,
          };
          this.loadClientTotalUserByAppId(res[0].id);
          this.loadClientNewUserByApp(params1);
          this.loadClientTotalUserByApp(params2);
        }
      }
    })
  };




  loadClientUserNum=(params)=>{
    this.props.dispatch({
      type:"dataSti/fetch_clientUserNum_action",
      payload:params
    })
  };

  //新增租户趋势图
  loadAddTenantNumChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_addTenantNumChart_action',
      payload:params,
    })
  };

  changeAddTenantChart=(value)=>{
    const {dataSti:{addTenantNumChartParams}} = this.props;
    const params = {
      ...addTenantNumChartParams,
      group:value
    };
    this.loadAddTenantNumChart(params)
  };

  changeAddTenantChartTime=(dates,dateStrings)=>{
    const {dataSti:{addTenantNumChartParams}} = this.props;
    const params = {
      ...addTenantNumChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.loadAddTenantNumChart(params)
  };

  //累计租户趋势图

  totalTenantNumChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_totalTenantNumChart_action',
      payload:params
    })
  };

  changeTotalTenantNum=(value)=>{
    const {dataSti:{totalTenantNumChartParams}} = this.props;
    const params = {
      ...totalTenantNumChartParams,
      group:value,
    };
    this.totalTenantNumChart(params);
  };

  changeTotalTenantChartTime=(dates,dateStrings)=>{
    const {dataSti:{totalTenantNumChartParams}} = this.props;
    const params = {
      ...totalTenantNumChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.totalTenantNumChart(params)
  };

  //C端新增用户趋势图
  clientNewUserNumChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_clientNewUserNumChart_action',
      payload:params
    })
  };

  changeClientNewUserNumChart=(value)=>{
    const {dataSti:{clientNewUserNumChartParams}} = this.props;
    const params = {
      ...clientNewUserNumChartParams,
      group:value,
    };
    this.clientNewUserNumChart(params);
  };

  changeClientNewUserNumChartTime=(dates,dateStrings)=>{
    const {dataSti:{clientNewUserNumChartParams}} = this.props;
    const params = {
      ...clientNewUserNumChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.clientNewUserNumChart(params)
  };

  //C端累计租户数
  clientTotalUserNumChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_clientTotalUserNumChart_action',
      payload:params
    })
  };

  changeClientTotalUserNumChart=(value)=>{
    const {dataSti:{clientTotalUserNumChartParams}} = this.props;
    const params = {
      ...clientTotalUserNumChartParams,
      group:value,
    };
    this.clientTotalUserNumChart(params);
  };

  changeClientTotalUserNumChartTime=(dates,dateStrings)=>{
    const {dataSti:{clientTotalUserNumChartParams}} = this.props;
    const params = {
      ...clientTotalUserNumChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.clientTotalUserNumChart(params);
  };

  //租户C端新增用户
  clientNewUserByTenantChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_clientNewUserByTenantChart_action',
      payload:params
    })
  };

  changeClientNewUserByTenant=(value)=>{
    const {dataSti:{clientNewUserByTenantChartParams}} = this.props;
    const params = {
      ...clientNewUserByTenantChartParams,
      group:value,
    };
    this.clientNewUserByTenantChart(params)
  };

  changeClientNewUserByTenantTime=(dates,dateStrings)=>{
    const {dataSti:{clientNewUserByTenantChartParams}} = this.props;
    const params = {
      ...clientNewUserByTenantChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.clientNewUserByTenantChart(params)
  };

  //租户累计新增用户
  clientTotalUserByTenantChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_clientTotalUserByTenantChart_action',
      payload:params
    })
  };

  changeClientTotalUserByTenantChat=(value)=>{
    const {dataSti:{clientTotalUserByTenantChartParams}} = this.props;
    const params = {
      ...clientTotalUserByTenantChartParams,
      group:value,
    };
    this.clientTotalUserByTenantChart(params)
  };

  changeClientTotalUserByTenantChatTime=(dates,dateStrings)=>{
    const {dataSti:{clientTotalUserByTenantChartParams}} = this.props;
    const params = {
      ...clientTotalUserByTenantChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.clientTotalUserByTenantChart(params)
  };

  changeTenant=(value)=>{
    const {dataSti:{clientNewUserByTenantChartParams,clientTotalUserByTenantChartParams}} = this.props;

    this.setState({
      tenantValueId:value
    });
    const params1 = {
      ...clientTotalUserByTenantChartParams,
      tenantid:value
    };

    const params2 = {
      ...clientNewUserByTenantChartParams,
      tenantid:value,
    };

    this.clientNewUserByTenantChart(params2);
    this.clientTotalUserByTenantChart(params1);
    this.loadAppByTenantId(value);
    this.loadTotalAppNum(value);
  };



  //用户应用
  loadClientTotalUserByAppId=(id)=>{
    const params = {
      appid:id,
      starttime:this.state.endtime,
      endtime:this.state.endtime,
      group:this.state.groupType
    };
    this.props.dispatch({
      type:'dataSti/fetch_clientTotalUserByAppId_action',
      payload:params,
    })
  };

  loadClientNewUserByApp=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_clientNewUserByApp_action',
      payload:params
    })
  };

  loadClientTotalUserByApp=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_clientTotalUserByApp_action',
      payload:params
    })
  };

  changeApplication=(value)=>{
    const {dataSti:{clientNewUserByAppParams,clientTotalUserByAppParams}} = this.props;
    this.setState({
      applicationValueId:value
    });
    const params1 = {
      ...clientNewUserByAppParams,
      appid:value,
    };
    const params2={
      ...clientTotalUserByAppParams,
      appid:value,
    };
    this.loadClientTotalUserByAppId(value);
    this.loadClientNewUserByApp(params1);
    this.loadClientTotalUserByApp(params2)
  };

  changeClientNewUserByApp=(value)=>{
    const {dataSti:{clientNewUserByAppParams}} = this.props;
    const params ={
      ...clientNewUserByAppParams,
      group:value
    };
    this.loadClientNewUserByApp(params);
  };

  changeClientNewUserByAppTime=(dates,dateStrings)=>{
    const {dataSti:{clientNewUserByAppParams}} = this.props;
    const params ={
      ...clientNewUserByAppParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.loadClientNewUserByApp(params);
  };

  changeLoadClientTotalUserByApp=(value)=>{
    const {dataSti:{clientTotalUserByAppParams}} = this.props;
    const params ={
      ...clientTotalUserByAppParams,
      group:value
    };
    this.loadClientTotalUserByApp(params);
  };

  changeLoadClientTotalUserByAppTime=(dates,dateStrings)=>{
    const {dataSti:{clientTotalUserByAppParams}} = this.props;
    const params ={
      ...clientTotalUserByAppParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.loadClientTotalUserByApp(params);
  };




  /***
   * 权限子服务
   */
  perTotalApi=()=>{
    const {dataSti:{perTotalApi}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(perTotalApi){
      return;
    }
    this.props.dispatch({
      type:'dataSti/fetch_perTotalApi_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  perApiUserTime=()=>{
    const {dataSti:{perApiUserTime}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(perApiUserTime){
      return;
    }
    this.props.dispatch({
      type:'dataSti/fetch_perApiUserTime_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  changePermissionTenant=(id)=>{
    const {dataSti:{perApiUseTimeChartParams}} = this.props;
    this.setState({
      permissionTenantId:id,
    });
    let params = {
      ...perApiUseTimeChartParams,
      tenantid:id,
    }
    this.perApiUseTimeChart(params);
    this.loadPermissionAppList(id);
  };

  changePayTenant=(id)=>{
    const {dataSti:{payOrderChartParams,payAddOrderChartParams}} = this.props;
    let params = {
      ...payOrderChartParams,
      tenantid:id
    };
    let params1 = {
      ...payAddOrderChartParams,
      tenantid:id
    };
    this.setState({
      payTenantId:id,
    });
    this.loadPayAppList(id);
    this.payOrderChart(params);
    this.payAddOrderChart(params1);

  };

  changePayApplication=(id)=>{
    const {dataSti:{payOrderChartParams,payAddOrderChartParams}} = this.props;
    let params = {
      ...payOrderChartParams,
      payAppId:id
    };
    this.setState({
      payAppId:id,
    });
    let params1 = {
      ...payAddOrderChartParams,
      tenantid:id
    };
    this.payOrderChart(params);
    this.payAddOrderChart(params1);
  };


  loadPayAppList=(id)=>{
    if(id==='*'){
      let resArr = [{id:"*",name:"全部"}];
      this.setState({
        payAppList:resArr,
      })
    };
    this.props.dispatch({
      type:'dataSti/fetch_getAppByTenantId_action',
      payload:{
        tenantId:id
      },
      callback:(res)=>{
        if(res.length>0){
          let resArr = [];
          res.map(item=>{
            resArr.push(item);
          });
          resArr.unshift({id:"*",name:'全部'});
          this.setState({
            payAppList:resArr,
            payAppId:resArr[0].id,
          })
        }else{
          let resArr = [];
          resArr.unshift({id:"*",name:'全部'});
          this.setState({
            payAppList:resArr,
            payAppId:resArr[0].id,
          })
        }
      }
    })
  };



  changePermissionApp=(id)=>{
    const {dataSti:{perApiUseTimeChartParams}} = this.props;
    this.setState({
      permissionAppListId:id,
    });
    let params = {
      ...perApiUseTimeChartParams,
      appid:id,
    };
    this.perApiUseTimeChart(params);
  };

  perApiUseTimeChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_perApiUseTimeChart_action',
      payload:params,
    })
  };

  changePerApiUseTimeChart=(value)=>{
    const {dataSti:{perApiUseTimeChartParams}} = this.props
    const params = {
      ...perApiUseTimeChartParams,
      group:value
    };
    this.perApiUseTimeChart(params);
  };

  changePerApiUseTimeChartTime=(dates,dateStrings)=>{
    const {dataSti:{perApiUseTimeChartParams}} = this.props;
    const params = {
      ...perApiUseTimeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.perApiUseTimeChart(params);
  };

  perApiByTenant=(id)=>{
    this.props.dispatch({
      type:'dataSti/fetch_perApiByTenant_action',
      payload:{
        id:id,
      },
      callback:(res)=>{
        if(res.length>0){
          res.unshift({id:'*',name:"全部"});
          this.setState({
            apiValue:res,
            apiValueId:res[0].id
          });
        }
      }
    })
  };

  changeApi=(value)=>{
    const {dataSti:{perApiUseTimeChartParams}} = this.props;
    this.setState({
      apiValueId:value
    });

    let params = {
      ...perApiUseTimeChartParams,
      interfaceid:value,
    };
    this.perApiUseTimeChart(params);
  };

  loadPermissionAppList=(id)=>{
    if(id==='*'){
      let resArr = [{id:"*",name:"全部"}];
      this.setState({
        permissionAppList:resArr,
      })
    };
    this.props.dispatch({
      type:'dataSti/fetch_getAppByTenantId_action',
      payload:{
        tenantId:id
      },
      callback:(res)=>{
        if(res.length>0){
          let resArr = [];
          res.map(item=>{
            resArr.push(item);
          });
          resArr.unshift({id:"*",name:'全部'});
          this.setState({
            permissionAppList:resArr,
            permissionAppListId:resArr[0].id,
          })
        }else{
          let resArr = [];
          resArr.unshift({id:"*",name:'全部'});
          this.setState({
            permissionAppList:resArr,
            permissionAppListId:resArr[0].id,
          })
        }
      }
    })
  };


  /***
   *   设备子服务
   */


  changeDeviceTenant=(id)=>{
    const {dataSti:{eqAddDeviceChartParams,eqTotalDeviceChartParams}} = this.props;
    this.setState({
      deviceTenantId:id,
    });
    const params = {
      ...eqAddDeviceChartParams,
      tenantid:id,
      appid: '*'
    };
    const params1 = {
      ...eqTotalDeviceChartParams,
      tenantid:id,
      appid: '*'
    };
    this.eqTotalDeviceChart(params1);
    this.eqAddDeviceChart(params);
    this.loadDeviceAppList(id);
  };

  loadDeviceAppList=(id)=>{
    if(id==='*'){
      let resArr = [{id:"*",name:"全部"}];
      this.setState({
        deviceAppList:resArr,
      })
    };
    this.props.dispatch({
      type:'dataSti/fetch_getAppByTenantId_action',
      payload:{
        tenantId:id
      },
      callback:(res)=>{
        if(res.length>0){
          let resArr = [];
          res.map(item=>{
            resArr.push(item);
          });
          resArr.unshift({id:"*",name:'全部'});
          this.setState({
            deviceAppList:resArr,
            deviceAppListId:resArr[0].id,
          })
        }else{
          let resArr = [];
          resArr.unshift({id:"*",name:'全部'});
          this.setState({
            deviceAppList:resArr,
            deviceAppListId:resArr[0].id,
          })
        }
      }
    })
  };

  changeDeviceApp=(id)=>{
    const {dataSti:{eqAddDeviceChartParams,eqTotalDeviceChartParams}} = this.props;
    this.setState({
      deviceAppListId:id,
    });
    const params = {
      ...eqAddDeviceChartParams,
      appid: id,
    };
    this.eqAddDeviceChart(params);

    const params1 = {
      ...eqTotalDeviceChartParams,
      appid: id,
    };
    this.eqTotalDeviceChart(params1)
  };


  eqTenantNum=()=>{
    const {dataSti:{eqTenantNum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(eqTenantNum){
      return;
    }
    this.props.dispatch({
      type:'dataSti/fetch_eqTenantNum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  eqDeviceNum=()=>{
    const {dataSti:{eqDeviceNum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(eqDeviceNum){
      return
    };
    this.props.dispatch({
      type:'dataSti/fetch_eqDeviceNum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  eqAllTypeNum=()=>{
    const {dataSti:{eqAllTypeNum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(eqAllTypeNum){
      return
    }
    this.props.dispatch({
      type:'dataSti/fetch_eqAllTypeNum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  eqAddDeviceTypeChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_eqAddDeviceTypeChart_action',
      payload:params
    })
  };

  changeEqAddDeviceTypeChart=(value)=>{
    const {dataSti:{eqAddDeviceTypeChartParams}} = this.props
    const params = {
      ...eqAddDeviceTypeChartParams,
      group:value
    };
    this.eqAddDeviceTypeChart(params)
  };

  changeEqAddDeviceTypeChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqAddDeviceTypeChartParams}} = this.props;
    const params = {
      ...eqAddDeviceTypeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    }
    this.eqAddDeviceTypeChart(params);
  };

  eqAddDeviceChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_eqAddDeviceChart_action',
      payload:params
    })
  };
  changeEqAddDeviceChart=(value)=>{
    const {dataSti:{eqAddDeviceChartParams}} = this.props;
    const params = {
      ...eqAddDeviceChartParams,
      group:value,
    };
    this.eqAddDeviceChart(params);
  };
  changeEqAddDeviceChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqAddDeviceChartParams}} = this.props;
    const params = {
      ...eqAddDeviceChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.eqAddDeviceChart(params);
  };

  eqAddAppChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_eqAddAppChart_action',
      payload:params
    })
  };
  changeEqAddAppChart=(value)=>{
    const {dataSti:{eqAddAppChartParams}} = this.props;
    const params = {
      ...eqAddAppChartParams,
      group:value,
    };
    this.eqAddAppChart(params);
  };
  changeEqAddAppChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqAddAppChartParams}} = this.props
    const params = {
      ...eqAddAppChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.eqAddAppChart(params)
  };

  eqTotalDeviceTypeChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_eqTotalDeviceTypeChart_action',
      payload:params
    })
  };
  changeEqTotalDeviceTypeChart=(value)=>{
    const {dataSti:{eqTotalDeviceTypeChartParams}} = this.props;
    const params = {
      ...eqTotalDeviceTypeChartParams,
      group:value,
    };
    this.eqTotalDeviceTypeChart(params)
  };
  changeEqTotalDeviceTypeChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqTotalDeviceTypeChartParams}} = this.props;
    const params = {
      ...eqTotalDeviceTypeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.eqTotalDeviceTypeChart(params)
  };
  eqTotalDeviceChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_eqTotalDeviceChart_action',
      payload:params
    })
  };
  changeEqTotalDeviceChart=(value)=>{
    const {dataSti:{eqTotalDeviceChartParams}} = this.props;
    const params = {
      ...eqTotalDeviceChartParams,
      group:value,
    };
    this.eqTotalDeviceChart(params);
  };
  changeEqTotalDeviceChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqTotalDeviceChartParams}} = this.props;
    const params = {
      ...eqTotalDeviceChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.eqTotalDeviceChart(params);
  };
  eqTotalAppChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_eqTotalAppChart_action',
      payload:params
    })
  };
  changeEqTotalAppChart=(value)=>{
    const {dataSti:{eqTotalAppChartParams}} = this.props;
    const params = {
      ...eqTotalAppChartParams,
      group:value,
    };
    this.eqTotalAppChart(params);
  };
  changeEqTotalAppChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqTotalAppChartParams}} = this.props;
    const params = {
      ...eqTotalAppChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.eqTotalAppChart(params);
  }

  changeEqTenant=(value)=>{
    this.setState({
      eqTenantValueId:value
    });
    this.loadAppByTenantId(value);
  };

  eqDeviceType=()=>{
    const {dataSti:{eqNumByEqTypeChartParams}} = this.props;
    this.props.dispatch({
      type:'dataSti/fetch_eqDeviceType_action',
      payload:{
        start:0,
        count:20000,
      },
      callback:(res)=>{
        this.setState({
          eqDeviceTypeId:res[0].id
        });
        let params = {
          ...eqNumByEqTypeChartParams,
          typeid:res[0].id
        };
        //获取设备类型下的累计设备
        this.loadDeviceNumByTypeChart(params)
      }
    })
  };

  eqDeviceBytType=(id)=>{
    const {starttime,endtime,groupType} = this.state;
    this.props.dispatch({
      type:'dataSti/fetch_eqDeviceBytType_action',
      payload:{
        typeid:id,
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  changeEqType=(value)=>{
    const {dataSti:{eqNumByEqTypeChartParams}} = this.props;
    this.setState({
      eqDeviceTypeId:value
    });
    let params = {
      ...eqNumByEqTypeChartParams,
      typeid:value,
    };
    this.loadDeviceNumByTypeChart(params);
  };

  changeEqNumByTypeDeviceChart=(value)=>{
    const {dataSti:{eqNumByEqTypeChartParams}} = this.props;
    const params = {
      ...eqNumByEqTypeChartParams,
      group:value,
    };
    this.loadDeviceNumByTypeChart(params);
  };

  changeEqNumByTypeDeviceChartTime=(dates,dateStrings)=>{
    const {dataSti:{eqNumByEqTypeChartParams}} = this.props;
    const params = {
      ...eqNumByEqTypeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.loadDeviceNumByTypeChart(params);
  };

  loadDeviceNumByTypeChart=(params)=>{
    this.props.dispatch({
      type:"dataSti/fetch_eqNumByEqTypeChart_action",
      payload:params,
      callback:(res)=>{

      }
    })
  };


  /****
   * 支付
   * @param value
   */

  payTenantSum=()=>{
    const {dataSti:{payTenantSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(payTenantSum){
      return
    };
    this.props.dispatch({
      type:'dataSti/fetch_payTenantSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };
  payAppSum=()=>{
    const {dataSti:{payAppSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(payAppSum){
      return
    };
    this.props.dispatch({
      type:'dataSti/fetch_payAppSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  payOrderSum=()=>{
    const {dataSti:{payOrderSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(payOrderSum){
      return
    };
    this.props.dispatch({
      type:'dataSti/fetch_payOrderSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };
  payAddOrderSum=()=>{
    const {dataSti:{payAddOrderSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(payAddOrderSum){
      return
    };
    this.props.dispatch({
      type:'dataSti/fetch_payAddOrderSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  payOrderChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_payOrderChart_action',
      payload:params
    })
  };
  changePayOrderChart=(value)=>{
    const {dataSti:{payOrderChartParams}} = this.props;
    let v = {
      ...payOrderChartParams,
      group:value
    };
    this.payOrderChart(v);
  };
  changePayOrderChartTime=(dates,dateStrings)=>{
    const {dataSti:{payOrderChartParams}} = this.props;
    let v = {
      ...payOrderChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.payOrderChart(v)
  };

  payAddOrderChart=(params)=>{
    this.props.dispatch({
      type:'dataSti/fetch_payAddOrderChart_action',
      payload:params
    })
  };
  changePayAddOrderChart=(value)=>{
    const {dataSti:{payAddOrderChartParams}} = this.props;
    let v = {
      ...payAddOrderChartParams,
      group:value
    };
    this.payAddOrderChart(v)
  };

  changePayAddOrderChartTime=(dates,dateStrings)=>{
    const {dataSti:{payAddOrderChartParams}} = this.props;
    let v = {
      ...payAddOrderChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    }
    this.payAddOrderChart(v);
  };

  /***
   * 告警and地理
   * @param key
   */

  warnTimeSum=()=>{
    const {dataSti:{warnTimeSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(warnTimeSum){
      return
    }
    this.props.dispatch({
      type:'dataSti/fetch_warnTimeSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  }

  warningMsgTimeSum=()=>{
    const {dataSti:{warningMsgTimeSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(warningMsgTimeSum){
      return
    }
    this.props.dispatch({
      type:'dataSti/fetch_warningMsgTimeSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  warningEmailTimeSum=()=>{
    const {dataSti:{warningEmailTimeSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(warningEmailTimeSum){
      return
    }
    this.props.dispatch({
      type:'dataSti/fetch_warningEmailTimeSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };

  warnTimeChart=(value)=>{
    this.props.dispatch({
      type:'dataSti/fetch_warnTimeChart_action',
      payload:value,
    })
  };
  changeWarnTimeChart=(value)=>{
    const {dataSti:{warnTimeChartParams}} = this.props;
    let v = {
      ...warnTimeChartParams,
      group:value
    };
    this.warnTimeChart(v);
  };
  changeWarnTimeChartTime=(dates,dateStrings)=>{
    const {dataSti:{warnTimeChartParams}} = this.props;
    let v = {
      ...warnTimeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.warnTimeChart(v);
  };

  warningMsgTimeChart=(value)=>{
    this.props.dispatch({
      type:'dataSti/fetch_warningMsgTimeChart_action',
      payload:value
    })
  };
  changeWarningMsgTimeChart=(value)=>{
    const {dataSti:{warningMsgTimeChartParams}} = this.props;
    let v = {
      ...warningMsgTimeChartParams,
      group:value
    };
    this.changeWarnTimeChartTime(v);
  };

  changeWarningMsgTimeChartTime=(dates,dateStrings)=>{
    const {dataSti:{warningMsgTimeChartParams}} = this.props;
    let v = {
      ...warningMsgTimeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.changeWarnTimeChartTime(v);
  };

  warningEmailTimeChart=(value)=>{
    this.props.dispatch({
      type:'dataSti/fetch_warningEmailTimeChart_action',
      payload:value
    })
  };

  changeWarningEmailTimeChart=(value)=>{
    const {dataSti:{warningEmailTimeChartParams}} = this.props;
    let v = {
      ...warningEmailTimeChartParams,
      group:value
    };
    this.warningEmailTimeChart(v);
  }
  changeWarningEmailTimeChartTime=(dates,dateStrings)=>{
    const {dataSti:{warningEmailTimeChartParams}} = this.props;
    let v = {
      ...warningEmailTimeChartParams,
      starttime:dateStrings[0],
      endtime:dateStrings[1],
    };
    this.warningEmailTimeChart(v);
  };


  positionTenantSum=()=>{
    const {dataSti:{positionTenantSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(positionTenantSum){
      return
    }
    this.props.dispatch({
      type:'dataSti/fetch_positionTenantSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };
  positionAppSum=()=>{
    const {dataSti:{positionAppSum}} = this.props;
    const {starttime,endtime,groupType} = this.state;
    if(positionAppSum){
      return
    }
    this.props.dispatch({
      type:'dataSti/fetch_positionAppSum_action',
      payload:{
        starttime:starttime,
        endtime:endtime,
        group:groupType,
      }
    })
  };


  changeTabs=(key)=>{
    switch (key) {
      case '1':
        break;
      case '2':
        const {dataSti:{perApiUseTimeChartParams,perApiUseTimeChart}} = this.props;
        let params1 = {
          ...perApiUseTimeChartParams
        };
        this.perTotalApi();
        this.perApiUserTime();
        this.perApiByTenant();
        if(perApiUseTimeChart.length===0){
          this.perApiUseTimeChart(params1);
        }
        break;
      case '3':
        const {dataSti:{eqAddDeviceTypeChartParams,eqAddDeviceTypeChart,eqAddDeviceChart,eqAddDeviceChartParams,eqAddAppChart,eqAddAppChartParams}} = this.props;
        const {dataSti:{eqTotalDeviceTypeChart,eqTotalDeviceTypeChartParams,eqTotalDeviceChart,eqTotalDeviceChartParams,eqTotalAppChart,eqTotalAppChartParams}} = this.props;
        this.eqTenantNum();
        this.eqDeviceNum();
        this.eqAllTypeNum();
        this.eqDeviceType();
        if(eqAddDeviceTypeChart.length===0){
          this.eqAddDeviceTypeChart(eqAddDeviceTypeChartParams);
        }
        if(eqAddDeviceChart.length===0){
          this.eqAddDeviceChart(eqAddDeviceChartParams);
        }
        if(eqAddAppChart.length===0){
          this.eqAddAppChart(eqAddAppChartParams);
        }
        if(eqTotalDeviceTypeChart.length===0){
          this.eqTotalDeviceTypeChart(eqTotalDeviceTypeChartParams);
        }
        if(eqTotalDeviceChart.length===0){
          this.eqTotalDeviceChart(eqTotalDeviceChartParams);
        }
        if(eqTotalAppChart.length===0){
          this.eqTotalAppChart(eqTotalAppChartParams);
        }
        break;
      case '4':
        const {dataSti:{payOrderChart,payOrderChartParams,payAddOrderChart,payAddOrderChartParams,payOrderByTenantChartParams,payAddOrderByTenantChartParams,payOrderByAppChartParams,payAddOrderByAppChartParams}} = this.props;
        this.payTenantSum();
        this.payAppSum();
        this.payOrderSum();
        this.payAddOrderSum();
        if(payOrderChart.length===0){
          this.payOrderChart(payOrderChartParams);
        }
        if(payAddOrderChart.length===0){
          this.payAddOrderChart(payAddOrderChartParams);
        }
        break;
      case '5':
        const {dataSti:{warnTimeChartParams,warningMsgTimeChartParams,warningEmailTimeChartParams}} = this.props;
        // this.warnTimeSum();
        // this.warningMsgTimeSum();
        // this.warningEmailTimeSum();
        // this.warnTimeChart(warnTimeChartParams);
        // this.warningMsgTimeChart(warningMsgTimeChartParams);
        // this.warningEmailTimeChart(warningEmailTimeChartParams);
        break;
      default:
        break;
    }
  };



  render() {
    const {
      addTenantData,
      addCUserNumberData,
      tenantTotalData,
      tenantCTotalData,
      tenantCNewUserData,
      tenantUserTotalData,
      appCNewUserData,
      appUserTotalData,
      totalApiUseTimeData,
      addEqTypeData,
      totalEqTypeData,
      addEqNumData,
      totalEqNumData,
      addAppNumData,
      totalAppNumData,
      totalOrderData,
      addTotalOrderData,
      apiValue,
      apiValueId,
      tenantValueId,
      applicationValueId,
      eqDeviceTypeId,
      permissionTenant,
      permissionTenantId,
      permissionAppListId,
      permissionAppList,
      deviceTenantId,
      deviceAppListId,
      deviceAppList,
      eqNumByTypeData,
      payTenantId,
      payAppList,
      payAppId,
    } = this.state;

    const {dataSti:{allTenantNum,addTenantNum,clientUserNum,allTenant,addTenantNumChart,totalTenantNumChart,clientNewUserNumChart,clientTotalUserNumChart,appByTenantId,applicationNumByTenantId,clientNewUserByTenantChart,clientTotalUserByTenantChart,clientTotalUserByAppId,clientNewUserByApp,clientTotalUserByApp},} = this.props;
    const {intl: {formatMessage}} = this.props;
    const {dataSti:{perTotalApi,perApiUserTime,perApiUseTimeChart,}} = this.props;
    const {dataSti:{eqTenantNum,eqDeviceNum,eqAllTypeNum,eqAddDeviceTypeChart,eqAddDeviceChart,eqAddAppChart,eqTotalDeviceTypeChart,eqTotalDeviceChart,eqTotalAppChart,eqDeviceType,eqNumByEqTypeChart}} = this.props;
    const {dataSti:{payTenantSum,payAppSum,payOrderSum,payAddOrderSum,payOrderChart,payAddOrderChart,}} = this.props;

    const {dataSti:{warnTimeChart,warningMsgTimeChart,warningEmailTimeChart}} = this.props;
    const {loading,allTenantNumLoading,clientUserNumLoading,loading1,loading2,loading3,loading4,loading5,loading6,loading7,loading8,loading9,loading10,loading11,loading12,loading13,
      loading18,loading19,loading20,loading21,loading22,loading23,loading24,loading25,loading26,loading27,loading28,
      loading30,loading31,loading32,loading33,loading34,loading35,loading36,
    } = this.props;

    //用户
    let addTenantChartData = formatChartData(addTenantNumChart);
    let totalTenantChartData = formatChartData(totalTenantNumChart);
    let clientNewUserChartData = formatChartData(clientNewUserNumChart);
    let clientTotalUserChartData = formatChartData(clientTotalUserNumChart);
    let clientNewUserByTenantChartData = formatChartData(clientNewUserByTenantChart);
    let clientTotalUserByTenantChatData = formatChartData(clientTotalUserByTenantChart);
    let clientNewUserByAppChartData=formatChartData(clientNewUserByApp);
    let clientTotalUserByAppChartData=formatChartData(clientTotalUserByApp);
    //权限
    let perApiUseTimeChartData = formatChartData(perApiUseTimeChart);


    //设备
    let eqAddDeviceTypeChartData = formatChartData(eqAddDeviceTypeChart);
    let eqAddDeviceChartData = formatChartData(eqAddDeviceChart);
    let eqAddAppChartData = formatChartData(eqAddAppChart);
    let eqTotalDeviceTypeChartData = formatChartData(eqTotalDeviceTypeChart);
    let eqTotalDeviceChartData = formatChartData(eqTotalDeviceChart);
    let eqTotalAppChartData = formatChartData(eqTotalAppChart);
    let eqNumByEqTypeChartData = formatChartData(eqNumByEqTypeChart);

    //支付
    let payOrderChartData = formatChartData(payOrderChart);
    let payAddOrderChartData = formatChartData(payAddOrderChart);



    const totalColumns = [{
      title: formatMessage(basicMessages.date),
      dataIndex: 'date',
      key: 'date',
      className:'table_row_styles',
      width:100

    },{
      title: formatMessage(basicMessages.total),
      dataIndex: 'acc',
      key: 'acc',
      className:'table_row_styles',
      width:100
    }];

    const timeColumns=[{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',

    },{
      title: '次数',
      dataIndex: 'acc',
      key: 'acc',
      className:'table_row_styles',
    }];

    const options = [
      <Option key={'year'} value={'year'}>{formatMessage(basicMessages.year)}</Option>,
      <Option key={'month'} value={'month'}>{formatMessage(basicMessages.month)}</Option>,
      <Option key={'date'} value={'day'}>{formatMessage(basicMessages.day)}</Option>,
    ]


    return (
      <PageHeaderLayout>
        <Card
          className={styles.card_class}
          bodyStyle={{padding: "20px 0"}}
        >
          <Tabs defaultActiveKey="1" onChange={this.changeTabs}>
            <TabPane tab={formatMessage(messages.user_service)} key="1">

              <Row gutter={8} style={{padding: '0 20px 20px 20px'}}>
                <Col span={4}>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 100}}
                    loading={allTenantNumLoading}
                  >
                    <h4>{formatMessage(messages.sti_total_tenant)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{allTenantNum.count}</h4>
                  </Card>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 40}}
                    loading={clientUserNumLoading}
                  >
                    <h4>{formatMessage(messages.sti_total_customer)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{clientUserNum.count}</h4>

                  </Card>
                </Col>
                <Col span={10}>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_tenant)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.addTenant} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeAddTenantChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeAddTenantChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {addTenantData?
                      <Spin spinning={loading1}>
                        <StatisticChart
                          height={275}
                          data={addTenantChartData}
                        />
                      </Spin>:<Table
                        scroll={{ y: 200 }}
                        dataSource={addTenantChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }

                  </Card>

                  <Card
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_customer)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.addCUserNumber} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeClientNewUserNumChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeClientNewUserNumChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                    className={styles.statistics_card}

                  >
                    {addCUserNumberData?
                      <Spin spinning={loading3}>
                      <StatisticChart
                        height={275}
                        data={clientNewUserChartData}
                      /></Spin>:<Table
                        dataSource={clientNewUserChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                </Col>
                <Col span={10}>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_accumulative_tenant)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.tenantTotal} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeTotalTenantNum}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeTotalTenantChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {tenantTotalData?
                      <Spin spinning={loading2}>
                        <StatisticChart
                          height={275}
                          data={totalTenantChartData}
                        />
                      </Spin>
                        :<Table
                        scroll={{ y: 200 }}
                        dataSource={totalTenantChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_accumulative_tenant)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.tenantCTotal} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeClientTotalUserNumChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeClientTotalUserNumChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {tenantCTotalData?
                      <Spin spinning={loading4}>

                        <StatisticChart
                          height={275}
                          data={clientTotalUserChartData}
                        />
                      </Spin>:<Table
                        scroll={{ y: 200 }}
                        dataSource={clientTotalUserChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                </Col>
              </Row>

              <div style={{width: '100%', height: 10, background: "#f0f2f5"}}></div>

              <Card
                bordered={false}
                bodyStyle={{padding: 0}}
                style={{marginTop: 10, padding: '0px 20px 20px'}}
              >
                <div>{formatMessage(basicMessages.tenant)}：
                  <Select onChange={this.changeTenant} value={tenantValueId&&tenantValueId} style={{width: 200}}>
                    {
                      allTenant.map((item,index)=>{
                        return(
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                  {/*<a style={{marginLeft: 6}}>租户明细</a>*/}
                </div>
                <Row gutter={8}>
                  <Col span={4}>
                    <Card
                      bordered={false}
                      style={{textAlign: 'center', background: '#eee', marginTop: 100}}
                      loading={loading7}
                    >
                      <h4>{formatMessage(messages.sti_application_total)}</h4>
                      <h4 style={{color: '#3f89e1'}}>{applicationNumByTenantId&&applicationNumByTenantId.count}</h4>
                    </Card>
                  </Col>
                  <Col span={10}>
                    <Card
                      className={styles.statistics_card}
                      title={
                        <div className="dlxB">
                          <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_customer)}</span>
                          <div>
                            <img style={{width:16,position:'relative',right:16}} onClick={this.tenantCNewUser} src={listToChart}/>
                            <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeClientNewUserByTenant}>
                              {options}
                            </Select>
                            <RangePicker
                              allowClear={false}
                              style={{width:200}}
                              defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                              format={dateFormat}
                              onChange={this.changeClientNewUserByTenantTime}
                            />
                          </div>
                        </div>
                      }
                      style={{marginTop: 8}}
                      bodyStyle={{padding: '0px'}}
                    >
                      {tenantCNewUserData?
                        <Spin spinning={loading5}>
                          <StatisticChart
                            height={275}
                            data={clientNewUserByTenantChartData}
                          />
                        </Spin>:<Table
                          scroll={{ y: 200 }}
                          dataSource={clientNewUserByTenantChartData}
                          columns={totalColumns}
                          pagination={false}
                        />
                      }
                    </Card>

                  </Col>
                  <Col span={10}>
                    <Card
                      className={styles.statistics_card}
                      title={
                        <div className="dlxB">
                          <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_accumulative_customer)}</span>
                          <div>
                            <img style={{width:16,position:'relative',right:16}} onClick={this.tenantUserTotal} src={listToChart}/>

                            <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeClientTotalUserByTenantChat}>
                              {options}
                            </Select>
                            <RangePicker
                              allowClear={false}
                              style={{width:200}}
                              defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                              format={dateFormat}
                              onChange={this.changeClientTotalUserByTenantChatTime}
                            />
                          </div>
                        </div>
                      }
                      style={{marginTop: 8}}
                      bodyStyle={{padding: '0px'}}
                    >
                      {tenantUserTotalData?
                        <Spin spinning={loading6}>
                          <StatisticChart
                            height={275}
                            data={clientTotalUserByTenantChatData}
                          />
                        </Spin>:<Table
                          scroll={{ y: 200 }}
                          dataSource={clientTotalUserByTenantChatData}
                          columns={totalColumns}
                          pagination={false}
                        />
                      }
                    </Card>

                  </Col>
                </Row>
              </Card>

              <div style={{width: '100%', height: 10, background: "#f0f2f5"}}></div>

              <Card
                bordered={false}
                bodyStyle={{padding: 0}}
                style={{marginTop: 10, padding: '0px 20px 20px'}}
              >
                <div>{formatMessage(basicMessages.application)}：
                  <Select onChange={this.changeApplication} value={applicationValueId&&applicationValueId} style={{width: 200}}>
                    {
                      appByTenantId.map((item,index)=>{
                        return(
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>
                  {/*<a style={{marginLeft: 6}}>应用明细</a>*/}

                </div>
                <Row gutter={8}>
                  <Col span={4}>
                    <Card
                      bordered={false}
                      style={{textAlign: 'center', background: '#eee', marginTop: 100}}
                      loading={loading8}
                    >
                      <h4>{formatMessage(messages.sti_total_customer)}</h4>
                      <h4 style={{color: '#3f89e1'}}>{clientTotalUserByAppId&&clientTotalUserByAppId.count}</h4>
                    </Card>
                  </Col>
                  <Col span={10}>
                    <Card
                      className={styles.statistics_card}
                      title={
                        <div className="dlxB">
                          <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_customer)}</span>
                          <div>
                            <img style={{width:16,position:'relative',right:16}} onClick={this.appCNewUser} src={listToChart}/>
                            <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeClientNewUserByApp}>
                              {options}
                            </Select>
                            <RangePicker
                              allowClear={false}
                              style={{width:200}}
                              defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                              format={dateFormat}
                              onChange={this.changeClientNewUserByAppTime}
                            />
                          </div>
                        </div>
                      }
                      style={{marginTop: 8}}
                      bodyStyle={{padding: '0px'}}
                    >
                      {appCNewUserData?
                        <Spin spinning={loading9}>
                        <StatisticChart
                          height={275}
                          data={clientNewUserByAppChartData}
                        />
                        </Spin>:<Table
                          scroll={{ y: 200 }}
                          dataSource={clientNewUserByAppChartData}
                          columns={totalColumns}
                          pagination={false}
                        />
                      }
                    </Card>

                  </Col>
                  <Col span={10}>
                    <Card
                      className={styles.statistics_card}
                      title={
                        <div className="dlxB">
                          <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_accumulative_customer)}</span>
                          <div>
                            <img style={{width:16,position:'relative',right:16}} onClick={this.appUserTotal} src={listToChart}/>

                            <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeLoadClientTotalUserByApp}>
                              {options}
                            </Select>
                            <RangePicker
                              allowClear={false}
                              style={{width:200}}
                              defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                              format={dateFormat}
                              onChange={this.changeLoadClientTotalUserByAppTime}
                            />
                          </div>
                        </div>
                      }
                      style={{marginTop: 8}}
                      bodyStyle={{padding: '0px'}}
                    >
                      {appUserTotalData?
                        <Spin spinning={loading10}>
                        <StatisticChart
                          height={275}
                          data={clientTotalUserByAppChartData}
                        />
                        </Spin>:<Table
                          scroll={{y:200}}
                          dataSource={clientTotalUserByAppChartData}
                          columns={totalColumns}
                          pagination={false}
                        />
                      }
                    </Card>

                  </Col>
                </Row>
              </Card>


            </TabPane>


            <TabPane tab={formatMessage(messages.authority_service)} key="2">
              <Row gutter={8} style={{padding: '0 20px 20px'}}>
                <Col span={4}>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 20}}
                    loading={loading11}
                  >
                    <h4>{formatMessage(messages.sti_interface_total)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{perTotalApi&&perTotalApi.count}</h4>
                  </Card>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 40}}
                    loading={loading12}
                  >
                    <h4>{formatMessage(messages.sti_interface_use_time)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{perApiUserTime&&perApiUserTime.count}</h4>
                  </Card>
                </Col>

                <Col span={18}>
                  <div style={{display:"flex"}}>
                    <div>{formatMessage(messages.sti_interface)}：
                      <Select onChange={this.changeApi} value={apiValueId&&apiValueId} style={{width: 200}}>
                        {apiValue&&apiValue.map((item)=>{
                          return(
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          )
                        })}
                      </Select>
                    </div>

                    <div style={{marginLeft:12}}>{formatMessage(basicMessages.tenant)}：
                      <Select onChange={this.changePermissionTenant} value={permissionTenantId&&permissionTenantId} style={{width: 200}}>
                        {
                          permissionTenant.map((item,index)=>{
                            return(
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })
                        }
                      </Select>
                      {/*<a style={{marginLeft: 6}}>租户明细</a>*/}
                    </div>

                    <div style={{marginLeft:12}}>{formatMessage(basicMessages.application)}：
                      <Select onChange={this.changePermissionApp} value={permissionAppListId&&permissionAppListId} style={{width: 200}}>
                        {
                          permissionAppList.map((item,index)=>{
                            return(
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })
                        }
                      </Select>
                      {/*<a style={{marginLeft: 6}}>应用明细</a>*/}

                    </div>
                  </div>

                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_interface_use_time)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.totalApiUseTime} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changePerApiUseTimeChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changePerApiUseTimeChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {totalApiUseTimeData?
                        <Spin spinning={loading13}>
                          <StatisticChart
                          height={275}
                          data={perApiUseTimeChartData}
                        />
                      </Spin>:<Table
                        scroll={{y:200}}
                        dataSource={perApiUseTimeChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                </Col>

              </Row>

            </TabPane>


            <TabPane tab={formatMessage(messages.equipment_service)} key="3">

              <Row gutter={8} style={{padding: '0 20px 20px'}}>
                <Col span={4}>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 120}}
                    loading={loading18}
                  >
                    <h4>{formatMessage(messages.sti_access_tenant)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{eqTenantNum&&eqTenantNum.count}</h4>
                  </Card>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 20}}
                    loading={loading19}
                  >
                    <h4>{formatMessage(messages.sti_access_device)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{eqDeviceNum&&eqDeviceNum.count}</h4>
                  </Card>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 40}}
                    loading={loading20}
                  >
                    <h4>{formatMessage(messages.sti_total_type)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{eqAllTypeNum&&eqAllTypeNum.count}</h4>

                  </Card>
                </Col>
                <Col span={10}>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_type)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.addEqType} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqAddDeviceTypeChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeEqAddDeviceTypeChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {addEqTypeData?
                      <Spin spinning={loading23}>
                        <StatisticChart
                          height={275}
                          data={eqAddDeviceTypeChartData}
                        />
                      </Spin>:<Table
                        dataSource={eqAddDeviceTypeChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>


                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_application)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.addAppNum} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqAddAppChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeEqAddAppChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {addAppNumData?
                      <Spin spinning={loading25}>
                        <StatisticChart
                          height={275}
                          data={eqAddAppChartData}
                        />
                      </Spin>:<Table
                        dataSource={eqAddAppChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                  <div style={{display:"flex",height:60,padding:'10px 0'}}>
                    <div style={{lineHeight:'40px'}}>{formatMessage(basicMessages.tenant)}：
                      <Select onChange={this.changeDeviceTenant} value={deviceTenantId&&deviceTenantId} style={{width: 130}}>
                        {
                          permissionTenant.map((item,index)=>{
                            return(
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })
                        }
                      </Select>
                      {/*<a style={{marginLeft: 6}}>租户明细</a>*/}
                    </div>

                    <div style={{marginLeft:12,lineHeight:'40px'}}>{formatMessage(basicMessages.application)}：
                      <Select onChange={this.changeDeviceApp} value={deviceAppListId&&deviceAppListId} style={{width: 130}}>
                        {
                          deviceAppList.map((item,index)=>{
                            return(
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })
                        }
                      </Select>
                      {/*<a style={{marginLeft: 6}}>应用明细</a>*/}

                    </div>
                  </div>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_add_device)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.addEqNum} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqAddDeviceChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeEqAddDeviceChartTime}
                          />
                        </div>
                      </div>
                    }
                    bodyStyle={{padding: '0px'}}

                  >
                    {addEqNumData?
                      <Spin spinning={loading24}>
                        <StatisticChart
                          height={275}
                          data={eqAddDeviceChartData}
                        /></Spin>:<Table
                        scorll={{y:200}}
                        dataSource={eqAddDeviceChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                </Col>

                <Col span={10}>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_total_type)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.totalEqType} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqTotalDeviceTypeChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeEqTotalDeviceTypeChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {totalEqTypeData?
                      <Spin spinning={loading26}>
                        <StatisticChart
                          height={275}
                          data={eqTotalDeviceTypeChartData}
                        />
                      </Spin>:<Table
                        scroll={{y:200}}
                        dataSource={eqTotalDeviceTypeChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_accumulative_application)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.totalAppNum} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqTotalAppChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeEqTotalAppChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {totalAppNumData?
                      <Spin spinning={loading28}>
                        <StatisticChart
                          height={275}
                          data={eqTotalAppChartData}
                        />
                      </Spin>:<Table
                        scroll={{y:200}}
                        dataSource={eqTotalAppChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                  <div style={{display:"flex",height:60,padding:'10px 0'}}></div>

                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_cumulative_device)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.totalEqNum}  src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqTotalDeviceChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changeEqTotalDeviceChartTime}
                          />
                        </div>
                      </div>
                    }
                    bodyStyle={{padding: '0px'}}
                  >
                    {totalEqNumData?
                      <Spin spinning={loading27}>
                        <StatisticChart
                          height={275}
                          data={eqTotalDeviceChartData}
                        />
                      </Spin>:<Table
                        scroll={{y:200}}
                        dataSource={eqTotalDeviceChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>
                </Col>
              </Row>

              <div style={{width: '100%', height: 10, background: "#f0f2f5"}}></div>



              <Card
                bordered={false}
                bodyStyle={{padding: 0}}
                style={{marginTop: 10, padding: '0px 20px 20px'}}
              >
                <div>{formatMessage(messages.sti_total_type)}：
                  <Select onChange={this.changeEqType} value={eqDeviceTypeId&&eqDeviceTypeId} style={{width: 200}}>
                    {
                      eqDeviceType.map((item,index)=>{
                        return(
                          <Option value={item.id} key={item.id}>{item.name}</Option>
                        )
                      })
                    }
                  </Select>

                </div>

                <Card
                  className={styles.statistics_card}
                  title={
                    <div className="dlxB">
                      <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_cumulative_device)}</span>
                      <div>
                        <img style={{width:16,position:'relative',right:16}} onClick={this.eqNumByType}  src={listToChart}/>
                        <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changeEqNumByTypeDeviceChart}>
                          {options}
                        </Select>
                        <RangePicker
                          allowClear={false}
                          style={{width:200}}
                          defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                          format={dateFormat}
                          onChange={this.changeEqNumByTypeDeviceChartTime}
                        />
                      </div>
                    </div>
                  }
                  style={{marginTop: 8}}
                  bodyStyle={{padding: '0px'}}
                >
                  {eqNumByTypeData?
                    <Spin spinning={loading21}>
                      <StatisticChart
                        height={275}
                        data={eqNumByEqTypeChartData}
                      />
                    </Spin>:<Table
                      scroll={{y:200}}
                      dataSource={eqNumByEqTypeChartData}
                      columns={totalColumns}
                      pagination={false}
                    />
                  }
                </Card>

              </Card>

            </TabPane>


            <TabPane tab={formatMessage(messages.pay_service)} key="4">
              <Row gutter={8} style={{padding: '0 20px 20px'}}>
                <Col span={4}>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 10}}
                    loading={loading30}
                  >
                    <h4>{formatMessage(messages.sti_access_tenant)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{payTenantSum&&payTenantSum.count}</h4>
                  </Card>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 20}}
                    loading={loading31}
                  >
                    <h4>{formatMessage(messages.sti_application_total)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{payAppSum&&payAppSum.count}</h4>
                  </Card>

                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 20}}
                    loading={loading33}
                  >
                    <h4>{formatMessage(messages.sti_order)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{payOrderSum&&payOrderSum.count}</h4>

                  </Card>
                  <Card
                    bordered={false}
                    style={{textAlign: 'center', background: '#eee', marginTop: 20}}
                    loading={loading34}
                  >
                    <h4>{formatMessage(messages.sti_order_new)}</h4>
                    <h4 style={{color: '#3f89e1'}}>{payAddOrderSum&&payAddOrderSum.count}</h4>

                  </Card>
                </Col>
                <Col span={18}>
                  <div style={{display:"flex",height:60,padding:'10px 0'}}>
                    <div style={{marginLeft:12}}>{formatMessage(basicMessages.tenant)}：
                      <Select onChange={this.changePayTenant} value={payTenantId&&payTenantId} style={{width: 200}}>
                        {
                          permissionTenant.map((item,index)=>{
                            return(
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })
                        }
                      </Select>
                      {/*<a style={{marginLeft: 6}}>租户明细</a>*/}
                    </div>

                    <div style={{marginLeft:12}}>{formatMessage(basicMessages.application)}：
                      <Select onChange={this.changePayApplication} value={payAppId&&payAppId} style={{width: 200}}>
                        {
                          payAppList.map((item,index)=>{
                            return(
                              <Option value={item.id} key={item.id}>{item.name}</Option>
                            )
                          })
                        }
                      </Select>
                      {/*<a style={{marginLeft: 6}}>应用明细</a>*/}
                    </div>
                  </div>
                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_order)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.totalOrder} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changePayOrderChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changePayOrderChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {totalOrderData?
                      <Spin spinning={loading35}>
                        <StatisticChart
                          height={275}
                          data={payOrderChartData}
                        />
                      </Spin>:<Table
                        scroll={{y:200}}
                        dataSource={payOrderChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                  <Card
                    className={styles.statistics_card}
                    title={
                      <div className="dlxB">
                        <span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_order_new)}</span>
                        <div>
                          <img style={{width:16,position:'relative',right:16}} onClick={this.addTotalOrder} src={listToChart}/>
                          <Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changePayAddOrderChart}>
                            {options}
                          </Select>
                          <RangePicker
                            allowClear={false}
                            style={{width:200}}
                            defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            onChange={this.changePayAddOrderChartTime}
                          />
                        </div>
                      </div>
                    }
                    style={{marginTop: 8}}
                    bodyStyle={{padding: '0px'}}
                  >
                    {addTotalOrderData?
                      <Spin spinning={loading36}>
                        <StatisticChart
                          height={275}
                          data={payAddOrderChartData}
                        />
                      </Spin>:<Table
                        scroll={{y:200}}
                        dataSource={payAddOrderChartData}
                        columns={totalColumns}
                        pagination={false}
                      />
                    }
                  </Card>

                </Col>
              </Row>
            </TabPane>













            {/*<TabPane tab={formatMessage(messages.warning_service)} key="5">*/}
              {/*<Row gutter={8} style={{padding: '0 20px 20px'}}>*/}
                {/*<Col span={4}>*/}
                  {/*<Card*/}
                    {/*bordered={false}*/}
                    {/*style={{textAlign: 'center', background: '#eee', marginTop: 10}}*/}
                    {/*loading={loading30}*/}
                  {/*>*/}
                    {/*<h4>{formatMessage(messages.sti_alarm_time)}</h4>*/}
                    {/*<h4 style={{color: '#3f89e1'}}>{payTenantSum&&payTenantSum.count}</h4>*/}
                  {/*</Card>*/}
                  {/*<Card*/}
                    {/*bordered={false}*/}
                    {/*style={{textAlign: 'center', background: '#eee', marginTop: 20}}*/}
                    {/*loading={loading31}*/}
                  {/*>*/}
                    {/*<h4>{formatMessage(messages.sti_message_alarm)}</h4>*/}
                    {/*<h4 style={{color: '#3f89e1'}}>{payAppSum&&payAppSum.count}</h4>*/}
                  {/*</Card>*/}

                  {/*<Card*/}
                    {/*bordered={false}*/}
                    {/*style={{textAlign: 'center', background: '#eee', marginTop: 20}}*/}
                    {/*loading={loading33}*/}
                  {/*>*/}
                    {/*<h4>{formatMessage(messages.sti_email_alarm)}</h4>*/}
                    {/*<h4 style={{color: '#3f89e1'}}>{payOrderSum&&payOrderSum.count}</h4>*/}

                  {/*</Card>*/}

                {/*</Col>*/}
                {/*<Col span={18}>*/}

                  {/*<Card*/}
                    {/*className={styles.statistics_card}*/}
                    {/*title={*/}
                      {/*<div className="dlxB">*/}
                        {/*<span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_alarm_trend)}</span>*/}
                        {/*<div>*/}
                          {/*<img style={{width:16,position:'relative',right:16}} onClick={this.totalOrder} src={listToChart}/>*/}
                          {/*<Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changePayOrderChart}>*/}
                            {/*{options}*/}
                          {/*</Select>*/}
                          {/*<RangePicker*/}
                            {/*allowClear={false}*/}
                            {/*style={{width:200}}*/}
                            {/*defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}*/}
                            {/*format={dateFormat}*/}
                            {/*onChange={this.changePayOrderChartTime}*/}
                          {/*/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                    {/*}*/}
                    {/*style={{marginTop: 8}}*/}
                    {/*bodyStyle={{padding: '0px'}}*/}
                  {/*>*/}
                    {/*{totalOrderData?*/}
                      {/*<Spin spinning={loading35}>*/}
                        {/*<StatisticChart*/}
                          {/*height={275}*/}
                          {/*data={payOrderChartData}*/}
                        {/*/>*/}
                      {/*</Spin>:<Table*/}
                        {/*scroll={{y:200}}*/}
                        {/*dataSource={payOrderChartData}*/}
                        {/*columns={totalColumns}*/}
                        {/*pagination={false}*/}
                      {/*/>*/}
                    {/*}*/}
                  {/*</Card>*/}

                  {/*<Card*/}
                    {/*className={styles.statistics_card}*/}
                    {/*title={*/}
                      {/*<div className="dlxB">*/}
                        {/*<span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_message_alarm)}</span>*/}
                        {/*<div>*/}
                          {/*<img style={{width:16,position:'relative',right:16}} onClick={this.addTotalOrder} src={listToChart}/>*/}
                          {/*<Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changePayAddOrderChart}>*/}
                            {/*{options}*/}
                          {/*</Select>*/}
                          {/*<RangePicker*/}
                            {/*allowClear={false}*/}
                            {/*style={{width:200}}*/}
                            {/*defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}*/}
                            {/*format={dateFormat}*/}
                            {/*onChange={this.changePayAddOrderChartTime}*/}
                          {/*/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                    {/*}*/}
                    {/*style={{marginTop: 8}}*/}
                    {/*bodyStyle={{padding: '0px'}}*/}
                  {/*>*/}
                    {/*{addTotalOrderData?*/}
                      {/*<Spin spinning={loading36}>*/}
                        {/*<StatisticChart*/}
                          {/*height={275}*/}
                          {/*data={payAddOrderChartData}*/}
                        {/*/>*/}
                      {/*</Spin>:<Table*/}
                        {/*scroll={{y:200}}*/}
                        {/*dataSource={payAddOrderChartData}*/}
                        {/*columns={totalColumns}*/}
                        {/*pagination={false}*/}
                      {/*/>*/}
                    {/*}*/}
                  {/*</Card>*/}


                  {/*<Card*/}
                    {/*className={styles.statistics_card}*/}
                    {/*title={*/}
                      {/*<div className="dlxB">*/}
                        {/*<span style={{lineHeight:'30px'}}>{formatMessage(messages.sti_email_alarm)}</span>*/}
                        {/*<div>*/}
                          {/*<img style={{width:16,position:'relative',right:16}} onClick={this.addTotalOrder} src={listToChart}/>*/}
                          {/*<Select style={{ width: 75,position:'relative',right:6}} defaultValue={'day'} onChange={this.changePayAddOrderChart}>*/}
                            {/*{options}*/}
                          {/*</Select>*/}
                          {/*<RangePicker*/}
                            {/*allowClear={false}*/}
                            {/*style={{width:200}}*/}
                            {/*defaultValue={[moment(this.state.starttime, dateFormat), moment(this.state.endtime, dateFormat)]}*/}
                            {/*format={dateFormat}*/}
                            {/*onChange={this.changePayAddOrderChartTime}*/}
                          {/*/>*/}
                        {/*</div>*/}
                      {/*</div>*/}
                    {/*}*/}
                    {/*style={{marginTop: 8}}*/}
                    {/*bodyStyle={{padding: '0px'}}*/}
                  {/*>*/}
                    {/*{addTotalOrderData?*/}
                      {/*<Spin spinning={loading36}>*/}
                        {/*<StatisticChart*/}
                          {/*height={275}*/}
                          {/*data={payAddOrderChartData}*/}
                        {/*/>*/}
                      {/*</Spin>:<Table*/}
                        {/*scroll={{y:200}}*/}
                        {/*dataSource={payAddOrderChartData}*/}
                        {/*columns={totalColumns}*/}
                        {/*pagination={false}*/}
                      {/*/>*/}
                    {/*}*/}
                  {/*</Card>*/}

                {/*</Col>*/}
              {/*</Row>*/}
            {/*</TabPane>*/}
          </Tabs>
        </Card>


      </PageHeaderLayout>
    );
  }
}
