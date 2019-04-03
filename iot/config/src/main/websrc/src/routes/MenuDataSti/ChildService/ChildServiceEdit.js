import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Input, Card} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
import opr_messages from "../../../messages/operation";
import messages from "../../../messages/statistics";

const FormItem = Form.Item;


@connect(({dataSti, loading}) => ({
  loading: loading.effects['dataSti/fetch_updStiService_action'],
}))
@injectIntl
@Form.create()
export default class ChildServiceEdit extends Component {
  constructor() {
    super();
    this.state = {}
  };


  handleSubmit = (e) => {
    const {form} = this.props;
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'dataSti/fetch_updStiService_action',
          payload:{
            id:item.id,
            ...values,
          },
        })
      }
    });
  };


  render() {
    const {history,loading,intl:{formatMessage},match:{params:{data}}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const item = JSON.parse(decodeURIComponent(data));

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
                    initialValue:item.serviceName,
                  })(
                    <Input placeholder={formatMessage(opr_messages.serviceNameInput)}/>
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
                      required: true, //message: "请输入域名称",
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue:item.domain,
                  })(
                    <Input disabled={true} />
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
                      this.props.dispatch(routerRedux.push('/menuDataSti/childService'))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
