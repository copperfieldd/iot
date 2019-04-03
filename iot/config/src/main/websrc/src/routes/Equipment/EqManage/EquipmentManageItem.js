import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Table,
  Button,
  Form,
  Card,
  Divider,
  Tabs,
  Row,
  Col,
  List, Modal
} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import Ellipsis from "../../../components/Ellipsis";
import * as routerRedux from "react-router-redux";

const TabPane = Tabs.TabPane;


@connect(({equipmentManage, loading,equipmentData}) => ({
  equipmentManage,
  equipmentData,
  loading: loading.effects['equipmentManage/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentManageItem extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible:false,
      modalItemVisible:false,
    }
  };

  componentDidMount(){
    const {match:{params:{data}},equipmentManage:{deviceDataItem_params,deviceEventItem_params}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const dataValue = {
      ...deviceDataItem_params,
      id:item.id,
    };

    this.loadBasicItem(item.id);
    this.loadAuhorizationItem(item.id);
    this.loadDataItem(dataValue);
  }

  loadBasicItem=(id)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceBaiscItem_action',
      payload:{id:id}
    })
  };

  loadAuhorizationItem=(id)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceAuhorizationItem_action',
      payload:{id:id}
    })
  };

  loadDataItem=(dataValue)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceDataItem_action',
      payload:dataValue,
      callback:(res)=>{

      }
    })
  };

  loadEventItem=(value)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceEventItem_action',
      payload:value,
    })
  }

  changeVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  changeModalVisible=()=>{
    this.setState({
      modalVisible:!this.state.modalVisible,
    })
  };

  changeModalItemVisible=()=>{
    this.setState({
      modalItemVisible:!this.state.modalItemVisible,
    })
  };
  changeDataTablePage=(pagination)=>{
    const {equipmentManage:{deviceDataItem_params}} = this.props;
    const params = {
      ...deviceDataItem_params,
      start : (pagination.current -1)*deviceDataItem_params.count,
    };
    this.loadDataItem(params);

  };

  changeEventTablePage=(pagination)=>{
    const {equipmentManage:{deviceEventItem_params}} = this.props;
    const params = {
      ...deviceEventItem_params,
      start : (pagination.current -1)*deviceEventItem_params.count,
    };
    this.loadEventItem(params);
  };

  onCancel=()=>{
    this.setState({
      modalShowVisible:!this.state.modalShowVisible,
    })
  }


  render() {
    const {history,match:{params:{data}},equipmentManage:{deviceBaiscItems,deviceAuhorizationItems,deviceDataItemList,deviceEventItemList,deviceEventItem_params,deviceDataItem_params},intl:{formatMessage},equipmentData:{deDataItem}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {modalShowVisible} = this.state;
    let x;
    let deviceData = [];
    deviceDataItemList&&deviceDataItemList.value.map((item)=>{
      let obj={id:item.id,time:item.createTime};
      for (x in item.value){
        obj['key'+x] = item.value[x].key;
        obj['value'+x] = item.value[x].value;
        obj['type'+x] = item.value[x].type;
      };
      deviceData.push(obj)
    });

    const baiscItem = deviceBaiscItems[item.id];
    const deviceAuhorizationItem = deviceAuhorizationItems[item.id];

    const dataPaginationProps = {
      pageSize:deviceDataItem_params.count,
      total:deviceDataItemList&&deviceDataItemList.totalCount,
      current:(deviceDataItem_params.start/deviceDataItem_params.count) + 1,
    }
    const eventPaginationProps={
      pageSize:deviceEventItem_params.count,
      total:deviceEventItemList&&deviceEventItemList.totalCount,
      current:(deviceEventItem_params.start/deviceEventItem_params.count) + 1,
    }
    const columns = [{
      title:'Key',
      dataIndex: 'key0',
      key: '1',
      width:80,
      className:'table_row_styles bj3e',
    }, {
      title:'Value',
      dataIndex: 'value0',
      key: '2',
      className:'table_row_styles',
      //align:'center',
      width:200,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
          // record.type0===1?<span
          //   onClick={(e)=>{
          //     e.stopPropagation();
          //   }}
          // ><img style={{width:30,cursor: 'pointer',}} src={icon_more}/></span>:record.value0
        )
      }
    },{
      title:'Key',
      dataIndex: 'key1',
      key: '3',
      width:80,
      className:'table_row_styles bj3e',
    },{
      title:'Value',
      dataIndex: 'value1',
      key: '4',
      //align:'center',
      className:'table_row_styles',
      width:200,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
          // record.type1===1?<span
          //   onClick={(e)=>{
          //     e.stopPropagation();
          //   }}
          // ><img style={{width:30,cursor: 'pointer',}} src={icon_more}/></span>:record.value1
        )
      }
    },{
      title:'Key',
      dataIndex: 'key2',
      key: '5',
      width:80,
      className:'table_row_styles bj3e',
    },{
      title:'Value',
      dataIndex: 'value2',
      key: '6',
      //align:'center',
      className:'table_row_styles',
      width:200,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
          // record.type2===1?<span
          //   onClick={(e)=>{
          //     e.stopPropagation();
          //   }}
          // ><img style={{width:30,cursor: 'pointer',}} src={icon_more}/></span>:record.value2
        )
      }
    },{
      title:'Key',
      dataIndex: 'key3',
      key: '7',
      width:80,
      className:'table_row_styles bj3e',
    },{
      title:'Value',
      dataIndex: 'value3',
      key: '8',
      //align:'center',
      className:'table_row_styles',
      width:200,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
          // record.type3===1?<span
          //   onClick={(e)=>{
          //     e.stopPropagation();
          //   }}
          // ><img style={{width:30,cursor: 'pointer',}} src={icon_more}/></span>:record.value3
        )
      }
    },{
      title:'Key',
      dataIndex: 'key4',
      key: '9',
      width:80,
      className:'table_row_styles bj3e',
    },{
      title:'Value',
      dataIndex: 'value4',
      key: '10',
      //align:'center',
      className:'table_row_styles',
      width:200,
      render:(text,record)=>{
        return(
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    },{
      title:formatMessage(basicMessages.uploadTime),
      dataIndex: 'time',
      key: 'time',
      //align:'center',
      className:'table_row_styles',
      width: 100,
      render: (text, record) => {
        return (
          <Ellipsis tooltip={text} lines={1}><span>{text}</span></Ellipsis>
        )
      }
    },{
      title:formatMessage(basicMessages.operations),
      key: 'action',
      className:'table_row_styles',
      width:80,
      render: (text, record) => (
        <span>
          <a onClick={(e)=>{
            e.stopPropagation();
            this.onCancel();
            this.props.dispatch({
              type:'equipmentData/fetch_deDataItem_action',
              payload:{
                id:record.id
              }
            })
          }}
          >{formatMessage(basicMessages.details)}</a>
         </span>
      ),
    }];

    const columnsEvent = [{
      title: formatMessage(messages.equipmentMain),
      dataIndex: 'main',
      key: 'main',
      className:'table_row_styles',

    }, {
      title: formatMessage(messages.equipmentEventEt),
      dataIndex: 'event',
      key: 'event',
      className:'table_row_styles',
    },{
      title: formatMessage(messages.equipmentDate),
      dataIndex: 'createTime',
      key: 'createTime',
      className:'table_row_styles',
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <Card
            className={styles.card_class}
          >
            <Tabs defaultActiveKey="1"  onChange={this.changeTabs}>
              <TabPane tab={formatMessage(messages.equipmentBasicInfo)} key="1">
                <Card style={{textAlign:'center'}}>
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(messages.equipmentName)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{item&&item.name}</Col>
                  </Row>
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(messages.equipmentDeviceConfig)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{item&&item.deviceSettingName}</Col>
                  </Row>
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(messages.protocol)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{item&&item.protocol===1?'MQTT':item.protocol===2?'HTTP':item.protocol===3?'CoAP':item.protocol===4?'TCP':item.protocol===5?'UDP':null}</Col>
                  </Row>
                  {/*<Row style={{width:800,margin:'20px auto'}}>*/}
                    {/*<Col span={12} style={{textAlign:'right'}}>{formatMessage(messages.version)}：</Col>*/}
                    {/*<Col span={12} style={{textAlign:'left'}}>{baiscItem&&baiscItem.version}</Col>*/}
                  {/*</Row>*/}
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(basicMessages.describe)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{item&&item.desc}</Col>
                  </Row>
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(basicMessages.creator)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{baiscItem&&baiscItem.username}</Col>
                  </Row>
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(basicMessages.createTime)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{item&&item.createTime}</Col>
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab={formatMessage(messages.equipmentAuthentication)} key="2">
                <Card>
                  <Row style={{width:800,margin:'20px auto'}}>
                    <Col span={12} style={{textAlign:'right'}}>{formatMessage(messages.equipmentVerificationType)}：</Col>
                    <Col span={12} style={{textAlign:'left'}}>{deviceAuhorizationItem&&deviceAuhorizationItem.type}</Col>
                  </Row>
                  <Row style={{width:800,margin:'20px auto',lineHeight:'40px'}}>
                    <Col span={12} style={{textAlign:'right'}}>Token：</Col>
                    <Col span={8} style={{textAlign:'left',width:'auto'}}>{deviceAuhorizationItem&&deviceAuhorizationItem.token}</Col>
                    {/*<Col span={4} style={{textAlign:'left',marginLeft:10}}><Button>重置</Button></Col>*/}
                  </Row>
                </Card>
              </TabPane>
              <TabPane tab={formatMessage(messages.equipmentData)} key="3">
                <Card
                  className={styles.table_card_class}
                >
                  <Table
                    bordered
                    rowKey={(record,index)=>record.id}
                    dataSource={deviceData}
                    columns={columns}
                    pagination={dataPaginationProps}
                    onChange={this.changeDataTablePage}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          //this.changeModalItemVisible();
                        },       // 点击行
                      };
                    }}
                  />

                </Card>
              </TabPane>
              <TabPane tab={formatMessage(messages.equipmentEvent)} key="4">
                <Card
                  className={styles.table_card_class}
                >
                  <Table
                    rowKey={(record,index)=>record.id}
                    dataSource={deviceEventItemList&&deviceEventItemList.value}
                    columns={columnsEvent}
                    pagination={eventPaginationProps}
                    onChange={this.changeEventTablePage}
                  />
                </Card>
              </TabPane>
            </Tabs>
          </Card>



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
              style={{height:500,overflow: 'auto'}}
              bordered
              header={
                <div>
                  <span style={{width:20}}>Key</span>
                  <span style={{width:300,marginLeft:20}}>Value</span>
                </div>
              }
              dataSource={deDataItem}
              renderItem={item => (<List.Item>
                <Ellipsis style={{width:50}} tooltip={item.key} lines={1}><span style={{width:50,display:'block'}}>{item.key}</span></Ellipsis>
                <Ellipsis style={{marginLeft:20}} tooltip={item.value} lines={1}><span style={{width:300,display:'block'}}>{item.value}</span></Ellipsis>
              </List.Item>)}
            />
          </Modal>

        </Card>
      </PageHeaderLayout>
    );
  }
}
