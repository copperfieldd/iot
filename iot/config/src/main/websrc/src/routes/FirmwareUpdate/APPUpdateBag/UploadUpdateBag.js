import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card, message,} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "../../FirmwareUpdate/FirmwareUpdate.less";
import { FormattedMessage, injectIntl } from 'react-intl';
import {getAuthority} from "../../../utils/authority";
import messages from "../../../messages/firmware";
import basicMessages from '../../../messages/common/basicTitle';


const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({hardwareUpdateBag, loading,hardwareUpdate}) => ({
  hardwareUpdateBag,
  hardwareUpdate,
  loading: loading.effects['hardwareUpdateBag/fetch_addUpgradePackage_action'],
}))
@injectIntl
@Form.create()
export default class UploadUpdateBag extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentDidMount(){
    let userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    let value = userInfo && userInfo.value;
    this.loadUserTenantInfo(value.tenantId);
    this.loadApplicationInfo(value.appId);
  }

  loadUserTenantInfo = (id) => {
    this.props.dispatch({
      type: 'hardwareUpdate/fetch_getTenantItem_action',
      payload: {
        id: id,
      }
    })
  };

  loadApplicationInfo = (id) => {
    this.props.dispatch({
      type: "hardwareUpdate/fetch_getApplicationItem_action",
      payload: {
        id: id,
      }
    })
  };

  handleSubmit = (e) => {
    const {form,intl:{formatMessage},} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        if(this.state.file){
          let file = new FormData(); // FormData 对象
          file.append("packageName", values.packageName); // 文件对象
          file.append("packageVersion",values.packageVersion);
          file.append("comments",values.comments);
          file.append("packageType",1);
          file.append("uploadFile",this.state.file);
          this.props.dispatch({
            type: 'hardwareUpdateBag/fetch_addUpgradePackage_action',
            payload: file,
          })
        }else{
          message.error(formatMessage(messages.please_upload_package));
        }

      }

    });
  };

  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  UploadFile=()=> {
    let fileObj = document.getElementById("file").files[0]; // js 获取文件对象
    let form = new FormData(); // FormData 对象
    form.append("file", fileObj); // 文件对象
    this.setState({
      file:fileObj,
      fileName:fileObj.name,
    });
  };


  render() {
    const {history, loading, intl:{formatMessage}, hardwareUpdate: {getTenantItem, getApplicationItem}} = this.props;
    const token = getAuthority() && getAuthority().value && getAuthority().value.token || '';

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
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 600}}>
            <Form>
              <FormItem
                label={formatMessage(basicMessages.tenant)}
                {...formItemLayout}
              >
                <span>{getTenantItem && getTenantItem.name}</span>

              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.application)}
                {...formItemLayout}
              >
                <span>{getApplicationItem && getApplicationItem.name}</span>

              </FormItem>

              <FormItem
                label={formatMessage(messages.firm_package_name)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('packageName', {
                    rules: [{
                      required: true, message: formatMessage(messages.package_input_name),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.package_input_name)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.firm_package_number)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('packageVersion', {
                    rules: [{
                      required: true, message: formatMessage(messages.firmware_input_version),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.firmware_input_version)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('comments', {
                    rules: [{
                      required: true, message:formatMessage(basicMessages.describeInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.upload)}
                {...formItemLayout}
              >
                <div className='fileBox'>
                  <Button type={'primary'}>
                    {formatMessage(messages.firm_select_package)}
                  </Button>
                  <span className='file'>
                              <input  type="file" id="file" name="myfile" onChange={this.UploadFile}/>
                            </span>

                </div>
                <span style={{marginLeft:4}}>{this.state.fileName}</span>
              </FormItem>
            </Form>
          </div>


          {/*</Card>*/}
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}
