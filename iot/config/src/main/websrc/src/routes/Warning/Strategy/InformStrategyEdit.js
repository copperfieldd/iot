import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Icon, Form, Input, Card} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import StrategyServiceConfigModal from "../Modal/StrategyServiceConfigModal";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const TextArea = Input.TextArea;


@connect(({warning, warningStrategy, loading}) => ({
  warning,
  warningStrategy,
  loading: loading.effects['warningStrategy/fetch_updWarningStrategyList_action'],
}))
@injectIntl
@Form.create()
export default class InformStrategyAdd extends Component {
  constructor() {
    super();
    this.state = {}
  };

  handleSubmit = (e) => {
    const {form, match: {params: {data}}, warning: {serviceConfigCheckedValue}} = this.props;
    const dataItem = JSON.parse(decodeURIComponent(data));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...dataItem,
          ...values,
        };
        this.props.dispatch({
          type: 'warningStrategy/fetch_updWarningStrategyList_action',
          payload: value,
        });
      }
    });
  };


  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  render() {
    const {history, loading, match: {params: {data}}, intl: {formatMessage}} = this.props;
    const dataItem = JSON.parse(decodeURIComponent(data));
    const {modalVisible, checkedValue} = this.state;

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
                label={formatMessage(basicMessages.name)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('notifyName', {
                    rules: [{
                      required: true, message: formatMessage(messages.inputApiName),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: dataItem && dataItem.notifyName
                  })(
                    <Input placeholder={formatMessage(messages.inputApiName)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.serviceName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('accessKey', {
                    rules: [{
                      required: true, message: formatMessage(messages.serviceNameSelect),
                    }],
                    initialValue: dataItem && dataItem.accessKey,
                  })(
                    <div onClick={this.changeModalVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                      <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                        <span>{checkedValue ? checkedValue.serviceName : dataItem && dataItem.serviceName}</span>
                      </div>
                      <Input defaultValue={checkedValue && checkedValue.serviceName}
                             style={{display: 'none'}}/>
                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.interface)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('interfaceName', {
                    rules: [{
                      required: true, message: formatMessage(messages.inputApiName),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: dataItem && dataItem.interFaceName,
                  })(
                    <Input placeholder={formatMessage(messages.inputApiName)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.address)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('notifyUrl', {
                    rules: [{
                      required: true, message: formatMessage(messages.inputApiAddress),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: dataItem && dataItem.notifyUrl,
                  })(
                    <Input placeholder={formatMessage(messages.inputApiAddress)}/>
                  )
                }
              </FormItem>


              <FormItem
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('notifyUrlDesc', {
                    rules: [{
                      max: 64, message: formatMessage(basicMessages.moreThan64)
                    }],
                    initialValue: dataItem && dataItem.urlDesc,
                  })(
                    <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
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

          <StrategyServiceConfigModal
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            id={dataItem.id}
            handleCheckValue={(value) => {
              this.setState({
                checkedValue: value
              });
              this.props.form.setFieldsValue({accessKey: value.accessKey})
            }}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
