import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card,Tabs,DatePicker,Select} from 'antd';
import styles from '../BeingPushed.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {LineChart} from '../../../components/Charts';
import MessageStatistics from './Compent/MessageStatistics';
import TaskModal from './Modal/TaskModal';
import {getLoginUserType} from "../../../utils/utils";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import messages from "../../../messages/bushing";
import Icons from "../../../components/Icon";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const FormItem = Form.Item;

@connect(({beingPushed, loading}) => ({
  beingPushed,
  taskLoading: loading.effects['beingPushed/fetch_getTaskList_action'],
}))
@injectIntl
@Form.create()
export default class MessageTenantList extends Component {
  constructor() {
    super();
    this.state = {
      visible:false,
      tabKey:'A',
      tabBigKey:'1',
      pieChartData:null,
      taskVisible:false,
      visible1:false,
      visible2:false,
      visible3:false,
      typeValue:null,
    }
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  handelVisible1=()=>{
    this.setState({
      visible1:!this.state.visible1,
    })
  };

  handelVisible2=()=>{
    this.setState({
      visible2:!this.state.visible2,
    })
  };

  handelVisible3=()=>{
    this.setState({
      visible3:!this.state.visible3,
    })
  };

  componentDidMount(){
    const {beingPushed:{getTaskList_params,messageItemList_params,rememberDataChildTabs}} = this.props;
    this.loadTaskList(getTaskList_params);
    this.loadMessageItemList(messageItemList_params);
    this.setState({
      tabKeys:rememberDataChildTabs
    })
  }

  loadTaskList=(params)=>{
    this.props.dispatch({
      type:'beingPushed/fetch_getTaskList_action',
      payload:params,
    })
  };

  loadMessageItemList=(params)=>{
    this.props.dispatch({
      type:'beingPushed/fetch_messageItemList_action',
      payload:params,
    })
  };

  loadPieChartData=(params,key)=>{
    this.props.dispatch({
      type:'beingPushed/fetch_messagePieChart_action',
      payload:params,
      callback:(res)=>{
        this.setState({
          tabKeys:key,
          pieChartData:res
        })
      }
    })
  };

  changeTabs=(key)=>{
    const {beingPushed:{messagePieChart_params}} = this.props;
    switch (key) {
      case '1':
        this.setState({
          tabBigKey:key,
        });
        break;
      case '2':
        this.setState({
          tabBigKey:key,
        });
        break;
      case '3':
        this.setState({
          tabBigKey:key,
        });
        this.loadPieChartData(messagePieChart_params);
        break;
      default:
    }
  };

  changeChildTabs=(key)=>{
    const {beingPushed:{messageItemList_params}} = this.props;
    switch (key) {
      case 'A':
        this.setState({
          tabKey:key,
        });
        let params1 = {
          ...messageItemList_params,
          start:0,
          count:10,
          state:6,
          type:0,
          queryType:0,
        };
        this.loadMessageItemList(params1);
        break;
      case 'B':
        this.setState({
          tabKey:key,
        });
        let params2 = {
          ...messageItemList_params,
          start:0,
          count:10,
          state:6,
          type:2,
          queryType:0,
        };
        this.loadMessageItemList(params2);
        break;
      case 'C':
        this.setState({
          tabKey:key,
        });
        let params3 = {
          ...messageItemList_params,
          start:0,
          count:10,
          state:6,
          type:1,
          queryType:0,

        };
        this.loadMessageItemList(params3);
        break;
      default:
    }
  };

  //请求发送统计中的总数
  loadSendTypeCount=(value,type)=>{
    const {beingPushed:{rememberDataChildTabs}} = this.props;
    this.props.dispatch({
      type:'beingPushed/fetch_messageTypeCount_action',
      payload:{
        queryType:type,
        queryId:value,
        message_type:rememberDataChildTabs==='D'?0:rememberDataChildTabs==='E'?2:1,
      }
    })
  };


  changeChildTabsPie=(key)=>{
    const userType = getLoginUserType();
    const userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    const {beingPushed:{messageItemList_params}} = this.props;
    this.props.dispatch({
      type:'beingPushed/rememberDataChildTabs',
      payload:key
    });
    this.setState({
      tabKeys:key
    });
    switch (key) {
      case 'D':
        let params1 = {
          ...messageItemList_params,
          message_type:0,
        };
        this.loadPieChartData(params1);
        this.loadMessageTypeLineChart(0);
        if(userType===3){
          this.loadSendTypeCount(userInfo&&userInfo.value&&userInfo.value.appId,2);
        }
        break;
      case 'E':
        let params2 = {
          ...messageItemList_params,
          message_type:2,
        };
        this.loadPieChartData(params2,key);
        this.loadMessageTypeLineChart(2);
        if(userType===3){
          this.loadSendTypeCount(userInfo&&userInfo.value&&userInfo.value.appId,2);
        }
        break;
      case 'F':
        let params3 = {
          ...messageItemList_params,
          message_type:1,
        };
        this.loadPieChartData(params3);
        this.loadMessageTypeLineChart(1);
        if(userType===3){
          this.loadSendTypeCount(userInfo&&userInfo.value&&userInfo.value.appId,2);
        }
        break;
      default:
    }
  };


  openTaskModal=()=>{
    this.setState({
      taskVisible:!this.state.taskVisible
    })

  };

  //取消发送
  messageCancel=(id)=>{
    const {beingPushed:{getTaskList_params}} = this.props;
    this.props.dispatch({
      type:'beingPushed/fetch_messageCancel_action',
      payload:{
        state:2,
        id:id,
      },
      callback:()=>{
        this.loadTaskList(getTaskList_params);
      }
    })
  };

  //获取消息推送的折线图
  loadMessageTypeLineChart=(messageType)=>{
    const {beingPushed:{messageLineChart_params}} = this.props;
    this.props.dispatch({
      type:'beingPushed/fetch_messageLineChart_action',
      payload:{
        type:1,
        time:1,
        start:messageLineChart_params.start,
        end:messageLineChart_params.end,
        message_type:messageType
      }
    })
  };

  onChange1=(pagination)=>{
    const {beingPushed:{getTaskList_params}} = this.props;
    let params = {
      ...getTaskList_params,
      start:(pagination.current - 1) * 10,
    };
    this.loadTaskList(params);
  };

  onChange2=(pagination)=>{
    const {beingPushed:{messageItemList_params}} = this.props;
    let params = {
      ...messageItemList_params,
      start:(pagination.current - 1) * 10,
      count:10,
    };
    this.loadMessageItemList(params);
  };

  //重置查询表单
  handleReset = () => {
    const {beingPushed:{getTaskList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: getTaskList_params.count,
      queryType: 0,
      state: 6,
      type: 3
    };

    this.loadTaskList(values);
  };

  handleOk=(e)=>{
    const {beingPushed:{getTaskList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...getTaskList_params,
          start: 0,
          ...fieldsValue,
          queryType: fieldsValue.queryType?fieldsValue.queryType:0,
          state: fieldsValue.state?fieldsValue.state:6,
          type: fieldsValue.type?fieldsValue.type:3
        };
        this.loadTaskList(values)
      }
    })
  }

  //重置查询表单
  handleReset1 = () => {
    const {beingPushed:{messageItemList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      count: messageItemList_params.count,
      type:messageItemList_params.type,
      state:6,
      queryType: 0,
      smsType: 0,
      start: 0,
      startTime: "2000-01-01",
      end: "2019-02-13",
    };
    this.loadMessageItemList(values);
  };

  handleOk1=(e)=>{
    const {beingPushed:{messageItemList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...messageItemList_params,
          ...fieldsValue,
          state:6,
          queryType:fieldsValue.queryType?fieldsValue.queryType: 0,
          smsType:fieldsValue.smsType?fieldsValue.smsType:0,
          start: 0,
          startTime: fieldsValue.startTime ? fieldsValue.startTime.format('YYYY-MM-DD'): messageItemList_params.startTime,
          end: fieldsValue.end ? fieldsValue.end.format('YYYY-MM-DD') : messageItemList_params.end,
        };
        this.loadMessageItemList(values)
      }
    })
  }

  //重置查询表单
  handleReset2 = () => {
    const {beingPushed:{messageItemList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      count: messageItemList_params.count,
      type:messageItemList_params.type,
      state:6,
      queryType: 0,
      smsType: 0,
      start: 0,
      startTime: "2000-01-01",
      end: "2019-02-13",
    };
    this.loadMessageItemList(values);
  };

  handleOk2=(e)=>{
    const {beingPushed:{messageItemList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...messageItemList_params,
          ...fieldsValue,
          state:6,
          queryType:fieldsValue.queryType?fieldsValue.queryType: 0,
          smsType:fieldsValue.smsType?fieldsValue.smsType:0,
          start: 0,
          startTime: fieldsValue.startTime ? fieldsValue.startTime.format('YYYY-MM-DD'): messageItemList_params.startTime,
          end: fieldsValue.end ? fieldsValue.end.format('YYYY-MM-DD') : messageItemList_params.end,
        };
        this.loadMessageItemList(values)
      }
    })
  };

  //重置查询表单
  handleReset3 = () => {
    const {beingPushed:{messageItemList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      count: messageItemList_params.count,
      type:messageItemList_params.type,
      state:6,
      queryType: 0,
      smsType: 0,
      start: 0,
      startTime: "2000-01-01",
      end: "2019-02-13",
    };
    this.loadMessageItemList(values);
  };

  handleOk3=(e)=>{
    const {beingPushed:{messageItemList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...messageItemList_params,
          ...fieldsValue,
          state:6,
          queryType:fieldsValue.queryType?fieldsValue.queryType: 0,
          smsType:fieldsValue.smsType?fieldsValue.smsType:0,
          start: 0,
          startTime: fieldsValue.startTime ? fieldsValue.startTime.format('YYYY-MM-DD'): messageItemList_params.startTime,
          end: fieldsValue.end ? fieldsValue.end.format('YYYY-MM-DD') : messageItemList_params.end,
        };
        this.loadMessageItemList(values)
      }
    })
  }


  render() {
    let userType = getLoginUserType();
    const {visible,tabKey,tabBigKey,taskVisible,tabKeys,visible1,visible2,visible3} = this.state;
    const {beingPushed:{getTaskList,getTaskList_params,messageItemList,messageItemList_params,rememberDataChildTabs},taskLoading,intl:{formatMessage}} = this.props;
    const pagination1 = {
      current:(getTaskList_params.start / getTaskList_params.count)+1,
      total:getTaskList.total,
      pageSize:getTaskList_params.count,
    };

    const pagination2 = {
      current:(messageItemList_params.start / messageItemList_params.count)+1,
      total:messageItemList.total,
      pageSize:messageItemList_params.count,
    };

    const pagination3 = {
      current:(messageItemList_params.start / messageItemList_params.count)+1,
      total:messageItemList.total,
      pageSize:messageItemList_params.count,
    }

    const pagination4 = {
      current:(messageItemList_params.start / messageItemList_params.count)+1,
      total:messageItemList.total,
      pageSize:messageItemList_params.count,
    };

    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
    };


    const msgColumns = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'application_name',
      key: 'application_name',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_type),
      dataIndex:'sms_type',
      key: 'sms_type',
      className:'table_row_styles',
      //1：验证码 2：短信通知 3：推广短信
      render:(text,record)=>(
        <span>{text===1?formatMessage(basicMessages.verification_code):text===2?formatMessage(messages.msg_message_notice):formatMessage(messages.msg_promote_SMS)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];

    const msgColumns1 = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'application_name',
      key: 'application_name',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_type),
      dataIndex:'sms_type',
      key: 'sms_type',
      className:'table_row_styles',
      //1：验证码 2：短信通知 3：推广短信
      render:(text,record)=>(
        <span>{text===1?formatMessage(basicMessages.verification_code):text===2?formatMessage(messages.msg_message_notice):formatMessage(messages.msg_promote_SMS)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];

    const msgColumns2 = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_type),
      dataIndex:'sms_type',
      key: 'sms_type',
      className:'table_row_styles',
      //1：验证码 2：短信通知 3：推广短信
      render:(text,record)=>(
        <span>{text===1?formatMessage(basicMessages.verification_code):text===2?formatMessage(messages.msg_message_notice):formatMessage(messages.msg_promote_SMS)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];



    const AppColumns = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'application_name',
      key: 'application_name',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_title),
      dataIndex:'title',
      key: 'title',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];

    const AppColumns1 = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'application_name',
      key: 'application_name',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_title),
      dataIndex:'title',
      key: 'title',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];

    const AppColumns2 = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_title),
      dataIndex:'title',
      key: 'title',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];

    const mailColumns = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',

    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'application_name',
      key: 'application_name',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    }, {
      title: formatMessage(messages.msg_title),
      dataIndex:'title',
      key: 'title',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }]

    const mailColumns1 = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',

    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'application_name',
      key: 'application_name',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    }, {
      title: formatMessage(messages.msg_title),
      dataIndex:'title',
      key: 'title',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];

    const mailColumns2 = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',

    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'task_batch',
      key: 'task_batch',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>{
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      }
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'create_time',
      key: 'create_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_time),
      dataIndex:'push_time',
      key: 'push_time',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    }, {
      title: formatMessage(messages.msg_title),
      dataIndex:'title',
      key: 'title',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_msg_receiver),
      dataIndex:'user',
      key: 'user',
      className:'table_row_styles',
    }];


    const columns = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'id',
      key: 'id',
      className:'table_row_styles',

    }, {
      title: formatMessage(messages.msg_task_batch),
      dataIndex: 'taskBatch',
      key: 'taskBatch',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenantName',
      key: 'tenantName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'applicationName',
      key: 'applicationName',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.msg_push_type),
      dataIndex:'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_msg_push):text===1?formatMessage(messages.msg_email_push):formatMessage(messages.msg_app_push)}</span>
      )
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
      render: (text,record) => (
        <span>{moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')}</span>
      )
    },{
      title: formatMessage(basicMessages.finish_time),
      dataIndex:'endTime',
      key: 'endTime',
      className:'table_row_styles',
      render: (text,record) => (
        <span>{moment(record.endTime).format('YYYY/MM/DD HH:mm:ss')}</span>
      )
    },{
      title: formatMessage(basicMessages.duty_state),
      dataIndex:'state',
      key: 'state',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===0?formatMessage(messages.msg_push_waiting):text===1?formatMessage(messages.msg_push_sending):text===2?formatMessage(messages.msg_push_cancel):text===3?formatMessage(messages.msg_push_partial_success):text===4?formatMessage(messages.msg_push_success):formatMessage(messages.msg_push_failed)}</span>
      )
    },{
      title: formatMessage(messages.msg_msg_content),
      dataIndex:'content',
      key: 'content',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      dataIndex:'action',
      key: 'action',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>
          {/*<Button onClick={(e)=>{e.stopPropagation()}}>暂停</Button>*/}
          {
            userType===3&&record.status!==2?
              <a style={{marginRight:10}} onClick={()=>{
                this.messageCancel(record.id)
              }}>
                <Icons onCancel={true} />
              </a> :null
          }
          <a onClick={()=>{
            this.setState({
              tabBigKey:'2',
              tabKey:record.type===0?'A':record.type===1?'C':'B'
            });
            let params = {
              ...messageItemList_params,
              queryType:1,
              field:record.task_batch,
              type:record.type,
            }
            this.loadMessageItemList(params)
          }}>
            <Icons item={true}/>
          </a>
        </span>
      )
    }];

    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.select_type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryType', {

            initialValue:getTaskList_params&&getTaskList_params.queryType
            // rules: [{
            //   required: true, message: "请选择查询类型",
            // }],
          })
          (
            <Select>
              <Option value={0}>{formatMessage(basicMessages.all)}</Option>
              <Option value={1}>{formatMessage(messages.msg_task_batch)}</Option>
              <Option value={2}>{formatMessage(basicMessages.creator)}</Option>
              <Option value={3}>{formatMessage(messages.msg_msg_content)}</Option>
              <Option value={4}>{formatMessage(messages.msg_msg_receiver)}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[
              {
                max:512,message:formatMessage(basicMessages.cannot_more_than_512)
              }
            ],
            initialValue:getTaskList_params&&getTaskList_params.field
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.msg_push_state)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('state', {

            initialValue:getTaskList_params&&getTaskList_params.state
          })
          (
            <Select>
              <Option value={6}>{formatMessage(basicMessages.all)}</Option>
              <Option value={0}>{formatMessage(messages.msg_push_waiting)}</Option>
              <Option value={1}>{formatMessage(messages.msg_push_sending)}</Option>
              <Option value={2}>{formatMessage(messages.msg_push_cancel)}</Option>
              <Option value={3}>{formatMessage(messages.msg_push_partial_success)}</Option>
              <Option value={4}>{formatMessage(messages.msg_push_success)}</Option>
              <Option value={5}>{formatMessage(messages.msg_push_failed)}</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    )

    const queryForm1 = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.select_type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryType', {
            //initialValue:adapter_params.name
          })
          (
            <Select>
              <Option value={0}>{formatMessage(basicMessages.all)}</Option>
              <Option value={1}>{formatMessage(messages.msg_task_batch)}</Option>
              <Option value={2}>{formatMessage(basicMessages.creator)}</Option>
              <Option value={3}>{formatMessage(messages.msg_msg_content)}</Option>
              <Option value={4}>{formatMessage(messages.msg_msg_receiver)}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }]
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.msg_push_state)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('state', {
            //initialValue:adapter_params.name
          })
          (
            <Select>
              <Option value={6}>{formatMessage(basicMessages.all)}</Option>
              <Option value={0}>{formatMessage(messages.msg_push_waiting)}</Option>
              <Option value={1}>{formatMessage(messages.msg_push_sending)}</Option>
              <Option value={2}>{formatMessage(messages.msg_push_cancel)}</Option>
              <Option value={3}>{formatMessage(messages.msg_push_partial_success)}</Option>
              <Option value={4}>{formatMessage(messages.msg_push_success)}</Option>
              <Option value={5}>{formatMessage(messages.msg_push_failed)} </Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            //initialValue: adapter_params.startTime && moment(adapter_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY-MM-DD" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('end', {
            //initialValue: adapter_params.endTime && moment(adapter_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY-MM-DD" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const queryForm2 = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.select_type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryType', {
            //initialValue:adapter_params.name
          })
          (
            <Select>
              <Option value={0}>{formatMessage(basicMessages.all)}</Option>
              <Option value={1}>{formatMessage(messages.msg_task_batch)}</Option>
              <Option value={2}>{formatMessage(basicMessages.creator)}</Option>
              <Option value={3}>{formatMessage(messages.msg_msg_content)}</Option>
              <Option value={4}>{formatMessage(messages.msg_msg_receiver)}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }]
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.msg_push_state)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('state', {
            //initialValue:adapter_params.name
          })
          (
            <Select>
              <Option value={6}>{formatMessage(basicMessages.all)}</Option>
              <Option value={0}>{formatMessage(messages.msg_push_waiting)}</Option>
              <Option value={1}>{formatMessage(messages.msg_push_sending)}</Option>
              <Option value={2}>{formatMessage(messages.msg_push_cancel)}</Option>
              <Option value={3}>{formatMessage(messages.msg_push_partial_success)}</Option>
              <Option value={4}>{formatMessage(messages.msg_push_success)}</Option>
              <Option value={5}>{formatMessage(messages.msg_push_failed)} </Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            //initialValue: adapter_params.startTime && moment(adapter_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY-MM-DD" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('end', {
            //initialValue: adapter_params.endTime && moment(adapter_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY-MM-DD" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const queryForm3 = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.select_type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryType', {
            //initialValue:adapter_params.name
          })
          (
            <Select>
              <Option value={0}>{formatMessage(basicMessages.all)}</Option>
              <Option value={1}>{formatMessage(messages.msg_task_batch)}</Option>
              <Option value={1}>{formatMessage(basicMessages.creator)}</Option>
              <Option value={2}>{formatMessage(messages.msg_msg_content)}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }]
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.msg_push_state)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('state', {
            //initialValue:adapter_params.name
          })
          (
            <Select>
              <Option value={6}>{formatMessage(basicMessages.all)}</Option>
              <Option value={0}>{formatMessage(messages.msg_push_waiting)}</Option>
              <Option value={1}>{formatMessage(messages.msg_push_sending)}</Option>
              <Option value={2}>{formatMessage(messages.msg_push_cancel)}</Option>
              <Option value={3}>{formatMessage(messages.msg_push_partial_success)}</Option>
              <Option value={4}>{formatMessage(messages.msg_push_success)}</Option>
              <Option value={5}>{formatMessage(messages.msg_push_failed)} </Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            //initialValue: adapter_params.startTime && moment(adapter_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY-MM-DD" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('end', {
            //initialValue: adapter_params.endTime && moment(adapter_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY-MM-DD" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >

          <div className='mrgTB12'></div>
          <div className={styles.card_class}>
          <Tabs className={styles.service_tabs} defaultActiveKey={tabBigKey} activeKey={tabBigKey}
                onChange={this.changeTabs}
          >
            <TabPane tab={<Button type={tabBigKey==='1'?'primary':''} style={{width:100,height:40}}>{formatMessage(messages.msg_duty_list)}</Button>} key="1">
              <div className='mrgTB12 dlxB'>
                {
                  userType===3? <Button type={'primary'} icon={'plus'} onClick={this.openTaskModal} style={{marginBottom:'10px'}}>{formatMessage(messages.msg_new_task)}</Button>:<div></div>
                }
                <span className='search' onClick={() => {
                  this.setState({
                    visible: true,
                  })
                }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
              </div>

              <Query
                visible={visible}
                handelCancel={this.handelVisible}
                handleOk={this.handleOk}
                handleReset={this.handleReset}
              >
                {queryForm}
              </Query>

              <Table
                rowKey={(record,index)=>record.id}
                dataSource={getTaskList&&getTaskList.list}
                columns={columns}
                loading={taskLoading}
                pagination={pagination1}
                onChange={this.onChange1}
              />


            </TabPane>
            <TabPane tab={<Button type={tabBigKey==='2'?'primary':''} style={{width:100,height:40}}>{formatMessage(messages.msg_msg_item)}</Button>} key="2">
              <Tabs defaultActiveKey="A" activeKey={tabKey} onChange={this.changeChildTabs}>
                <TabPane tab={formatMessage(basicMessages.message)} key="A">
                  <div className='dlxB' style={{marginBottom:12}}>
                    <div></div>
                    <span className='search' onClick={() => {
                      this.setState({
                        visible1: true,
                      })
                    }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
                  </div>

                  <Query
                    visible={visible1}
                    handelCancel={this.handelVisible1}
                    handleOk={this.handleOk1}
                    handleReset={this.handleReset1}
                  >
                    {queryForm1}
                  </Query>
                  <Table
                    rowKey={(record,index)=>record.id}
                    dataSource={messageItemList&&messageItemList.list}
                    columns={userType===0?msgColumns:userType===1?msgColumns1:msgColumns2}
                    pagination={pagination2}
                    onChange={this.onChange2}
                  />
                </TabPane>
                <TabPane tab="APP" key="B">
                  <div className='dlxB' style={{marginBottom:12}}>
                    <div></div>
                    <span className='search' onClick={() => {
                      this.setState({
                        visible2: true,
                      })
                    }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
                  </div>

                  <Query
                    visible={visible2}
                    handelCancel={this.handelVisible2}
                    handleOk={this.handleOk2}
                    handleReset={this.handleReset2}
                  >
                    {queryForm2}
                  </Query>
                  <Table
                    rowKey={(record,index)=>record.id}
                    dataSource={messageItemList&&messageItemList.list}
                    columns={userType===0?AppColumns:userType===1?AppColumns1:AppColumns2}
                    pagination={pagination3}
                    onChange={this.onChange2}
                  />
                </TabPane>
                <TabPane tab={formatMessage(messages.msg_common_email)} key="C">
                  <div className='dlxB' style={{marginBottom:12}}>
                    <div></div>
                    <span className='search' onClick={() => {
                      this.setState({
                        visible3: true,
                      })
                    }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
                  </div>

                  <Query
                    visible={visible3}
                    handelCancel={this.handelVisible3}
                    handleOk={this.handleOk3}
                    handleReset={this.handleReset3}
                  >
                    {queryForm3}
                  </Query>
                  <Table
                    rowKey={(record,index)=>record.id}
                    dataSource={messageItemList&&messageItemList.list}
                    columns={userType===0?mailColumns:userType===1?mailColumns1:mailColumns2}
                    pagination={pagination4}
                    onChange={this.onChange2}
                  />
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab={<Button type={tabBigKey==='3'?'primary':''} style={{width:100,height:40}}>{formatMessage(messages.msg_msg_statistics)}</Button>} key="3">
              <Tabs defaultActiveKey={rememberDataChildTabs} onChange={this.changeChildTabsPie}>
                <TabPane tab={formatMessage(basicMessages.message)} key="D">
                  <MessageStatistics tabKeys={tabKeys}/>
                </TabPane>
                <TabPane tab="APP" key="E">
                  <MessageStatistics tabKeys={tabKeys}/>
                </TabPane>
                <TabPane tab={formatMessage(messages.msg_common_email)} key="F">
                  <MessageStatistics tabKeys={tabKeys}/>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs>
          </div>

          <TaskModal
            visible={taskVisible}
            typeValue={this.state.typeValue}
            handSubmit={(res)=>{
              delete res.email;
              delete res.userId;
              delete res.phone;
              let form = new FormData(); // FormData 对象
              form.append("uploadFile", res.uploadFile); // 文件对象
              form.append("type",res.type);
              form.append("content",res.content);
              form.append("signName",res.signName);
              form.append("templeId",res.templeId);
              form.append("variableValue",JSON.stringify(res.variableValue));
              form.append("title",res.title);
              this.props.dispatch({
                type:'beingPushed/fetch_taskAdd_action',
                payload:form,
                callback:()=>{
                  this.loadTaskList(getTaskList_params);
                  this.openTaskModal();
                  this.setState({
                    typeValue:null
                  })
                }
              })
            }}
            onCancel={this.openTaskModal}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
