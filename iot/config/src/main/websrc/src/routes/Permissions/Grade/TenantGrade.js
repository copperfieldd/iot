import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Select, Card, Modal} from 'antd';
import styles from '../Permissions.less';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";

@connect(({permissionsGrade, loading}) => ({
  permissionsGrade,
  loading: loading.effects['permissionsGrade/fetch_gradeList_action'],
}))
@Form.create()
export default class TenantGrade extends Component {
  constructor() {
    super();
    this.state = {
      visible:false,
      details:null,
    }
  };

  componentDidMount(){
    const {permissionsGrade:{grade_params}} = this.props;
    this.loadTenantGradeList(grade_params)
  };

  //获取租户等级列表
  loadTenantGradeList=(params)=>{
    this.props.dispatch({
      type:'permissionsGrade/fetch_gradeList_action',
      payload:params,
    })
  };

  //删除租户等级列表
  delGradeList = (id) => {
    const {permissionsGrade: {grade_params}} = this.props;
    const params = {
      id: id,
    };
    Modal.confirm({
      title: '提示',
      content: '确定删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'permissionsGrade/fetch_delGrade_action',
          payload: params,
          params: grade_params,
        })
      }
    });
  };

  //表格分页
  changeTablePage = (pagination) => {
    const {permissionsGrade: {grade_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...grade_params,
      start: start,
    };
    this.loadApiList(params);
  };


  render() {
    const {visible} = this.state;
    const {permissionsGrade:{grade_params,gradeList},loading} = this.props;

    const paginationProps = {
      pageSize: grade_params.count,
      total: gradeList.totalCount,
      current: (grade_params.start / grade_params.count) + 1,
    };

    const columns = [{
      title: '等级名称',
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',

    }, {
      title: '描述',
      dataIndex: 'remarks',
      key: 'remarks',
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
            this.props.dispatch(routerRedux.push(`/permissions/tenantGrade/edit/${record.id}`))
          }}>修改</Button>
          <Button
            style={{marginLeft:10}}
            onClick={()=>this.delGradeList(record.id)}
          >删除</Button>
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
              this.props.dispatch(routerRedux.push('/permissions/tenantGrade/add'))
            }}>新增等级</Button>

            <div>
              <span className='search' onClick={() => {
                this.setState({
                  visible: true,
                })
              }}><Icon className='query_icon' type="search"/>筛选</span>
            </div>
          </div>
          <Query
            visible={visible}
            //handelCancel={this.handelVisible}
            handleOk={this.handleOk}
            //handleReset={this.handleReset}
          >
            {/*{queryForm}*/}
          </Query>


          <Table
            rowKey={record => record.id}
            loading={loading}
            dataSource={gradeList&&gradeList.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
