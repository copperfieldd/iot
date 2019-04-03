import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider } from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
//import TenantManageModal from '../Modal/TenantManageModal';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;


@connect(({permissionsTenantManage, loading}) => ({
  permissionsTenantManage,
  loading: loading.effects['permissionsTenantManage/fetch_tenantList_action'],
}))
@Form.create()
export default class TenantManage extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };



  componentDidMount(){
    const {permissionsTenantManage:{tenant_params}} = this.props;
    this.loadTenantList(tenant_params)
  }

  loadTenantList=(params)=>{
    this.props.dispatch({
      type:'permissionsTenantManage/fetch_tenantList_action',
      payload:params,
    })
  };

  changTablePage=(pagination)=>{
    const {permissionsTenantManage:{tenant_params}} = this.props;
    const start = (pagination.current * 10) -1;
    const params = {
      ...tenant_params,
      start:start,
    };
    this.loadTenantList(params);
  };

  render() {
    const {permissionsTenantManage:{tenantList,tenant_params},loading} = this.props;

    const {visible,details} = this.state;

    const paginationProps = {
      pageSize:tenant_params.count,
      total:tenantList.totalCount,
      current:(tenant_params.start / tenant_params.count) +1,
    };

    const columns = [{
      title: '租户名称',
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',

    }, {
      title: '简称',
      dataIndex: 'gradeName',
      key: 'gradeName',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===1?'公开':'私有'}</span>
      )

    },{
      title: '租户等级',
      dataIndex: 'level',
      key: 'level',
      className:'table_row_styles',
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      className:'table_row_styles',
    },{
      title: '操作',
      key: 'action',
      className:'table_row_styles',
      render: (text, record) => (
        <span>
          <Button type='primary' onClick={()=>{
            this.props.dispatch(routerRedux.push(`//tenantManage/edit/${record.id}`))
          }}>修改</Button>
          <Button style={{marginLeft:10}}>删除</Button>
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
            <Button type='primary' icon='plus' onClick={()=>{
              this.props.dispatch(routerRedux.push('/permissions/tenantManage/add'))
            }}>新增租户</Button>

            <div>
              <span className='search' onClick={() => {
                this.setState({
                  visible: true,
                })
              }}><Icon className='query_icon' type="search"/>筛选</span>
            </div>
            <Query
              visible={visible}
              //handelCancel={this.handelVisible}
              handleOk={this.handleOk}
              //handleReset={this.handleReset}
            >
              {/*{queryForm}*/}
            </Query>



          </div>

          <Table
            loading={loading}
            rowKey={record => record.id}
            dataSource={tenantList&&tenantList.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changTablePage}
          />

        </Card>

      </PageHeaderLayout>
    );
  }
}
