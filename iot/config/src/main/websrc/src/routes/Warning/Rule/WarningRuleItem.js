import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Icon, Form, Input, Select, Card, Row, Col} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
import * as routerRedux from "react-router-redux";


@connect(({warning, warningRule, loading}) => ({
  warning,
  warningRule,
  loading: loading.effects['warning/fetch_addWarningRuleList_action'],
}))
@injectIntl
@Form.create()
export default class WarningRuleItem extends Component {
  constructor() {
    super();
    this.state = {
      phoneConfigVisible: false,
      addressConfigVisible: false,
      modalVisible: false,
      warningType: [],
      serviceConfig: [],
      addressValue: null,//通知策略源中邮箱配置
      phoneValue: null,//通知策略源中的短信配置
      notifyId: null,
      emailChecked: false,
      messageChecked: false,
      notifyIdsChecked: false,
      checkedStrategy: [],
    }
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type: 'warningRule/fetch_warningRuleItem_action',
      payload: {id: item.id},
      callback: (res) => {

      }
    })

  }

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


  handleSubmit = (e) => {
    const {form, warningRule: {warningRuleItems}, match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const ruleItem = warningRuleItems[item.id];

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let value = {
          ...ruleItem,
          ...values,
          ...this.state.addressValue,
          ...this.state.phoneValue,
          ...this.state.notifyId,
        };
        this.props.dispatch({
          type: 'warning/fetch_updWarningRuleList_action',
          payload: value,
        });
      }
    });
  };


  render() {
    const {loading, warningRule: {warningRuleItems}, match: {params: {data}}, intl: {formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const ruleItem = warningRuleItems[item.id];
    const {getFieldDecorator} = this.props.form;
    const {} = this.state;

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
                    }],
                    initialValue: item && item.ruleName
                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.serviceName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('serviceName', {
                    rules: [{
                      required: true, message: formatMessage(messages.serviceNameSelect),
                    }],
                    initialValue: ruleItem && ruleItem.serviceName,
                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.waringType)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('serviceName', {
                    rules: [{
                      required: true, message: formatMessage(messages.waringTypeInput),
                    }],
                    initialValue: ruleItem && ruleItem.alarmType && ruleItem.alarmType.alarmName,
                  })(
                    <Input disabled/>
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
                  }],
                  initialValue: ruleItem && ruleItem.alarmContent
                })(
                  <TextArea disabled rows={4}/>
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
                  initialValue: ruleItem && ruleItem.contentMatchType
                })(
                  <Select disabled>
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

                <Row>
                  <Col span={4}>
                    <span>{formatMessage(basicMessages.email)}</span>
                  </Col>
                  <Col span={20}>
                    {
                      ruleItem && ruleItem.emails.length > 0 ? ruleItem.emails.map((i, index) => {
                        return (
                          <Input key={index} defaultValue={i} disabled style={{marginTop: 10}}/>
                        )
                      }) : <Input disabled style={{marginTop: 10}}/>
                    }
                  </Col>
                  <Col span={4} style={{marginTop: 5}}>
                    <span style={{marginTop: 10}}>{formatMessage(basicMessages.message)}</span>
                  </Col>
                  <Col span={20}>
                    {
                      ruleItem && ruleItem.messages.length > 0 ? ruleItem.messages.map((i, index) => {
                        return (
                          <Input key={index} defaultValue={i} disabled style={{marginTop: 10}}/>
                        )
                      }) : <Input disabled style={{marginTop: 10}}/>
                    }
                    <div></div>
                  </Col>
                  <Col span={4} style={{marginTop: 5}}>
                    <span style={{marginTop: 10}}>{formatMessage(basicMessages.api)}</span>
                  </Col>
                  <Col span={20}>
                    <Input defaultValue={ruleItem && ruleItem.notify && ruleItem.notify.serviceName} disabled
                           style={{marginTop: 10}}/>
                  </Col>
                </Row>
              </FormItem>
            </Form>
          </div>

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button
              onClick={() => {
                this.props.dispatch(routerRedux.push(`/warning/warningRule`));
              }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
