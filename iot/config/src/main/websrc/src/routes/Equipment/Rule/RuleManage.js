import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider, Modal} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";


const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const Search = Input.Search;


@connect(({equipmentRule, loading}) => ({
  equipmentRule,
  loading: loading.effects['equipmentRule/fetch_ruleList_action'],
}))
@injectIntl
@Form.create()
export default class RuleManage extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    const {equipmentRule: {ruleList_params}} = this.props;
    this.loadEquipmentRuleList(ruleList_params);
  };

  loadEquipmentRuleList = (params) => {
    this.props.dispatch({
      type: 'equipmentRule/fetch_ruleList_action',
      payload: params,
    })
  };

  changeTablePage = (pagination) => {
    const {equipmentRule: {ruleList_params}} = this.props;
    const params = {
      ...ruleList_params,
      start: (pagination.current - 1) * ruleList_params.count,
    }
    this.loadEquipmentRuleList(params)
  };

  delRule = (id) => {
    const {equipmentRule: {ruleList_params, ruleList}, intl: {formatMessage}} = this.props;
    const params = {
      id: id,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'equipmentRule/fetch_delRule_action',
          payload: params,
          params: formatParams(ruleList.value, ruleList_params),
        })
      }
    });

  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  //查询条件提交
  handleOk = (e) => {
    const {equipmentRule: {ruleList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...ruleList_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadEquipmentRuleList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentRule: {ruleList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: ruleList_params.count
    }
    this.loadEquipmentRuleList(values);
  };


  render() {
    const {visible} = this.state;
    const {equipmentRule: {ruleList_params, ruleList}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: ruleList_params.count,
      total: ruleList.totalCount,
      current: (ruleList_params.start / ruleList_params.count) + 1,
    };

    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
    };

    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipmentRuleName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: ruleList_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipmentRuleNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('username', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: ruleList_params.username
          })
          (
            <Input placeholder={formatMessage(basicMessages.creatorInput)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: ruleList_params.startTime && moment(ruleList_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('endTime', {
            initialValue: ruleList_params.endTime && moment(ruleList_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const columns = [{
      title: formatMessage(messages.equipmentRuleName),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width: 160,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.equipmentRuleType),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      width: 100,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: <FormattedMessage {...basicMessages.describe} />,
      dataIndex: 'desc',
      key: 'desc',
      className: 'table_row_styles',
      width: 180,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.creator),
      dataIndex: 'username',
      key: 'username',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      width: '250px',
      render: (text, record) => (
        <span>
          <a onClick={()=>{
            this.props.dispatch(routerRedux.push(`/equipment/ruleManage/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons edit={true}/>
          </a>

          <a style={{marginLeft:10}} onClick={()=>{
            this.delRule(record.id)
          }}>
            <Icons deleted={true}/>
          </a>
        </span>
      ),
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            <div>
              <Button type='primary' icon='plus' onClick={() => {
                this.props.dispatch(routerRedux.push('/equipment/ruleManage/add'))
              }}>{formatMessage(messages.equipmentRuleAdd)}</Button>

            </div>

            <div>
              <span className='search' onClick={() => {
                this.setState({
                  visible: true,
                })
              }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
            </div>
          </div>
          <Query
            visible={visible}
            handelCancel={this.handelVisible}
            handleOk={this.handleOk}
            handleReset={this.handleReset}
          >
            {queryForm}
          </Query>
          <Table
            loading={loading}
            rowKey={(record) => record.id}
            dataSource={ruleList && ruleList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
