import {Button, Form, List, Modal, Input, Table, Select, Radio} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from '../../../../messages/common/basicTitle';
import messages from "../../../../messages/bushing";
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@Form.create()
@connect(({beingPushed}) => ({
  beingPushed,
}))
@injectIntl
export default class MessageModal extends Component {
  constructor(){
    super();
    this.state={
      typeValue:null,
      appVisible:false,
      variableState:false,
    }

  }
  componentDidMount(){
    this.props.dispatch({
      type:'beingPushed/fetch_pullAutograph_action',
      payload:{
        start:0,
        count:1000,
      }
    })
    this.props.dispatch({
      type:'beingPushed/fetch_pullTemp_action',
      payload:{
      }
    })
  };

  onChangeTemplate=(value)=>{
    let item = JSON.parse(value);
    this.props.dispatch({
      type:'beingPushed/fetch_templateItem_action',
      payload:{
        id:item.id
      },
      callback:(res)=>{
        let r = /\${(.+?)\}/g;
        let variableValues = res&&res.content.match(r)
        this.setState({
          variableState:res.content,
          variableKey:variableValues,
        })
      }
    })
  };

  onChangeValue=(e,item)=>{
    const {variableState} = this.state;
    let value = variableState.replace(item,e.target.value);
    this.setState({
      variableState:value
    })
  }


  render(){
    const {visible,onCancel,handleSubmit,defaultValue,getFieldDecorator,form,beingPushed:{pullAutograph,pullTemp,templateItem} } = this.props;
    let r = /\${(.+?)\}/g;
    let variableValues = templateItem&&templateItem.content.match(r);
    const {intl:{formatMessage}} = this.props;
    const {variableState,variableKey} = this.state;
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
        title={formatMessage(basicMessages.message)}
        className='dealModal_styles'
        width={550}
        destroyOnClose={true}
        onCancel={onCancel&&onCancel}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={(e)=>{
              e.preventDefault();
              form.validateFieldsAndScroll((err, values) => {
                if(values.signName&&values.templeId){
                  let variableValue = {};
                  variableKey&&variableKey.map(item=>{
                    Object.assign(variableValue, {[item.substr(2, (item.length-3))]:values[item]});
                  });
                  let params = {
                    signName:JSON.parse(values.signName).sign,
                    content:variableState,
                    templeId:JSON.parse(values.templeId).id,
                    variableValue:variableValue,
                  };

                  handleSubmit&&handleSubmit(params);
                  onCancel()&&onCancel()
                }

              });
              this.setState({
                variableState:null
              })
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={()=>{
              onCancel()&&onCancel()
              this.props.dispatch({
                type:'beingPushed/templateItem',
                payload:null,
              })
              this.setState({
                variableState:null
              })
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          <FormItem
            label={formatMessage(messages.msg_service_template_name)}
            {...formItemLayout}
          >
            {
              getFieldDecorator('templeId', {
                rules: [{
                  required: true,  message: formatMessage(messages.msg_select_template),
                }],
              })(
                <Select onChange={this.onChangeTemplate}>
                  {pullTemp&&pullTemp.map((item,index)=>{
                    return(
                      <Option key={index} value={JSON.stringify({code:item.smsCode,id:item.id})}>{item.title}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>
          <FormItem
            label={formatMessage(basicMessages.autograph)}
            {...formItemLayout}
          >
            {
              getFieldDecorator('signName', {
                rules: [{
                  required: true,  message: formatMessage(messages.msg_select_autograph),
                }],
              })(
                <Select>
                  {pullAutograph&&pullAutograph.map((item,index)=>{
                    return(
                      <Option key={index} value={JSON.stringify({id:item.id,sign:item.sign})}>{item.sign}</Option>
                    )
                  })}
                </Select>
              )
            }
          </FormItem>

          {
            variableValues&&variableValues.map((item,index)=>{
              return(
                <FormItem
                  key={index}
                  label={formatMessage(basicMessages.variable)`${item}`}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator(item, {
                      rules: [{
                        required: true,  message: formatMessage(basicMessages.input_variable),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.msg_enter_after)} onPressEnter={(e)=>this.onChangeValue(e,item)}/>
                    )
                  }
                </FormItem>
              )
            })
          }

          <FormItem
            label={formatMessage(messages.msg_msg_content)}
            {...formItemLayout}
          >
            <TextArea value={variableState&&variableState} placeholder={formatMessage(messages.msg_msg_input_content)} rows={4} />
          </FormItem>
        </Form>

      </Modal>
    )
  }
}
