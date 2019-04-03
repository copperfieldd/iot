import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider } from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import GradeListModal from './Modal/GradeListModal';
import UserListModal from '../../../components/UserListModal';


const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

@connect(({permissions,permissionsTenantManage, loading}) => ({
  permissions,
  permissionsTenantManage,
  loading: loading.effects['permissions/fetch_addTenant_action'],
}))
@Form.create()
export default class TenantManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      see:false,
      modalVisible:false,
      modalUserVisible:false,
    }
  };

  componentWillMount() {
  };

  handleSubmit = (e) => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  changeSee=()=>{
    this.setState({
      see:!this.state.see
    })
  };

  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  changeUserModalVisible=()=>{
    this.setState({
      modalUserVisible: !this.state.modalUserVisible,
    })
  };


  render() {
    const { history } = this.props;
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
    const {see,modalVisible,modalUserVisible} = this.state;
    const {loading} = this.props;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >
          <Card
            title={<span style={{color:'#3f89e1'}}>新增租户</span>}
          >
          <div className='mrgTB30' style={{width:500}}>
            <Form>
              <p className='TxTCenter'>租户信息</p>
              <FormItem
                label="租户名称"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入租户名称!',
                    }],
                    //initialValue: details&&details.name
                  })(
                    <Input placeholder='请输入租户名称'/>
                  )
                }
              </FormItem>

              <FormItem
                label="租户等级"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('tenantLevel', {
                    rules: [{
                      required: true, message: '请选择租户等级!',
                    }],
                    //initialValue: details&&details.name
                  })(
                    <div onClick={this.changeModalVisible} className={styles.ele_input_addStype}
                         style={{height: 35}}>

                      <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                        {/*<span>{configManageCheckedValue && configManageCheckedValue.configFile}</span>*/}
                      </div>

                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label="简称"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('sortName', {
                    //initialValue: details&&details.name
                  })(
                    <Input placeholder='请输入简称'/>
                  )
                }
              </FormItem>

              <FormItem
                label="租户描述"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('remarks', {
                    //initialValue: details&&details.name
                  })(
                    <TextArea rows={3} placeholder='请输入租户描述'/>
                  )
                }
              </FormItem>

              <FormItem
                label="是否有效"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('effective', {
                    //initialValue: details&&details.name
                  })(
                    <Select placeholder='请选择是否有效'>
                      <Option value="jack">是</Option>
                      <Option value="lucy">否</Option>
                    </Select>
                  )
                }
              </FormItem>

              <p className='TxTCenter'>管理员</p>
              <FormItem
                label="角色分配"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('manager', {
                    //initialValue: details&&details.name
                  })(
                    <div onClick={this.changeUserModalVisible} className={styles.ele_input_addStype}
                         style={{height: 35}}>

                      <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                        {/*<span>{configManageCheckedValue && configManageCheckedValue.configFile}</span>*/}
                      </div>

                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label="管理员账号"
                {...formItemLayout}
              >
                {
                  <div>admin001</div>
                }
              </FormItem>

              <FormItem
                label="默认密码"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('password', {
                    //initialValue: details&&details.name
                  })(
                    <Input  type={see ? 'text' : 'password'} suffix={<Icon onClick={this.changeSee} style={{cursor:'pointer'}} type="eye-o"/>}/>
                  )
                }
              </FormItem>
            </Form>

          </div>
          </Card>
          <div className='TxTCenter' style={{width:500,margin:'30px auto'}}>
            <Button type='primary' onClick={(e)=>{
              this.handleSubmit(e);
            }}>确定</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >返回</Button>
          </div>
        </Card>

        <GradeListModal
          modalVisible={modalVisible}
          onCancelModal={this.changeModalVisible}
          handleCheckValue={(value) => {
            this.setState({
              configFile: value
            })
          }}
        />

        <UserListModal
          modalVisible={modalUserVisible}
          onCancelModal={this.changeUserModalVisible}
          handleCheckValue={(value) => {
            this.setState({
              configFile: value
            })
          }}
        />

      </PageHeaderLayout>
    );
  }
}
