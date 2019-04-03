import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Icon, Form, Input, Select, Card,} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;

@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_addDemoConfig_action'],
}))
@injectIntl
@Form.create()
export default class DemoManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible: false,
      appConfigVisible: false,
      addressInputList: [],
    }
  };

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'platformOperation/fetch_addDemoConfig_action',
          payload: values,
          callBack:(res)=>{
            this.props.dispatch(routerRedux.push(`/platformOperation/demoManage/edit/${encodeURIComponent(JSON.stringify(res))}`));
          }
        })
      }
    });
  };

  render() {
    const {history, loading,intl:{formatMessage}} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >

            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.serviceName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('serviceName', {
                      rules: [{
                        required: true, message: formatMessage(messages.serviceNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.serviceNameInput)}/>
                    )
                  }

                </FormItem>

                <FormItem
                  label={formatMessage(messages.accessAddress)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('serviceHost', {
                      rules: [{
                        required: true, message: formatMessage(messages.accessAddressInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.accessAddressInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.port)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('servicePort', {
                      rules: [{
                        pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
                      }],
                    })(
                      <Input placeholder={formatMessage(basicMessages.portInput)}/>
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
