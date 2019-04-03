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
  loading: loading.effects['equipmentManage/fetch_addDevice_action'],
  loading1:loading.effects['equipmentManage/fetch_getDeviceToken_action'],

}))
@injectIntl
@Form.create()
export default class EquipmentManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible:false,
      checkedDeviceType:null,
    }
  };

  componentDidMount(){
    this.loadToken();
  }

  loadToken=()=>{
    this.props.dispatch({
      type:'equipmentManage/fetch_getDeviceToken_action',
      payload:'',
      callback:(res)=>{
        this.props.form.setFieldsValue({'token':res})
      }
    })
  };


  handleSubmit = (e) => {
    const {form,equipmentManage:{deviceToken},intl:{formatMessage}} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'equipmentManage/fetch_addDevice_action',
          payload:values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/equipmentManage/edit/${encodeURIComponent(JSON.stringify(res))}`));
          }
        })
      }
    });
  };



  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };


  render() {
    const {history,equipmentManage:{deviceToken},intl:{formatMessage},loading1,loading} = this.props;
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
              {/*<span style={{color: '#3f89e1'}}>新建设备</span>*/}
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
                          <span>{checkedDeviceType && checkedDeviceType.name}</span>
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

                          initialValue:deviceToken
                        })(
                          <Input/>
                        )
                      }
                    </Col>
                    <Col span={4}>
                      <Button loading={loading1} style={{marginLeft:20}} type='primary' onClick={this.loadToken}>{formatMessage(basicMessages.reset)}</Button>
                    </Col>
                  </Row>

                </FormItem>
              </Form>
            </div>
          {/*</Card>*/}
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e)=>{
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <DeviceTypeListModal
            //status={0}
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.setState({
                checkedDeviceType: value
              });
              this.props.form.setFieldsValue({deviceSettingId:value.id})
            }}
          />


        </Card>
      </PageHeaderLayout>
    );
  }
}
