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
  loading: loading.effects['payManage/fetch_updApplication_action'],
}))
@injectIntl
@Form.create()
export default class EditApplication extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type: 'payManage/fetch_applicationItem_action',
      payload: {appId: item.appId}
    })
  }

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  //添加
  handleSubmit = (e) => {
    const {form, match: {params: {data}},} = this.props;
    const item = JSON.parse(decodeURIComponent(data));

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          status: 0,
          appId: item.appId,
        };
        this.props.dispatch({
          type: 'payManage/fetch_updApplication_action',
          payload: value,
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
  }


  render() {
    const {history, match: {params: {data}}, loading, payManage: {applicationItems}, intl: {formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const appItem = applicationItems[item.appId];
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
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: appItem && appItem.name
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
                    initialValue: appItem && appItem.appId
                  })(
                    <span>{appItem && appItem.appId}</span>
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
                    initialValue: appItem && appItem.describe

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
                    // rules: [{
                    //   required: true, message: '请输入审计类型!',
                    // }],
                    initialValue: appItem && appItem.secret
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
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: appItem && appItem.leadName
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
                      },
                      {
                        pattern: /^1[34578]\d{9}$/, message: formatMessage(basicMessages.correctPhone),
                      }],
                    initialValue: appItem && appItem.phone

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
                      this.props.dispatch(routerRedux.push('/payManage/applicationList'))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
