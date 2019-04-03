import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Divider, Row, Col, Tabs, Input, List, Tree} from 'antd';
import styles from '../Application.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {Route, Switch} from "react-router-dom";
import {getRoutes, isInArray} from "../../../utils/utils";
import request from "../../../utils/request";
import {stringify} from "qs";
import * as routerRedux from "react-router-redux";
import { getLoginUserType } from '../../../utils/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/application';
import basicMessages from '../../../messages/common/basicTitle';

import AppRoleListModal from '../../../components/AppRoleListModal';
import ChangePasswordModal from "../../../components/ChangePassword";



const FormItem = Form.Item;
const TextArea = Input.TextArea;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;


@connect(({organization, loading}) => ({
  organization,
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class UserApplicationItem extends Component {
  constructor() {
    super();
    this.state = {
      defaultValue: null,
      expandedKeys: [],
      client: {
        X: 0,
        Y: 0,
      },
      dataSource: [],
      showForm: null,
      roleValue:null,
      addType:null,
      departDefaultValue:null,
    }
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    document.addEventListener("click", this.close);
    this.props.dispatch({
      type: "application/fetch_applicationItems_action",
      payload: {id: item.id},
      callback: (res) => {
        this.setState({
          defaultValue: res,
          tenantValue: {id: res.tenantId, name: res.tenantName},
          roleCheckedValue: res.role&&res.role[0],
        });
      }
    });

    this.props.dispatch({
      type: 'organization/fetch_getOrganizationTree_action',
      payload: {appId: item.id}
    })
  }

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,

    })
  };


  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
  }

  // changeExpandedKeys = (e) => {
  //   const {expandedKeys} = this.state;
  //   const {node: {props}} = e;
  //   const {key, isLeaf} = props.dataRef;
  //   if (isInArray(expandedKeys, key)) {
  //     const newKeys = expandedKeys.filter(i => i !== key)
  //     this.setState({expandedKeys: newKeys});
  //   } else {
  //     if (!isLeaf) {
  //       expandedKeys.push(key);
  //       this.setState({expandedKeys});
  //     }
  //   }
  // };

  //
  // onExpand = (onExpandedKeys, e) => {
  //   this.changeExpandedKeys(e);
  // };

  onLoadData = (treeNode) => {
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {dispatch, organization} = this.props;
    //const parentId = treeNode.props.dataRef.key;
    const parentId = treeNode.props.dataRef.id;
    this.setState({
      treeNode: treeNode,
      parentId: parentId,
    });
    let organizationTree = organization.organizationTree;
    const params = {
      id: parentId,
      appId:item.id,
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
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} {...item} dataRef={item}/>;
    });
  };


  rightClick = ({event, node}) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    const userType = getLoginUserType();
    const type = parseInt(node.props.dataRef.type);
    let dataSource;
    if (type === 0&&userType===3) {
      dataSource = [formatMessage(basicMessages.add_department),formatMessage(basicMessages.add_user),];
    } else if (type === 3&&userType!==3) {
      return;
    } else if (type === 1&&userType===3) {
      dataSource = [formatMessage(basicMessages.editPassword)];
    }
    event.persist();
    this.setState({
      client: {
        X: event.pageX - 230,
        Y: event.pageY - 120,
      },
      pid: node.props.dataRef.id,
      name: node.props.dataRef.title,
      visible: true,
      type:node.props.dataRef.userType,
      dataSource: dataSource,
    })
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

  handleClick = (item) => {
    const {intl:{formatMessage} } = this.props;
    if (item === formatMessage(basicMessages.add_department)) {
      this.setState({
        showForm: 0,
        addType: 0,
        departDefaultValue:null,
        roleValue:[],
      })
    } else if (item===formatMessage(basicMessages.add_user)) {
      this.setState({
        showForm: 1,
        addType: 1,
        departDefaultValue:null,
        roleValue:[],
      })
    } else {
      this.changePasswordVisible();
      this.setState({
        userInfo: {userId: this.state.pid, type: this.state.type}
      })
    }
  };


  changePasswordVisible=()=>{
    this.setState({
      passwordVisible:!this.state.passwordVisible,
    })
  };

  handleSubmit = (e) => {
    const {form} = this.props;
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {addType,departDefaultValue} = this.state;
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
            id:{appId:item.id},
            callback:()=>{
              // this.props.dispatch({
              //   type: 'organization/fetch_getOrganizationTree_action',
              //   payload: {appId: item.id}
              // })

            }
          });
        }else if(addType===1){
          this.props.dispatch({
            type: 'organization/fetch_addAppOrganzationUserTreeNode_action',
            payload: {...value,pid:this.state.pid,type:4},
            id:{appId:item.id},
            callback:()=>{
              // this.props.dispatch({
              //   type: 'organization/fetch_getOrganizationTree_action',
              //   payload: {appId: item.id}
              // })
            }

          });
        }else if(addType===2){
          this.props.dispatch({
            type: 'organization/fetch_updOrganizationTree_action',
            payload: {...departDefaultValue,...value},
            id:{appId:item.id},
            callback:()=>{
              // this.props.dispatch({
              //   type: 'organization/fetch_getOrganizationTree_action',
              //   payload: {appId: item.id}
              // })
            }

          });
        }else if(addType===3){
          this.props.dispatch({
            type: 'organization/fetch_updAppOrganzationUserTreeNode_action',
            payload: {...departDefaultValue,...value},
            id:{appId:item.id},
            callback:()=>{
              // this.props.dispatch({
              //   type: 'organization/fetch_getOrganizationTree_action',
              //   payload: {appId: item.id}
              // })
            }
          });
        }

      }
    });
  };

  delRoleValues=(node)=>{
    const userType = getLoginUserType()!==3?true:false;
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

  changeUserModalVisible=()=>{
    this.setState({
      modalUserVisible: !this.state.modalUserVisible,
    })
  };
  render() {
    const {organization: {organizationTree}, history,intl:{formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {expandedKeys,visible, dataSource, client: {X, Y}, defaultValue,modalUserVisible,roleValue,departDefaultValue,passwordVisible,userInfo,addType} = this.state;
    const {match: {params: {data}}} = this.props;
    const appItem = JSON.parse(decodeURIComponent(data));
    const userType = getLoginUserType()!==3?true:false;
    const userEditType = getLoginUserType()===3?true:false;
    const locale={
      emptyText:formatMessage(basicMessages.no_authority),
    };
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
          bodyStyle={{padding: '10px 32px 0'}}
          bordered={false}
        >

          <Tabs defaultActiveKey="1" onChange={this.changeTabs} style={{textAlign: 'center'}}
                className={styles.applicationTabs}>
            <TabPane tab={formatMessage(messages.applicationDetails)} key="1">
              <div style={{width: 600, margin: '0 auto'}}>

                <Form style={{textAlign: '-webkit-auto'}}>
                  <div style={{textAlign: 'center', marginBottom: 16}}>{formatMessage(messages.applicationInfo)}</div>

                  <FormItem
                    label={formatMessage(basicMessages.tenantName)}
                    {...formItemLayout}
                  >
                    <Input disabled value={defaultValue && defaultValue.tenantName}/>
                  </FormItem>
                  <FormItem
                    label={formatMessage(basicMessages.applicationName)}
                    {...formItemLayout}
                  >
                    <Input disabled value={defaultValue && defaultValue.name}/>
                  </FormItem>

                  <FormItem
                    label={formatMessage(messages.applicationID)}
                    {...formItemLayout}
                  >

                    <span>{defaultValue && defaultValue.id}</span>
                  </FormItem>

                  <FormItem
                    label={formatMessage(basicMessages.describe)}
                    {...formItemLayout}
                  >
                    <TextArea disabled rows={4} value={defaultValue && defaultValue.remarks}/>
                  </FormItem>

                  <div style={{textAlign: 'center', marginBottom: 16}}>{formatMessage(basicMessages.administrator)}</div>
                  <FormItem
                    label={formatMessage(basicMessages.departRoles)}
                    {...formItemLayout}
                  >
                    <Input disabled value={defaultValue &&defaultValue.role.length>0&& defaultValue.role[0].name}/>
                  </FormItem>

                  <FormItem
                    label={formatMessage(basicMessages.administrator)}
                    {...formItemLayout}
                  >
                    <Input disabled value={defaultValue && defaultValue.user&&defaultValue.user.userName}/>
                  </FormItem>

                </Form>
              </div>

            </TabPane>

            <TabPane tab={formatMessage(basicMessages.organization)} key="2" style={{textAlign: 'left'}}>

              <div className='dlxB' style={{height: 550}}>
                <div style={{width: 300, border: 'solid 1px #d9d9d9', height: 550, overflow: 'hidden'}}>
                  <div style={{lineHeight: '40px', textAlign: 'center', color: '#3f89e1', background: '#eff3fb'}}>{formatMessage(messages.applicationDetails)}
                  </div>
                  <div className='dlxB' style={{background: '#fff'}}>
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
                            width:100,
                            border: '1px solid rgb(204, 204, 204)'
                          }}>
                          <List
                            size="small"
                            bordered
                            locale={locale}
                            dataSource={dataSource}
                            renderItem={item => (<List.Item>
                              <div style={{margin:'0 auto'}} onClick={() => this.handleClick(item)}>{item}</div>
                            </List.Item>)}
                          />
                        </div>
                      }

                      <Tree
                        //showIcon
                        onSelect={this.onSelect}
                        loadData={this.onLoadData}
                        onRightClick={this.rightClick}
                        //expandedKeys={expandedKeys}
                      >
                        {this.renderTreeNodes(organizationTree)}
                      </Tree>
                    </div>
                  </div>
                </div>

                {
                  this.state.showForm===0?
                    <div style={{width: 'calc(100% - 310px)', height: 550, border: 'solid 1px #d9d9d9',}}>
                      <div style={{
                        lineHeight: '40px',
                        color: '#3f89e1',
                        background: '#eff3fb',
                        textAlign: 'center',
                        paddingLeft: 6
                      }}>{formatMessage(basicMessages.departmentDetail)}</div>
                      <div style={{width: 600, margin: '0 auto'}}>

                        <Form style={{textAlign: '-webkit-auto', marginTop: 50}}>

                          <FormItem
                            label={formatMessage(basicMessages.name)}
                            {...formItemLayout}
                          >
                            {
                              getFieldDecorator('name', {
                                rules: [{
                                  required: true, message: formatMessage(basicMessages.departNameInput),
                                },{
                                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                }],
                                initialValue:departDefaultValue&&departDefaultValue.name
                              })(
                                <Input disabled={userType} placeholder={formatMessage(basicMessages.departNameInput)}/>
                              )
                            }
                          </FormItem>
                          <FormItem
                            label={formatMessage(basicMessages.departRoles)}
                            {...formItemLayout}
                          >
                            {
                              getFieldDecorator('roleIds', {
                                rules: [{
                                  required: true, message: formatMessage(basicMessages.departRolesSelect),
                                }],
                              })(
                                <div onClick={this.changeUserModalVisible} className={styles.ele_input_addStype}>
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
                      <div className='TxTCenter' style={{width: 600, margin: '60px auto'}}>
                        <Button disabled={userType} type='primary' onClick={(e) => {
                          this.handleSubmit(e);
                        }}>{formatMessage(basicMessages.confirm)}</Button>
                        {
                          addType===0?'':
                            <Button
                              disabled={userType}
                              className='mrgLf20'
                              onClick={() => {
                                this.props.dispatch({
                                  type:'organization/fetch_deleteOrganizationTree_action',
                                  payload:{id:departDefaultValue.id},
                                  appId:appItem.id,
                                })
                              }}
                            >{formatMessage(basicMessages.delete)}</Button>
                        }

                      </div>
                    </div>

                    :this.state.showForm===1?

                    <div style={{width: 'calc(100% - 310px)', height: 550, border: 'solid 1px #d9d9d9',}}>
                      <div style={{
                        lineHeight: '40px',
                        color: '#3f89e1',
                        background: '#eff3fb',
                        textAlign: 'center',
                        paddingLeft: 6
                      }}>{formatMessage(basicMessages.userDetail)}</div>
                      <div style={{width: 600, margin: '0 auto'}}>

                        <Form style={{textAlign: '-webkit-auto', marginTop: 50}}>

                          <FormItem
                            label={formatMessage(basicMessages.displayName)}
                            {...formItemLayout}
                          >
                            {
                              getFieldDecorator('userName', {
                                rules: [{
                                  required: true, message: formatMessage(basicMessages.displayNameInput),
                                },{
                                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                }],
                                initialValue:departDefaultValue&&departDefaultValue.userName
                              })(
                                <Input disabled={userType} placeholder={formatMessage(basicMessages.displayNameInput)}/>
                              )
                            }
                          </FormItem>
                          <FormItem
                            label={formatMessage(basicMessages.userLoginName)}
                            {...formItemLayout}
                          >
                            {
                              getFieldDecorator('loginName', {
                                rules: [{
                                  required: true, message: formatMessage(basicMessages.userLoginNameInput),
                                },{
                                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                                }],
                                initialValue:departDefaultValue&&departDefaultValue.loginName
                              })(
                                <Input disabled={userType} placeholder={formatMessage(basicMessages.userLoginNameInput)}/>
                              )
                            }
                          </FormItem>
                          {
                            this.state.addType===1
                              ?
                              <FormItem
                                label={formatMessage(basicMessages.passwordTitle)}
                                {...formItemLayout}
                              >
                                {
                                  getFieldDecorator('password', {
                                    rules: [{
                                      required: true, message: formatMessage(basicMessages.passwordInput),
                                    },{
                                      pattern:/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,30}$/,message: formatMessage(basicMessages.password_input_rule),
                                    }]
                                  })(
                                    <Input disabled={userType} placeholder={formatMessage(basicMessages.passwordInput)}/>
                                  )
                                }
                              </FormItem>:
                              null
                          }
                          <FormItem
                            label={formatMessage(basicMessages.departRoles)}
                            {...formItemLayout}
                          >
                            {
                              getFieldDecorator('roleIds', {
                                rules: [{
                                  required: true, message: formatMessage(basicMessages.departRolesSelect),
                                }],
                              })(
                                <div onClick={this.changeUserModalVisible} className={styles.ele_input_addStype}>
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
                      <div className='TxTCenter' style={{width: 600, margin: '60px auto'}}>
                        <Button disabled={userType} type='primary' onClick={(e) => {
                          this.handleSubmit(e);
                        }}>{formatMessage(basicMessages.confirm)}</Button>
                        {
                          addType===1?'':
                            <Button disabled={userType} className='mrgLf20'
                                    onClick={() => {
                                      this.props.dispatch({
                                        type:'organization/fetch_delOrganzationUserTreeNode_action',
                                        payload:{id:departDefaultValue.id},
                                        appId:appItem.id,
                                      })
                                    }}
                            >{formatMessage(basicMessages.delete)}</Button>
                        }

                      </div>
                    </div>:null
                }

              </div>
            </TabPane>
          </Tabs>

          {
            userEditType?
              <AppRoleListModal
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

              />:null
          }


          <div className='TxTCenter' style={{width: 550, margin: '30px auto'}}>

            <Button className='mrgLf20'
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
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

      </PageHeaderLayout>
    );
  }
}
