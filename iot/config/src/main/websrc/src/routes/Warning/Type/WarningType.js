import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card, Modal} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@connect(({warningType, loading}) => ({
  warningType,
  loading: loading.effects['warningType/fetch_warningTypeList_action'],
}))
@injectIntl
@Form.create()
export default class WarningType extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }
  };

  componentDidMount() {
    const {warningType: {warningType_params}} = this.props;
    this.loadWarningTypeList(warningType_params);
  };

  //加载告警类型列表
  loadWarningTypeList = (params) => {
    this.props.dispatch({
      type: 'warningType/fetch_warningTypeList_action',
      payload: params,
    })
  };

  //分页切换
  changeTablePage = (pagination) => {
    const {warningType: {warningType_params}} = this.props;
    const start = (pagination.current - 1) * warningType_params.count;
    const params = {
      ...warningType_params,
      start: start,
    };
    this.loadWarningTypeList(params);
  };

  //删除告警类型
  delWarningTypeList = (id) => {
    const {warningType: {warningTypeList, warningType_params}, intl: {formatMessage}} = this.props;
    const params = {
      id: id,
      flag: true,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'warningType/fetch_delWarningTypeList_action',
          payload: params,
          params: formatParams(warningTypeList.value, warningType_params),
        })
      }
    });
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };


  handleOk = (e) => {
    const {warningType: {warningType_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...warningType_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadWarningTypeList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {warningType: {warningType_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: warningType_params.count
    };
    this.loadWarningTypeList(values);
  };


  render() {
    const {warningType: {warningTypeList, warningType_params}, loading, intl: {formatMessage}} = this.props;
    const {visible} = this.state;

    const paginationProps = {
      total: warningTypeList.totalCount,
      pageSize: warningType_params.count,
      current: (warningType_params.start / warningType_params.count) + 1
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
          label={formatMessage(messages.waringName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('alarmName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: warningType_params.alarmName
          })
          (
            <Input placeholder={formatMessage(messages.waringNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.waringType)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('alarmType', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: warningType_params.alarmType
          })
          (
            <Input placeholder={formatMessage(messages.waringTypeInput)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: warningType_params.startTime && moment(warningType_params.startTime) || undefined
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
            initialValue: warningType_params.endTime && moment(warningType_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const columns = [{
      title: formatMessage(messages.waringName),
      dataIndex: 'alarmName',
      key: 'alarmName',
      className: 'table_row_styles',

    }, {
      title: formatMessage(messages.waringType),
      dataIndex: 'alarmType',
      key: 'alarmType',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'alarmDesc',
      key: 'alarmDesc',
      className: 'table_row_styles',
      width: 250,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/warning/warningType/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.delWarningTypeList(record.id)
          }}>
            <Icons deleted={true}/>
          </a>
        </span>
      )
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
              this.props.dispatch(routerRedux.push('/warning/warningType/add'))
            }}>{formatMessage(messages.typeAdd)}</Button>

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
            dataSource={warningTypeList && warningTypeList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
