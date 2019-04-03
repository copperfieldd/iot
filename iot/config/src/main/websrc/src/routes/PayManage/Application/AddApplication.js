import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Card, Input} from 'antd';
import styles from '../PayManage.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

import {injectIntl} from 'react-intl';
import messages from '../../../messages/pay';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({payManage, loading}) => ({
  payManage,
  loading: loading.effects['payManage/fetch_addApplication_action'],
}))
@injectIntl
@Form.create()
export default class AddApplication extends Component {
  constructor() {
    super();
    this.state = {}
  };

  //添加
  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          status: 0,
        };
        this.props.dispatch({
          type: 'payManage/fetch_addApplication_action',
          payload: value,
          callback: (res) => {
            this.props.dispatch(routerRedux.push(`/payManage/applicationList/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        });
      }
    });
  };


  getSecretKey = () => {
    this.props.dispatch({
      type: 'payManage/fetch_getSecretKey_action',
      payload: null,
      callback: (res) => {
        this.setState({
          secretKey: res
        });
        this.props.form.setFieldsValue({secret: res})
      }
    })
  };

  render() {
    const {history, loading, intl: {formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
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
                label={formatMessage(basicMessages.applicationName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.applicationNameInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.applicationNameInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label='appId'
                {...formItemLayout}
              >
                {
                  getFieldDecorator('appId', {
                    // rules: [{
                    //   required: true, message: '请输入类型名称!',
                    // }],
                  })(
                    <span></span>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('describe', {
                    rules: [{
                      max: 64, message: formatMessage(basicMessages.moreThan64)
                    }],
                  })(
                    <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.appKey)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('secret', {
                    rules: [{
                      required: true, message: formatMessage(messages.appKeyInput),
                    }],
                    initialValue: this.state.secretKey ? this.state.secretKey : null
                  })(
                    <Input style={{width: 200}} disabled placeholder={formatMessage(messages.appKeyInput)}/>
                  )
                }
                <Button style={{marginLeft: 6}} type='primary'
                        onClick={this.getSecretKey}>{formatMessage(messages.appKeyBuild)}</Button>

              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.contacts)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('leadName', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.contactsInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.contactsInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.telephone)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true, message: formatMessage(basicMessages.telephoneInput),
                      }, {
                        pattern: /^1[34578]\d{9}$/, message: formatMessage(basicMessages.correctPhone),
                      }
                    ],
                  })(
                    <Input placeholder={formatMessage(basicMessages.telephoneInput)}/>
                  )
                }
              </FormItem>
            </Form>
          </div>
          {/*</Card>*/}
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
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
