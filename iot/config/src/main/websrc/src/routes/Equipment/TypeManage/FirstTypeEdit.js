import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Select,
  Card,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({equipmentTypeManage, loading}) => ({
  equipmentTypeManage,
  loading: loading.effects['equipmentTypeManage/fetch_editFirstType_action'],
}))
@injectIntl
@Form.create()
export default class FirstTypeAdd extends Component {
  constructor() {
    super();
    this.state = {
    }
  };

  handleSubmit = (e) => {
    const {form,match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'equipmentTypeManage/fetch_editFirstType_action',
          payload:{
            id:item.id,
            ...values,
          },
          callback:(res)=>{
            //this.props.dispatch(routerRedux.push(`/equipment/adapterManage/edit/${res.id}`));
          }
        })
      }
    });
  };

  render() {
    const {loading,intl:{formatMessage}} = this.props;
    const {form,match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
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
                label={formatMessage(messages.equipmentType)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message:  formatMessage(messages.equipment_device_type_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue:item&&item.name
                  })(
                    <Input rows={4} placeholder={ formatMessage(messages.equipment_device_type_input)}/>
                  )
                }

              </FormItem>
            </Form>
          </div>
          {/*</Card>*/}
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e)=>{
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                     this.props.dispatch(routerRedux.push(`/equipment/TypeFirstManage`))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}
