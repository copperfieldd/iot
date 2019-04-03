import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { routerRedux } from 'dva/router';
import {Table, Button, Icon, Badge, Form, Card, Divider, Modal, Tooltip} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";

import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";
import {getLoginUserType} from "../../../utils/utils";


@connect(({permissionsRole, loading}) => ({
  permissionsRole,
  loading: loading.effects['permissionsRole/fetch_roleList_action'],
}))
@injectIntl
@Form.create()
export default class RoleManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      expandedKeys: [],
      client: {
        X: 0,
        Y: 0,
      },
    }
  };

  componentDidMount(){
    const {permissionsRole:{role_params}} = this.props;
  };

  loadRoleManageList=(params)=>{
    this.props.dispatch({
      type:'permissionsRole/fetch_roleList_action',
      payload:params,
    })
  };

  rightClick = ({event, node}) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    const userType = getLoginUserType()!==1?true:false;
    const type = parseInt(node.props.dataRef.type);
    if(type===1){
      dataSource = [formatMessage(basicMessages.editPassword)];
    };
    let dataSource;
    if (type === 0&&!userType) {
      dataSource = [formatMessage(basicMessages.add_department),formatMessage(basicMessages.add_department),];
    } else if (type === 3) {
      return;
    }
    event.persist();
    this.setState({
      client: {
        X: event.pageX - 230,
        Y: event.pageY - 120,
      },
      pid: node.props.dataRef.id,
      name: node.props.dataRef.title,
      type:node.props.dataRef.type,
      visible: true,
      dataSource: dataSource,
    })
  };

  changeTablePage=(pagination)=>{
    const {permissionsRole:{role_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...role_params,
      start: start,
    };
    this.loadRoleManageList(params);
  };

  delRoleList = (id) => {
    const userType = getLoginUserType();
    const {permissionsRole: {role_params,roleManageList},intl:{formatMessage}} = this.props;
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
          type: 'permissionsRole/fetch_delRole_action',
          payload: params,
          params: {
            ...role_params,
            start:roleManageList.list.length===1&&role_params.start-10>=0?role_params.start-10:role_params.start,
          },
          userType:userType,
        })
      }
    });

  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible
    })
  };

  render() {
    const {permissionsRole:{role_params,roleManageList},loading,match:{params:{data}},intl:{formatMessage}} = this.props;
    const typeId = JSON.parse(decodeURIComponent(data));
    const state = typeId.nodeType===1&&getLoginUserType() === 0 ? true :typeId.nodeType===3&&getLoginUserType() === 1?true:typeId.nodeType===4&&getLoginUserType() === 3?true:false;
    const paginationProps = {
      pageSize: role_params.count,
      total: roleManageList.totalCount,
      current: (role_params.start / role_params.count) + 1,
    }

    const {visible} = this.state;

    const columns = [{
      title: formatMessage(messages.roleName),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
      width:200,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )

    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'remarks',
      key: 'remarks',
      className:'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'time',
      className:'table_row_styles',
      width:200,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.operations),
      key: 'operations',
      className:'table_row_styles',
      render: (text, record) => (
        <span>
          <span style={!state ? {cursor: 'not-allowed'} : {}}>
            <a disabled={!state}
              onClick={(e)=>{
                const value = {
                  ...typeId,
                  ...record,
                };
                this.props.dispatch(routerRedux.push(`/permissions/edits/${encodeURIComponent(JSON.stringify(value))}`));
                }}
            >
              <Icons disable={!state} edit={true}/>
            </a>
          </span>

          <span style={!state ? {cursor: 'not-allowed'} : {}}>
            <a disabled={!state}  style={{marginLeft:10}}
                onClick={
                  () => this.delRoleList(record.id)
                }
            >
              <Icons disable={!state} deleted={true}/>
            </a>
          </span>
        </span>
      ),
    }];

    return (
      <div>
        <Card
          bodyStyle={{padding: '0 32px'}}
          bordered={false}
        >


          <Query
            visible={visible}
            handelCancel={this.handelVisible}
            handleOk={this.handleOk}
            //handleReset={this.handleReset}
          >
            {/*{queryForm}*/}
          </Query>

          <Table
            loading={loading}
            rowKey={record => record.id}
            columns={columns}
            dataSource={roleManageList&&roleManageList.list}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />
        </Card>
      </div>
    );
  }
}
