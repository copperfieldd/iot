import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Select, Card, Tree, Icon, Tooltip} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ApiList from "../../../components/ApiListModal";
import {formatCheckedMenuIds, formatMenuId, isInArray} from "../../../utils/utils";
import request from '../../../utils/request';
import { stringify } from 'qs';
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

const TreeNode = Tree.TreeNode;

@injectIntl
@connect(({tenantType,permissions, loading,global}) => ({
  tenantType,
  global,
  permissions,
  loading: loading.effects['tenantType/fetch_addGradeList_action'],
  menuLoading:loading.effects['tenantType/fetch_userMenuList_action'],
}))
@Form.create()
export default class TenantTypeEdit extends Component {
  constructor() {
    super();
    this.state = {
      checkedApiValues:[],
    }
  };


  componentDidMount(){
    this.props.dispatch({
      type:'tenantType/fetch_userMenuList_action',
      payload:null,
    });

    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type:'tenantType/fetch_gradeItem_action',
      payload:{id:item.id},
      callback:(res)=>{
        let menusId = res.menus.map(i=>{
          return i.id
        });
        let apiIds = res.apis.map(i=>{
          return i.id
        });
        this.setState({
          checkedApiValues:res.apis,
          checkedKeys:menusId,
        });
        this.props.form.setFieldsValue({menuIds:menusId});
        this.props.form.setFieldsValue({apiIds:apiIds})
      }

    })

  }
  //添加
  handleSubmit = (e) => {
    const {form} = this.props;
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...values,
          id:item.id
        }
        this.props.dispatch({
          type: 'tenantType/fetch_updGradeList_action',
          payload: value,
          props:this.props,
        });
      }
    });
  };

  changeExpandedKeys = (e) => {
    const {expandedKeys} = this.state;
    const {node: {props}} = e;
    const {key, isLeaf} = props.dataRef;
    if (isInArray(expandedKeys, key)) {
      const newKeys = expandedKeys.filter(i => i !== key);
      this.setState({expandedKeys: newKeys});
    } else {
      if (!isLeaf) {
        expandedKeys.push(key);
        this.setState({expandedKeys});
      }
    }
  };


  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };


  renderTreeNodes = (data) => {
    const {global: {local}} = this.props;
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id}  dataRef={item}/>;
    });
  };

  onCheck = (checkedKeys,info) => {
    if(info.checked){
      const {permissions:{menuTree}} = this.props;
      let menuId = formatMenuId(menuTree);
      let checkedMenuIds = formatCheckedMenuIds(menuId,checkedKeys.checked).filter(item => item);
      let setCheckedMenuIds = Array.from(new Set(checkedMenuIds));
      let checkedMenuKeys=[];
      setCheckedMenuIds.map(i=>{
        i.map(o=>{
          checkedMenuKeys.push(o);
        })
      });
      this.setState({ checkedKeys:Array.from(new Set(checkedMenuKeys))});
      this.props.form.setFieldsValue({menuIds:Array.from(new Set(checkedMenuKeys))})
    }else{
      let unCheckedKeys = info.node.props.eventKey;
      let checkedKeys = this.state.checkedKeys.filter(i=>{
        if(i!==unCheckedKeys){
          return i
        }
      });
      this.setState({ checkedKeys:checkedKeys});
      this.props.form.setFieldsValue({menuIds:checkedKeys})
    }
  };


  //打开接口列表
  openApiModal=()=>{
    this.setState({
      apiModalVisible:!this.state.apiModalVisible
    })
  }

  delRoleValues=(node)=>{
    let delValue = this.state.checkedApiValues.filter(item=>{
      if(item.id!==node.id){
        return item;
      }
    });
    let apiIds = delValue.map(c=>{
      return c.id;
    });
    this.props.form.setFieldsValue({apiIds:apiIds});
    this.setState({
      checkedApiValues:delValue
    })
  }


  render() {
    const {history, loading,tenantType:{},permissions:{menuTree},match:{params:{data}},intl:{formatMessage},} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {expandedKeys,apiModalVisible,checkedApiValues} = this.state;
    const defaultApiValue = checkedApiValues.map(item=>{
      return {id:item.id,name:item.name,dataUrl:item.dataUrl,complexName:item.complexName}
    });

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const {getFieldDecorator} = this.props.form;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px',}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 1000}}>
            <Form>
              <FormItem
                label={<FormattedMessage {...messages.typeName} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.typeAddName),
                    }],
                    initialValue: item.name
                  })(
                    <Input placeholder={formatMessage(messages.typeAddName)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={<FormattedMessage {...basicMessages.describe} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('remarks', {
                    rules: [{
                      max: 64,message: formatMessage(basicMessages.moreThan64)
                    }],
                    initialValue:item.remarks
                  })(
                    <TextArea rows={4} placeholder={formatMessage(messages.typeAddDesc)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={<FormattedMessage {...basicMessages.menuList} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('menuIds', {
                    initialValue: item.menuIds
                  })(
                    <div className={styles.formTree}>
                      <Tree
                        checkable
                        showIcon
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        checkStrictly={true}
                        expandedKeys={expandedKeys}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        onRightClick={this.rightClick}
                      >
                        {this.renderTreeNodes(menuTree)}
                      </Tree>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label={<FormattedMessage {...basicMessages.apiList} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('apiIds', {
                    rules: [{
                      required: true, message: '请选择接口列表!',
                    }],
                    initialValue: item.apiIds
                  })(
                    <div onClick={this.openApiModal} className={styles.ele_input_addStype}>
                      {checkedApiValues&&checkedApiValues?checkedApiValues.map((item,index)=>{
                        return(
                          <div className={styles.ele_input_style} key={index}>
                            <Tooltip title={item.complexName}>
                              <span className='list_break' style={{width:90}}>{item.complexName}</span>
                            </Tooltip>
                            <Tooltip title={item.name}>
                              <span className='list_break' style={{width:220}}>{item.name}</span>
                            </Tooltip>
                            <Tooltip title={item.dataUrl}>
                              <span className='list_break' style={{width:180}}>{item.dataUrl}</span>
                            </Tooltip>
                            <Icon onClick={(e) => {
                              e.stopPropagation();
                              this.delRoleValues(item)
                            }} style={{lineHeight: '28px'}} type="close"/>
                          </div>)
                      }):null}
                      <Icon className={styles.down_icon}  type="down" />
                    </div>
                  )
                }
              </FormItem>

            </Form>

          </div>
          {/*</Card>*/}

          <ApiList
            apiModalVisible={apiModalVisible}
            onCancelModal={this.openApiModal}
            defaultApi = {defaultApiValue}
            handleRoleSubmit={(values)=>{
              let apiMapIds = values.map(item=>{
                return item.id;
              });
              this.props.form.setFieldsValue({apiIds: apiMapIds});
              this.setState({
                checkedApiValues:values,
              })
            }}
          />

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}><FormattedMessage {...basicMessages.confirm} /></Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      this.props.dispatch(routerRedux.push('/customer/tenantType'))
                    }}
            ><FormattedMessage {...basicMessages.return} /></Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
