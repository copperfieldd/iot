import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Table,
  Button,
  Icon,
  Badge,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  Divider,
  Tree,
  Tooltip
} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {formatCheckedMenuIds, formatMenuId, isInArray} from "../../../utils/utils";
import OrganizationTree from '../../../components/OrganizationTree'
import ApiList from "../../../components/ApiListModal";
import request from '../../../utils/request';
import {stringify} from 'qs';
import TerminalTree from "../../../components/TerminalTree";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';
import * as routerRedux from "react-router-redux";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Search = Input.Search;
const Option = Select.Option;
const TextArea = Input.TextArea;
const TreeNode = Tree.TreeNode;


@connect(({permissionsRole, permissions, loading,global}) => ({
  permissionsRole,
  global,
  permissions,
  loading: loading.effects['permissionsRole/fetch_updRole_action'],
}))
@injectIntl
@Form.create()
export default class RoleManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      expandedKeys: [],
      OrganizationVisible: false,
      apiModalVisible: false,
      checkedApiValues: [],
      organizationValue:[],
      checkedKeys:[],
      roleItem:{},
      terminalList:[],
    }
  };

  componentDidMount() {
    const {match:{params:{data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type: 'tenantType/fetch_userMenuList_action',
      payload: null,
    })

    this.props.dispatch({
      type:'permissionsRole/fetch_roleItem_action',
      payload:{id:item.id},
      callback:(res)=>{
        let organizationValue = res.org?res.org.filter(o=>{
          if(o.type!==5){
            return o
          }
        }):[];

        let orgItems = res.org?res.org.filter(o=>{
          if(o.type!==5){
            return o
          }
        }):[];

        let orgIds = orgItems.map(o=>{
          return o.id
        })

        let defaultTerminalList = res.org?res.org.filter(o=>{
          if(o.type===5){
            return o
          }
        }):[];

        let customerItems = res.org?res.org.filter(o=>{
          if(o.type===5){
            return o
          }
        }):[];

        let customerId = customerItems.map(o=>{
          return o.id
        })

        let terminalList = defaultTerminalList.map(o=>{
          if(o.hasOwnProperty("name")){
            return {...o,userName:o.name}
          }
        })

        this.setState({
          checkedApiValues:res.api,
          checkedKeys:res.menuIds,
          roleItem:res,
          organizationValue:organizationValue,
          terminalList:terminalList,
        });

        this.props.form.setFieldsValue({menuIds: res.menuIds})
        this.props.form.setFieldsValue({orgIds: orgIds})
        this.props.form.setFieldsValue({customerId: customerId})

      }
    })
  }


  handleSubmit = (e) => {
    const {form} = this.props;
    const {roleItem} = this.state;
    const platUserInfo = JSON.parse(localStorage.getItem('config_userInfo'));
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
        if (platUserInfo.value.type === 0) {
          let value = {
            ...roleItem,
            ...values,
            orgIds: [],
          }
          this.props.dispatch({
            type: 'permissionsRole/fetch_updRole_action',
            payload: value
          });
          return;
        }else if(platUserInfo.value.type === 1){
          let value = {
            ...roleItem,
            ...values,
          };
          this.props.dispatch({
            type: 'permissionsRole/fetch_updRole_action',
            payload: value
          });
          return;
        }else{
          let orgIds = values.orgIds?values.orgIds:[]
          let customerId = values.customerId?values.customerId:[]
          let value = {
            ...roleItem,
            ...values,
            orgIds:[...orgIds,...customerId]
          };
          this.props.dispatch({
            type: 'permissionsRole/fetch_updRole_action',
            payload: value
          });
          return;
        }
      }

    });

  };


  changeExpandedKeys = (e) => {
    const {expandedKeys} = this.state;
    const {node: {props}} = e;
    const {key, isLeaf} = props.dataRef;
    if (isInArray(expandedKeys, key)) {
      const newKeys = expandedKeys.filter(i => i !== key)
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


  changeCustomerVisible=()=>{
    this.setState({
      customerVisible: !this.state.customerVisible
    })
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
      return <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id} dataRef={item}/>;
    });
  };


  changeOrganizationVisible = () => {
    this.setState({
      OrganizationVisible: !this.state.OrganizationVisible
    })
  }

  openApiModal = () => {
    this.setState({
      apiModalVisible: !this.state.apiModalVisible
    })
  };

  onCheck = (checkedKeys,info) => {
    if(info.checked){
      const {permissions:{menuTree}} = this.props;
      let menuId = formatMenuId(menuTree)
      let checkedMenuIds = formatCheckedMenuIds(menuId,checkedKeys.checked).filter(item => item);
      let setCheckedMenuIds = Array.from(new Set(checkedMenuIds))
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


  delOrganization=(item)=>{
    let delValue = this.state.organizationValue.filter(i=>{
      if(item.id!==i.id){
        return i
      }
    });
    this.setState({
      organizationValue:delValue
    });

    let orgIds = delValue.map(o=>{
      return o.id
    });
    this.props.form.setFieldsValue({orgIds:orgIds})

  };

  delApiList=(item)=>{
    let delValue=this.state.checkedApiValues.filter(i=>{
      if(item.id!==i.id){
        return i
      }
    });
    this.setState({
      checkedApiValues:delValue
    });

    let apiMapIds = delValue.map(o=>{
      return o.id
    });

    this.props.form.setFieldsValue({apiIds: apiMapIds});
  };


  delTerminalUser=(node)=>{
    let terminalUser = this.state.terminalList.filter(i=>{
      if(node.id!==i.id){
        return i
      }
    });
    this.setState({
      terminalList:terminalUser
    });
    let terminalIds = terminalUser.map(o=>{
      return o.id
    });
    this.props.form.setFieldsValue({customerId: terminalIds});
  };

  render() {
    const {expandedKeys, OrganizationVisible, apiModalVisible, organizationValue,checkedApiValues,customerVisible,terminalList} = this.state;
    const {history, loading, permissions: {menuTree},match:{params:{data}},intl:{formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));

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
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >
          {/*<Card*/}
            {/*title={<span style={{color: '#3f89e1'}}>编辑角色</span>}*/}
          {/*>*/}
            <div className='mrgTB30' style={{width: 1000}}>
              <Form>
                <FormItem
                  label={formatMessage(messages.roleName)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.roleNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: item&&item.name
                    })(
                      <Input placeholder={formatMessage(messages.roleNameInput)}/>
                    )
                  }

                </FormItem>

                <FormItem
                  label={formatMessage(basicMessages.describe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                      initialValue: item&&item.remarks
                    })(
                      <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                    )
                  }

                </FormItem>
                {
                  item && item.nodeType === 1 ? null : item && item.nodeType === 3 ?

                    <FormItem
                      label={formatMessage(basicMessages.organization)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('orgIds', {
                          // rules: [{
                          //   required: true, message: '请输入角色名称!',
                          // }],
                          //initialValue: details&&details.name
                        })(
                          <div onClick={this.changeOrganizationVisible} className={styles.ele_input_addStype}>
                            {organizationValue&&organizationValue?organizationValue.map((item,index)=>{
                              return(
                                <div className={styles.ele_input_style} style={{width: 'auto',display:'inline-block'}}
                                     key={index}
                                >
                                  <span>{item.complexName}</span>
                                  <span>{item.name}</span>
                                  <span>{item.dataUrl}</span>
                                  <Icon onClick={(e) => {
                                    e.stopPropagation();
                                    this.delOrganization(item)
                                  }} style={{lineHeight: '28px',float:'right'}} type="close"/>
                                </div>
                              )}):null}

                            <Icon className={styles.down_icon} type="down"/>
                          </div>
                        )
                      }
                    </FormItem> :
                    <div>
                      <FormItem
                        label={formatMessage(basicMessages.organization)}
                        {...formItemLayout}
                      >
                        {
                          getFieldDecorator('orgIds', {
                            // rules: [{
                            //   required: true, message: '请选择组织机构!',
                            // }],
                            //initialValue: null
                          })(
                            <div onClick={this.changeOrganizationVisible} className={styles.ele_input_addStype}>
                              {organizationValue&&organizationValue?organizationValue.map((item,index)=>{
                                return(
                                  <div className={styles.ele_input_style} style={{width: 'auto',display:'inline-block'}}
                                       key={index}
                                  >
                                    <span>{item.name}</span>
                                    <Icon onClick={(e) => {
                                      e.stopPropagation();
                                      this.delOrganization(item)
                                    }} style={{lineHeight: '28px',float:'right'}} type="close"/>
                                  </div>
                                )}):null}

                              <Icon className={styles.down_icon} type="down"/>
                            </div>
                          )
                        }
                      </FormItem>
                      <FormItem
                        label={formatMessage(basicMessages.ter)}
                        {...formItemLayout}
                      >
                        {
                          getFieldDecorator('customerId', {
                            // rules: [{
                            //   required: true, message: '请输入角色名称!',
                            // }],
                            //initialValue: details&&details.name
                          })(
                            <div onClick={this.changeCustomerVisible} className={styles.ele_input_addStype}>
                              {terminalList&&terminalList?terminalList.map((item,index)=>{
                                return(
                                  <div className={styles.ele_input_style} style={{width: 'auto',display:'inline-block'}}
                                       key={index}
                                  >
                                    <span>{item.userName}</span>
                                    <Icon onClick={(e) => {
                                      e.stopPropagation();
                                      this.delTerminalUser(item)
                                    }} style={{lineHeight: '28px',float:'right'}} type="close"/>
                                  </div>
                                )}):null}

                              <Icon className={styles.down_icon} type="down"/>
                            </div>
                          )
                        }
                      </FormItem>
                    </div>

                }


                <FormItem
                  label={formatMessage(basicMessages.menuList)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('menuIds', {
                      //initialValue: details&&details.name
                    })(
                      <div className={styles.formTree}>
                        <Tree
                          checkedKeys={this.state.checkedKeys}
                          checkable
                          showIcon
                          onCheck={this.onCheck}
                          onExpand={this.onExpand}
                          expandedKeys={expandedKeys}
                          onSelect={this.onSelect}
                          checkStrictly={true}
                        >
                          {this.renderTreeNodes(menuTree)}
                        </Tree>
                      </div>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.menuApiList)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('apiIds', {
                      // rules: [{
                      //   required: true, message: '请输入角色名称!',
                      // }],
                      //initialValue: details&&details.name
                    })(
                      <div onClick={this.openApiModal} className={styles.ele_input_addStype}>
                        {checkedApiValues && checkedApiValues ? checkedApiValues.map((item, index) => {
                          return (
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
                                this.delApiList(item)
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
          {/*</Card>*/}

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      this.props.dispatch(routerRedux.push('/permissions/roleManage'));
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

          <TerminalTree
            modalVisible={customerVisible}
            handleCustomerSubmit={(value) => {
              this.setState({
                terminalList:value,
              });
              let orgIds = value.map(item=>{
                return item.id;
              })
              this.props.form.setFieldsValue({customerId:orgIds})
            }}
            onCancelModal={() => {
              this.setState({
                customerVisible: !this.state.customerVisible
              })
            }}
          />

          <OrganizationTree
            OrganizationVisible={OrganizationVisible}
            nodeId={item.nodeId}
            nodeType={item.nodeType}
            handleOrganizationSubmit={(value) => {
              this.setState({
                organizationValue:value,
              });
              let orgIds = value.map(item=>{
                return item.id;
              })
              this.props.form.setFieldsValue({orgIds:orgIds})
            }}
            onCancelModal={() => {
              this.setState({
                OrganizationVisible: !this.state.OrganizationVisible
              })
            }}
          />

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
        </Card>

      </PageHeaderLayout>
    );
  }
}
