import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card, message,} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/operation';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;

@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_updLifeState_action'],
}))
@injectIntl
@Form.create()
export default class ServiceLife extends Component {
  constructor() {
    super();
    this.state = {}
  };


  componentDidMount() {
    this.props.dispatch({
      type: 'platformOperation/fetch_getLifeState_action',
      payload: '',
    })
  }


  handleSubmit = (e) => {
    const {form, intl: {formatMessage}} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let reg = /^[0-9]*$/;
        if (!reg.test(values.cycle) || !reg.test(values.failureNumber)) {
          message.error(formatMessage(basicMessages.InputNum))
          return
        }
        this.props.dispatch({
          type: 'platformOperation/fetch_updLifeState_action',
          payload: values,
        })
      }
    });
  };

  render() {
    const {history, loading, platformOperation: {lifeState}, intl: {formatMessage}} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
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
                label={formatMessage(messages.detectionPeriod)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('cycle', {
                    rules: [{
                      required: true, message: formatMessage(messages.detectionPeriodInput),
                    }],
                    initialValue: lifeState && lifeState.cycle ? parseInt(lifeState.cycle) : null
                  })(
                    <Input placeholder={formatMessage(messages.detectionPeriodInput)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.detectionFailureTimes)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('failureNumber', {
                    rules: [{
                      required: true, message: formatMessage(messages.detectionFailureTimesInput),
                    }],
                    initialValue: lifeState && lifeState.failureNumber ? parseInt(lifeState.failureNumber) : null
                  })(
                    <Input placeholder={formatMessage(messages.detectionFailureTimesInput)}/>
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
