import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Card, Modal, List, DatePicker} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import Ellipsis from "../../../components/Ellipsis";
import ExportModal from "../../../components/ExportModal";
import basicMessages from "../../../messages/common/basicTitle";
import {injectIntl } from 'react-intl';

const FormItem = Form.Item;
@connect(({equipmentManage, loading, equipmentData}) => ({
  equipmentManage,
  equipmentData,
  loading: loading.effects['equipmentManage/fetch_dataDataItem_action'],
}))
@injectIntl
@Form.create()
export default class DataManageItem extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      modalItemVisible: false,
    }
  };

  componentDidMount() {
    const {match: {params: {data}}, equipmentManage: {dataDataItem_params}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const dataValue = {
      ...dataDataItem_params,
      start:0,
      id: item.id,
    };
    this.loadDataItem(dataValue);
  }

  loadDataItem = (dataValue) => {
    this.props.dispatch({
      type: 'equipmentManage/fetch_dataDataItem_action',
      payload: dataValue,
      callback: (res) => {

      }
    })
  };
  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };
  

  changeModalItemVisible = () => {
    this.setState({
      modalItemVisible: !this.state.modalItemVisible,
    })
  };

  changeDataTablePage = (pagination) => {
    const {equipmentManage: {dataDataItem_params}} = this.props;
    const params = {
      ...dataDataItem_params,
      start: (pagination.current - 1) * dataDataItem_params.count,
    };
    this.loadDataItem(params);

  };


  onCancel = () => {
    this.setState({
      modalShowVisible: !this.state.modalShowVisible,
    })
  };


  //查询条件提交
  handleOk = (e) => {
    const {equipmentManage:{dataDataItem_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...dataDataItem_params,
          start: 0,
          ...fieldsValue,
          startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        this.loadDataItem(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {equipmentManage:{dataDataItem_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: dataDataItem_params.count
    }
    this.loadDataItem(values);
  };

  handleExport = (callback) => {
    const { dispatch, form:{ validateFields },equipmentManage:{dataDataItem_params} } = this.props;
    console.log(dataDataItem_params)
    validateFields((err, values) => {
      if(err) return;
      let params = {
        id:dataDataItem_params.id,
        startTime:dataDataItem_params.startTime,
        endTime:dataDataItem_params.endTime,
        ...values,
      }
      dispatch({
        type: 'equipmentManage/fetch_dataExport_action',
        payload:{
          id:dataDataItem_params.id,
          startTime:dataDataItem_params.startTime,
          endTime:dataDataItem_params.endTime,
          ...values,
        },
        callback:callback
      })
    });
  }
  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };



  render() {
    const {modalShowVisible,visible} = this.state;
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
    const {intl:{formatMessage}, match: {params: {data}}, equipmentManage: {dataDataItemList, dataDataItem_params}, loading, equipmentData: {deDataItem},exportLoading} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    let x;
    let deviceData = [];
    dataDataItemList && dataDataItemList.value.map((item) => {
      let obj = {id: item.id, time: item.createTime};
      for (x in item.value) {
        obj['key' + x] = item.value[x].key;
        obj['value' + x] = item.value[x].value;
        obj['type' + x] = item.value[x].type;
      }
      ;
      deviceData.push(obj)
    });
    const dataPaginationProps = {
      pageSize: dataDataItem_params.count,
      total: dataDataItemList && dataDataItemList.totalCount,
      current: (dataDataItem_params.start / dataDataItem_params.count) + 1,
    }
    const columns = [{
      title: 'Key',
      //colSpan:0,
      dataIndex: 'key0',
      key: '1',
      width: 30,
      className: 'table_row_styles bj3e',
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Value',
      dataIndex: 'value0',
      key: '2',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Key',
      dataIndex: 'key1',
      key: '3',
      width: 30,
      className: 'table_row_styles bj3e',
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Value',
      dataIndex: 'value1',
      key: '4',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Key',
      dataIndex: 'key2',
      key: '5',
      width: 30,
      className: 'table_row_styles bj3e',
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Value',
      dataIndex: 'value2',
      key: '6',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Key',
      dataIndex: 'key3',
      key: '7',
      width: 30,
      className: 'table_row_styles bj3e',
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Value',
      dataIndex: 'value3',
      key: '8',
      width: 120,
      className: 'table_row_styles',
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Key',
      dataIndex: 'key4',
      key: '9',
      width: 30,
      className: 'table_row_styles bj3e',
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: 'Value',
      dataIndex: 'value4',
      key: '10',
      className: 'table_row_styles',
      width: 120,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.uploadTime),
      dataIndex: 'time',
      key: 'time',
      className: 'table_row_styles',
      width: 100,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      className: 'table_row_styles',
      width: 30,
      render: (text, record) => (
        <span>
          <a onClick={(e) => {
            e.stopPropagation();
            this.onCancel();
            this.props.dispatch({
              type: 'equipmentData/fetch_deDataItem_action',
              payload: {
                id: record.id
              }
            })
          }}
          >{formatMessage(basicMessages.details)}</a>
         </span>
      ),
    }];


    const queryForm = (
      <Form>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: dataDataItem_params.startTime && moment(dataDataItem_params.startTime) || undefined
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
            initialValue: dataDataItem_params.endTime && moment(dataDataItem_params.endTime) || undefined
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
            <div className='dlxB mrgTB12' style={{marginBottom:12}}>
              <div>
                <ExportModal loading={exportLoading} handleExport={this.handleExport}
                             text={formatMessage(basicMessages.export)} form={this.props.form}/>

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
              bordered
              loading={loading}
              rowKey={record => record.id}
              dataSource={deviceData}
              columns={columns}
              pagination={dataPaginationProps}
              onChange={this.changeDataTablePage}
            />


          <Modal
            title={formatMessage(basicMessages.dataItem)}
            visible={modalShowVisible}
            className='dealModal_styles'
            width={500}
            onCancel={this.onCancel}
            footer={
              <div style={{textAlign: 'center'}}>
                <Button onClick={this.onCancel} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
              </div>
            }
          >
            <List
              className={styles.deviceList_styles}
              style={{height: 500, overflow: 'auto'}}
              bordered
              header={
                <div>
                  <span style={{width: 20}}>Key</span>
                  <span style={{width: 500, marginLeft: 20}}>Value</span>
                </div>
              }
              dataSource={deDataItem}
              renderItem={item => (<List.Item>
                <Ellipsis style={{width: 30}} tooltip={item.key} lines={1}><span
                  style={{width: 30, display: 'block'}}>{item.key}</span></Ellipsis>
                <Ellipsis style={{marginLeft: 20}} tooltip={item.value} lines={1}><span
                  style={{width: 300, display: 'block'}}>{item.value}</span></Ellipsis>
              </List.Item>)}
            />
          </Modal>
        </Card>
      </PageHeaderLayout>
    );
  }
}
