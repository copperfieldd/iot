import React, {Component} from 'react';
import {
  Button,
  Modal,
  Form,
  Select, Input,
} from 'antd';

import styles from './index.less';
import messages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@injectIntl
export default class ChangePassword extends Component {

  render() {
    const {userInfo, visible,onCancelModal,handleSubmit,intl:{formatMessage} } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        className='dealModal_styles'
        visible={visible}
        title={formatMessage(messages.permission_change_password)}
        destroyOnClose={true}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={(e) => {
                e.preventDefault();
                this.props.form.validateFields((err, values) => {
                  if (!err) {
                    handleSubmit&&handleSubmit(values);
                  }
                });
            }}>{formatMessage(messages.confirm)}</Button>
            <Button onClick={onCancelModal && onCancelModal} style={{marginLeft: 16}}>{formatMessage(messages.cancel)}</Button>
          </div>
        }
        onCancel={ onCancelModal && onCancelModal}
      >
        <Form>
          <FormItem
            label={formatMessage(messages.oldPassword)}
            {...formItemLayout}
          >
            {
              getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true, message: formatMessage(messages.passwordInput),
                  },
                  ],
              })(
                <Input type={'password'}/>
              )
            }
          </FormItem>
          <FormItem
            label={formatMessage(messages.new_password)}
            {...formItemLayout}
          >
            {
              getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true, message: formatMessage(messages.passwordInput),
                  },
                  {
                    pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,30}$/,message: formatMessage(messages.password_input_rule),
                  }],
              })(
                <Input type={'password'}/>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
