import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../Application.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { getLoginUserType,count } from '../../../utils/utils'
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/application';
import basicMessages from '../../../messages/common/basicTitle';
import Icons from "../../../components/Icon";


const FormItem = Form.Item;
@connect(({application, loading}) => ({
  application,
  loading: loading.effects['application/fetch_terminalUserList_action'],
}))
@injectIntl
@Form.create()
export default class TerminalList extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
    const {application:{terminalUserList_params}} = this.props;
    this.loadTerminalList(terminalUserList_params);
  }

  loadTerminalList=(params)=>{
    this.props.dispatch({
      type:'application/fetch_terminalUserList_action',
      payload:params,
    })
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible
    })
  };


  changeTablePage=(pagination)=>{
    const {application:{terminalUserList_params}} = this.props;
    const params = {
      ...terminalUserList_params,
      start:(pagination.current - 1 ) * terminalUserList_params.count,
    };
    this.loadTerminalList(params);
  };


  delTerminalUser=(id)=>{
    const {application:{terminalUserList_params,terminalUserList},intl:{formatMessage}} = this.props;
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type:'application/fetch_deletePlateManager_action',
          payload:{id:id},
          params:{
            ...terminalUserList_params,
            start:terminalUserList.list.length===1&&terminalUserList_params.start-10>=0?terminalUserList_params.start-10:terminalUserList_params.start
          },
        })
      }
    });
  };


  //查询条件提交
  handleOk = (e) => {
    const {application:{terminalUserList_params},intl:{formatMessage}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if(!err){
        const values = {
          ...terminalUserList_params,
          start: 0,
          filter:{
            userName:fieldsValue.userName,
            telephone:fieldsValue.telephone,
            appName:fieldsValue.appName,
            tenantName:fieldsValue.tenantName,
            creatorName:fieldsValue.creatorName,
            createTime:{
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          },

        };
        this.loadTerminalList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: count
    };
    this.loadTerminalList(values);
  };



  render() {
    const userType = getLoginUserType()!==3?true:false;
    const {visible} = this.state;
    const {application:{terminalUserList,terminalUserList_params},loading,intl:{formatMessage}} = this.props;
    const paginationProps = {
      pageSize:terminalUserList_params.count,
      total:terminalUserList.totalCount,
      current:(terminalUserList_params.start/terminalUserList_params.count)+1,
    };

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
          label={formatMessage(basicMessages.username)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('userName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:terminalUserList_params.filter&&terminalUserList_params.filter.userName
          })
          (
            <Input placeholder={formatMessage(basicMessages.user_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.phone)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('telephone', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:terminalUserList_params.filter&&terminalUserList_params.filter.telephone
          })
          (
            <Input placeholder={formatMessage(basicMessages.telephoneInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.applicationName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('appName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:terminalUserList_params.filter&&terminalUserList_params.filter.appName
          })
          (
            <Input placeholder={formatMessage(basicMessages.applicationNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.tenantName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('tenantName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:terminalUserList_params.filter&&terminalUserList_params.filter.tenantName
          })
          (
            <Input placeholder={formatMessage(basicMessages.tenantName_input)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('creatorName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:terminalUserList_params.filter&&terminalUserList_params.filter.creatorName
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
            initialValue: terminalUserList_params.filter&&terminalUserList_params.filter.createTime&&terminalUserList_params.filter.createTime.startTime && moment(terminalUserList_params.filter.createTime.startTime) || undefined
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
            initialValue: terminalUserList_params.filter&&terminalUserList_params.filter.createTime&&terminalUserList_params.filter.createTime.endTime && moment(terminalUserList_params.filter.createTime.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );

    const columns = [{
      title: formatMessage(messages.terUserName),
      dataIndex: 'userName',
      key: 'userName',
      className:'table_row_styles',

    }, {
      title: formatMessage(basicMessages.loginName),
      dataIndex: 'loginName',
      key: 'loginName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.telephone),
      dataIndex: 'telephone',
      key: 'telephone',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.applicationName),
      dataIndex:'appName',
      key: 'appName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex:'tenantName',
      key: 'tenantName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.creator),
      dataIndex:'creatorName',
      key: 'creatorName',
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
          <span style={userType?{cursor:'not-allowed'}:{}}>
            <a disabled={userType}
              onClick={(e)=>{
                this.props.dispatch(routerRedux.push(`/application/terminalCustomer/edit/${encodeURIComponent(JSON.stringify(record))}`))
              }}
            >
              <Icons edit={true} disable={userType}/>
            </a>
          </span>
          <a style={{marginLeft:10}}
             onClick={() => {
               this.props.dispatch(routerRedux.push(`/application/terminalCustomer/item/${encodeURIComponent(JSON.stringify(record))}`))
             }}
          >
            <Icons item={true}/>
          </a>
          <span style={userType?{cursor:'not-allowed'}:{}}>
            <a disabled={userType}  style={{marginLeft:10}}
                onClick={() =>
                  this.delTerminalUser(record.id)
                }
            >
               <Icons deleted={true} disable={userType}/>
            </a>
          </span>
        </span>
      )
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
            <Button disabled={userType} type='primary' icon='plus' onClick={()=>{
              this.props.dispatch(routerRedux.push('/application/terminalCustomer/add'))
            }}>{formatMessage(messages.terAdd)}</Button>

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
            rowKey={record => record.id}
            dataSource={terminalUserList&&terminalUserList.list}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
