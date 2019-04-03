import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Card} from 'antd';
import styles from '../PayManage.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

import {injectIntl} from 'react-intl';
import messages from '../../../messages/pay';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;


@connect(({payManage, loading}) => ({
  payManage,
  loading: loading.effects['payManage/fetch_orderItem_action'],
}))
@injectIntl
@Form.create()
export default class OrderListItem extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type: 'payManage/fetch_orderItem_action',
      payload: {orderSn: item.orderSn}
    })
  }


  render() {
    const {history, match: {params: {data}}, payManage: {orderItems}, intl: {formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const orderItem = orderItems[item.orderSn];
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >

          <div className='mrgTB30' style={{width: 600}}>
            <Form>
              <FormItem
                label={formatMessage(messages.orderSn)}
                {...formItemLayout}
              >
                <span>{item.orderSn}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderChannelSn)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.tradeNo}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.payType)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.tradeChannel}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.payTime)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.payTime}</span>
              </FormItem>
              <FormItem
                label={formatMessage(basicMessages.createTime)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.createTime}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderStatus)}
                {...formItemLayout}
              >
                <span>{item.status}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderProductName)}
                {...formItemLayout}
              >
                <span>{item.subject}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderProductDetails)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.goodsDetail}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderRemarks)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.attach}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderTenantId)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.tenantId}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderAppId)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.appId}</span>
              </FormItem>
              <FormItem
                label={formatMessage(messages.orderAppUserId)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.appUserId}</span>
              </FormItem>
              <FormItem
                label={formatMessage(basicMessages.applicationName)}
                {...formItemLayout}
              >
                <span>{orderItem && orderItem.appName}</span>
              </FormItem>
            </Form>
          </div>

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>

            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
