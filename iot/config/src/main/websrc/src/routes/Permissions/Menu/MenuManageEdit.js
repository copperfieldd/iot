import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Table,
  Button,
  Icon,
  Form,
  Input,
  Card,
  TreeSelect,
  Modal
} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import ApiList from "../../../components/ApiListRadioModal";
import { getLoginUserType } from '../../../utils/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const {TextArea} = Input;

@connect(({permissions,permissionsMenu,loading,global}) => ({
  global,
  permissions,
  permissionsMenu,
  loading: loading.effects['permissionsMenu/fetch_updMenu_action'],
}))
@injectIntl
@Form.create()
export default class MenuManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      apiModalVisible:false,
      checkedApiValues:{},
    }
  };

  componentWillReceiveProps(nextProps){
    const { match:{params:{data}}} = nextProps;
    if(data!==this.props.match.params.data){
      this.props.form.resetFields();
    }
  }

  handleSubmit = (e) => {
    const { form,permissionsMenu: {menuList_params} } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type:'permissionsMenu/fetch_updMenu_action',
          payload:values,
          params:menuList_params
        })
      }
    });
  };

  openApiModal=()=>{
    const {history,loading,match:{params:{data}},permissionsMenu:{menuItems,menuList,userTypeItem},intl:{formatMessage}} = this.props;
    const userType = getLoginUserType();
    const disabledType = userType===0&&userTypeItem===1?false:userType===3&&userTypeItem===4?false:true;
    if (!disabledType) {
      this.setState({
        apiModalVisible:!this.state.apiModalVisible
      })
    }

  };

  onChange = (value) => {
    this.setState({ value });
  }
  renderTreeNodes = (data) => {
    const {global:{local}} = this.props;

    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            //icon={<i className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                    title={local==='en'&&item.englishName?item.englishName:item.name} key={item.id} value={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local==='en'&&item.englishName?item.englishName:item.name} key={item.id} value={item.id}
                       //icon={<i className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };


  //删除API
  delMenu = (id) => {
    const {permissionsMenu: {menuList_params},intl:{formatMessage}} = this.props;
    const params = {
      id: id,
    };
    Modal.confirm({
      title: formatMessage(basicMessages.notice),
      content: formatMessage(basicMessages.sureToDelete),
      okText: formatMessage(basicMessages.confirm),
      cancelText: formatMessage(basicMessages.cancel),
      onOk: () => {
        this.props.dispatch({
          type: 'permissionsMenu/fetch_delMenuList_action',
          payload: params,
          params: menuList_params,
        })
      }
    });

  };


  render() {
    const {history,loading,match:{params:{data}},permissionsMenu:{menuItems,menuList,userTypeItem},intl:{formatMessage}} = this.props;
    const userType = getLoginUserType();
    const disabledType = userType===0&&userTypeItem===1?false:userType===3&&userTypeItem===4?false:true
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
          style={{height:600}}
        >
          <div style={{lineHeight:'40px',textAlign:'center',color:'#3f89e1',background:'#eff3fb',}}>{formatMessage(messages.menuDetails)}</div>
          <div className='mrgTB30' style={{width: 600}}>
            <Form key={data}>
              <FormItem
                key={data+'1'}
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
                      disabled={disabledType}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder={formatMessage(messages.selectParent)}
                      treeDefaultExpandAll
                      onChange={this.onChange}
                    >
                      {this.renderTreeNodes(menuList&&menuList)}
                    </TreeSelect>
                  )
                }
              </FormItem>
              <FormItem
                key={data+'2'}
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
                    <Input disabled={disabledType} placeholder={formatMessage(messages.inputMenuName)}/>
                  )
                }
              </FormItem>

              <FormItem
                key={data+'3'}
                label={formatMessage(basicMessages.englishName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('englishName', {
                    rule:[{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue:menuItem&&menuItem.englishName
                  })(
                    <Input disabled={disabledType} placeholder={formatMessage(messages.inputMenuName)}/>
                  )
                }
              </FormItem>


              <FormItem
                key={data+'4'}
                label={formatMessage(messages.menuTag)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('tag', {
                    rules: [{
                      required: true, message: formatMessage(messages.inputMenuTag),
                    },{
                      max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: menuItem&&menuItem.tag
                  })(
                    <Input disabled={disabledType} placeholder={formatMessage(messages.inputMenuTag)}/>
                  )
                }
              </FormItem>

              <FormItem
                key={data+'5'}
                label={formatMessage(messages.menuId)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('id', {
                    initialValue:menuItem&&menuItem.id
                  })(
                    <span>{menuItem&&menuItem.id}</span>
                  )
                }
              </FormItem>

              <FormItem
                key={data+'6'}
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
                    <TextArea disabled={disabledType} placeholder={formatMessage(basicMessages.describeInput)} rows={4}/>
                  )
                }
              </FormItem>

              <FormItem
                key={data+'7'}
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
                        this.state.checkedApiValues||menuItem?<div>
                          <span style={{maxWidth:240,display:'inline-block',marginLeft:8}}>{this.state.checkedApiValues.name?this.state.checkedApiValues.name:menuItem&&menuItem.apiName}</span>

                          <span style={{marginLeft:8}}>{this.state.checkedApiValues.dataUrl?this.state.checkedApiValues.dataUrl:menuItem&&menuItem.url}</span>

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
          <Button type='primary' disabled={disabledType} loading={loading} onClick={(e) => {
            this.handleSubmit(e);
          }}>{formatMessage(basicMessages.confirm)}</Button>
          <Button disabled={disabledType} className='mrgLf20'
                  onClick={() => {
                    this.delMenu(menuItem.id);
                  }}
          >{formatMessage(basicMessages.delete)}</Button>
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
