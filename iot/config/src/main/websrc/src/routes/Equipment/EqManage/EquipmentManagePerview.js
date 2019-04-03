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

const FormItem = Form.Item;




@connect(({equipmentManage, loading}) => ({
  equipmentManage,
  loading: loading.effects['equipmentManage/fetch_deviceImportPerview_action'],
  importLoading:loading.effects['equipmentManage/fetch_devicesImport_action'],

}))
@injectIntl
@Form.create()
export default class EquipmentManagePerview extends Component {
  constructor() {
    super();
    this.state = {
      selectedRowKeys:[],
    }
  };

  componentDidMount(){
    const {equipmentManage:{deviceImportPerview_params},match:{params:{id}}} = this.props;
    const params = {
      ...deviceImportPerview_params,
      id:id
    }
    this.loadEquipmentPreviewList(params);
  }

  loadEquipmentPreviewList=(params)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceImportPerview_action',
      payload:params,
    })
  };

  changeTablePage=(pagination)=>{
    const {equipmentManage:{deviceImportPerview_params}} = this.props;
    const params = {
      ...deviceImportPerview_params,
      start:(pagination.current-1)*deviceImportPerview_params.count,
    };
    this.loadEquipmentPreviewList(params)
  };


  handleSubmit = (e) => {
    const {form,match:{params:{id}}} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          id:id,
        };
        this.props.dispatch({
          type:'equipmentManage/fetch_devicesImport_action',
          payload:value,
        })
      }
    });
  };

  render() {
    const {equipmentManage:{deviceImportPerview_params,deviceImportPerview},loading,intl:{formatMessage},history,importLoading} = this.props;
    const paginationProps = {
      pageSize:deviceImportPerview_params.count,
      total:deviceImportPerview.totalCount,
      current:(deviceImportPerview_params.start / deviceImportPerview_params.count) +1,
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

    }, {
      title: formatMessage(messages.equipmentDeviceConfig),
      dataIndex: 'deviceSettingName',
      key: 'deviceSettingName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.creator),
      dataIndex: 'username',
      key: 'username',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.describe),
      dataIndex:'desc',
      key: 'desc',
      className:'table_row_styles',
    },{
      title: 'Token',
      dataIndex:'token',
      key: 'token',
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

          <Table
            rowKey={record => record.id}
            pagination={paginationProps}
            dataSource={deviceImportPerview&&deviceImportPerview.value}
            onChange={this.changeTablePage}
            loading={loading}
            columns={columns}

          />


          <Form style={{marginTop:20}}>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label={formatMessage(basicMessages.name)}
                  style={{marginBottom: 8}}
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.input_name)
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.input_name)}/>
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
                    rules: [{
                      required: true, message: formatMessage(basicMessages.describeInput)
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(basicMessages.describeInput)}/>
                  )}
                </FormItem>
              </Col>
            </Row>


          </Form>
        </Card>
        <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
          <Button type='primary' loading={importLoading} onClick={(e)=>{
            this.handleSubmit(e);
          }}>{formatMessage(basicMessages.confirm)}</Button>
          <Button className='mrgLf20'
                  onClick={()=>{
                    history.goBack(-1);
                  }}
          >{formatMessage(basicMessages.return)}</Button>
        </div>
      </PageHeaderLayout>
    );
  }
}
