import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Icon, Form, Input, Card, Radio,} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ConfigModal from './Modal/ConfigModal';
import styles from "../../Permissions/Permissions.less";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';


const FormItem = Form.Item;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_addPlatformConfig_action'],
}))
@injectIntl
@Form.create()
export default class ConfigManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      value: 1,
      modalVisible: false,
      configFile: null,
    }
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'platformOperation/fetch_addPlatformConfig_action',
          payload: values,
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
    const {history, loading, intl: {formatMessage}} = this.props;
    const {modalVisible, configFile} = this.state;
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
                label={formatMessage(messages.fileName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('fileName', {
                    rules: [{
                      required: true, message: formatMessage(messages.fileNameInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.fileNameInput)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.serviceName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('serviceName', {
                    rules: [{
                      required: true, message: formatMessage(messages.serviceNameInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.serviceNameInput)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.copy)}
                {...formItemLayout}
              >
                {
                  <RadioGroup defaultValue={this.state.value} onChange={this.onChange}>
                    <Radio value={1}>{formatMessage(basicMessages.yes)}</Radio>
                    <Radio value={2}>{formatMessage(basicMessages.no)}</Radio>
                  </RadioGroup>
                }

              </FormItem>
              {
                this.state.value === 1 ?
                  <FormItem
                    label={formatMessage(messages.configFile)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('id', {
                        rules: [{
                          required: true, message: '请选择配置文件!',
                        }],
                        initialValue: configFile && configFile.id
                      })(
                        <div onClick={this.changeModalVisible} className={styles.ele_input_addStype}
                             style={{height: 35}}>

                          <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                            <span>{configFile && configFile.configFile}</span>
                          </div>

                          <Icon className={styles.down_icon} type="down"/>
                        </div>
                      )
                    }

                  </FormItem> :
                  <FormItem
                    label={formatMessage(messages.configFileContent)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('content', {
                        rules: [{
                          required: true, message: '请输入配置文件内容!',
                        }, {
                          max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                        }],
                      })(
                        <TextArea placeholder={formatMessage(messages.configFileContentInput)} rows={4}/>
                      )
                    }

                  </FormItem>
              }

            </Form>
          </div>


          {/*</Card>*/}
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>


          <ConfigModal
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.props.form.setFieldsValue({id: value.id})
              this.setState({
                configFile: value
              })
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
