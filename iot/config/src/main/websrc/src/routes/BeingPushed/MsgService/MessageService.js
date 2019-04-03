import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Divider, Modal, Input, DatePicker} from 'antd';
import styles from '../BeingPushed.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import * as routerRedux from "react-router-redux";
import AddTemplateModal from "./Modal/AddTemplateModal";
import AddAutographModal from './Modal/AddAutographModal';
import {formatParams, getLoginUserType} from "../../../utils/utils";
import basicMessages from "../../../messages/common/basicTitle";
import messages from "../../../messages/bushing";
import {injectIntl} from 'react-intl';

import Icons from "../../../components/Icon";

const FormItem = Form.Item;
const userInfo = JSON.parse(localStorage.getItem('config_userInfo'));

@injectIntl
@connect(({msgService, loading}) => ({
  msgService,
  loading: loading.effects['msgService/fetch_commentTemplate_action'],
  loading1: loading.effects['msgService/fetch_addAutograph_action'],
  loading2: loading.effects['msgService/fetch_addPlatTemplate_action'],
  loading3: loading.effects['msgService/fetch_editPlatTemplate_action'],
  tableLoading1:loading.effects['msgService/fetch_getPlatTemplateList_action'],
  tableloading2:loading.effects['msgService/fetch_userAutograph_action'],
  tableLoading3:loading.effects['msgService/fetch_getUserTemplateList_action'],

}))
@Form.create()
export default class MessageService extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      modalVisible1: false,
      isEdit: false,
      isDetails: false,
      commentValue: null,//模板详情
      isExamine: false,
      platTemplateType: null,//1 平台新建模板 2 平台修改模板 3 平台详情模板 4 平台审核模板
      otherTemplateType: null,//1 自己的模板详情 2 公共模板详情
      autographValue: null,//签名详情
      visible1:false,
      visible2:false,
      visible3:false,
    }
  };

  componentDidMount() {
    let userType = getLoginUserType();
    const {msgService: {userAutographList_params, getPlatTemplateList_params, getUserTemplateList_params, commentTemplate_params}} = this.props;
    this.loadUserAutographList(userAutographList_params);
    if (userType === 0) {
      this.loadUserTemplateList(getUserTemplateList_params);
    }
    this.loadCommentTemplate(commentTemplate_params);
    if (userType !== 0) {
      this.loadTemplateList(getPlatTemplateList_params);
    }
  };

  //获取公共模板
  loadCommentTemplate = (params) => {
    this.props.dispatch({
      type: 'msgService/fetch_commentTemplate_action',
      payload: params
    })
  }

  //获取用户签名
  loadUserAutographList = (params) => {
    this.props.dispatch({
      type: 'msgService/fetch_userAutograph_action',
      payload: params
    })
  };

  //获取当前用户模板列表
  loadTemplateList = (params) => {
    this.props.dispatch({
      type: 'msgService/fetch_getPlatTemplateList_action',
      payload: params
    })
  };

  //获取用户所有模板
  loadUserTemplateList = (params) => {
    this.props.dispatch({
      type: 'msgService/fetch_getUserTemplateList_action',
      payload: params,
    })
  }


  handelVisible = () => {
    this.setState({
      visible1: !this.state.visible1,
    })
  }

  handelVisible1 = () => {
    this.setState({
      visible2: !this.state.visible2,
    })
  }

  handelVisible2 = () => {
    this.setState({
      visible3: !this.state.visible3,
    })
  }

  openTemplateModal = () => {
    this.setState({
      modalVisible1: !this.state.modalVisible1,

    })
  }

  openAutographModal = () => {
    this.setState({
      modalVisible2: !this.state.modalVisible2
    })
  };


  addTemplate = (res) => {
    let userType = getLoginUserType();
    const {msgService: {commentTemplate_params,getPlatTemplateList_params},} = this.props;
    this.props.dispatch({
      type: 'msgService/fetch_addPlatTemplate_action',
      payload: res,
      callback: (res) => {
        if(userType===0){
          this.loadCommentTemplate(commentTemplate_params)
        }else{
          this.loadTemplateList(getPlatTemplateList_params)
        }
        this.openTemplateModal();
      }
    })
  };

  //修改模板
  editTemplate = (res, id) => {
    const {msgService: {commentTemplate_params,getUserTemplateList_params},} = this.props;
    const {isComment} = this.state;
    this.props.dispatch({
      type: 'msgService/fetch_editPlatTemplate_action',
      payload: {
        ...res,
        id: id,
      },
      callback: () => {
        if(isComment){
          this.loadCommentTemplate(commentTemplate_params)
        }else{
          this.loadUserTemplateList(getUserTemplateList_params)
        }
        this.openTemplateModal();
      }
    })
  };

  //删除公共模板
  delTemplate = (id) => {
    const {msgService: {commentTemplate, commentTemplate_params,getPlatTemplateList,getPlatTemplateList_params}} = this.props;
    const {intl: {formatMessage}} = this.props;
    let userType = getLoginUserType();
    let params = [];
    params.push(id);
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'msgService/fetch_delPlatTemplate_action',
          payload: {
            id: params
          },
          callback:()=>{
            if(userType===0){
              let params = formatParams(commentTemplate.list, commentTemplate_params);
              this.loadCommentTemplate(params)
            }else{
              let params = formatParams(getPlatTemplateList.list, getPlatTemplateList_params);
              this.loadTemplateList(params)
            }

          }
        })
      }
    });
  };

  //删除用户的模板
  delUserTemplate=(id)=>{
    const {msgService: {getUserTemplateList, getUserTemplateList_params}} = this.props;
    const {intl: {formatMessage}} = this.props;
    let params = [];
    params.push(id);
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'msgService/fetch_delPlatTemplate_action',
          payload: {
            id: params
          },
          callback:()=>{
            let params = formatParams(getUserTemplateList.list, getUserTemplateList_params);
            this.loadUserTemplateList(params)
          }
        })
      }
    });
  };

  //用户模板审核
  examineTemplate = (value) => {
    const {commentValue} = this.state;
    const {msgService:{getUserTemplateList_params}} = this.props;
    this.props.dispatch({
      type: 'msgService/fetch_examineTemplate_action',
      payload: {
        id: commentValue.id,
        explain: value.explain,
        code: value.code
      },
      callback:(res)=>{
        this.openTemplateModal();
        this.loadUserTemplateList(getUserTemplateList_params)
      }
    })
  };

  delAutograph = (id) => {
    const {msgService: {userAutographList, userAutographList_params}} = this.props;
    const {intl: {formatMessage}} = this.props;
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'msgService/fetch_delUserAutograph_action',
          payload: {
            id: [id]
          },
          params: formatParams(userAutographList.list, userAutographList_params),
        })
      }
    })
  }
  //签名审核
  examineAutograph = (value) => {
    const {msgService:{userAutographList_params}} = this.props;
    this.props.dispatch({
      type: 'msgService/fetch_examineAutograph_action',
      payload:value,
      callback:()=>{
        this.openAutographModal();
        this.loadUserAutographList(userAutographList_params)
      }
    })
  };
  //签名修改
  editAutograph=(value)=>{
    const {msgService:{userAutographList_params}} = this.props;
    this.props.dispatch({
      type:'msgService/fetch_editAutograph_action',
      payload:value,
      callback:()=>{
        this.openAutographModal();
        this.loadUserAutographList(userAutographList_params)
      }
    })
  };




  plt_onChangeTable1=(pagination)=>{
    const {msgService:{commentTemplate_params}} = this.props;
    let params = {
      ...commentTemplate_params,
      start:(pagination.current - 1)*10,
    };
    this.loadCommentTemplate(params);
  };

  user_onChangeTable1=(pagination)=>{
    const {msgService:{getPlatTemplateList_params}} = this.props;
    let params = {
      ...getPlatTemplateList_params,
      start:(pagination.current - 1)*10,
    };
    this.loadTemplateList(params);
  };

  plt_onChangeTable2=(pagination)=>{
    const {msgService:{getUserTemplateList_params}} = this.props;
    let params = {
      ...getUserTemplateList_params,
      start:(pagination.current - 1)*10,
    };
    this.loadUserTemplateList(params);
  };

  user_onChangeTable2=(pagination)=>{
    const {msgService:{commentTemplate_params}} = this.props;
    let params = {
      ...commentTemplate_params,
      start:(pagination.current - 1)*10,
    };
    this.loadCommentTemplate(params);
  };

  changeAutographPage=(pagination)=>{
    const {msgService:{userAutographList_params}} = this.props;
    let params = {
      ...userAutographList_params,
      start:(pagination.current - 1)*10,
    };
    this.loadUserAutographList(params);

  };

  handleOk1=(e)=>{
    let userType = getLoginUserType();
    const {msgService:{commentTemplate_params,getPlatTemplateList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...commentTemplate_params,
          start: 0,
          ...fieldsValue,
        };
        const values1 = {
          ...getPlatTemplateList_params,
          start: 0,
          ...fieldsValue,
        }
        if(userType===0){
          this.loadCommentTemplate(values);
        }else{
          this.loadTemplateList(values1);
        }
      }
    })
  }

  handleOk2=(e)=>{
    const {msgService:{getUserTemplateList_params,commentTemplate_params}} = this.props;
    e.preventDefault();
    let userType = getLoginUserType();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...getUserTemplateList_params,
          start: 0,
          ...fieldsValue,
          //startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          //endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        const values1 = {
          ...commentTemplate_params,
          start: 0,
          ...fieldsValue,
          //startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
          //endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
        };
        if(userType===1||userType===0){
          this.loadUserTemplateList(values);
        }else{
          this.loadCommentTemplate(values1);
        }
      }
    })
  };

  handleOk3=(e)=>{
    const {msgService:{userAutographList_params}} = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      } else {
        const values = {
          ...userAutographList_params,
          start: 0,
          ...fieldsValue,
        };
        this.loadUserAutographList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    let userType = getLoginUserType();
    const {msgService:{commentTemplate_params,getPlatTemplateList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: commentTemplate_params.count
    };
    const values1 = {
      start: 0,
      count: getPlatTemplateList_params.count,
      field:"",
    }
    if(userType===0){
      this.loadCommentTemplate(values);
    }else{
      this.loadTemplateList(values1);
    }
  };

  handleReset1 = () => {
    let userType = getLoginUserType();
    const {msgService:{getUserTemplateList_params,commentTemplate_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: getUserTemplateList_params.count
    };
    const values1 = {
      start: 0,
      count: commentTemplate_params.count
    }
    if(userType===1){
      this.loadUserTemplateList(values);
    }else{
      this.loadCommentTemplate(values1);
    }
  };

  handleReset2 = () => {
    const {msgService:{getUserTemplateList_params}} = this.props;
    this.props.form.resetFields();
    const values = {
      start: 0,
      count: getUserTemplateList_params.count
    }
    this.loadUserAutographList(values);
  };



  render() {
    const {visible, modalVisible1, isEdit, modalVisible2, isDetails, commentValue, isExamine, autographValue,isAddAutograph,isExamineAutograph,visible1,visible2,visible3} = this.state;
    const {msgService: {userAutographList_params, userAutographList,getPlatTemplateList,getPlatTemplateList_params, getUserTemplateList, getUserTemplateList_params,commentTemplate, commentTemplate_params,},} = this.props;
    let userType = getLoginUserType();
    const {getFieldDecorator} = this.props.form;
    const {intl: {formatMessage}} = this.props;

    const {
      loading,
      loading1,
      loading2,
      loading3,
      tableLoading1,
      tableloading2,
      tableLoading3,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
    };

    const plt_pagination1 = {
      current:(commentTemplate_params.start/commentTemplate_params.count)+1,
      pageSize:commentTemplate_params.count,
      total:commentTemplate.total
    };

    const user_pagination1 = {
      current:(getPlatTemplateList_params.start/getPlatTemplateList_params.count)+1,
      pageSize:getPlatTemplateList_params.count,
      total:getPlatTemplateList.total
    };

    const plt_pagination2 = {
      current:(getUserTemplateList_params.start/getUserTemplateList_params.count)+1,
      pageSize:getUserTemplateList_params.count,
      total:getUserTemplateList.total
    };

    const user_pagination2 = {
      current:(commentTemplate_params.start/commentTemplate_params.count)+1,
      pageSize:commentTemplate_params.count,
      total:commentTemplate.total
    };

    const autographPagination = {
      current:(userAutographList_params.start/userAutographList_params.count)+1,
      pageSize:userAutographList_params.count,
      total:userAutographList.total
    };


    const columns = [{
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'index',
      key: 'index',
      className: 'table_row_styles',
      render: (text, record, index) => (
        <span>{index + 1}</span>
      )
    }, {
      title: formatMessage(messages.msg_service_template_name),
      dataIndex: 'title',
      key: 'title',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.msg_service_template_type),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{text === 1 ? formatMessage(basicMessages.verification_code) : text === 2 ? formatMessage(messages.msg_message_notice) : text === 3 ? formatMessage(messages.msg_promote_SMS) : ''}</span>
      )
    }, {
      title: formatMessage(messages.msg_service_message_template_id),
      dataIndex: 'id',
      key: 'id',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.application_time),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{moment(text).format('YYYY/MM/DD')}</span>
      ),
    }, {
        title: formatMessage(messages.msg_service_message_template_content),
        dataIndex: 'content',
        key: 'content',
        className: 'table_row_styles',
     }, {
        title: formatMessage(basicMessages.operations),
        dataIndex: 'action',
        key: 'action',
        className: 'table_row_styles',
        width:120,
        render: (text, record) => (
          <span>
            <a onClick={()=>{
              this.openTemplateModal();
              this.setState({
                isEdit: true,
                isDetails: false,
                commentValue: record,
                isComment:true,
              })
            }}>
              <Icons edit={true}/>
            </a>

            <a style={{marginLeft:10}} onClick={()=>{
              this.delTemplate(record.id)
            }}>
              <Icons deleted={true}/>
            </a>

            <a style={{marginLeft:10}} onClick={()=>{
              this.openTemplateModal();
              this.setState({
                isEdit: true,
                isDetails: true,
                commentValue: record,
              })
            }}>
              <Icons item={true}/>
            </a>
        </span>
        )
      }];


    const columnsTenant = [{
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'index',
      key: 'index',
      className: 'table_row_styles',
      render: (text, record, index) => (
        <span>{index + 1}</span>
      )
    }, {
      title: formatMessage(messages.msg_service_template_name),
      dataIndex: 'title',
      key: 'title',
      className: 'table_row_styles',
    }, {
      title: formatMessage(messages.msg_service_template_type),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{text === 1 ? formatMessage(basicMessages.verification_code) : text === 2 ? formatMessage(messages.msg_message_notice) : text === 3 ? formatMessage(messages.msg_promote_SMS) : ''}</span>
      )
    }, {
      title: formatMessage(messages.msg_service_message_template_id),
      dataIndex: 'id',
      key: 'id',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.application_time),
      dataIndex: 'create_time',
      key: 'create_time',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{moment(text).format('YYYY/MM/DD')}</span>
      ),
    }, {
      title: formatMessage(messages.msg_service_pass_time),
      dataIndex: 'update_time',
      key: 'update_time',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.applicant),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.status),
      dataIndex: 'state',
      key: 'state',
      className: 'table_row_styles',
      render:(text,record)=>(
        <span>{text===1?formatMessage(basicMessages.audited):formatMessage(basicMessages.unaudited)}</span>
      )
    }, {
        title: formatMessage(messages.msg_service_message_template_content),
        dataIndex: 'content',
        key: 'content',
        className: 'table_row_styles',
      }, {
        title: formatMessage(basicMessages.operations),
        dataIndex: 'action',
        key: 'action',
        className: 'table_row_styles',
        width:120,
        render: (text, record) => (
          <span>
            {
              record.creater_id===userInfo.value.tenantId?
                <a onClick={()=>{
                  this.delTemplate(record.id)
                }}>
                  <Icons deleted={true}/>
                </a>
                :null
            }

            <a style={{marginLeft:10}} onClick={()=>{
              this.openTemplateModal();
              this.setState({
                isEdit: false,
                isDetails: true,
                isExamine: false,
                commentValue: {
                  ...record,
                  explain:record.ch_explain
                },
              })
            }}>
              <Icons item={true} />
            </a>
        </span>
        )
      }];


    const columns1 = [
      {
        title: formatMessage(basicMessages.serial_number),
        dataIndex: 'index',
        key: 'index',
        className: 'table_row_styles',
        render: (text, record, index) => (<span>{index + 1}</span>)
      }, {
        title: formatMessage(messages.msg_service_template_name),
        dataIndex: 'title',
        key: 'title',
        className: 'table_row_styles'
      }, {
        title: formatMessage(messages.msg_service_template_type),
        dataIndex: 'type',
        key: 'type',
        className: 'table_row_styles',
        render: (text, record) => (
          <span>{text === 1 ? formatMessage(basicMessages.verification_code) : text === 2 ? formatMessage(messages.msg_message_notice) : text === 3 ? formatMessage(messages.msg_promote_SMS) : ''}</span>
        )
      }, {
        title: formatMessage(messages.msg_service_message_template_id),
        dataIndex: 'code',
        key: 'code',
        className: 'table_row_styles',
      }, {
        title: formatMessage(basicMessages.createTime),
        dataIndex: 'createTime',
        key: 'createTime',
        className: 'table_row_styles',
        render: (text, record) => (
          <span>{moment(text).format('YYYY/MM/DD')}</span>
        )
      }, {
        title: formatMessage(basicMessages.applicant),
        dataIndex: 'name',
        key: 'name',
        className: 'table_row_styles',
      }, {
        title: formatMessage(messages.msg_service_message_template_content),
        dataIndex: 'content',
        key: 'content',
        className: 'table_row_styles',
      }, {
        title: formatMessage(basicMessages.operations),
        dataIndex: 'action',
        key: 'action',
        className: 'table_row_styles',
        width:120,
        render: (text, record) => (
          <span>
            {userType === 0 && record.state === 2 ?
              <a onClick={()=>{
                this.openTemplateModal();
                this.setState({
                  isEdit: true,
                  isDetails: false,
                  commentValue: record,
                  isExamine: true,
                })
              }}>
                <Icons auditor={true}/>
              </a> :
              <span>
                <a onClick={()=>{
                  this.openTemplateModal();
                  this.setState({
                    isEdit: true,
                    isDetails: false,
                    isExamine: false,
                    commentValue: record,
                  })
                }}>
                  <Icons edit={true}/>
                </a>

                <a style={{marginLeft:10}} onClick={()=>{
                  this.delUserTemplate(record.id)
                }}>
                  <Icons deleted={true}/>
                </a>

                <a style={{marginLeft:10}} onClick={()=>{
                  this.openTemplateModal();
                  this.setState({
                    isEdit: true,
                    isDetails: true,
                    isExamine: false,
                    commentValue: record,
                  })
                }}>
                  <Icons item={true}/>
                </a>
              </span>

            }
        </span>
        )
      }];

    const columns1_1 = [
      {
        title: formatMessage(basicMessages.serial_number),
        dataIndex: 'index',
        key: 'index',
        className: 'table_row_styles',
        render: (text, record, index) => (<span>{index + 1}</span>)
      }, {
        title: formatMessage(messages.msg_service_template_name),
        dataIndex: 'title',
        key: 'title',
        className: 'table_row_styles'
      }, {
        title: formatMessage(messages.msg_service_template_type),
        dataIndex: 'type',
        key: 'type',
        className: 'table_row_styles',
        render: (text, record) => (
          <span>{text === 1 ? formatMessage(basicMessages.verification_code) : text === 2 ? formatMessage(messages.msg_message_notice) : text === 3 ? formatMessage(messages.msg_promote_SMS) : ''}</span>
        )
      }
      , {
        title: formatMessage(messages.msg_service_message_template_id),
        dataIndex: 'code',
        key: 'code',
        className: 'table_row_styles',
      }, {
        title: formatMessage(basicMessages.createTime),
        dataIndex: 'createTime',
        key: 'createTime',
        className: 'table_row_styles',
        render: (text, record) => (
          <span>{moment(text).format('YYYY/MM/DD')}</span>
        )
      }, {
        title: formatMessage(messages.msg_service_message_template_content),
        dataIndex: 'content',
        key: 'content',
        className: 'table_row_styles',
      }, {
        title: formatMessage(basicMessages.operations),
        dataIndex: 'action',
        key: 'action',
        className: 'table_row_styles',
        render: (text, record) => (
          <span>

            <a onClick={()=>{
              this.openTemplateModal();
              this.setState({
                isEdit: true,
                isDetails: true,
                commentValue: record,
                useType: 3,
              })
            }}>
              <Icons item={true}/>
            </a>

        </span>
        )
      }];


    const columns2 = [{
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'index',
      key: 'index',
      className: 'table_row_styles',
      render: (text, record, index) => (<span>{index + 1}</span>)
    }, {
      title: formatMessage(basicMessages.autograph_id),
      dataIndex: 'id',
      key: 'id',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.application_time),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{moment(text).format('YYYY/MM/DD')}</span>
      ),
    }, {
      title: formatMessage(basicMessages.applicant),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.autograph),
      dataIndex: 'sign',
      key: 'sign',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.autograph_type),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      render: (text, record) => (
        // 签名类型0：企事业单位的全称或简称1：工信部备案的网站全称或简称2：APP应用的全称或简称 3：公众号或小程序的名称全称或简称
        <span>{text === 0 ? '企事业单位的全称或简称' : text === 1 ? '工信部备案的网站全称或简称' : text === 2 ? 'APP应用的全称或简称' : '公众号或小程序的名称全称或简称'}</span>
      )
    }, {
      title: formatMessage(basicMessages.status),
      dataIndex: 'state',
      key: 'state',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{text === 1 ? formatMessage(basicMessages.audited) : formatMessage(basicMessages.unaudited)}</span>
      )
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      width:120,
      render: (text, record) => (
        record.state !== 1 ?
          <a onClick={()=>{
            this.openAutographModal();
            this.setState({
              autographValue: record,
              isAddAutograph:false,
              isExamineAutograph:true,
              isAutoDetails: false,
            })
          }}>
            <Icons auditor={true}/>
          </a>
          :
          <span>
            <a onClick={()=>{
              this.openAutographModal();
              this.setState({
                autographValue: record,
                isAddAutograph:false,
                isExamineAutograph:false,
                isAutoDetails: false,
              })
            }}>
              <Icons edit={true} />
            </a>
            <a style={{marginLeft:10}} onClick={()=>{
              this.delAutograph(record.id)
            }}>
              <Icons deleted={true}/>
            </a>

            <a style={{marginLeft:10}} onClick={()=>{
              this.openAutographModal();
              this.setState({
                autographValue: record,
                isAddAutograph:false,
                isExamineAutograph:false,
                isAutoDetails: true,
              })
            }}>
              <Icons item={true}/>
            </a>
        </span>
      )
    }];


    const columns2_1 = [{
      title: formatMessage(basicMessages.serial_number),
      dataIndex: 'index',
      key: 'index',
      className: 'table_row_styles',
      render: (text, record, index) => (<span>{index + 1}</span>)
    }, {
      title: formatMessage(basicMessages.autograph_id),
      dataIndex: 'id',
      key: 'id',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.application_time),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{moment(text).format('YYYY/MM/DD')}</span>
      ),
    }, {
      title: formatMessage(basicMessages.applicant),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.autograph),
      dataIndex: 'sign',
      key: 'sign',
      className: 'table_row_styles',
    }, {
      title: formatMessage(basicMessages.autograph_type),
      dataIndex: 'type',
      key: 'type',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{text === 0 ? '企事业单位的全称或简称' : text === 1 ? '工信部备案的网站全称或简称' : text === 2 ? 'APP应用的全称或简称' : '公众号或小程序的名称全称或简称'}</span>
      )
    }, {
      title: formatMessage(basicMessages.status),
      dataIndex: 'state',
      key: 'state',
      className: 'table_row_styles',
      render: (text, record) => (
        <span>{text === 1 ? formatMessage(basicMessages.audited) : formatMessage(basicMessages.unaudited)}</span>
      )
    }, {
      title: formatMessage(basicMessages.operations),
      dataIndex: 'action',
      key: 'action',
      className: 'table_row_styles',
      render: (text, record) => (
          <span>
            <a onClick={()=>{
              this.delAutograph(record.id)
            }}>
              <Icons deleted={true}/>
            </a>
        </span>
      )
    }];


    const queryForm1 = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }]
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    );

    const queryForm2 = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }]
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    const queryForm3 = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.fuzzy_search)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('field', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }]
            //initialValue:adapter_params.name
          })
          (
            <Input placeholder={formatMessage(basicMessages.query_criteria)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )



    return (
      <PageHeaderLayout>
        <div style={{backgroundColor: '#fff'}}>
          <div className='topline_div_style'>
            <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
          </div>
          <div style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 14,
            paddingTop: 20
          }}>{userType === 0 ? formatMessage(basicMessages.common_template) : formatMessage(basicMessages.template_list)}</div>
          <Card
            bodyStyle={{padding: '6px 32px'}}
            bordered={false}
          >
            <div className='mrgTB12 dlxB'>
              <Button type={'primary'} icon={'plus'}
                      onClick={() => {
                        this.openTemplateModal();
                        this.setState({
                          isEdit: false,
                          isDetails: false,
                          commentValue: null,
                        })
                      }}
              >{userType === 0 ? formatMessage(messages.msg_new_template) : formatMessage(messages.msg_application_template)}</Button>
              <div></div>
              <div>
                {
                  userType!==0?
                    <span className='search' onClick={() => {
                      this.setState({
                        visible1: true,
                      })
                    }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>:null
                }

              </div>
            </div>


            <Query
              visible={visible1}
              handelCancel={this.handelVisible}
              handleOk={this.handleOk1}
              handleReset={this.handleReset}
            >
              {queryForm1}
            </Query>
            <Table
              loading={userType===0?loading:tableLoading1}
              rowKey={record => record.id}
              dataSource={userType === 0 ? commentTemplate && commentTemplate.list : getPlatTemplateList && getPlatTemplateList.list}
              columns={userType === 0 ? columns : userType === 1 ? columnsTenant : columnsTenant}
              pagination={userType === 0?plt_pagination1:user_pagination1}
              onChange={userType === 0?this.plt_onChangeTable1:this.user_onChangeTable1}
            />

          </Card>

          <AddTemplateModal
            addTemplateModalVisible={modalVisible1}
            onCancelModal={this.openTemplateModal}
            isEdit={isEdit}
            isDetails={isDetails}
            isExamine={isExamine}
            commentValue={commentValue}
            loading2={loading2 ? loading2 : loading3}
            onCancel={this.openTemplateModal}
            handleSubmit={(res) => {
              if (!isEdit && !isDetails) {
                this.addTemplate(res)
              } else if (isDetails && isExamine) {
                this.examineTemplate(res)
              } else {
                this.editTemplate(res, commentValue.id);
              }
            }}
          />


          <div className='topline_div_style'>
            <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
          </div>
          <div style={{textAlign: 'center', marginTop: 20, fontSize: 14}}>{userType === 0 ? formatMessage(messages.msg_user_template) : formatMessage(basicMessages.common_template)}</div>

          <Card
            bodyStyle={{padding: '6px 32px'}}
            bordered={false}
          >
            <div className='mrgTB12 dlxB'>
              <div></div>
              {/*<div>*/}
                {/*<span className='search' onClick={() => {*/}
                  {/*this.setState({*/}
                    {/*visible2: true,*/}
                  {/*})*/}
                {/*}}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>*/}
              {/*</div>*/}
            </div>

            <Query
              visible={visible2}
              handelCancel={this.handelVisible1}
              handleOk={this.handleOk2}
              handleReset={this.handleReset1}
            >
              {queryForm2}
            </Query>
            <Table
              loading={userType===0?tableLoading3:loading}
              rowKey={record => record.id}
              dataSource={userType === 0 ? getUserTemplateList && getUserTemplateList.list : commentTemplate && commentTemplate.list}
              columns={userType === 0 ? columns1 : columns1_1}
              pagination={userType===0?plt_pagination2:user_pagination2}
              onChange={userType===0?this.plt_onChangeTable2:this.user_onChangeTable2}
            />
          </Card>

          <div className='topline_div_style'>
            <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
          </div>
          <div style={{textAlign: 'center', marginTop: 20, fontSize: 14}}>{userType === 1 ? formatMessage(messages.msg_user_autograph) : formatMessage(messages.msg_autograph_manage)}</div>

          <Card
            bodyStyle={{padding: '6px 32px'}}
            bordered={false}
          >
            <div className='mrgTB12 dlxB'>
              <div>
                {
                  userType !== 0 ?
                    <Button
                      type={'primary'}
                      icon={'plus'}
                      onClick={()=>{
                        this.openAutographModal();
                        this.setState({
                          isAddAutograph:true,
                          isExamineAutograph:false,
                        })
                      }}
                    >
                      {formatMessage(messages.msg_application_autograph)}
                    </Button> : null
                }
              </div>
              {/*<div>*/}
                {/*<span className='search' onClick={() => {*/}
                  {/*this.setState({*/}
                    {/*visible3: true,*/}
                  {/*})*/}
                {/*}}><Icon className='query_icon' type="search"/>筛选</span>*/}
              {/*</div>*/}
            </div>

            <Query
              visible={visible3}
              handelCancel={this.handelVisible2}
              handleOk={this.handleOk3}
              handleReset={this.handleReset2}
            >
              {queryForm3}
            </Query>
            <Table
              loading={tableloading2}
              rowKey={record => record.id}
              dataSource={userAutographList && userAutographList.list}
              columns={userType===0?columns2:columns2_1}
              pagination={autographPagination}
              onChange={this.changeAutographPage}

            />
          </Card>
        </div>

        <AddAutographModal
          addAutographModalVisible={modalVisible2}
          onCancel={this.openAutographModal}
          loading={loading1}
          autographValue={autographValue}
          isAutoDetails={this.state.isAutoDetails}
          handleSubmit={(value) => {
            if(isAddAutograph){
              this.props.dispatch({
                type: 'msgService/fetch_addAutograph_action',
                payload: value,
                params: userAutographList_params,
                callback: (res) => {
                  this.openAutographModal();
                }
              });
            }else if(isExamineAutograph){
              let params = {
                id:autographValue.id,
                ...value
              }
              this.examineAutograph(params);
            }else{
              let params = {
                id:autographValue.id,
                ...value
              };
              this.editAutograph(params)
            }
          }}
        />

      </PageHeaderLayout>
    );
  }
}
