import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card} from 'antd';
import styles from './Warning.less';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import Query from "../../components/Query";
import {injectIntl} from 'react-intl';
import messages from '../../messages/warning';
import basicMessages from '../../messages/common/basicTitle';

const FormItem = Form.Item;

@connect(({warningList, loading}) => ({
  warningList,
  loading: loading.effects['warningList/fetch_warningList_action'],
  exporting: loading.effects['warningList/fetch_warningExport_action']
}))
@injectIntl
@Form.create()
export default class WarningList extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      selectedRowKeys: [],
    }
  };

  componentDidMount() {
    const {warningList: {warning_params}} = this.props;
    this.loadWarningList(warning_params);
  };

  //加载告警列表
  loadWarningList = (params) => {
    this.props.dispatch({
      type: 'warningList/fetch_warningList_action',
      payload: params,
    })
  };

  //表格分页切换
  changeTablePage = (pagination) => {
    const {warningList: {warning_params}} = this.props;
    const start = warning_params.count * (pagination.current - 1);
    const params = {
      ...warning_params,
      start: start,
    };
    this.loadWarningList(params);
  };


  //导出表格
  exportWarningList = () => {
    const {warningList: {warning_params}} = this.props;
    this.props.dispatch({
      type: 'warning/fetch_warningExport_action',
      payload: {
        ...warning_params,
        excelType: 2,
      }
    })
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };

  handleOk = (e) => {
    const {warningList: {warning_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...warning_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadWarningList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {warningList: {warning_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: warning_params.count
    };
    this.loadWarningList(values);
  };


  render() {
    const {warningList: {warning_params, warningList}, loading, intl: {formatMessage}, exporting} = this.props;
    const {visible, selectedRowKeys} = this.state;

    const paginationProps = {
      pageSize: warning_params.count,
      total: warningList.totalCount,
      current: (warning_params.start / warning_params.count) + 1,
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
            initialValue: warning_params.serviceName
          })
          (
            <Input placeholder={formatMessage(messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.waringName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('alarmName', {
            initialValue: warning_params.alarmName
          })
          (
            <Input placeholder={formatMessage(messages.waringNameInput)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.waringType)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('alarmType', {
            initialValue: warning_params.alarmType
          })
          (
            <Input placeholder={formatMessage(messages.waringTypeInput)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: warning_params.startTime && moment(warning_params.startTime) || undefined
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
            initialValue: warning_params.endTime && moment(warning_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );


    const columns = [{
      title: formatMessage(messages.serviceName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',

    }, {
      title: formatMessage(messages.waringName),
      dataIndex: 'alarmName',
      key: 'alarmName',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.waringType),
      dataIndex: 'alarmType',
      key: 'alarmType',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.waringContent),
      dataIndex: 'alarmData',
      key: 'alarmData',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.waringTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
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
            <Button type='primary' loading={exporting}
                    onClick={this.exportWarningList}>{formatMessage(basicMessages.export)}</Button>

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
            rowKey={record => record.id}
            dataSource={warningList && warningList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
