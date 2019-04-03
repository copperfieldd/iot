import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Select,
  Card,
  Table,
  Modal, Upload, DatePicker,message
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import DeviceTypeListModal from '../Modal/DeviceTypeListModal';
import styles from "../../Warning/Warning.less";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams, getUrl} from "../../../utils/utils";
import {getAuthority} from "../../../utils/authority";
import xlsx from "../../../assets/deviceImportTemplate.xlsx";
import * as routerRedux from "react-router-redux";
import Query from "../../../components/Query";
import Ellipsis from "../../../components/Ellipsis";

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const TextArea = Input.TextArea;

@connect(({equipmentManage, loading}) => ({
  equipmentManage,
  exportLoading:loading.effects['equipmentManage/fetch_exportReocrd_action'],
  loading: loading.effects['equipmentManage/fetch_deviceImportList_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentManageImport extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      checkedDeviceType: null,
    }
  };

  componentDidMount() {
    const {equipmentManage:{deviceImportList_params}} =  this.props;
    this.loadImportDetails(deviceImportList_params);
  }

  loadImportDetails = (params) => {
    this.props.dispatch({
      type: 'equipmentManage/fetch_deviceImportList_action',
      payload: params,
    })
  };




  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  handleChange=(fileList)=>{
    const { file: { response } } = fileList;
    const { dispatch } = this.props;

    if (response && response.status === 0) {
      const id = response.value.id;
      dispatch(routerRedux.push(`/equipment/equipmentManage/preview/${id}`))
    }else if(response && response.status !== 0){
      message.error(response.message)
    }
  };


  delExportDetails=(id)=>{
    const {equipmentManage:{deviceImportList_params,deviceImportList},intl:{formatMessage}} =  this.props;
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
          type: 'equipmentManage/fetch_delDeviceItem_action',
          payload: params,
          params: formatParams(deviceImportList.value,deviceImportList_params),
        })
      }
    });
  };

  changeTablePage=(pagination)=>{
    const {equipmentManage:{deviceImportList_params}} =  this.props;

    const params = {
      ...deviceImportList_params,
      start:(pagination.current -1)*10,
    }
    this.loadImportDetails(params)
  };

  //查询条件提交
  handleOk = (e) => {
    const {equipmentManage:{deviceImportList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...deviceImportList_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadImportDetails(values);
      }
    })
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentManage:{deviceImportList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: deviceImportList_params.count
    };
    this.loadImportDetails(values);
  };

  start=(id)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_exportReocrd_action',
      payload:{
        id:id
      }
    })
  };


  render() {
    const {history, equipmentManage: {deviceImportList,deviceImportList_params}, intl: {formatMessage},exportLoading,loading} = this.props;
    const {visible} = this.state;
    const token = getAuthority() && getAuthority().value && getAuthority().value.token || '';
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
      },
    };

    const {getFieldDecorator} = this.props.form;


    const paginationProps = {
      pageSize:deviceImportList_params.count,
      total:deviceImportList.totalCount,
      current:(deviceImportList_params.start / deviceImportList_params.count)+1
    }

    const columns = [{
      title: formatMessage(basicMessages.name),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
      width:170,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title:formatMessage(basicMessages.creator),
      dataIndex: 'username',
      key: 'username',
      className:'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.status),
      dataIndex: 'status',
      key: 'status',
      className:'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className:'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className:'table_row_styles',
      width:'290px',
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            onClick={()=>this.start(record.id)}
            //loading={exportLoading}
          >
            {formatMessage(basicMessages.export)}
          </Button>

          <Button
            style={{marginLeft:8}}
            type="primary"
            onClick={()=>{
              this.props.dispatch(routerRedux.push(`/equipment/equipmentManage/importItem/${record.id}`))
            }}
          >
            {formatMessage(basicMessages.details)}
          </Button>

          <Button style={{marginLeft:8}} onClick={(e)=>{
            e.stopPropagation();
            this.delExportDetails(record.id);
          }}>{formatMessage(basicMessages.delete)}</Button>
        </span>
      ),
    }];


    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.name)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:deviceImportList_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.input_name)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: deviceImportList_params.startTime && moment(deviceImportList_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('endTime', {
            initialValue: deviceImportList_params.endTime && moment(deviceImportList_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <div className='dlxB'>
            <div></div>
            <div>
                 <span className='search' onClick={() => {
                   this.setState({
                     visible: true,
                   })
                 }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
            </div>

          </div>
          <Query
            visible={visible}
            handelCancel={this.handelVisible}
            handleOk={this.handleOk}
            handleReset={this.handleReset}
          >
            {queryForm}
          </Query>
          <div style={{border:'dashed 1px #999',width:600,padding:'30px'}}>
            <span style={{fontSize: 14}}>
              <Upload
                action={getUrl("/deviceservice/api/file/upload")}
                onChange={this.handleChange}
                accept=".xls,.xlsx"
                headers={{
                  'Authorization': token
                }}
              >
                <Button type={'primary'}>{formatMessage(basicMessages.upload)}</Button>
              </Upload>
            </span>
            <div style={{marginTop:'30px'}}>
              {formatMessage(basicMessages.downloadTemplate)}
              <Button type="primary" href={xlsx}
                      style={{marginLeft: 12}}
              >{formatMessage(basicMessages.download)}</Button>
            </div>
          </div>


          <div style={{marginTop:20}}>
            <Table
              rowKey={record => record.id}
              columns={columns}
              dataSource={deviceImportList&&deviceImportList.value}
              pagination={paginationProps}
              onChange={this.changeTablePage}
              loading={loading}
            />
          </div>

          <div className='TxTCenter' style={{width: 500, margin: '30px auto'}}>
            <Button
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}
