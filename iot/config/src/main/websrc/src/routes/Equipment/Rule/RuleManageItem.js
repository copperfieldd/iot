import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider, Radio} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';



const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;


@connect(({equipmentRule, loading}) => ({
  equipmentRule,
  loading: loading.effects['equipmentRule/fetch_updRule_action'],
}))
@injectIntl
@Form.create()
export default class RuleManageItem extends Component {
  constructor() {
    super();
    this.state = {
      plugModalVisible: false,
      strategyModalVisible: false,
      filterModalVisible: false,
      status: null,
      type: null,
      checkedFilterValue: [],
      checkedPlugValue: null,
      actionCheckedValue: null,
    }
  };

  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.loadRuleItem(item.id);

  }
  loadRuleItem=(id)=>{
    this.props.dispatch({
      type:'equipmentRule/fetch_ruleItem_action',
      payload:{id:id},
      callback:(res)=>{
        this.setState({
          actionCheckedValue:res.action,
          checkedPlugValue:res.plugin,
          checkedFilterValue:res.filters,

        })

      }
    })
  };

  handleSubmit = (e) => {
    const {form,match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let value = {
          id:item.id,
          ...values
        }
        this.props.dispatch({
          type: 'equipmentRule/fetch_updRule_action',
          payload: value,
        })
      }
    });
  };



  render() {
    const {history, loading,match:{params:{data}},equipmentRule:{ruleItems},intl:{formatMessage}} = this.props;
    const {checkedPlugValue, actionCheckedValue, checkedFilterValue} = this.state;


    const item = JSON.parse(decodeURIComponent(data));
    const ruleItem = ruleItems[item.id];
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
    const {getFieldDecorator} = this.props.form;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
        >
          {/*<Card*/}
            {/*title={<span style={{color: '#3f89e1'}}>修改规则</span>}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.equipmentRuleName)}
                  {...formItemLayout}
                >
                  <span>{item&&item.name}</span>
                </FormItem>


                <FormItem
                  label={formatMessage(messages.equipmentRuleType)}
                  {...formItemLayout}
                >
                  <span>{item&&item.type}</span>
                </FormItem>

                <FormItem
                  label={formatMessage(messages.equipmentFilter)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('filters', {
                    })(
                      <div>
                        {checkedFilterValue && checkedFilterValue ? checkedFilterValue.map((item, index) => {
                            return (
                              <div className={styles.ele_input_style} style={{width: 'auto', display: 'inline-block'}}
                                   key={index}>
                                <span>{item.name}</span>
                              </div>)
                          }
                        ) : null}
                      </div>
                    )
                  }
                </FormItem>


                <FormItem
                  label={formatMessage(messages.equipmentStrategy)}
                  {...formItemLayout}
                >
                  <span>{actionCheckedValue && actionCheckedValue.name}</span>
                </FormItem>

                <FormItem
                  label={formatMessage(messages.equipmentPlug)}
                  {...formItemLayout}
                >

                  <span>{checkedPlugValue && checkedPlugValue.name}</span>

                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  <span>{item&&item.desc}</span>
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.creator)}
                  {...formItemLayout}
                >
                  <span>{item&&item.createUsername}</span>
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.createTime)}
                  {...formItemLayout}
                >
                  <span>{item&&item.createTime}</span>
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.updateTime)}
                  {...formItemLayout}
                >
                  <span>{item&&item.updateTime}</span>
                </FormItem>
              </Form>

            </div>
          {/*</Card>*/}
          <div className='TxTCenter' loading={loading} style={{margin: 30}}>

            <Button
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
