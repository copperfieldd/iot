import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card,message} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";


const FormItem = Form.Item;
const {TextArea} = Input;


@connect(({platManage, loading}) => ({
  platManage,
  loading: loading.effects['platManage/fetch_addPlatManager_action'],
}))
@injectIntl
@Form.create()
export default class PlatManageAdd extends Component {
  constructor() {
    super();
    this.state = {}
  };

  //添加
  handleSubmit = (e) => {
    const {form,intl:{formatMessage}} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.password!==values.surePassword){
          message.error(formatMessage(basicMessages.passwordInconsistent));
          return;
        }
        this.props.dispatch({
          type: 'platManage/fetch_addPlatManager_action',
          payload: values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/customer/platManager/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        });
      }
    });
  };

  render() {
    const {history, loading,intl:{formatMessage}} = this.props;
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
    const {getFieldDecorator} = this.props.form;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px',}}
          bordered={false}
        >

            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(basicMessages.account)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('loginName', {
                      rules: [{
                        required: true, message: formatMessage(basicMessages.accountInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(basicMessages.accountInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.passwordTitle)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('password', {
                      rules: [{
                        required: true, message: formatMessage(basicMessages.passwordInput),
                      },{
                        pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,30}$/,message: formatMessage(basicMessages.password_input_rule),
                      }],
                    })(
                      <Input autoComplete="new-password"  type='password' placeholder={formatMessage(basicMessages.passwordInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.passwordConfirm)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('surePassword', {
                      rules: [{
                        required: true, message: formatMessage(basicMessages.passwordInput),
                      },{
                        pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,30}$/,message: formatMessage(basicMessages.password_input_rule),
                      }],
                    })(
                      <Input autoComplete="new-password"  type='password' placeholder={formatMessage(basicMessages.passwordInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                    })(
                      <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                    )
                  }
                </FormItem>
              </Form>

            </div>
          {/*</Card>*/}

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}><FormattedMessage {...basicMessages.confirm} /></Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            ><FormattedMessage {...basicMessages.return} /></Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
