import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Tabs, Modal, Row, Col, Select, Breadcrumb, message} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import basicMessages from "../../../messages/common/basicTitle";
import {FormattedMessage, injectIntl} from 'react-intl';
import DataNewField from "../Modal/DataNewField"
import ServiceRadioModal from "../Modal/ServiceRaidoModal";
import {formatStructure} from '../../../utils/utils'
import messages from '../../../messages/statistics';
import per_messages from "../../../messages/permission";
import Ellipsis from "../../../components/Ellipsis";

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const BreadcrumbItem = Breadcrumb.Item;


@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_updStiDate_action'],
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
      modalVisible: false,
      data: {},
      index: 0,
      dataSt: [],
      tableValue: [],
      resultMap: {},
      result: [],
      level: 1,
      resultArr: [],
      firstValues: [],

    }
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    const {resultMap, result} = this.state;
    let item = JSON.parse(decodeURIComponent(data));

    this.parseData(item.structure, 0, this.state.level, result, resultMap);
    let dataArr = [];
    if (result[this.state.level - 1]) {
      for (let i in result[this.state.level - 1]) {
        dataArr.push(result[this.state.level - 1][i])
      }
    }
    this.setState({
      resultMap: resultMap,
      serviceValue: item,
      structure: dataArr,
      firstStructure: item.structure,
      firstIn: 1,
      result: result,
    })
    this.props.form.setFieldsValue({serviceId: item.serviceId})
  };

  parseData = (data, pid, level, result, resultMap) => {
    if (!data) {
      return;
    }
    let item;
    if (level > result.length) {
      item = {};
      result.push(item);
    } else {
      item = result[level - 1];
    }
    for (let i in data) {
      item[data[i].fieldId] = {
        pid: pid,
        fieldId: data[i].fieldId,
        fieldName: data[i].fieldName,
        uid: data[i].fieldId,
        fieldType: data[i].fieldType,
      };
      resultMap[data[i].fieldId] = item[data[i].fieldId];
      if (data[i].childFields && data[i].childFields.length > 0) {
        this.parseData(data[i].childFields, data[i].fieldId, level + 1, result, resultMap);
      }
    }
  };


  del = (e, id) => {
    e.stopPropagation();
    const {intl: {formatMessage},} = this.props;
    const {result, resultMap, level} = this.state;
    let dataObj = resultMap;
    let dataArr = [];
    for (let i in result[level - 1]) {
      dataArr.push(result[level - 1][i])
    }
    let index;
    for (let i = 0; i < dataArr.length; i++) {
      if (id === dataArr[i].uid) {
        index = i;
      }
    };
    console.log(dataArr)
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        dataArr.splice(index, 1);
        delete dataObj[id];
        result[level-1] = dataArr;
        this.setState({
          structure: [
            ...dataArr,
          ]
        })
      }
    });

  };


  openNewFieldModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };


  handleSubmit = (e) => {
    const {intl: {formatMessage}, loading, history, match: {params: {data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
    const {resultMap} = this.state;
    let cons = formatStructure(resultMap);
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(cons[0]){
          let value = {
            id: item.id,
            ...values,
            structure: [
              ...cons[0].childFields,
            ],
          }
          this.props.dispatch({
            type: 'dataSti/fetch_updStiDate_action',
            payload: value,
          })
        }else{
          message.error(formatMessage(messages.sti_input_filed))
        }

      }
    });
  };


  openModal = () => {
    this.setState({
      modalVisibleSer: !this.state.modalVisibleSer
    });
  };

  formatChild = (data) => {
    const {firstStructure, tableValue, lastFieldId, dataSt} = this.state;

    let fieldIds = firstStructure.map(item => item.fieldId);

    if (fieldIds.indexOf(data.fieldId) !== -1) {
      let value = tableValue;
      let webValue = dataSt;
      value.push({
        pid: 0,
        ...data,
      });
      webValue = {
        ...webValue,
        [data.fieldId]: {
          pid: 0,
          ...data,
        }
      }
      this.setState({
        tableValue: value,
        dataSt: webValue
      })
    } else {
      let value = tableValue;
      let webValue = dataSt;
      webValue = {
        ...webValue,
        [data.fieldId]: {
          pid: lastFieldId,
          ...data,
        }
      };
      value.push({
        pid: lastFieldId,
        ...data,
      });
      this.setState({
        tableValue: value
      });
      this.setState({
        tableValue: value,
        dataSt: webValue
      })
    }
  };


  goChild = (record) => {
    const {result, level} = this.state;
    let dataArr = [];
    if (result[level]) {
      for (let i in result[level]) {
        dataArr.push(result[level][i])
      }
    }

    this.setState({
      dataId: record.fieldId,
      data: record,
      lastFieldId: record.fieldId,
      level: this.state.level + 1,
      structure: dataArr,
      firstIn: 2,
      defaultFiled: null,

    })
  }

  render() {
    const {modalVisible, modalVisibleSer, structure, tableValue, result} = this.state;

    const {intl: {formatMessage}, loading, history, match: {params: {data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
    const {getFieldDecorator} = this.props.form;

    let defaultValue = {
      serviceName: item.serviceName,
      serviceId: item.serviceId,
    }
    const columns = [{
      title: formatMessage(messages.sti_table_fieldName),
      dataIndex: 'fieldName',
      key: 'fieldName',
      className: 'table_row_styles',
      width:220,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.sti_table_fieldTag),
      dataIndex: 'fieldId',
      key: 'fieldId',
      className: 'table_row_styles',
      width:220,
      render:(text,record)=>(
        <Ellipsis tooltip={text} lines={1}><span >{text}</span></Ellipsis>
      )
    }, {
      title: formatMessage(messages.sti_table_fieldType),
      dataIndex: 'fieldType',
      key: 'fieldType',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.sti_table_childField),
      dataIndex: 'childFields',
      key: 'childFields',
      className: 'table_row_styles',
      render: (text, record) => (
        record.fieldType === 'Array' ?
          <a onClick={() => {
            this.goChild(record)
            this.formatChild(record);
          }}>{`{...}`}</a>
          : <span></span>
      )
    },
      {
        title: formatMessage(basicMessages.operations),
        dataIndex: 'action',
        key: 'action',
        className: 'table_row_styles',
        render: (text, record) => (
          <span>
            {
              record.fieldId === 'year' || record.fieldId === 'month' || record.fieldId === 'day' ? null :
                <span>
                  <Button style={{marginLeft: 5}} type={'primary'} onClick={(e) => {
                    e.stopPropagation();
                    this.openNewFieldModal();
                    this.setState({
                      dataId: record.uid,
                      defaultFiled: record,
                    })

                  }}>
              {formatMessage(basicMessages.modify)}
            </Button>
            <Button onClick={(e) => this.del(e, record.uid)}
                    style={{marginLeft: 8}}>
             {formatMessage(basicMessages.delete)}
            </Button>
                </span>
            }

          </span>
        )
      }
    ];


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
                    getFieldDecorator('serviceId', {
                      rules: [{
                        required: true, message: formatMessage(per_messages.selectServiceName),
                      }],
                    })(
                      <div onClick={this.openModal} className={styles.ele_input_addStype}
                           style={{height: 32, lineHeight: '32px'}}>
                        {
                          this.state.serviceValue ? <div style={{marginLeft: 6}}>
                            <span>{this.state.serviceValue.serviceName}</span>
                          </div> : null
                        }
                        <Icon className={styles.down_icon} type="down"/>
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
                        required: true, message: formatMessage(messages.sti_table_name_input),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: item.collectionName
                    })(
                      <Input placeholder={formatMessage(messages.sti_table_name_input)}/>
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
                        required: true, message: formatMessage(messages.sti_table_tag_input),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: item.collectionId
                    })(
                      <Input disabled={true} />
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
                        required: true, message: formatMessage(basicMessages.describeInput),
                      }, {
                        max: 64, message: formatMessage(basicMessages.moreThan64)
                      }],
                      initialValue: item.remark
                    })(
                      <TextArea rows={3} placeholder={formatMessage(basicMessages.describeInput)}/>
                    )
                  }
                </FormItem>
              </Col>

            </Row>
          </Form>

          <div>
            <p className="TxTCenter" style={{marginTop: 25}}>{formatMessage(messages.sti_table_information)}</p>
            <Breadcrumb>
              {
                tableValue.map((item, index) => {
                  return (
                    <BreadcrumbItem key={index}><a onClick={() => {
                      let res = result[index];
                      let Arr = [];
                      for (let i in res) {
                        Arr.push(res[i])
                      }
                      if (item.pid === 0) {
                        this.setState({
                          structure: Arr,
                          tableValue: [],
                        });
                      } else {
                        let delStructure = tableValue;
                        delStructure.splice(tableValue.indexOf(item));
                        this.setState({
                          structure: Arr,
                          tableValue: delStructure,
                        })
                      }
                    }}>{item.fieldName}</a></BreadcrumbItem>
                  )
                })
              }
            </Breadcrumb>
            <div className='mrgTB12 dlxB'>
              <div>
                <a></a>
              </div>

              <Button icon={'plus'} type={'primary'} onClick={() => {
                this.openNewFieldModal()
              }}>{formatMessage(messages.sti_table_add_filed)}</Button>
            </div>

            <Table
              rowKey={(record, index) => record.fieldId}
              dataSource={structure}
              columns={columns}
            />
          </div>
        </Card>

        <ServiceRadioModal
          onCancelModal={this.openModal}
          visible={modalVisibleSer}
          defaultValue={defaultValue}
          handleServiceSubmit={(res) => {
            this.setState({
              serviceValue: res,
            });
            this.props.form.setFieldsValue({serviceId: res.serviceId})
          }}
        />

        <DataNewField
          modalVisible={modalVisible}
          onCancelModal={this.openNewFieldModal}
          defaultValue={this.state.defaultFiled}
          valueId={this.state.dataId}
          level={this.state.level}
          handSubmit={(res) => {
            const {defaultFiled, result, resultMap, level} = this.state;
            if (defaultFiled !== 1 && defaultFiled) {
              result[level - 1][res.uid] = res;
              resultMap[res.uid] = res;
              let arr = [];
              for (let i in result[level - 1]) {
                arr.push(result[level - 1][i])
              }
              this.setState({
                structure: arr
              })
            } else {
              result[level - 1][res.uid] = res;
              let arr = [];
              resultMap[res.uid] = res;
              for (let i in result[level - 1]) {
                arr.push(result[level - 1][i])
              }
              this.setState({
                structure: arr
              })
            }
          }}
        />

        <div className='TxTCenter' style={{width: 500, margin: '30px auto'}}>
          <Button type='primary' loading={loading} onClick={(e) => {
            this.handleSubmit(e);
          }}>{formatMessage(basicMessages.confirm)}</Button>
          <Button className='mrgLf20'
                  onClick={() => {
                    history.goBack(-1);
                  }}
          >{formatMessage(basicMessages.return)}</Button>
        </div>
      </PageHeaderLayout>
    );
  }
}
