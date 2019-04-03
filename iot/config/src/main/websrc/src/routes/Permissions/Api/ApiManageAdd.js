import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Select, Card} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {getLoginUserType} from "../../../utils/utils";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

@injectIntl
@connect(({permissionsApi,permissions, loading,global}) => ({
  global,
  permissionsApi,
  permissions,
  loading: loading.effects['permissionsApi/fetch_addApi_action'],
}))
@Form.create()
export default class ApiManageAdd extends Component {
  constructor() {
    super();
    this.state = {}
  };


  componentDidMount(){
    const userType = getLoginUserType()===0?true:false;

    if(userType){
      this.props.dispatch({
        type:'permissions/fetch_getServiceList_action',
        payload:null
      })
    }
  }

  //添加API
  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'permissionsApi/fetch_addApi_action',
          payload: values,
        });
      }
    });
  };

  render() {
    const {history, loading,permissions:{serviceList},intl:{formatMessage},global:{local}} = this.props;
    const platUserInfo = JSON.parse(localStorage.getItem('config_userInfo'));
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
          bodyStyle={{padding: '20px 32px 0px',}}
          bordered={false}
        >

            <div className='mrgTB30' style={{width: 600}}>
              <Form>

                {platUserInfo&&platUserInfo.value&&platUserInfo.value.type===0?
                  <FormItem
                    label={formatMessage(basicMessages.service)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('serviceId', {
                        rules: [{
                          required: true, message: formatMessage(messages.selectServiceName)
                        }],
                      })(
                        <Select>
                          {serviceList&&serviceList.map((item,index)=>{
                            return(<Option key={index} value={item.id}>{local==='cn'?item.name:item.englishName}</Option>)
                          })}
                        </Select>
                      )
                    }
                  </FormItem>:null
                }

                <FormItem
                  label={formatMessage(messages.interface)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.inputApiName),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.inputApiName)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.type)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('type', {
                      rules: [{
                        required: true, message: formatMessage(messages.permission_api_select_interface),
                      }],
                    })(
                      <Select>
                        <Option value={0}>{formatMessage(basicMessages.private)}</Option>
                        <Option value={1}>{formatMessage(basicMessages.public)}</Option>
                      </Select>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.address)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('dataUrl', {
                      rules: [{
                        required: true, message: formatMessage(messages.inputApiAddress),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.inputApiAddress)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                    })(
                      <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                    )
                  }
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
