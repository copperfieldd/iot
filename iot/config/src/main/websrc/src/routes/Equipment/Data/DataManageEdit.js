import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { Table, Button, Icon, Badge, Form, Card } from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";


@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class DataManageEdit extends Component {
  constructor() {
    super();
    this.state = {

    }
  };


  changeVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };


  render() {

    const columns = [{
      title: '接口名称',
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',

    }, {
      title: '描述',
      dataIndex: 'type',
      key: 'type',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>{text===1?'公开':'私有'}</span>
      )

    },{
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
      className:'table_row_styles',
    },{
      title: '操作',
      key: 'action',
      className:'table_row_styles',
      render: (text, record) => (
        <span>
      <a href="javascript:;">
        <Icon className='f14' onClick={()=>{
          this.changeVisible();
          this.setState({
            details:record,
          })
        }} type="form" theme="outlined" />
      </a>
      <Divider type="vertical" />
      <a href="javascript:;">
        <Icon className='f14' type="delete" theme="outlined" />
      </a>
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
        </Card>
      </PageHeaderLayout>
    );
  }
}
