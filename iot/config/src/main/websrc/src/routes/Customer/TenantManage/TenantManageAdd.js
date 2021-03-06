import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { Button, Icon, Form, Input, Select, Card } from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import GradeListModal from './Modal/GradeListModal';
import RoleRadioModal from '../Modal/RoleRadioModal';
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@injectIntl
@connect(({tenantManage, loading}) => ({
  tenantManage,
  loading: loading.effects['tenantManage/fetch_addTenant_action'],
}))
@Form.create()
export default class TenantManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      see:false,
      modalVisible:false,
      modalUserVisible:false,
      gradeCheckedValue:null,
      roleCheckedValue:null,
      loginName:null
    }
  };

  handleSubmit = (e) => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'tenantManage/fetch_addTenant_action',
          payload:values,
          callback:(res)=>{
            this.setState({
              loginName:res.loginName
            });
            this.props.dispatch(routerRedux.push(`/customer/tenantManage/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        })
      }
    });
  };

  changeSee=()=>{
    this.setState({
      see:!this.state.see
    })
  };

  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  changeUserModalVisible=()=>{
    this.setState({
      modalUserVisible: !this.state.modalUserVisible,
    })
  };


  render() {
    const { history,loading,intl:{formatMessage} } = this.props;
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
    const {see,modalVisible,gradeCheckedValue} = this.state;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >
            <div className='mrgTB30' style={{width:600}}>
              <Form>
                <p className='TxTCenter'><FormattedMessage {...messages.tenantInformation} /></p>
                <FormItem
                  label={<FormattedMessage {...messages.tenantName} />}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.tenantAddNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.tenantAddNameInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={<FormattedMessage {...messages.category} />}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('gradeId', {
                      rules: [{
                        required: true, message: formatMessage(messages.tenantAddCategoryInput),
                      }],
                      //initialValue: details&&details.name
                    })(
                      <div onClick={this.changeModalVisible} className={styles.ele_input_addStype}
                           style={{height: 35}}>

                        <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                          <span>{gradeCheckedValue && gradeCheckedValue.name}</span>
                        </div>

                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.abbreviation)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('tag', {
                      rule:[{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      //initialValue: details&&details.name
                    })(
                      <Input placeholder={formatMessage(messages.tenantAddAbbreviation)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label="简称"
                  {...formItemLayout}
                  style={{display:'none'}}
                >
                  {
                    getFieldDecorator('none', {
                      rule:[{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }]
                      //initialValue: details&&details.name
                    })(
                      <Input placeholder='请输入简称'/>
                    )
                  }
                </FormItem>


                <FormItem
                  label={formatMessage(messages.tenantDescribe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                    })(
                      <TextArea rows={3} placeholder={formatMessage(messages.tenantDescribeInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.tenantEnabled)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('valid', {
                      initialValue:true
                    })(
                      <Select>
                        <Option value={true}>{formatMessage(basicMessages.yes)}</Option>
                        <Option value={false}>{formatMessage(basicMessages.no)}</Option>
                      </Select>
                    )
                  }
                </FormItem>

                <p className='TxTCenter'>{formatMessage(basicMessages.administrator)}</p>
                <FormItem
                  label={formatMessage(basicMessages.account)}
                  {...formItemLayout}
                >
                  {
                    <div>{this.state.loginName&&this.state.loginName}</div>
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.defaultPassword)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('password', {
                      rules: [{
                        required: true, message: formatMessage(basicMessages.defaultPassword),
                      },{
                        pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,30}$/,message: formatMessage(basicMessages.password_input_rule),
                      }],
                    })(
                      <Input  autoComplete="new-password"  type={see ? 'text' : 'password'} suffix={<Icon onClick={this.changeSee} style={{cursor:'pointer'}} type="eye-o"/>}/>
                    )
                  }
                </FormItem>
              </Form>

            </div>
          <div className='TxTCenter' style={{width:500,margin:'30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e)=>{
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>

        <GradeListModal
          modalVisible={modalVisible}
          onCancelModal={this.changeModalVisible}
          handleCheckValue={(value) => {
            this.setState({
              gradeCheckedValue: value
            });
            this.props.form.setFieldsValue({gradeId:value.id})
          }}
        />

      </PageHeaderLayout>
    );
  }
}
