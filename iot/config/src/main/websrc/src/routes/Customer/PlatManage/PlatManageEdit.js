import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card, message} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import basicMessages from "../../../messages/common/basicTitle";
import {FormattedMessage, injectIntl} from "react-intl";
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;
const {TextArea} = Input;

@connect(({platManage, loading}) => ({
  platManage,
  loading: loading.effects['platManage/fetch_addApi_action'],
}))
@injectIntl
@Form.create()
export default class PlatManageAdd extends Component {
  constructor() {
    super();
    this.state = {}
  };

  //修改
  handleSubmit = (e) => {
    const {form,match:{params:{data}},intl:{formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.password!==values.surePassword){
          message.error(formatMessage(basicMessages.passwordInconsistent));
          return;
        }
        let value = {
          ...values,
          id:item.id,
        };
        this.props.dispatch({
          type: 'platManage/fetch_updPlatManager_action',
          payload: value,
        });
      }
    });
  };

  render() {
    const {loading,match:{params:{data}},intl:{formatMessage}} = this.props;
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
    const {getFieldDecorator} = this.props.form;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px',}}
          bordered={false}
        >
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(basicMessages.account)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('loginName', {
                      rules: [{
                        required: true, message: formatMessage(basicMessages.accountInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue:item.loginName
                    })(
                      <Input placeholder={formatMessage(basicMessages.accountInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                      initialValue: item.remarks
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
            }}><FormattedMessage {...basicMessages.confirm} /></Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      this.props.dispatch(routerRedux.push(`/customer/platManager`))
                    }}
            ><FormattedMessage {...basicMessages.return} /></Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
