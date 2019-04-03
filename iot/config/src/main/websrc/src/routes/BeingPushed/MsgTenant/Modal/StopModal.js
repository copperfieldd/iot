import {Button, Form, List, Modal, Input, Table, Select} from "antd";
import styles from "../../../Permissions/Permissions.less";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import messages from '../../../../messages/bushing';
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;

@Form.create()
@injectIntl
export default class StopModal extends Component {
  constructor(){
    super();
  }
  componentDidMount(){
  };

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
        destroyOnClose={true}
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
              label="租户ID"
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

            <FormItem
              label="租户状态"
              {...formItemLayout}
              style={{display:'none'}}
            >
              {
                getFieldDecorator('tenantStatus', {
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
                    required: true, message: formatMessage(basicMessages.passwordInput),
                  },{
                    max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                  }],
                  //initialValue:defaultValue&&defaultValue.fieldId
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
