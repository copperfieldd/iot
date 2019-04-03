import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Card, Tabs, Row, Col, Select} from 'antd';
import styles from '../PaltformOperation.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';
import ReactJson from 'react-json-view';
import Ellipsis from "../../../components/Ellipsis";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading1: loading.effects['platformOperation/fetch_getLifeList_action'],
  loading2: loading.effects['platformOperation/fetch_getMemoryList_action'],
  loading3: loading.effects['platformOperation/fetch_getDiskList_action'],
}))
@injectIntl
@Form.create()
export default class ServiceDemo extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    const {platformOperation: {demo_params}} = this.props;
    this.loadPullList();
  };

  loadPullList = () => {
    this.props.dispatch({
      type: 'platformOperation/fetch_getServiceDemo_action',
      payload: null,
    })
  };

  loadLifeList = (params) => {
    this.props.dispatch({
      type: 'platformOperation/fetch_getLifeList_action',
      payload: params
    })
  }

  loadRAMList = (params) => {
    this.props.dispatch({
      type: 'platformOperation/fetch_getMemoryList_action',
      payload: params
    })
  }

  loadDiskList = (params) => {
    this.props.dispatch({
      type: 'platformOperation/fetch_getDiskList_action',
      payload: params
    })
  }

  changeLifeTablePage = (pagination) => {
    const {platformOperation: {life_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...life_params,
      start: start,
    };
    this.loadLifeList(params);
  };

  changeRAMTablePage = (pagination) => {
    const {platformOperation: {RAM_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...RAM_params,
      start: start,
    };
    this.loadRAMList(params);
  };


  changeDiskTablePage = (pagination) => {
    const {platformOperation: {disk_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...disk_params,
      start: start,
    };
    this.loadDiskList(params);
  };


  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  changeTabs = (key) => {
    this.props.dispatch({
      type: 'platformOperation/fetch_tabsKey_action',
      payload: key,
    });
    const {platformOperation: {life_params, RAM_params, disk_params}} = this.props;
    switch (key) {
      case '1':
        break;
      case '2':
        this.loadLifeList(life_params);
        break;
      case '3':
        this.loadRAMList(RAM_params);
        break;
      case '4':
        this.loadDiskList(disk_params);
        break;
      default:
    }
  };


  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'platformOperation/fetch_queryParams_action',
          payload: values
        })
      }
    });
  };


  render() {

    const {platformOperation: {life_params, RAM_params, disk_params, pullServiceList, queryParams, lifeList, RAMList, diskList, tabsKey}, loading1, loading2, loading3, intl: {formatMessage}} = this.props;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 10},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };
    const {getFieldDecorator} = this.props.form;
    //分页
    const lifePaginationProps = {
      pageSize: life_params.count,
      total: lifeList.totalCount,
      current: (life_params.start / life_params.count) + 1,
    };

    const RAMPaginationProps = {
      pageSize: RAM_params.count,
      total: RAMList.totalCount,
      current: (RAM_params.start / RAM_params.count) + 1,
    };

    const diskPaginationProps = {
      pageSize: disk_params.count,
      total: diskList.totalCount,
      current: (disk_params.start / disk_params.count) + 1,
    };
    const {visible} = this.state;
    const columnsLife = [{
      title: formatMessage(messages.serviceDemoName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.accessAddress),
      dataIndex: 'serviceHost',
      key: 'serviceHost',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.port),
      dataIndex: 'servicePort',
      key: 'servicePort',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.status),
      dataIndex: 'value',
      key: 'value',
      className: 'table_row_styles',
      render: (text, record) => {
        return (
          text === 0 ? <span>{formatMessage(basicMessages.normal)}</span> :
            <span>{formatMessage(basicMessages.abnormal)}</span>
        )
      }
    }, {
      title: formatMessage(messages.lastDetectionTime),
      dataIndex: 'probeTime',
      key: 'probeTime',
      className: 'table_row_styles',
    }];

    const columnsRAM = [{
      title: formatMessage(messages.serviceDemoName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.accessAddress),
      dataIndex: 'serviceHost',
      key: 'serviceHost',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.port),
      dataIndex: 'servicePort',
      key: 'servicePort',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.serviceResidual),
      dataIndex: 'value',
      key: 'value',
      className: 'table_row_styles',

    }, {
      title: formatMessage(messages.lastDetectionTime),
      dataIndex: 'probeTime',
      key: 'probeTime',
      className: 'table_row_styles',
    }];

    const columnsDisk = [{
      title: formatMessage(messages.serviceDemoName),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.accessAddress),
      dataIndex: 'serviceHost',
      key: 'serviceHost',
      className: 'table_row_styles',
      width: 300,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.port),
      dataIndex: 'servicePort',
      key: 'servicePort',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.disk),
      dataIndex: 'value',
      key: 'value',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.lastDetectionTime),
      dataIndex: 'probeTime',
      key: 'probeTime',
      className: 'table_row_styles',
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '10px 32px 32px'}}
          bordered={false}
        >
          <Tabs className={styles.service_tabs} defaultActiveKey={tabsKey} onChange={this.changeTabs}>
            <TabPane tab={<div className={styles.service_tab_special}>{formatMessage(messages.serviceDemoQuery)}</div>}
                     key="1">
              <Card
                bodyStyle={{padding: '32px'}}
              >
                <Form>
                  <Row>
                    <Col span={7}>
                      <FormItem
                        label={formatMessage(messages.selectExample)}
                        {...formItemLayout}
                      >
                        {
                          getFieldDecorator('serviceId', {
                            rules: [{
                              required: true, message: formatMessage(messages.selectExample),
                            }],
                          })(
                            <Select placeholder={formatMessage(messages.selectExample)}>
                              {pullServiceList && pullServiceList.map((item, index) => {
                                return (
                                  <Option key={index} value={item.id}>{item.serviceName}</Option>
                                )
                              })}
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col span={7}>
                      <FormItem
                        label={formatMessage(messages.selectNode)}
                        {...formItemLayout}
                      >
                        {
                          getFieldDecorator('node', {
                            rules: [{
                              required: true, message: formatMessage(messages.selectNode),
                            }],
                          })(
                            <Select>
                              <Option value='env'>env</Option>
                              <Option value='beans'>beans</Option>
                              <Option value='health'>health</Option>
                              <Option value='metrics'>metrics</Option>
                            </Select>
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col style={{marginTop: 4}}>
                      <Button type='primary' icon='search' onClick={(e) => {
                        this.handleSubmit(e);
                      }}>
                        {formatMessage(basicMessages.filter)}
                      </Button>
                    </Col>
                  </Row>

                </Form>
                {queryParams ? <div style={{
                  wordWrap: 'break-word',
                  width: 600,
                  height: 500,
                  borderRadius: '5px',
                  border: 'solid 1px #e6e6e6',
                  padding: 10,
                  overflowY: 'scroll',
                }}>
                  <ReactJson src={JSON.parse(queryParams)} enableClipboard={false}/></div> : null}
                {/*<div>{queryParams&&queryParams}</div>*/}
              </Card>
            </TabPane>


            <TabPane
              tab={<div className={styles.service_tab_normal}>{formatMessage(messages.serviceDemoSurvival)}</div>}
              key="2">


              <div className='dlxB' style={{marginBottom: 12}}>
                <Button type='primary' onClick={() => {
                  this.props.dispatch(routerRedux.push('/platformOperation/serviceDemo/editLife/1'))
                }}>{formatMessage(basicMessages.modify)}</Button>
                {/*<div>*/}
                {/*<span className='search' onClick={() => {*/}
                {/*this.setState({*/}
                {/*visible: true,*/}
                {/*})*/}
                {/*}}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>*/}
                {/*</div>*/}
                {/*<Query*/}
                {/*visible={visible}*/}
                {/*handelCancel={this.handelVisible}*/}
                {/*handleOk={this.handleOk}*/}
                {/*//handleReset={this.handleReset}*/}
                {/*>*/}
                {/*/!*{queryForm}*!/*/}
                {/*</Query>*/}
              </div>
              <Table
                loading={loading1}
                rowKey={record => record.id}
                dataSource={lifeList && lifeList.list}
                columns={columnsLife}
                pagination={lifePaginationProps}
                onChange={this.changeLifeTablePage}
              />

            </TabPane>
            <TabPane tab={<div className={styles.service_tab_normal}>{formatMessage(messages.serviceDemoMemory)}</div>}
                     key="3">
              <div className='dlxB' style={{marginBottom: 12}}>
                <Button type='primary' onClick={() => {
                  this.props.dispatch(routerRedux.push('/platformOperation/serviceDemo/editRAM/2'))
                }}>{formatMessage(basicMessages.modify)}</Button>

                {/*<div>*/}
                {/*<span className='search' onClick={() => {*/}
                {/*this.setState({*/}
                {/*visible: true,*/}
                {/*})*/}
                {/*}}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>*/}
                {/*</div>*/}
                {/*<Query*/}
                {/*visible={visible}*/}
                {/*handelCancel={this.handelVisible}*/}
                {/*handleOk={this.handleOk}*/}
                {/*//handleReset={this.handleReset}*/}
                {/*>*/}
                {/*/!*{queryForm}*!/*/}
                {/*</Query>*/}
              </div>
              <Table
                loading={loading2}
                rowKey={record => record.id}
                dataSource={RAMList && RAMList.list}
                columns={columnsRAM}
                pagination={RAMPaginationProps}
                onChange={this.changeRAMTablePage}
              />
            </TabPane>
            <TabPane tab={<div className={styles.service_tab_normal}>{formatMessage(messages.serviceDemoDisk)}</div>}
                     key="4">
              <div className='dlxB' style={{marginBottom: 12}}>
                <Button type='primary' onClick={() => {
                  this.props.dispatch(routerRedux.push('/platformOperation/serviceDemo/editDisk/3'))
                }}>{formatMessage(basicMessages.modify)}</Button>
                {/*<div>*/}
                {/*<span className='search' onClick={() => {*/}
                {/*this.setState({*/}
                {/*visible: true,*/}
                {/*})*/}
                {/*}}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>*/}
                {/*</div>*/}
                {/*<Query*/}
                {/*visible={visible}*/}
                {/*handelCancel={this.handelVisible}*/}
                {/*handleOk={this.handleOk}*/}
                {/*//handleReset={this.handleReset}*/}
                {/*>*/}
                {/*/!*{queryForm}*!/*/}
                {/*</Query>*/}
              </div>
              <Table
                loading={loading3}
                rowKey={(record, index) => index}
                dataSource={diskList && diskList.list}
                columns={columnsDisk}
                pagination={diskPaginationProps}
                onChange={this.changeDiskTablePage}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
