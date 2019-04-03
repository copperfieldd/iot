import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, DatePicker} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import basicMessages from "../../../messages/common/basicTitle";
import messages from '../../../messages/statistics';
import {FormattedMessage, injectIntl} from 'react-intl';
import Icons from "../../../components/Icon";
import {formatParams} from "../../../utils/utils";
import opr_messages from "../../../messages/operation";
import Ellipsis from "../../../components/Ellipsis";

const FormItem = Form.Item;


@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_getStiDateList_action'],
}))
@injectIntl
@Form.create()
export default class Statistics extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      modalVisible: false,
    }
  };

  componentDidMount() {
    const {dataSti: {StiDateList_params}} = this.props;
    this.loadDataTable(StiDateList_params)
  }

  loadDataTable = (params) => {
    this.props.dispatch({
      type: 'dataSti/fetch_getStiDateList_action',
      payload: params,
    })
  }

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  openModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  };

  del = (id) => {
    const {dataSti: {StiDateList, StiDateList_params}} = this.props;
    const {intl: {formatMessage}} = this.props;
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
          type: 'dataSti/fetch_delDataTable_action',
          payload: params,
          params: formatParams(StiDateList.list,StiDateList_params),
        })
      }
    });
  };

  changTablePage = (pagination) => {
    const {dataSti: {StiDateList_params}} = this.props;
    const params = {
      ...StiDateList_params,
      start: (pagination.current - 1) * StiDateList_params.count,
    };
    this.loadDataTable(params)
  };


  handleOk = (e) => {
    const {dataSti:{StiDateList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...StiDateList_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadDataTable(values);
      }
    })
  };


  //重置查询表单
  handleReset = () => {
    const {dataSti:{StiDateList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: StiDateList_params.count
    };
    this.loadDataTable(values);
  };


  render() {
    const {visible} = this.state;
    const {intl: {formatMessage}, dataSti: {StiDateList, StiDateList_params},loading} = this.props;
    const paginationProps = {
      pageSize: StiDateList_params.count,
      current: (StiDateList_params.start / StiDateList_params.count) + 1,
      total: StiDateList.totalCount,
    }

    const columns = [{
      title: formatMessage(basicMessages.service),
      dataIndex: 'serviceName',
      key: 'serviceName',
      className: 'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )

    }, {
      title: formatMessage(messages.sti_table_name),
      dataIndex: 'collectionName',
      key: 'collectionName',
      className: 'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.sti_table_tag),
      dataIndex: 'collectionId',
      key: 'collectionId',
      className: 'table_row_styles',
      width:150,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(basicMessages.creator),
      dataIndex: 'founderName',
      key: 'founderName',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.updateTime),
      dataIndex: 'updateTime',
      key: 'updateTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={()=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/dataTable/edit/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft:10}} onClick={()=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/dataTable/item/${encodeURIComponent(JSON.stringify(record))}`))
          }}>
            <Icons item={true}/>
          </a>
          <a style={{marginLeft:10}} onClick={()=>{
            this.del(record.id)
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
            initialValue:StiDateList_params.serviceName
          })
          (
            <Input placeholder={formatMessage(opr_messages.serviceNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.sti_table_tag)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('collectionId', {
            initialValue:StiDateList_params.collectionId
          })
          (
            <Input placeholder={formatMessage(messages.sti_table_tag_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.sti_table_name)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('collectionName', {
            initialValue:StiDateList_params.collectionName
          })
          (
            <Input placeholder={formatMessage(messages.sti_table_name_input)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('founderName', {
            initialValue:StiDateList_params.filter&&StiDateList_params.filter.founderName
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
            initialValue: StiDateList_params.startTime && moment(StiDateList_params.startTime) || undefined
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
            initialValue: StiDateList_params.endTime && moment(StiDateList_params.endTime) || undefined
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
            <Button icon={'plus'} type={'primary'} onClick={() => {
              this.props.dispatch(routerRedux.push('/menuDataSti/dataTable/add'))
            }}>{formatMessage(messages.sti_table_add)}</Button>

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
            rowKey={(record, index) => record.id}
            dataSource={StiDateList.list}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changTablePage}
            loading={loading}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
