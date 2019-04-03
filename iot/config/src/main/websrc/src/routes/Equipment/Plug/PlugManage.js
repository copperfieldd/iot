import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, DatePicker, Card, Modal} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import {formatParams} from "../../../utils/utils";
import Ellipsis from "../../../components/Ellipsis";
import Icons from "../../../components/Icon";

const FormItem = Form.Item;

@connect(({equipmentPlugin, loading}) => ({
  equipmentPlugin,
  loading: loading.effects['equipmentPlugin/fetch_pluginList_action'],
}))
@injectIntl
@Form.create()
export default class PlugManage extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentDidMount(){
    const {equipmentPlugin:{pluginList_params}} = this.props;
    this.loadEquipmentPluginList(pluginList_params);
  };


  loadEquipmentPluginList=(params)=>{
    this.props.dispatch({
      type:'equipmentPlugin/fetch_pluginList_action',
      payload:params,
    })
  };

  changeTableChange=(pagination)=>{
    const {equipmentPlugin:{pluginList_params}} = this.props;
    const params = {
      ...pluginList_params,
      start:(pagination.current -1) * pluginList_params.count
    };
    this.loadEquipmentPluginList(params);
  };

  delPlugin = (id) => {
    const {equipmentPlugin:{pluginList_params,pluginList},intl:{formatMessage}} =  this.props;
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
          type: 'equipmentPlugin/fetch_delPlugin_action',
          payload: params,
          params: formatParams(pluginList.value,pluginList_params),
        })
      }
    });

  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  //查询条件提交
  handleOk = (e) => {
    const {equipmentPlugin:{pluginList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...pluginList_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadEquipmentPluginList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentPlugin:{pluginList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: pluginList_params.count
    }
    this.loadEquipmentPluginList(values);
  };

  render() {
    const { visible } = this.state;
    const {equipmentPlugin:{pluginList_params,pluginList},loading,intl:{formatMessage}} = this.props;
    const paginationProps = {
      pageSize:pluginList_params.count,
      total:pluginList.totalCount,
      current:(pluginList_params.start / pluginList_params.count)+1,
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
          label={formatMessage(messages.equipmentInputPlugName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:pluginList_params.name
          })
          (
            <Input placeholder={formatMessage(messages.equipmentInputPlugNameInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.equipmentPlugName)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('type', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:pluginList_params.type
          })
          (
            <Input placeholder={formatMessage(messages.equipment_plug_name_input)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('username', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:pluginList_params.username
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
            initialValue: pluginList_params.startTime && moment(pluginList_params.startTime) || undefined
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
            initialValue: pluginList_params.endTime && moment(pluginList_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )

    const columns = [{
      title: formatMessage(messages.equipmentFilterName),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
      width:120,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.version),
      dataIndex: 'version',
      key: 'version',
      className:'table_row_styles',
      width:100
    },
    {
      title: formatMessage(messages.equipmentPlugName),
      dataIndex: 'type',
      key: 'type',
      className:'table_row_styles',
      width:100,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    },{
        title: <FormattedMessage {...basicMessages.describe} />,
        dataIndex: 'desc',
        key: 'desc',
        className:'table_row_styles',
        width:200,
        render:(text,record)=>(
          <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
        )
      },{
      title: formatMessage(basicMessages.creator),
      dataIndex:'username',
      key: 'username',
      className:'table_row_styles',
        width:120,
        render:(text,record)=>(
          <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
        )
    },{
      title: formatMessage(basicMessages.createTime),
      dataIndex:'createTime',
      key: 'createTime',
      className:'table_row_styles',
        width:120,
        render:(text,record)=>(
          <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
        )
    },{
      title: formatMessage(basicMessages.updateTime),
      dataIndex:'updateTime',
      key: 'updateTime',
      className:'table_row_styles',
        width:120,
        render:(text,record)=>(
          <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
        )
    },{
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className:'table_row_styles',
      width:'150px',
      render: (text, record) => (
        <span>
           <a onClick={()=>{
             const value = {
               id:record.id,
               status:record.status,
               username:record.username,
               createTime:record.createTime,
             };
             this.props.dispatch(routerRedux.push(`/equipment/plugManage/edit/${encodeURIComponent(JSON.stringify(value))}`));
           }}>
            <Icons edit={true}/>
          </a>

           <a style={{marginLeft:10}} onClick={()=>{
             this.delPlugin(record.id)
           }}>
            <Icons deleted={true}/>
          </a>
        </span>
      ),
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
            <div>
              <Button type='primary' icon='plus' onClick={()=>{
                this.props.dispatch(routerRedux.push('/equipment/plugManage/add'))
              }}>{formatMessage(messages.equipmentPlugAdd)}</Button>
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
            rowKey={record => record.id}
            dataSource={pluginList&&pluginList.value}
            columns={columns}
            loading={loading}
            pagination={paginationProps}
            onChange={this.changeTableChange}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
