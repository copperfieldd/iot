import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card, Modal} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@injectIntl
@connect(({warningService, loading}) => ({
  warningService,
  loading: loading.effects['warningService/fetch_warningServiceList_action'],
}))
@Form.create()
export default class ServiceConfig extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {warningService: {warningService_params}} = this.props;
    this.loadWarningService(warningService_params);
  };

  loadWarningService = (params) => {
    this.props.dispatch({
      type: "warningService/fetch_warningServiceList_action",
      payload: params,
    })
  };

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  changeTablePage = (pagination) => {
    const {warningService: {warningService_params}} = this.props;
    const start = (pagination.current - 1) * warningService_params.count;
    const params = {
      ...warningService_params,
      start: start,
    };
    this.loadWarningService(params);
  };


  delServiceConfigList = (id) => {
    const {warningService: {warningService_params, warningServiceList}, intl: {formatMessage}} = this.props;
    const params = {
      id: id,
      flag: true,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'warningService/fetch_delWarningService_action',
          payload: params,
          params: formatParams(warningServiceList.value, warningService_params),
        })
      }
    });
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };


  handleOk = (e) => {
    const {warningService: {warningService_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...warningService_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadWarningService(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {warningService: {warningService_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: warningService_params.count
    };
    this.loadWarningService(values);
  };


  render() {
    const {warningService: {warningService_params, warningServiceList}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      total: warningServiceList.totalCount,
      pageSize: warningService_params.count,
      current: (warningService_params.start / warningService_params.count) + 1,
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
          label={formatMessage(messages.serviceName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: warningService_params.serviceName
          })
          (
            <Input placeholder={formatMessage(messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: warningService_params.startTime && moment(warningService_params.startTime) || undefined
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
            initialValue: warningService_params.endTime && moment(warningService_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );


    const {visible} = this.state;
    const columns = [{
      title: formatMessage(messages.serviceName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 200,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{width: 200}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'key_access',
      dataIndex: 'accessKey',
      key: 'accessKey',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'serviceDesc',
      key: 'serviceDesc',
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
      width: 200,
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/warning/serviceConfig/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
             <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.delServiceConfigList(record.id)
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
              this.props.dispatch(routerRedux.push('/warning/serviceConfig/add'))
            }}>{formatMessage(messages.serviceAdd)}</Button>

            <div>
               <span className='search' onClick={() => {
                 this.setState({
                   visible: true,
                 })
               }}><Icon className='query_icon' type="search"/> {formatMessage(basicMessages.filter)}</span>
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
            rowKey={record => record.id}
            dataSource={warningServiceList && warningServiceList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
