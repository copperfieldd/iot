import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Select, Card, Divider, Modal,Row,Col} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import ExportModal from "../../../components/ExportModal";
import {formatParams} from '../../../utils/utils';
import Ellipsis from "../../../components/Ellipsis";

const FormItem = Form.Item;

@connect(({equipmentManage, loading}) => ({
  equipmentManage,
  loading: loading.effects['equipmentManage/fetch_deviceImportItem_action'],
  exportLoading:loading.effects['equipmentManage/fetch_tokenExport_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentManageImportItem extends Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys:[],
    }
  };

  componentDidMount(){
    const {equipmentManage:{deviceImportItem_params},match:{params:{id}}} = this.props;
    const params = {
      ...deviceImportItem_params,
      id:id
    };
    this.loadEquipmentPreviewList(params);
  }

  loadEquipmentPreviewList=(params)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceImportItem_action',
      payload:params,
    })
  };

  changeTablePage=(pagination)=>{
    const {equipmentManage:{deviceImportItem_params}} = this.props;
    const params = {
      ...deviceImportItem_params,
      start:(pagination.current-1)*deviceImportItem_params.count,
    };
    this.loadEquipmentPreviewList(params)
  };

  
  render() {
    const {equipmentManage:{deviceImportItem_params,deviceImportItem},loading,intl:{formatMessage},history} = this.props;
    const paginationProps = {
      pageSize:deviceImportItem_params.count,
      total:deviceImportItem.totalCount,
      current:(deviceImportItem_params.start / deviceImportItem_params.count) +1,
    };

    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };



    const columns = [{
      title: formatMessage(messages.equipmentName),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title:formatMessage(messages.equipmentDeviceConfig),
      dataIndex: 'deviceSettingName',
      key: 'deviceSettingName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.creator),
      dataIndex: 'username',
      key: 'username',
      className:'table_row_styles',
      render:()=>(
        <span>{deviceImportItem&&deviceImportItem.username}</span>
      )
    },{
      title: formatMessage(basicMessages.status),
      dataIndex: 'status',
      key: 'status',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.describe),
      dataIndex:'desc',
      key: 'desc',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'createTime',
      key: 'createTime',
      className:'table_row_styles',
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
          <Form style={{marginTop:20}}>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage(basicMessages.name)}
                  style={{marginBottom: 8}}
                >
                  {getFieldDecorator('name', {
                    initialValue:deviceImportItem&&deviceImportItem.name
                  })(
                    <Input disabled/>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage(basicMessages.describe)}
                  style={{marginBottom: 8}}
                >
                  {getFieldDecorator('desc', {
                    initialValue:deviceImportItem&&deviceImportItem.desc
                  })(
                    <Input disabled/>
                  )}
                </FormItem>
              </Col>
            </Row>


          </Form>

          <Table
            rowKey={record => record.id}
            pagination={paginationProps}
            dataSource={deviceImportItem&&deviceImportItem.value}
            onChange={this.changeTablePage}
            loading={loading}
            columns={columns}

          />



        </Card>
        <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
          <Button
                  onClick={()=>{
                    history.goBack(-1);
                  }}
          >{formatMessage(basicMessages.return)}</Button>
        </div>
      </PageHeaderLayout>
    );
  }
}
