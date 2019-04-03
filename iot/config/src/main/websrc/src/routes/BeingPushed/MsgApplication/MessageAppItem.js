import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Input, Select, Checkbox, Row, Col} from 'antd';
import styles from '../BeingPushed.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import messages from "../../../messages/bushing";
import basicMessages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const TextArea = Input.TextArea;


@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_applicationItemByappId_action'],
}))
@injectIntl
@Form.create()
export default class MsgTenantItem extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentDidMount() {
    const {match:{params:{id}},form} = this.props;
    this.props.dispatch({
      type:'msgTenant/fetch_applicationItemByAppId_action',
      payload:{
        applicationId:id
      }
    })

  };

  changeVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };



  render() {
    const {history,match:{params:{data}},loading,msgTenant:{applicationItemByAppId},intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    let pushType = applicationItemByAppId&&applicationItemByAppId.push;

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

          <div className='TxTCenter'  style={{width:820,margin:'30px auto'}}>
            <h4 style={{textAlign:'center',color:'#3a87e4'}}>{formatMessage(basicMessages.application_information)}</h4>
            <Form>
              <FormItem
                label={formatMessage(basicMessages.applicationName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true,
                    },],
                    initialValue: applicationItemByAppId && applicationItemByAppId.name
                  })(
                    <Input disabled />
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.contacts)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('contactName', {
                    rules: [{
                      required: true,
                    }],
                    initialValue:applicationItemByAppId&&applicationItemByAppId.contactName
                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.telephone)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('contactPhone', {
                    rules: [{
                      required: true,
                    }],
                    initialValue:applicationItemByAppId&&applicationItemByAppId.contactPhone
                  })(
                    <Input disabled/>
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
                      required: true,
                    }],
                    initialValue:applicationItemByAppId&&applicationItemByAppId.contactMail
                  })(
                    <Input disabled/>
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
                      required: true,
                    }],
                    initialValue:applicationItemByAppId&&applicationItemByAppId.applicationInfo
                  })(
                    <TextArea rows={4} disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.msg_push_type)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('type', {

                  })(
                    <div style={{textAlign:"left"}}>
                      {
                        pushType&&pushType.map((item,index)=>{
                          if(item.type===0){
                            return(
                              <div key={index}>
                                <div>{formatMessage(messages.msg_msg_push)}</div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row gutter={8}>
                                    <Col span={12}>
                                      <Row>
                                        <Col span={14}>
                                          <FormItem
                                            label={formatMessage(messages.msg_international_number)}
                                            {...formItemLayout5}
                                          >
                                            {
                                              getFieldDecorator('international_number', {
                                                initialValue:item.internationalNumber
                                              })(
                                                <Input disabled/>
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
                                              getFieldDecorator('international_surplus', {
                                                initialValue:item.internationalSurplus
                                              })(
                                                <Input disabled/>
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
                                              getFieldDecorator('international_price', {
                                                initialValue:item.internationalPrice
                                              })(
                                                <Input disabled/>
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
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
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
                                                initialValue:item.number
                                              })(
                                                <Input disabled/>
                                              )
                                            }

                                          </FormItem>
                                        </Col>
                                        <Col span={10}>
                                          <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}
                                          <span style={{fontSize:12,color:'#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span></div>
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
                                                initialValue:item.surplus
                                              })(
                                                <Input disabled/>
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
                                                initialValue:item.price
                                              })(
                                                <Input disabled/>
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
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)'}}>{formatMessage(messages.msg_margin_reminder_phone)}：</Col>
                                    {
                                      item.remindPhone.map((c,i)=>{
                                        return(
                                          <Col key={i} span={6} style={{width:120,marginRight:8}}>
                                            <FormItem
                                              className={styles.msgFormItemLabel}
                                            >
                                              {
                                                getFieldDecorator('msgRemind_phone'+i, {
                                                  initialValue:c&&c
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      })
                                    }
                                  </Row>
                                </div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)'}}>{formatMessage(messages.msg_margin_reminder_email)}：</Col>

                                    {item.remindMail.map((o,i)=>{
                                      if(i===0){
                                        return(
                                          <Col key={i} span={12} style={{width:392,height:40,marginBottom:12}}>
                                            <FormItem
                                              className={styles.msgFormItemLabel}
                                              style={{marginBottom:24}}
                                            >
                                              {
                                                getFieldDecorator('msgRemind_mail'+i, {
                                                  initialValue:o&&o
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      }else{
                                        return(
                                          <Col key={i} span={12} style={{width:392,marginLeft:110,height:40,marginBottom:12}}>
                                            <FormItem
                                              style={{width:392}}
                                            >
                                              {
                                                getFieldDecorator('msgRemind_mail'+i, {
                                                  initialValue:o&&o
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      }
                                    })}
                                  </Row>
                                </div>
                              </div>

                            )
                          }else if(item.type===1){
                            return(
                              <div key={index}>
                                <div>{formatMessage(messages.msg_email_push)}</div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={15}>
                                      <Row>
                                        <Col span={13}>
                                          <FormItem
                                            label={formatMessage(messages.msg_number)}
                                            {...formItemLayout1}
                                          >
                                            {
                                              getFieldDecorator('mailNumber', {
                                                initialValue:item.number
                                              })(
                                                <Input disabled/>
                                              )
                                            }

                                          </FormItem>
                                        </Col>
                                        <Col span={11}>
                                          <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}
                                          <span style={{fontSize:12,color:'#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span></div>
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
                                              getFieldDecorator('mailSurplus', {
                                                initialValue:item.number
                                              })(
                                                <Input disabled/>
                                              )
                                            }
                                          </FormItem>
                                        </Col>
                                        <Col span={1}>
                                          <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}</div>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>

                                </div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)'}}>{formatMessage(messages.msg_margin_reminder_phone)}：</Col>
                                    {
                                      item.remindPhone.map((c,i)=>{
                                        return(
                                          <Col key={i} span={6} style={{width:120,marginRight:8}}>
                                            <FormItem
                                              className={styles.msgFormItemLabel}
                                            >
                                              {
                                                getFieldDecorator('mailRemind_phone'+i, {
                                                  initialValue:c&&c
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      })
                                    }
                                  </Row>
                                </div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)'}}>{formatMessage(messages.msg_margin_reminder_email)}：</Col>
                                    {item.remindMail.map((o,i)=>{
                                      if(i===0){
                                        return(
                                          <Col key={i} span={12} style={{width:392,height:40,marginBottom:12}}>
                                            <FormItem
                                              className={styles.msgFormItemLabel}
                                              style={{marginBottom:24}}
                                            >
                                              {
                                                getFieldDecorator('mailRemind_mail'+i, {
                                                  initialValue:o&&o
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      }else{
                                        return(
                                          <Col key={i} span={12} style={{width:392,marginLeft:110,height:40,marginBottom:12}}>
                                            <FormItem
                                              style={{width:392}}
                                            >
                                              {
                                                getFieldDecorator('mailRemind_mail'+i, {
                                                  initialValue:o&&o
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      }
                                    })}
                                  </Row>
                                </div>
                              </div>
                            )
                          }else{
                            return(
                              <div key={index}>
                                <div>{formatMessage(messages.msg_app_push)}</div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
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
                                                initialValue:item.number
                                              })(
                                                <Input disabled/>
                                              )
                                            }

                                          </FormItem>
                                        </Col>
                                        <Col span={11}>
                                          <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)} 
                                          <span style={{fontSize:12,color:'#f66000'}}>{formatMessage(messages.msg_no_restriction)}</span></div>
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
                                                initialValue:item.surplus
                                              })(
                                                <Input disabled/>
                                              )
                                            }
                                          </FormItem>
                                        </Col>
                                        <Col span={1}>
                                          <div style={{lineHeight:'39px'}}>{formatMessage(messages.msg_strip)}</div>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>

                                </div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)'}}>{formatMessage(messages.msg_margin_reminder_phone)}：</Col>
                                    {
                                      item.remindPhone.map((c,i)=>{
                                        return(
                                          <Col key={i} span={6} style={{width:120,marginRight:8}}>
                                            <FormItem
                                              className={styles.msgFormItemLabel}
                                            >
                                              {
                                                getFieldDecorator('appRemind_phone'+i, {
                                                  initialValue:c&&c
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      })
                                    }
                                  </Row>
                                </div>
                                <div style={{minHeight:40}} className={styles.msgFormItem}>
                                  <Row>
                                    <Col span={6} style={{width:110,color:'rgba(0, 0, 0, 0.85)'}}>{formatMessage(messages.msg_margin_reminder_email)}：</Col>

                                    {item.remindMail.map((o,i)=>{
                                      if(i===0){
                                        return(
                                          <Col key={i} span={12} style={{width:392,height:40,marginBottom:12}}>
                                            <FormItem
                                              className={styles.msgFormItemLabel}
                                              style={{marginBottom:24}}
                                            >
                                              {
                                                getFieldDecorator('appRemind_mail'+i, {
                                                  initialValue:o&&o
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      }else{
                                        return(
                                          <Col key={i} span={12} style={{width:392,marginLeft:110,height:40,marginBottom:12}}>
                                            <FormItem
                                              style={{width:392}}
                                            >
                                              {
                                                getFieldDecorator('appRemind_mail'+i, {
                                                  initialValue:o&&o
                                                })(
                                                  <Input disabled/>
                                                )
                                              }
                                            </FormItem>
                                          </Col>
                                        )
                                      }
                                    })}
                                  </Row>
                                </div>
                              </div>

                            )
                          }
                        })
                      }
                    </div>
                  )
                }

              </FormItem>
            </Form>

            <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
              <Button
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
