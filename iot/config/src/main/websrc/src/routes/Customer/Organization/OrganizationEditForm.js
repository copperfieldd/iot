import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, Select, Card, Radio,} from 'antd';
import styles from '../Customer.less';
import UserList from '../../../components/UserListModal';

const FormItem = Form.Item;

@connect(({organization, loading}) => ({
  organization,
  loading: loading.models.permissions,
}))
@Form.create()
export default class OrganizationEditForm extends Component {
  constructor() {
    super();
    this.state = {
      roleModalVisible: false,
      checkedRoleValues: [],
    }
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type: 'organization/fetch_getDepartItem_action',
      payload: {id: item.id}
    })
  }

  handleSubmit = (e) => {
    const {history, match: {params: {data}}} = this.props;
    let item = JSON.parse(decodeURIComponent(data));
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let value = {
        id: item.id,
        ...values
      }
      if (!err) {
        this.props.dispatch({
          type: 'organization/fetch_updDepart_action',
          payload: value
        })
      }
    });
  };


  openRoleModal = () => {
    this.setState({
      roleModalVisible: !this.state.roleModalVisible
    })
  };


  handleRoleSubmit = (values) => {
  };

  delRoleValues = (node) => {
    let delValue = this.state.checkedRoleList.filter(item => {
      if (item.id !== node.id) {
        return item;
      }
    });
    let roleIds = delValue.map(c => {
      return c.id;
    });
    this.props.form.setFieldsValue({roleIds: roleIds})
    this.setState({
      roleValue: delValue
    })
  };


  render() {
    const {history, match: {params: {data}}} = this.props;
    const {roleModalVisible, checkedRoleList} = this.state;
    let item = JSON.parse(decodeURIComponent(data));

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
    const {getFieldDecorator} = this.props.form;
    return (
      <div style={{border: 'solid 1px #d9d9d9',}}>
        <div style={{lineHeight: '40px', background: '#eff3fb', color: '#3f89e1', paddingLeft: 8}}>用户详情</div>

        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 500}}>
            {
              item.type ?
                <Form>
                  <FormItem
                    label="用户中文名"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('userName', {
                        rules: [{
                          required: true, message: '请输入用户中文名!',
                        }],
                        initialValue: item && item.userName
                      })(
                        <Input placeholder='请输入用户中文名'/>
                      )
                    }
                  </FormItem>

                  <FormItem
                    label="登录名"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('loginName', {
                        rules: [{
                          required: true, message: '请输入用户登录名!',
                        }],
                      })(
                        <Input placeholder='请输入用户登录名'/>
                      )
                    }
                  </FormItem>

                  <FormItem
                    label="密码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('password', {
                        rules: [{
                          required: true, message: '请输入密码!',
                        }],
                      })(
                        <Input placeholder='请输入密码'/>
                      )
                    }
                  </FormItem>

                  <FormItem
                    label="角色关联"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('address', {
                        rules: [{
                          required: true, message: '请选择关联角色!',
                        }],
                      })(
                        <div onClick={this.openRoleModal} className={styles.ele_input_addStype}>
                          {checkedRoleList && checkedRoleList ? checkedRoleList.map((item, index) => {
                            return (
                              <div className={styles.ele_input_style} key={index}>
                                <span>{item.name}</span>
                                <Icon onClick={(e) => {
                                  e.stopPropagation();
                                  this.delRoleValues(item)
                                }} style={{lineHeight: '28px'}} type="close"/>
                              </div>
                            )
                          }) : null}

                          <Icon className={styles.down_icon} type="down"/>
                        </div>
                      )
                    }
                  </FormItem>

                  <FormItem
                    label="手机号码"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('telephone', {
                        rules: [{
                          required: true, message: '请输入手机号!',
                        }],
                        //initialValue: details&&details.telephone
                      })(
                        <Input placeholder='请输入手机号码'/>
                      )
                    }
                  </FormItem>
                </Form> :
                <Form>
                  <FormItem
                    label="用户中文名"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('name', {
                        rules: [{
                          required: true, message: '请输入用户中文名!',
                        }],
                        initialValue: item && item.name
                      })(
                        <Input placeholder='请输入用户中文名'/>
                      )
                    }
                  </FormItem>

                  <FormItem
                    label="角色关联"
                    {...formItemLayout}
                  >
                    {
                      getFieldDecorator('roleIds', {
                        rules: [{
                          required: true, message: '请选择关联角色!',
                        }],
                      })(
                        <div onClick={this.openRoleModal} className={styles.ele_input_addStype}>
                          {checkedRoleList && checkedRoleList ? checkedRoleList.map((item, index) => {
                            return (
                              <div className={styles.ele_input_style} key={index}>
                                <span>{item.name}</span>
                                <Icon onClick={(e) => {
                                  e.stopPropagation()
                                  this.delRoleValues(item)
                                }} style={{lineHeight: '28px'}} type="close"/>
                              </div>
                            )
                          }) : null}

                          <Icon className={styles.down_icon} type="down"/>
                        </div>
                      )
                    }
                  </FormItem>

                </Form>
            }

            <div className='TxTCenter'>
              <Button type='primary' onClick={(e) => {
                this.handleSubmit(e);
              }}>保存</Button>
              <Button className='mrgLf20'
                      onClick={() => {
                        history.goBack(-1);
                      }}
              >删除</Button>
            </div>
          </div>

          <UserList
            modalVisible={roleModalVisible}
            onCancelModal={this.openRoleModal}
            handleRoleSubmit={(values) => {
              this.setState({
                checkedRoleList: values
              });
              let roleIds = values.map(item => {
                return item.id;
              });
              this.props.form.setFieldsValue({roleIds: roleIds})
            }}
          />
        </Card>
      </div>
    );
  }
}
