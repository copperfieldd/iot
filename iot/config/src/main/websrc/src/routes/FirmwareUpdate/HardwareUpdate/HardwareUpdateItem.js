import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  Radio,
} from 'antd';
import styles from '../FirmwareUpdate.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import {getAuthority} from "../../../utils/authority";
import Ellipsis from "../../../components/Ellipsis";
import HardwareUpdateAddConfigTime from "./HardwareUpdateAddConfigTime";
import HardwareUpdateAddConfigDevice from "./HardwareUpdateAddConfigDevice";
import HardwareUpdateAddConfigVersion from "./HardwareUpdateAddConfigVersion";
import messages from "../../../messages/firmware";
import eqMessages from "../../../messages/equipment";


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const token = getAuthority() && getAuthority().value && getAuthority().value.token || '';

@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['securityAudit/fetch_addType_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateItem extends Component {
  constructor() {
    super();
    this.state = {
      times:['times1'],
      eqIds:['eqIds1'],
      updVersions:['updVersions1'],
      exceptVersions:['exceptVersions1'],
    }
  };

  componentWillMount() {
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.loadDeviceModal();
    this.loadAddDutyBay();
    this.loadUpgradeInfo(item.id);
    this.loadDeviceTypeList();
  };

  loadUpgradeInfo=(params)=>{
    this.props.dispatch({
      type:'hardwareUpdate/fetch_getUpgradeInfo_action',
      payload:{
        id:params
      }
    })
  };
  loadDeviceTypeList=()=>{
    this.props.dispatch({
      type:"hardwareUpdate/fetch_getDeviceTypeList_action",
      payload:{
        start:0,
        count:2000,
      }
    })
  };

  loadDeviceModal = () => {
    this.props.dispatch({
      type: 'hardwareUpdate/fetch_getDeviceModalList_action',
      payload: {
        start: 0,
        count: 2000,
      }
    })
  };

  loadAddDutyBay = () => {
    this.props.dispatch({
      type: 'hardwareUpdate/fetch_getAddDutyBag_action',
      payload: {
        start: 0,
        count: 2000,
        type: 0,
      }
    })
  };


  updateUpdateDuty = (e) => {
    const {match:{params:{data}}} = this.props;
    e.preventDefault();
    const item = JSON.parse(decodeURIComponent(data));

    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          id:item.id,
          deviceModelId:JSON.parse(values.deviceModel).deviceModelId,
          deviceModelName:JSON.parse(values.deviceModel).deviceModelName,
          deviceTypeId:JSON.parse(values.deviceType).deviceTypeId,
          deviceTypeName:JSON.parse(values.deviceType).deviceTypeName,
          ...values,
        };
        delete params.deviceModel;
        delete params.deviceType;
        this.props.dispatch({
          type: 'hardwareUpdate/fetch_updateUpdateDuty_action',
          payload: params,
          callback: (res) => {
            this.setState({
              upgradeId: res,
            })
          }
        })
      }
    });
  };



  render() {
    const {history,loading,intl:{formatMessage},match:{params:{data}},hardwareUpdate: {getDeviceModalList, getAddDutyBag,getDeviceTypeList}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 9},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 13},
      },
    };


    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 1200}}>
            <Form>
              <Row gutter={16}>
                <Col span={3}>
                  <FormItem
                    label={formatMessage(basicMessages.tenant)}
                    {...formItemLayout}
                  >
                    <Ellipsis tooltip={item && item.tenantName} lines={1}><span style={{display:'block'}}>{item && item.tenantName}</span></Ellipsis>
                  </FormItem>
                </Col>

                <Col span={3}>
                  <FormItem
                    label={formatMessage(basicMessages.application)}
                    {...formItemLayout}
                  >
                    <Ellipsis tooltip={item && item.applicationName} lines={1}><span style={{display:'block'}}>{item && item.applicationName}</span></Ellipsis>
                  </FormItem>
                </Col>

                <Col span={5}>
                  <FormItem
                    label={formatMessage(eqMessages.equipmentType)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('deviceType', {
                        rules: [{
                          required: true, //message: '请选择设备型号',
                        }],
                        initialValue:item&&JSON.stringify({deviceTypeId:item.deviceTypeId,deviceTypeName:item.deviceTypeName})
                      })(
                        <Select disabled>
                          {
                            getDeviceTypeList && getDeviceTypeList.map((item, index) => {
                              return (
                                <Option key={index} value={JSON.stringify({
                                  deviceTypeId: item.id,
                                  deviceTypeName: item.name
                                })}>{item.name}</Option>
                              )
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>

                <Col span={5}>
                  <FormItem
                    label={formatMessage(eqMessages.equipment_device_model)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('deviceModel', {
                        rules: [{
                          required: true, //message: '请选择设备型号',
                        }],
                        initialValue:item&&JSON.stringify({deviceModelId:item.deviceModelId,deviceModelName:item.deviceModelName})
                      })(
                        <Select disabled>
                          {
                            getDeviceModalList && getDeviceModalList.value.map((item, index) => {
                              return (
                                <Option key={index} value={JSON.stringify({
                                  deviceModelId: item.id,
                                  deviceModelName: item.name
                                })}>{item.name}</Option>
                              )
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>

                <Col span={5}>

                  <FormItem
                    label={formatMessage(messages.firm_package_name)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('upgradePackageId', {
                        rules: [{
                          required: true, //message: '请选择升级包名称',
                        }],
                        initialValue:item&&item.upgradePackageId
                      })(
                        <Select disabled>
                          {
                            getAddDutyBag && getAddDutyBag.list.map((item, index) => {
                              return (
                                <Option key={index} value={item.id}>{item.packageName}</Option>
                              )
                            })
                          }
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

              <div style={{textAlign: 'center',margin:'20px 0'}}>{formatMessage(messages.firm_select_upgrade)}</div>

              <Row >
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('isSubpackage', {
                        //rules: [{
                        //required: true, message: '请选择产品名称',
                        //}],
                        initialValue: item&&item.isSubpackage
                      })(
                        <RadioGroup style={{width:300}} disabled onChange={this.onChange}>
                          <Radio value={0}>{formatMessage(messages.firm_no_packet)}</Radio>
                          <Radio value={1}>{formatMessage(messages.firm_subpackage)}</Radio>
                        </RadioGroup>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem
                    label={formatMessage(messages.firm_package_size)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('subpackageSize', {
                        // rules: [{
                        //required: true, message: '请选择产品名称',
                        // }],
                        initialValue:item&&item.subpackageSize
                      })(
                        <Input disabled/>
                      )
                    }
                  </FormItem>
                </Col>
              </Row>

              <FormItem
                {...formItemLayout}
              >
                {
                  getFieldDecorator('isCompress', {
                    //rules: [{
                    //required: true, message: '请选择产品名称',
                    //}],
                    initialValue:item&&item.isCompress
                  })(
                    <RadioGroup  disabled onChange={this.onChange}>
                      <Radio value={0}>{formatMessage(messages.uncompressed)}</Radio>
                      <Radio value={1}>{formatMessage(messages.compress)}</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>


              <FormItem
                {...formItemLayout}
              >
                {
                  getFieldDecorator('isForce', {
                    //rules: [{
                    //required: true, message: '请选择产品名称',
                    // }],
                    initialValue:item&&item.isForce
                  })(
                    <RadioGroup disabled onChange={this.onChange}>
                      <Radio value={0}>{formatMessage(messages.prompt_upgrade)}</Radio>
                      <Radio value={1}>{formatMessage(messages.compulsory_upgrade)}</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>

              <FormItem
                {...formItemLayout}
              >
                {
                  getFieldDecorator('transferPattern', {
                    initialValue:item&&item.transferPattern
                  })(
                    <RadioGroup disabled onChange={this.onChange}>
                      <Radio value={0}>{formatMessage(messages.no_transit)}</Radio>
                      <Radio value={1}>{formatMessage(messages.app_transit)}</Radio>
                      <Radio value={2}>{formatMessage(messages.pc_transit)}</Radio>
                      <Radio value={3}>{formatMessage(messages.gateway_transit)}</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Form>



            <HardwareUpdateAddConfigTime
              upgradeId={item.id}
              isEdit={true}
              isItem={true}
              formatMessage={formatMessage}
            />

            <HardwareUpdateAddConfigDevice
              upgradeId={item.id}
              isEdit={true}
              isItem={true}
              formatMessage={formatMessage}
            />

            <HardwareUpdateAddConfigVersion
              upgradeId={item.id}
              isEdit={true}
              isItem={true}
              formatMessage={formatMessage}
            />
          </div>
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
