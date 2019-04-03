import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Modal, Input, DatePicker} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from '../../../components/Icon';

const FormItem = Form.Item;

@connect(({equipmentAdapter, loading}) => ({
  equipmentAdapter,
  loading: loading.effects['equipmentAdapter/fetch_adapterList_action'],
}))
@injectIntl
@Form.create()
export default class AdapterManage extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
    const {equipmentAdapter:{adapter_params}} = this.props;
    this.loadAdapterList(adapter_params);
  };

  loadAdapterList=(params)=>{
    this.props.dispatch({
      type:'equipmentAdapter/fetch_adapterList_action',
      payload:params
    })
  };


  onChangeTablePage=(pagination)=>{
    const {equipmentAdapter:{adapter_params}} = this.props;
    const params = {
      ...adapter_params,
      start:(pagination.current - 1)*adapter_params.count,
    };
    this.loadAdapterList(params);
  };


  delAdapter = (id) => {
    const {equipmentAdapter:{adapter_params,adapterList},intl:{formatMessage}} =  this.props;
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
          type: 'equipmentAdapter/fetch_delAdapter_action',
          payload: params,
          params: {
            ...adapter_params,
            start:adapterList.value.length===1&&adapter_params.start-10>=0?adapter_params.start-10:adapter_params.start,
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

  //查询条件提交
  handleOk = (e) => {
    const {equipmentAdapter:{adapter_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...adapter_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadAdapterList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentAdapter:{adapter_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: adapter_params.count
    };
    this.loadAdapterList(values);
  };


  render() {
    const {equipmentAdapter:{adapter_params,adapterList},intl:{formatMessage}} = this.props;
    const userType = getLoginUserType()===0?false:true;
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
      pageSize:adapter_params.count,
      total:adapterList.totalCount,
      current:(adapter_params.start / adapter_params.count) + 1,
    };
    const columns = [{
      title: formatMessage(messages.adapterName),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
    }, {
      title: formatMessage(messages.version) ,
      dataIndex: 'version',
      key: 'version',
      className:'table_row_styles',
    },{
      title: <FormattedMessage {...basicMessages.creator} />,
      dataIndex:'username',
      key: 'username',
      className:'table_row_styles',
    },{
      title: <FormattedMessage {...basicMessages.createTime} />,
      dataIndex:'createTime',
      key: 'createTime',
      className:'table_row_styles',
    },{
      title: <FormattedMessage {...basicMessages.updateTime} />,
      dataIndex:'updateTime',
      key: 'updateTime',
      className:'table_row_styles',
    },{
      title: <FormattedMessage {...basicMessages.describe} />,
      dataIndex:'desc',
      key: 'desc',
      className:'table_row_styles',
      width:250,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: <FormattedMessage {...basicMessages.operations} />,
      key: 'action',
      className:'table_row_styles',
      width:'240px',
      render: (text, record) => (
        <span>
          <span style={userType?{cursor:'not-allowed'}:{}}>
            <a disabled={userType}
               onClick={()=>{
                 this.props.dispatch(routerRedux.push(`/equipment/adapterManage/edit/${record.id}`));
               }}
            >
              <Icons edit={true} disable={userType}/>
            </a>
          </span>
          <span style={userType?{cursor:'not-allowed'}:{}}>
            <a disabled={userType} style={{marginLeft:10}}
              onClick={()=>{
                this.delAdapter(record.id)
              }}
            >
              <Icons deleted={true} disable={userType}/>
            </a>
          </span>
        </span>
      ),
    }];

    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.adapterName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipment_adapter_input_name)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: adapter_params.startTime && moment(adapter_params.startTime) || undefined
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
            initialValue: adapter_params.endTime && moment(adapter_params.endTime) || undefined
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
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            <Button type='primary' disabled={userType} icon='plus' onClick={()=>{
              this.props.dispatch(routerRedux.push('/equipment/adapterManage/add'));
            }}>{formatMessage(messages.adapterAdd)}</Button>

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
            rowKey={record => record.id}
            dataSource={adapterList&&adapterList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.onChangeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
