import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Select,
  Card,
  Checkbox,
  Row, Col, Modal, message
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import DeviceTypeListModal from '../Modal/DeviceTypeListModal';
import styles from "../../Warning/Warning.less";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const TextArea = Input.TextArea;

@connect(({equipmentManage, loading}) => ({
  equipmentManage,
  loading: loading.effects['equipmentManage/fetch_updDevice_action'],
  loading1:loading.effects['equipmentManage/fetch_getDeviceToken_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible:false,
      appConfigVisible:false,
      addressInputList:[],
      modalVisible:false,
    }
  };

  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.form.setFieldsValue({deviceSettingId:item.deviceSettingId})
    this.loadAuhorizationItem(item.id);
    this.loadBasicItem(item.id)

  }

  loadAuhorizationItem=(id)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceAuhorizationItem_action',
      payload:{id:id},
    })
  };
  loadBasicItem=(id)=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_deviceBaiscItem_action',
      payload:{id:id}
    })
  };


  handleSubmit = (e) => {
    const {form,match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          id:item.id,
        }
        this.props.dispatch({
          type:'equipmentManage/fetch_updDevice_action',
          payload:value,
        })
      }
    });
  };
  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  refreshToken=()=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_getDeviceToken_action',
      payload:'',
      callback:(res)=>{
        this.props.form.setFieldsValue({'token':res})
      }
    })
  };


  render() {
    const {history,match:{params:{data}},equipmentManage:{deviceBaiscItems,deviceAuhorizationItems},loading,loading1,intl:{formatMessage}} = this.props;

    const item = JSON.parse(decodeURIComponent(data));
    const deviceAuhorizationItem = deviceAuhorizationItems[item.id];
    const baiscItem = deviceBaiscItems[item.id];
    let defaultValue = {
      id:item.deviceSettingId,
      name:item.deviceType,
    }
    const {checkedDeviceType,modalVisible} = this.state;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          {/*<Card*/}
            {/*title={*/}
              {/*<span style={{color: '#3f89e1'}}>修改设备</span>*/}
            {/*}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width: 550}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.equipmentName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.equipmentNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue:item&&item.name
                    })(
                      <Input placeholder={formatMessage(messages.equipmentNameInput)}/>
                    )
                  }

                </FormItem>

                <FormItem
                  label={formatMessage(messages.equipmentDeviceConfig)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('deviceSettingId', {
                      rules: [{
                        required: true, message: '请选择设备配置',
                      }],
                    })(
                      <div onClick={this.changeModalVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                        <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                          <span>{checkedDeviceType && checkedDeviceType.name?checkedDeviceType.name:item.deviceSettingName}</span>
                        </div>
                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }

                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('desc', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                      initialValue: item&&item.desc
                    })(
                      <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                    )
                  }

                </FormItem>


                <FormItem
                  label={formatMessage(messages.equipmentAuthorizeId)}
                  {...formItemLayout}
                >
                  <Row>
                    <Col span={20}>
                      {
                        getFieldDecorator('token', {
                          rules: [
                            {
                              pattern:/^[0-9a-zA-Z]+$/,message: formatMessage(basicMessages.correctToken),
                            },
                            {
                              max: 64,message: formatMessage(basicMessages.moreThan64)
                            },
                            {
                              min: 8,message: formatMessage(basicMessages.lessThan8)
                            }
                          ],

                          initialValue:deviceAuhorizationItem&&deviceAuhorizationItem.token
                        })(
                          <Input/>
                        )
                      }
                    </Col>
                    <Col span={4}>
                      <Button loading={loading1} style={{marginLeft:20}} type='primary' onClick={(e)=>this.refreshToken()}>{formatMessage(basicMessages.reset)}</Button>
                    </Col>
                  </Row>
                </FormItem>

              </Form>
            </div>
          {/*</Card>*/}
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e)=>{
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      this.props.dispatch(routerRedux.push(`/equipment/equipmentManage`));
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <DeviceTypeListModal
            //status={0}
            defaultValue={defaultValue}
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.setState({
                checkedDeviceType: value
              })
              this.props.form.setFieldsValue({deviceSettingId:value.id})
            }}
          />


        </Card>
      </PageHeaderLayout>
    );
  }
}
