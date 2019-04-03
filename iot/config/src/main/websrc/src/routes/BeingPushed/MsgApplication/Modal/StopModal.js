import {Button, Form, Modal, Input,} from "antd";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import messages from '../../../../messages/bushing';
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;

@Form.create()
@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_tenantList_action'],
}))
@injectIntl
export default class StopModal extends Component {
  constructor(){
    super();

  }

  render(){
    const {loading,modalShowVisible,onCancel,handSubmit,defaultValue,intl:{formatMessage} } = this.props;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    return(
      <Modal
        visible={modalShowVisible}
        title={formatMessage(basicMessages.notice)}
        className='dealModal_styles'
        width={500}
        onCancel={onCancel&&onCancel}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button loading={loading} type="primary" onClick={(e)=>{
              const {form} = this.props;
              e.preventDefault();
              form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  handSubmit&&handSubmit(values)
                }
              });
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancel&&onCancel} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <div style={{margin:'10px 0'}}><p style={{textAlign:'center',fontSize:16,fontWeight:'500'}}>{formatMessage(messages.msg_to_operation_service)}{defaultValue&&defaultValue.status===1?formatMessage(basicMessages.suspend):formatMessage(basicMessages.enable)}{formatMessage(messages.msg_the_service)}</p></div>
          <Form>

            <FormItem
              label="字段名"
              {...formItemLayout}
              style={{display:'none'}}
            >
              {
                getFieldDecorator('applicationId', {
                  initialValue:defaultValue&&defaultValue.applicationId
                })(
                  <Input/>
                )
              }
            </FormItem>

            <FormItem
              label="字段名"
              {...formItemLayout}
              style={{display:'none'}}
            >
              {
                getFieldDecorator('applicationStatus', {
                  initialValue:defaultValue&&defaultValue.status===1?2:1
                })(
                  <Input />
                )
              }
            </FormItem>

            <FormItem
              label={formatMessage(basicMessages.manager_password)}
              {...formItemLayout}
            >
              {
                getFieldDecorator('rootpassword', {
                  rules: [{
                    required: true, message:formatMessage(basicMessages.passwordInput),
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
