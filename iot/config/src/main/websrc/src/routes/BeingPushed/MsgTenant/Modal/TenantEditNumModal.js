import {Button, Form, List, Modal, Input, Table, Select, Row, Col,message} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import * as routerRedux from "react-router-redux";
import messages from '../../../../messages/bushing';
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";
const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@injectIntl
export default class StopModal extends Component {
  constructor(){
    super();
    this.state={
      messageState:true,
      emailState:true,
      appState:true,
    }

  }
  componentDidMount(){

  };



  render(){
    const {loading,modalShowVisible,onCancel,handSubmit,defaultValue,intl:{formatMessage} } = this.props;
    const {getFieldDecorator} = this.props.form;
    const {messageState,emailState,appState} = this.state;
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

    return(
      <Modal
        visible={modalShowVisible}
        title={formatMessage(messages.msg_adjustment_limit)}
        className='dealModal_styles'
        destroyOnClose={true}
        afterClose={()=>{
          this.setState({
            messageState:true,
            emailState:true,
            appState:true,
          })
        }}
        width={450}
        onCancel={onCancel&&onCancel}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" loading={loading} onClick={(e)=>{
              const {form} = this.props;
              e.preventDefault();
              form.validateFieldsAndScroll((err, formValues) => {
                if (!err) {
                  if(!formValues.message&&!formValues.email&&!formValues.app){
                    message.error(formatMessage(messages.msg_push_select_type));
                    return;
                  }
                  let push_type = [
                    {
                      type:formValues.message?'0':null,
                      options:formValues.message,
                      number:formValues.messageNum
                    },
                    {
                      type:formValues.email?'1':null,
                      options:formValues.email,
                      number:formValues.emailNum
                    },
                    {
                      type:formValues.app?'2':null,
                      options:formValues.app,
                      number:formValues.appNum
                    }
                  ];
                  let type = push_type.filter((item)=>{
                    if(item.type){
                      return item;
                    }
                  });
                  let values = {
                    tenantId:formValues.tenantId,
                    rootpassword:formValues.rootpassword,
                    push:[...type],
                  };

                  handSubmit&&handSubmit(values)
                }
              });
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancel&&onCancel} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Form>
            <FormItem
              label="租户"
              {...formItemLayout}
              style={{display:'none'}}
            >
              {
                getFieldDecorator('tenantId', {
                  initialValue:defaultValue&&defaultValue.tenantId
                })(
                  <Input/>
                )
              }
            </FormItem>

            <Row>
              <Col span={14}>
                <FormItem
                  label={formatMessage(basicMessages.message)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('message', {
                    })(
                      <Select style={{width:120}} onChange={()=>{
                        this.setState({
                          messageState:false
                        })
                      }}>
                        <Option value='0'>{formatMessage(basicMessages.increase)}</Option>
                        <Option value='1'>{formatMessage(basicMessages.reduce_pressure)}</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  //{...formItemLayout}
                >
                  {
                    getFieldDecorator('messageNum', !messageState?{
                      rules: [{
                        required: true, message: formatMessage(messages.msg_number_input),
                      }],
                    }:{})(
                      <Input disabled={messageState} style={{width:80}}/>
                    )
                  }
                  <span style={{marginLeft:8}}> {formatMessage(messages.msg_strip)}</span>
                </FormItem>
              </Col>

            </Row>

            <Row>
              <Col span={14}>
                <FormItem
                  label={formatMessage(messages.msg_common_email)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('email', {
                    })(
                      <Select style={{width:120}} onChange={()=>{
                        this.setState({
                          emailState:false,
                        })
                      }}>
                        <Option value='0'>{formatMessage(basicMessages.increase)}</Option>
                        <Option value='1'>{formatMessage(basicMessages.reduce_pressure)}</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  //{...formItemLayout}
                >
                  {
                    getFieldDecorator('emailNum', !emailState?{
                      rules: [{
                        required: true, message: formatMessage(messages.msg_number_input),
                      }],
                    }:{})(
                      <Input disabled={emailState} style={{width:80}}/>
                    )
                  }
                  <span style={{marginLeft:8}}> {formatMessage(messages.msg_strip)}</span>
                </FormItem>
              </Col>
            </Row>


            <Row>
              <Col span={14}>
                <FormItem
                  label={formatMessage(messages.msg_app_push)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('app', {
                    })(
                      <Select style={{width:120}} onChange={()=>{
                        this.setState({
                          appState:false
                        })
                      }}>
                        <Option value='0'>{formatMessage(basicMessages.increase)}</Option>
                        <Option value='1'>{formatMessage(basicMessages.reduce_pressure)}</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  //{...formItemLayout}
                >
                  {
                    getFieldDecorator('appNum', !appState?{
                      rules: [{
                        required: true, message: formatMessage(messages.msg_number_input),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    }:{})(
                      <Input disabled={appState} style={{width:80}}/>
                    )
                  }
                  <span style={{marginLeft:8}}> {formatMessage(messages.msg_strip)}</span>
                </FormItem>
              </Col>
            </Row>


            <FormItem
              label={formatMessage(basicMessages.manager_password)}
              {...formItemLayout}
              style={{marginBottom:0}}
            >
              {
                getFieldDecorator('rootpassword', {
                  rules: [{
                    required: true, message: formatMessage(basicMessages.password_input_manager),
                  },{
                    max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                  }],
                })(
                  <Input autoComplete="new-password" type={'password'}/>
                )
              }
            </FormItem>


          </Form>
        </div>

      </Modal>
    )
  }


}
