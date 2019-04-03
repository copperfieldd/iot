import {Button, Form, List, Modal, Table} from "antd";
import React, {Component, Fragment,} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import * as routerRedux from "react-router-redux";
import Ellipsis from "../../../../components/Ellipsis";
import messages from "../../../../messages/bushing";
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

@Form.create()
@connect(({msgTenant, loading}) => ({
  msgTenant,
  loading: loading.effects['msgTenant/fetch_tenantList_action'],
}))
@injectIntl
export default class AppListModal extends Component {
  constructor(){
    super();

  }
  componentDidMount(){
    const {msgTenant:{applicationNewList_params}} = this.props;
    this.loadModalAppList(applicationNewList_params);
  };

  loadModalAppList=(params)=>{
    this.props.dispatch({
      type:'msgTenant/fetch_applicationNewList_action',
      payload:params,

    })
  };

  changTablePage=(pagination)=>{
    const {msgTenant:{applicationNewList_params}} = this.props;
    let params = {
      ...applicationNewList_params,
      start:(pagination.current - 1)*applicationNewList_params.count
    }
    this.loadModalAppList(params);
  };


  render(){
    const {msgTenant:{applicationNewList,applicationNewList_params},loading,modalShowVisible,onCancelModal ,intl:{formatMessage} } = this.props;
    const paginationProps = {
      total:applicationNewList.total,
      pageSize:applicationNewList_params.count,
      current:(applicationNewList_params.start/applicationNewList_params.count)+1,
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
      title: formatMessage(messages.msg_app_appId),
      dataIndex: 'applicationId',
      key: 'applicationId',
      className:'table_row_styles',
      width:160,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span style={{width:160}}>{text}</span></Ellipsis>
        )
      }
    },{
      title: formatMessage(basicMessages.applicationName),
      dataIndex:'applicationName',
      key: 'applicationName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      dataIndex:'action',
      key: 'action',
      className:'table_row_styles',
      render:(text,record)=>(
        <a onClick={()=>{
          this.props.dispatch(routerRedux.push(`/beingPushed/msgApplication/add/${encodeURIComponent(JSON.stringify(record))}`))
        }}>
          {formatMessage(messages.msg_app_config)}
        </a>
      )
    }];
    return(
      <Modal
        visible={modalShowVisible}
        title={formatMessage(messages.msg_app_config)}
        className='dealModal_styles'
        width={500}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Table
            rowKey={record => record.id}
            dataSource={applicationNewList&&applicationNewList.list}
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
