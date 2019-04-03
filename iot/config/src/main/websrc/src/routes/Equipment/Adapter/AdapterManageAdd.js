import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Card,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import AdapterListModal from '../Modal/AdapterListModal'
import styles from "../../Warning/Warning.less";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";
const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({equipmentAdapter, loading}) => ({
  equipmentAdapter,
  loading: loading.effects['equipmentAdapter/fetch_addAdpater_action'],
}))
@injectIntl
@Form.create()
export default class AdapterManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible:false,
      appConfigVisible:false,
      addressInputList:[],
      checkedAdapter:null,
      modalVisible:false,
    }
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'equipmentAdapter/fetch_addAdpater_action',
          payload:values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/adapterManage/edit/${res.id}`));
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
    const {checkedAdapter,modalVisible} = this.state;
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
                  label={formatMessage(messages.adapterName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('id', {
                      rules: [{
                        required: true, message: formatMessage(messages.adapterNameSelect),
                      }],
                      initialValue: checkedAdapter&&checkedAdapter.id,
                    })(
                      <div onClick={this.changeModalVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                        <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                          <span>{checkedAdapter && checkedAdapter.name}</span>
                        </div>
                        <Input value={checkedAdapter && checkedAdapter.id} style={{display: 'none'}}/>
                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.version)}
                  {...formItemLayout}
                >
                  <span>{checkedAdapter && checkedAdapter.version}</span>
                </FormItem>

                <FormItem
                  label={formatMessage(messages.protocol)}
                  {...formItemLayout}
                >
                  <span>{checkedAdapter && checkedAdapter.protocol}</span>

                </FormItem>


                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('desc', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                    })(
                      <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                    )
                  }

                </FormItem>
              </Form>
            </div>
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

          <AdapterListModal
            status={0}
            modalVisible={modalVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.setState({
                checkedAdapter: value
              });
              this.props.form.setFieldsValue({id:value.id})
            }}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
