import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Icon, Form, Input, Modal, Button,message} from 'antd';
import styles from '../../Equipment.less';
import basicMessages from "../../../../messages/common/basicTitle";
import {injectIntl} from "react-intl";

const FormItem = Form.Item;




@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class AddDataModal extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentWillMount() {
  };

  changeVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  handleSubmit = (e) => {
    const {form,handleValue} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(!values.key||!values.value){
          //message.error('请填入对应的key或value');
          return
        }
        handleValue&&handleValue(values)
      }
    });
  };


  render() {
    const {title,visible,onCancel,intl:{formatMessage}} = this.props;
    const formItemLayouts = {
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
        title={title}
        className='dealModal_styles'
        visible={visible}
        destroyOnClose={true}
        onCancel={()=>{
          onCancel()
        }}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={(e)=>{
              this.handleSubmit(e)
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={()=>{
              onCancel()
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          <FormItem
            label="Key"
            {...formItemLayouts}
          >
            {
              getFieldDecorator('key', {
                rules: [{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
              })(
                <Input/>
              )
            }

          </FormItem>

          <FormItem
            label="value"
            {...formItemLayouts}
          >
            {
              getFieldDecorator('value', {
                rules: [{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
              })(
                <Input/>
              )
            }

          </FormItem>
        </Form>
      </Modal>
    );
  }
}
