import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Card, Select,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "../../Warning/Warning.less";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({equipmentPlugin, loading}) => ({
  equipmentPlugin,
  loading: loading.effects['equipmentPlugin/fetch_pluginItem_action'],
  updateLoading:loading.effects['equipmentPlugin/fetch_updPlugin_action'],
}))
@injectIntl
@Form.create()
export default class PlugManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible: false,
      appConfigVisible: false,
      addressInputList: [],
    }
  };

  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    const {id} = JSON.parse(decodeURIComponent(data));
    this.loadPluginItem(id);
  }

  loadPluginItem=(data)=>{
    this.props.dispatch({
      type:'equipmentPlugin/fetch_pluginItem_action',
      payload:{id:data}
    })
  };


  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {match:{params:{data}},equipmentPlugin:{pluginItems}} = this.props;
        const pluginItem = JSON.parse(decodeURIComponent(data));
        const item = pluginItems[pluginItem.id];

        let newValue;
        if(item.clazz==='RestApiCallPlugin'){
          newValue={
            ...item,
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
            ...item,
            modelId:values.modelId,
            name:values.name,
            desc:values.desc,
            // config:{
            //   headers:[]
            // }
          }
        }
        this.props.dispatch({
          type: 'equipmentPlugin/fetch_updPlugin_action',
          payload: newValue,
        })
      }
    });
  };

  render() {
    const {history, loading,match:{params:{data}},equipmentPlugin:{pluginItems},updateLoading,intl:{formatMessage}} = this.props;
    const pluginItem = JSON.parse(decodeURIComponent(data));

    const {checkedPlugin, modalVisible} = this.state;
    const item = pluginItems[pluginItem.id];
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
            {/*loading={loading}*/}
            {/*title={*/}
              {/*<span style={{color: '#3f89e1'}}>编辑插件</span>*/}
            {/*}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width: 600}}>
              <Form>

                <FormItem
                  label={formatMessage(messages.equipmentPlugName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('type', {
                      initialValue:item&&item.type
                    })(
                      <Input disabled/>
                    )
                  }

                </FormItem>

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
                      initialValue:item&&item.name
                    })(
                      <Input placeholder={formatMessage(messages.equipmentInputPlugNameInput)}/>
                    )
                  }
                </FormItem>

                {
                  item&&item.clazz==='RestApiCallPlugin'?<div>

                    <FormItem
                      label={formatMessage(messages.protocol)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('protocol', {
                          rules: [{
                            required: true, message:formatMessage(messages.equipment_protocol_select),
                          }],
                          initialValue:item&&item.config.protocol
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
                          initialValue:item&&item.config.host
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
                          initialValue:item&&item.config.port

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
                          initialValue:item&&item.config.basePath

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
                          initialValue:item&&item.config.userName

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
                          initialValue:item&&item.config.password

                        })(
                          <Input placeholder={formatMessage(basicMessages.passwordInput)}/>
                        )
                      }
                    </FormItem>
                  </div>:item&&item.clazz==='TelemetryStoragePlugin'?
                   null:null
                }

                <FormItem
                  label={formatMessage(messages.version)}
                  {...formItemLayout}
                >
                  <span>{checkedPlugin ? checkedPlugin.version:item&&item.version}</span>


                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.creator)}
                  {...formItemLayout}
                >
                  <span>{checkedPlugin ? checkedPlugin.createUsername:item&&item.username}</span>

                </FormItem>
                <FormItem
                  label={formatMessage(basicMessages.createTime)}
                  {...formItemLayout}
                >
                  <span>{checkedPlugin ? checkedPlugin.createTime:item&&item.createTime}</span>
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
                      // rules: [{
                      //   required: true, message: '请输入描述!',
                      // }],
                      initialValue:item&&item.desc
                    })(
                      <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                    )
                  }

                </FormItem>
              </Form>
            </div>
          {/*</Card>*/}
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button type='primary' loading={updateLoading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      this.props.dispatch(routerRedux.push('/equipment/plugManage'))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>




        </Card>
      </PageHeaderLayout>
    );
  }
}
