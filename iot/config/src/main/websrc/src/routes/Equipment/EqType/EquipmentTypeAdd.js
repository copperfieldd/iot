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
  Radio,
  Table,
  message,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import AddRuleModal from './Modal/AddRuleModal';
import AddDataModal from './Modal/AddDataModal';
import styles from "../../Warning/Warning.less";
import AdapterListModal from "../Modal/AdapterListModal";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import Cascade from '../../../components/Cascade';


const FormItem = Form.Item;
const Option = Select.Option;


@connect(({equipmentType, loading}) => ({
  equipmentType,
  loading: loading.effects['equipmentType/fetch_addDeviceType_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentTypeAdd extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      modalDataVisible: false,
      rule: [],
      data: [],
      checkedAdapter: [],
      dataValue: [],
      dataDealValue: [],
    }
  };


  handleSubmit = (e) => {
    const {form,intl:{formatMessage}} = this.props;
    const {dataValue, dataDealValue} = this.state;
    let desc = {};
    dataValue.map(item => {
      desc[item.key] = item.value
    });

    let ruleIdsArray = dataDealValue.map(item=>{
      return item.id
    });

    if((new Set(ruleIdsArray)).size !== ruleIdsArray.length){
      message.error(formatMessage(messages.use_same_rule));
      return
    }
    if(ruleIdsArray.length===0){
      message.error(formatMessage(basicMessages.select_data_rule));
      return
    }
    let ruleIds = ruleIdsArray.join(',');

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {

      if (!err) {
        let value = {
          ...values,
          desc:{...desc},
          ruleIds:ruleIds,
        };
        this.props.dispatch({
          type:'equipmentType/fetch_addDeviceType_action',
          payload:value,
          callback:(res)=>{
            this.props.dispatch(routerRedux.push(`/equipment/equipmentType/edit/${encodeURIComponent(JSON.stringify(res))}`));
          }
        })
      }
    });
  };


  //打开适配器弹窗
  changeModalVisible = () => {
    this.setState({
      modalAdapterVisible: !this.state.modalAdapterVisible,
    })
  };

  //打开规则弹窗
  addRuleModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  };

  //打开数据弹窗
  addDataModalVisible = () => {
    this.setState({
      modalDataVisible: !this.state.modalDataVisible
    })
  };

  clearInput = () =>{
    const { form:{resetFields} } = this.props;
    resetFields(['area']);
    this.setState({
      searchId:{},
    })
  }

  render() {
    const {modalVisible, modalDataVisible, checkedAdapter, modalAdapterVisible, dataValue, dataDealValue} = this.state;
    const {getFieldDecorator} = this.props.form;
    const {history,loading,intl:{formatMessage}} = this.props;

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
    const columns = [
      {
      title: formatMessage(basicMessages.name),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.describe),
      dataIndex: 'desc',
      key: 'desc',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      width: 150,
      align: 'center',
      className: 'table_row_styles',
      render: (text, record,index) => (
        <span>
          <Icon className='f14' type="delete" theme="outlined" onClick={() => {
            const value = dataDealValue.filter((o, i) => {
              if (i !== index) {
                return o;
              }
            });
            this.setState({
              dataDealValue: value
            });
          }}
          />
        </span>
      ),
    }];

    const columnsData = [{
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      className: 'table_row_styles',
    }, {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.operations),
      key: 'action',
      width: 150,
      align: 'center',
      className: 'table_row_styles',
      render: (text, record, index) => (
        <span>
          <Icon className='f14' type="delete" theme="outlined" onClick={() => {
            const value = dataValue.filter((o, i) => {
              if (i !== index) {
                return o;
              }
            });
            this.setState({
              dataValue: value
            });
          }}/>
        </span>
      ),
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
            <Card
              title={
                <span style={{color: '#3f89e1'}}>{formatMessage(messages.equipmentBasicInfo)}</span>
              }
              className='special_card_no_border'
              bordered={false}
            >
              <div style={{width: 600}}>
                <Form>
                  <FormItem
                    label={formatMessage(messages.equipment_config_name)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('name', {
                        rules: [{
                          required: true, message: formatMessage(messages.equipment_input_config_name),
                        },{
                          max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                        }],
                      })(
                        <Input placeholder={formatMessage(messages.equipment_input_config_name)}/>
                      )
                    }

                  </FormItem>


                  <FormItem
                    label={formatMessage(messages.protocol)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('protocol', {
                        rules: [{
                          required: true, message: formatMessage(messages.equipment_protocol_select),
                        }],
                      })(
                        <Select placeholder={formatMessage(messages.equipment_protocol_select)}>
                          <Option value={1}>MQTT</Option>
                          <Option value={2}>HTTP</Option>
                          <Option value={3}>CoAP</Option>
                          <Option value={4}>TCP</Option>
                          <Option value={5}>UDP</Option>
                        </Select>
                      )
                    }

                  </FormItem>

                  <FormItem
                    label={formatMessage(messages.equipment_device_model)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('deviceModelId', {
                        rules: [{
                          required: true, message: formatMessage(messages.equipment_device_model_select),
                        }],
                      })(
                        <Cascade
                          //clearInput={this.clearInput}
                          //isClear
                          form={this.props.form}
                          onSubmit={(res)=>{
                            this.props.form.setFieldsValue({deviceModelId:res})
                          }}
                          title={[{
                            name:formatMessage(messages.equipmentTypeName),
                            search:false,
                            isLeaf:false,
                            isList:true,
                            level:0,
                          },{
                            name:formatMessage(messages.equipment_device_model),
                            search:false,
                            isLeaf:false,
                            isList:true,
                            level:1,
                          }]}
                        />
                      )
                    }

                  </FormItem>

                </Form>
              </div>
            </Card>

            <Card
              title={
                <span style={{color: '#3f89e1'}}>{formatMessage(messages.equipmentAdapterInfo)}</span>
              }
              bordered={false}
              className='special_card_no_border'

            >
              <div style={{width: 600}}>
                <Form>
                  <FormItem
                    label={formatMessage(messages.adapterName)}
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('adapterId', {
                        rules: [{
                          required: true, message: formatMessage(messages.adapterNameSelect),
                        }],
                        initialValue: checkedAdapter && checkedAdapter.id,
                      })(
                        <div onClick={this.changeModalVisible} className={styles.ele_input_addStype}
                             style={{height: 35}}>
                          <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                            <span>{checkedAdapter && checkedAdapter.name}</span>
                          </div>
                          <Input value={checkedAdapter && checkedAdapter.id} style={{display: 'none'}}/>
                          <Icon className={styles.down_icon} type="down"/>/deviceservice/api/category/first/list
                        </div>
                      )
                    }
                  </FormItem>

                  <FormItem
                    label={formatMessage(messages.equipmentSoftVersion)}
                    {...formItemLayout}
                  >

                    <span>{checkedAdapter && checkedAdapter.version}</span>

                  </FormItem>

                </Form>
              </div>
            </Card>

            <Card
              title={
                <span style={{color: '#3f89e1'}}>{formatMessage(messages.equipmentDataRules)}</span>
              }
              bordered={false}
              className='special_card_no_border'
            >
              <Table
                rowKey={record => record.id}
                dataSource={dataDealValue}
                columns={columns}
                pagination={false}
                bordered
              />
              <div>
                <div
                  style={{
                    backgroundColor: '#3f89e1',
                    borderRadius: '6px',
                    width: 25,
                    height: 25,
                    lineHeight: '25px',
                    textAlign: 'center',
                    marginTop: 10,
                    display: 'inline-block'
                  }}
                  onClick={this.addRuleModalVisible}
                >
                  <Icon style={{fontSize: 18, color: '#fff',lineHeight:'25px'}} type='plus'/>
                </div>
                <span style={{marginLeft: 10}}>{formatMessage(basicMessages.add)}</span>
              </div>
            </Card>

            <Card
              title={
                <span style={{color: '#3f89e1'}}>{formatMessage(basicMessages.dataDes)}</span>
              }
              bordered={false}
              className='special_card_no_border'

            >
              <Table
                rowKey={record => record.id}
                dataSource={dataValue}
                columns={columnsData}
                pagination={false}
                bordered
              />
              <div>
                <div
                  style={{
                    backgroundColor: '#3f89e1',
                    borderRadius: '6px',
                    width: 25,
                    height: 25,
                    lineHeight: '25px',
                    textAlign: 'center',
                    marginTop: 10,
                    display: 'inline-block'
                  }}
                  onClick={this.addDataModalVisible}
                >
                  <Icon style={{fontSize: 18, color: '#fff',lineHeight:'25px'}} type='plus'/>
                </div>
                <span style={{marginLeft: 10}}>{formatMessage(basicMessages.add)}</span>
              </div>
            </Card>
          {/*</Card>*/}
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <AdapterListModal
            status={1}
            modalVisible={modalAdapterVisible}
            onCancelModal={this.changeModalVisible}
            handleCheckValue={(value) => {
              this.setState({
                checkedAdapter: value
              });
              this.props.form.setFieldsValue({adapterId: value.id})
            }}
          />

          <AddRuleModal
            title={formatMessage(basicMessages.rule)}
            visible={modalVisible}
            onCancel={this.addRuleModalVisible}
            handleValue={(values) => {
              const value = {
                ...values,
                index:this.state.dataDealValue.length+1,
              };
              const dataDealValue = [{...value}];
              this.setState({
                dataDealValue: this.state.dataDealValue.concat(dataDealValue)
              })
            }}

          />

          <AddDataModal
            title={formatMessage(basicMessages.dataDes)}
            visible={modalDataVisible}
            onCancel={this.addDataModalVisible}
            handleValue={(values) => {
              if(values){
                this.addDataModalVisible();
                const dataValue = [
                  {
                    ...values,
                  }
                ];
                this.setState({
                  dataValue: this.state.dataValue.concat(dataValue)
                })
              }
            }}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}