import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Button, Icon, Form, Input, Card, Modal, Tooltip} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query";
import { getLoginUserType } from '../../../utils/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const Search = Input.Search;

@connect(({permissionsApi, loading}) => ({
  permissionsApi,
  loading: loading.effects['permissionsApi/fetch_apiList_action'],
}))
@injectIntl
@Form.create()
export default class ApiManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      details: null,
    }
  };

  componentDidMount() {
  }

  //获取API列表
  loadApiList = (params) => {
    this.props.dispatch({
      type: 'permissionsApi/fetch_apiList_action',
      payload: params,
    })
  };

  //表单的分页切换
  changeTablePage = (pagination) => {
    const {permissionsApi: {api_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...api_params,
      start: start,
    };
    this.loadApiList(params);
  };

  //删除API
  delApiList = (id) => {
    const {permissionsApi: {api_params,apiList},intl:{formatMessage}} = this.props;
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
          type: 'permissionsApi/fetch_delApi_action',
          payload: params,
          params: {
            ...api_params,
            start:apiList.list.length===1&&api_params.start-10>=0?api_params.start-10:api_params.start
          },
        })
      }
    });

  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  render() {
    const {permissionsApi: {apiList, api_params}, loading,intl:{formatMessage}} = this.props;
    const userType = getLoginUserType()===1?true:false;
    const paginationProps = {
      pageSize: api_params.count,
      total: apiList.totalCount,
      current: (api_params.start / api_params.count) + 1,
    };
    const columns = [{
      title: formatMessage(basicMessages.name),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.type),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      width:80,
      render: (text) => (
        <span>{text === 1 ? formatMessage(basicMessages.public) : formatMessage(basicMessages.private)}</span>
      )
    }, {
      title: formatMessage(basicMessages.address),
      dataIndex: 'dataUrl',
      key: 'dataUrl',
      className: 'table_row_styles',
      width:120,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'remarks',
      key: 'remarks',
      className: 'table_row_styles',
      width:120,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.creator),
      dataIndex: 'creatorName',
      key: 'creatorName',
      className: 'table_row_styles',
      width:140,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
      width:140,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      className: 'table_row_styles',
      width:140,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      width:120,
      render: (text, record) => (
        <span>
          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a disabled={userType}
               onClick={(e)=>{
                 e.stopPropagation();
                 this.props.dispatch(routerRedux.push(`/permissions/edit/${record.id}`))
               }}
             >
               <Icons edit={true} disable={userType}/>
            </a>
          </span>

          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a  disabled={userType} style={{marginLeft:10}}
               onClick={
                 (e) => this.delApiList(record.id)
               }
            >
               <Icons deleted={true} disable={userType}/>
            </a>
          </span>
        </span>
      ),
    }];

    return (
      <div>
        <Card
          bodyStyle={{padding: '0px'}}
          bordered={false}
        >
          <Table
            loading={loading}
            rowKey={record => record.id}
            columns={columns}
            dataSource={apiList && apiList.list}
            onChange={this.changeTablePage}
            pagination={paginationProps}
          />
        </Card>
      </div>
    );
  }
}
