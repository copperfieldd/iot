import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {count, getLoginUserType} from '../../../utils/utils'
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";
import ChangePasswordModal from "../../../components/ChangePassword";

const FormItem = Form.Item;

@connect(({platManage, loading}) => ({
  platManage,
  loading: loading.effects['platManage/fetch_getPlatMangerList_action'],
}))
@injectIntl
@Form.create()
export default class ApiManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      details: null,
      passwordVisible:false,
      userInfo:null,
    }
  };

  componentDidMount() {
    const {platManage: {platManager_params}} = this.props;

    this.loadApiList(platManager_params);
  }

  //获取API列表
  loadApiList = (params) => {
    this.props.dispatch({
      type: 'platManage/fetch_getPlatMangerList_action',
      payload: params,
    })
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  //表单的分页切换
  changeTablePage = (pagination) => {
    const {platManage: {platManager_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...platManager_params,
      start: start,
    };
    this.loadApiList(params);
  };


  //删除API
  delPlatList = (id) => {
    const {platManage: {platManager_params,platManagerList},intl:{formatMessage}} = this.props;
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
          type: 'platManage/fetch_deletePlateManager_action',
          payload: params,
          params: {
            ...platManager_params,
            start:platManagerList.list.length===1&&platManager_params.start-10>=0?platManager_params.start-10:platManager_params.start,
          },
        })
      }
    });
  };


  changePasswordVisible=()=>{
    this.setState({
      passwordVisible:!this.state.passwordVisible,
    })
  };



  //查询条件提交
  handleOk = (e) => {
    const {platManage:{platManager_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue)
      if (!err) {
        const values = {
          ...platManager_params,
          start: 0,
          filter:{
            loginName:fieldsValue.loginName,
            creatorName:fieldsValue.creatorName,
            createTime:{
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          },
        };
        this.loadApiList(values);
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
    this.loadApiList(values);
  };

  render() {
    const {platManage: {platManagerList, platManager_params}, loading,intl:{formatMessage}} = this.props;
    const userType = getLoginUserType()===0?true:false;
    const {visible,passwordVisible,userInfo} = this.state;
    const paginationProps = {
      pageSize: platManager_params.count,
      total: platManagerList.totalCount,
      current: (platManager_params.start / platManager_params.count) + 1,
    };

    const columns = [{
      title: formatMessage(basicMessages.administrator),
      dataIndex: 'loginName',
      key: 'loginName',
      className: 'table_row_styles',

    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'remarks',
      key: 'remarks',
      className: 'table_row_styles',
      width:250,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.creator),
      dataIndex: 'creatorName',
      key: 'creatorName',
      className: 'table_row_styles',

    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={(e)=>{
               e.stopPropagation();
               this.props.dispatch(routerRedux.push(`/customer/platManager/edit/${encodeURIComponent(JSON.stringify(record))}`))
             }}
          >
            <Icons edit={true}/>
          </a>

          <a style={{marginLeft: 10}}
             onClick={(e) => {
               e.stopPropagation();
               this.changePasswordVisible();
               this.setState({
                 userInfo:{
                   userId:record.id,
                   type:record.type,
                 },
               })
             }}
            >
            <Icons editPassword={true}/>
          </a>

          <a style={{marginLeft:10}}
             onClick={
               (e) => this.delPlatList(record.id)
             }
          >
             <Icons deleted={true}/>
          </a>
        </span>
      ),
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
          label={formatMessage(basicMessages.administrator)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('loginName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:platManager_params.filter&&platManager_params.filter.loginName
          })
          (
            <Input placeholder={formatMessage(messages.platManageName)} style={{width: '100%'}}/>
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
            initialValue:platManager_params.filter&&platManager_params.filter.creatorName
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
            initialValue: platManager_params.filter&&platManager_params.filter.createTime&&platManager_params.filter.createTime.startTime && moment(platManager_params.filter.createTime.startTime) || undefined
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
            initialValue: platManager_params.filter&&platManager_params.filter.createTime&&platManager_params.filter.createTime.endTime && moment(platManager_params.filter.createTime.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )
    
    return (

      <PageHeaderLayout>

          <div>
            <div className='topline_div_style'>
              <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
            </div>
            {userType?
            <Card
              bodyStyle={{padding: '6px 32px'}}
              bordered={false}
            >
              <div className='mrgTB12 dlxB'>
                <Button type='primary' icon='plus' onClick={() => {
                  this.props.dispatch(routerRedux.push(`/customer/platManager/add`))
                }}>{formatMessage(messages.newPlatManage)}</Button>

                <span className='search' onClick={() => {
                  this.setState({
                    visible: true,
                  })
                }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
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
                loading={loading}
                rowKey={(record, index) => record.id}
                columns={columns}
                dataSource={platManagerList && platManagerList.list}
                onChange={this.changeTablePage}
                pagination={paginationProps}
              />
            </Card>:<div style={{textAlign:'center',fontSize:'14px',marginTop:70}}>{formatMessage(basicMessages.no_authority)}</div> }
          </div>


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
