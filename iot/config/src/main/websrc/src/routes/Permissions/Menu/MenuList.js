import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Tree, Spin} from 'antd';
import styles from '../Permissions.less';
import {Route, Switch, Redirect} from 'react-router-dom'
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import {getRoutes, isInArray} from '../../../utils/utils';
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/permission';
import basicMessages from '../../../messages/common/basicTitle';
import {getLoginUserType} from '../../../utils/utils';

const TreeNode = Tree.TreeNode;

@connect(({permissionsMenu, permissions, loading, global}) => ({
  global,
  permissions,
  permissionsMenu,
  loading: loading.effects['permissionsMenu/fetch_getTenantMenu_action'],
}))
@injectIntl
@Form.create()
export default class MenuList extends Component {
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
      queryVisible: false,
      pathname: null,
      loading:false,
    }
  };



  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  renderTreeNodes = (data) => {
    const {global: {local}} = this.props;
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<i
            className={item.type === 1 ? styles.icon_company : styles.icon_user}></i>}
                    title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id}
                    dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id} icon={<i
        className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };


  handleClick = () => {
    if (getLoginUserType() === 1) {
      return;
    }
    const {match: {params: {id}}} = this.props;
    this.props.dispatch(routerRedux.push(`/permissions/menuManage/menu/${id}/add`))
  }


  onSelect = (selectedKeys) => {
    const {match: {params: {id}}} = this.props;
    if (selectedKeys.length !== 0) {
      this.props.dispatch(routerRedux.push(`/permissions/menuManage/menu/${id}/edit/${selectedKeys}`));
      this.props.dispatch({
        type: 'permissionsMenu/fetch_menuItem_action',
        payload: {id: selectedKeys[0]}
      })
    } else {
      return;
    }
  };

  render() {
    const {expandedKeys, visible, client: {X, Y}} = this.state;
    const {match, routerData, permissionsMenu: {menuList,userTypeItem}, intl: {formatMessage}, match: {params: {id}}} = this.props;
    let userMenu = menuList && menuList.length > 0 ? menuList[0].children : [];
    const userType = getLoginUserType();
    return (
      <div>
        <Card
          bodyStyle={{padding: '0px'}}
          bordered={false}
        >

          <div className='dlxB'>
            <div className={styles.tree_box} style={{
              width: 350,
              border: 'solid 1px #d9d9d9',
              background: '#eff3fb',
              height: 700,
              position: 'relative',
              padding: '0 1px'
            }}>
              <div style={{lineHeight: '40px', textAlign: 'center', color: '#3f89e1'}}>
                <span>{formatMessage(basicMessages.menuList)}</span>
                <a style={{color: '#666', position: 'absolute', right: 5, cursor: 'pointer', fontSize: 12}}
                   onClick={this.handleClick}
                >{userType===0&&id==='0'?formatMessage(messages.addNewMenu):userType===3&&id!=='0'&&userTypeItem===4?formatMessage(messages.addNewMenu):null}</a>
              </div>

              <div style={{background: '#fff'}}>
                  <Tree
                    showIcon
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    onSelect={this.onSelect}
                    loadData={this.onLoadData}
                    onRightClick={this.rightClick}
                  >
                    {this.renderTreeNodes(userMenu)}
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
                <Route render={() => {
                  return <div style={{minHeight: 700}}></div>
                }}/>
              </Switch>
            </div>

          </div>


        </Card>
      </div>
    );
  }
}
