import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Tabs, Modal, Row, Col, Select} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import basicMessages from "../../../messages/common/basicTitle";
import {FormattedMessage, injectIntl} from 'react-intl';
import ServiceRaidoModal from "../Modal/ServiceRaidoModal";
import {formatStructure} from '../../../utils/utils'
import messages from '../../../messages/statistics';
import per_messages from "../../../messages/permission";
const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
import ReactJson from 'react-json-view';

@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class DataTableAdd extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      showNext: null,
      structure: [],
      modalVisible:false,
      urlName:[],
      data:{},
      index:0,
      dataSt:[],
    }
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };



  render() {
    const {modalVisibleSer} = this.state;
    const {intl: {formatMessage},loading,history,match:{params:{data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
    const {getFieldDecorator} = this.props.form;

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
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <p className="TxTCenter" style={{marginTop: 20}}>{formatMessage(messages.sti_table_basic_information)}</p>
          <Form>
            <Row>
              <Col span={8}>
                <FormItem
                  label={formatMessage(basicMessages.service)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('serviceKey', {
                      rules: [{
                        required: true, //message: "请输入服务名称",
                      }],
                    })(
                      <div className={styles.ele_input_addStype} style={{height:32,lineHeight:'32px'}}>
                        {
                          <div disabled style={{marginLeft:6}}>
                            <span>{item.serviceName}</span>
                          </div>
                        }
                        <Icon className={styles.down_icon}  type="down" />
                      </div>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage(messages.sti_table_name)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('collectionName', {
                      rules: [{
                        required: true, //message: "请输入表名称",
                      }],
                      initialValue:item.collectionName
                    })(
                      <Input disabled/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage(messages.sti_table_tag)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('collectionId', {
                      rules: [{
                        required: true, //message: "请输入表标识",
                      }],
                      initialValue:item.collectionId
                    })(
                      <Input disabled/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remark', {
                      rules: [{
                        required: true, //message: "请输入描述",
                      }],
                      initialValue:item.remark
                    })(
                      <TextArea disabled rows={3}/>
                    )
                  }
                </FormItem>
              </Col>

            </Row>
          </Form>

          <div style={{width:'50%',height:300,border:'solid 1px #999',marginBottom:20,marginLeft:20,overflowY:"scroll"}}>
            <ReactJson src={item.structure} enableClipboard={false} />
          </div>

        </Card>

        <ServiceRaidoModal
          onCancelModal={this.openModal}
          visible={modalVisibleSer}
          handleServiceSubmit={(res)=>{
            this.setState({
              serviceValue:res,
            });
            this.props.form.setFieldsValue({serviceKey:res.serviceKey})
          }}
        />

        <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
          <Button
                  onClick={()=>{
                    history.goBack(-1);
                  }}
          >{formatMessage(basicMessages.return)}</Button>
        </div>
      </PageHeaderLayout>
    );
  }
}
