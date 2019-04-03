import {Button, Form, List, Modal, Input, Table, Select, Radio, Upload,Row,Col,message} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import * as routerRedux from "react-router-redux";
import AppModal from './AppModal';
import EmailModal from './EmailModal';
import MessageModal from './MessageModal';
import {getAuthority} from "../../../../utils/authority";
import basicMessages from '../../../../messages/common/basicTitle';
import messages from "../../../../messages/bushing";
import {injectIntl} from "react-intl";
const Search = Input.Search;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
@injectIntl
export default class TaskModal extends Component {
  constructor(){
    super();
    this.state={
      typeValue:null,
      appVisible:false,
      messageVisible:false,
      emailVisible:false,
    }

  }
  componentDidMount(){
    const {typeValue} = this.props;
  };

  onChange = (e) => {
    this.setState({
      typeValue: e.target.value,
    });
  };

  changAppVisible=()=>{
    this.setState({
      appVisible:!this.state.appVisible,
    })
  };

  changMessageVisible=()=>{
    this.setState({
      messageVisible:!this.state.messageVisible,
    })
  };

  changEmailVisible=()=>{
    this.setState({
      emailVisible:!this.state.emailVisible,
    })
  };

  UploadFile=()=> {
    let fileObj = document.getElementById("file").files[0]; // js 获取文件对象
    let form = new FormData(); // FormData 对象
    form.append("file", fileObj); // 文件对象
    this.setState({
      file:fileObj,
    });
  };

  UploadFile1=()=> {
    let fileObj = document.getElementById("file1").files[0]; // js 获取文件对象
    let form = new FormData(); // FormData 对象
    form.append("file", fileObj); // 文件对象
    this.setState({
      file:fileObj,
    });
  };

  UploadFile2=()=> {
    let fileObj = document.getElementById("file2").files[0]; // js 获取文件对象
    let form = new FormData(); // FormData 对象
    form.append("file", fileObj); // 文件对象
    this.setState({
      file:fileObj,
    });
  };





  render(){
    const token = getAuthority() && getAuthority().value && getAuthority().value.token || '';
    const {loading,visible,onCancel,handSubmit,defaultValue } = this.props;
    const {intl:{formatMessage}} = this.props;
    const {typeValue,appVisible,messageVisible,emailVisible,file,appValue,messageValue,emailValue} = this.state;
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
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '39.9px',
    };

    return(
      <Modal
        visible={visible}
        title={formatMessage(messages.msg_new_task)}
        className='dealModal_styles'
        width={550}
        maskClosable={false}
        destroyOnClose={true}
        onCancel={onCancel&&onCancel}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button loading={loading} type="primary" onClick={(e)=>{
              const {form} = this.props;
              e.preventDefault();
              form.validateFieldsAndScroll((err, values) => {
                if(file){
                  let value = typeValue===2? {
                    type:typeValue,
                    ...appValue,
                    uploadFile:file
                  }:typeValue===0?{
                    type:typeValue,
                    ...messageValue,
                    uploadFile:file
                  }:{
                    type:typeValue,
                    ...emailValue,
                    uploadFile:file
                  }
                  handSubmit&&handSubmit(value)
                }else{
                  message.error('请上传接收用户')
                }
              });
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={()=>{
              onCancel&&onCancel();
              this.setState({
                typeValue:null,
              });
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
          <Form>
            <FormItem
              label={formatMessage(messages.msg_push_type)}
              {...formItemLayout}
            >
              {
                getFieldDecorator('type', {
                  rules: [{
                    required: true, message:formatMessage(messages.msg_push_select_type) ,
                  }],
                  initialValue:defaultValue&&defaultValue.type
                })(
                  <RadioGroup onChange={this.onChange} style={{width:'100%'}}>
                    <Radio style={radioStyle} value={2}>
                      {formatMessage(messages.msg_app_push)}
                    </Radio>
                    <FormItem
                      label={formatMessage(messages.msg_msg_receiver_id)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('userId', {
                        })(
                          <div className='fileBox'>
                            <Button disabled={typeValue===2?false:true} type={'primary'}>
                              {formatMessage(basicMessages.select_file)}
                            </Button>
                            <span className='file'>
                              <input disabled={typeValue===2?false:true} type="file" id="file" name="myfile" onChange={this.UploadFile}/>
                            </span>
                            <Button  disabled={typeValue===2?false:true} style={{marginLeft:8}} onClick={this.changAppVisible}>{formatMessage(messages.msg_edit_app)}</Button>
                          </div>
                        )
                      }
                    </FormItem>
                    <Radio style={radioStyle} value={0}>{formatMessage(messages.msg_msg_push)}</Radio>
                    <FormItem
                      label={formatMessage(messages.msg_receive_number)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('phone', {
                        })(
                          <div className='fileBox'>
                            <Button disabled={typeValue===0?false:true} type={'primary'}>
                              {formatMessage(basicMessages.select_file)}
                            </Button>
                            <span className='file'>
                              <input disabled={typeValue===0?false:true} type="file" id="file1" name="myfile" onChange={this.UploadFile1}/>
                            </span>
                            <Button  disabled={typeValue===0?false:true} style={{marginLeft:8}} onClick={this.changMessageVisible}>{formatMessage(messages.msg_edit_app)}</Button>
                          </div>
                        )
                      }
                    </FormItem>
                    <Radio style={radioStyle} value={1}>{formatMessage(messages.msg_email_push)}</Radio>
                    <FormItem
                      label={formatMessage(messages.msg_receive_email)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('email', {
                        })(
                          <div className='fileBox'>
                            <Button className="file" disabled={typeValue===1?false:true} type={'primary'}>
                              {formatMessage(basicMessages.select_file)}
                            </Button>
                            <span className='file'>
                              <input disabled={typeValue===1?false:true} type="file" id="file2" name="myfile" onChange={this.UploadFile2}/>
                            </span>
                            <Button  disabled={typeValue===1?false:true} style={{marginLeft:8}} onClick={this.changEmailVisible}>{formatMessage(messages.msg_edit_app)}</Button>
                          </div>
                        )
                      }
                    </FormItem>
                  </RadioGroup>
                )
              }
            </FormItem>
          </Form>

        <AppModal
          visible={appVisible}
          getFieldDecorator={getFieldDecorator}
          form={this.props.form}
          handleSubmit={(res)=>{
            this.setState({
              appValue:res
            })
          }}
          onCancel={this.changAppVisible}
        />

        <EmailModal
          visible={emailVisible}
          getFieldDecorator={getFieldDecorator}
          form={this.props.form}
          handleSubmit={(res)=>{
            this.setState({
              emailValue:res,
            })
          }}
          onCancel={this.changEmailVisible}
        />

        <MessageModal
          visible={messageVisible}
          getFieldDecorator={getFieldDecorator}
          form={this.props.form}
          handleSubmit={(res)=>{
            this.setState({
              messageValue:res
            })
          }}
          onCancel={this.changMessageVisible}
        />


      </Modal>
    )
  }


}
