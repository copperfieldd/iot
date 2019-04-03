import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card, Modal} from 'antd';
import {routerRedux} from 'dva/router';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {getLoginUserType, count} from '../../../utils/utils';
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import {Edit} from '../../../assets/icon/edit.png'
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@injectIntl
@connect(({tenantType, permissions, loading}) => ({
  tenantType,
  permissions,
  loading: loading.effects['tenantType/fetch_gradeList_action'],
}))
@Form.create()
export default class TenantGrade extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      details: null,
    }
  };

  componentDidMount() {
    const {tenantType: {grade_params}} = this.props;
    this.loadTenantGradeList(grade_params);
    this.loadModalApiList();

  };

  loadModalApiList = (params) => {
    this.props.dispatch({
      type: 'permissions/fetch_getAPIandMenu_action',
      payload: params,
    })
  };

  //获取租户等级列表
  loadTenantGradeList = (params) => {
    this.props.dispatch({
      type: 'tenantType/fetch_gradeList_action',
      payload: params,
      props: this.props,
    })
  };

  //删除租户等级列表
  delGradeList = (e, id) => {
    e.stopPropagation();
    const {tenantType: {grade_params, gradeList}, intl: {formatMessage}} = this.props;
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
          type: 'tenantType/fetch_delGrade_action',
          payload: params,
          params: {
            ...grade_params,
            start: gradeList.list.length === 1 && grade_params.start - 10 >= 0 ? grade_params.start - 10 : grade_params.start,
          },
        })
      }
    });
  };

  //表格分页
  changeTablePage = (pagination) => {
    const {tenantType: {grade_params}} = this.props;
    const start = 10 * (pagination.current - 1);
    const params = {
      ...grade_params,
      start: start,
    };
    this.loadTenantGradeList(params);
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  //查询条件提交
  handleOk = (e) => {
    const {tenantType: {grade_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...grade_params,
          start: 0,
          filter: {
            name: fieldsValue.name,
            creatorName: fieldsValue.creatorName,
            createTime: {
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            },
          },
        };
        this.loadTenantGradeList(values);
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
    this.loadTenantGradeList(values);
  };

  render() {
    const {visible} = this.state;
    const {tenantType: {grade_params, gradeList}, loading, intl: {formatMessage}} = this.props;
    const userType = getLoginUserType() !== 0 ? true : false;
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
      pageSize: grade_params.count,
      total: gradeList.totalCount,
      current: (grade_params.start / grade_params.count) + 1,
    };

    const columns = [{
      title: <FormattedMessage {...messages.typeName} />,
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width: 200,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )

    }, {
      title: <FormattedMessage {...basicMessages.describe} />,
      dataIndex: 'remarks',
      key: 'remarks',
      className: 'table_row_styles',
      width: 250,
      render: (text, record) => (
        <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
      )
    }, {
      title: <FormattedMessage {...basicMessages.creator} />,
      dataIndex: 'creatorName',
      key: 'creatorName',
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
                 this.props.dispatch(routerRedux.push(`/customer/tenantType/edit/${encodeURIComponent(JSON.stringify(record))}`))
               }}
            >
              <Icons edit={true} disable={userType}/>
            </a>
          </span>
          <span style={userType ? {cursor: 'not-allowed'} : {}}>
            <a disabled={userType} style={{marginLeft: 10}}
               onClick={(e) => {
                 e.stopPropagation();
                 this.props.dispatch(routerRedux.push(`/customer/tenantType/item/${encodeURIComponent(JSON.stringify(record))}`))
               }}
            >
              <Icons item={true} disable={userType}/>
            </a>
          </span>
          <span style={userType ? {cursor: 'not-allowed'} : {}}>
             <a style={{marginLeft: 10}} disabled={userType}
                onClick={(e) => this.delGradeList(e, record.id)}
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
          label={<FormattedMessage {...messages.typeName} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: grade_params.filter && grade_params.filter.name
          })
          (
            <Input placeholder={formatMessage(messages.typeAddName)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('creatorName', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: grade_params.filter && grade_params.filter.creatorName
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
            initialValue: grade_params.filter && grade_params.filter.createTime && grade_params.filter.createTime.startTime && moment(grade_params.filter.createTime.startTime) || undefined
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
            initialValue: grade_params.filter && grade_params.filter.createTime && grade_params.filter.createTime.endTime && moment(grade_params.filter.createTime.endTime) || undefined
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
            <Button disabled={userType} type='primary' icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push('/customer/tenantType/add'))
            }}><FormattedMessage {...messages.typeAdd} /></Button>

            <div>
              <span className='search' onClick={() => {
                this.setState({
                  visible: true,
                })
              }}><Icon className='query_icon' type="search"/><FormattedMessage {...basicMessages.filter} /></span>
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
            rowKey={(record) => record.id}
            loading={loading}
            dataSource={gradeList && gradeList.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
