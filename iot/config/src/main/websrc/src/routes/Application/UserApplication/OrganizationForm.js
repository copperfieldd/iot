import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { Table, Button, Form, Card,Row,Col } from 'antd';
import styles from '../Application.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";



@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class OrganizationForm extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentWillMount() {
  };

  changeVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };


  render() {
    const {history} = this.props;
    const pagenationProps={
      pageSize:5,
    };
    const columns = [{
      title: '接收人',
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',

    },{
      title: '接收状态',
      dataIndex: 'time',
      key: 'time',
      className:'table_row_styles',
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >
          <Card
            title={
              <span style={{color: '#3f89e1'}}>消息明细</span>
            }
          >
            <Row>
              <Col span={6}>
                应用名称：OA办公
              </Col>
              <Col span={6}>
                消息状态：发送中
              </Col>
              <Col span={6}>
                推送类型：短信邮件
              </Col>
              <Col span={6}>
                创建时间：2017 07/30 20:22:20
              </Col>
            </Row>
            <Row style={{margin:'30px 0 50px'}}>
              消息内容：展示系统中的已发送的和未发送的消息推送任务列表、主要字段包括应用名称，推送内容，推送类型，消息状态和创建时间
            </Row>


            <Table
              rowKey={record => record.id}
              columns={columns}
              dataSource={data}
              pagination={pagenationProps}
            />

          </Card>
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>

            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >返回</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
