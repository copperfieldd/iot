import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Card, Modal, Input, Row, Col} from 'antd';
import styles from '../FirmwareUpdate.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import messages from "../../../messages/firmware";
import eqMessages from "../../../messages/equipment";
import msgMessages from "../../../messages/bushing";

const FormItem = Form.Item;
@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['hardwareUpdate/fetch_getUpgradeStatistics_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateListItemU extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
    let params = {
      upgradeId:item.id,
    };
    this.loadItem(params);
  };

  loadItem=(params)=>{
    this.props.dispatch({
      type:'hardwareUpdate/fetch_getUpgradeStatistics_action',
      payload:params
    })
  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };


  render() {
    const {hardwareUpdate:{getUpgradeStatistics},intl:{formatMessage},history} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {match:{params:{data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
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

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
        >
          <div className='mrgTB30' style={{width: 600}}>
            <Form>
              <FormItem
                label={formatMessage(basicMessages.tenant)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('tenant', {
                    initialValue:getUpgradeStatistics&&getUpgradeStatistics.tenantName
                  })(
                    <Input disabled={true}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.application)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('app', {
                    initialValue:getUpgradeStatistics&&getUpgradeStatistics.applicationName
                  })(
                    <Input disabled={true}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(eqMessages.equipmentType)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('type', {
                    initialValue:getUpgradeStatistics&&getUpgradeStatistics.deviceModelName
                  })(
                    <Input disabled={true}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(eqMessages.equipmentName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('deviceName', {
                  })(
                    <Input disabled={true}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.current_progress)}
                {...formItemLayout}
              >
                <span>{getUpgradeStatistics&&getUpgradeStatistics.state==='NEW'?formatMessage(messages.firm_no_begin):getUpgradeStatistics&&getUpgradeStatistics.state==='ING'?formatMessage(messages.firm_upgrading):getUpgradeStatistics&&getUpgradeStatistics.state==='PAUSE'?formatMessage(basicMessages.suspend):getUpgradeStatistics&&getUpgradeStatistics.state==='COMPLETED'?formatMessage(basicMessages.finished):formatMessage(basicMessages.end)}</span>
              </FormItem>

              <FormItem
                label={formatMessage(messages.begin_upgrade_time)}
                {...formItemLayout}
              >
                <span>{getUpgradeStatistics&&getUpgradeStatistics.startTime?moment(getUpgradeStatistics&&getUpgradeStatistics.startTime).format('YYYY/MM/DD HH:mm:ss'):''}</span>
              </FormItem>

              <FormItem
                label={formatMessage(messages.end_upgrade_time)}
                {...formItemLayout}
              >
                <span>{getUpgradeStatistics&&getUpgradeStatistics.endTime?moment(getUpgradeStatistics&&getUpgradeStatistics.endTime).format('YYYY/MM/DD HH:mm:ss'):""}</span>
              </FormItem>
              <Row gutter={16}>
                <Col span={10} offset={2} >
                  <a onClick={()=>{
                    this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdate/updateSuccess/${item.id}`))
                  }}>
                    <Card
                      bordered={false}
                      style={{textAlign: 'center', background: '#eee'}}
                      //loading={allTenantNumLoading}
                    >
                      <h4>{formatMessage(messages.success_count)}</h4>
                      <h4 style={{color: '#3f89e1'}}>{getUpgradeStatistics&&getUpgradeStatistics.successCount}</h4>
                    </Card>
                  </a>
                </Col>
                <Col span={10} offset={2}>
                  <a onClick={()=>{
                    this.props.dispatch(routerRedux.push(`/firmwareUpdate/hardwareUpdate/updateFails/${item.id}`))
                  }}>
                    <Card
                      bordered={false}
                      style={{textAlign: 'center', background: '#eee'}}
                      //loading={allTenantNumLoading}
                    >
                      <h4>{formatMessage(messages.fail_count)}</h4>
                      <h4 style={{color: '#3f89e1'}}>{getUpgradeStatistics&&getUpgradeStatistics.failCount}</h4>
                    </Card>
                  </a>
                </Col>
              </Row>
            </Form>
          </div>

          <div className='TxTCenter' style={{marginTop: 20}}>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
