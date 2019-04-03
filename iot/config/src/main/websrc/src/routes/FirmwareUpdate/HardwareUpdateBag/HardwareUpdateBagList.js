import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Modal, Input,Select} from 'antd';
import styles from '../FirmwareUpdate.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from "../../../utils/utils";
import Icons from "../../../components/Icon";
import Ellipsis from "../../../components/Ellipsis";
import messages from "../../../messages/firmware";

const FormItem = Form.Item;
const Option = Select.Option;


@connect(({hardwareUpdateBag, loading}) => ({
  hardwareUpdateBag,
  loading: loading.effects['hardwareUpdateBag/fetch_getUpgradePackageHardWare_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateBagList extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
    const {hardwareUpdateBag:{getUpgradePackageHardWare_params}} = this.props;
    this.loadHardWareUpdateBag(getUpgradePackageHardWare_params);
  };

  loadHardWareUpdateBag=(params)=>{
    this.props.dispatch({
      type:'hardwareUpdateBag/fetch_getUpgradePackageHardWare_action',
      payload:params,
    })
  };


  onChangeTablePage=(pagination)=>{
    const {hardwareUpdateBag:{getUpgradePackageHardWare_params}} = this.props;
    const params = {
      ...getUpgradePackageHardWare_params,
      start:(pagination.current - 1)*getUpgradePackageHardWare_params.count,
    };
    this.loadHardWareUpdateBag(params);
  };


  del = (id) => {
    const {hardwareUpdateBag:{getUpgradePackageHardWare_params,getUpgradePackageHardWare},intl:{formatMessage}} =  this.props;
    const params = {
      id: [id,]
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'hardwareUpdateBag/fetch_delHardwarePackage_action',
          payload: params,
          params: {
            ...getUpgradePackageHardWare_params,
            start:getUpgradePackageHardWare.list.length===1&&getUpgradePackageHardWare_params.start-10>=0?getUpgradePackageHardWare_params.start-10:getUpgradePackageHardWare_params.start,
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

  //查询条件提交
  handleOk = (e) => {
    const {hardwareUpdateBag:{getUpgradePackageHardWare_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...getUpgradePackageHardWare_params,
          start: 0,
          ...fieldsValue,
          //startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          //endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadHardWareUpdateBag(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {hardwareUpdateBag:{getUpgradePackageHardWare_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: getUpgradePackageHardWare_params.count,
      type: getUpgradePackageHardWare_params.type
    };
    this.loadHardWareUpdateBag(values);
  };


  render() {
    const {hardwareUpdateBag:{getUpgradePackageHardWare_params,getUpgradePackageHardWare},intl:{formatMessage},loading} = this.props;
    let userType = getLoginUserType();

    const {visible} = this.state;
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
    };
    const paginationProps = {
      pageSize:getUpgradePackageHardWare_params.count,
      total:getUpgradePackageHardWare.totalCount,
      current:(getUpgradePackageHardWare_params.start / getUpgradePackageHardWare_params.count) + 1,
    };
    let index = {title: formatMessage(basicMessages.serial), dataIndex: 'index', key: 'index', className: 'table_row_styles',width:'70px',render:(text,record,index)=>(
        <span>{index+1}</span>
      )
    };
    let tenant = { title: formatMessage(basicMessages.tenant) , dataIndex: 'tenantName', key: 'tenantName', className:'table_row_styles',width:100,render:(text,record)=>(
        <Ellipsis tooltip={record.tenantName} lines={1}><span style={{display:'block'}}>{record.tenantName}</span></Ellipsis>
      )};
    let app = {title: formatMessage(basicMessages.application), dataIndex: 'applicationName', key: 'applicationName', className:'table_row_styles',width:100,render:(text,record)=>(
        <Ellipsis tooltip={record.applicationName} lines={1}>{record.applicationName}</Ellipsis>
      )};
    let updateBagNum = {title: formatMessage(messages.firm_package_number), dataIndex:'id', key: 'id', className:'table_row_styles',width:110,render:(text,record)=>(
        <Ellipsis tooltip={record.id} lines={1}><span style={{display:'block'}}>{record.id}</span></Ellipsis>
      )};
    let updateBagName = { title: formatMessage(messages.firm_package_name), dataIndex:'packageName', key: 'packageName', className:'table_row_styles',width:110,render:(text,record)=>(
        <Ellipsis tooltip={record.packageName} lines={1}><span style={{display:'block'}}>{record.packageName}</span></Ellipsis>
      )};
    let version = { title: formatMessage(basicMessages.version), dataIndex:'packageVersion', key: 'packageVersion', className:'table_row_styles',width:90,render:(text,record)=>(
        <Ellipsis tooltip={record.packageVersion} lines={1}><span style={{display:'block'}}>{record.packageVersion}</span></Ellipsis>
      )};
    let bagBig = { title: formatMessage(basicMessages.size), dataIndex:'packageSize', key: 'packageSize', className:'table_row_styles',width:60,render:(text,record)=>(
        <span>{record.packageSize}</span>
      )};
    let updateBagAddress= { title: formatMessage(messages.package_address), dataIndex:'packageUrl', key: 'packageUrl', className:'table_row_styles',width:110,render:(text,record)=>(
        <Ellipsis tooltip={record.packageUrl} lines={1}><span style={{display:'block'}}>{record.packageUrl}</span></Ellipsis>
      )};
    let updateTime= { title: formatMessage(basicMessages.update_time), dataIndex:'updateTime', key: 'updateTime', className:'table_row_styles',width:90,render:(text,record)=>(
        <Ellipsis tooltip={moment(record.updateTime).format('YYYY/MM/DD HH:mm:ss')} lines={1}><span style={{display:'block'}}>{moment(record.updateTime).format('YYYY/MM/DD HH:mm:ss')}</span></Ellipsis>
      )};
    let remark= { title: formatMessage(basicMessages.remarks), dataIndex:'comments', key: 'comments', className:'table_row_styles',width:100,render:(text,record)=>(
        <Ellipsis tooltip={record.comments} lines={1}><span style={{display:'block'}}>{record.comments}</span></Ellipsis>
      )};
    //state	升级状态(0：未开始；1：升级中；2：暂停；3：已完成；4：终止)
    let updateStatus= { title: formatMessage(messages.firm_upgrade_state), dataIndex:'state', key: 'state', className:'table_row_styles',width:90,
      render:(text,record)=>(
        <div>
          <span>
            {record.success!==0||record.failed!==0?
              <div>
                <div>
                  <a onClick={()=>{
                    this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdateBag/updateSuccess/${record.id}`))
                  }}>
                    {formatMessage(basicMessages.success)}：{record.success}
                  </a>
                </div>
                <div>
                  <a onClick={()=>{
                  this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdateBag/updateFails/${record.id}`))
                }}>
                    {formatMessage(basicMessages.fail)}：{record.failed}
              </a>
                </div>
              </div>:record.state===0?formatMessage(messages.firm_no_begin):record.state===1?formatMessage(messages.firm_upgrading):record.state===2?formatMessage(basicMessages.suspend):record.state===3?formatMessage(basicMessages.finished):formatMessage(basicMessages.end)

            }
          </span>

        </div>)};
    let downloadUpdateBag= { title: formatMessage(basicMessages.download), key: 'action', className:'table_row_styles', width:'80px',
      render: (text, record) => (
        <span>
           <a onClick={()=>{
             window.open(`http://${record.packageUrl}`)
           }}>
            <Icons download={true}/>
          </a>
        </span>
      )};
    let operations = {title:formatMessage(basicMessages.operations),key:'operations',className:'table_row_styles',width:120,
      render: (text, record) => (
        <span>
           <a onClick={()=>{
             this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdateBag/update/${encodeURIComponent(JSON.stringify(record))}`))
           }}>
            <Icons edit={true}/>
          </a>

          <a style={{marginLeft:10}} onClick={()=>{
            this.del(record.id)
          }}>
            <Icons deleted={true}/>
          </a>

        </span>
      ),};

    const columns = userType===0?[index,tenant,app,updateBagNum,updateBagName,version,bagBig,updateBagAddress,updateTime,updateStatus,remark,downloadUpdateBag]:
      userType===1?[index,app,updateBagNum,updateBagName,version,bagBig,updateBagAddress,updateTime,updateStatus,remark,downloadUpdateBag]:
        [index,updateBagNum,updateBagName,version,bagBig,updateBagAddress,updateTime,updateStatus,operations,remark,downloadUpdateBag]
    ;

    const options = userType===0?[
      <Option key={0} value={0}>{formatMessage(basicMessages.tenantName)}</Option>,
      <Option key={1} value={1}>{formatMessage(basicMessages.applicationName)}</Option>,
      <Option key={2} value={2}>{formatMessage(messages.firm_package_name)}</Option>,
      <Option key={3} value={3}>{formatMessage(messages.firm_package_number)}</Option>,
      <Option key={4} value={4}>{formatMessage(basicMessages.remarks)}</Option>
    ]:userType===1?[
      <Option key={1} value={1}>{formatMessage(basicMessages.applicationName)}</Option>,
      <Option key={2} value={2}>{formatMessage(messages.firm_package_name)}</Option>,
      <Option key={3} value={3}>{formatMessage(messages.firm_package_number)}</Option>,
      <Option key={4} value={4}>{formatMessage(basicMessages.remarks)}</Option>
    ]:[
      <Option key={2} value={2}>{formatMessage(messages.firm_package_name)}</Option>,
      <Option key={3} value={3}>{formatMessage(messages.firm_package_number)}</Option>,
      <Option key={4} value={4}>{formatMessage(basicMessages.remarks)}</Option>
    ];


    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('queryType', {
            initialValue:getUpgradePackageHardWare_params.queryType
          })
          (
            <Select placeholder={formatMessage(basicMessages.please_select)} >
              {options}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            initialValue:getUpgradePackageHardWare_params.field
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)}/>
          )}
        </FormItem>
        {/*<FormItem*/}
          {/*{...formItemLayout}*/}
          {/*label={formatMessage(basicMessages.startTime)}*/}
          {/*style={{marginBottom: 8}}*/}
        {/*>*/}
          {/*{getFieldDecorator('startTime', {*/}
            {/*initialValue: getUpgradePackageHardWare_params.startTime && moment(getUpgradePackageHardWare_params.startTime) || undefined*/}
          {/*})*/}
          {/*(*/}
            {/*<DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>*/}
          {/*)}*/}
        {/*</FormItem>*/}


        {/*<FormItem*/}
          {/*{...formItemLayout}*/}
          {/*label={formatMessage(basicMessages.endTime)}*/}
          {/*style={{marginBottom: 8}}*/}
        {/*>*/}
          {/*{getFieldDecorator('endTime', {*/}
            {/*initialValue: getUpgradePackageHardWare_params.endTime && moment(getUpgradePackageHardWare_params.endTime) || undefined*/}
          {/*})*/}
          {/*(*/}
            {/*<DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>*/}
          {/*)}*/}
        {/*</FormItem>*/}
      </Form>
    )


    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px0 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            {userType===3?<Button type='primary' icon='plus' onClick={()=>{
              this.props.dispatch(routerRedux.push('/firmwareUpdate/hardwareUpdateBag/upload'));
            }}>{formatMessage(basicMessages.upload_package)}</Button>:<div></div>}

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
          <Table
            rowKey={(record,index)=>record.id}
            dataSource={getUpgradePackageHardWare&&getUpgradePackageHardWare.list}
            columns={columns}
            pagination={paginationProps}
            loading={loading}
            onChange={this.onChangeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
