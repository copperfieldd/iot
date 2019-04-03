import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Form, Row, Col, Modal, Radio, Button, Input} from 'antd';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
import basicMessages from "../../../../messages/common/basicTitle";
import {injectIntl} from 'react-intl';
import messages from "../../../../messages/bushing";
@Form.create()
@injectIntl
export default class AddAutographModal extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      tabKey: '1',
      value:1,
    }
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const {addAutographModalVisible,title,onCancel,isEdit,form,handleSubmit,loading,autographValue,isAutoDetails} = this.props;
    const {intl: {formatMessage}} = this.props;
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
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal
        title={isEdit||isAutoDetails?formatMessage(messages.msg_autograph_item):formatMessage(messages.msg_application_autograph)}
        visible={addAutographModalVisible}
        className='dealModal_styles'
        destroyOnClose={true}
        width={550}
        onCancel={()=>{
          onCancel()
        }}
        footer={
          <div style={{textAlign: 'center'}}>
            {isAutoDetails?null:
            <Button type="primary" loading={loading} onClick={(e)=>{
              e.preventDefault();
              form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  handleSubmit&&handleSubmit(values)
                }
              });
            }}>{formatMessage(basicMessages.confirm)}</Button>}
            <Button onClick={()=>{
              onCancel()
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          <FormItem
            label={formatMessage(messages.msg_autograph_type)}
            {...formItemLayout}
            style={{marginBottom:'12px'}}

          >
            {
              getFieldDecorator('type', {
                rules: [{
                  required: true, message: formatMessage(messages.msg_autograph_select_type),
                }],
                initialValue:autographValue&&autographValue.type
              })(
                <RadioGroup disabled={isAutoDetails}>
                  <Radio value={0}>企事业单位的全称或简称</Radio>
                  <br/>
                  <Radio value={1}>工信部备案的网站全称或简称</Radio>
                  <br/>
                  <Radio value={2}>APP应用的全称或简称 </Radio>
                  <br/>
                  <Radio value={3}>公众号或小程序的名称全称或简称</Radio>
                  <br/>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem
            label={formatMessage(basicMessages.autograph)}
            {...formItemLayout}
            style={{marginBottom:'12px'}}

          >
            {
              getFieldDecorator('sign', {
                rules: [{
                  required: true, message:formatMessage(messages.msg_input_autograph),
                },{
                  max: 10, message:formatMessage(messages.msg_no_more_than_ten)
                },],
                initialValue:autographValue&&autographValue.sign
              })(
                <Input disabled={isAutoDetails} placeholder={formatMessage(messages.msg_input_autograph)}/>
              )
            }

          </FormItem>

        </Form>

      </Modal>
    );
  }
}
