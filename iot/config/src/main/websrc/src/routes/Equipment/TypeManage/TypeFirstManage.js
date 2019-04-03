import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Modal, Input, DatePicker, Select} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";


const FormItem = Form.Item;
const Option = Select.Option;

@connect(({equipmentTypeManage, loading}) => ({
  equipmentTypeManage,
  loading: loading.effects['equipmentTypeManage/fetch_getFirstType_action'],
}))
@injectIntl
@Form.create()
export default class TypeFirstManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {equipmentTypeManage: {getFirstType_params}} = this.props;
    this.loadGetFirstType(getFirstType_params);
  };

  loadGetFirstType = (params) => {
    this.props.dispatch({
      type: 'equipmentTypeManage/fetch_getFirstType_action',
      payload: params
    })
  };


  onChangeTablePage = (pagination) => {
    const {equipmentTypeManage: {getFirstType_params}} = this.props;
    const params = {
      ...getFirstType_params,
      start: (pagination.current - 1) * getFirstType_params.count,
    };
    this.loadGetFirstType(params);
  };


  delType = (id) => {
    const {equipmentTypeManage: {getFirstType_params, getFirstType}, intl: {formatMessage}} = this.props;
    console.log(getFirstType)
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
          type: 'equipmentTypeManage/fetch_delFirstType_action',
          payload: params,
          params: {
            ...getFirstType_params,
            start: getFirstType.value.length === 1 && getFirstType_params.start - 10 >= 0 ? getFirstType_params.start - 10 : getFirstType_params.start,
          },
        })
      }
    });
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  //查询条件提交
  handleOk = (e) => {
    const {equipmentTypeManage: {getFirstType_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...getFirstType_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadGetFirstType(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentTypeManage: {getFirstType_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: getFirstType_params.count
    }
    this.loadGetFirstType(values);
  };


  render() {
    const {equipmentTypeManage: {getFirstType_params, getFirstType}, intl: {formatMessage},loading} = this.props;
    const userType = getLoginUserType() === 0 ? false : true;
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
      pageSize: getFirstType_params.count,
      total: getFirstType.totalCount,
      current: (getFirstType_params.start / getFirstType_params.count) + 1,
    };
    const columns = [{
      title: formatMessage(messages.equipmentType),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
      width:160,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },  {
      title: <FormattedMessage {...basicMessages.creator} />,
      dataIndex: 'username',
      key: 'username',
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
      width: '240px',
      render: (text, record) => (
        <span>

          <span style={userType?{cursor:'not-allowed'}:{}}>
            <a disabled={userType} onClick={() => {
              this.props.dispatch(routerRedux.push(`/equipment/TypeFirstManage/firstEdit/${encodeURIComponent(JSON.stringify(record))}`));
            }}>
              <Icons edit={true} disable={userType}/>
            </a>
          </span>

          <span style={userType?{cursor:'not-allowed'}:{}}>
             <a style={{marginLeft: 10}} disabled={userType} onClick={() => {
               this.delType(record.id)
             }}>
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
          label={formatMessage(messages.equipmentType)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: getFirstType_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipment_device_type_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: getFirstType_params.startTime && moment(getFirstType_params.startTime) || undefined
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
            initialValue: getFirstType_params.endTime && moment(getFirstType_params.endTime) || undefined
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
            <div>
              <Button disabled={userType} type='primary' icon='plus' onClick={() => {
                this.props.dispatch(routerRedux.push('/equipment/TypeFirstManage/firstAdd'));
              }}>{formatMessage(messages.equipmentTypeAdd)}</Button>
            </div>

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
            loading={loading}
            rowKey={record => record.id}
            dataSource={getFirstType && getFirstType.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.onChangeTablePage}
          />

          <div className='TxTCenter' style={{width:500,margin:'0px auto'}}>
            <Button
                    onClick={()=>{
                      this.props.dispatch(routerRedux.push(`/equipment/typeManage`))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
