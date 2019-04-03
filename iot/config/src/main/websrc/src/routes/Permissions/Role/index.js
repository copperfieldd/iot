import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Tree, List} from 'antd';
import styles from '../Permissions.less';
import { Route, Switch, Redirect } from 'react-router-dom'
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {getRoutes,isInArray} from '../../../utils/utils';
import {getLoginUserType,getLoginUserInfo} from "../../../utils/utils";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const TreeNode = Tree.TreeNode;

@connect(({permissionsRole,customer, loading,global}) => ({
  global,
  customer,
  permissionsRole,
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
      client: {
        X: 0,
        Y: 0,
      },
      dataSource: [],
      queryVisible:false,
    }
  };


  componentDidMount() {
    document.addEventListener("click", this.close);
    this.props.dispatch({
      type:'customer/fetch_getCustomerTree_action',
      payload:{type:2}
    })
  };

  rightClick = ({event, node}) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    const userType = getLoginUserType();
    const userInfo = getLoginUserInfo();
    //console.log(userInfo)
    const type = parseInt(node.props.dataRef.type);
    const tenantId = node.props.dataRef.id;
    if(userType===0){
      dataSource = [];
    };
    let dataSource;
    if (tenantId === userInfo&&userType!==0) {
      dataSource = [formatMessage(messages.roleAdd)];
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


  handleClick = (item) => {
    const {intl:{formatMessage},match:{params:{id}} } = this.props;
    if (item === formatMessage(messages.roleAdd)) {
      this.props.dispatch(routerRedux.push(`/permissions/adds`));
    } else{
      return;
    }
  };


  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
  };


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




  handelVisible=()=>{
    this.setState({
      queryVisible:!this.state.queryVisible,
    })
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }



  onSelect=(selectedKeys,e)=>{
    const node = e.selectedNodes;
    const userType = getLoginUserType()===3?true:false;
    const {match:{params:{id}},permissionsRole:{role_params}} = this.props;
    const nodeTypeId = {
      nodeId:selectedKeys[0],
      nodeType:node.length>0&&node[0].props.dataRef.type
    }
    if(node.length>0&&node[0].props.dataRef.type===4){
      this.props.dispatch(routerRedux.push(`/permissions/roleManage/${encodeURIComponent(JSON.stringify(nodeTypeId))}`))
      this.props.dispatch({
        type:'permissionsRole/fetch_getAppRoleList_action',
        payload:{start:0,count:10,appId:selectedKeys[0]}
      })
    }else if(node.length>0&&node[0].props.dataRef.type===1){
      this.props.dispatch(routerRedux.push(`/permissions/roleManage/${encodeURIComponent(JSON.stringify(nodeTypeId))}`))
      this.props.dispatch({
        type:'permissionsRole/fetch_getRoleList_action',
        payload:{start:0,count:10}
      })
    }else if(node.length>0&&node[0].props.dataRef.type===3&&!userType){
      this.props.dispatch(routerRedux.push(`/permissions/roleManage/${encodeURIComponent(JSON.stringify(nodeTypeId))}`))
      this.props.dispatch({
        type:'permissionsRole/fetch_getRoleList_action',
        payload:{start:0,count:10,tenantId:selectedKeys[0]}
      })
    }else{
      return
    }
  };
  render() {

    const {expandedKeys, visible,client: {X, Y},dataSource} = this.state;

    const {match,routerData,customer:{tenantTree},intl:{formatMessage}} = this.props;

    const locale={
      emptyText:formatMessage(basicMessages.no_authority),
    };
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

          </div>

          {/*<Query*/}
            {/*visible={queryVisible}*/}
            {/*handelCancel={this.handelVisible}*/}
            {/*handleOk={this.handleOk}*/}
            {/*//handleReset={this.handleReset}*/}
          {/*>*/}
            {/*{queryForm}*/}
          {/*</Query>*/}
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
                    loadData={this.onLoadData}
                    onRightClick={this.rightClick}
                  >
                    {this.renderTreeNodes(tenantTree&&tenantTree)}
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
