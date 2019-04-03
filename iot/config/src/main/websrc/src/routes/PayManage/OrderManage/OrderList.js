import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Select, DatePicker} from 'antd';
import styles from '../PayManage.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";

import {injectIntl} from 'react-intl';
import messages from '../../../messages/pay';
import basicMessages from '../../../messages/common/basicTitle';
import Icons from "../../../components/Icon";

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({payManage, loading}) => ({
  payManage,
  loading: loading.effects['payManage/fetch_orderList_action'],
}))
@injectIntl
@Form.create()
export default class OrderList extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {payManage: {order_params}} = this.props;
    this.loadOrderList(order_params);
  }

  loadOrderList = (params) => {
    this.props.dispatch({
      type: 'payManage/fetch_orderList_action',
      payload: params,
    })
  };

  onChangeTablePage = (pagination) => {
    const {payManage: {order_params}} = this.props;
    const params = {
      ...order_params,
      start: (pagination.current - 1) * order_params.count,
    };
    this.loadOrderList(params);
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  handleOk = (e) => {
    const {payManage: {order_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...order_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadOrderList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {payManage: {order_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: order_params.count
    };
    this.loadOrderList(values);
  };


  render() {
    const {visible} = this.state;
    const {payManage: {orderList, order_params}, loading, intl: {formatMessage}} = this.props;

    const paginationProps = {
      total: orderList && orderList.totalCount,
      pageSize: order_params.count,
      current: (order_params.start / order_params.count) + 1,
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
          label={formatMessage(messages.orderSn)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('orderSn', {
            initialValue: order_params.orderSn
          })
          (
            <Input placeholder={formatMessage(messages.orderSn_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.status)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('status', {
            initialValue: order_params.status
          })
          (
            <Select placeholder={formatMessage(basicMessages.select_status)}>
              <Option value={0}>{formatMessage(basicMessages.To_be_paid)}</Option>
              <Option value={1}>{formatMessage(basicMessages.paid)}</Option>
              <Option value={2}>{formatMessage(basicMessages.overtime)}</Option>
              <Option value={3}>{formatMessage(basicMessages.failed)}</Option>
              <Option value={4}>{formatMessage(basicMessages.refund)}</Option>
              <Option value={5}>{formatMessage(basicMessages.refunding)}</Option>
              <Option value={6}>{formatMessage(basicMessages.close)}</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.orderChannel)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('tradeChannel', {
            initialValue: order_params.tradeChannel
          })
          (
            <Select placeholder={formatMessage(messages.orderChannel_select)}>
              <Option value={0}>{formatMessage(basicMessages.weChat)}</Option>
              <Option value={1}>{formatMessage(basicMessages.Alipay)}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.orderProductName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('subject', {
            initialValue: order_params.subject
          })
          (
            <Input placeholder={formatMessage(messages.product_name_input)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: order_params.startTime && moment(order_params.startTime) || undefined
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
            initialValue: order_params.endTime && moment(order_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const columns = [{
      title: formatMessage(messages.orderSn),
      dataIndex: 'orderSn',
      key: 'orderSn',
      className: 'table_row_styles',

    }, {
      title: formatMessage(messages.orderStatus),
      dataIndex: 'status',
      key: 'status',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.orderFree),
      dataIndex: 'totalFee',
      key: 'totalFee',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.orderChannel),
      dataIndex: 'tradeChannel',
      key: 'tradeChannel',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.orderProductName),
      dataIndex: 'subject',
      key: 'subject',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'appName',
      key: 'appName',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      width: '240px',
      render: (text, record) => (
        <span>

          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/payManage/orderManage/item/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
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
            rowKey={record => record.id}
            dataSource={orderList && orderList.list}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.onChangeTablePage}
            // onRow={(record) => {
            //   return {
            //     onClick: () => {
            //       this.props.dispatch(routerRedux.push(`/payManage/orderManage/item/${encodeURIComponent(JSON.stringify(record))}`))
            //     },       // 点击行
            //   };
            // }}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
