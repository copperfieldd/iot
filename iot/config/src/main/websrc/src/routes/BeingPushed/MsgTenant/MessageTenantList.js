import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Tabs} from 'antd';
import styles from '../BeingPushed.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import TenantListModal from './Modal/TenantListModal';
import StopModal from './Modal/StopModal';
import TenantEditNumModal from './Modal/TenantEditNumModal';
import {tenantAllList} from "../../../services/beingPushed";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";
import messages from '../../../messages/bushing';
import basicMessages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_tenantAllList_action'],
  updateQuotaLoading:loading.effects['msgTenant/fetch_updateTenantNum_action'],
  stopTenantLoading:loading.effects['msgTenant/fetch_stopTenant_action'],
}))
@Form.create()
@injectIntl
export default class MessageTenantList extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      modalVisible: false,
      stopModalVisible: false,
      currentValue: null,
      tenantEditNumVisible: false
    }
  };

  componentDidMount() {
    const {msgTenant: {tenantAllList_params}} = this.props;
    this.tenantAllList(tenantAllList_params)
  }

  tenantAllList = (params) => {
    this.props.dispatch({
      type: 'msgTenant/fetch_tenantAllList_action',
      payload: params
    })
  }

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  openModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  };

  openStopModal = () => {
    this.setState({
      stopModalVisible: !this.state.stopModalVisible,
    })
  };

  openTenantEditNumModal = () => {
    this.setState({
      tenantEditNumVisible: !this.state.tenantEditNumVisible,
    })
  };

  onChangeTablePage=(pagination)=>{
    const {msgTenant: {tenantAllList_params}} = this.props;
    let params = {
      ...tenantAllList_params,
      start:(pagination -1 ) * tenantAllList_params.count,
    };
    this.tenantAllList(params)
  }


  render() {
    const {modalVisible, stopModalVisible, currentValue, tenantEditNumVisible} = this.state;
    const {msgTenant: {tenantAllList,tenantAllList_params},loading,updateQuotaLoading,stopTenantLoading,intl:{formatMessage}} = this.props;
    let paginationProps = {
      total:tenantAllList.total,
      pageSize:tenantAllList_params.count,
      current:(tenantAllList_params.start/tenantAllList_params.count)+1
    }
    const columns = [
      {
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      render:(text,record,index)=>(
        <span>{index+1}</span>
      )
    },
      {
      title: formatMessage(basicMessages.tenant_id),
      dataIndex: 'tenantId',
      key: 'tenantId',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenantName',
      key: 'tenantName',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.tenant_desc),
      dataIndex: 'tenantInfo',
      key: 'tenantInfo',
      className: 'table_row_styles',
      width:250,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.msg_common_allowance),
      dataIndex: 'marginValue',
      key: 'marginValue',
      className: 'table_row_styles',
      render:(text,record)=>{
        return record.marginValue.map((item,index)=>{
          if(item.type==='0'){
            return (
              <p key={index}>{formatMessage(messages.msg_common_msg)}:{item.number===-1?'*':item.number}</p>
            )
          }else if(item.type==='1'){
            return (
              <p key={index}>{formatMessage(messages.msg_common_email)}:{item.number===-1?'*':item.number}</p>
            )
          }else{
            return (
              <p key={index}>app:{item.number===-1?'*':item.number}</p>
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
            <Icons stop={record.status===1} enable={record.status!==1}/>
          </a>

          <a style={{marginLeft:10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/beingPushed/msgTenant/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>

          <a style={{marginLeft:10}} onClick={() => {
            this.openTenantEditNumModal();
            this.setState({
              currentValue: record,
            })
          }}>
            <Icons changeQuota={true}/>
          </a>

          <a style={{marginLeft:10}} onClick={() => {
            this.props.dispatch(routerRedux.push(`/beingPushed/msgTenant/item/${encodeURIComponent(JSON.stringify(record))}`))
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
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            <Button icon={'plus'} type={'primary'} onClick={this.openModal}>{formatMessage(messages.msg_tenant_config)}</Button>

            <div></div>
            {/*<div>*/}
              {/*<span className='search' onClick={() => {*/}
                {/*this.setState({*/}
                  {/*visible: true,*/}
                {/*})*/}
              {/*}}><Icon className='query_icon' type="search"/>筛选</span>*/}
            {/*</div>*/}
          </div>

          {/*<Query*/}
            {/*visible={visible}*/}
            {/*handelCancel={this.handelVisible}*/}
            {/*handleOk={this.handleOk}*/}
            {/*//handleReset={this.handleReset}*/}
          {/*>*/}
            {/*/!*{queryForm}*!/*/}
          {/*</Query>*/}
          <Table
            rowKey={(record,index) => `${moment().format('x')}`+record.id}
            dataSource={tenantAllList&&tenantAllList.list}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.onChangeTablePage}

          />

        </Card>

        <TenantListModal
          modalShowVisible={modalVisible}
          onCancelModal={this.openModal}
        />

        <StopModal
          modalShowVisible={stopModalVisible}
          onCancel={this.openStopModal}
          defaultValue={currentValue}
          loading={stopTenantLoading}
          handSubmit={(res) => {
            this.props.dispatch({
              type:'msgTenant/fetch_stopTenant_action',
              payload:res,
              params:tenantAllList_params,
              callback:(res)=>{
                this.openStopModal()
              }
            })
          }}
        />

        <TenantEditNumModal
          modalShowVisible={tenantEditNumVisible}
          onCancel={this.openTenantEditNumModal}
          defaultValue={currentValue}
          loading={updateQuotaLoading}
          handSubmit={(res) => {
            this.props.dispatch({
              type:'msgTenant/fetch_updateTenantNum_action',
              payload:res,
              params:tenantAllList_params,
              callback:(res)=>{
                this.openTenantEditNumModal();
              }
            })
          }}
        />
      </PageHeaderLayout>
    );
  }
}
