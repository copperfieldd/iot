import {Button, Form, List, Modal,Input,Table} from "antd";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import * as routerRedux from "react-router-redux";
import Ellipsis from "../../../../components/Ellipsis";
import messages from '../../../../messages/bushing';
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";
const Search = Input.Search;

@Form.create()
@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_tenantList_action'],
}))
@injectIntl
export default class TenantListModal extends Component {
  constructor(){
    super();

  }
  componentDidMount(){
    const {msgTenant:{tenantList_params}} = this.props;
    this.loadModalTenantList(tenantList_params);
  };

  loadModalTenantList=(params)=>{
    this.props.dispatch({
      type:'msgTenant/fetch_tenantList_action',
      payload:params,
    })
  };

  handleSearch=(value)=>{
    const {msgTenant:{tenantList_params}} = this.props;
    let params = {
      ...tenantList_params,
      start:0,
      field:value,
    };
    this.loadModalTenantList(params);
  }

  changTablePage=(pagination)=>{
    const {msgTenant:{tenantList_params}} = this.props;
    let params = {
      ...tenantList_params,
      start:(pagination.current - 1)*tenantList_params.count
    }
    this.loadModalTenantList(params);
  };


  render(){
    const {msgTenant:{tenantList,tenantList_params},loading,modalShowVisible,onCancelModal,intl:{formatMessage} } = this.props;
    const paginationProps = {
      total:tenantList.total,
      pageSize:tenantList_params.count,
      current:(tenantList_params.start/tenantList_params.count)+1,
    };
    const columns = [{
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'index',
      key: 'index',
      className:'table_row_styles',
      render:(text,record,index)=>(
        <span>
          {index+1}
        </span>
      )
    }, {
      title: formatMessage(basicMessages.tenant_id),
      dataIndex: 'tenantId',
      key: 'tenantId',
      className:'table_row_styles',
      width:160,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span style={{width:160}}>{text}</span></Ellipsis>
        )
      }
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex:'tenantName',
      key: 'tenantName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      dataIndex:'action',
      key: 'action',
      className:'table_row_styles',
      render:(text,record)=>(
        <a onClick={()=>{
          this.props.dispatch(routerRedux.push(`/beingPushed/msgTenant/add/${encodeURIComponent(JSON.stringify(record))}`))
        }}>
          {formatMessage(messages.msg_tenant_config)}
        </a>
      )
    }];
    return(
      <Modal
        visible={modalShowVisible}
        title={formatMessage(messages.msg_tenant_config)}
        className='dealModal_styles'
        width={550}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder={formatMessage(basicMessages.keyWord)}
            onSearch={this.handleSearch}
            style={{marginBottom:10}}
          />
          <Table
            rowKey={(record,index)=>record.tenantId}
            dataSource={tenantList&&tenantList.list}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.changTablePage}
          />
        </div>
      </Modal>
    )
  }


}
