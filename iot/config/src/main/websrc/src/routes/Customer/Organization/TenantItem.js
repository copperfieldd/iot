import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Icon, Badge, Form, Input, List, Tree} from 'antd';
import styles from '../Customer.less';
import {getLoginUserType, isInArray} from "../../../utils/utils";
import request from '../../../utils/request';
import { stringify } from 'qs';
import UserListModal from "../../../components/UserListModal";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';
import ChangePasswordModal from "../../../components/ChangePassword";

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@injectIntl
@connect(({organization, loading,global}) => ({
  organization,
  global,
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class TenantItem extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      expandedKeys: [],
      loadedKeys:[],
      client: {
        X: 0,
        Y: 0,
      },
      dataSource: [],
      showForm: null,
      roleValue:null,
      addType:null,
      departDefaultValue:null,
      modalUserVisible:false,
      appItem:null,
      passwordVisible:false,
    }
  };

  //
  componentDidMount() {
    document.addEventListener("click", this.close);
    const {match:{params:{id}}} = this.props;
    this.setState({
      expandedKeys:[],
    });
  };


  // componentWillReceiveProps(nextProps) {
  //   const {expandedKeys} = this.state;
  //   if (expandedKeys.length === 0) {
  //     const nextTree = nextProps.organization.organizationTree;
  //     if (nextTree.length === 0) return;
  //     const defaultExpandedKeys = [nextTree[0].id];
  //     this.setState({
  //       expandedKeys: defaultExpandedKeys,
  //     })
  //   }
  // }

  componentDidUpdate(nextProps){
    const id = this.props.match.params.id;
    const vid = nextProps.match.params.id;
    if(this.state.expandedKeys.length !== 0&&id!==vid){
      this.setState({expandedKeys:[]});
      this.setState({loadedKeys:[]});
    }
  }



  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
  };

  changeExpandedKeys = (e) => {
    const {expandedKeys} = this.state;
    const {node: {props}} = e;
    const {id, isLeaf} = props.dataRef;
    if (isInArray(expandedKeys, id)) {
      const newKeys = expandedKeys.filter(i => i !== id);
      this.setState({expandedKeys: newKeys});
    } else {
      if (!isLeaf) {
        expandedKeys.push(id);
        this.setState({expandedKeys});
      }
    }
  };

  onExpand = (onExpandedKeys, e) => {
    this.changeExpandedKeys(e);
  };


  onLoadData = (treeNode) => {

    const {dispatch, organization} = this.props;
    const parentId = treeNode.props.dataRef.id;
    const loadedKeys = this.state.loadedKeys;
    this.setState({
      treeNode: treeNode,
      parentId: parentId,
      loadedKeys:[
        ...loadedKeys,
        parentId
      ]
    });
    let organizationTree = organization.organizationTree;

    const params = {
      id: parentId,
    };
    return request(`/userservice/api/unit/children?${stringify(params)}`).then(res => {
      const children = res.value;
      treeNode.props.dataRef.children = children;
      organizationTree = [...organizationTree];
      dispatch({
        type: "organization/treeResult",
        payload: organizationTree,
      })
    });
  };


  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<i
            className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                    title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} {...item} icon={<i className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };


  rightClick = ({event, node}) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    const userType = getLoginUserType()!==1?true:false;
    const type = parseInt(node.props.dataRef.type);
    if(type===1){
      dataSource = [formatMessage(basicMessages.editPassword)];
    };
    let dataSource;
    if (type === 0&&!userType) {
      dataSource = [formatMessage(basicMessages.add_department),formatMessage(basicMessages.add_department),];
    } else if (type === 3) {
      return;
    }
    event.persist();
    this.setState({
      client: {
        X: event.pageX - 230,
        Y: event.pageY - 120,
      },
      pid: node.props.dataRef.id,
      name: node.props.dataRef.title,
      type:node.props.dataRef.type,
      visible: true,
      dataSource: dataSource,
    })
  };

  changePasswordVisible=()=>{
    this.setState({
      passwordVisible:!this.state.passwordVisible,
    })
  };

  handleClick = (item) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    if (item === formatMessage(basicMessages.add_department)) {
      this.setState({
        showForm:0,
        addType:0,
        departDefaultValue:null,
        roleValue:[],
      })
    } else if(item===formatMessage(basicMessages.add_user)) {
      this.setState({
        showForm:1,
        addType:1,
        departDefaultValue:null,
        roleValue:[],
      })
    }else{
      this.changePasswordVisible();
      this.setState({
        userInfo:{userId:this.state.pid,type:this.state.type}
      })
    }
  };


  onSelect = (selectedKeys, e) => {
    const node = e.selectedNodes;
    if(e.selected){
      if (node[0].props.dataRef.type === 0) {
        this.setState({
          showForm: 0,
          pid:node[0].props.dataRef.id,
          addType:2,
        });
        this.props.dispatch({
          type:'organization/fetch_getDepartItem_action',
          payload:{id:node[0].props.dataRef.id},
          callback:(res)=>{
            this.setState({
              departDefaultValue:res,
              roleValue:res.role,
              appItem:res,
            });
            let roleIds = res.role.map(o=>{
              return o.id;
            });
            this.props.form.setFieldsValue({roleIds:roleIds})
          }
        })
      } else if (node[0].props.dataRef.type === 1) {
        this.setState({
          showForm: 1,
          pid:node[0].props.dataRef.id,
          addType:3,
        });
        this.props.dispatch({
          type:'organization/fetch_getUserItem_action',
          payload:{id:node[0].props.dataRef.id},
          callback:(res)=>{
            this.setState({
              departDefaultValue:res,
              roleValue:res.role,
            });
            let roleIds = res.role.map(o=>{
              return o.id;
            });
            this.props.form.setFieldsValue({roleIds:roleIds})
          }
        })
      }
    }
  };


  changeUserModalVisible=()=>{
    const { modalUserVisible } = this.state;
    this.setState({
      modalUserVisible: !modalUserVisible,
    })
  };


  loadTreeInfoSource=(params)=>{
    this.props.dispatch({
      type:"organization/fetch_getOrganizationTree_action",
      payload:{
        ...params,
      },
      callback:(res)=>{
      }
    })
  };

  loadTargetTreeInf=(params)=>{
    this.props.dispatch({
      type:"organization/fetch_getOrganizationTree_action",
      payload:{
        ...params,
      },
    })
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    const {match: {params: {id}}} = this.props;
    const {addType,departDefaultValue} = this.state;
    const _this = this;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let value = {
          ...values,
        };
        if(addType===0){
          this.props.dispatch({
            type: 'organization/fetch_addOrganizationTree_action',
            payload: {...value,pid:this.state.pid,type:2},
            id:{tenantId:id},
            callback: (res,payload) => {
              if (res.status === 0) {
                let params = {id:payload.pid};
                _this.loadTreeInfoSource(params);
              }
            }
          });
        }else if(addType===1){
          this.props.dispatch({
            type: 'organization/fetch_addAppOrganzationUserTreeNode_action',
            payload: {...value,pid:this.state.pid,type:4},
            callback: (res,payload) => {
              if (res.status === 0) {
                const params = {id:payload.pid};
                _this.loadTreeInfoSource(params);

              }
            }
          });
        }else if(addType===2){
          this.props.dispatch({
            type: 'organization/fetch_updOrganizationTree_action',
            payload: {...departDefaultValue,...value},
            callback: (res,payload) => {
              if (res.status === 0) {
                const params = {id:payload.pid};
                _this.loadTreeInfoSource(params);

              }
            }
          });
        }else if(addType===3){
          this.props.dispatch({
            type: 'organization/fetch_updAppOrganzationUserTreeNode_action',
            payload: {...departDefaultValue,...value},
            callback: (res,payload) => {
              if (res.status === 0) {
                const params = {id:payload.pid};
                _this.loadTreeInfoSource(params);

              }
            }
          });
        }
      }
    });
  };


  delRoleValues=(node)=>{
    const userType = getLoginUserType()!==1?true:false;
    if(userType){
      return
    }
    let delValue = this.state.roleValue.filter(item=>{
      if(item.id!==node.id){
        return item;
      }
    });
    let roleIds = delValue.map(c=>{
      return c.id;
    });
    this.props.form.setFieldsValue({roleIds:roleIds});
    this.setState({
      roleValue:delValue
    })
  };

  render() {
    const {expandedKeys, visible, client: {X, Y}, dataSource,modalUserVisible,roleValue,departDefaultValue,passwordVisible,userInfo,loadedKeys} = this.state;
    const {organization:{organizationTree},intl:{formatMessage},match:{params:{id}} } = this.props;
    let organization = organizationTree[id];
    const {getFieldDecorator} = this.props.form;
    const userType = getLoginUserType()!==1?true:false;
    const locale={
      emptyText:formatMessage(basicMessages.no_authority),
    };
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
    return (
        <div className='dlxB' style={{height:600}}>
          <div style={{width:270,border:'solid 1px #d9d9d9',padding:'0 1px'}}>
          <div style={{lineHeight:'40px',textAlign:'center',color:'#3f89e1',background:'#eff3fb'}}><FormattedMessage {...basicMessages.organization} /></div>
            <div className='dlxB' style={{background:'#fff'}}>
              <div className={styles.organization_tree_box}>
                {
                  visible && <div
                    className={styles.list}
                    style={{
                      position: 'absolute',
                      left: X,
                      top: Y,
                      zIndex: 99,
                      whiteSpace: 'nowrap',
                      background: '#fff',
                      textAlign:'center',
                      width:100,
                      border: '1px solid rgb(204, 204, 204)'
                    }}>
                    <List
                      size="small"
                      bordered
                      dataSource={dataSource}
                      locale={locale}
                      renderItem={item => (<List.Item>
                        <div style={{margin:'0 auto'}} onClick={() => this.handleClick(item)}>{item}</div>
                      </List.Item>)}
                    />
                  </div>
                }

                <Tree
                  loadedKeys={loadedKeys}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  onSelect={this.onSelect}
                  loadData={this.onLoadData}
                  onRightClick={this.rightClick}
                >
                  {this.renderTreeNodes(organizationTree)}
                </Tree>
              </div>
            </div>
          </div>
          {
            this.state.showForm===0?
              <div style={{width: 'calc(100% - 275px)', height: 550, border: 'solid 1px #d9d9d9',background:'#fff'}}>
                <div style={{
                  lineHeight: '40px',
                  color: '#3f89e1',
                  textAlign: 'center',
                  paddingLeft: 6,
                  background:'#eff3fb'
                }}><FormattedMessage {...basicMessages.departmentDetail} /></div>
                <div style={{width: 500, margin: '0 auto'}}>
                  <Form style={{textAlign: '-webkit-auto', marginTop: 50}}>
                    <FormItem
                      label={formatMessage(messages.departName)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('name', {
                          rules: [{
                            required: true, message: formatMessage(messages.departNameInput),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                          initialValue:departDefaultValue&&departDefaultValue.name
                        })(
                          <Input disabled={userType} placeholder={formatMessage(messages.departNameInput)}/>
                        )
                      }
                    </FormItem>
                    <FormItem
                      label={formatMessage(messages.departRoles)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('roleIds', {
                          rules: [{
                            required: true, message: formatMessage(messages.departRolesSelect)
                          }],
                        })(
                          <div onClick={!userType?this.changeUserModalVisible:null} className={styles.ele_input_addStype}>
                            {roleValue&&roleValue?roleValue.map((item,index)=>{
                              return(
                                <div className={styles.ele_input_style} key={index}>
                                  <span>{item.name}</span>
                                  <Icon onClick={(e) => {
                                    e.stopPropagation();
                                    this.delRoleValues(item)
                                  }} style={{lineHeight: '28px'}} type="close"/>
                                </div>)
                            }):null}
                            <Icon className={styles.down_icon} type="down"/>
                          </div>
                        )
                      }
                    </FormItem>
                  </Form>
                </div>
                <div className='TxTCenter' style={{width: 500, margin: '60px auto'}}>
                  <Button disabled={userType} type='primary' onClick={(e) => {
                    this.handleSubmit(e);
                  }}>{formatMessage(basicMessages.confirm)}</Button>
                  <Button disabled={departDefaultValue&&departDefaultValue.pid==='0'||userType} className='mrgLf20'
                          onClick={() => {
                            this.props.dispatch({
                              type:'organization/fetch_deleteOrganizationTree_action',
                              payload:{id:departDefaultValue.id},
                              callback: (res) => {
                                if (res.status === 0) {
                                  const params = {id:departDefaultValue.pid};
                                  this.loadTreeInfoSource(params);

                                }
                              }
                            })
                          }}
                  >{formatMessage(basicMessages.delete)}</Button>
                </div>
              </div>

              :this.state.showForm===1?

              <div style={{width: 'calc(100% - 275px)', height: 550, border: 'solid 1px #d9d9d9',background:'#fff'}}>
                <div style={{
                  lineHeight: '40px',
                  color: '#3f89e1',
                  background:'#eff3fb',
                  textAlign: 'center',
                  paddingLeft: 6,
                }}><FormattedMessage {...basicMessages.userDetail} /></div>
                <div style={{width: 500, margin: '0 auto'}}>

                  <Form style={{textAlign: '-webkit-auto', marginTop: 50}}>

                    <FormItem
                      label={formatMessage(messages.displayName)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('userName', {
                          rules: [{
                            required: true, message: formatMessage(messages.displayNameInput),
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                          initialValue:departDefaultValue&&departDefaultValue.userName
                        })(
                          <Input disabled={userType} placeholder={formatMessage(messages.displayNameInput)}/>
                        )
                      }
                    </FormItem>
                    <FormItem
                      label={formatMessage(messages.userLoginName)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('loginName', {
                          rules: [{
                            required: true, message: formatMessage(messages.userLoginNameInput)
                          },{
                            max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                          }],
                          initialValue:departDefaultValue&&departDefaultValue.loginName
                        })(
                          <Input disabled={userType} placeholder={formatMessage(messages.userLoginNameInput)}/>
                        )
                      }
                    </FormItem>
                    {
                      this.state.addType===1?
                        <FormItem
                          label={formatMessage(basicMessages.passwordTitle)}
                          {...formItemLayout}
                        >
                          {
                            getFieldDecorator('password', {
                              rules: [{
                                required: true, message: formatMessage(basicMessages.passwordInput),
                              },{
                                max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                              }]
                            })(
                              <Input disabled={userType} placeholder={formatMessage(basicMessages.passwordInput)}/>
                            )
                          }
                        </FormItem>
:null
                    }

                    <FormItem
                      label={formatMessage(messages.departRoles)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('roleIds', {
                          rules: [{
                            required: true, message: formatMessage(messages.departRolesSelect),
                          }],
                        })(
                          <div onClick={!userType?this.changeUserModalVisible:null} className={styles.ele_input_addStype}>
                            {roleValue&&roleValue?roleValue.map((item,index)=>{
                              return(
                                <div className={styles.ele_input_style} key={index}>
                                  <span>{item.name}</span>
                                  <Icon onClick={(e) => {
                                    e.stopPropagation();
                                    this.delRoleValues(item)
                                  }} style={{lineHeight: '28px'}} type="close"/>
                                </div>)
                            }):null}
                            <Icon className={styles.down_icon} type="down"/>
                          </div>
                        )
                      }
                    </FormItem>

                    <FormItem
                      label={formatMessage(basicMessages.telephone)}
                      {...formItemLayout}
                    >
                      {
                        getFieldDecorator('telephone', {
                          rules: [
                            {
                              pattern:/^1[34578]\d{9}$/,message: formatMessage(basicMessages.correctPhone),
                            }
                          ],
                          initialValue:departDefaultValue&&departDefaultValue.telephone
                        })(
                          <Input disabled={userType} placeholder={formatMessage(basicMessages.telephoneInput)}/>
                        )
                      }
                    </FormItem>
                  </Form>
                </div>


                <div className='TxTCenter' style={{width: 500, margin: '60px auto'}}>
                  <Button disabled={userType} type='primary' onClick={(e) => {
                    this.handleSubmit(e);
                  }}><FormattedMessage {...basicMessages.confirm} /></Button>
                  <Button disabled={departDefaultValue&&departDefaultValue.pid==='0'||userType} className='mrgLf20'
                          onClick={() => {
                            this.props.dispatch({
                              type:'organization/fetch_delOrganzationUserTreeNode_action',
                              payload:{id:departDefaultValue.id},
                              callback: (res) => {
                                if (res.status === 0) {
                                  const params = {id:departDefaultValue.pid};
                                  this.loadTreeInfoSource(params);
                                }
                              }
                            })
                          }}
                  ><FormattedMessage {...basicMessages.delete} /></Button>
                </div>
              </div>:null
          }

          <ChangePasswordModal
            handleSubmit={(value)=>{
              this.props.dispatch({
                type:'global/fetch_changePassword_action',
                payload:value,
                callback:()=>{
                  this.changePasswordVisible();
                }
              })
            }}
            userInfo={userInfo}
            visible={passwordVisible}
            onCancelModal={this.changePasswordVisible}
          />

          <UserListModal
            modalVisible={modalUserVisible}
            onCancelModal={this.changeUserModalVisible}
            handleRoleSubmit={(value) => {
              this.setState({
                roleValue: value
              });
              let roleIds = value.map(o=>{
                return o.id
              });
              this.props.form.setFieldsValue({roleIds:roleIds})
            }}
          />
        </div>
    );
  }
}
