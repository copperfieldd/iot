import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import ChangePasswordModal from '../../../components/ChangePassword';

const FormItem = Form.Item;
import {getLoginUserType, count} from '../../../utils/utils';
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

@injectIntl
@connect(({tenantManage, loading,global}) => ({
  tenantManage,
  global,
  loading: loading.effects['tenantManage/fetch_tenantList_action'],
}))
@Form.create()
export default class TenantManage extends Component {
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
    const {tenantManage: {tenant_params}} = this.props;
    this.loadApiList(tenant_params);
  }

  //获取列表
  loadApiList = (params) => {
    this.props.dispatch({
      type: 'tenantManage/fetch_tenantList_action',
      payload: params,
    })
  };

  //表单的分页切换
  changeTablePage = (pagination) => {
    const {tenantManage: {tenant_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...tenant_params,
      start: start,
    };
    this.loadApiList(params);
  };

  //删除API
  delTenantManageList = (e, id) => {
    e.stopPropagation();
    const {tenantManage: {tenant_params, tenantList}, intl: {formatMessage}} = this.props;
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
          type: 'tenantManage/fetch_delTenantList_action',
          payload: params,
          params: {
            ...tenant_params,
            start: tenantList.list.length === 1 && tenant_params.start - 10 >= 0 ? tenant_params.start - 10 : tenant_params.start
          },
        })
      }
    });
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  //查询条件提交
  handleOk = (e) => {
    const {tenantManage: {tenant_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...tenant_params,
          start: 0,
          filter: {
            name: fieldsValue.name,
            gradeName: fieldsValue.gradeName,
            createTime: {
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
    }
    this.loadApiList(values);
  };

  changePasswordVisible=()=>{
    this.setState({
      passwordVisible:!this.state.passwordVisible,
    })
  };


  render() {
    const {tenantManage: {tenantList, tenant_params}, loading, intl: {formatMessage}} = this.props;
    const userType = getLoginUserType() !== 0 ? true : false;
    const {visible,passwordVisible,userInfo} = this.state;
    const {getFieldDecorator} = this.props.form;

    const paginationProps = {
      pageSize: tenant_params.count,
      total: tenantList.totalCount,
      current: (tenant_params.start / tenant_params.count) + 1,
    };

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
    const columns = [{
      title: <FormattedMessage {...messages.tenantName} />,
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width: 150,
      render: (text, record) => (
        <Ellipsis tooltip={record.name} lines={1}><span>{record.name}</span></Ellipsis>
      )
    }, {
      title: <FormattedMessage {...messages.tenantLoginName} />,
      dataIndex: 'loginName',
      key: 'loginName',
      className: 'table_row_styles',

    }, {
      title: <FormattedMessage {...messages.abbreviation} />,
      dataIndex: 'tag',
      key: 'tag',
      className: 'table_row_styles',
    }, {
      title: <FormattedMessage {...messages.category} />,
      dataIndex: 'gradeName',
      key: 'gradeName',
      className: 'table_row_styles',

    }, {
      title: <FormattedMessage {...basicMessages.createTime} />,
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: <FormattedMessage {...basicMessages.operations} />,
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a disabled={userType}
              onClick={(e) => {
                e.stopPropagation();
                this.props.dispatch(routerRedux.push(`/customer/tenantManage/edit/${encodeURIComponent(JSON.stringify(record))}`))
              }}
            >
              <Icons edit={true} disable={userType}/>
            </a>
          </span>

          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a style={{marginLeft: 10}} disabled={userType}
               onClick={(e) => {
                 e.stopPropagation();
                 this.changePasswordVisible();
                 this.setState({
                   userInfo:record,
                 })
               }}
            >
              <Icons editPassword={true} disable={userType}/>
            </a>
          </span>

          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a style={{marginLeft: 10}} disabled={userType}
               onClick={(e) => {
                 e.stopPropagation();
                 this.props.dispatch(routerRedux.push(`/customer/tenantManage/item/${encodeURIComponent(JSON.stringify(record))}`))
               }}
             >
               <Icons item={true} disable={userType}/>
            </a>
          </span>
          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a style={{marginLeft: 10}} disabled={userType}
               onClick={
                 (e) => this.delTenantManageList(e, record.id)
               }
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
          label={formatMessage(messages.tenantName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: tenant_params.filter && tenant_params.filter.name
          })
          (
            <Input placeholder={formatMessage(messages.tenantAddNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.category)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('gradeName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: tenant_params.filter && tenant_params.filter.gradeName
          })
          (
            <Input placeholder={formatMessage(messages.tenantAddCategoryInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: tenant_params.filter && tenant_params.filter.createTime && tenant_params.filter.createTime.startTime && moment(tenant_params.filter.createTime.startTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('endTime', {
            initialValue: tenant_params.filter && tenant_params.filter.createTime && tenant_params.filter.createTime.endTime && moment(tenant_params.filter.createTime.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
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
            <Button type='primary' disabled={userType} icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push(`/customer/tenantManage/add`))
            }}><FormattedMessage {...messages.tenantAdd} /></Button>

            <span className='search' onClick={() => {
              this.setState({
                visible: true,
              })
            }}><Icon className='query_icon' type="search"/><FormattedMessage {...basicMessages.filter} /></span>
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
            rowKey={record => record.id}
            columns={columns}
            dataSource={tenantList && tenantList.list}
            onChange={this.changeTablePage}
            pagination={paginationProps}
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
