import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Icon, Form, Input, Select, Card, Checkbox, Row, Col,} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ConfigAddressModal from './Modal/ConfigAddressModal';
import ConfigMessageModal from './Modal/ConfigMessageModal';
import StrategyServiceModal from '../Modal/StrategyServiceModal';
import RuleServiceConfigModal from "../Modal/RuleServiceConfigModal";
import RuleWarningTypeConfigModal from "../Modal/RuleWarningTypeConfigModal";
import * as routerRedux from "react-router-redux";


import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


@connect(({warning, warningRule, loading}) => ({
  warning,
  warningRule,
  loading: loading.effects['warningRule/fetch_addWarningRuleList_action'],
}))
@injectIntl
@Form.create()
export default class WarningRuleAdd extends Component {
  constructor() {
    super();
    this.state = {
      phoneConfigVisible: false,
      addressConfigVisible: false,
      modalVisible: false,
      alarmType: null,
      serviceConfig: [],
      addressValue: null,//通知策略源中邮箱配置
      phoneValue: null,//通知策略源中的短信配置
      notifyId: null,
      emailChecked: false,
      messageChecked: false,
      notifyIdsChecked: false,
    }
  };

  componentWillMount() {
  };

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  handleChange = (value) => {
  };
  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  changeModalTypeVisible = () => {
    this.setState({
      modalTypeVisible: !this.state.modalTypeVisible,
    })
  };

  changeModalStrategyVisible = () => {
    this.setState({
      modalStrategyVisible: !this.state.modalStrategyVisible,
    })
  };


  onChange = (e) => {
    let email = e.filter(o => {
      if (o === 'A') {
        return true
      } else {
        return false
      }
    });
    let message = e.filter(o => {
      if (o === 'B') {
        return true
      } else {
        return false
      }
    });
    let notifyIds = e.filter(o => {
      if (o === 'C') {
        return true
      } else {
        return false
      }
    });
    this.setState({
      emailChecked: email,
      messageChecked: message,
      notifyIdsChecked: notifyIds
    })
  };


  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let value = {
          ...values,
          ...this.state.addressValue,
          ...this.state.phoneValue,
          ...this.state.notifyId,
        };
        this.props.dispatch({
          type: 'warningRule/fetch_addWarningRuleList_action',
          payload: value,
          callback: (res) => {
            this.props.dispatch(routerRedux.push(`/warning/warningRule`));
          }
        });
      }
    });
  };


  render() {
    const {history, loading, intl: {formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {
      phoneConfigVisible,
      addressConfigVisible,
      modalVisible,
      modalTypeVisible,
      alarmType, serviceConfig, modalStrategyVisible, emailChecked, messageChecked, notifyIdsChecked
    } = this.state;

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
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >

          <div className='mrgTB30' style={{width: 600}}>
            <Form>
              <FormItem
                label={formatMessage(messages.ruleName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('ruleName', {
                    rules: [{
                      required: true, message: formatMessage(messages.ruleNameInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.ruleNameInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.serviceName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('accessKey', {
                    rules: [{
                      required: true, message: formatMessage(messages.serviceNameSelect),
                    }],
                  })(
                    <div onClick={this.changeModalVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                      <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                        <span>{serviceConfig && serviceConfig.serviceName}</span>
                      </div>
                      <Input defaultValue={serviceConfig && serviceConfig.serviceName} style={{display: 'none'}}/>
                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.waringType)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('alarmTypeId', {
                    rules: [{
                      required: true, message: formatMessage(messages.waringTypeInput),
                    }],
                  })(
                    <div onClick={this.changeModalTypeVisible} className={styles.ele_input_addStype}
                         style={{height: 35}}>
                      <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                        <span>{alarmType && alarmType.alarmName}</span>
                      </div>
                      <Input defaultValue={alarmType && alarmType.alarmName} style={{display: 'none'}}/>
                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.matchingContent)}
                {...formItemLayout}
              >
                {getFieldDecorator('alarmContent', {
                  rules: [{
                    required: true, message: formatMessage(messages.matchingContentInput),
                  }, {
                    max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                  }],
                })(
                  <TextArea rows={4}/>
                )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.matchingRules)}
                {...formItemLayout}
              >
                {getFieldDecorator('contentMatchType', {
                  rules: [{
                    required: true, message: formatMessage(messages.matchingRulesSelect),
                  }],
                })(
                  <Select>
                    <Option value={0}>{formatMessage(basicMessages.completely)}</Option>
                    <Option value={1}>{formatMessage(basicMessages.vague)}</Option>
                  </Select>
                )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.notificationSource)}
                {...formItemLayout}
              >
                <Checkbox.Group style={{width: '100%'}} onChange={this.onChange}>
                  <Row>
                    <Col span={24}><Checkbox value="A">{formatMessage(basicMessages.email)} </Checkbox>
                      <span onClick={() => {
                        if (emailChecked[0] === 'A') {
                          this.setState({
                            addressConfigVisible: true
                          })
                        }
                      }} className={styles.role_config}>{formatMessage(basicMessages.config_address)}</span>
                    </Col>
                    <Col span={24}><Checkbox value="B">{formatMessage(basicMessages.message)} </Checkbox>
                      <span onClick={() => {
                        if (messageChecked[0] === 'B') {
                          this.setState({
                            phoneConfigVisible: true
                          })
                        }
                      }} className={styles.role_config}>{formatMessage(basicMessages.config_number)}</span>
                    </Col>

                    <Col span={24}><Checkbox value="C">{formatMessage(basicMessages.api)} </Checkbox>
                      <span onClick={() => {
                        if (notifyIdsChecked[0] === 'C') {
                          this.changeModalStrategyVisible()
                        }
                      }} className={styles.role_config}>{formatMessage(basicMessages.config_interface)}</span>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </FormItem>
            </Form>
          </div>
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>

        <RuleServiceConfigModal
          modalVisible={modalVisible}
          onCancelModal={this.changeModalVisible}
          handleCheckValue={(value) => {
            this.props.form.setFieldsValue({accessKey: value.accessKey})
            this.setState({
              serviceConfig: value
            })
          }}
        />

        <StrategyServiceModal
          modalVisible={modalStrategyVisible}
          onCancelModal={this.changeModalStrategyVisible}
          handleCheckValue={(value) => {
            this.setState({
              notifyId: {notifyId: value.id}
            })
          }}
        />

        <RuleWarningTypeConfigModal
          modalVisible={modalTypeVisible}
          onCancelModal={this.changeModalTypeVisible}
          handleCheckValue={(value) => {
            this.props.form.setFieldsValue({alarmTypeId: value.id})
            this.setState({
              alarmType: value
            })
          }}
        />


        <ConfigAddressModal
          title={formatMessage(basicMessages.config_address)}
          visible={addressConfigVisible}
          onCancel={() => {
            this.setState({
              addressConfigVisible: false
            })
          }}
          handleSubmitData={(res) => {
            this.setState({
              addressValue: res
            })
          }}
        />
        <ConfigMessageModal
          title={formatMessage(basicMessages.config_number)}
          visible={phoneConfigVisible}
          onCancel={() => {
            this.setState({
              phoneConfigVisible: false
            })
          }}
          handleSubmitData={(res) => {
            this.setState({
              phoneValue: res
            });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
