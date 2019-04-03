import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Form, Row, Col, Card, Button, Select,DatePicker,message,Spin} from 'antd';
import styles from "../../BeingPushed.less";
import {LineChart} from "../../../../components/Charts";
import PieChart from './PieChart';
import {getLoginUserType} from "../../../../utils/utils";
import basicMessages from '../../../../messages/common/basicTitle';
import messages from "../../../../messages/bushing";
import {injectIntl} from "react-intl";
const Option = Select.Option
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';


@Form.create()
@connect(({beingPushed, loading}) => ({
  beingPushed,
  taskLoading: loading.effects['beingPushed/fetch_getTaskList_action'],
  loading:loading.effects['beingPushed/fetch_messagePieChart_action'],
  loading1:loading.effects['beingPushed/fetch_messageLineChart_action'],
  loading2:loading.effects['beingPushed/fetch_messageLineChart_action'],
}))
@injectIntl
export default class MessageStatistics extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      tabKey: '1',
      tenantValue:null,
      applicationValue:null,
      dataType1:1,
      dataType2:1,
      start1:null,
      end1:null,
      start2:null,
      end2:null,
      queryId:null,
    }
  };
  componentDidMount(){
    const {beingPushed:{messageLineChart_params}} = this.props;
    this.loadTenantList();
    this.setState({
      start1:messageLineChart_params.start,
      end1:messageLineChart_params.end,
    });
  }


  loadTenantList=()=>{
    const userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    const userType = getLoginUserType();

    this.props.dispatch({
      type:'beingPushed/fetch_getAllTenantList_action',
      payload:null,
      callback:(res)=>{
        this.setState({
          tenantValue:res.length>0?res[0].id:null
        });
        if(res.length>0){
          this.loadApplication(res[0].id);
          this.loadSendTypeCount(res[0].id,1);
        }else if(userType===1){
          this.loadApplication(userInfo&&userInfo.value&&userInfo.value.tenantId);
          this.loadSendTypeCount(userInfo&&userInfo.value&&userInfo.value.tenantId,1);
        }else if(userType===3){
          this.loadSendTypeCount(userInfo&&userInfo.value&&userInfo.value.appId,2);

        }
        this.loadMessageTypeLineChart();
      }
    })
  }

  changeDateType1=(value)=>{
    this.setState({
      dataType1:value
    })
  }

  changeDateType2=(value)=>{
    this.setState({
      dataType2:value
    })
  };

  changeTenant=(value)=>{
    this.setState({
      tenantValue:value,
      applicationValue:null,
    })
    this.loadApplication(value);
    this.loadSendTypeCount(value,1);
  };

  //切换应用
  changeApplication=(value)=>{
    this.setState({
      applicationValue:value
    });
    this.loadSendTypeCount(value,2);
  };

  loadApplication=(value)=>{
    this.props.dispatch({
      type:'beingPushed/fetch_getAllApplicationByTenant_action',
      payload:{
        tenantId:value
      }
    })
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

  //改变消息推送的选择时间
  onChangeMessageTime=(data,dataString)=>{
    this.setState({
      start1:dataString[0],
      end1:dataString[1],
    })
  }

  onChangeAppTime=(data,dataString)=>{
    this.setState({
      start2:dataString[0],
      end2:dataString[1],
    })
  }

  //获取消息推送的折线图
  loadMessageTypeLineChart=()=>{
    const {beingPushed:{rememberDataChildTabs}} = this.props;
    const {intl:{formatMessage}} = this.props;
    const {start1,end1,dataType1} = this.state;
    if(!start1||!end1){
      message.error(formatMessage(messages.msg_select_time));
      return;
    }
    this.props.dispatch({
      type:'beingPushed/fetch_messageLineChart_action',
      payload:{
        type:1,
        time:dataType1,
        start:start1,
        end:end1,
        message_type:rememberDataChildTabs==='D'?0:rememberDataChildTabs==='E'?2:1,
      }
    })
  };

  //获取应用的折线图
  loadMessageAppLineChart=()=>{
    const userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    const userType = getLoginUserType();
    const {intl:{formatMessage}} = this.props;
    const {dataType2,start2,end2,tenantValue,applicationValue} = this.state;
    const {beingPushed:{rememberDataChildTabs}} = this.props;
    if(!start2||!end2){
      message.error(formatMessage(messages.msg_select_time));
      return;
    }
    let type,id;
    if(userType!==3){
      if(applicationValue){
        type=2;
        id=applicationValue;
      }else{
        type=1;
        id=tenantValue;
      }
    }else{
      type=2;
      id=userInfo.value.appId
    }

    this.props.dispatch({
      type:'beingPushed/fetch_messageLineChart_action',
      payload:{
        type:2,
        message_type:rememberDataChildTabs==='D'?0:rememberDataChildTabs==='E'?2:1,
        queryType:type,
        queryId:id,
        time:dataType2,
        start:start2,
        end:end2,
      }
    })
  };


  loadItem=()=>{
    const {beingPushed:{rememberDataChildTabs}} = this.props;
    const {intl:{formatMessage}} = this.props;
    const {start1,end1} = this.state;
    if(!start1||!end1){
      message.error(formatMessage(messages.msg_select_time));
      return;
    }
    this.props.dispatch({
      type:'beingPushed/fetch_exportItem_action',
      payload:{
        type:rememberDataChildTabs==='D'?0:rememberDataChildTabs==='E'?2:1,
        state:6,
        startTime:start1,
        end:end1
      }
    })
  };

  uploadItem2=()=>{
    const {beingPushed:{rememberDataChildTabs}} = this.props;
    const {intl:{formatMessage}} = this.props;
    const {start2,end2} = this.state;
    if(!start2||!end2){
      message.error(formatMessage(messages.msg_select_time));
      return;
    }
    this.props.dispatch({
      type:'beingPushed/fetch_exportItem_action',
      payload:{
        type:rememberDataChildTabs==='D'?0:rememberDataChildTabs==='E'?2:1,
        state:0,
        startTime:start2,
        end:end2
      }
    })
  };

  render() {
    const userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    const userType = getLoginUserType();
    const {beingPushed:{messagePieChart,getAllTenantList,getAllApplicationByTenant,messageTypeCount,messageLineChart,messageApplicationLineChart,messageLineChart_params},taskLoading} = this.props;
    const {tenantValue} = this.state;
    const {loading2,loading1,loading} = this.props;
    const {intl:{formatMessage}} = this.props;

    let lineData = [];
    let appLineData = [];
    let successMessageCount,failedMessageCount,cancelMessageCount;//发送成功,//发送失败,//已取消
    messageLineChart&&messageLineChart.length>0&&messageLineChart.map(item=>{
      let data = {
        x:item.time,
        y1:item.success,
        y2:item.failed,
        y3:item.cancel,
      }
      lineData.push(data);
    });

    messageApplicationLineChart&&messageApplicationLineChart.length>0&&messageApplicationLineChart.map(item=>{
      let data = {
        x:item.time,
        y1:item.success,
        y2:item.failed,
        y3:item.cancel,
      }
      appLineData.push(data);
    });

    let data1 = messagePieChart&&messagePieChart.success&&messagePieChart.success.map((item)=>{
      return{
        'x':item.appName,'y':item.count
      }
    });
    let data2 = messagePieChart&&messagePieChart.failed&&messagePieChart.failed.map((item)=>{
      return{
        'x':item.appName,'y':item.count
      }
    });
    let data3 = messagePieChart&&messagePieChart.cancel&&messagePieChart.cancel.map((item)=>{
      return{
        'x':item.appName,'y':item.count
      }
    });

    messageTypeCount&&messageTypeCount.length>0&&messageTypeCount.map(item=>{
      if(item.state===2){
        cancelMessageCount=item.count
      }else if(item.state===4){
        successMessageCount=item.count
      }else if(item.status===5){
        failedMessageCount=item.count
      }
    });

    return (
      <div>
        {
          userType!==3?
            <Card
              style={{ marginBottom: 10}}
              className={styles.msgCard}
              bodyStyle={{padding:'12px 12px'}}
              title={formatMessage(messages.msg_send_total)}
            >
              <Spin spinning={loading}>
                <PieChart style={{margin:'10px 0'}} data1 = {data1} data2 = {data2} data3 = {data3}/>
              </Spin>
              <div>
                <span>{formatMessage(basicMessages.select_time)}</span>
                <RangePicker defaultValue={[moment(messageLineChart_params&&messageLineChart_params.start, dateFormat), moment(messageLineChart_params&&messageLineChart_params.end, dateFormat)]} style={{marginLeft:'6px'}} onChange={this.onChangeMessageTime}/>
                <Select style={{width:80,marginLeft:6}} defaultValue={this.state.dataType1} onChange={this.changeDateType1}>
                  <Option value={1}>{formatMessage(basicMessages.day)}</Option>
                  <Option value={2}>{formatMessage(basicMessages.month)}</Option>
                </Select>
                <Button style={{marginLeft:'6px'}} type={'primary'} onClick={this.loadMessageTypeLineChart}>{formatMessage(basicMessages.search)}</Button>
                <Button style={{marginLeft:'6px'}} type={'primary'} onClick={this.loadItem}>{formatMessage(messages.msg_item_download)}</Button>
              </div>

              <div style={{marginTop:40}}>
                <Spin spinning={loading1}>
                  <LineChart
                    height={300}
                    data={lineData}
                    titleMap={{ y1: formatMessage(messages.msg_push_success), y2: formatMessage(messages.msg_push_failed), y3: formatMessage(messages.msg_push_cancel)}}
                  />
                </Spin>
              </div>
            </Card>:null
        }


        <Card
          className={styles.msgCard}
          bodyStyle={{padding:'12px 12px'}}
          title={formatMessage(messages.msg_send_total)}
        >
          <div>
            {
              userType===0?
                <span>
              <span>{formatMessage(basicMessages.select_tenant)}</span>
              <Select value={tenantValue} style={{width:120,marginLeft:8}} onChange={this.changeTenant}>
                {
                  getAllTenantList&&getAllTenantList.map((item,index)=>{
                    return(
                      <Option key={index} value={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
              </span>:null
            }

            {
              userType!==3?
                <span style={{marginLeft:10}}>
              <span>{formatMessage(basicMessages.select_application)}</span>
              <Select defaultValue={1} style={{width:120,marginLeft:8}} onChange={this.changeApplication}>
                <Option value={1}>{formatMessage(basicMessages.all)}</Option>
                {
                  getAllApplicationByTenant.map((item,index)=>{
                    return(
                      <Option value={item.id} key={item.id}>{item.name}</Option>
                    )
                  })
                }

              </Select>
            </span>
                :null
            }


            <Row gutter={32} style={{textAlign:'center',margin:'30px 0'}}>
              <Col span={6} offset={3}>
                <Card style={{background:'#e8e8e8'}}>
                  <p>{formatMessage(messages.msg_push_success)}</p>
                  <h3 style={{color:'#3f89e1'}}>{successMessageCount?successMessageCount:0}</h3>
                </Card>
              </Col>
              <Col  span={6}>
                <Card style={{background:'#e8e8e8'}}>
                  <p>{formatMessage(messages.msg_push_failed)} </p>
                  <h3 style={{color:'#3f89e1'}}>{failedMessageCount?failedMessageCount:0}</h3>
                </Card>
              </Col>
              <Col  span={6}>
                <Card style={{background:'#e8e8e8'}}>
                  <p>{formatMessage(messages.msg_push_cancel)}</p>
                  <h3 style={{color:'#3f89e1'}}>{cancelMessageCount?cancelMessageCount:0}</h3>
                </Card>
              </Col>
            </Row>
          </div>

          <div>
            <span>{formatMessage(basicMessages.select_time)}</span>
            <RangePicker style={{marginLeft:'6px'}} onChange={this.onChangeAppTime}/>
            <Select style={{width:80,marginLeft:6}} defaultValue={1} onChange={this.changeDateType2}>
              <Option value={1}>{formatMessage(basicMessages.day)}</Option>
              <Option value={2}>{formatMessage(basicMessages.month)}</Option>
            </Select>
            <Button style={{marginLeft:'6px'}} onClick={this.loadMessageAppLineChart} type={'primary'}>{formatMessage(basicMessages.search)}</Button>
            <Button style={{marginLeft:'6px'}} type={'primary'} onClick={this.uploadItem2}>{formatMessage(messages.msg_item_download)}</Button>
          </div>
          <div style={{marginTop:40}}>
            <Spin spinning={loading2}>
              <LineChart
                height={300}
                data={appLineData}
                titleMap={{ y1: formatMessage(messages.msg_push_success), y2: formatMessage(messages.msg_push_failed), y3: formatMessage(messages.msg_push_cancel)}}
              />
            </Spin>
          </div>
        </Card>
      </div>
    );
  }
}
