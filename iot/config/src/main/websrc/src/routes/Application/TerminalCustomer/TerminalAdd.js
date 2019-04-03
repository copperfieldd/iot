import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Divider, Row, DatePicker, Input,Select} from 'antd';
import styles from '../Application.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/application';
import basicMessages from '../../../messages/common/basicTitle';


const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';


@connect(({application, loading}) => ({
  application,
  loading: loading.effects['payManage/fetch_addApplication_action'],
}))
@injectIntl
@Form.create()
export default class TerminalAdd extends Component {
  constructor() {
    super();
    this.state = {
      tenantValue:null,
      appCheckedValue:null,
    }
  };


  //添加
  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'application/fetch_addTerminalUser_action',
          payload: {...values,type:5},
        });
      }
    });
  };


  openTenantModal = () => {
    this.setState({
      tenantVisible: !this.state.tenantVisible
    })
  };

  openTenantAppList=()=>{
    this.setState({
      tenantAppVisible: !this.state.tenantAppVisible
    })
  };


  onChange=(date, dateString)=>{
    this.props.form.setFieldsValue({birth:dateString})
  };


  render() {
    const {history,loading,intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
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
                label={formatMessage(basicMessages.userLoginName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('loginName', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.userLoginNameInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.userLoginNameInput)}/>
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
                    }, {
                        pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,30}$/,message: formatMessage(basicMessages.password_input_rule),
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.passwordInput)} type='password' autoComplete="new-password"/>
                  )
                }
              </FormItem>


              <FormItem
                label={formatMessage(basicMessages.displayName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('userName', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.displayNameInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.displayNameInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.telephone)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('telephone', {
                    rules: [
                      {
                        pattern:/^1[34578]\d{9}$/,message: formatMessage(basicMessages.correctPhone),
                      }
                    ],
                  })(
                    <Input placeholder={formatMessage(basicMessages.telephoneInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.email)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('mail', {
                    rules: [{
                      type: 'email', message: formatMessage(basicMessages.correctEmail),
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.emailInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.sex)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('sex', {
                  })(
                    <Select>
                      <Option value={0}>{formatMessage(basicMessages.woman)}</Option>
                      <Option value={1}>{formatMessage(basicMessages.man)}</Option>
                    </Select>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.age)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('age', {
                    rules: [{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }]
                  })(
                    <Input placeholder={formatMessage(basicMessages.ageInput)}/>
                  )
                }
              </FormItem>
              <FormItem
                label={formatMessage(basicMessages.birthday)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('birth', {
                  })(
                    <div><DatePicker defaultValue={moment('2018-01-01', dateFormat)} onChange={this.onChange} style={{width:'100%'}}/></div>
                  )
                }
              </FormItem>


              <FormItem
                label={formatMessage(basicMessages.nativePlace)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('birthplace', {
                    rules: [{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }]
                  })(
                   <Input placeholder={formatMessage(basicMessages.nativePlaceInput)}/>
                  )
                }
              </FormItem>


              <FormItem
                label={formatMessage(basicMessages.addressLive)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('address', {
                    rules: [{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }]
                  })(
                    <Input placeholder={formatMessage(basicMessages.addressLiveInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.remarks)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('extraInfo', {
                    rules: [{
                      max: 64,message: formatMessage(basicMessages.moreThan64)
                    }],
                  })(
                    <TextArea rows={4} placeholder={formatMessage(basicMessages.remarksInput)}/>
                  )
                }
              </FormItem>
            </Form>
            </div>
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
