import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Modal, Input, DatePicker, Select} from 'antd';
import styles from '../PaltformOperation.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";


import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;
const Option = Select.Option;


@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_getDemoConfigList_action'],
}))
@injectIntl
@Form.create()
export default class CountriesInfo extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    const {platformOperation: {demo_params}} = this.props;
    this.loadDemoConfigList(demo_params);
  };

  loadDemoConfigList = (params) => {
    this.props.dispatch({
      type: 'platformOperation/fetch_getDemoConfigList_action',
      payload: params,
    })
  };

  changeTablePage = (pagination) => {
    const {platformOperation: {demo_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...demo_params,
      start: start,
    };
    this.loadDemoConfigList(params);
  };


  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  delConfigList = (id) => {
    const {platformOperation: {demo_params, demoConfigList}, intl: {formatMessage}} = this.props;
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
          type: 'platformOperation/fetch_delConfigDemo_action',
          payload: params,
          params: formatParams(demoConfigList.list, demo_params),
        })
      }
    });
  };

  changeDemoManageStatus = (record) => {
    const {platformOperation: {demo_params}} = this.props;
    this.props.dispatch({
      type: 'platformOperation/fetch_changeConfigDemoStatus_action',
      payload: {
        id: record.id,
        serviceValue: record.serviceValue === 1 ? 0 : 1,
      },
      params: demo_params,
    })
  };


  handleOk = (e) => {
    const {platformOperation: {demo_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...demo_params,
          start: 0,
          filter: {
            serviceName: fieldsValue.serviceName,
            serviceHost: fieldsValue.serviceHost,
            servicePort: fieldsValue.servicePort,
            serviceValue: fieldsValue.serviceValue,
            createTime: {
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          }

        };
        this.loadDemoConfigList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {platformOperation: {demo_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: demo_params.count,
    }
    this.loadDemoConfigList(values);
  };


  render() {
    const {platformOperation: {demoConfigList, demo_params}, loading, intl: {formatMessage}} = this.props;
    //分页
    const paginationProps = {
      pageSize: demo_params.count,
      total: demoConfigList.totalCount,
      current: (demo_params.start / demo_params.count) + 1,
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
    //服务名称、访问地址、端口号、状态、
    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.serviceName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: demo_params.filter && demo_params.filter.serviceName
          })
          (
            <Input placeholder={formatMessage(messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.accessAddress)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceHost', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: demo_params.filter && demo_params.filter.serviceHost
          })
          (
            <Input placeholder={formatMessage(messages.accessAddressInput)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.port)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('servicePort', {
            rules: [{
              pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
            }],
            initialValue: demo_params.filter && demo_params.filter.servicePort
          })
          (
            <Input placeholder={formatMessage(basicMessages.InputNum)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.status)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceValue', {
            initialValue: demo_params.filter && demo_params.filter.serviceValue
          })
          (
            <Select placeholder={formatMessage(basicMessages.select_status)}>
              <Option value={0}>{formatMessage(basicMessages.normal)}</Option>
              <Option value={1}>{formatMessage(basicMessages.suspend)}</Option>
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: demo_params.filter && demo_params.filter.createTime && demo_params.filter.createTime.startTime && moment(demo_params.filter.createTime.startTime) || undefined
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
            initialValue: demo_params.filter && demo_params.createTime && demo_params.filter.createTime.endTime && moment(demo_params.filter.createTime.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const {visible} = this.state;
    const columns = [{
      title: formatMessage(messages.serviceName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width:200,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.accessAddress),
      dataIndex: 'serviceHost',
      key: 'serviceHost',
      className: 'table_row_styles',
      width: 180,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span style={{width: 180}}>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.port),
      dataIndex: 'servicePort',
      key: 'servicePort',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.status),
      dataIndex: 'serviceValue',
      key: 'serviceValue',
      className: 'table_row_styles',
      render: (text, record) => {
        return (
          text === 0 ? <span>{formatMessage(basicMessages.normal)}</span> :
            <span>{formatMessage(basicMessages.suspend)}</span>
        )
      }
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          {
            record.serviceValue === 0 ?
              <a onClick={() => {
                this.changeDemoManageStatus(record)
              }}>
                <Icons stop={true}/>
              </a>
              :
              <a onClick={() => {
                this.changeDemoManageStatus(record)
              }}>
                <Icons recovery={true}/>
              </a>
          }

          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/platformOperation/demoManage/edit/${encodeURIComponent(JSON.stringify(record))}`));
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
              this.props.dispatch(routerRedux.push('/platformOperation/demoManage/add'))
            }}>{formatMessage(messages.addServiceDemo)}</Button>

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
            dataSource={demoConfigList && demoConfigList.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
