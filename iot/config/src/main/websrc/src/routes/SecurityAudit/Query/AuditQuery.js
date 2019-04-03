import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Icon, Form, Input, DatePicker, Card} from 'antd';
import styles from '../SecurityAudit.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/securityAudit';
import basicMessages from '../../../messages/common/basicTitle';
import ExportModal from "../../../components/ExportModal";

const FormItem = Form.Item;

@connect(({securityAudit, loading}) => ({
  securityAudit,
  loading: loading.effects['securityAudit/fetch_auditQuery_action'],
  exportLoading: loading.effects['securityAudit/fetch_exportExcl_action'],
}))
@injectIntl
@Form.create()
export default class AuditQuery extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }
  };

  componentDidMount() {
    const {securityAudit: {auditQuery_params}} = this.props;
    this.loadAuditQueryList(auditQuery_params)
  }

  loadAuditQueryList = (params) => {
    this.props.dispatch({
      type: 'securityAudit/fetch_auditQuery_action',
      payload: params,
    })
  }

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };

  changeTablePage = (pagination) => {
    const {securityAudit: {auditQuery_params}} = this.props;
    const params = {
      ...auditQuery_params,
      start: (pagination.current - 1) * auditQuery_params.count,
    };
    this.loadAuditQueryList(params)
  };


  handleOk = (e) => {
    const {securityAudit: {auditQuery_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...auditQuery_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadAuditQueryList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {securityAudit: {auditQuery_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: auditQuery_params.count
    };
    this.loadAuditQueryList(values);
  };


  handleExport = (callback) => {
    const {dispatch, form: {validateFields}, securityAudit: {auditQuery_params}} = this.props;
    validateFields((err, values) => {
      if (err) return;
      dispatch({
        type: 'securityAudit/fetch_exportExcl_action',
        payload: {
          ...values,
          ...auditQuery_params,
        },
        callback: callback
      })
    });
  };

  render() {
    const {visible} = this.state;
    const {securityAudit: {auditQuery_params, auditQueryList}, loading, intl: {formatMessage}, exportLoading} = this.props;
    const paginationProps = {
      pageSize: auditQuery_params.count,
      total: auditQueryList.totalCount,
      current: (auditQuery_params.start / auditQuery_params) + 1,
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
          label={formatMessage(basicMessages.applicationName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('appName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: auditQuery_params.appName
          })
          (
            <Input placeholder={formatMessage(basicMessages.applicationNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.username)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('userName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: auditQuery_params.userName
          })
          (
            <Input placeholder={formatMessage(basicMessages.user_input)} style={{width: '100%'}}/>
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
            initialValue: auditQuery_params.type
          })
          (
            <Input placeholder={formatMessage(messages.auditTypeInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.client)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('clientType', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: auditQuery_params.clientType
          })
          (
            <Input placeholder={formatMessage(messages.client_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: auditQuery_params.startTime && moment(auditQuery_params.startTime) || undefined
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
            initialValue: auditQuery_params.endTime && moment(auditQuery_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const columns = [
      {
        title: formatMessage(basicMessages.applicationName),
        dataIndex: 'appName',
        key: 'appName',
        className: 'table_row_styles',

      }, {
        title: formatMessage(messages.userName),
        dataIndex: 'userName',
        key: 'userName',
        className: 'table_row_styles',
      }, {
        title: formatMessage(messages.type),
        dataIndex: 'type',
        key: 'type',
        className: 'table_row_styles',
      }, {
        title: formatMessage(messages.content),
        dataIndex: 'auditCOntent',
        key: 'auditCOntent',
        className: 'table_row_styles',
      }, {
        title: formatMessage(messages.IP),
        dataIndex: 'clientIp',
        key: 'clientIp',
        className: 'table_row_styles',
      }, {
        title: formatMessage(messages.client),
        dataIndex: 'clientType',
        key: 'clientType',
        className: 'table_row_styles',
      }, {
        title: formatMessage(basicMessages.createTime),
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
            <ExportModal loading={exportLoading} handleExport={this.handleExport}
                         text={formatMessage(basicMessages.export)} form={this.props.form}/>
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
            rowKey={record => record.id}
            loading={loading}
            dataSource={auditQueryList && auditQueryList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}

          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
