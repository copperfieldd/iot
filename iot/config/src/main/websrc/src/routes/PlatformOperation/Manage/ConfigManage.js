import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Modal, Input, DatePicker} from 'antd';
import styles from '../PaltformOperation.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_platformConfigList_action'],
}))
@injectIntl
@Form.create()
export default class ConfigManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {platformOperation: {config_params}} = this.props;
    this.loadConfigList(config_params);
  };

  loadConfigList = (params) => {
    this.props.dispatch({
      type: 'platformOperation/fetch_platformConfigList_action',
      payload: params,
    })
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  changeTablePage = (pagination) => {
    const {platformOperation: {config_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...config_params,
      start: start,
    };
    this.loadConfigList(params);
  };

  delConfigList = (id) => {
    const {platformOperation: {config_params, platformConfigList}, intl: {formatMessage}} = this.props;
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
          type: 'platformOperation/fetch_delConfigFile_action',
          payload: params,
          params: formatParams(platformConfigList.list, config_params),
        })
      }
    });

  };


  handleOk = (e) => {
    const {platformOperation: {config_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...config_params,
          start: 0,
          filter: {
            configFile: fieldsValue.configFile,
            serviceName: fieldsValue.serviceName,
            updateTime: {
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          },
        };
        this.loadConfigList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {platformOperation: {config_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: config_params.count
    };
    this.loadConfigList(values);
  };


  render() {
    const {visible} = this.state;
    const {platformOperation: {platformConfigList, config_params}, intl: {formatMessage}, loading} = this.props;
    //分页
    const paginationProps = {
      pageSize: config_params.count,
      total: platformConfigList.totalCount,
      current: (config_params.start / config_params.count) + 1,
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
          label={formatMessage(messages.fileName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('configFile', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: config_params.filter && config_params.filter.configFile
          })
          (
            <Input placeholder={formatMessage(messages.fileNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.serviceName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: config_params.filter && config_params.filter.serviceName
          })
          (
            <Input placeholder={formatMessage(messages.serviceNameInput)}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: config_params.filter && config_params.filter.updateTime && config_params.filter.updateTime.startTime && moment(config_params.filter.updateTime.startTime) || undefined
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
            initialValue: config_params.filter && config_params.filter.updateTime && config_params.filter.updateTime.endTime && moment(config_params.filter.updateTime.endTime) || undefined

          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );


    const columns = [{
      title: formatMessage(messages.fileName),
      dataIndex: 'configFile',
      key: 'configFile',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{width: 180}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(messages.serviceName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{width: 180}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/platformOperation/configManage/edit/${(record.id)}`));
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.delConfigList(record.id)
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
            <Button type='primary' icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push('/platformOperation/configManage/add'))
            }}>{formatMessage(messages.addConfigFile)}</Button>

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
            rowKey={(record, index) => record.id}
            dataSource={platformConfigList && platformConfigList.list}
            columns={columns}
            onChange={this.changeTablePage}
            pagination={paginationProps}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
