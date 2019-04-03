import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../PayManage.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";

import {injectIntl} from 'react-intl';
import messages from '../../../messages/pay';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@connect(({payManage, loading}) => ({
  payManage,
  loading: loading.effects['payManage/fetch_applicationList_action'],
}))
@injectIntl
@Form.create()
export default class ApplicationList extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {payManage: {application_params}} = this.props;
    this.loadApplicationList(application_params);
  }

  loadApplicationList = (params) => {
    this.props.dispatch({
      type: 'payManage/fetch_applicationList_action',
      payload: params,
    })
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  changeStatus = (record) => {
    const {payManage: {application_params}} = this.props;

    if (record.status === 0) {
      this.props.dispatch({
        type: 'payManage/fetch_updApplicationStatus_action',
        payload: {
          appId: record.appId,
          status: 1
        },
        params: application_params
      })
    } else {
      this.props.dispatch({
        type: 'payManage/fetch_updApplicationStatus_action',
        payload: {
          appId: record.appId,
          status: 0
        },
        params: application_params
      })
    }
  };


  delApp = (id) => {
    const {payManage: {application_params, applicationList}, intl: {formatMessage}} = this.props;
    const params = {
      appId: id,
      status: 2,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'payManage/fetch_updApplicationStatus_action',
          payload: params,
          params: formatParams(applicationList.list, application_params),
        })
      }
    });
  };

  changeTablePage = (pagination) => {
    const {payManage: {application_params}} = this.props;
    const params = {
      ...application_params,
      start: (pagination.current - 1) * application_params.count,
    };
    this.loadApplicationList(params)
  };


  handleOk = (e) => {
    const {payManage: {application_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...application_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadApplicationList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {payManage: {application_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: application_params.count
    };
    this.loadApplicationList(values);
  };


  render() {
    const {visible} = this.state;
    const {payManage: {applicationList, application_params}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: application_params.count,
      total: applicationList.totalCount,
      current: (application_params.start / application_params.count) + 1,
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
          {getFieldDecorator('name', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: application_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.applicationNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.contacts)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('leadName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: application_params.leadName
          })
          (
            <Input placeholder={formatMessage(basicMessages.contactsInput)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: application_params.startTime && moment(application_params.startTime) || undefined
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
            initialValue: application_params.endTime && moment(application_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const columns = [{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'AppID',
      dataIndex: 'appId',
      key: 'appId',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(messages.appKey),
      dataIndex: 'secret',
      key: 'secret',
      className: 'table_row_styles',
      width: 150,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'describe',
      key: 'describe',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.contacts),
      dataIndex: 'leadName',
      key: 'leadName',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.telephone),
      dataIndex: 'phone',
      key: 'phone',
      className: 'table_row_styles',
      width: 110,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{display: 'block'}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      width: 140,
      render: (text, record) => (
        <span>
           <a onClick={() => {
             this.changeStatus(record)
           }}>
            <Icons stop={record.status === 0} recovery={record.status !== 0}/>
          </a>

          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/payManage/applicationList/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}
          >
            <Icons edit={true}/>
          </a>

           <a style={{marginLeft: 10}} onClick={() => {
             this.delApp(record.appId)
           }}
           >
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
              this.props.dispatch(routerRedux.push('/payManage/applicationList/add'))
            }}>{formatMessage(messages.appNew)}</Button>
            <div></div>
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
            dataSource={applicationList && applicationList.list}
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
