import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider, Radio,TreeSelect} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import ApiList from "../../../components/ApiListRadioModal";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea} = Input;
const Option = Select.Option;

@connect(({permissions,permissionsMenu,loading}) => ({
  permissions,
  permissionsMenu,
  loading: loading.effects['permissionsMenu/fetch_addMenu_action'],
}))
@injectIntl
@Form.create()
export default class MenuManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      apiModalVisible:false,
      checkedApiValues:null,
    }
  };

  componentWillMount() {
  };

  handleSubmit = (e) => {
    const { form,permissionsMenu: {menuList_params} } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'permissionsMenu/fetch_addMenu_action',
          payload:values,
          params:menuList_params
        })
      }
    });
  };

  openApiModal=()=>{
    this.setState({
      apiModalVisible:!this.state.apiModalVisible
    })
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<i
            className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                    title={item.name} key={item.id} value={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} value={item.id} icon={<i
        className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };

  render() {
    const {history,loading,match:{params:{data}},routerData,permissionsMenu:{menuItems,menuList},intl:{formatMessage}} = this.props;

    const menuItem = menuItems[data];



    const {apiModalVisible} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <Card
          bodyStyle={{padding: '0px'}}
          style={{height:550}}
        >
          <div style={{lineHeight:'40px',textAlign:'center',color:'#3f89e1',background:'#eff3fb',}}>{formatMessage(messages.menuDetails)}</div>
          <div className='mrgTB30' style={{width: 550}}>
            <Form>
              <FormItem
                label={formatMessage(messages.parent)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('pid', {
                    rules: [{
                      required: true, message: formatMessage(messages.selectParent),
                    }],
                    initialValue:menuItem&&menuItem.pid
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder={formatMessage(messages.selectParent)}
                      treeDefaultExpandAll
                    >
                      {this.renderTreeNodes(menuList&&menuList)}
                    </TreeSelect>
                  )
                }
              </FormItem>
              <FormItem
                label={formatMessage(messages.menuName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.inputMenuName),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: menuItem&&menuItem.name
                  })(
                    <Input placeholder={formatMessage(messages.inputMenuName)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(basicMessages.englishName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('englishName', {
                    rule:[{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                  })(
                    <Input placeholder={formatMessage(messages.inputMenuName)}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.menuTag)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('tag', {
                    rules: [{
                      required: true, message:formatMessage(messages.inputMenuTag),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: menuItem&&menuItem.tag
                  })(
                    <Input placeholder={formatMessage(messages.inputMenuTag)}/>
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
                    initialValue:menuItem&&menuItem.remarks
                  })(
                    <TextArea placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                  )
                }
              </FormItem>

              <FormItem
                label={formatMessage(messages.menuApiList)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('apiId', {
                    rules: [{
                      required: true, message: formatMessage(messages.menuApiListSelect),
                    }],
                    initialValue: menuItem&&menuItem.apiId
                  })(
                    <div onClick={this.openApiModal} className={styles.ele_input_addStype} style={{height:32,lineHeight:'32px'}}>
                      {
                        this.state.checkedApiValues?<div style={{marginLeft:6}}>
                          {/*<span>{this.state.checkedApiValues.complexName}</span>*/}
                          <span style={{maxWidth:240,display:'inline-block'}}>{this.state.checkedApiValues.name}</span>
                          <span style={{marginLeft:8}}>{this.state.checkedApiValues.dataUrl}</span>

                        </div>:null
                      }
                      <Icon className={styles.down_icon}  type="down" />
                    </div>
                  )
                }
              </FormItem>
            </Form>

          </div>
        </Card>
        <div className='TxTCenter' style={{marginTop:20}}>
          <Button type='primary' loading={loading} onClick={(e) => {
            this.handleSubmit(e);
          }}>{formatMessage(basicMessages.confirm)}</Button>
          <Button className='mrgLf20'
                  onClick={() => {
                    history.goBack(-1);
                  }}
          >{formatMessage(basicMessages.return)}</Button>
        </div>

        <ApiList
          apiModalVisible={apiModalVisible}
          onCancelModal={this.openApiModal}
          handleRoleSubmit={(values)=>{
            this.setState({
              checkedApiValues:values,
            })
            this.props.form.setFieldsValue({apiId:values.id})
          }}
        />

      </div>
    );
  }
}
