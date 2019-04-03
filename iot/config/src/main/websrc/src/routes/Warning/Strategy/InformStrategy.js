import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card, Modal,} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query";
import * as routerRedux from "react-router-redux";
import Ellipsis from '../../../components/Ellipsis'
import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;


@connect(({warning, warningStrategy, loading}) => ({
  warning,
  warningStrategy,
  loading: loading.effects['warningStrategy/fetch_warningStrategyList_action'],
}))
@injectIntl
@Form.create()
export default class InformStrategy extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    const {warningStrategy: {warningStrategy_params}} = this.props;
    this.loadWarningStrategyList(warningStrategy_params);
  };

  loadWarningStrategyList = (params) => {
    this.props.dispatch({
      type: 'warningStrategy/fetch_warningStrategyList_action',
      payload: params,
    })
  };

  delInformStrategyList = (id) => {
    const {warningStrategy: {warningStrategy_params, warningStrategyList}, intl: {formatMessage}} = this.props;
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
          type: 'warningStrategy/fetch_delWarningStrategyList_action',
          payload: params,
          params: formatParams(warningStrategyList.value, warningStrategy_params),
        })
      }
    });

  };

  changeTablePage = (pagination) => {
    const {warningStrategy: {warningStrategy_params}} = this.props;
    const start = (pagination.current - 1) * warningStrategy_params.count;
    const params = {
      ...warningStrategy_params,
      start: start,
    };
    this.loadWarningStrategyList(params);
  };


  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };


  handleOk = (e) => {
    const {warningStrategy: {warningStrategy_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...warningStrategy_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadWarningStrategyList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {warningStrategy: {warningStrategy_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: warningStrategy_params.count
    };
    this.loadWarningStrategyList(values);
  };


  render() {
    const {warningStrategy: {warningStrategy_params, warningStrategyList}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: warningStrategy_params.count,
      total: warningStrategyList.totalCount,
      current: (warningStrategy_params.start / warningStrategy_params.count) + 1
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
            initialValue: warningStrategy_params.serviceName
          })
          (
            <Input placeholder={formatMessage(messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.interface)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('interFaceName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: warningStrategy_params.interFaceName
          })
          (
            <Input placeholder={formatMessage(messages.inputApiName)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: warningStrategy_params.startTime && moment(warningStrategy_params.startTime) || undefined
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
            initialValue: warningStrategy_params.endTime && moment(warningStrategy_params.endTime) || undefined
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
      title: formatMessage(basicMessages.name),
      dataIndex: 'notifyName',
      key: 'notifyName',
      className: 'table_row_styles',
      width: 150,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}>{text}</Ellipsis>
        )
      }
    }, {
      title: formatMessage(messages.serviceName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 160,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}>{text}</Ellipsis>
        )
      }
    }, {
      title: formatMessage(messages.interface),
      dataIndex: 'interFaceName',
      key: 'interFaceName',
      className: 'table_row_styles',
      width: 160,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}>{text}</Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.address),
      dataIndex: 'notifyUrl',
      key: 'notifyUrl',
      className: 'table_row_styles',
      width: 160,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}>{text}</Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'urlDesc',
      key: 'urlDesc',
      className: 'table_row_styles',
      width: 160,
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
      width: 160,
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/warning/informStrategy/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.delInformStrategyList(record.id)
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
              this.props.dispatch(routerRedux.push('/warning/informStrategy/add'))
            }}>{formatMessage(messages.newApi)}</Button>

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
            dataSource={warningStrategyList && warningStrategyList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
