import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Select, Card, Input, Icon} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ComponentListModal from '../Modal/ComponentListModal';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";


const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;



@connect(({equipmentComponent, loading}) => ({
  loading: loading.effects['equipmentComponent/fetch_addComponent_action'],
}))
@injectIntl
@Form.create()
export default class ComponentManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible:false,
      checkedComponent:null,
    }
  };


  changeVisible=()=>{
    this.setState({
      modalVisible:!this.state.modalVisible,
    })
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'equipmentComponent/fetch_addComponent_action',
          payload:values,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/componentManage/edit/${encodeURIComponent(JSON.stringify(res))}`))
          }
        })
      }
    });
  };


  render() {
    const {history,loading,intl:{formatMessage}} = this.props;
    const {checkedComponent,modalVisible} = this.state;
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
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          {/*<Card*/}
           {/*title={<span style={{color: '#3f89e1'}}>新增组件</span>}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.equipmentComponent)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('id', {
                      rules: [{
                        required: true, message: formatMessage(messages.equipmentComponentSelect),
                      }],
                    })(
                      <div onClick={this.changeVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                        <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                          <span>{checkedComponent && checkedComponent.name}</span>
                        </div>
                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }

                </FormItem>
                <FormItem
                  label={formatMessage(messages.version)}
                  {...formItemLayout}
                >
                  <span>{checkedComponent&&checkedComponent.version}</span>

                </FormItem>
                <FormItem
                  label={formatMessage(basicMessages.status)}
                  {...formItemLayout}
                >
                  <span>{checkedComponent&&checkedComponent.status}</span>

                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.createTime)}
                  {...formItemLayout}
                >
                  <span>{checkedComponent&&checkedComponent.createTime}</span>

                </FormItem>
                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('desc', {
                    })(
                      <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                    )
                  }

                </FormItem>
              </Form>
            </div>
          {/*</Card>*/}
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


        <ComponentListModal
          status={0}
          modalVisible={modalVisible}
          onCancelModal={this.changeVisible}
          handleCheckValue={(value)=>{
            this.setState({
              checkedComponent:value
            })
            this.props.form.setFieldsValue({id:value.id})
          }}
        />
      </PageHeaderLayout>
    );
  }
}
