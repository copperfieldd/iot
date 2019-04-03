import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider, Modal} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const Search = Input.Search;

@connect(({equipmentType, loading}) => ({
  equipmentType,
  loading: loading.effects['equipmentType/fetch_deviceTypeList_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentType extends Component {
  constructor() {
    super();
    this.state = {}
  };


  componentDidMount() {
    const {equipmentType: {deviceType_params}} = this.props;
    this.loadEquipmentTypeList(deviceType_params);
  };

  loadEquipmentTypeList = (params) => {
    this.props.dispatch({
      type: 'equipmentType/fetch_deviceTypeList_action',
      payload: params,
    })
  };

  changeTablePage = (pagination) => {
    const {equipmentType: {deviceType_params}} = this.props;
    const params = {
      start: deviceType_params.count * (pagination.current - 1),
      count: deviceType_params.count,
    };
    this.loadEquipmentTypeList(params);
  };


  delType = (id) => {
    const {equipmentType: {deviceType_params, deviceTypeList}, intl: {formatMessage}} = this.props;
    const params = {
      id: id,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'equipmentType/fetch_delDeviceTypeList_action',
          payload: params,
          params: formatParams(deviceTypeList.value, deviceType_params),

        })
      }
    });

  };


  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  //查询条件提交
  handleOk = (e) => {
    const {equipmentType: {deviceType_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...deviceType_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadEquipmentTypeList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentType: {deviceType_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: deviceType_params.count
    }
    this.loadEquipmentTypeList(values);
  };


  render() {
    const {visible} = this.state;
    const {equipmentType: {deviceType_params, deviceTypeList}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: deviceType_params.count,
      total: deviceTypeList.totalCount,
      current: (deviceType_params.start / deviceType_params.count) + 1,
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
          label={formatMessage(messages.equipment_config_name)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: deviceType_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipment_input_config_name)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipment_device_model)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('deviceModelName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: deviceType_params.deviceModelName
          })
          (
            <Input placeholder={formatMessage(messages.equipment_device_model_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.protocol)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('protocol', {
            initialValue: deviceType_params.protocol
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
          label={formatMessage(basicMessages.creator)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('username', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: deviceType_params.username
          })
          (
            <Input placeholder={formatMessage(basicMessages.creatorInput)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: deviceType_params.startTime && moment(deviceType_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('endTime', {
            initialValue: deviceType_params.endTime && moment(deviceType_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const columns = [{
      title: formatMessage(messages.equipment_config_name),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width: 150,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.equipment_device_model),
      dataIndex: 'deviceModelName',
      key: 'deviceModelName',
      className: 'table_row_styles',
      width: 150,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.protocol),
      dataIndex: 'protocol',
      key: 'protocol',
      width: 100,
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{text === 1 ? 'MQTT' : text === 2 ? 'HTTP' : text === 3 ? 'CoAP' : text === 4 ? 'TCP' : text === 5 ? 'UDP' : null}</span>
      )
    }, {
      title: formatMessage(basicMessages.creator),
      dataIndex: 'username',
      key: 'username',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      width: '150px',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/equipment/equipmentType/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/equipment/equipmentType/item/${encodeURIComponent(JSON.stringify(record))}`))
          }}
          >
            <Icons item={true}/>
          </a>
           <a style={{marginLeft: 10}} onClick={() => {
             this.delType(record.id)
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
            <Button type='primary' icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push('/equipment/equipmentType/add'))
            }}>{formatMessage(messages.equipment_device_config_add)}</Button>

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
            rowKey={record => record.id}
            dataSource={deviceTypeList && deviceTypeList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
