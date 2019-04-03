import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Input, Select, Card} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@injectIntl
@connect(({permissionsApi, loading,global}) => ({
  permissionsApi,
  global,
  loading: loading.effects['permissionsApi/fetch_updApi_action'],
}))
@Form.create()
export default class ApiManageEdit extends Component {
  constructor() {
    super();
    this.state = {

    }
  };
  componentDidMount() {
    const { match:{ params:{ id } } } = this.props;
    if(id){
      this.loadApiManageItem(id);
    }
  };

  //API详情
  loadApiManageItem=(id)=>{
    this.props.dispatch({
      type:'permissionsApi/fetch_apiItem_action',
      payload:{
        id:id
      }
    })
  };

  //修改API
  handleSubmit = (e) => {
    const { form } = this.props;
    const { match:{ params:{ id } } } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const value = {
        id:id,
        ...values,
      }
      if (!err) {
        this.props.dispatch({
          type:'permissionsApi/fetch_updApi_action',
          payload:value
        });
      }
    });
  };


  render() {
    const { history,permissionsApi:{apiItems},match:{ params:{ id }},loading,intl:{formatMessage} } = this.props;
    const data = apiItems[id];
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
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >

          {/*<Card*/}
            {/*title={<span style={{color:'#3f89e1'}}>编辑接口</span>}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width:500}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.interface)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.inputApiName),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: data&&data.name
                    })(
                      <Input placeholder={formatMessage(messages.inputApiName)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.type)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('type', {
                      initialValue: data&&data.type
                    })(
                      <Select>
                        <Option value={0}>{formatMessage(basicMessages.private)}</Option>
                        <Option value={1}>{formatMessage(basicMessages.public)}</Option>
                      </Select>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.address)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('dataUrl', {
                      rules: [{
                        required: true, message: formatMessage(messages.inputApiAddress),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: data&&data.dataUrl
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
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                      initialValue: data&&data.remarks
                    })(
                      <TextArea  placeholder={formatMessage(basicMessages.describeInput)} rows={4} />
                    )
                  }
                </FormItem>
              </Form>
          </div>
          {/*</Card>*/}
          <div className='TxTCenter' style={{width:500,margin:'30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e)=>{
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
