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
import Icons from "../../../components/Icon";
import Ellipsis from "../../../components/Ellipsis";

const FormItem = Form.Item;


@connect(({warningRule, loading}) => ({
  warningRule,
  loading: loading.effects['warningRule/fetch_warningRuleList_action'],
}))
@injectIntl
@Form.create()
export default class WarningRule extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }
  };

  componentDidMount() {
    const {warningRule: {warningRule_params}} = this.props;
    this.loadWarningRuleList(warningRule_params);
  };

  loadWarningRuleList = (params) => {
    this.props.dispatch({
      type: 'warningRule/fetch_warningRuleList_action',
      payload: params,
    })
  };

  changeTablePage = (pagination) => {
    const {warningRule: {warningRule_params}} = this.props;
    const start = (pagination.current - 1) * warningRule_params.count;
    const params = {
      ...warningRule_params,
      start: start,
    };
    this.loadWarningRuleList(params);
  };


  delWarningRuleList = (id) => {
    const {warningRule: {warningRule_params, warningRuleList}, intl: {formatMessage}} = this.props;
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
          type: 'warningRule/fetch_delWarningRuleList_action',
          payload: params,
          params: formatParams(warningRuleList.value, warningRule_params),
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
    const {warningRule: {warningRule_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...warningRule_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadWarningRuleList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {warningRule: {warningRule_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: warningRule_params.count
    };
    this.loadWarningRuleList(values);
  };


  render() {
    const {warningRule: {warningRuleList, warningRule_params}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: warningRule_params.count,
      total: warningRuleList.totalCount,
      current: (warningRule_params.start / warningRule_params.count) + 1
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
          label={formatMessage(messages.ruleName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('ruleName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: warningRule_params.ruleName
          })
          (
            <Input placeholder={formatMessage(messages.ruleNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.serviceName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: warningRule_params.serviceName
          })
          (
            <Input placeholder={formatMessage(messages.serviceNameInput)} style={{width: '100%'}}/>
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
            initialValue: warningRule_params.alarmType
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
            initialValue: warningRule_params.startTime && moment(warningRule_params.startTime) || undefined
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
            initialValue: warningRule_params.endTime && moment(warningRule_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const {visible} = this.state;
    const columns = [{
      title: formatMessage(messages.ruleName),
      dataIndex: 'ruleName',
      key: 'ruleName',
      className: 'table_row_styles',
      width: 180,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{width: 180}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(messages.serviceName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 180,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{width: 180}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(messages.waringType),
      dataIndex: 'alarmType',
      key: 'alarmType',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.notificationSource),
      dataIndex: 'notity',
      key: 'notity',
      className: 'table_row_styles',
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
            this.props.dispatch(routerRedux.push(`/warning/warningRule/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
             <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/warning/warningRule/item/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons item={true}/>
          </a>

          <a style={{marginLeft: 10}} onClick={() => {
            this.delWarningRuleList(record.id)
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
            <Button type='primary' icon='plus' onClick={(e) => {
              e.stopPropagation();
              this.props.dispatch(routerRedux.push('/warning/warningRule/add'))
            }}>{formatMessage(messages.ruleAdd)}</Button>

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
            dataSource={warningRuleList && warningRuleList.value}
            columns={columns}
            onChange={this.changeTablePage}
            pagination={paginationProps}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
