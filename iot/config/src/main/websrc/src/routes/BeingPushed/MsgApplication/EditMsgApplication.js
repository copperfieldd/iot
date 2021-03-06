import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Input, Select, Checkbox, Row, Col, message} from 'antd';
import styles from '../BeingPushed.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {getLoginUserType} from "../../../utils/utils";
import messages from "../../../messages/bushing";
import basicMessages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

const FormItem = Form.Item;
const TextArea = Input.TextArea;


@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_applicationItemByAppId_action'],
  updateLoading:loading.effects['msgTenant/fetch_editApplicationConfig_action'],
}))
@injectIntl
@Form.create()
export default class EditMsgApplication extends Component {
  constructor() {
    super();
    this.state = {
      checkedValue:[],
    }
  };

  componentDidMount() {
    const {match:{params:{data}},form} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type:'msgTenant/fetch_applicationItemByAppId_action',
      payload:{
        applicationId:item.applicationId
      },
      callback:(res)=>{
        let type = res && res.push&&res.push.map(item => item.type);
        this.setState({
          checkedValue:type,
        })
      }
    })
  };

  changeCheck=(value)=>{
    this.setState({
      checkedValue:value,
    })
  }


  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  //添加
  handleSubmit = (e) => {
    const {match:{params:{data}},form,msgTenant: {applicationItemByAppId},intl:{formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    e.preventDefault();
    form.validateFieldsAndScroll((err, formValues) => {
      if (!err) {
        let push_type = formValues.type&&formValues.type.map(item=>{
          if(item===0){
            if(!formValues.msgNumber){
              message.error(formatMessage(messages.msg_margin_reminder_input));
              return
            }
            return {
              type:item,
              number:formValues.msgNumber,
              surplus:formValues.msgSurplus,
              remindPhone:[formValues.msgRemind_phone,formValues.msgRemind_phone1,formValues.msgRemind_phone2].filter(item=>item),
              remindMail:[formValues.msgRemind_email,formValues.msgRemind_email1,formValues.msgRemind_email2].filter(item=>item),
              price:formValues.msgPrice,
              internationalNumber:formValues.internationalNumber,
              internationalSurplus:formValues.internationalSurplus,
              internationalPrice:formValues.internationalPrice,
            }
          }else if(item===1){
            return {
              type:item,
              number:formValues.emailNumber,
              surplus:formValues.emailSurplus,
              remindPhone:[formValues.emailRemind_phone,formValues.emailRemind_phone1,formValues.emailRemind_phone2].filter(item=>item),
              remindMail:[formValues.emailRemind_email,formValues.emailRemind_email1,formValues.emailRemind_email2].filter(item=>item),
            }
          }else{
            return {
              type:item,
              number:formValues.appNumber,
              surplus:formValues.appSurplus,
              remindPhone:[formValues.appRemind_phone,formValues.appRemind_phone1,formValues.appRemind_phone2].filter(item=>item),
              remindMail:[formValues.appRemind_email,formValues.appRemind_email1,formValues.appRemind_email2].filter(item=>item),
            }
          }
        });
        let push = push_type?push_type:[];
        this.props.dispatch({
          type: 'msgTenant/fetch_editApplicationConfig_action',
          payload: {
            applicationId:applicationItemByAppId.id,
            push:[
              ...push
            ],
            contactPhone:formValues.contactPhone,
            contactMail:formValues.contactMail,
            contactName:formValues.contactName,
            applicationInfo:formValues.applicationInfo,
            applicationName:formValues.applicationName
          },
        });
      }
    });
  };

  render() {
    const {history, match: {params: {data}}, loading, msgTenant: {applicationItemByAppId},updateLoading,intl:{formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {checkedValue} = this.state;
    const {getFieldDecorator} = this.props.form;
    let userType = getLoginUserType();
    let none = userType===3?'none':'';
    let pushType = applicationItemByAppId && applicationItemByAppId.push;
    let type = applicationItemByAppId && applicationItemByAppId.push&&applicationItemByAppId.push.map(item => item.type);
    let app = pushType&&pushType.map((item=>{
      if(item.type===2){
        return item
      }
    }));
    let email = pushType&&pushType.map((item=>{
      if(item.type===1){
        return item
      }
    }));
    let msg = pushType&&pushType.map((item=>{
      if(item.type===0){
        return item
      }
    }));
    app = app&&app.filter(item => item);
    email = email&&email.filter(item => item);
    msg = msg&&msg.filter(item=>item);

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };

    const formItemLayout1 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };

    const formItemLayout5 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
    };
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >

          <div style={{width: 820, margin: '30px auto'}}>
            <Form>
              <FormItem
                label={formatMessage(basicMessages.applicationName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('applicationName', {
                    rules: [{
                      required: true,
                    }],
                    initialValue: applicationItemByAppId && applicationItemByAppId.name
                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.contacts)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('contactName', {
                    rules: [
                      {
                        required: true, message: formatMessage(basicMessages.contactsInput),
                      },
                      {
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }
                    ],
                    initialValue: applicationItemByAppId && applicationItemByAppId.contactName
                  })(
                    <Input placeholder={formatMessage(basicMessages.contactsInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.telephone)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('contactPhone', {
                    rules: [
                      {
                        required: true, message: formatMessage(basicMessages.telephoneInput),
                      },{
                        pattern:/^1[34578]\d{9}$/,message:formatMessage(basicMessages.correctPhone),
                      }
                    ],
                    initialValue: applicationItemByAppId && applicationItemByAppId.contactPhone
                  })(
                    <Input placeholder={formatMessage(basicMessages.telephoneInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.email)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('contactMail', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.emailInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: applicationItemByAppId && applicationItemByAppId.contactMail
                  })(
                    <Input placeholder={formatMessage(basicMessages.emailInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.msg_app_desc)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('applicationInfo', {
                    rules: [{
                      required: true, message: formatMessage(messages.msg_app_desc_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: applicationItemByAppId && applicationItemByAppId.applicationInfo
                  })(
                    <TextArea rows={4} placeholder={formatMessage(messages.msg_app_desc_input)}/>
                  )
                }
              </FormItem>

                  <FormItem
                    label={formatMessage(messages.msg_push_type)}
                    {...formItemLayout}
                    style={{display:none}}
                  >
                    {
                      getFieldDecorator('type', {
                        rules: [{
                          required: true, message: formatMessage(messages.msg_push_select_type),
                        }],
                        initialValue: type
                      })(
                        <Checkbox.Group style={{width: '100%', textAlign: 'left', marginTop: 8}} onChange={this.changeCheck}>
                          <Checkbox value={2}>{formatMessage(messages.msg_app_push)}</Checkbox>
                          <div style={{minHeight: 58}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={15}>
                                <Row>
                                  <Col span={13}>
                                    <FormItem
                                      label={formatMessage(messages.msg_number)}
                                      {...formItemLayout1}
                                    >
                                      {
                                        getFieldDecorator('appNumber', {
                                          rules: [{
                                            required: checkedValue.indexOf(2)!==-1?true:false, message: formatMessage(messages.msg_number_input),
                                          }],
                                          initialValue:app&&app[0]&&app[0].number===-1?'*':app&&app[0]&&`${app[0].number}`
                                        })(
                                          <Input/>
                                        )
                                      }
                                    </FormItem>
                                  </Col>
                                  <Col span={11}>
                                    <div style={{lineHeight: '39px'}}>{formatMessage(messages.msg_strip)}<span
                                      style={{fontSize: 12, color: '#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span></div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col span={9}>
                                <Row>
                                  <Col span={23}>
                                    <FormItem
                                      label={formatMessage(messages.msg_margin_reminder)}
                                      {...formItemLayout1}
                                    >
                                      {
                                        getFieldDecorator('appSurplus', {
                                          rules: [{
                                            required: checkedValue.indexOf(2)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_input),
                                          },{
                                            pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
                                          }],
                                          initialValue:app&&app[0]&&`${app[0].surplus}`
                                        })(
                                          <Input/>
                                        )
                                      }
                                    </FormItem>
                                  </Col>
                                  <Col span={1}>
                                    <div style={{lineHeight: '39px'}}>{formatMessage(messages.msg_strip)}</div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                          </div>
                          <div style={{minHeight: 58}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={6} style={{width: 110, color: 'rgba(0, 0, 0, 0.85)',lineHeight:'40px'}}>{formatMessage(messages.msg_margin_reminder_phone)}：</Col>
                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('appRemind_phone', {
                                      rules: [{
                                        required: checkedValue.indexOf(2)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_phone_input),
                                      },{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:app&&app[0]&&app[0].remindPhone[0]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('appRemind_phone1', {
                                      initialValue:app&&app[0]&&app[0].remindPhone[1]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('appRemind_phone2', {
                                      initialValue:app&&app[0]&&app[0].remindPhone[2]
                                    },{
                                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                            </Row>
                          </div>
                          <div style={{minHeight: 40}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)',lineHeight:'40px'}}>{formatMessage(messages.msg_margin_reminder_email)}：</Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('appRemind_email', {
                                      rules: [{
                                        required: checkedValue.indexOf(2)!==-1?true:false, message:formatMessage(messages.msg_margin_reminder_email_input),
                                      },{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:app&&app[0]&&app[0].remindMail[0]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12,marginLeft:110,}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('appRemind_email1', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:app&&app[0]&&app[0].remindMail[1]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12,marginLeft:110,}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('appRemind_email2', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:app&&app[0]&&app[0].remindMail[2]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                            </Row>

                          </div>
                          <Checkbox value={0}>{formatMessage(messages.msg_msg_push)}</Checkbox>
                          <div style={{minHeight: 58}} className={styles.msgFormItem}>
                            <Row gutter={8} style={{minHeight:58}}>
                              <Col span={12}>
                                <Row>
                                  <Col span={14}>
                                    <FormItem
                                      label={formatMessage(messages.msg_international_number)}
                                      {...formItemLayout5}
                                    >
                                      {
                                        getFieldDecorator('internationalNumber', {
                                          rules: [{
                                            required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_number_input),
                                          }],
                                          initialValue:msg&&msg[0]&&msg[0].internationalNumber===-1?'*':msg&&msg[0]&&`${msg[0].internationalNumber}`
                                        })(
                                          <Input/>
                                        )
                                      }

                                    </FormItem>
                                  </Col>
                                  <Col span={10}>
                                    <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}
                                      <span style={{fontSize:12,color:'#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col span={6}>
                                <Row>
                                  <Col span={20}>
                                    <FormItem
                                      label={formatMessage(messages.msg_margin_reminder)}
                                      {...formItemLayout5}
                                    >
                                      {
                                        getFieldDecorator('internationalSurplus', {
                                          rules: [{
                                            required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_input),
                                          },{
                                            pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
                                          }],
                                          initialValue:msg&&msg[0]&&`${msg[0].internationalSurplus}`
                                        })(
                                          <Input/>
                                        )
                                      }
                                    </FormItem>
                                  </Col>
                                  <Col span={4}>
                                    <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}</div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col span={6}>
                                <Row>
                                  <Col span={23}>
                                    <FormItem
                                      label={formatMessage(messages.msg_price)}
                                      {...formItemLayout5}
                                    >
                                      {
                                        getFieldDecorator('internationalPrice', {
                                          rules: [{
                                            required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_price_input),
                                          }],
                                          initialValue:msg&&msg[0]&&`${msg[0].internationalPrice}`
                                        })(
                                          <Input/>
                                        )
                                      }
                                    </FormItem>
                                  </Col>
                                  <Col span={1}>
                                    <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_yuan)}</div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <div style={{minHeight:58}} className={styles.msgFormItem}>
                              <Row gutter={8}>
                                <Col span={12}>
                                  <Row>
                                    <Col span={14}>
                                      <FormItem
                                        label={formatMessage(messages.msg_domestic_number)}
                                        {...formItemLayout5}
                                      >
                                        {
                                          getFieldDecorator('msgNumber', {
                                            rules: [{
                                              required: checkedValue.indexOf(0)!==-1?true:false, message:  formatMessage(messages.msg_number_input),
                                            }],
                                            initialValue:msg&&msg[0]&&msg[0].number===-1?'*':msg&&msg[0]&&`${msg[0].number}`
                                          })(
                                            <Input/>
                                          )
                                        }

                                      </FormItem>
                                    </Col>
                                    <Col span={10}>
                                      <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}
                                        <span style={{fontSize:12,color:'#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span>
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={6}>
                                  <Row>
                                    <Col span={20}>
                                      <FormItem
                                        label={formatMessage(messages.msg_margin_reminder)}
                                        {...formItemLayout5}
                                      >
                                        {
                                          getFieldDecorator('msgSurplus', {
                                            rules: [{
                                              required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_input),
                                            },{
                                              pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
                                            }],
                                            initialValue:msg&&msg[0]&&`${msg[0].surplus}`
                                          })(
                                            <Input/>
                                          )
                                        }
                                      </FormItem>
                                    </Col>
                                    <Col span={4}>
                                      <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}</div>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={6}>
                                  <Row>
                                    <Col span={23}>
                                      <FormItem
                                        label={formatMessage(messages.msg_price)}
                                        {...formItemLayout5}
                                      >
                                        {
                                          getFieldDecorator('msgPrice', {
                                            rules: [{
                                              required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_price_input),
                                            }],
                                            initialValue:msg&&msg[0]&&`${msg[0].price}`
                                          })(
                                            <Input/>
                                          )
                                        }
                                      </FormItem>
                                    </Col>
                                    <Col span={1}>
                                      <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_yuan)}</div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>
                          </div>
                          <div style={{minHeight: 58}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={6} style={{width: 110, color: 'rgba(0, 0, 0, 0.85)',lineHeight:'40px'}}>{formatMessage(messages.msg_margin_reminder_phone)}：</Col>
                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('msgRemind_phone', {
                                      rules: [{
                                        required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_phone_input),
                                      },{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:msg&&msg[0]&&msg[0].remindPhone[0]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('msgRemind_phone1', {
                                      rule:[
                                        {
                                          max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                        }
                                      ],
                                      initialValue:msg&&msg[0]&&msg[0].remindPhone[1]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('msgRemind_phone2', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:msg&&msg[0]&&msg[0].remindPhone[2]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                            </Row>
                          </div>
                          <div style={{minHeight: 40}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)',lineHeight:'40px'}}>{formatMessage(messages.msg_margin_reminder_email)}：</Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('msgRemind_email', {
                                      rules: [{
                                        required: checkedValue.indexOf(0)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_email_input),
                                      },{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:msg&&msg[0]&&msg[0].remindMail[0]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12,marginLeft:110,}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('msgRemind_email1', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:msg&&msg[0]&&msg[0].remindMail[1]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12,marginLeft:110,}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('msgRemind_email2', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:msg&&msg[0]&&msg[0].remindMail[2]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                            </Row>

                          </div>
                          <Checkbox value={1}>{formatMessage(messages.msg_email_push)}</Checkbox>
                          <div style={{minHeight: 58}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={15}>
                                <Row>
                                  <Col span={13}>
                                    <FormItem
                                      label={formatMessage(messages.msg_number)}
                                      {...formItemLayout1}
                                    >
                                      {
                                        getFieldDecorator('emailNumber', {
                                          rules: [{
                                            required: checkedValue.indexOf(1)!==-1?true:false, message: formatMessage(messages.msg_number_input),
                                          }],
                                          initialValue:email&&email[0]&&email[0].number===-1?'*':email&&email[0]&&`${email[0].number}`
                                        })(
                                          <Input/>
                                        )
                                      }
                                    </FormItem>
                                  </Col>
                                  <Col span={11}>
                                    <div style={{lineHeight: '39px'}}>{formatMessage(messages.msg_strip)}<span
                                      style={{fontSize: 12, color: '#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span></div>
                                  </Col>
                                </Row>
                              </Col>
                              <Col span={9}>
                                <Row>
                                  <Col span={23}>
                                    <FormItem
                                      label={formatMessage(messages.msg_margin_reminder)}
                                      {...formItemLayout1}
                                    >
                                      {
                                        getFieldDecorator('emailSurplus', {
                                          rules: [{
                                            required: checkedValue.indexOf(1)!==-1?true:false, message: formatMessage(messages.msg_number_input),
                                          },{
                                            pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
                                          }],
                                          initialValue:email&&email[0]&&`${email[0].surplus}`
                                        })(
                                          <Input/>
                                        )
                                      }
                                    </FormItem>
                                  </Col>
                                  <Col span={1}>
                                    <div style={{lineHeight: '39px'}}>{formatMessage(messages.msg_strip)}</div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                          </div>
                          <div style={{minHeight: 58}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={6} style={{width: 110, color: 'rgba(0, 0, 0, 0.85)',lineHeight:'40px'}}>{formatMessage(messages.msg_margin_reminder_phone)}：</Col>
                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('emailRemind_phone', {
                                      rules: [{
                                        required: checkedValue.indexOf(1)!==-1?true:false, message: formatMessage(messages.msg_margin_reminder_phone_input),
                                      },{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:email&&email[0]&&email[0].remindPhone[0]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('emailRemind_phone1', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:email&&email[0]&&email[0].remindPhone[1]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                              <Col span={6} style={{width: 120, marginRight: 8}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                >
                                  {
                                    getFieldDecorator('emailRemind_phone2', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:email&&email[0]&&email[0].remindPhone[2]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>

                            </Row>
                          </div>
                          <div style={{minHeight: 40}} className={styles.msgFormItem}>
                            <Row>
                              <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)',lineHeight:'40px'}}>{formatMessage(messages.msg_margin_reminder_email)}：</Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('emailRemind_email', {
                                      rules: [{
                                        required: checkedValue.indexOf(1)!==-1?true:false, message:formatMessage(messages.msg_margin_reminder_email_input),
                                      },{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:email&&email[0]&&email[0].remindMail[0]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12,marginLeft:110,}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('emailRemind_email1', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:email&&email[0]&&email[0].remindMail[1]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                              <Col span={12} style={{width:392,height:40,marginBottom:12,marginLeft:110,}}>
                                <FormItem
                                  className={styles.msgFormItemLabel}
                                  style={{marginBottom:24}}
                                >
                                  {
                                    getFieldDecorator('emailRemind_email2', {
                                      rule:[{
                                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                      }],
                                      initialValue:email&&email[0]&&email[0].remindMail[2]
                                    })(
                                      <Input/>
                                    )
                                  }
                                </FormItem>
                              </Col>
                            </Row>

                          </div>
                        </Checkbox.Group>
                      )
                    }

                  </FormItem>



            </Form>
            <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
              <Button loading={updateLoading} type='primary' onClick={(e) => {
                this.handleSubmit(e);
              }}>{formatMessage(basicMessages.confirm)}</Button>
              <Button className='mrgLf20'
                      onClick={() => {
                        history.goBack(-1);
                      }}
              >{formatMessage(basicMessages.cancel)}</Button>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
