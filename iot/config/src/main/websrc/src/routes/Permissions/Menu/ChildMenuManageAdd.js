import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider, Radio} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ApiList from "../../../components/ApiListModal";


const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;



@connect(({permissions, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class ChildMenuManageAdd extends Component {
  constructor() {
    super();
    this.state = {
      apiModalVisible:false,
      checkedApiValues:[],
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
  openApiModal=()=>{
    this.setState({
      apiModalVisible:!this.state.apiModalVisible
    })
  };

  render() {
    const { history } = this.props;
    const {apiModalVisible,checkedApiValues} = this.state;

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
    const options = [
      { label: '公开', value: 1 },
      { label: '私有', value: 0 },
    ];
    return (
      <div>
      <Card
        bodyStyle={{padding: '6px 32px'}}
        title={<span style={{color:'#3f89e1'}}>菜单详情</span>}
      >
          <div className='mrgTB30' style={{width:500}}>
            <Form>
              <FormItem
                label="父亲节点"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请选择父亲节点!',
                    }],
                    //initialValue: details&&details.name
                  })(
                    <Input placeholder='请选择父亲节点'/>
                  )
                }
              </FormItem>

              <FormItem
                label="菜单名称"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('type', {
                    //initialValue: details&&details.type
                  })(
                    <Input placeholder='请输入菜单名称'/>
                  )
                }
              </FormItem>



              <FormItem
                label="描述"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('description', {
                    //initialValue: details&&details.description
                  })(
                    <TextArea  placeholder='请输入描述' rows={4} />
                  )
                }
              </FormItem>

              <FormItem
                label="接口列表"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('api', {
                    // rules: [{
                    //   required: true, message: '请输入角色名称!',
                    // }],
                    //initialValue: details&&details.name
                  })(
                    <div onClick={this.openApiModal} className={styles.ele_input_addStype}>
                      {checkedApiValues&&checkedApiValues?checkedApiValues.map((item,index)=>{
                        return(
                          <div className={styles.ele_input_style} key={index}>
                            <span>{item.name}</span>
                            <Icon onClick={(e) => {
                              this.delRoleValues(e, item)
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


        </Card>
        <ApiList
          apiModalVisible={apiModalVisible}
          onCancelModal={this.openApiModal}
          handleRoleSubmit={(values)=>{
            this.setState({
              checkedApiValues:values,
            })
            // this.props.dispatch({
            //   type:'permissions/checkedRoleList',
            //   payload:values,
            // })
          }}
        />

        <div className='TxTCenter' style={{marginTop:20}}>
          <Button type='primary' onClick={(e)=>{
            this.handleSubmit(e);
          }}>保存</Button>
          <Button className='mrgLf20'
                  onClick={()=>{
                    history.goBack(-1);
                  }}
          >删除</Button>
        </div>
      </div>
    );
  }
}
