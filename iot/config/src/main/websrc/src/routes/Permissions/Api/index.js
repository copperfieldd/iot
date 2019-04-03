import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Tree, List,message} from 'antd';
import styles from '../Permissions.less';
import { Route, Switch, Redirect } from 'react-router-dom'
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {count, getLoginUserInfo, getLoginUserType, getRoutes, isInArray} from '../../../utils/utils';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;


const Search = Input.Search;


@connect(({permissionsMenu,customer,permissionsApi, loading,global}) => ({
  global,
  customer,
  permissionsApi,
  loading: loading.effects['permissionsMenu/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class MenuManage extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      expandedKeys: [],
      queryVisible:false,
      pathname:null,
      newButtonStatus:true,
      client: {
        X: 0,
        Y: 0,
      },
      dataSource: [],
    }
  };



  componentDidMount() {
    document.addEventListener("click", this.close);
    this.props.dispatch({
      type:'customer/fetch_getCustomerTree_action',
      payload:{type:1}
    })

    this.props.dispatch({
      type:'permissionsApi/change_api_params',
      payload:null,
    })
  }


  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
  };


  rightClick = ({event, node}) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    const userType = getLoginUserType();
    const userInfo = getLoginUserInfo();
    const type = parseInt(node.props.dataRef.type);
    const tenantId = node.props.dataRef.id;
    if(userType===1){
      dataSource = [];
    };
    let dataSource;
    if (tenantId === userInfo&&userType!==1) {
      dataSource = [formatMessage(messages.newApi)];
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
  }


  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }


  renderTreeNodes = (data) => {
    const {global:{local}} = this.props;
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<i
            className={item.type === 1 ? styles.icon_company : styles.icon_user}></i>}
                    title={local==='en'&&item.englishName?item.englishName:item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local==='en'&&item.englishName?item.englishName:item.name} key={item.id} icon={<i
        className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };


  //获取API列表
  loadApiList = (params,type) => {
    this.props.dispatch({
      type: 'permissionsApi/fetch_apiList_action',
      payload: params,
    })
  };


  onSelect=(selectedKeys,e)=>{
    const node = e.selectedNodes;
    const userType = getLoginUserType()===1?true:false;
    const {match:{params:{id}}} = this.props;
    let params;
    const {permissionsApi: {api_params}} = this.props;
    if(node.length>0&&node[0].props.dataRef.type===1||node.length>0&&node[0].props.dataRef.type===2){
      params = {
        ...api_params,
        serviceId:selectedKeys[0],
        appId:undefined,
        start:0,
        tenantId:undefined,
      };
    }else if(node.length>0&&node[0].props.dataRef.type===4){
      params = {
        ...api_params,
        serviceId:undefined,
        appId:selectedKeys[0],
        start:0,
        tenantId:undefined,
      };
    }else{
      params = {
        ...api_params,
        serviceId:undefined,
        appId:undefined,
        start:0,
        tenantId:selectedKeys[0]
      };
    }

    if(selectedKeys.length!==0) {
      this.setState({
        newButtonStatus:false
      });
      this.props.dispatch(routerRedux.push(`/permissions/apiManage/list/api/${selectedKeys}`));
      this.loadApiList(params,node[0].props.dataRef.type);
    }else{
      this.setState({
        newButtonStatus:true
      });
      return;
    }
  };


  handelVisible=()=>{

    this.setState({
      queryVisible:!this.state.queryVisible,
    })
  };


  //查询条件提交
  handleOk = (e) => {
    const {permissionsApi:{api_params},intl:{formatMessage}} = this.props;
    if(!api_params.serviceId&&!api_params.appId&&!api_params.tenantId){
      message.error(formatMessage(messages.tenantSelect));
      return;
    }
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const values = {
          ...api_params,
          start: 0,
          filter:{
            name:fieldsValue.name,
            type:fieldsValue.type,
            dataUrl:fieldsValue.dataUrl,
            creatorName:fieldsValue.creatorName,
            createTime:{
              startTime: fieldsValue.startTime && fieldsValue.startTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
              endTime: fieldsValue.endTime && fieldsValue.endTime.format('YYYY/MM/DD HH:mm:ss') || undefined,
            }
          },
        };
        console.log(values)
        this.loadApiList(values);
      }
    })
  };

  //重置查询表单
  handleReset = () => {
    const {permissionsApi:{api_params},intl:{formatMessage}} = this.props;
    if(!api_params.serviceId&&!api_params.appId&&!api_params.tenantId){
      message.error(formatMessage(messages.tenantSelect));
      return;
    }
    this.props.form.resetFields();
    const values = {
      serviceId:api_params.serviceId,
      appId:api_params.appId,
      tenantId:api_params.tenantId,
      start: 0,
      count: count
    };
    this.loadApiList(values);
  };

  handleClick = (item) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    if (item === formatMessage(messages.newApi)) {
      this.props.dispatch(routerRedux.push(`/permissions/apiManageAdd`));
    } else{
      return;
    }
  };


  render() {

    const {expandedKeys,visible,queryVisible,client: {X, Y},dataSource} = this.state;
    const userType = getLoginUserType()===1?true:false;
    const {loading,match,routerData,customer:{tenantTree},permissionsApi:{api_params},intl:{formatMessage}} = this.props;

    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 17},
      },
    };

    const locale={
      emptyText:formatMessage(basicMessages.no_authority),
    };
    const queryForm = (
      <Form>
        <FormItem
          {...formItemLayout}
          label={formatMessage(messages.interface)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('name', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:api_params.name
          })
          (
            <Input placeholder={formatMessage(messages.inputApiName)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.type)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('type', {
            initialValue:api_params.type
          })
          (
            <Select placeholder={formatMessage(messages.permission_api_select_interface)}>
              <Option value={0}>{formatMessage(basicMessages.private)}</Option>
              <Option value={1}>{formatMessage(basicMessages.public)}</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.address)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('dataUrl', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:api_params.address
          })
          (
            <Input placeholder={formatMessage(messages.inputApiAddress)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={<FormattedMessage {...basicMessages.creator} />}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('creatorName', {
            rule:[{
              max:512,message:formatMessage(basicMessages.cannot_more_than_512)
            }],
            initialValue:api_params.creatorName
          })
          (
            <Input placeholder={formatMessage(basicMessages.creatorInput)} style={{width: '100%'}}/>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.startTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('startTime', {
            initialValue: api_params.startTime && moment(api_params.startTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectStartTime)} style={{width: '100%'}}/>
          )}
        </FormItem>


        <FormItem
          {...formItemLayout}
          label={formatMessage(basicMessages.endTime)}
          style={{marginBottom: 8}}
        >
          {getFieldDecorator('endTime', {
            initialValue: api_params.endTime && moment(api_params.endTime) || undefined
          })
          (
            <DatePicker format="YYYY/MM/DD HH:mm:ss" showTime placeholder={formatMessage(basicMessages.selectEndTime)} style={{width: '100%'}}/>
          )}
        </FormItem>
      </Form>
    )


    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            {/*<Button disabled={userType} type='primary' icon='plus'  onClick={() => {*/}
              {/*this.props.dispatch(routerRedux.push(`/permissions/apiManageAdd`))*/}
            {/*}}>{formatMessage(messages.newApi)}</Button>*/}
            <div></div>
            <span className='search' onClick={() => {
              this.setState({
                queryVisible: true,
              })
            }}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>
          </div>
          <Query
            visible={queryVisible}
            handelCancel={this.handelVisible}
            handleOk={this.handleOk}
            handleReset={this.handleReset}
          >
            {queryForm}
          </Query>
          <div className='dlxB'>
            <div className={styles.tree_box} style={{width:300,border:'solid 1px #d9d9d9',background:'#eff3fb',height:600,padding:'0 1px'}}>
              <div style={{lineHeight:'40px',textAlign:'center',color:'#3f89e1',}}>{formatMessage(basicMessages.tenantList)}</div>
              <div style={{background: '#fff'}}>
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
                        locale={locale}
                        dataSource={dataSource}
                        renderItem={item => (<List.Item>
                          <div style={{margin:'0 auto'}} onClick={() => this.handleClick(item)}>{item}</div>
                        </List.Item>)}
                      />
                    </div>
                  }

                  <Tree
                    showIcon
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    onSelect={this.onSelect}
                    onRightClick={this.rightClick}
                  >
                    {this.renderTreeNodes(tenantTree)}
                  </Tree>
                </div>

              </div>
            </div>

            <div className={styles.form_box}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ))
                }
                <Route render={()=>{return <div style={{minHeight:600}}></div>}} />
              </Switch>
            </div>

          </div>


        </Card>
      </PageHeaderLayout>
    );
  }
}
