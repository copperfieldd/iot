import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  DatePicker,
  Row,
  Col,
  TimePicker,
  message,
} from 'antd';
import styles from '../FirmwareUpdate.less';
import {injectIntl} from "react-intl";
import basicMessages from '../../../messages/common/basicTitle';
import messages from "../../../messages/firmware";


const FormItem = Form.Item;
const format = 'HH:mm';

@connect(({hardwareUpdate, loading}) => ({
  hardwareUpdate,
  loading: loading.effects['hardwareUpdate/fetch_addUpdateTimeConfig_action'],
}))
@injectIntl
@Form.create()
export default class HardwareUpdateAdd extends Component {
  constructor() {
    super();
    this.state = {
      times: ['times1'],
      index:1,
      updVersions: ['updVersions1'],
      timeArr:[],
      exceptVersions: ['exceptVersions1'],
    }
  };

  componentWillMount() {
    const {upgradeId,isEdit} = this.props;
    if(isEdit){
      this.loadTimeConfig(upgradeId);
    }
  };

  loadTimeConfig=(upgradeId)=>{
    this.props.dispatch({
      type:'hardwareUpdate/fetch_getUpgradeTimeConfig_action',
      payload:{
        upgradeId:upgradeId,
      },
      callback:(res)=>{
        let upgradeInterval = res.ruleConfig.upgradeInterval;
        let times = upgradeInterval.map((item,index)=>{
          return 'time'+(index+1)
        });
        let timeArr = upgradeInterval.map((item,index)=>{
          return {startTime:item.startTime.substring(0, 2) + ":" + item.startTime.substring(2, 4),endTime:item.endTime.substring(0, 2) + ":" + item.endTime.substring(2, 4)}
        });
        this.setState({
          times: times,
          timeArr:timeArr,
          index:times.length,
        });
        this.props.form.setFieldsValue({startTime:res.ruleConfig.startTime && moment(res.ruleConfig.startTime) || undefined,})
      }
    })
  }

  handleChange = (fileList) => {
    const {file: {response, status}} = fileList;
    if (response && status === 'done') {
      if (response.status === 0) {
        message.success(response.value)
      } else {
        message.error(response.message)
      }
    }
    if (status === 'error') {
      message.error('导入失败，请稍后再试')
    }
  };


  onChangeTime = (date, dateString) => {
  };


  addTimes = () => {
    const {index} = this.state;
    let newTimes = this.state.times;
    newTimes.push(`times${index + 1}`);
    this.setState({
      times: newTimes,
      index:index+1,
    })
  };

  delTime =(index)=>{
    let times = this.state.times;
    let upgradeInterval = this.state.timeArr;
    upgradeInterval.splice(index,1);
    times.splice(index,1);
    let delTimes = times;
    this.setState({
      times: delTimes,
      timeArr:upgradeInterval,
    })
  };


  createUpdateConfigTime=(e)=>{
    const {times} = this.state;
    const {upgradeId} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, formValues) => {
      if (!err) {
        let upgradeInterval = times.map(item => {
          let time1 = formValues[item] && formValues[item].format('HH:mm') || undefined;
          let time2 = formValues[item + 'i'] && formValues[item + 'i'].format('HH:mm') || undefined;
          return {
            startTime: time1?time1.replace(new RegExp(/(:)/g), ""):null,
            endTime: time2?time2.replace(new RegExp(/(:)/g), ""):null,
          }
        });

        let value = {
          upgradeId:upgradeId,
          startTime:formValues.startTime && formValues.startTime.format('YYYY/MM/DD') || undefined,
          upgradeInterval:[
            ...upgradeInterval
          ],
        };
        this.props.dispatch({
          type:'hardwareUpdate/fetch_addUpdateTimeConfig_action',
          payload:value
        })
      }
    });
  };


  render() {
    const {loading,upgradeId,isItem,formatMessage} = this.props;
    const {times,timeArr} = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 11},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 13},
      },
    };

    return (
      <div>
        <div style={{textAlign: 'center', margin: '30px 0 '}}>{formatMessage(messages.firm_upgrade_config)}</div>
        <Form>
          <Row>
            <Col span={2}><span style={{lineHeight: '39px'}}>{formatMessage(basicMessages.time)}</span></Col>
            <Col span={7}>
              <FormItem
                {...formItemLayout}
                label={formatMessage(basicMessages.startTime)}
              >
                {
                  getFieldDecorator('startTime', {
                    rules: [{
                      required: true, message: formatMessage(basicMessages.select_time),
                    }],
                  })(
                    <DatePicker disabled={isItem} format="YYYY/MM/DD" onChange={this.onChangeTime}/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={15}>
              {
                times.map((item, index) => {
                  return (
                    <Row key={index}>
                      <Col span={10} style={{width:280}}>
                        <FormItem
                          {...formItemLayout}
                          label={formatMessage(messages.upgrade_time)}
                        >
                          {
                            getFieldDecorator(`${item}`, {
                              rules: [{
                                required: true, message: formatMessage(basicMessages.select_time),
                              }],
                              initialValue:timeArr.length>0&&timeArr[index]?moment(timeArr[index].startTime,format):undefined
                            })(
                              <TimePicker disabled={isItem} style={{width: '157px'}} defaultOpenValue={moment('00:00', 'HH:mm')}
                                          format={format}/>
                            )
                          }
                        </FormItem>
                      </Col>
                      <Col span={1} style={{textAlign:'center'}}><span style={{lineHeight: '39px'}}>-</span></Col>
                      <Col span={10} style={{width:170}}>
                        <FormItem
                          {...formItemLayout}
                        >
                          {
                            getFieldDecorator(`${item}` + 'i', {
                              rules: [{
                                required: true, message: formatMessage(basicMessages.select_time),
                              }],
                              initialValue:timeArr.length>0&&timeArr[index]?moment(timeArr[index].endTime,format):undefined
                            })(
                              <TimePicker disabled={isItem} style={{width: '157px'}} defaultOpenValue={moment('00:00', 'HH:mm')} format={format}/>
                            )
                          }
                        </FormItem>
                      </Col>
                      {
                        times.length===1||isItem?null: <Col span={1}><span style={{lineHeight: '39px'}}><Icon type="close" onClick={()=>this.delTime(index)}/></span></Col>
                      }
                    </Row>
                  )
                })
              }
              {
                isItem?null:
                  <div style={{marginLeft: 97}}><Button type={'primary'} onClick={this.addTimes}>{formatMessage(basicMessages.add)}</Button></div>
              }

            </Col>
          </Row>
        </Form>

        {
          isItem?null:
            <div style={{textAlign: 'center',margin:'30px 0 50px 0'}}>
              <Button loading={loading} disabled={!upgradeId} type={'primary'} onClick={this.createUpdateConfigTime}>{formatMessage(basicMessages.confirm)}</Button>
            </div>
        }


      </div>
    );
  }
}
