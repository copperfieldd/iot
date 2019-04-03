import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Input, Card, Icon} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from "../../../utils/utils";
import messages from "../../../messages/statistics";
import per_messages from "../../../messages/permission";
import ServiceRaidoModal from '../Modal/ServiceRaidoModal'
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({dataSti,  permissions, loading}) => ({
  permissions,
  dataSti,
  loading: loading.effects['dataSti/fetch_addAnalytic_action'],
}))
@injectIntl
@Form.create()
export default class ScriptManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible:false,
      serviceValue:null,
    }
  };


  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'dataSti/fetch_addAnalytic_action',
          payload:values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/scriptManage/item/${encodeURIComponent(JSON.stringify(res))}`))
          }
        })
      }
    });
  };

  openModal=()=>{
    this.setState({
      modalVisible:!this.state.modalVisible
    });
  };


  render() {
    const {history,loading,intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const platUserInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    const {modalVisible} = this.state;

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
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 600}}>
            <Form>
              {platUserInfo&&platUserInfo.value&&platUserInfo.value.type===0?
                <FormItem
                  label={formatMessage(basicMessages.service)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('serviceId', {
                      rules: [{
                        required: true, message: formatMessage(per_messages.selectServiceName)
                      }],
                    })(
                      <div onClick={this.openModal} className={styles.ele_input_addStype} style={{height:32,lineHeight:'32px'}}>
                        {
                          this.state.serviceValue?<div style={{marginLeft:6}}>
                            <span>{this.state.serviceValue.serviceName}</span>
                          </div>:null
                        }
                        <Icon className={styles.down_icon}  type="down" />
                      </div>
                    )
                  }
                </FormItem>:null
              }

              <FormItem
                label={formatMessage(messages.sti_script_name)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.sti_script_name_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.sti_script_name_input)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.sti_script_tag)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('tag', {
                    rules: [{
                      required: true, message: formatMessage(messages.sti_script_tag_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder= {formatMessage(messages.sti_script_tag_input)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('remark', {
                    rule:[{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                  )
                }
              </FormItem>
              <FormItem
                label={formatMessage(messages.sti_script_content)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('script', {
                    rules: [{
                      required: true, message: formatMessage(messages.sti_script_content_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <TextArea rows={4} placeholder={formatMessage(messages.sti_script_content_input)}/>
                  )
                }
              </FormItem>
            </Form>
          </div>
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
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

        <ServiceRaidoModal
          onCancelModal={this.openModal}
          visible={modalVisible}
          handleServiceSubmit={(res)=>{
            this.setState({
              serviceValue:res,
            });
            this.props.form.setFieldsValue({serviceId:res.serviceId})
          }}
        />

      </PageHeaderLayout>
    );
  }
}
