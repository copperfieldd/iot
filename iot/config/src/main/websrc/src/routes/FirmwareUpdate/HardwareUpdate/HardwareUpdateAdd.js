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
import {FormattedMessage, injectIntl} from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import {getAuthority} from "../../../utils/authority";
import HardwareUpdateAddConfigTime from './HardwareUpdateAddConfigTime';
import HardwareUpdateAddConfigDevice from './HardwareUpdateAddConfigDevice';
import HardwareUpdateAddConfigVersion from './HardwareUpdateAddConfigVersion';
import Ellipsis from "../../../components/Ellipsis";
import messages from "../../../messages/firmware";
import eqMessages from "../../../messages/equipment";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const format = 'HH:mm';

@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['hardwareUpdate/fetch_addUpdateDuty_action'],
  loading1:loading.effects['hardwareUpdate/fetch_addUpdateConfig_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateAdd extends Component {
  constructor() {
    super();
    this.state = {
      upgradeId: null,
    }
  };

  componentWillMount() {
    let userInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    let value = userInfo && userInfo.value;
    this.loadUserTenantInfo(value.tenantId);
    this.loadApplicationInfo(value.appId);
    this.loadDeviceModal();
    this.loadAddDutyBay();
    this.loadDeviceTypeList();
  };

  loadUserTenantInfo = (id) => {
    this.props.dispatch({
      type: 'hardwareUpdate/fetch_getTenantItem_action',
      payload: {
        id: id,
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


  loadApplicationInfo = (id) => {
    this.props.dispatch({
      type: "hardwareUpdate/fetch_getApplicationItem_action",
      payload: {
        id: id,
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


  handleSubmit = (e) => {
    const {form} = this.props;
    const {upgradeId} = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, formValues) => {
      this.props.dispatch({
        type:'hardwareUpdate/fetch_addUpdateConfig_action',
        payload:{
          upgradeId:upgradeId,
        },
      })
    });
  };



  createUpdateDuty = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let params = {
          deviceModelId:JSON.parse(values.deviceModel).deviceModelId,
          deviceModelName:JSON.parse(values.deviceModel).deviceModelName,
          deviceTypeId:JSON.parse(values.deviceType).deviceTypeId,
          deviceTypeName:JSON.parse(values.deviceType).deviceTypeName,
          ...values,
        };
        delete params.deviceModel;
        delete params.deviceType;
        this.props.dispatch({
          type: 'hardwareUpdate/fetch_addUpdateDuty_action',
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
    const {history, loading,loading1, intl: {formatMessage}, hardwareUpdate: {getTenantItem, getApplicationItem, getDeviceModalList, getAddDutyBag,getDeviceTypeList}} = this.props;
    const {upgradeId} = this.state;
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
                    <Ellipsis tooltip={getTenantItem && getTenantItem.name} lines={1}><span style={{display:'block'}}>{getTenantItem && getTenantItem.name}</span></Ellipsis>
                  </FormItem>
                </Col>

                <Col span={3}>
                  <FormItem
                    label={formatMessage(basicMessages.application)}
                    {...formItemLayout}
                  >
                    <Ellipsis tooltip={getApplicationItem && getApplicationItem.name} lines={1}><span style={{display:'block'}}>{getApplicationItem && getApplicationItem.name}</span></Ellipsis>
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
                          required: true, message: formatMessage(eqMessages.equipmentTypeSelect),
                        }],
                      })(
                        <Select placeholder={formatMessage(eqMessages.equipmentTypeSelect)}>
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
                          required: true, message: formatMessage(eqMessages.equipment_device_model_select),
                        }],
                      })(
                        <Select placeholder={formatMessage(eqMessages.equipment_device_model_select)}>
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
                          required: true, message: formatMessage(messages.firm_select_package),
                        }],
                      })(
                        <Select placeholder={formatMessage(messages.firm_select_package)}>
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

              <div style={{textAlign: 'center'}}>{formatMessage(messages.firm_select_upgrade)}</div>

              <Row>
                <Col span={7}>
                  <FormItem
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('isSubpackage', {
                        //rules: [{
                        //required: true, message: '请选择产品名称',
                        //}],
                        initialValue:0,
                      })(
                        <RadioGroup style={{width:300}} onChange={this.onChange}>
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
                      })(
                        <Input/>
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
                    initialValue:0,
                  })(
                    <RadioGroup onChange={this.onChange}>
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
                    initialValue:0,
                  })(
                    <RadioGroup onChange={this.onChange}>
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
                    //rules: [{
                    //required: true, message: '请选择产品名称',
                    //}],
                    initialValue:0,
                  })(
                    <RadioGroup onChange={this.onChange}>
                      <Radio value={0}>{formatMessage(messages.no_transit)}</Radio>
                      <Radio value={1}>{formatMessage(messages.app_transit)}</Radio>
                      <Radio value={2}>{formatMessage(messages.pc_transit)}</Radio>
                      <Radio value={3}>{formatMessage(messages.gateway_transit)}</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Form>


            <div style={{textAlign: 'center'}}>
              <Button loading={loading} type={'primary'} onClick={this.createUpdateDuty}>{formatMessage(basicMessages.confirm)}</Button>
            </div>

            <HardwareUpdateAddConfigTime
              upgradeId={upgradeId}
              formatMessage={formatMessage}
            />

            <HardwareUpdateAddConfigDevice
              upgradeId={upgradeId}
              formatMessage={formatMessage}
            />

            <HardwareUpdateAddConfigVersion
              upgradeId={upgradeId}
              formatMessage={formatMessage}
            />


            {/*<Form>*/}

              {/*<div style={{textAlign: 'center', margin: '20px 0 '}}>升级配置</div>*/}

              {/*<Row>*/}
                {/*<Col span={2}><span style={{lineHeight: '39px'}}>时间</span></Col>*/}
                {/*<Col span={7}>*/}
                  {/*<FormItem*/}
                    {/*{...formItemLayout}*/}
                    {/*label={'开始时间'}*/}
                  {/*>*/}
                    {/*{*/}
                      {/*getFieldDecorator('time', {*/}
                        {/*rules: [{*/}
                          {/*required: true, message: '请选择时间',*/}
                        {/*}],*/}
                      {/*})(*/}
                        {/*<DatePicker format="YYYY/MM/DD" onChange={this.onChangeTime}/>*/}
                      {/*)*/}
                    {/*}*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
                {/*<Col span={15}>*/}
                  {/*{*/}
                    {/*times.map((item, index) => {*/}
                      {/*return (*/}
                        {/*<Row key={index}>*/}
                          {/*<Col span={10}>*/}
                            {/*<FormItem*/}
                              {/*{...formItemLayout}*/}
                              {/*label={'升级时间段'}*/}
                            {/*>*/}
                              {/*{*/}
                                {/*getFieldDecorator(`${item}`, {*/}
                                  {/*rules: [{*/}
                                    {/*required: true, message: '请选择时间',*/}
                                  {/*}],*/}
                                {/*})(*/}
                                  {/*<TimePicker style={{width: '100%'}} defaultOpenValue={moment('00:00', 'HH:mm')}*/}
                                              {/*format={format}/>*/}
                                {/*)*/}
                              {/*}*/}
                            {/*</FormItem>*/}
                          {/*</Col>*/}
                          {/*<Col span={1}><span style={{lineHeight: '39px'}}>-</span></Col>*/}
                          {/*<Col span={10}>*/}
                            {/*<FormItem*/}
                              {/*{...formItemLayout}*/}
                            {/*>*/}
                              {/*{*/}
                                {/*getFieldDecorator(`${item}` + 'i', {*/}
                                  {/*rules: [{*/}
                                    {/*required: true, message: '请选择时间',*/}
                                  {/*}],*/}
                                {/*})(*/}
                                  {/*<TimePicker style={{width: '100%'}} defaultOpenValue={moment('00:00', 'HH:mm')}*/}
                                              {/*format={format}/>*/}
                                {/*)*/}
                              {/*}*/}
                            {/*</FormItem>*/}
                          {/*</Col>*/}
                        {/*</Row>*/}
                      {/*)*/}
                    {/*})*/}
                  {/*}*/}
                  {/*<div style={{marginLeft: 97}}><Button type={'primary'} onClick={this.addTimes}>添加时间段</Button></div>*/}
                {/*</Col>*/}
              {/*</Row>*/}

              {/*<Row>*/}
                {/*<Col span={2}>*/}
                  {/*<span style={{lineHeight: '39px'}}>升级设备</span>*/}
                {/*</Col>*/}
                {/*<Col span={22}>*/}
                  {/*<FormItem>*/}
                    {/*{*/}
                      {/*getFieldDecorator('shebei', {})(*/}
                        {/*<Checkbox.Group style={{width: '100%'}}>*/}
                          {/*<Row>*/}
                            {/*<Col span={24}>*/}
                              {/*<Row>*/}
                                {/*<Col span={4} style={{lineHeight: '40px'}}>*/}
                                  {/*<Checkbox value="A">所有设备</Checkbox>*/}
                                {/*</Col>*/}
                                {/*<Col span={10}>*/}
                                  {/*<div style={{display: 'flex'}}>*/}
                                    {/*<FormItem*/}
                                      {/*label={'设定升级数'}*/}
                                      {/*{...formItemLayout}*/}
                                    {/*>*/}
                                      {/*{*/}
                                        {/*getFieldDecorator('shengjishumu', {})(*/}
                                          {/*<Input/>*/}
                                        {/*)*/}
                                      {/*}*/}
                                    {/*</FormItem>*/}
                                    {/*<span style={{lineHeight: '40px'}}>不填，为不限制数量</span>*/}
                                  {/*</div>*/}
                                {/*</Col>*/}

                              {/*</Row>*/}
                            {/*</Col>*/}
                            {/*<div style={{marginLeft: '16.77%'}}>*/}
                              {/*<Upload*/}
                                {/*action={getUrl("/geography/api/region/import")}*/}
                                {/*onChange={this.handleChange}*/}
                                {/*accept=".xls,.xlsx"*/}
                                {/*headers={{*/}
                                  {/*'Authorization': token*/}
                                {/*}}*/}
                              {/*>*/}
                                {/*<Button type={'primary'}>上传升级设备ID</Button>*/}
                              {/*</Upload>*/}
                            {/*</div>*/}
                            {/*<Col span={24} style={{marginTop: 10}}>*/}
                              {/*<Row>*/}
                                {/*<Col span={4} style={{lineHeight: '40px'}}>*/}
                                  {/*<Checkbox value="B">屏蔽设备</Checkbox>*/}
                                {/*</Col>*/}

                                {/*<Col span={8}>*/}
                                  {/*{*/}
                                    {/*eqIds.map((item, index) => {*/}
                                      {/*return (*/}
                                        {/*<div key={index} style={{width: '100%'}}>*/}
                                          {/*<div style={{display: 'flex'}}>*/}
                                            {/*<FormItem*/}
                                              {/*label={'设备ID'}*/}
                                              {/*{...formItemLayout}*/}
                                            {/*>*/}
                                              {/*{*/}
                                                {/*getFieldDecorator(`${item}`, {})(*/}
                                                  {/*<Input/>*/}
                                                {/*)*/}
                                              {/*}*/}
                                            {/*</FormItem>*/}
                                          {/*</div>*/}
                                        {/*</div>*/}
                                      {/*)*/}
                                    {/*})*/}
                                  {/*}*/}


                                {/*</Col>*/}

                                {/*<div onClick={this.addEqId}><Button style={{margin: '4px 0'}} icon={'plus'}*/}
                                                                    {/*type={'primary'}/> <span*/}
                                  {/*style={{lineHeight: '40px'}}>添加</span></div>*/}
                              {/*</Row>*/}
                            {/*</Col>*/}
                            {/*<div style={{marginLeft: '16.77%'}}>*/}
                              {/*<Upload*/}
                                {/*action={getUrl("/geography/api/region/import")}*/}
                                {/*onChange={this.handleChange}*/}
                                {/*accept=".xls,.xlsx"*/}
                                {/*headers={{*/}
                                  {/*'Authorization': token*/}
                                {/*}}*/}
                              {/*>*/}
                                {/*<Button type={'primary'}>上传屏蔽设备ID</Button>*/}
                              {/*</Upload>*/}
                            {/*</div>*/}
                          {/*</Row>*/}
                        {/*</Checkbox.Group>*/}
                      {/*)}*/}
                  {/*</FormItem>*/}
                {/*</Col>*/}
              {/*</Row>*/}

              {/*<Row>*/}
                {/*<Col span={2}><span style={{lineHeight: '39px'}}>升级版本</span></Col>*/}

                {/*<FormItem>*/}
                  {/*{*/}
                    {/*getFieldDecorator('shengjibanben', {})(*/}
                      {/*<RadioGroup onChange={this.onChange}>*/}
                        {/*<Radio style={radioStyle} value={1}>所有版本</Radio>*/}
                        {/*<Radio style={radioStyle} value={2}>低版本升级 </Radio>*/}
                        {/*<div style={{display: 'flex'}}>*/}
                          {/*<Radio style={radioStyle} value={3}>指定版本升级</Radio>*/}
                          {/*<div style={{width: 100}}>*/}
                            {/*{*/}
                              {/*updVersions.map((item, index) => {*/}
                                {/*return (*/}
                                  {/*<FormItem*/}
                                    {/*key={index}*/}
                                    {/*{...formItemLayout}*/}
                                  {/*>*/}
                                    {/*{*/}
                                      {/*getFieldDecorator(`${item}`, {})(*/}
                                        {/*<Input style={{width: 100}}/>*/}
                                      {/*)*/}
                                    {/*}*/}
                                  {/*</FormItem>*/}
                                {/*)*/}
                              {/*})*/}
                            {/*}*/}

                          {/*</div>*/}
                          {/*<div style={{marginLeft: 8}} onClick={this.addUpdVersion}>*/}
                            {/*<Button style={{margin: '4px 0'}} icon={'plus'} type={'primary'}/>*/}
                            {/*<span style={{lineHeight: '40px'}}>添加</span>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                        {/*<div style={{display: 'flex'}}>*/}
                          {/*<Checkbox style={radioStyle} onChange={this.exceptVersion}>屏蔽版本</Checkbox>*/}
                          {/*<div style={{width: 100}}>*/}
                            {/*{*/}
                              {/*exceptVersions.map((item, index) => {*/}
                                {/*return (*/}
                                  {/*<FormItem*/}
                                    {/*key={index}*/}
                                    {/*{...formItemLayout}*/}
                                  {/*>*/}
                                    {/*{*/}
                                      {/*getFieldDecorator(`${item}`, {*/}
                                        {/*rules: [{*/}
                                          {/*//required: true, message: '请选择产品名称',*/}
                                        {/*}],*/}
                                      {/*})(*/}
                                        {/*<Input style={{width: 100}}/>*/}
                                      {/*)*/}
                                    {/*}*/}
                                  {/*</FormItem>*/}
                                {/*)*/}
                              {/*})*/}
                            {/*}*/}

                          {/*</div>*/}
                          {/*<div style={{marginLeft: 8}} onClick={this.addExceptVersion}>*/}
                            {/*<Button style={{margin: '4px 0'}} icon={'plus'} type={'primary'}/>*/}
                            {/*<span style={{lineHeight: '40px'}}>添加</span>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                      {/*</RadioGroup>*/}
                    {/*)*/}
                  {/*}*/}
                {/*</FormItem>*/}
              {/*</Row>*/}
            {/*</Form>*/}
          </div>
          <div className='TxTCenter' style={{width: 500, margin: '30px auto'}}>
            <Button type='primary' loading={loading1} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
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
