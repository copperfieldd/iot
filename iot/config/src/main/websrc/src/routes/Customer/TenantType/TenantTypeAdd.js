import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Select, Card, Tree, Icon, Tooltip} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ApiList from "../../../components/ApiListModal";
import * as routerRedux from "react-router-redux";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';
import {formatMenuId, formatCheckedMenuIds} from '../../../utils/utils'

const FormItem = Form.Item;
const {TextArea} = Input;
const TreeNode = Tree.TreeNode;

@injectIntl

@connect(({tenantType, permissions, loading, global}) => ({
  tenantType,
  permissions,
  global,
  loading: loading.effects['tenantType/fetch_addGradeList_action'],
  menuLoading: loading.effects['tenantType/fetch_userMenuList_action'],
}))
@Form.create()
export default class TenantTypeAdd extends Component {
  constructor() {
    super();
    this.state = {
      unCheckedKeys: [],
    }
  };


  componentDidMount() {
    const {permissions:{menuTree}} = this.props;
    if(!menuTree&&menuTree.length===0){
      this.loadModalApiList();
    }
    // this.props.dispatch({
    //   type: 'tenantType/fetch_userMenuList_action',
    //   payload: null,
    // });
  }

  loadModalApiList = (params) => {
    this.props.dispatch({
      type: 'permissions/fetch_getAPIandMenu_action',
      payload: params,
    })
  };

  //添加
  handleSubmit = (e) => {
    const {form, intl: {formatMessage}} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'tenantType/fetch_addGradeList_action',
          payload: values,
          callback: (res) => {
            let record = {
              id: res.id, name: res.name, remarks: res.remarks, creatorName: res.creatorName,
            };
            this.props.dispatch(routerRedux.push(`/customer/tenantType/edit/${encodeURIComponent(JSON.stringify(record))}`))
          },
          props: this.props,
        });
      }
    });
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
          <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id}
                    value={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id}
                       value={item.id} dataRef={item}/>;
    });
  };


  onCheck = (checkedKeys, info) => {

    //分离方式，
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
      let currentChildKeys = info.node.props.dataRef.children.map(i=>i.id);

      let checkedKeys = this.state.checkedKeys.filter(i=>{
        if(i!==unCheckedKeys){
          return i
        }
      });
      let tempArray1 = [];//临时数组1
      let tempArray2 = [];//临时数组2

      for(let i=0;i<currentChildKeys.length;i++){
        tempArray1[currentChildKeys[i]]=true;//将数array2 中的元素值作为tempArray1 中的键，值为true；
      }

      for(let i=0;i<checkedKeys.length;i++){
        if(!tempArray1[checkedKeys[i]]){
          tempArray2.push(checkedKeys[i]);//过滤array1 中与array2 相同的元素；
        }
      }

      this.setState({ checkedKeys:tempArray2});
      this.props.form.setFieldsValue({menuIds:tempArray2})
    }
  };

  //打开接口列表
  openApiModal = () => {
    this.setState({
      apiModalVisible: !this.state.apiModalVisible
    })
  };


  delRoleValues = (node) => {
    let delValue = this.state.checkedApiValues.filter(item => {
      if (item.id !== node.id) {
        return item;
      }
    });
    this.setState({
      checkedApiValues: delValue
    })
  };

  render() {
    const {history, loading, tenantType: {}, permissions: {menuTree}, intl: {formatMessage},} = this.props;
    const {expandedKeys, apiModalVisible, checkedApiValues} = this.state;
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
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
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
                      max: 64, message: formatMessage(basicMessages.moreThan64)
                    }],
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
                    rules: [{
                      required: true, message: '请选择菜单列表!',
                    }],
                  })(
                    <div className={styles.formTree}>
                      <Tree
                        checkable
                        checkStrictly={true}
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
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
                  })(
                    <div onClick={this.openApiModal} className={styles.ele_input_addStype}>
                      {checkedApiValues && checkedApiValues ? checkedApiValues.map((item, index) => {
                        return (
                          <div className={styles.ele_input_style} key={index}>
                            <Tooltip title={item.complexName}>
                              <span className='list_break' style={{width: 90}}>{item.complexName}</span>
                            </Tooltip>
                            <Tooltip title={item.name}>
                              <span className='list_break' style={{width: 220}}>{item.name}</span>
                            </Tooltip>
                            <Tooltip title={item.dataUrl}>
                              <span className='list_break' style={{width: 180}}>{item.dataUrl}</span>
                            </Tooltip>
                            <Icon onClick={(e) => {
                              e.stopPropagation();
                              this.delRoleValues(item)
                            }} style={{lineHeight: '28px'}} type="close"/>
                          </div>)
                      }) : null}
                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>
            </Form>
          </div>

          <ApiList
            apiModalVisible={apiModalVisible}
            onCancelModal={this.openApiModal}
            handleRoleSubmit={(values) => {
              let apiMapIds = values.map(item => {
                return item.id;
              });
              this.props.form.setFieldsValue({apiIds: apiMapIds});
              this.setState({
                checkedApiValues: values,
              })
            }}
          />

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button loading={loading} type='primary' onClick={(e) => {
              this.handleSubmit(e);
            }}><FormattedMessage {...basicMessages.confirm} /></Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            ><FormattedMessage {...basicMessages.return} /></Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
