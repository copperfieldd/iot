import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {Layout, Icon, message, Button, Form, Input, Modal} from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import {getRoutes, formatter, menuDataList, menuEngDataList, getLoginUserType} from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/index_icon_ch.png';
import title from '../assets/index_logo.png';
import { injectIntl } from 'react-intl';
import messages from '../messages/common/basicTitle';
import ChangePassword from './Modal/ChangePassword';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

let menu = JSON.parse(sessionStorage.getItem('plat_menu'));

const menuData = formatter(menuDataList(menu));

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};

menuData.forEach(getRedirect);


/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    isMobile,
    visible:false,
  };


  getChildContext() {
    const { location, routerData, menuTree,local, } = this.props;
    const userType = getLoginUserType()
    const menu = local==='cn'?formatter(menuDataList(menuTree,)):formatter(menuEngDataList(menuTree));
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(menu, routerData),
    };
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });
    this.props.dispatch({
      type:'global/fetch_getPlatMenu_action',
      payload:null
    })


  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getPageTitle() {
    const { routerData, location,intl:{formatMessage} } = this.props;
    const { pathname } = location;
    let title = formatMessage(messages.basic);

    //let title = '物联网通用能力平台';
    // let currRouterData = null;
    // // match params path
    // Object.keys(routerData).forEach(key => {
    //   if (pathToRegexp(key).test(pathname)) {
    //     currRouterData = routerData[key];
    //   }
    // });
    // if (currRouterData && currRouterData.name) {
    //   if(typeof currRouterData.name === 'object'){
    //     title = `首页 - 百特云`;
    //   }else{
    //     title = `${currRouterData.name} - 百特云`;
    //   }
    // }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'triggerError') {
      dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'logout') {
      sessionStorage.removeItem('plat_menu');
      dispatch({
        type: 'login/logout',
      });
      dispatch({
        type: 'global/menuTree',
        payload:[],
      });
      dispatch({
        type:'equipmentManage/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentManage/clearCache',
        payload:{},
      });
      dispatch({
        type:'application/clearCache',
        payload:{},
      });
      dispatch({
        type:'beingPushed/clearCache',
        payload:{},
      });
      dispatch({
        type:'customer/clearCache',
        payload:{},
      });
      dispatch({
        type:'dataSti/clearCache',
        payload:{},
      })
      dispatch({
        type:'equipment/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentAdapter/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentData/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentPlugin/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentRule/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentType/clearCache',
        payload:{},
      });
      dispatch({
        type:'equipmentTypeManage/clearCache',
        payload:{},
      });
      dispatch({
        type:'hardwareUpdate/clearCache',
        payload:{},
      });
      dispatch({
        type:'hardwareUpdateBag/clearCache',
        payload:{},
      });
      dispatch({
        type:'msgService/clearCache',
        payload:{},
      });
      dispatch({
        type:'msgTenant/clearCache',
        payload:{},
      });
      dispatch({
        type:'organization/clearCache',
        payload:{},
      });
      dispatch({
        type:'payManage/clearCache',
        payload:{},
      });
      dispatch({
        type:'permissions/clearCache',
        payload:{},
      });
      dispatch({
        type:'permissionsApi/clearCache',
        payload:{},
      });
      dispatch({
        type:'permissionsMenu/clearCache',
        payload:{},
      });
      dispatch({
        type:'permissionsRole/clearCache',
        payload:{},
      });
      dispatch({
        type:'platformOperation/clearCache',
        payload:{},
      });
      dispatch({
        type:'platManage/clearCache',
        payload:{},
      });
      dispatch({
        type:'position/clearCache',
        payload:{},
      });
      dispatch({
        type:'securityAudit/clearCache',
        payload:{},
      });
      dispatch({
        type:'tenantManage/clearCache',
        payload:{},
      });
      dispatch({
        type:'tenantType/clearCache',
        payload:{},
      });
      dispatch({
        type:'warning/clearCache',
        payload:{},
      });
      dispatch({
        type:'warningList/clearCache',
        payload:{},
      });

      dispatch({
        type:'warningRule/clearCache',
        payload:{},
      });
      dispatch({
        type:'warningService/clearCache',
        payload:{},
      });

      dispatch({
        type:'warningStrategy/clearCache',
        payload:{},
      });
      dispatch({
        type:'warningType/clearCache',
        payload:{},
      });
      dispatch({
        type:'appUpdateBag/clearCache',
        payload:{},
      });
    }
    if(key === 'updatePassword'){
      this.changeModalVisible();
    }
  };

  changeModalVisible=()=>{
    this.setState({
      visible:!this.state.visible
    })
  };

  changeLocal = (data) =>{
    const {dispatch} = this.props;
    dispatch({
      type:'global/changeLocale',
      payload:data,
    })
  };
  render() {
    const {
      menuTree,
      collapsed,
      routerData,
      match,
      location,
      local,
    } = this.props;
    const menu = local==='cn'?formatter(menuDataList(menuTree)):formatter(menuEngDataList(menuTree));
    //console.log(menu)

    const { isMobile: mb,visible } = this.state;
    const bashRedirect = this.getBashRedirect();
    menu.forEach(getRedirect);
    const marginLeft = collapsed?80:200;
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          title={title}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // If you do not have the Authorized parameter
          // you will be forced to jump to the 403 interface without permission
          Authorized={Authorized}
          menuData={menu}
          collapsed={collapsed}
          location={location}
          isMobile={this.state.isMobile}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout style={{marginLeft:`${marginLeft}px`,transition:'.2s'}}>
          <Header style={{ padding: 0,position:'fixed',width:`calc(100% - ${marginLeft}px`,zIndex:'99',transition:'.2s'}}>
            <GlobalHeader
              logo={logo}
              collapsed={collapsed}
              isMobile={mb}
              local={local}
              changeLocal={this.changeLocal}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{ margin: '88px 24px 0', height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/exception/403"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>
            {layout}
            <ChangePassword
              visible={visible}
              onCancelModal={this.changeModalVisible}
              handleSubmit={(value)=>{
                this.props.dispatch({
                  type:"global/fetch_changeCurrentPassword_action",
                  payload:value,
                  callback:()=>{
                    this.changeModalVisible();
                  }
                })
              }}
            />
          </div>}
        </ContainerQuery>

      </DocumentTitle>
    );
  }
}

export default connect(({ global = {} }) => ({
  collapsed: global.collapsed,
  menuTree: global.menuTree,
  local:global.local
}))(injectIntl(BasicLayout));
