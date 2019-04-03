import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Input, Card} from 'antd';
import styles from '../SecurityAudit.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/securityAudit';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;
const TextArea = Input.TextArea;


@connect(({securityAudit, loading}) => ({
  securityAudit,
  loading: loading.effects['securityAudit/fetch_addType_action'],
}))
@injectIntl
@Form.create()
export default class AuditTypeAdd extends Component {
  constructor() {
    super();
    this.state = {}
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'securityAudit/fetch_addType_action',
          payload: values,
          callback: (res) => {
            this.props.dispatch(routerRedux.push(`/securityAudit/auditType/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        })
      }
    });
  };


  render() {
    const {history, loading, intl: {formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
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
                label={formatMessage(messages.auditName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.auditNameInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.auditNameInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.type)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('type', {
                    rules: [{
                      required: true, message: formatMessage(messages.auditTypeInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.auditTypeInput)}/>
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
                      max: 64, message: formatMessage(basicMessages.moreThan64)
                    }],
                  })(
                    <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                  )
                }
              </FormItem>
            </Form>
          </div>
          <div className='TxTCenter' style={{width: 500, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
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
