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
import FirstTypeListModal from '../Modal/FirstTypeListModal'
import styles from "../../Warning/Warning.less";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({equipmentTypeManage, loading}) => ({
  equipmentTypeManage,
  loading: loading.effects['equipmentTypeManage/fetch_addSecondType_action'],
}))
@injectIntl
@Form.create()
export default class SecondTypeAdd extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible:false,
      appConfigVisible:false,
      addressInputList:[],
      checkedFirstType:null,
      modalVisible:false,
    }
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'equipmentTypeManage/fetch_addSecondType_action',
          payload:values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/typeManage/SecondEdit/${encodeURIComponent(JSON.stringify(res))}`));
          }
        })
      }
    });
  };
  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  render() {
    const {history,loading,intl:{formatMessage}} = this.props;
    const {checkedFirstType,modalVisible} = this.state;
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
                  getFieldDecorator('deviceTypeId', {
                    rules: [{
                      required: true, message: formatMessage(messages.equipmentTypeSelect),
                    }],
                    initialValue: checkedFirstType&&checkedFirstType.id,
                  })(
                    <div onClick={this.changeModalVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                      <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                        <span>{checkedFirstType && checkedFirstType.name}</span>
                      </div>
                      <Input value={checkedFirstType && checkedFirstType.id} style={{display: 'none'}}/>
                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.equipment_device_model)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.equipment_device_model_input),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.equipment_device_model_input)}/>
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
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <FirstTypeListModal
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.setState({
                checkedFirstType: value
              })
              this.props.form.setFieldsValue({deviceTypeId:value.id})
            }}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
