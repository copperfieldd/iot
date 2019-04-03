import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Modal} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';

@connect(({equipmentComponent, loading}) => ({
  equipmentComponent,
  loading: loading.effects['equipmentComponent/fetch_componentList_action'],
}))
@injectIntl
@Form.create()
export default class ComponentManage extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentDidMount(){
    const {equipmentComponent:{componentList_params}} = this.props;
    this.loadEquipmentComponent(componentList_params);
  };

  loadEquipmentComponent=(params)=>{
    this.props.dispatch({
      type:'equipmentComponent/fetch_componentList_action',
      payload:params,
    })
  };

  changTablePage=(pagination)=>{
    const {equipmentComponent:{componentList_params}} = this.props;
    const params = {
      ...componentList_params,
      start:(pagination.current -1) * componentList_params.count,
    };
    this.loadEquipmentComponent(params);
  };


  delComponent = (id) => {
    const {equipmentComponent:{componentList_params,componentList},intl:{formatMessage}} =  this.props;
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
          type: 'equipmentComponent/fetch_delComponent_action',
          payload: params,
          params: {
            ...componentList_params,
            start:componentList.value.length===1&&componentList_params.start-10>=0?componentList_params.start-10:componentList_params.start,
          },
        })
      }
    });

  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  }


  render() {
    const {visible} = this.state;
    const {equipmentComponent:{componentList,componentList_params},loading,intl:{formatMessage}} = this.props;
    const paginationProps = {
      pageSize:componentList_params.count,
      total:componentList.totalCount,
      current:(componentList_params.start / componentList_params.count) +1,
    };

    const columns = [{
      title: formatMessage(basicMessages.name),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
    }, {
      title: formatMessage(basicMessages.type),
      dataIndex: 'type',
      key: 'type',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.version),
      dataIndex: 'version',
      key: 'version',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.status),
      dataIndex:'status',
      key: 'status',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.creator),
      dataIndex:'username',
      key: 'username',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'createTime',
      key: 'createTime',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.updateTime),
      dataIndex:'updateTime',
      key: 'updateTime',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className:'table_row_styles',
      width:'230px',
      render: (text, record) => (
        <span>
          <Button type='primary'
                  onClick={()=>{
                    const value = {
                      id:record.id,
                      status:record.status,
                      createUsername:record.createUsername,
                      createTime:record.createTime,
                    };
                    this.props.dispatch(routerRedux.push(`/equipment/componentManage/edit/${encodeURIComponent(JSON.stringify(value))}`));}}
          >{formatMessage(basicMessages.modify)}</Button>
          <Button onClick={()=>this.delComponent(record.id)} style={{marginLeft:8}}>{formatMessage(basicMessages.delete)}</Button>
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
            <div>
              <Button type='primary' icon='plus' onClick={()=>{
                this.props.dispatch(routerRedux.push('/equipment/componentManage/add'))
              }}>{formatMessage(messages.equipmentComponentAdd)}</Button>

            </div>
            <div>
             <span className='search' onClick={() => {
               this.setState({
                 visible: true,
               })
             }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
            </div>
            <Query
              visible={visible}
              handelCancel={this.handelVisible}
              handleOk={this.handleOk}
              //handleReset={this.handleReset}
            >
              {/*{queryForm}*/}
            </Query>
          </div>
          <Table
            rowKey={record => record.id}
            dataSource={componentList&&componentList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changTablePage}
            loading={loading}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
