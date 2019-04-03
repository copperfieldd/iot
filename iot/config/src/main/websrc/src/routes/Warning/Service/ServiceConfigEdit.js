import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card} from 'antd';
import styles from '../Warning.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/warning';
import basicMessages from '../../../messages/common/basicTitle';


const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({warningService, loading}) => ({
  warningService,
  loading: loading.effects['warningService/fetch_updWarningService_action'],
}))
@injectIntl
@Form.create()
export default class ServiceConfigEdit extends Component {
  constructor() {
    super();
    this.state = {}
  };

  handleSubmit = (e) => {
    const {form, match: {params: {data}}} = this.props;
    const dataItem = JSON.parse(decodeURIComponent(data));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          id: dataItem.id,
        };
        this.props.dispatch({
          type: 'warningService/fetch_updWarningService_action',
          payload: value,
        });
      }
    });
  };


  render() {
    const {history, match: {params: {data}}, loading, intl: {formatMessage}} = this.props;
    const dataItem = JSON.parse(decodeURIComponent(data));
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
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('serviceDesc', {
                    rules: [
                      {
                        required: true, message: formatMessage(basicMessages.describeInput),
                      }, {
                        max: 64, message: formatMessage(basicMessages.moreThan64)
                      }
                    ],
                    initialValue: dataItem && dataItem.serviceDesc
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
        </Card>

      </PageHeaderLayout>
    );
  }
}
