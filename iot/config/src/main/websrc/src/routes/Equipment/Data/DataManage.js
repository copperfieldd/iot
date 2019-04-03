import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Modal, Input, DatePicker, Select} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";
const FormItem = Form.Item;

@connect(({equipmentData, loading}) => ({
  equipmentData,
  loading: loading.effects['equipmentData/fetch_getDeviceList_action'],
  exportLoading:loading.effects['equipmentManage/fetch_tokenExport_action'],
}))
@injectIntl
@Form.create()
export default class DataManage extends Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys:[],
    }
  };


  componentDidMount(){
    const {equipmentData:{deviceList_params}} = this.props;
    this.loadEquipmentManageList(deviceList_params);
  }

  loadEquipmentManageList=(params)=>{
    this.props.dispatch({
      type:'equipmentData/fetch_getDeviceList_action',
      payload:params,
    })
  };

  changeTablePage=(pagination)=>{
    const {equipmentData:{deviceList_params}} = this.props;
    const params = {
      ...deviceList_params,
      start:(pagination.current-1)*deviceList_params.count,
    };
    this.loadEquipmentManageList(params)
  };

  delEquipment = (id) => {
    const {equipmentData:{deviceList_params,deviceList},intl:{formatMessage}} =  this.props;
    const params = {
      ids: id,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'equipmentData/fetch_delDevice_action',
          payload: params,
          params: {
            ...deviceList_params,
            start:deviceList.value.length===1&&deviceList_params.start-10>=0?deviceList_params.start-10:deviceList_params.start
          },
        })
      }
    });
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };


  //查询条件提交
  handleOk = (e) => {
    const {equipmentData:{deviceList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...deviceList_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadEquipmentManageList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentData:{deviceList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: deviceList_params.count
    }
    this.loadEquipmentManageList(values);
  };


  render() {
    const {equipmentData:{deviceList_params,deviceList},loading,intl:{formatMessage}} = this.props;
    const {visible } = this.state;
    const paginationProps = {
      pageSize:deviceList_params.count,
      total:deviceList.totalCount,
      current:(deviceList_params.start / deviceList_params.count) +1,
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

    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipmentName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:deviceList_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipmentNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipmentDeviceConfig)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('deviceSettingName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:deviceList_params.deviceSettingName
          })
          (
            <Input placeholder={formatMessage(messages.equipmentDeviceConfig_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.protocol)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('protocol', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:deviceList_params.protocol
          })
          (
            <Select placeholder={formatMessage(messages.equipment_protocol_select)}>
              <Option value={1}>MQTT</Option>
              <Option value={2}>HTTP</Option>
              <Option value={3}>CoAP</Option>
              <Option value={4}>TCP</Option>
              <Option value={5}>UDP</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.tenantName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('tenantName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:deviceList_params.tenantName
          })
          (
            <Input placeholder={formatMessage(basicMessages.tenantName_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: deviceList_params.startTime && moment(deviceList_params.startTime) || undefined
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
            initialValue: deviceList_params.endTime && moment(deviceList_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const columns = [{
      title: formatMessage(messages.equipmentName),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.equipmentDeviceConfig),
      dataIndex: 'deviceSettingName',
      key: 'deviceSettingName',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.protocol),
      dataIndex: 'protocol',
      key: 'protocol',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===1?'MQTT':text===2?'HTTP':text===3?'CoAP':text===4?'TCP':text===5?'UDP':null}</span>
      )
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenantName',
      key: 'tenantName',
      className:'table_row_styles',
    },{
      title:  formatMessage(basicMessages.createTime),
      dataIndex:'createTime',
      key: 'createTime',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className:'table_row_styles',
      width:'240px',
      render: (text, record) => (
        <span>
           <a onClick={()=>{
             this.props.dispatch(routerRedux.push(`/equipment/dataManage/item/${encodeURIComponent(JSON.stringify(record))}`))
           }}
           >
            <Icons item={true}/>
          </a>
        </span>
      ),
    }];
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
            <div>

            </div>

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
            rowKey={record => record.id}
            pagination={paginationProps}
            dataSource={deviceList&&deviceList.value}
            onChange={this.changeTablePage}
            loading={loading}
            columns={columns}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
