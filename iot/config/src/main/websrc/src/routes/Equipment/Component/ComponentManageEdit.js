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
  equipmentComponent,
  loading: loading.effects['equipmentComponent/fetch_updComponent_action'],
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

  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    this.loadComponentItems(JSON.parse(decodeURIComponent(data)));
  };
  loadComponentItems=(data)=>{
    this.props.dispatch({
      type:'equipmentComponent/fetch_componentItem_action',
      payload:{id:data.id},
    })
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
          type:'equipmentComponent/fetch_updComponent_action',
          payload:values,
        })
      }
    });
  };


  render() {
    const {history,loading,equipmentComponent:{componentItems},match:{params:{data}},intl:{formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const componentItem = componentItems[item.id];
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
            {/*title={<span style={{color: '#3f89e1'}}>编辑组件</span>}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.equipmentComponent)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('id', {
                      // rules: [{
                      //   required: true, message: '请选择过滤器组件!',
                      // }],
                      initialValue: componentItem&&componentItem.id
                    })(
                      <span>{componentItem&&componentItem.name}</span>
                    )
                  }

                </FormItem>
                <FormItem
                  label={formatMessage(messages.version)}
                  {...formItemLayout}
                >
                  <span>{componentItem&&componentItem.version}</span>

                </FormItem>
                <FormItem
                  label={formatMessage(basicMessages.status)}
                  {...formItemLayout}
                >
                  <span>{item&&item.status}</span>

                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.createTime)}
                  {...formItemLayout}
                >
                  <span>{item&&item.createTime}</span>

                </FormItem>
                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('desc', {
                      initialValue:componentItem&&componentItem.desc
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
                      this.props.dispatch(routerRedux.push('/equipment/componentManage'))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

        </Card>

      </PageHeaderLayout>
    );
  }
}
