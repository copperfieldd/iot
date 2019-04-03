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
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';

const TreeNode = Tree.TreeNode;


const Search = Input.Search;


@connect(({permissionsMenu,customer, loading,global}) => ({
  global,
  customer,
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
      pathname:null,
      newButtonStatus:true,
    }
  };


  componentDidMount() {

    this.props.dispatch({
      type:'customer/fetch_getCustomerTree_action',
      payload:{type:2}
    })
  }


  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
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
                    title={local==='en'&&item.englishName?item.englishName:item.name} value={item.id} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local==='en'&&item.englishName?item.englishName:item.name} key={item.id} value={item.id} icon={<i
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
    const {match:{params:{id}}} = this.props;
    let params;
    const node = e.selectedNodes;
    if(node.length>0&&node[0].props.dataRef.type===4){
      params = {
        id:selectedKeys[0],
      };
      this.props.dispatch(routerRedux.push(`/permissions/menuManage/menu/${selectedKeys}`))
      this.props.dispatch({
        type:'permissionsMenu/fetch_getAppMenu_action',
        payload:params,
      })
      this.props.dispatch({
        type:'permissionsMenu/userTypeItem',
        payload:node[0].props.dataRef.type,
      })
    }else if(node.length>0&&node[0].props.dataRef.type===1){
      this.props.dispatch(routerRedux.push(`/permissions/menuManage/menu/${selectedKeys}`))
      this.props.dispatch({
        type:'permissionsMenu/fetch_getPlatMenu_action',
        payload:null
      })
      this.props.dispatch({
        type:'permissionsMenu/userTypeItem',
        payload:node[0].props.dataRef.type,
      })
    }else if(node.length>0&&node[0].props.dataRef.type===3){
      params = {
        id:selectedKeys[0],
      };
      this.props.dispatch(routerRedux.push(`/permissions/menuManage/menu/${selectedKeys}`))
      this.props.dispatch({
        type:'permissionsMenu/fetch_getTenantMenu_action',
        payload:params
      })
      this.props.dispatch({
        type:'permissionsMenu/userTypeItem',
        payload:node[0].props.dataRef.type,
      })
    }
  }


  render() {

    const {expandedKeys,queryVisible} = this.state;

    const {loading,match,routerData,customer:{tenantTree},intl:{formatMessage}} = this.props;
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
            <div></div>
            {/*<span className='search' onClick={() => {*/}
              {/*this.setState({*/}
                {/*queryVisible: true,*/}
              {/*})*/}
            {/*}}><Icon className='query_icon' type="search"/>{formatMessage(basicMessages.filter)}</span>*/}
          </div>
          {/*<Query*/}
            {/*visible={queryVisible}*/}
            {/*handelCancel={this.handelVisible}*/}
            {/*handleOk={this.handleOk}*/}
            {/*//handleReset={this.handleReset}*/}
          {/*>*/}
            {/*/!*{queryForm}*!/*/}
          {/*</Query>*/}
          <div className='dlxB'>
            <div className={styles.tree_box} style={{width:300,border:'solid 1px #d9d9d9',background:'#eff3fb',height:700,padding:'0 1px'}}>
              <div style={{lineHeight:'40px',textAlign:'center',color:'#3f89e1',}}>{formatMessage(basicMessages.tenantList)}</div>
              <div style={{background: '#fff'}}>

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
                <Route render={()=>{return <div style={{minHeight:700}}></div>}} />
              </Switch>
            </div>

          </div>


        </Card>
      </PageHeaderLayout>
    );
  }
}
