import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import basicMessages from "../../../messages/common/basicTitle";
import { FormattedMessage, injectIntl } from 'react-intl';
import {formatParams} from "../../../utils/utils";
import Icons from "../../../components/Icon";
import messages from '../../../messages/statistics';
import opr_messages from "../../../messages/operation";
import Ellipsis from "../../../components/Ellipsis";


const FormItem = Form.Item;

@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_serviceListTable_action'],
}))
@injectIntl
@Form.create()
export default class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      visible:false,
      modalVisible:false,
    }
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  componentDidMount(){
    const {dataSti:{serviceListTable_params}} = this.props;
    this.loadChildService(serviceListTable_params);
  }

  loadChildService=(params)=>{
    this.props.dispatch({
      type:"dataSti/fetch_serviceListTable_action",
      payload:params,
    })
  }


  openModal=()=>{
    this.setState({
      modalVisible:!this.state.modalVisible
    })
  };

  del = (e,id) => {
    e.stopPropagation();
    const {intl:{formatMessage},dataSti:{serviceListTable_params,serviceListTable}} =  this.props;
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'dataSti/fetch_delStiService_action',
          payload: {id:id},
          params: formatParams(serviceListTable.list,serviceListTable_params),
        })
      }
    });

  };

  changeTablePage=(pagination)=>{
    const {dataSti:{serviceListTable_params}} = this.props;

    const params = {
      ...serviceListTable_params,
      start:(pagination.current -1)*serviceListTable_params.count,
    };
    this.loadChildService(params)
  };


  handleOk = (e) => {
    const {dataSti:{serviceListTable_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...serviceListTable_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadChildService(values);
      }
    })
  };


  //重置查询表单
  handleReset = () => {
    const {dataSti:{serviceListTable_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: serviceListTable_params.count
    };
    this.loadChildService(values);
  };



  render() {
    const {visible} = this.state;
    const {loading,intl:{formatMessage},dataSti:{serviceListTable_params,serviceListTable}} = this.props;

    const paginationProps = {
      pageSize:serviceListTable_params.count,
      total:serviceListTable.totalCount,
      current:(serviceListTable_params.start/serviceListTable_params.count)+1,
    };


    const columns = [{
      title: formatMessage(basicMessages.service),
      dataIndex: 'serviceName',
      key: 'serviceName ',
      className:'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.sti_service_domain),
      dataIndex: 'domain',
      key: 'domain',
      className:'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.creator),
      dataIndex: 'founderName',
      key: 'founderName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'createTime',
      key: 'createTime',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      dataIndex:'action',
      key: 'action',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>
          <a onClick={()=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/childService/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft:10}} onClick={(e)=>{
            this.del(e,record.id)
          }}>
             <Icons deleted={true}/>
          </a>
        </span>
      )
    }];


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

    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.service)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('serviceName', {
            rule:[
              {
                max:512,message:formatMessage(basicMessages.cannot_more_than_512)
              }
            ],
            initialValue:serviceListTable_params.serviceName
          })
          (
            <Input placeholder={formatMessage(opr_messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.sti_service_domain)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('domain', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:serviceListTable_params.domain
          })
          (
            <Input placeholder={formatMessage(messages.sti_service_domain_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('founderName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:serviceListTable_params.filter&&serviceListTable_params.filter.founderName
          })
          (
            <Input placeholder={formatMessage(basicMessages.creatorInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: serviceListTable_params.startTime && moment(serviceListTable_params.startTime) || undefined
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
            initialValue: serviceListTable_params.endTime && moment(serviceListTable_params.endTime) || undefined
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
            <Button icon={'plus'} type={'primary'} onClick={()=>{
              this.props.dispatch(routerRedux.push('/menuDataSti/childService/add'))
            }}>{formatMessage(messages.sti_service_add)}</Button>

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
          <Table
            rowKey={(record,index)=>record.id}
            dataSource={serviceListTable&&serviceListTable.list}
            columns={columns}
            pagination={paginationProps}
            loading={loading}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
