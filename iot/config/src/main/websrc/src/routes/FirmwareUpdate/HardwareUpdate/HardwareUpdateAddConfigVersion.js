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
  Radio,
} from 'antd';
import styles from '../FirmwareUpdate.less';
import {FormattedMessage, injectIntl} from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import messages from "../../../messages/firmware";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['hardwareUpdate/fetch_addUpdateVersionConfig_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateAdd extends Component {
  constructor() {
    super();
    this.state = {
      updVersions: ['updVersions1'],
      exceptVersions: ['exceptVersions1'],
      updVersion:null,
      upIndex:1,
      exIndex:1,
      exceptVersionChecked:false,
      specifiedVersionList:[],
      shieldList:[],
    }
  };

  componentWillMount() {
    const {upgradeId,isEdit} = this.props;
    if(isEdit){
      this.loadVersionConfig(upgradeId);
    }
  };

  loadVersionConfig=(upgradeId)=>{
    this.props.dispatch({
      type:'hardwareUpdate/fetch_getUpgradeVersionConfig_action',
      payload:{
        upgradeId:upgradeId,
      },
      callback:(res)=>{
        this.props.form.setFieldsValue({mode:res.ruleConfig.mode});
        this.setState({
          exceptVersionChecked:res.ruleConfig.shieldList.length>0?true:false
        });
        let exceptVersions = res.ruleConfig.shieldList.map((item,index)=>{
          return 'exceptVersions'+(index+1)
        });

        let updVersions = res.ruleConfig.specifiedVersionList.map((item,index)=>{
          return 'updVersions'+(index+1)
        });
        let specifiedVersionList = res.ruleConfig.specifiedVersionList;
        let shieldList = res.ruleConfig.shieldList;


        this.setState({
          exceptVersions:exceptVersions,
          updVersions:updVersions,
          specifiedVersionList:specifiedVersionList,
          upIndex:specifiedVersionList.length,
          shieldList:shieldList,
          exIndex:shieldList.length,
        });
      }
    })
  };


  onChange = (e) => {
    this.setState({
      updVersion: e.target.value,
    });
  }

  //升级版本
  addUpdVersion = () => {
    const {upIndex} = this.state;
    let newUpdVersions = this.state.updVersions;
    newUpdVersions.push(`updVersions${upIndex + 1}`);
    this.setState({
      updVersions: newUpdVersions,
      upIndex:upIndex+1,
    })
  };
  //屏蔽版本的添加
  addExceptVersion = () => {
    const {exIndex} = this.state;
    let newExceptVersions = this.state.exceptVersions;
    newExceptVersions.push(`exceptVersions${exIndex + 1}`);
    this.setState({
      exIndex:exIndex+1,
      exceptVersions: newExceptVersions,
    })
  };


  addUpdateVersionConfig=(e)=>{
    const{updVersions,exceptVersions} = this.state;
    const {upgradeId} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, formValues) => {
      if (!err) {
        let specifiedVersionLists = [];
        updVersions.map((item,i)=>{
          specifiedVersionLists.push(formValues[item])
        });
        let specifiedVersionList=specifiedVersionLists.filter(item=>item);

        let shieldLists = [];
        exceptVersions.map((item,i)=>{
          shieldLists.push(formValues[item])
        });
        let shieldList=shieldLists.filter(item=>item);
        let value = {
          mode:formValues.mode,
          upgradeId:upgradeId,
          specifiedVersionList:[...specifiedVersionList],
          shieldList:[...shieldList]
        };
        this.props.dispatch({
          type:'hardwareUpdate/fetch_addUpdateVersionConfig_action',
          payload:value
        })
      }
    });
  };

  delUpdVersion=(index)=>{
    let updVersions = this.state.updVersions;
    let specifiedVersionList = this.state.specifiedVersionList;
    updVersions.splice(index,1);
    specifiedVersionList.splice(index,1);
    let delUpd = updVersions;
    this.setState({
      updVersions: delUpd,
      specifiedVersionList:specifiedVersionList
    })
  };

  delExVersion=(index)=>{
    let exceptVersions = this.state.exceptVersions;
    let shieldList = this.state.shieldList;
    shieldList.splice(index,1);
    exceptVersions.splice(index,1);
    let delEx = exceptVersions;
    this.setState({
      exceptVersions: delEx,
      shieldList:shieldList
    })
  };

  exceptVersion=(e)=>{
    this.setState({
      exceptVersionChecked:e.target.checked
    })
  };




  render() {
    const { loading, formatMessage, hardwareUpdate: { getDeviceModalList},upgradeId,isItem} = this.props;
    const {updVersions, exceptVersions,updVersion,specifiedVersionList,shieldList} = this.state;
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
    const formItemLayout1 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };

    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
      width: '120px',
      marginRight: '8px',
    };

    return (
      <div>

        <Form>
          <Row>
            <Col span={2}><span style={{lineHeight: '39px'}}>{formatMessage(messages.upgrade_version)}</span></Col>
            <FormItem>
              {
                getFieldDecorator('mode', {
                  rules: [{
                    required: true, message: formatMessage(messages.select_version),
                  }],
                })(
                  <RadioGroup disabled={isItem} onChange={this.onChange}>
                    <Radio style={radioStyle} value={'ALL'}>{formatMessage(messages.all_version)}</Radio>
                    <Radio style={radioStyle} value={'LOW'}>{formatMessage(messages.low_version)}</Radio>
                    <div style={{display: 'flex'}}>
                      <Radio style={radioStyle} value={'SPECIFIED'}>{formatMessage(messages.appoint_version)}</Radio>
                      <div style={{width: 1000,display:'flex',flexWrap:'wrap'}}>
                        {
                          updVersions.map((item, index) => {
                            return (
                              <div key={index} style={{display:'flex',width:150}}>
                                <FormItem
                                  {...formItemLayout1}
                                >
                                  {
                                    getFieldDecorator(`${item}`, {
                                      rules: [{
                                        required: updVersion==='SPECIFIED'?true:false, message: formatMessage(messages.firmware_input_version),
                                      }],
                                      initialValue:specifiedVersionList.length>0?specifiedVersionList[index]:null
                                    })(
                                      <Input disabled={isItem} style={{width: 100}}/>
                                    )
                                  }
                                </FormItem>
                                {
                                  updVersions.length===1||isItem?null:<span style={{lineHeight: '39px',width:20,marginLeft:5}}><Icon type="close" onClick={()=>this.delUpdVersion(index)}/></span>
                                }

                              </div>
                            )
                          })
                        }
                        {
                          isItem?null:
                            <div style={{marginLeft: 10}} onClick={this.addUpdVersion}>
                              <Button style={{margin: '4px 0'}} icon={'plus'} type={'primary'}/>
                              <span style={{lineHeight: '40px',marginLeft:6}}>{formatMessage(basicMessages.add)}</span>
                            </div>
                        }

                      </div>

                    </div>
                    <div style={{display: 'flex'}}>
                      <Checkbox disabled={isItem} checked={this.state.exceptVersionChecked} style={radioStyle} onChange={this.exceptVersion}>{formatMessage(messages.shielding_version)}</Checkbox>
                      <div style={{width: 1000,display:'flex',flexWrap:'wrap'}}>
                        {
                          exceptVersions.map((item, index) => {
                            return (
                              <div key={index} style={{display:'flex',width:150}}>
                                <FormItem
                                  {...formItemLayout}
                                >
                                  {
                                    getFieldDecorator(`${item}`, {
                                      rules: [{
                                        //required: true, message: '请选择产品名称',
                                      }],
                                      initialValue: shieldList.length>0?shieldList[index]:null
                                    })(
                                      <Input disabled={isItem} style={{width: 100}}/>
                                    )
                                  }
                                </FormItem>
                                {
                                  exceptVersions.length===1||isItem?null:<span style={{lineHeight: '39px',width:20,marginLeft:5}}><Icon type="close" onClick={()=>this.delExVersion(index)}/></span>
                                }
                              </div>
                            )
                          })
                        }
                        {
                          isItem?null:
                            <div style={{marginLeft: 10}} onClick={this.addExceptVersion}>
                              <Button style={{margin: '4px 0'}} icon={'plus'} type={'primary'}/>
                              <span style={{lineHeight: '40px',marginLeft:6}}>{formatMessage(basicMessages.add)}</span>
                            </div>
                        }

                      </div>
                    </div>
                  </RadioGroup>
                )
              }
            </FormItem>
          </Row>
        </Form>


        {
          isItem?null:
            <div style={{textAlign: 'center',margin:'30px 0 50px 0'}}>
              <Button loading={loading} disabled={!upgradeId} type={'primary'} onClick={this.addUpdateVersionConfig}>{formatMessage(basicMessages.confirm)}</Button>
            </div>
        }

      </div>
    );
  }
}
