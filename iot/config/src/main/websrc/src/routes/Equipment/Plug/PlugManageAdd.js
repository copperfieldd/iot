import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Card,
  Select,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import PluginListModal from "../Modal/PluginListModal";
import styles from "../../Warning/Warning.less";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";



const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

@connect(({equipmentPlugin, loading}) => ({
  equipmentPlugin,
  loading: loading.effects['equipmentPlugin/fetch_addPlugin_action'],
}))
@injectIntl
@Form.create()
export default class PlugManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible: false,
      appConfigVisible: false,
      addressInputList: [],
      clazz:null,
    }
  };

  componentWillMount() {
  };

  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    const {clazz} = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let newValue;
        if(clazz==='RestApiCallPlugin'){
          newValue={
            modelId:values.modelId,
            name:values.name,
            desc:values.desc,
            config:{
              protocol:values.protocol,
              host:values.host,
              port:values.port,
              basePath:values.basePath,
              userName:values.userName,
              password:values.password,
              headers:[],
            }
          }
        }else{
          newValue={
            modelId:values.modelId,
            name:values.name,
            desc:values.desc,
            // config:{
            //   headers:[]
            // }
          }
        }
        this.props.dispatch({
          type: 'equipmentPlugin/fetch_addPlugin_action',
          payload: newValue,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/plugManage/edit/${encodeURIComponent(JSON.stringify(res))}`));
          }
        })
      }
    });
  };

  render() {
    const {history, loading,intl:{formatMessage}} = this.props;
    const {checkedPlugin, modalVisible} = this.state;

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
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.equipmentPlugName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('modelId', {
                      rules: [{
                        required: true, message: formatMessage(messages.equipmentPlugNameSelect),
                      }],
                    })(
                      <div onClick={this.changeModalVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                        <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                          <span>{checkedPlugin && checkedPlugin.name}</span>
                        </div>
                        <Input value={checkedPlugin && checkedPlugin.id} style={{display: 'none'}}/>
                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }

                </FormItem>
                {
                  this.state.clazz==='RestApiCallPlugin'?<div>
                    <FormItem
                      label={formatMessage(messages.equipmentInputPlugName)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('name', {
                          rules: [{
                            required: true, message:formatMessage(messages.equipmentInputPlugNameInput),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                        })(
                          <Input placeholder={formatMessage(messages.equipmentInputPlugNameInput)}/>
                        )
                      }
                    </FormItem>
                    <FormItem
                      label={formatMessage(messages.protocol)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('protocol', {
                          rules: [{
                            required: true, message:formatMessage(messages.equipment_protocol_select),
                          }],
                          initialValue:'HTTP'
                        })(
                          <Select>
                            <Option value='HTTP'>HTTP</Option>
                          </Select>
                        )
                      }
                    </FormItem>

                    <FormItem
                      label={'IP'}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('host', {
                          rules: [{
                            required: true, message:formatMessage(messages.eq_ip_address),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                        })(
                          <Input placeholder={formatMessage(messages.eq_ip_address)}/>
                        )
                      }
                    </FormItem>

                    <FormItem
                      label={formatMessage(basicMessages.port)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('port', {
                          rules: [{
                            required: true, message:formatMessage(basicMessages.portInput),
                          },{
                            pattern: '^[0-9]*$', message: formatMessage(basicMessages.InputNum),
                          }],
                        })(
                          <Input placeholder={formatMessage(basicMessages.portInput)}/>
                        )
                      }
                    </FormItem>

                    <FormItem
                      label={formatMessage(messages.eq_interface_address)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('basePath', {
                          rules: [{
                            required: true, message:formatMessage(messages.eq_input_address),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                        })(
                          <Input placeholder={formatMessage(messages.eq_input_address)}/>
                        )
                      }
                    </FormItem>
                    <FormItem
                      label={formatMessage(basicMessages.username)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('userName', {
                          rules: [{
                            required: true, message:formatMessage(messages.eq_input_username),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                        })(
                          <Input autoComplete="new-password" placeholder={formatMessage(messages.eq_input_username)}/>
                        )
                      }
                    </FormItem>


                    <FormItem
                      label={formatMessage(basicMessages.passwordTitle)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('password', {
                          rules: [{
                            required: true, message:formatMessage(basicMessages.passwordInput),
                          }],
                        })(
                          <Input placeholder={formatMessage(basicMessages.passwordInput)}/>
                        )
                      }
                    </FormItem>
                  </div>:this.state.clazz==='TelemetryStoragePlugin'?
                    <FormItem
                      label={formatMessage(messages.equipmentInputPlugName)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('name', {
                          rules: [{
                            required: true, message:formatMessage(messages.equipmentInputPlugNameInput),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                        })(
                          <Input placeholder={formatMessage(messages.equipmentInputPlugNameInput)}/>
                        )
                      }
                    </FormItem>:null
                }

                <FormItem
                  label={formatMessage(messages.version)}
                  {...formItemLayout}
                >
                  <span>{checkedPlugin && checkedPlugin.version}</span>
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
                      <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                    )
                  }
                </FormItem>
              </Form>
            </div>
          {/*</Card>*/}
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <PluginListModal
            status={0}
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.setState({
                checkedPlugin: value,
                clazz:value.clazz
              });
              this.props.form.setFieldsValue({modelId: value.id})
            }}
          />


        </Card>
      </PageHeaderLayout>
    );
  }
}
