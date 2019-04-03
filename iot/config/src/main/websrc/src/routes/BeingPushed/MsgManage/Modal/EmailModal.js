import {Button, Form, Modal, Input,} from "antd";
import styles from "../../../Permissions/Permissions.less";
import React, {Component, Fragment,} from 'react';
import basicMessages from '../../../../messages/common/basicTitle';
import messages from "../../../../messages/bushing";
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
@injectIntl
export default class EmailModal extends Component {
  constructor(){
    super();
    this.state={
      typeValue:null,
      appVisible:false,
    }

  }


  render(){
    const {loading,visible,onCancel,handleSubmit,getFieldDecorator,form } = this.props;
    const {intl:{formatMessage}} = this.props;
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
    return(
      <Modal
        visible={visible}
        title={formatMessage(basicMessages.email)}
        className='dealModal_styles'
        width={550}
        destroyOnClose={true}
        onCancel={onCancel&&onCancel}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button loading={loading} type="primary" onClick={(e)=>{
              e.preventDefault();
              form.validateFieldsAndScroll((err, values) => {
                if(values.title&&values.content){
                  handleSubmit&&handleSubmit(values);
                  onCancel()&&onCancel()
                }

              });
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancel&&onCancel} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          <FormItem
            label={formatMessage(messages.msg_title)}
            {...formItemLayout}
          >
            {
              getFieldDecorator('title', {
                rules: [{
                  required: true,  message: formatMessage(messages.msg_input_title),
                },{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
              })(
                <Input placeholder={formatMessage(messages.msg_input_title)}/>
              )
            }
          </FormItem>

          <FormItem
            label={formatMessage(messages.msg_msg_content)}
            {...formItemLayout}
          >
            {
              getFieldDecorator('content', {
                rules: [{
                  required: true, message: formatMessage(messages.msg_msg_input_content),
                },{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
              })(
                <TextArea placeholder={formatMessage(messages.msg_msg_input_content)} rows={4}/>
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }


}
