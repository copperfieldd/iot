import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Modal, Input, DatePicker, Select} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";


const FormItem = Form.Item;
const Option = Select.Option;


@connect(({equipmentTypeManage, loading}) => ({
  equipmentTypeManage,
  loading: loading.effects['equipmentTypeManage/fetch_getSecondType_action'],
}))
@injectIntl
@Form.create()
export default class TypeManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {equipmentTypeManage: {getSecondType_params}} = this.props;
    this.loadGetSecondType(getSecondType_params);
  };

  loadGetSecondType = (params) => {
    this.props.dispatch({
      type: 'equipmentTypeManage/fetch_getSecondType_action',
      payload: params
    })
  };


  onChangeTablePage = (pagination) => {
    const {equipmentTypeManage: {getSecondType_params}} = this.props;
    const params = {
      ...getSecondType_params,
      start: (pagination.current - 1) * getSecondType_params.count,
    };
    this.loadGetSecondType(params);
  };


  delType = (id) => {
    const {equipmentTypeManage: {getSecondType_params, getSecondType}, intl: {formatMessage}} = this.props;
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
          type: 'equipmentTypeManage/fetch_delSecondType_action',
          payload: params,
          params: {
            ...getSecondType_params,
            start: getSecondType.value.length === 1 && getSecondType_params.start - 10 >= 0 ? getSecondType_params.start - 10 : getSecondType_params.start,
          },
        })
      }
    });
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  //查询条件提交
  handleOk = (e) => {
    const {equipmentTypeManage: {getSecondType_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...getSecondType_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadGetSecondType(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentTypeManage: {getSecondType_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: getSecondType_params.count
    }
    this.loadGetSecondType(values);
  };


  render() {
    const {equipmentTypeManage: {getSecondType_params, getSecondType}, intl: {formatMessage}, loading} = this.props;
    const userType = getLoginUserType() === 0 ? false : true;
    const {visible} = this.state;
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
      pageSize: getSecondType_params.count,
      total: getSecondType.totalCount,
      current: (getSecondType_params.start / getSecondType_params.count) + 1,
    };
    const columns = [{
      title: formatMessage(messages.equipmentType),
      dataIndex: 'deviceTypeName',
      key: 'deviceTypeName',
      className: 'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.equipment_device_model),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: <FormattedMessage {...basicMessages.creator} />,
      dataIndex: 'username',
      key: 'username',
      className: 'table_row_styles',
    }, {
      title: <FormattedMessage {...basicMessages.createTime} />,
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: <FormattedMessage {...basicMessages.operations} />,
      key: 'action',
      className: 'table_row_styles',
      width: '240px',
      render: (text, record) => (
        <span>
          <span style={userType?{cursor:'not-allowed'}:{}}>
           <a disabled={userType} onClick={() => {
             this.props.dispatch(routerRedux.push(`/equipment/typeManage/SecondEdit/${encodeURIComponent(JSON.stringify(record))}`));
           }}>
            <Icons edit={true} disable={userType}/>
          </a>
          </span>
          <span style={userType?{cursor:'not-allowed'}:{}}>

           <a style={{marginLeft: 10}} disabled={userType} onClick={() => {
             this.delType(record.id)
           }}>
            <Icons deleted={true} disable={userType}/>
          </a>
          </span>
    </span>
      ),
    }];


    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipmentType)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('deviceTypeName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: getSecondType_params.deviceTypeName
          })
          (
            <Input placeholder={formatMessage(messages.equipment_device_type_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipment_device_model)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: getSecondType_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipment_device_model_input)}/>
          )}
        </FormItem>



        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: getSecondType_params.startTime && moment(getSecondType_params.startTime) || undefined
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
            initialValue: getSecondType_params.endTime && moment(getSecondType_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
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
          <div className='mrgTB12 dlxB'>
            <div>
              <Button type='primary' icon='plus' onClick={() => {
                this.props.dispatch(routerRedux.push('/equipment/TypeFirstManage'));
              }}>{formatMessage(messages.equipment_config_type)}</Button>

              <Button type='primary' disabled={userType} style={{marginLeft: 6}} icon='plus' onClick={() => {
                this.props.dispatch(routerRedux.push('/equipment/typeManage/SecondAdd'));
              }}>{formatMessage(messages.equipment_device_model_new)}</Button>
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
            loading={loading}
            rowKey={record => record.id}
            dataSource={getSecondType && getSecondType.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.onChangeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
