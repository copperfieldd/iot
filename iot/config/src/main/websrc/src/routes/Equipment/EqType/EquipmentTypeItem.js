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
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';
import Cascade from "../../../components/Cascade";

const FormItem = Form.Item;
const Option = Select.Option;


@connect(({equipmentType, loading}) => ({
  equipmentType,
  loading: loading.effects['equipmentType/fetch_deviceTypeItem_action'],
}))
@injectIntl
@Form.create()
export default class EquipmentTypeEdit extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible:false,
      modalDataVisible:false,
      rule:[],
      data:[],
      checkedAdapter:[],
      dataValue:[],
      dataDealValue:[],
    }
  };
  componentDidMount(){
    const {match:{params:{data}}} = this.props;
    this.loadEquipmentTypeItems(JSON.parse(decodeURIComponent(data)).id)
  }

  loadEquipmentTypeItems=(id)=>{
    this.props.dispatch({
      type:"equipmentType/fetch_deviceTypeItem_action",
      payload:{id:id},
      callback:(res)=>{
        this.setState({
          item:res,
        })
        this.props.dispatch({
          type:'equipmentType/fetch_adapterItem_action',
          payload:{id:res.adapter.id},
          callback:(res)=>{
            this.setState({
              checkedAdapter: res
            })
          }

        });
        let rule = res.rule.map((item,index)=>{
          return {index:index+1,...item}
        });

        this.setState({
          dataDealValue:rule,

        })

        let x;
        for(x in res.desc){
          this.setState({
            dataValue:this.state.dataValue.concat({'key':x,'value':res.desc[x]})
          })
        }
      }
    })
  };



  render() {
    const {checkedAdapter,dataValue,dataDealValue,item} = this.state;
    const {getFieldDecorator} = this.props.form;
    const {history,match:{params:{data}},intl:{formatMessage}} = this.props;
    const eqItem = JSON.parse(decodeURIComponent(data));
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
    const columns = [{
      title: formatMessage(basicMessages.serial),
      dataIndex: 'index',
      key: 'index',
      className:'table_row_styles',

    }, {
      title: formatMessage(basicMessages.name),
      dataIndex: 'name',
      key: 'name',
      className:'table_row_styles',
    },{
      title: formatMessage(basicMessages.describe),
      dataIndex: 'desc',
      key: 'desc',
      className:'table_row_styles',
    },];

    const columnsData=[{
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      className:'table_row_styles',
    },{
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      className:'table_row_styles',
    },]

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
            {/*title={<span style={{color: '#3f89e1'}}>设备类型详情</span>}*/}
          {/*>*/}
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
                    <span>{eqItem&&eqItem.name}</span>
                  </FormItem>

                  <FormItem
                    label={formatMessage(messages.protocol)}
                    {...formItemLayout}
                  >
                    <span>{eqItem&&eqItem.protocol===1?'MQTT':eqItem&&eqItem.protocol===2?'HTTP':eqItem&&eqItem.protocol===3?'CoAP':eqItem&&eqItem.protocol===4?'TCP':eqItem&&eqItem.protocol===5?'UDP':null}</span>
                  </FormItem>
                  <FormItem
                    label={formatMessage(messages.equipment_device_model)}
                    {...formItemLayout}
                  >
                    <span>{item&&item.catagory&&item.catagory.deviceModelName}</span>
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

                    <span>{checkedAdapter && checkedAdapter.name}</span>

                  </FormItem>

                  <FormItem
                    label={formatMessage(messages.equipmentSoftVersion)}
                    {...formItemLayout}
                  >

                    <span>{checkedAdapter && checkedAdapter.version}</span>

                  </FormItem>

                  {/*<FormItem*/}
                    {/*label={formatMessage(basicMessages.status)}*/}
                    {/*{...formItemLayout}*/}
                  {/*>*/}
                    {/*<span>{checkedAdapter && checkedAdapter.status}</span>*/}
                  {/*</FormItem>*/}
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
            </Card>
          {/*</Card>*/}
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>

            <Button
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
