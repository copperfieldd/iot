import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input, Card, Modal, Row, Col, Breadcrumb,message} from 'antd';
import styles from '../MenuDataSti.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import basicMessages from "../../../messages/common/basicTitle";
import {FormattedMessage, injectIntl} from 'react-intl';
import DataNewField from "../Modal/DataNewField"
import ServiceRaidoModal from "../Modal/ServiceRaidoModal";
import {formatStructure} from '../../../utils/utils'
import messages from '../../../messages/statistics';
import per_messages from "../../../messages/permission";
import Ellipsis from "../../../components/Ellipsis";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const BreadcrumbItem = Breadcrumb.Item;


@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_addStiDate_action'],
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
      defaultFiled:1,
      firstValues:[],
      modalVisible: false,
      data: {},
      index: 0,
      dataSt: [],
      tableValue:[],
      result:[],
      dataItem:[],
      level:1,
      dataId:null,
    }
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  del = (e, id) => {
    e.stopPropagation();
    const {intl: {formatMessage},} = this.props;
    const {result,dataSt,level} = this.state;
    let dataObj = dataSt;
    let dataArr = result[level-1];
    let index;
    for(let i=0;i<dataArr.length;i++){
      if(id===dataArr[i].uid){
        index = i;
      }
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        dataArr.splice(index,1);
        delete dataObj[id];
        result[level-1] = dataArr;
        this.setState({
          dataSt:dataObj,
          result:result,
          structure:[
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
    const {dataSt} = this.state;
    let cons = formatStructure(dataSt);
    const {form,intl: {formatMessage}, } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      console.log(cons[0]);
      if (!err) {
        if(cons[0]){
          let value = {
            ...values,
            structure: [
              ...cons[0].childFields,
            ],
          };
          this.props.dispatch({
            type: 'dataSti/fetch_addStiDate_action',
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

  formatChild=(data)=>{
    const {tableValue,lastFieldId} = this.state;
    let value = tableValue;
    value.push({
      pid:lastFieldId,
      ...data,
    });
    this.setState({
      tableValue: value,
    })
  };


  parseData=(res,id,level,result,data)=>{
    const {defaultFiled} = this.state;
    if(defaultFiled!==1){
      for(let i = 0;i< result[level-1].length;i++){
        if( result[level-1][i].uid===defaultFiled.uid){
          result[level-1][i] = data;
        }
      }
    }else{
      result[level-1] = data;
    }

    this.setState({
      result:result,
      structure:result[level-1]
    })
  };



  render() {
    const {modalVisible, modalVisibleSer,tableValue,result,structure} = this.state;
    const {intl: {formatMessage}, loading, history,} = this.props;
    const {getFieldDecorator} = this.props.form;
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
            this.setState({
              dataId: record.uid,
              data: record,
              structure: result[this.state.level]?result[this.state.level]:[],
              level:this.state.level+1,
              defaultFiled:null,
              lastFieldId:record.uid,
            })
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
            <Button style={{marginLeft: 5}} type={'primary'} onClick={(e) => {
              e.stopPropagation();
              this.openNewFieldModal();
              this.setState({
                dataId: record.uid,
                defaultFiled:record,
                isEdit:true,
              })
            }}>
              {formatMessage(basicMessages.modify)}
            </Button>
           <Button onClick={(e) => this.del(e, record.uid)}
                   style={{marginLeft: 8}}>{formatMessage(basicMessages.delete)}</Button>
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
                    })(
                      <Input placeholder={formatMessage(messages.sti_table_tag_input)}/>
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
                      rules: [
                        {
                          required: true, message: formatMessage(basicMessages.describeInput),
                        }, {
                          max: 64, message: formatMessage(basicMessages.moreThan64)
                        }
                      ],
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
                  tableValue.map((item,index)=>{
                    return(
                      <BreadcrumbItem key={index}><a onClick={() => {
                        let res = result[index];
                        let Arr = [];
                        for (let i in res){
                          Arr.push(res[i])
                        }
                        if (item.pid === 0) {
                          this.setState({
                            structure: Arr,
                            tableValue: [],
                            level:index+1,
                          });
                        } else {
                          let delStructure = tableValue;
                          delStructure.splice(tableValue.indexOf(item));
                          this.setState({
                            structure: Arr,
                            tableValue: delStructure,
                            level:index+1,
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
                  this.setState({
                    isEdit:false,
                    defaultFiled:1,
                  });
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

        <ServiceRaidoModal
          onCancelModal={this.openModal}
          visible={modalVisibleSer}
          handleServiceSubmit={(res) => {
            this.setState({
              serviceValue: res,
            })
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
            const {dataId, dataSt,defaultFiled} = this.state;
            let firstValues;
            if(defaultFiled===1){
              firstValues=[{...res}];
            }
            let parseRes;
            if(defaultFiled===1){
              parseRes = this.state.structure.concat(res)
            }else{
              parseRes = res
            }
            this.parseData(res,defaultFiled,this.state.level,this.state.result,parseRes,);
            let oldData;
            if (dataId) {
              oldData = {
                ...dataSt,
                [res.uid]: res,
              };
            }
            this.setState({
              firstValues:this.state.firstValues.concat(firstValues),
              objStructure: {
                ...this.state.objStructure,
                [res.uid]: res,
              },
              dataSt: oldData ? oldData : {
                ...this.state.objStructure,
                [res.uid]: {
                  ...res,
                  pid:0,
                },
              }
            });
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
