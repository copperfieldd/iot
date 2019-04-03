import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Input, DatePicker,} from 'antd';
import styles from '../FirmwareUpdate.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import messages from "../../../messages/firmware";

const FormItem = Form.Item;


@connect(({hardwareUpdateBag, loading}) => ({
  hardwareUpdateBag,
  loading: loading.effects['hardwareUpdateBag/fetch_upgradePackageDetails_action'],
}))
@injectIntl
@Form.create()
export default class UpdateFails extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
    const {hardwareUpdateBag:{upgradePackageDetails_params},match:{params:{id}}} = this.props;
    let params = {
      packageIdc:id,
      start:0,
      count:upgradePackageDetails_params.count,
    };
    this.loadList(params);
  };

  loadList=(params)=>{
    this.props.dispatch({
      type:'hardwareUpdateBag/fetch_upgradePackageDetails_action',
      payload:{
        ...params,
        state:2,
      }
    })
  };


  onChangeTablePage=(pagination)=>{
    const {hardwareUpdateBag:{upgradePackageDetails_params}} = this.props;
    const params = {
      ...upgradePackageDetails_params,
      start:(pagination.current - 1)*upgradePackageDetails_params.count,
    };
    this.loadList(params);
  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  //查询条件提交
  handleOk = (e) => {
    const {hardwareUpdateBag:{upgradePackageDetails_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let startTime = fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined;
        let endTime = fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined;
        const values = {
          ...upgradePackageDetails_params,
          start: 0,
          ...fieldsValue,
          startTime: startTime&&moment(startTime).valueOf()||undefined,
          endTime: endTime&&moment(endTime).valueOf()||undefined,
        };
        this.loadList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {hardwareUpdateBag:{upgradePackageDetails_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: upgradePackageDetails_params.count
    };
    this.loadList(values);
  };


  render() {
    const {hardwareUpdateBag:{upgradePackageDetails_params,upgradePackageDetails},intl:{formatMessage},loading} = this.props;
    const {visible} = this.state;
    let userType = getLoginUserType();
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
    const paginationProps = {
      pageSize:upgradePackageDetails_params.count,
      total:upgradePackageDetails.totalCount,
      current:(upgradePackageDetails_params.start / upgradePackageDetails_params.count) + 1,
    };
    let index = {title: formatMessage(basicMessages.serial), dataIndex: 'index', key: 'index', className: 'table_row_styles',width:'90px',render:(text,record,index)=>(
        <span>{index+1}</span>
      )
    };
    let tenant = { title: formatMessage(basicMessages.tenant) , dataIndex: 'tenantName', key: 'tenantName', className:'table_row_styles',render:(text,record)=>(
        <span>{record.tenantName}</span>
      )};
    let app = {title: formatMessage(basicMessages.application), dataIndex: 'applicationName', key: 'applicationName', className:'table_row_styles',render:(text,record)=>(
        <span>{record.applicationName}</span>
      )};
    let packageName = {title: formatMessage(messages.firm_package_name), dataIndex: 'packageName', key: 'packageName', className:'table_row_styles',render:(text,record)=>(
        <span>{record.packageName}</span>
      )};
    let createTime = {title: formatMessage(basicMessages.time), dataIndex: 'createTime', key: 'createTime', className:'table_row_styles',render:(text,record)=>(
        <Ellipsis tooltip={moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')} lines={1}><span style={{display:'block'}}>{moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')}</span></Ellipsis>
      )};
    let deviceId = {title: formatMessage(messages.device_id), dataIndex: 'deviceId', key: 'deviceId', className:'table_row_styles',render:(text,record)=>(
        <span>{record.deviceId}</span>
      )};
    let upgradeResult = {title: formatMessage(messages.upgrade_result), dataIndex: 'upgradeResult', key: 'upgradeResult', className:'table_row_styles',render:(text,record)=>(
        <span>{record.upgradeResult==='0'?formatMessage(basicMessages.success):formatMessage(basicMessages.fail)}}</span>
      )};


    const columns = userType===0?[index,tenant,app,packageName,createTime,deviceId,upgradeResult]:
      userType===1?[index,app,packageName,createTime,deviceId,upgradeResult]:
        [index,packageName,createTime,deviceId,upgradeResult]
    ;

    const queryForm = (
      <Form>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.device_id)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('deviceId', {
            initialValue:upgradePackageDetails_params.deviceId
          })
          (
            <Input placeholder={formatMessage(messages.device_input_id)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: upgradePackageDetails_params.startTime && moment(upgradePackageDetails_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('endTime', {
            initialValue: upgradePackageDetails_params.endTime && moment(upgradePackageDetails_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );


    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            <div></div>

            <div>
             <span className='search' onClick={() => {
               this.setState({
                 visible: true,
               })
             }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
            </div>

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
            loading={loading}
            rowKey={(record,index)=>record.id}
            dataSource={upgradePackageDetails&&upgradePackageDetails.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.onChangeTablePage}
          />

        </Card>

        <div className='TxTCenter' style={{marginTop: 20}}>
          <Button className='mrgLf20'
                  onClick={() => {
                    this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdateBag`))
                  }}
          >{formatMessage(basicMessages.return)}</Button>
        </div>
      </PageHeaderLayout>
    );
  }
}
