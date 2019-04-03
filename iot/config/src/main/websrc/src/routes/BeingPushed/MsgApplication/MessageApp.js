import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card} from 'antd';
import styles from '../BeingPushed.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import AppListModal from "./Modal/AppListModal";
import StopModal from "./Modal/StopModal";
import AppEditNumModal from "./Modal/AppEditNumModal";
import {formatParams, getLoginUserType} from "../../../utils/utils";
import Icons from "../../../components/Icon";
import messages from '../../../messages/bushing';
import basicMessages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_applicationAllList_action'],
  updateQuotaLoading: loading.effects['msgTenant/fetch_editApplicationNumber_action'],
  stopLoading: loading.effects['msgTenant/fetch_changeAppStatus_action']
}))
@injectIntl

@Form.create()
export default class MessageApp extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      modalVisible: false,
      appEditNumVisible: false
    }
  };

  componentDidMount() {
    let userType = getLoginUserType();
    const {msgTenant: {applicationAllList_params}} = this.props;
    if (userType !== 0) {
      this.loadAllApplicationList(applicationAllList_params)
    }
  }

  loadAllApplicationList = (params) => {
    this.props.dispatch({
      type: 'msgTenant/fetch_applicationAllList_action',
      payload: params
    })
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  openStopModal = () => {
    this.setState({
      stopModalVisible: !this.state.stopModalVisible,
    })
  };

  openModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  };

  openAppEditNumModal = () => {
    this.setState({
      appEditNumVisible: !this.state.appEditNumVisible,
    })
  };

  changeTablePage = (pagination) => {
    const {msgTenant: {applicationAllList_params}} = this.props;
    let params = {
      ...applicationAllList_params,
      start: (pagination - 1) * applicationAllList_params.count,
    };
    this.loadAllApplicationList(params)
  }


  render() {

    const {visible, modalVisible, stopModalVisible, currentValue, appEditNumVisible} = this.state;
    const {msgTenant: {applicationAllList, applicationAllList_params}, updateQuotaLoading, loading, stopLoading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      total: applicationAllList.total,
      pageSize: applicationAllList_params.count,
      current: (applicationAllList_params.start / applicationAllList_params.count) + 1
    }

    let userType = getLoginUserType();
    const columns = [{
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      render: (text, record, index) => (
        <span>{index + 1}</span>
      )
    }, {
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'applicationName',
      key: 'applicationName',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'applicationInfo',
      key: 'applicationInfo',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.msg_common_allowance),
      dataIndex: 'margin_value',
      key: 'margin_value',
      className: 'table_row_styles',
      render: (text, record) => {
        return record.marginValue.map((item, index) => {
          if (item.type === '0') {
            return (
              <p key={index}>{formatMessage(messages.msg_common_msg)}:{item.number}</p>
            )
          } else if (item.type === '1') {
            return (
              <p key={index}>{formatMessage(messages.msg_common_email)}:{item.number}</p>
            )
          } else {
            return (
              <p key={index}>app:{item.number}</p>
            )
          }
        })
      }
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
           <a onClick={() => {
             this.openStopModal();
             this.setState({
               currentValue: record,
             })
           }}>
            <Icons stop={record.status === 1} enable={record.status !== 1}/>
          </a>

          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/beingPushed/msgApplication/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>
          {
            userType !== 3 ?

              <a style={{marginLeft: 10}} onClick={() => {
                this.openAppEditNumModal();
                this.setState({
                  currentValue: record,
                })
              }}>
                <Icons changeQuota={true}/>
              </a> : null
          }

          <a style={{marginLeft: 10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/beingPushed/msgApplication/item/${record.applicationId}`))
          }}>
            <Icons item={true}/>
          </a>
        </span>
      )
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>

        {userType !== 0 ?
          <Card
            bodyStyle={{padding: '6px 32px'}}
            bordered={false}
          >
            <div className='mrgTB12 dlxB'>
              {
                userType===3?'':
                  <Button icon={'plus'} type={'primary'} onClick={this.openModal}>
                    {formatMessage(messages.msg_app_config)}
                  </Button>
              }
            </div>
            <Table
              rowKey={(record,index) => `${moment().format('x')}`+record.id}
              dataSource={applicationAllList && applicationAllList.list}
              columns={columns}
              loading={loading}
              pagination={paginationProps}
              onChange={this.changeTablePage}
            />
          </Card> : <div style={{
            textAlign: 'center',
            fontSize: '14px',
            marginTop: 70
          }}>{formatMessage(basicMessages.no_authority)}</div>
        }

        <StopModal
          modalShowVisible={stopModalVisible}
          onCancel={this.openStopModal}
          defaultValue={currentValue}
          loading={stopLoading}
          handSubmit={(res) => {
            this.props.dispatch({
              type: 'msgTenant/fetch_changeAppStatus_action',
              payload: res,
              params: applicationAllList_params,
              callback: (res) => {
                this.openStopModal();
              }
            })
          }}
        />

        <AppEditNumModal
          modalShowVisible={appEditNumVisible}
          onCancel={this.openAppEditNumModal}
          defaultValue={currentValue}
          loading={updateQuotaLoading}
          handSubmit={(res) => {
            this.props.dispatch({
              type: 'msgTenant/fetch_editApplicationNumber_action',
              payload: res,
              params: applicationAllList_params,
              callback: (res) => {
                this.openAppEditNumModal();
              }
            })
          }}
        />

        {
          userType === 1 ?
            <AppListModal
              modalShowVisible={modalVisible}
              onCancelModal={this.openModal}
            />
            : null
        }
      </PageHeaderLayout>
    );
  }
}
