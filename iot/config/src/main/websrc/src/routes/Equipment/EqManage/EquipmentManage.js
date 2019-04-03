import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Select, Card, Modal} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import ExportModal from "../../../components/ExportModal";
import {formatParams,formatParamsRowKeys} from '../../../utils/utils';
import Ellipsis from "../../../components/Ellipsis";
import Icons from '../../../components/Icon';

const FormItem = Form.Item;
const Option = Select.Option;



@connect(({equipmentManage, loading}) => ({
  equipmentManage,
  loading: loading.effects['equipmentManage/fetch_getDeviceList_action'],
  exportLoading:loading.effects['equipmentManage/fetch_tokenExport_action'],

}))
@injectIntl
@Form.create()
export default class EquipmentManage extends Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys:[],
    }
  };

  componentDidMount(){
    const {equipmentManage:{deviceList_params}} = this.props;
    this.loadEquipmentManageList(deviceList_params);
  }

  loadEquipmentManageList=(params)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_getDeviceList_action',
      payload:params,
    })
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  changeTablePage=(pagination)=>{
    const {equipmentManage:{deviceList_params}} = this.props;
    const params = {
      ...deviceList_params,
      start:(pagination.current-1)*deviceList_params.count,
    };
    delete params.excleType;

    this.loadEquipmentManageList(params)
  };


  delEquipment = (id) => {
    const {equipmentManage:{deviceList_params,deviceList},intl:{formatMessage}} =  this.props;
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
          type: 'equipmentManage/fetch_delDevice_action',
          payload: params,
          params: formatParams(deviceList.value,deviceList_params),
        })
      }
    });
  };

  delEquipments=()=>{
    const {equipmentManage:{deviceList_params,deviceList},intl:{formatMessage}} =  this.props;
    let ids = this.state.selectedRowKeys.join();
    const params = {
      ids: ids,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'equipmentManage/fetch_delDevice_action',
          payload: params,
          params: formatParamsRowKeys(deviceList.value,deviceList_params,this.state.selectedRowKeys),
        })
      }
    });
  }

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };


  //查询条件提交
  handleOk = (e) => {
    const {equipmentManage:{deviceList_params}} = this.props;
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
        delete values.excleType;
        this.loadEquipmentManageList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentManage:{deviceList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: deviceList_params.count
    };
    delete values.excleType;
    this.loadEquipmentManageList(values);
  };


  handleExport = (callback) => {
    const { dispatch, form:{ validateFields },equipmentManage:{deviceList_params} } = this.props;
    validateFields((err, values) => {
      if(err) return;
      dispatch({
        type: 'equipmentManage/fetch_tokenExport_action',
        payload:{
          ...values,
          ...deviceList_params,
        },
        callback:callback
      })
    });
  };


  render() {
    const { visible } = this.state;
    const {equipmentManage:{deviceList_params,deviceList},loading,intl:{formatMessage},exportLoading} = this.props;
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
      title:formatMessage(messages.equipmentDeviceConfig),
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
      width:'250px',
      render: (text, record) => (
        <span>
          <a onClick={()=>{
            this.props.dispatch(routerRedux.push(`/equipment/equipmentManage/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft:10}} onClick={()=>{
              this.props.dispatch(routerRedux.push(`/equipment/equipmentManage/item/${encodeURIComponent(JSON.stringify(record))}`))
              }}
          >
            <Icons item={true}/>
          </a>
           <a style={{marginLeft:10}} onClick={()=>{
             this.delEquipment(record.id);
           }}
           >
            <Icons deleted={true}/>
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
              <Button type='primary' icon='plus' onClick={()=>{
                this.props.dispatch(routerRedux.push('/equipment/equipmentManage/add'))
              }}>{formatMessage(messages.equipmentNew)}</Button>
              <Button type='primary' onClick={()=>{
                this.props.dispatch(routerRedux.push('/equipment/equipmentManage/import'))
              }} style={{marginLeft:8}}>{formatMessage(basicMessages.import1)}</Button>
              <ExportModal  loading={exportLoading}  handleExport={this.handleExport} text={formatMessage(messages.equipmentExportToken)} form={this.props.form}/>
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
