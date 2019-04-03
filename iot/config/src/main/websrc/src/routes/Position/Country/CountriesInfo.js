import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, DatePicker, Card, Modal} from 'antd';
import styles from '../Position.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/position';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@connect(({position, loading}) => ({
  position,
  loading: loading.effects['position/fetch_countryList_action'],
}))
@injectIntl
@Form.create()
export default class CountriesInfo extends Component {
  constructor() {
    super();
    this.state = {
      visible: false
    }
  };

  componentDidMount() {
    const {position: {countryList_params}} = this.props;
    this.loadCountryList(countryList_params);
  }

  loadCountryList = (params) => {
    this.props.dispatch({
      type: 'position/fetch_countryList_action',
      payload: params,
    })
  };


  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };

  changeTablePage = (pagination) => {
    const {position: {countryList_params}} = this.props;
    const params = {
      ...countryList_params,
      start: (pagination.current - 1) * countryList_params.count,
    }
    this.loadCountryList(params);
  };


  delTypeList = (id) => {
    const {position: {countryList_params, countryList}, intl: {formatMessage}} = this.props;
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
          type: 'position/fetch_delCountry_action',
          payload: params,
          params: formatParams(countryList.list, countryList_params),
        })
      }
    });
  };


  handleOk = (e) => {
    const {position: {countryList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...countryList_params,
          start: 0,
          filter: {
            name: fieldsValue.name,
            code: fieldsValue.code,
            createTime: {
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          }
        };
        this.loadCountryList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {position: {countryList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: countryList_params.count
    };
    this.loadCountryList(values);
  };


  render() {
    const {position: {countryList_params, countryList}, loading, intl: {formatMessage}} = this.props;
    const paginationProps = {
      pageSize: countryList_params.count,
      total: countryList.totalCount,
      current: (countryList_params.start / countryList_params.count) + 1,
    }

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
          label={formatMessage(messages.country)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: countryList_params.filter && countryList_params.filter.name
          })
          (
            <Input placeholder={formatMessage(messages.countryInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.code)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('code', {
            rule: [{
              max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue: countryList_params.filter && countryList_params.filter.code
          })
          (
            <Input placeholder={formatMessage(messages.codeInput)}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: countryList_params.filter && countryList_params.filter.createTime && countryList_params.filter.createTime.startTime && moment(countryList_params.filter.createTime.startTime) || undefined
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
            initialValue: countryList_params.filter && countryList_params.filter.createTime && countryList_params.filter.createTime.endTime && moment(countryList_params.filter.createTime.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)}
                        style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const {visible} = this.state;
    const columns = [{
      title: formatMessage(messages.country),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',

    }, {
      title: formatMessage(messages.code),
      dataIndex: 'code',
      key: 'code',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>
          <a onClick={() => {
            this.props.dispatch(routerRedux.push(`/position/countriesInfo/edit/${encodeURIComponent(JSON.stringify(record))}`));
          }}>
            <Icons edit={true}/>
          </a>
          <a style={{marginLeft: 10}} onClick={() => {
            this.delTypeList(record.id)
          }}>
            <Icons deleted={true}/>
          </a>
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
            <Button type='primary' icon='plus' onClick={() => {
              this.props.dispatch(routerRedux.push('/position/countriesInfo/add'))
            }}>{formatMessage(messages.countryAdd)}</Button>

            <div>
              <span className='search' onClick={() => {
                this.setState({
                  visible: true,
                })
              }}><Icon className='query_icon' type="search"/>
                {formatMessage(basicMessages.filter)}
              </span>
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
            dataSource={countryList && countryList.list}
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
