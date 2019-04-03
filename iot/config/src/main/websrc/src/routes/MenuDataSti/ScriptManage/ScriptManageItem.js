import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { Button, Form, Input, Card} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { injectIntl } from 'react-intl';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
import messages from "../../../messages/statistics";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({dataSti,  permissions, loading}) => ({
  permissions,
  dataSti,
  loading: loading.effects['dataSti/fetch_addAnalytic_action'],
}))
@injectIntl
@Form.create()
export default class ScriptManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible:false,
      serviceValue:null,
    }
  };

  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.form.setFieldsValue({serviceKey:item.serviceKey})
    this.setState({
      serviceValue:{
        serviceName:item.serviceName,
        serviceKey:item.serviceKey,
      }
    })
  }



  handleSubmit = (e) => {
    const {form} = this.props;
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'dataSti/fetch_editAnalytic_action',
          payload:{
            id:item.id,
            ...values,
          },
        })
      }
    });
  };

  openModal=()=>{
    this.setState({
      modalVisible:!this.state.modalVisible
    });

  }


  render() {
    const {history,loading,intl:{formatMessage},match:{params:{data}}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const item = JSON.parse(decodeURIComponent(data));

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
                  label={formatMessage(basicMessages.service)}
                  {...formItemLayout}
                >
                  <span>{this.state.serviceValue&&this.state.serviceValue.serviceName}</span>
                </FormItem>

              <FormItem
                label={formatMessage(messages.sti_script_name)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    initialValue:item.name,
                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.sti_script_tag)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('tag', {
                    initialValue:item.tag,

                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('remark', {
                    initialValue:item.remark,

                  })(
                    <TextArea disabled rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                  )
                }
              </FormItem>
              <FormItem
                label={formatMessage(messages.sti_script_content)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('script', {
                    initialValue:item.script,

                  })(
                    <TextArea disabled rows={4}/>
                  )
                }
              </FormItem>
            </Form>
          </div>
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button
                    onClick={()=>{
                      this.props.dispatch(routerRedux.push('/menuDataSti/scriptManage'))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>


      </PageHeaderLayout>
    );
  }
}
