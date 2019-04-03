import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Input,Card} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import opr_messages from "../../../messages/operation";
import messages from "../../../messages/statistics";
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;


@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_addStiService_action'],
}))
@injectIntl
@Form.create()
export default class ChildServiceAdd extends Component {
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
          type:'dataSti/fetch_addStiService_action',
          payload:values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/menuDataSti/childService/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        })
      }
    });
  };


  render() {
    const {history,loading,intl:{formatMessage}} = this.props;
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
                label={formatMessage(opr_messages.serviceName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('serviceName', {
                    rules: [{
                      required: true, message: formatMessage(opr_messages.serviceNameInput),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={ formatMessage(opr_messages.serviceNameInput)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.sti_service_domain)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('domain', {
                    rules: [{
                      required: true, message: formatMessage(messages.sti_service_domain_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder= {formatMessage(messages.sti_service_domain_input)}/>
                  )
                }
              </FormItem>
            </Form>
          </div>
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e)=>{
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
