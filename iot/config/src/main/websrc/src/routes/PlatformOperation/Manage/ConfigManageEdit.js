import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card,} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "../../Permissions/Permissions.less";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_updPlatformConfig_action'],
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
      dataItem: null,
    }
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    this.props.dispatch({
      type: 'platformOperation/fetch_platformConfigItem_action',
      payload: {
        id: data,
      }
    })
  }

  handleSubmit = (e) => {
    const {form, match: {params: {data}}} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          id: data,
        };
        this.props.dispatch({
          type: 'platformOperation/fetch_updPlatformConfig_action',
          payload: value,
        })
      }
    });
  };

  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  render() {
    const {history, loading, platformOperation: {configItem}, match: {params: {data}}, intl: {formatMessage}} = this.props;
    const {modalVisible} = this.state;
    const dataItem = configItem[data];
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
          <div className='mrgTB30' style={{width: 700}}>
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
                    initialValue: dataItem && dataItem.fileName
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
                    initialValue: dataItem && dataItem.serviceName

                  })(
                    <Input placeholder={formatMessage(messages.serviceNameInput)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.configFileContent)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('content', {
                    rule: [{
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: dataItem && dataItem.content
                  })(
                    <TextArea placeholder={formatMessage(messages.configFileContentInput)} rows={8}/>
                  )
                }
              </FormItem>
            </Form>
          </div>

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

        </Card>
      </PageHeaderLayout>
    );
  }
}
