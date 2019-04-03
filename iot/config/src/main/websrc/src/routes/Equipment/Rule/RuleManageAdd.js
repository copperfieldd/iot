import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, Select, Card,message} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import PlugModal from "./Modal/PlugModal";
import FilterModal from './Modal/FilterModal';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@connect(({equipmentRule, loading}) => ({
  equipmentRule,
  loading: loading.effects['equipmentRule/fetch_addRule_action'],
}))
@injectIntl
@Form.create()
export default class RuleManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      plugModalVisible: false,
      strategyModalVisible: false,
      filterModalVisible: false,
      status:null,
      type:null,
      checkedFilterValue:[],
      checkedPlugValue:[],
      actionCheckedValue:[],
      filterConfig:{},
    }
  };


  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let config = values.filters&&values.filters.map(item=>{
          return{
            filters:[{
              id:item,
              configuration:this.state.config
            }]
          }
        })
        if(!this.state.config||this.state.config.length===0){
          message.error('请选择过滤器配置');
          return
        }
        let params = {
          ...values,
          ...config[0]
        }
        this.props.dispatch({
          type:'equipmentRule/fetch_addRule_action',
          payload:params,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/ruleManage/edit/${encodeURIComponent(JSON.stringify(res))}`));
          }
        })
      }
    });
  };

  handleChange=(value)=>{
    this.setState({
      config:value,
    })
  }

  openPlugModal = () => {
    this.setState({
      plugModalVisible: !this.state.plugModalVisible
    })
  };

  openFilterModal = () => {
    this.setState({
      filterModalVisible: !this.state.filterModalVisible,
      status:1,
      type:1,
    })
  };

  delFilterValues=(e,item)=>{
    const {checkedFilterValue} = this.state;
    checkedFilterValue.splice(checkedFilterValue.findIndex(v => v.id === item.id),1);
    let filterIds = checkedFilterValue.map(item=>{
      return item.id;
    });
    this.setState({
      checkedFilterValue:checkedFilterValue,
      config:null,
    });

    this.props.form.setFieldsValue({filters:filterIds});
  };

  render() {
    const {history,loading,intl:{formatMessage}} = this.props;
    const {plugModalVisible, filterModalVisible,checkedPlugValue,actionCheckedValue,checkedFilterValue,filterConfig} = this.state;
    let checkedFilter = checkedFilterValue&&checkedFilterValue.map(item=>{
      return{
        ...item,
        config:filterConfig&&filterConfig[item.id]
      }
    })
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
    const {getFieldDecorator} = this.props.form;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}

        >
            <div className='mrgTB30' style={{width: 700}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.equipmentRuleName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.equipmentRuleNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                    })(
                      <Input placeholder={formatMessage(messages.equipmentRuleNameInput)}/>
                    )
                  }
                </FormItem>


                <FormItem
                  label={formatMessage(messages.equipmentFilter)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('filters', {
                      rules: [{
                        required: true, message: formatMessage(messages.equipmentFilterSelect),
                      }],
                    })(
                      <div>
                        <Button type={'primary'} onClick={this.openFilterModal}>
                          {formatMessage(messages.equipment_select_filter)}
                        </Button>

                        <div>
                          {checkedFilter&&checkedFilter?checkedFilter.map((item,index)=>{
                              return(
                                <div key={index} className='dlxB'>
                                  <div className={styles.ele_input_style} style={{width:'auto',display: 'inline-block',margin:'0 10px 0 0',lineHeight:'32px',height:32}}>
                                    <span>{item.name}</span>
                                  </div>
                                  <Select
                                    mode="multiple"
                                    style={{ width: 300 }}
                                    placeholder={formatMessage(messages.equipment_select_config)}
                                    onChange={this.handleChange}
                                  >
                                    {item.config&&item.config.map((o,index)=>{
                                      return(
                                        <Option key={index} value={o.value}>{o.name}</Option>
                                      )
                                    })}
                                  </Select>
                                  <Icon onClick={(e) => {
                                    e.stopPropagation();
                                    this.delFilterValues(e, item)
                                  }} style={{lineHeight: '28px', float: 'right'}} type="close"/>
                                </div>
                                  )
                            }
                          ) :null}

                        </div>
                      </div>
                    )
                  }
                </FormItem>



                <FormItem
                  label={formatMessage(messages.equipmentPlug)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('pluginId', {
                      rules: [{
                        required: true, message: formatMessage(messages.equipmentPlugSelect),
                      }],
                    })(
                      <div onClick={this.openPlugModal} className={styles.ele_input_addStype}>
                        <div style={{padding: '0 8px', height: 32, lineHeight: '32px'}}>
                          <span>{checkedPlugValue && checkedPlugValue.name}</span>
                        </div>
                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('desc', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                    })(
                      <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                    )
                  }
                </FormItem>
              </Form>
            </div>
          <div className='TxTCenter' style={{margin: 30}}>
            <Button loading={loading}  type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <FilterModal
            status={1}
            type={0}
            modalVisible={filterModalVisible}
            onCancelModal={this.openFilterModal}
            handleCheckValue={(values) => {
              let filterIds = values.map(item=>{
                return item.id;
              });
              values.map(item=>{
                this.props.dispatch({
                  type:'equipmentRule/fetch_getFilterConfig_action',
                  payload:{id:item.id},
                  callback:(res)=>{
                    this.setState({
                      filterConfig:{
                        ...this.state.filterConfig,
                        [`${item.id}`]:res,
                      }
                    })
                  }
                })
              });

              this.setState({
                checkedFilterValue:values
              });

              this.props.form.setFieldsValue({filters:filterIds})

            }}
          />


          <PlugModal
            status={1}
            modalVisible={plugModalVisible}
            onCancelModal={this.openPlugModal}
            handleCheckValue={(values) => {
              this.setState({
                checkedPlugValue:values
              });
              this.props.form.setFieldsValue({pluginId:values.id})
            }}
          />


        </Card>
      </PageHeaderLayout>
    );
  }
}
