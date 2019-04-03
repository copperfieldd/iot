import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, Select, DatePicker, Tooltip} from 'antd';
import styles from '../Application.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { getLoginUserType,count } from '../../../utils/utils'
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/application';
import basicMessages from '../../../messages/common/basicTitle';
import Icons from "../../../components/Icon";
import ChangePasswordModal from "../../../components/ChangePassword";


const FormItem = Form.Item;
const Option = Select.Option;

@connect(({application, loading}) => ({
  application,
  loading: loading.effects['application/fetch_appList_action'],
}))
@injectIntl
@Form.create()
export default class UserappList extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
    const {application:{appList_params}} = this.props;
    this.loadAppList(appList_params);

  }

  loadAppList=(params)=>{
    this.props.dispatch({
      type:'application/fetch_appList_action',
      payload:params,
    })
  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible
    })
  };

  changeTablePage=(pagination)=>{
    const {application:{appList_params}} = this.props;
    const params = {
      ...appList_params,
      start:(pagination.current-1)*10
    }
    this.loadAppList(params);
  };

  delApplication=(id)=>{
    const {application:{appList_params,appList},intl:{formatMessage}} = this.props;
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type:'application/fetch_delApplication_action',
          payload:{id:id},
          params:{
            ...appList_params,
            start:appList.list.length===1&&appList_params.start-10>=0?appList_params.start-10:appList_params.start
          },
        })
      }
    });
  };

  //查询条件提交
  handleOk = (e) => {
    const {application:{appList_params},intl:{formatMessage}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...appList_params,
          start: 0,
          filter:{
            name:fieldsValue.name,
            tenantName:fieldsValue.tenantName,
            creatorName:fieldsValue.creatorName,
            createTime:{
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          },
        };
        this.loadAppList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: count
    }
    this.loadAppList(values);
  };


  changePasswordVisible=()=>{
    this.setState({
      passwordVisible:!this.state.passwordVisible,
    })
  };



  render() {
    const userType = getLoginUserType()!==1?true:false;
    const {visible,passwordVisible,userInfo} = this.state;
    const {application:{appList,appList_params},loading,intl:{formatMessage}} = this.props;
    const paginationProps = {
      pageSize:appList_params.count,
      total:appList.totalCount,
      current:(appList_params.start/appList_params.count)+1,
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
          label={formatMessage(basicMessages.applicationName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:appList_params.filter&&appList_params.filter.name
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
            rule:[
              {
                max:512,message:formatMessage(basicMessages.cannot_more_than_512)
              }],
            initialValue:appList_params.filter&&appList_params.filter.tenantName
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
            rule:[
              {
                max:512,message:formatMessage(basicMessages.cannot_more_than_512)
              }],
            initialValue:appList_params.filter&&appList_params.filter.creatorName
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
            initialValue: appList_params.filter&&appList_params.filter.createTime.startTime && moment(appList_params.filter.createTime.startTime) || undefined
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
            initialValue: appList_params.filter&&appList_params.filter.createTime.endTime && moment(appList_params.filter.createTime.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const columns = [{
      title: formatMessage(messages.applicationName),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',

    }, {
      title: formatMessage(basicMessages.loginName),
      dataIndex: 'loginName',
      key: 'loginName',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.tenantName),
      dataIndex: 'tenantName',
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
            <a disabled={userType} onClick={()=>{
              this.props.dispatch(routerRedux.push(`/application/userApplication/edit/${encodeURIComponent(JSON.stringify(record))}`))
            }}>
              <Icons edit={true} disable={userType}/>
            </a>
          </span>
          <span style={userType?{cursor:'not-allowed'}:{}}>
           <a disabled={userType} style={{marginLeft: 10}}
              onClick={(e) => {
                e.stopPropagation()
                this.changePasswordVisible()
                this.setState({
                  userInfo:{
                    userId:record.userId,
                    type:record.type,
                  },
                })
              }}
           >
            <Icons editPassword={true} disable={userType}/>
          </a>
          </span>


          <a style={{marginLeft:10}} onClick={()=>{
            this.props.dispatch(routerRedux.push(`/application/userApplication/item/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons item={true}/>
          </a>
          <span style={userType?{cursor:'not-allowed'}:{}}>
            <a disabled={userType} style={{marginLeft:10}} onClick={()=>{
              this.delApplication(record.id)
            }}>
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
              this.props.dispatch(routerRedux.push('/application/userApplication/add'))
            }}>{formatMessage(messages.applicationAdd)}</Button>

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
            dataSource={appList&&appList.list}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.changeTablePage}

          />

        </Card>

        <ChangePasswordModal
          handleSubmit={(value)=>{
            this.props.dispatch({
              type:'global/fetch_changePassword_action',
              payload:value,
              callback:()=>{
                this.changePasswordVisible();
              }
            })
          }}
          userInfo={userInfo}
          visible={passwordVisible}
          onCancelModal={this.changePasswordVisible}
        />


      </PageHeaderLayout>
    );
  }
}
