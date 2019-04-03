import {Button, Form, Modal, Input, Select} from "antd";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
const FormItem = Form.Item;
import messages from '../../../messages/statistics';
import {injectIntl} from "react-intl";
import basicMessages from "../../../messages/common/basicTitle";

const Option = Select.Option;
@Form.create()
@connect(({equipment, loading}) => ({
  equipment,
  loading: loading.effects['equipment/fetch_adapterPullList_list_action'],
}))
@injectIntl
export default class DataNewField extends Component {
  constructor() {
    super();
    this.state = {
      fieldType:null,
    }
  }

  componentDidMount() {
  };

  onChange=(value)=>{
    let childFields = value==='Number'?[]:value==='String'?[]:[]
    this.setState({
      childFields:childFields
    })
  }



  render() {
    const { modalVisible,onCancelModal,handSubmit,defaultValue,valueId,level,intl: {formatMessage}, } = this.props;
    const {form} = this.props;
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
      <Modal
        visible={modalVisible}
        title={formatMessage(messages.sti_table_add_filed)}
        className='dealModal_styles'
        destroyOnClose={true}
        width={400}
        onCancel={onCancelModal && onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={(e) => {
              e.preventDefault();
              form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                  let value={
                    ...values,
                    pid:level&&level===1?0:valueId,
                    uid:defaultValue&&defaultValue!==1?defaultValue.uid:`${Date.parse(new Date())}`,
                  };
                  handSubmit && handSubmit(value);
                  onCancelModal && onCancelModal()
                }
              });
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal && onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Form>

            <FormItem
              label={formatMessage(messages.sti_table_fieldName)}
              {...formItemLayout}
            >
              {
                getFieldDecorator('fieldName', {
                  rules: [{
                    required: true, message: formatMessage(messages.sti_table_fieldName_input),
                  },{
                    max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                  }],
                  initialValue:defaultValue&&defaultValue.fieldName
                })(
                 <Input/>
                )
              }
            </FormItem>

            <FormItem
              label={formatMessage(messages.sti_table_fieldTag)}
              {...formItemLayout}
            >
              {
                getFieldDecorator('fieldId', {
                  rules: [{
                    required: true, message: formatMessage(messages.sti_table_fieldTag_input),
                  },{
                    max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                  }],
                  initialValue:defaultValue&&defaultValue.fieldId
                })(
                  <Input/>
                )
              }
            </FormItem>

            <FormItem
              label={formatMessage(messages.sti_table_fieldType)}
              {...formItemLayout}
            >
              {
                getFieldDecorator('fieldType', {
                  rules: [{
                    required: true, message: formatMessage(messages.sti_table_fieldType_select),
                  }],
                  initialValue:defaultValue&&defaultValue.fieldType
                })(
                  <Select onChange={this.onChange}>
                    <Option value='String'>String</Option>
                    <Option value='Number'>Interger</Option>
                    <Option value='Array'>Array</Option>
                  </Select>
                )
              }
            </FormItem>
          </Form>
        </div>

      </Modal>
    )
  }
}
