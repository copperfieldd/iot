import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card, Modal} from 'antd';
import styles from '../SecurityAudit.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/securityAudit';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;


@connect(({securityAudit, loading}) => ({
  securityAudit,
  loading: loading.effects['securityAudit/fetch_getTypeList_action'],
}))
@injectIntl
@Form.create()
export default class CountriesInfo extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {securityAudit: {typeList_params}} = this.props;
    this.loadAuditType(typeList_params);
  }

  loadAuditType = (params) => {
    this.props.dispatch({
      type: 'securityAudit/fetch_getTypeList_action',
      payload: params,
    })
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };

  changeTablePage = (pagination) => {
    const {securityAudit: {typeList_params}} = this.props;
    const params = {
      ...typeList_params,
      start: (pagination.current - 1) * typeList_params.count,
    };
    this.loadAuditType(params)
  };


  delTypeList = (id) => {
    const {securityAudit: {typeList_params, typeList}, intl: {formatMessage}} = this.props;
    const params = {
      ids: id,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'securityAudit/fetch_delType_action',
          payload: params,
          params: formatParams(typeList.value, typeList_params),
        })
      }
    });
  };

  handleOk = (e) => {
    const {securityAudit: {typeList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...typeList_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadAuditType(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {securityAudit: {typeList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: typeList_params.count
    };
    this.loadAuditType(values);
  };


  render() {
    const {visible} = this.state;
    const {securityAudit: {typeList_params, typeList}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: typeList_params.count,
      total: typeList.totalCount,
      current: (typeList_params.start / typeList_params.count) + 1
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
          label={formatMessage(messages.auditName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: typeList_params.name
          })
          (
            <Input placeholder={formatMessage(messages.auditNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('type', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: typeList_params.type
          })
          (
            <Input placeholder={formatMessage(messages.auditTypeInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: typeList_params.startTime && moment(typeList_params.startTime) || undefined
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
            initialValue: typeList_params.endTime && moment(typeList_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );

    const columns = [{
      title: formatMessage(messages.auditName),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width: 200,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )

    }, {
      title: formatMessage(messages.type),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      width: 200,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'desc',
      key: 'desc',
      className: 'table_row_styles',
      width: 250,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/securityAudit/auditType/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.delTypeList(record.id)
          }}>
            <Icons deleted={true}/>
          </a>
        </span>
      )
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
            <Button type='primary' icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push('/securityAudit/auditType/add'))
            }}>{formatMessage(messages.auditAddType)}</Button>

            <div>
               <span className='search' onClick={() => {
                 this.setState({
                   visible: true,
                 })
               }}><Icon className='query_icon' type="search"/>
                 {formatMessage(basicMessages.filter)}
               </span>
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
            rowKey={record => record.id}
            dataSource={typeList && typeList.value}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
