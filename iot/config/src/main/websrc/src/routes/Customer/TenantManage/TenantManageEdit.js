import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Form, Input,Select, Card,} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import GradeListModal from './Modal/GradeListModal';
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

@injectIntl
@connect(({tenantManage, loading}) => ({
  tenantManage,
  loading: loading.effects['tenantManage/fetch_editTenant_action'],
}))
@Form.create()
export default class TenantManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      see: false,
      modalVisible: false,
      modalUserVisible: false,
      gradeCheckedValue: null,
      roleCheckedValue: null,
    }
  };

  componentDidMount(){
    const {match: {params: {data}}} = this.props;
    const tenantManageItem = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type:'tenantManage/fetch_tenantItem_action',
      payload:{id:tenantManageItem.id},
      callback:(res)=>{
        let role = res.role&&res.role.length>0?res.role.map(o=>{
          return o
        }):[];
        let roleId = res.role&&res.role.length>0?res.role.map(o=>{
          return o.id
        }):[];

        this.setState({
          roleCheckedValue:role[0],
          defaultValue:res,
        });

        this.props.form.setFieldsValue({gradeId:res.gradeId});
        this.props.form.setFieldsValue({roleId:roleId[0]});

      }
    })
  }

  handleSubmit = (e) => {
    const { match: {params: {data}}} = this.props;
    const tenantManageItem = JSON.parse(decodeURIComponent(data));
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const value = {
          ...this.state.defaultValue,
          ...values,
          id:tenantManageItem.id,
        };
        this.props.dispatch({
          type: 'tenantManage/fetch_editTenant_action',
          payload: value,
        })
      }
    });
  };

  changeSee = () => {
    this.setState({
      see: !this.state.see
    })
  };

  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  };

  changeUserModalVisible = () => {
    this.setState({
      modalUserVisible: !this.state.modalUserVisible,
    })
  };


  render() {
    const {loading, match: {params: {data}},tenantManage:{tenantItems},intl:{formatMessage}} = this.props;
    const tenantManageItem = JSON.parse(decodeURIComponent(data));
    const item = tenantItems[tenantManageItem.id];
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
    const {getFieldDecorator} = this.props.form;
    const { modalVisible, gradeCheckedValue} = this.state;
    const defaultGradeValue = {id:item&&item.gradeId,name:item&&item.gradeName};


    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <p className='TxTCenter'><FormattedMessage {...messages.tenantInformation} /></p>
                <FormItem
                  label={<FormattedMessage {...messages.tenantName} />}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: formatMessage(messages.tenantAddNameInput),
                      },{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: item && item.name
                    })(
                      <Input placeholder={formatMessage(messages.tenantAddNameInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={<FormattedMessage {...messages.category} />}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('gradeId', {
                      rules: [{
                        required: true, message: formatMessage(messages.tenantAddCategoryInput),
                      }],
                      //initialValue: details&&details.name
                    })(
                      <div onClick={this.changeModalVisible} className={styles.ele_input_addStype}
                           style={{height: 35}}>

                        <div style={{padding: '0 8px', height: 35, lineHeight: '35px'}}>
                          <span>{gradeCheckedValue && gradeCheckedValue.name?gradeCheckedValue.name:item&&item.gradeName}</span>
                        </div>

                        <Icon className={styles.down_icon} type="down"/>
                      </div>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.abbreviation)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('tag', {
                      rule:[{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: item && item.tag
                    })(
                      <Input placeholder={formatMessage(messages.tenantAddAbbreviation)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.tenantDescribe)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('remarks', {
                      rules: [{
                        max: 64,message: formatMessage(basicMessages.moreThan64)
                      }],
                      initialValue: item && item.remarks
                    })(
                      <TextArea rows={4} placeholder={formatMessage(messages.tenantDescribeInput)}/>
                    )
                  }
                </FormItem>

                <FormItem
                  label={formatMessage(messages.tenantEnabled)}
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('valid', {
                      rule:[{
                        max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: item&&item.valid
                    })(
                      <Select>
                        <Option value={true}>{formatMessage(basicMessages.yes)}</Option>
                        <Option value={false}>{formatMessage(basicMessages.no)}</Option>
                      </Select>
                    )
                  }
                </FormItem>

                <p className='TxTCenter'>{formatMessage(basicMessages.administrator)}</p>


                <FormItem
                  label={formatMessage(basicMessages.account)}
                  {...formItemLayout}
                >
                  {
                    <div>{item&&item.user&&item.user.userName}</div>
                  }
                </FormItem>

              </Form>

            </div>
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      this.props.dispatch(routerRedux.push(`/customer/tenantManage`))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>

        <GradeListModal
          defaultValue={defaultGradeValue}
          modalVisible={modalVisible}
          onCancelModal={this.changeModalVisible}
          handleCheckValue={(value) => {
            this.setState({
              gradeCheckedValue: value
            });
            this.props.form.setFieldsValue({gradeId: value.id})
          }}
        />
      </PageHeaderLayout>
    );
  }
}
