import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { injectIntl } from 'react-intl';
import messages from '../../../messages/statistics';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Icons from "../../../components/Icon";
import Ellipsis from "../../../components/Ellipsis";
import opr_messages from "../../../messages/operation";

const FormItem = Form.Item;

@injectIntl
@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_analyticList_action'],
}))
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


  openModal=()=>{
    this.setState({
      modalVisible:!this.state.modalVisible
    })
  };
  componentDidMount(){
    const {dataSti:{analytic_params}} = this.props;
    this.loadScript(analytic_params)
  };

  loadScript=(params)=>{
    this.props.dispatch({
      type:"dataSti/fetch_analyticList_action",
      payload:params
    })
  }



  del = (e,id) => {
    e.stopPropagation();
    const {intl:{formatMessage},dataSti:{analytic_params,analyticList}} = this.props;

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
          type: 'dataSti/fetch_delAnalytic_aciton',
          payload: params,
          params: formatParams(analyticList.list,analytic_params),
        })
      }
    });

  };


  changeTablePage=(pagination)=>{
    const {dataSti:{analytic_params}} = this.props;
    const params = {
      ...analytic_params,
      start:(pagination.current -1) * analytic_params.count
    };
    this.loadScript(params);
  };

  handleOk = (e) => {
    const {dataSti:{analytic_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...analytic_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadScript(values);
      }
    })
  };


  //重置查询表单
  handleReset = () => {
    const {dataSti:{analytic_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: analytic_params.count
    };
    this.loadScript(values);
  };


  render() {
    const {visible} = this.state;
    const {intl:{formatMessage},dataSti:{analyticList,analytic_params}} = this.props;

    const paginationProps = {
      pageSize:analytic_params.count,
      total:analyticList.totalCount,
      current:(analytic_params.start / analytic_params.count)+1,
    };

    const columns = [{
      title: formatMessage(basicMessages.service),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className:'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.sti_script_name),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
      width:260,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(messages.sti_script_tag),
      dataIndex: 'tag',
      key: 'tag',
      className:'table_row_styles',
      width:260,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
      title: formatMessage(basicMessages.updateTime),
      dataIndex:'updateTime',
      key: 'updateTime',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.operations),
      dataIndex:'action',
      key: 'action',
      className:'table_row_styles',
      render:(text,record)=>(
        <span>
          <a onClick={()=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/scriptManage/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft:10}} onClick={()=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/scriptManage/item/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons item={true}/>
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
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:analytic_params.serviceName
          })
          (
            <Input placeholder={formatMessage(opr_messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.sti_script_tag)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('tag', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:analytic_params.tag
          })
          (
            <Input placeholder={formatMessage(messages.sti_script_tag_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.sti_script_name)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:analytic_params.name
          })
          (
            <Input placeholder={formatMessage(messages.sti_script_name_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: analytic_params.startTime && moment(analytic_params.startTime) || undefined
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
            initialValue: analytic_params.endTime && moment(analytic_params.endTime) || undefined
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
              this.props.dispatch(routerRedux.push('/menuDataSti/scriptManage/add'))
            }}>{formatMessage(messages.sti_add_script)}</Button>

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
            dataSource={analyticList.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
