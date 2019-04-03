import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Input} from 'antd';
import styles from '../Application.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import TenantRoleListModal from './Modal/TenantRoleListModal';
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/application';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@injectIntl
@connect(({application, loading}) => ({
  application,
  loading: loading.effects['application/fetch_addApplication_action'],
}))
@Form.create()
export default class UserApplicationAdd extends Component {
  constructor() {
    super();
    this.state = {
      see: false,
      tenantValue: null,
      roleCheckedValue: null,
      tenantRoleModalVisible: false,
    }
  };


  //添加
  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'application/fetch_addApplication_action',
          payload: values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/application/userApplication/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        });
      }
    });
  };


  openTenantModal = () => {
    this.setState({
      tenantVisible: !this.state.tenantVisible
    })
  };


  openTenantRoleModal = () => {
    this.setState({
      tenantRoleModalVisible: !this.state.tenantRoleModalVisible
    })
  };

  changeSee=()=>{
    this.setState({
      see:!this.state.see
    })
  };



  render() {
    const {history, loading,intl:{formatMessage}} = this.props;
    const {see, tenantRoleModalVisible, roleCheckedValue} = this.state;
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
              <p className='TxTCenter' style={{marginBottom:10}}>{formatMessage(basicMessages.application)}</p>
              <Form>
                <FormItem
                  label={formatMessage(messages.applicationName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.applicationNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      //initialValue: details&&details.name
                    })(
                      <Input placeholder={formatMessage(messages.applicationNameInput)}/>
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
                      <TextArea rows={3} placeholder={formatMessage(basicMessages.describeInput)}/>
                    )
                  }
                </FormItem>


                <p className='TxTCenter'>{formatMessage(basicMessages.administrator)}</p>
                <FormItem
                  label={formatMessage(basicMessages.departRoles)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('roleId', {
                      rules: [{
                        required: true, message: formatMessage(basicMessages.departRolesSelect)}
                      ],
                    })(
                      <div onClick={this.openTenantRoleModal} className={styles.ele_input_addStype}
                           style={{height: 35}}>

                        <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                          <span>{roleCheckedValue && roleCheckedValue.name}</span>
                        </div>

                        <Icon className={styles.down_icon} type="down"/>
                      </div>
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
                      <Input autoComplete="new-password"  type={see ? 'text' : 'password'}
                             suffix={<Icon onClick={this.changeSee} style={{cursor: 'pointer'}} type="eye-o"/>}/>
                    )
                  }
                </FormItem>
              </Form>
            </div>

            <TenantRoleListModal
              tenantRoleModalVisible={tenantRoleModalVisible}
              onCancelModal={this.openTenantRoleModal}
              handTenantValue={(value) => {
                this.setState({
                  roleCheckedValue: value,
                });
                this.props.form.setFieldsValue({roleId: value.id})
              }}
            />
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
