import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Upload, message,
} from 'antd';
import styles from '../FirmwareUpdate.less';
import {injectIntl} from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import {getAuthority} from "../../../utils/authority";
import {CHURl} from '../../../utils/utils';
import messages from "../../../messages/firmware";


const FormItem = Form.Item;
const token = getAuthority() && getAuthority().value && getAuthority().value.token || '';

@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['hardwareUpdate/fetch_addUpdateDeviceConfig_action'],
}))
@Form.create()
@injectIntl
export default class HardwareUpdateAdd extends Component {
  constructor() {
    super();
    this.state = {
      eqIds: ['eqIds1'],
      limitCount:true,
      index:1,
      fileList:[],
      item:null,
      shieldDeviceIds:[],
    }
  };

  componentWillMount() {
    const {upgradeId,isEdit} = this.props;
    if(isEdit){
      this.loadDeviceConfig(upgradeId);
    }
  };

  loadDeviceConfig=(upgradeId)=>{
    this.props.dispatch({
      type:'hardwareUpdate/fetch_getUpgradeDeviceConfigInfo_action',
      payload:{
        upgradeId:upgradeId,
      },
      callback:(res)=>{
        let eqIds = res.ruleConfig.shieldDeviceIds;
        let eqIdsArr = eqIds.map((item,index)=>{
          return 'eqIds'+(index+1)
        });
        this.setState({
          item:res,
          eqIds:eqIdsArr,
          shieldDeviceIds:eqIds,
          limitCount:res.ruleConfig.limitCount?true:false,
          isAll:res.ruleConfig.isAll,
          isShield:res.ruleConfig.isShield,
          index:eqIdsArr.length
        });


        let isAll = res.ruleConfig.isAll===1?1:null;
        let isShield = res.ruleConfig.isShield===1?0:null;
        let limitCount = res.ruleConfig.limitCount;
        this.props.form.setFieldsValue({state:[isAll,isShield]});
        this.props.form.setFieldsValue({limitCount:limitCount});
      }
    })
  }

  handleChange = (fileList) => {
    const {file: {response, status}} = fileList;
    if (response && status === 'done') {
      if (response.status === 0) {
        message.success(response.message);
        this.setState({
          deviceIdFile:response.value,
        })
      } else {
        message.error(response.message)
      }
    }
    if (status === 'error') {
      message.error('导入失败，请稍后再试')
    }
  };

  handleChange1 = (fileList) => {
    const {file: {response, status}} = fileList;
    if (response && status === 'done') {
      if (response.status === 0) {
        message.success(response.message)
        this.setState({
          shieldDeviceIdFiled:response.value,
        })
      } else {
        message.error(response.message)
      }
    }
    if (status === 'error') {
      message.error('导入失败，请稍后再试')
    }
  };


  addEqId = () => {
    const {index} = this.state;
    let newEqIds = this.state.eqIds;
    newEqIds.push(`eqIds${index + 1}`);
    this.setState({
      eqIds: newEqIds,
      index:index+1,
    });
  }

  changeCheckBox=(checkedValues)=>{
    this.setState({
      limitCount:checkedValues.indexOf(1)!==-1?false:true,
      isAll:checkedValues.indexOf(1)!==-1?1:0,
      isShield:checkedValues.indexOf(0)!==-1?1:0,
    })
    checkedValues.indexOf(1)
  }


  createUpdateConfigDevice=(e)=>{
    const {upgradeId} = this.props;
    const {eqIds} = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, formValues) => {
      if (!err) {
        let shieldDeviceIdsList = eqIds.map(item=>{
          return formValues[item];
        });
        let fileList = [this.state.deviceIdFile,this.state.shieldDeviceIdFiled];
        let file = fileList.filter(item=>item);
        let shieldDeviceIds = shieldDeviceIdsList.filter(item=>item);
        let params = {
          files:file,
          isAll:this.state.isAll,
          isShield:this.state.isShield,
          upgradeId:upgradeId,
          shieldDeviceIds:shieldDeviceIds,
          limitCount:formValues.limitCount
        };
        this.props.dispatch({
          type:'hardwareUpdate/fetch_addUpdateDeviceConfig_action',
          payload:params,
        })
      }
    });
  };


  delEq =(index)=>{
    let eqIds = this.state.eqIds;
    let shieldDeviceIds = this.state.shieldDeviceIds;
    eqIds.splice(index,1);
    shieldDeviceIds.splice(index,1);
    let delEq = eqIds;
    let delShieldDeviceIds = shieldDeviceIds;
    this.setState({
      eqIds: delEq,
      shieldDeviceIds:delShieldDeviceIds
    })
  };



  render() {
    const {loading, formatMessage, hardwareUpdate: { getDeviceModalList,getUpgradeDeviceConfigInfo},upgradeId,isItem} = this.props;
    //console.log(formatMessage(messages));
    const {eqIds,limitCount,item,isAll,isShield,shieldDeviceIds} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 9},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };

    return (
      <div>
        <Form>
          <Row>
            <Col span={3}>
              <span style={{lineHeight: '39px'}}>{formatMessage(messages.upgrade_device)}</span>
            </Col>
            <Col span={21}>
              <FormItem>
                {
                  getFieldDecorator('state', {
                    //initialValue:item&&item.ruleConfig.isAll
                  })(
                    <Checkbox.Group style={{width: '100%'}} onChange={this.changeCheckBox}>
                      <Row>
                        <Col span={24}>
                          <Row>
                            <Col span={4} style={{lineHeight: '40px',width:150}}>
                              <Checkbox disabled={isItem} value={1}>{formatMessage(messages.all_device)}</Checkbox>
                            </Col>
                            <Col span={12}>
                              <div style={{display: 'flex'}}>
                                <FormItem
                                  label={formatMessage(messages.ascending_series)}
                                  {...formItemLayout}
                                >
                                  {
                                    getFieldDecorator('limitCount', {
                                      rules: [{
                                        required: limitCount, message: formatMessage(messages.ascending_input_series),
                                      }],
                                    })(
                                      <Input disabled={isItem}/>
                                    )
                                  }
                                </FormItem>
                                <span style={{lineHeight: '40px'}}>{formatMessage(basicMessages.no_input_max)}</span>
                              </div>
                            </Col>

                          </Row>
                        </Col>
                        {
                          isItem ? null :
                            <div style={{marginLeft: '16.77%'}}>
                              <Upload
                                action={`${CHURl}/upgrade/driver/api/v1/upload.action`}
                                onChange={this.handleChange}
                                accept=".txt"
                                name='deviceIdFile'
                                headers={{
                                  'Authorization': token
                                }}
                              >
                                <Button disabled={!upgradeId && isItem} type={'primary'}>{formatMessage(messages.upload_upgrade_id)}</Button>
                              </Upload>
                            </div>
                        }
                        <Col span={24} style={{marginTop: 10}}>
                          <div style={{display:'flex'}}>
                            <div style={{lineHeight: '40px',width:150}}>
                              <Checkbox disabled={isItem} value={0}>{formatMessage(messages.shielding_device)}</Checkbox>
                            </div>
                            <div style={{width:850,display: 'flex', flexWrap:'wrap'}}>
                            {
                                eqIds.map((item, index) => {
                                  return (
                                    <div key={index} style={{width: '305px'}}>
                                        <div style={{display: 'flex'}}>
                                          <FormItem
                                            label={formatMessage(messages.device_id)}
                                            {...formItemLayout}
                                          >
                                            {
                                              getFieldDecorator(`${item}`, {
                                                // rules: [{
                                                //   required: true, message: '请选择产品名称',
                                                // }],
                                                initialValue:shieldDeviceIds.length>0?shieldDeviceIds[index]:null
                                              })(
                                                <Input disabled={isItem}/>
                                              )
                                            }
                                          </FormItem>
                                          {
                                            eqIds.length===1||isItem?null: <div style={{width:'20px'}}>
                                              <span style={{lineHeight: '39px'}}><Icon type="close" onClick={()=>this.delEq(index)}/></span>
                                            </div>
                                          }
                                        </div>
                                    </div>

                                  )
                                })
                              }
                              {
                                isItem?null:
                                  <div onClick={this.addEqId}><Button style={{margin: '4px 0'}} icon={'plus'} type={'primary'}/>
                                    <span style={{lineHeight: '40px',marginLeft:6}}>{formatMessage(basicMessages.add)}</span>
                                  </div>
                              }

                            </div>

                          </div>
                        </Col>
                        {
                          isItem?null:
                          <div style={{marginLeft: '16.77%'}}>
                            <Upload
                              action={`${CHURl}/upgrade/driver/api/v1/upload.action`}
                              onChange={this.handleChange1}
                              accept=".txt"
                              name='shieldDeviceIdFile'
                              headers={{
                                'Authorization': token
                              }}
                            >
                              <Button disabled={!upgradeId} type={'primary'}>{formatMessage(messages.upload_shield_id)}</Button>
                            </Upload>
                          </div>
                        }
                      </Row>
                    </Checkbox.Group>
                  )}
              </FormItem>
            </Col>
          </Row>
        </Form>

        {
          isItem?null:
            <div style={{textAlign: 'center',margin:'30px 0 50px 0'}}>
              <Button loading={loading} disabled={!upgradeId} type={'primary'} onClick={this.createUpdateConfigDevice}>{formatMessage(basicMessages.confirm)}</Button>
            </div>
        }

      </div>
    );
  }
}
