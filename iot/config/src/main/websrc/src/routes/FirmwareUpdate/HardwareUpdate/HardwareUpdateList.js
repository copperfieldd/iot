import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Modal, Input, Select, Tabs} from 'antd';
import styles from '../FirmwareUpdate.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import {getLoginUserType} from "../../../utils/utils";
import Icons from "../../../components/Icon";
import Ellipsis from "../../../components/Ellipsis";
import basicMessages from "../../../messages/common/basicTitle";
import messages from "../../../messages/firmware";
import eqMessages from "../../../messages/equipment";
import msgMessages from "../../../messages/bushing";
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['hardwareUpdate/fetch_getUpgradeList_action'],
  loading1: loading.effects['hardwareUpdate/fetch_getHistoryList_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateList extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      tabKey: '1',
    }
  };

  componentDidMount() {
    const {hardwareUpdate: {getUpgradeList_params}} = this.props;
    this.getUpgradeList(getUpgradeList_params);
  };

  getUpgradeList = (params) => {
    this.props.dispatch({
      type: 'hardwareUpdate/fetch_getUpgradeList_action',
      payload: params
    })
  };

  getHistoryList = (params) => {
    this.props.dispatch({
      type: 'hardwareUpdate/fetch_getHistoryList_action',
      payload: params
    })
  };

  changeTabs = (key) => {
    switch (key) {
      case '1':
        this.setState({
          tabKey: key
        });
        this.props.form.resetFields();
        this.props.dispatch({
          type: 'hardwareUpdate/change_tabKey',
          payload:key,
        });
        break;
      case '2':
        this.setState({
          tabKey: key
        });
        this.props.dispatch({
          type: 'hardwareUpdate/change_tabKey',
          payload:key,
        });
        const {hardwareUpdate: {getHistoryList_params}} = this.props;
        this.getHistoryList(getHistoryList_params);
        this.props.form.resetFields();
        break;
      default:
    }
  };


  onChangeTablePage = (pagination) => {
    const {hardwareUpdate: {getUpgradeList_params}} = this.props;
    const params = {
      ...getUpgradeList_params,
      start: (pagination.current - 1) * getUpgradeList_params.count,
    };
    this.getUpgradeList(params);

  };

  onChangeTablePage1 = (pagination) => {

    const {hardwareUpdate: {getHistoryList_params}} = this.props;
    const params = {
      ...getHistoryList_params,
      start: (pagination.current - 1) * getHistoryList_params.count,
    };
    this.getHistoryList(params);

  };


  delAdapter = (id) => {
    const {securityAudit: {auditQuery_params, auditQueryList}, intl: {formatMessage}} = this.props;
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
          type: 'equipmentAdapter/fetch_delAdapter_action',
          payload: params,
          params: {
            ...auditQuery_params,
            start: auditQueryList.value.length === 1 && auditQuery_params.start - 10 >= 0 ? auditQuery_params.start - 10 : auditQuery_params.start,
          },
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
    const {hardwareUpdate: {getUpgradeList_params, getHistoryList_params,tabKey}} = this.props;
    let params = tabKey === '1' ? getUpgradeList_params : getHistoryList_params;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...params,
          start: 0,
          ...fieldsValue,
          //startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          //endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        if (tabKey === '1') {
          this.getUpgradeList(values)
        } else {
          this.getHistoryList(values)
        }
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {hardwareUpdate: {getUpgradeList_params, getHistoryList_params,tabKey}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: tabKey === '1' ? getUpgradeList_params.count : getHistoryList_params.count
    };
    if (tabKey === '1') {
      this.getUpgradeList(values)
    } else {
      this.getHistoryList(values)
    }
  };


  render() {
    const {hardwareUpdate: {getUpgradeList_params, getUpgradeList, getHistoryList, getHistoryList_params,tabKey}, intl: {formatMessage}, loading, loading1} = this.props;
    const {visible} = this.state;
    const {getFieldDecorator} = this.props.form;
    let userType = getLoginUserType();


    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
    };
    const paginationProps = {
      pageSize: getUpgradeList_params.count,
      total: getUpgradeList.totalCount,
      current: (getUpgradeList_params.start / getUpgradeList_params.count) + 1,
    };

    const paginationProps1 = {
      pageSize: getHistoryList_params.count,
      total: getHistoryList.totalCount,
      current: (getHistoryList_params.start / getHistoryList_params.count) + 1,
    }

    let index = {
      title: formatMessage(basicMessages.serial),
      dataIndex: 'index',
      key: 'index',
      className: 'table_row_styles',
      width: '60px',
      render: (text, record, index) => (
        <span>{index + 1}</span>
      )
    };
    let createTime = {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'create_time',
      key: 'create_time',
      className: 'table_row_styles',
      width: '90px',
      render: (text, record) => (
        <Ellipsis tooltip={moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')} lines={1}><span style={{display:'block'}}>{moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')}</span></Ellipsis>
      )
    };
    let tenant = {
      title: formatMessage(basicMessages.tenant),
      dateIndex: 'tenantName',
      key: 'tenantName',
      className: 'table_row_styles',
      width: '80px',
      render: (text, record) => (
        <Ellipsis tooltip={record.tenantName} lines={1}><span style={{display:'block'}}>{record.tenantName}</span></Ellipsis>
      )
    };
    let app = {
      title: formatMessage(basicMessages.application),
      dateIndex: 'applicationName',
      key: 'applicationName',
      className: 'table_row_styles',
      width: '90px',
      render: (text, record) => (
        <Ellipsis tooltip={record.applicationName} lines={1}><span style={{display:'block'}}>{record.applicationName}</span></Ellipsis>
      )
    };
    let updateUser = {
      title: formatMessage(basicMessages.upgrade_user),
      dateIndex: 'userName',
      key: 'userName',
      className: 'table_row_styles',
      width: '90px',
      render: (text, record) => (
        <span>{record.userName}</span>
      )
    };
    let deviceType = {
      title: formatMessage(eqMessages.equipmentType),
      dateIndex: 'deviceTypeName',
      key: 'deviceTypeName',
      className: 'table_row_styles',
      width: '90px',
      render: (text, record) => (
        <Ellipsis tooltip={record.deviceTypeName} lines={1}><span style={{display:'block'}}>{record.deviceTypeName}</span></Ellipsis>
      )
    };
    let deviceName = {
      title: formatMessage(eqMessages.equipment_device_model),
      dateIndex: 'deviceModelName',
      key: 'deviceModelName',
      className: 'table_row_styles',
      width: '100px',
      render: (text, record) => (
        <Ellipsis tooltip={record.deviceModelName} lines={1}><span style={{display:'block'}}>{record.deviceModelName}</span></Ellipsis>
      )
    };
    let updBag = {
      title: formatMessage(messages.firm_package_version),
      dateIndex: 'upgradePackageVersion',
      key: 'upgradePackageVersion',
      className: 'table_row_styles',
      width: '100px',
      render: (text, record) => (
        <Ellipsis tooltip={record.upgradePackageVersion} lines={1}><span style={{display:'block'}}>{record.upgradePackageVersion}</span></Ellipsis>
      )
    };
    let updConfig = {
      title: formatMessage(messages.firm_upgrade_config), dateIndex: 'updConfig', key: 'updConfig', className: 'table_row_styles', width: '80px',
      render: (text, record) => (
        <a onClick={() => {
          this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdate/item/${encodeURIComponent(JSON.stringify(record))}`))
        }}>
          <Icons look={true}/>
        </a>
      )
    };
    let appUpdConfig = {
      title: formatMessage(messages.firm_upgrade_config), dateIndex: 'updConfig', key: 'updConfig', className: 'table_row_styles', width: '80px',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdate/item/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons look={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdate/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>
        </span>

      )
    };
    //0：未开始；1：升级中；2：暂停；3：已完成；4：终止
    let status = {
      title: formatMessage(basicMessages.status),
      dateIndex: 'state',
      key: 'state',
      className: 'table_row_styles',
      width: '80px',
      render: (text, record) => (
        <span>{record.state === 0 ? formatMessage(messages.firm_no_begin) : record.state === 1 ? formatMessage(messages.firm_upgrading) : record.state === 2 ? formatMessage(basicMessages.suspend) : record.state === 3 ? formatMessage(basicMessages.finished) : formatMessage(basicMessages.end)}</span>
      )
    };
    let look = {
      title: formatMessage(basicMessages.see), key: 'look', className: 'table_row_styles', width: '100px',
      render: (text, record) => (
        <span>
          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdate/dutyItemU/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons item={true}/>
          </a>
        </span>
      ),
    };
    let appOperations = {
      title: formatMessage(basicMessages.operations), key: 'operations', className: 'table_row_styles', width: '120px',
      render: (text, record) => (
        <span>
          {
            record.state === 0 ?
              <a style={{marginLeft: 10}} onClick={() => {
                this.props.dispatch({
                  type:"hardwareUpdate/fetch_upgradeControl_action",
                  payload:{
                    upgradeId:record.id,
                    state:1
                  }
                })
              }}>
                <Icons recovery={true}/>
              </a> :
              <span>
                {
                  record.state===1?
                    <a style={{marginLeft: 10}} onClick={() => {
                      this.props.dispatch({
                        type:"hardwareUpdate/fetch_upgradeControl_action",
                        payload:{
                          upgradeId:record.id,
                          state:2
                        }
                      })
                    }}>
                      <Icons stop={true}/>
                    </a>
                    :
                    <a style={{marginLeft: 10}} onClick={() => {
                      this.props.dispatch({
                        type:"hardwareUpdate/fetch_upgradeControl_action",
                        payload:{
                          upgradeId:record.id,
                          state:1
                        }
                      })
                    }}>
                      <Icons recovery={true}/>
                    </a>
                }

                <a style={{marginLeft: 10}} onClick={() => {
                  this.props.dispatch({
                    type:"hardwareUpdate/fetch_upgradeControl_action",
                    payload:{
                      upgradeId:record.id,
                      state:4
                    }
                  })
                }}>
                  <Icons end={true}/>
                </a>
              </span>
          }
          <a style={{marginLeft: 10}} onClick={()=>{
            this.props.dispatch({
              type:"hardwareUpdate/fetch_delUpdateDuty_action",
              payload:{
                upgradeId:record.id,
              }
            })
          }}>
            <Icons deleted={true}/>
          </a>
        </span>
      ),
    };
    let tenantOperations = {
      title: formatMessage(basicMessages.operations), key: 'operations', className: 'table_row_styles', width: '150px',
      render: (text, record) => (
        <span>
          {
            record.state === 0 ?
              <a style={{marginLeft: 10}} onClick={() => {
                this.props.dispatch({
                  type:"hardwareUpdate/fetch_upgradeControl_action",
                  payload:{
                    upgradeId:record.id,
                    state:1
                  }
                })
              }}>
                <Icons recovery={true}/>
              </a> :
              <span>
                {
                  record.state===1?
                    <a style={{marginLeft: 10}} onClick={() => {
                      this.props.dispatch({
                        type:"hardwareUpdate/fetch_upgradeControl_action",
                        payload:{
                          upgradeId:record.id,
                          state:2
                        }
                      })
                    }}>
                      <Icons stop={true}/>
                    </a>
                    :
                    <a style={{marginLeft: 10}} onClick={() => {
                      this.props.dispatch({
                        type:"hardwareUpdate/fetch_upgradeControl_action",
                        payload:{
                          upgradeId:record.id,
                          state:1
                        }
                      })
                    }}>
                      <Icons recovery={true}/>
                    </a>
                }

                <a style={{marginLeft: 10}} onClick={() => {
                  this.props.dispatch({
                    type:"hardwareUpdate/fetch_upgradeControl_action",
                    payload:{
                      upgradeId:record.id,
                      state:4
                    }
                  })
                }}>
                  <Icons end={true}/>
                </a>
              </span>
          }
        </span>
      ),
    }
    let finishTime = {
      title: formatMessage(basicMessages.finish_time), dateIndex: 'endTime', key: 'endTime', className: 'table_row_styles',width:100, render: (text, record) => (
        <Ellipsis tooltip={moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')} lines={1}><span style={{display:'block'}}>{moment(record.createTime).format('YYYY/MM/DD HH:mm:ss')}</span></Ellipsis>
      )
    };
    // let app = {title:'',dateIndex:'',key:'',className:'table_row_styles'};
    const currentDutyColumns = userType === 0 ? [index, createTime, tenant, app, updateUser, deviceType, deviceName, updBag, updConfig, status, look]
      : userType === 1 ? [index, createTime, tenant, app, updateUser, deviceType, deviceName, updBag, updConfig, status, tenantOperations, look] :
        [index, createTime, tenant, app, updateUser, deviceType, deviceName, updBag, appUpdConfig, status, appOperations, look];
    const historyDutyColumns = [index, createTime, finishTime, updateUser, tenant, app, deviceType, deviceName, updBag, updConfig, status, look];
    const options = userType===0?[
      <Option key={0} value={0}>{formatMessage(basicMessages.tenantName)}</Option>,
      <Option key={1} value={1}>{formatMessage(basicMessages.applicationName)}</Option>,
      <Option key={2} value={2}>{formatMessage(messages.firm_package_name)}</Option>,
      <Option key={3} value={3}>{formatMessage(messages.firm_package_number)}</Option>,
      <Option key={4} value={4}>{formatMessage(basicMessages.remarks)}</Option>
    ]:userType===1?[
      <Option key={1} value={1}>{formatMessage(basicMessages.applicationName)}</Option>,
      <Option key={2} value={2}>{formatMessage(messages.firm_package_name)}</Option>,
      <Option key={3} value={3}>{formatMessage(messages.firm_package_number)}</Option>,
      <Option key={4} value={4}>{formatMessage(basicMessages.remarks)}</Option>
    ]:[
      <Option key={2} value={2}>{formatMessage(messages.firm_package_name)}</Option>,
      <Option key={3} value={3}>{formatMessage(messages.firm_package_number)}</Option>,
      <Option key={4} value={4}>{formatMessage(basicMessages.remarks)}</Option>
    ];

    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.query_type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryType', {
            initialValue: tabKey === '1' ? getUpgradeList_params.queryType : getHistoryList_params.queryType
          })
          (
            <Select placeholder={formatMessage(basicMessages.query_criteria)}>
              {options}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryText', {
            rule:[
              {
                max:512,message:formatMessage(basicMessages.cannot_more_than_512)
              }
            ],
            initialValue: tabKey === '1' ? getUpgradeList_params.queryText : getHistoryList_params.queryText
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.firm_upgrade_state)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('state', {
            initialValue: tabKey === '1' ? getUpgradeList_params.state : getHistoryList_params.state
          })
          (
            tabKey === '1' ?
              <Select>
                <Option value={0}>{formatMessage(messages.firm_no_begin)}</Option>
                <Option value={1}>{formatMessage(messages.firm_upgrading)}</Option>
                <Option value={2}>{formatMessage(basicMessages.suspend)}</Option>
              </Select> : <Select>
                <Option value={3}>{formatMessage(basicMessages.finished)}</Option>
                <Option value={4}>{formatMessage(basicMessages.end)}</Option>
              </Select>
          )}
        </FormItem>

      </Form>
    )


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
            {userType === 3 ? <Button type='primary' icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push('/firmwareUpdate/hardwareUpdate/add'));
            }}>{formatMessage(msgMessages.msg_new_task)}</Button> : <div></div>}

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
          <div className={styles.updateEq}>
            <Tabs activeKey={tabKey} onChange={this.changeTabs}>
              <TabPane tab={formatMessage(msgMessages.msg_duty_list)} key="1">
                <Table
                  rowKey={(record, index) => record.id}
                  dataSource={getUpgradeList && getUpgradeList.list}
                  loading={loading}
                  columns={currentDutyColumns}
                  pagination={paginationProps}
                  onChange={this.onChangeTablePage}
                />
              </TabPane>
              <TabPane tab={formatMessage(messages.firm_history_task)} key="2">
                <Table
                  loading={loading1}
                  rowKey={(record, index) => record.id}
                  dataSource={getHistoryList && getHistoryList.list}
                  columns={historyDutyColumns}
                  pagination={paginationProps1}
                  onChange={this.onChangeTablePage1}
                />
              </TabPane>
            </Tabs>
          </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}
