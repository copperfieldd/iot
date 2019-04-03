import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import pathToRegexp from 'path-to-regexp';
import { Breadcrumb, Tabs,Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { urlToList } from '../_utils/pathTools';
import { connect } from "dva";
import TreeSelect from "../TreeSelect";

const { TabPane } = Tabs;
const Search = Input.Search;

export function getBreadcrumb(breadcrumbNameMap, url) {
  let breadcrumb = breadcrumbNameMap[url];
  if (!breadcrumb) {
    Object.keys(breadcrumbNameMap).forEach(item => {
      if (pathToRegexp(item).test(url)) {
        breadcrumb = breadcrumbNameMap[item];
      }
    });
  }
  return breadcrumb || {};
}

class PageHeader extends PureComponent {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };

  state = {
    breadcrumb: null,
  };

  componentDidMount() {
    this.getBreadcrumbDom();
  }

  componentDidUpdate(preProps) {
    const { tabActiveKey } = this.props;
    if (preProps.tabActiveKey !== tabActiveKey) {
      this.getBreadcrumbDom();
    }
  }

  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  handleChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type:'dashboard/change_unit',
      payload:value
    })
  }

  getBreadcrumbProps = () => {
    const { routes, params, location, breadcrumbNameMap } = this.props;
    const {
      routes: croutes,
      params: cparams,
      location: clocation,
      breadcrumbNameMap: cbreadcrumbNameMap,
    } = this.context;
    return {
      routes: routes || croutes,
      params: params || cparams,
      routerLocation: location || clocation,
      breadcrumbNameMap: breadcrumbNameMap || cbreadcrumbNameMap,
    };
  };

  getBreadcrumbDom = () => {
    const breadcrumb = this.conversionBreadcrumbList();
    this.setState({
      breadcrumb,
    });
  };

  // Generated according to props
  conversionFromProps = () => {
    const { breadcrumbList, breadcrumbSeparator, linkElement = 'a' } = this.props;
    return (
      <Breadcrumb className={styles.breadcrumb} separator={breadcrumbSeparator}>
        {breadcrumbList.map(item => (
          <Breadcrumb.Item key={item.title}>
            {item.href
              ? createElement(
                linkElement,
                {
                  [linkElement === 'a' ? 'href' : 'to']: item.href,
                },
                item.title
              )
              : item.title}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    );
  };

  conversionFromLocation = (routerLocation, breadcrumbNameMap) => {
    const { breadcrumbSeparator, linkElement = 'a' } = this.props;
    // Convert the url to an array
    const pathSnippets = urlToList(routerLocation.pathname);
    // Loop data mosaic routing
    const extraBreadcrumbItems = pathSnippets.map((url, index) => {
      const currentBreadcrumb = getBreadcrumb(breadcrumbNameMap, url);
      const isLinkable = index !== pathSnippets.length - 1 && currentBreadcrumb.component;
      return currentBreadcrumb.name && !currentBreadcrumb.hideInBreadcrumb ? (
        <Breadcrumb.Item key={url}>
          {createElement(
            isLinkable ? linkElement : 'span',
            { [linkElement === 'a' ? 'href' : 'to']: url },
            currentBreadcrumb.name
          )}
        </Breadcrumb.Item>
      ) : null;
    });
    return (
      <Breadcrumb className={styles.breadcrumb} separator=">">
        {extraBreadcrumbItems}
      </Breadcrumb>
    );
  };

  /**
   * 将参数转化为面包屑
   * Convert parameters into breadcrumbs
   */
  conversionBreadcrumbList = () => {
    const { breadcrumbList, breadcrumbSeparator } = this.props;
    const { routes, params, routerLocation, breadcrumbNameMap } = this.getBreadcrumbProps();
    if (breadcrumbList && breadcrumbList.length) {
      return this.conversionFromProps();
    }
    // 如果传入 routes 和 params 属性
    // If pass routes and params attributes
    if (routes && params) {
      return (
        <Breadcrumb
          className={styles.breadcrumb}
          routes={routes.filter(route => route.breadcrumbName)}
          params={params}
          itemRender={this.itemRender}
          separator={breadcrumbSeparator}
        />
      );
    }
    // 根据 location 生成 面包屑
    // Generate breadcrumbs based on location
    if (routerLocation && routerLocation.pathname) {
      return this.conversionFromLocation(routerLocation, breadcrumbNameMap);
    }
    return null;
  };

  // 渲染Breadcrumb 子节点
  // Render the Breadcrumb child node
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props;
    const last = routes.indexOf(route) === routes.length - 1;
    return last || !route.component ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      createElement(
        linkElement,
        {
          href: paths.join('/') || '/',
          to: paths.join('/') || '/',
        },
        route.breadcrumbName
      )
    );
  };

  render() {
    const {
      unit,
      unit_tree,
      title,
      collapsed,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      onSearch,
      breadcrumbList
    } = this.props;

    const unitId = unit && unit.value || null;
    const defaultSelected = unitId? unit : (unit_tree[0] && {value:unit_tree[0].key,label:unit_tree[0].title}) || undefined;
    const { breadcrumb } = this.state;
    const clsString = classNames(styles.pageHeader, className);
    const marginLeft = collapsed?80:200;
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }

    const { routerLocation:{ pathname } } = this.getBreadcrumbProps();

    return (
      <div className={clsString} style={{width:`calc(100% - ${marginLeft}px`,transition:'.2s'}}>
        {breadcrumb}
        {/*{*/}
        {/*pathname === "/dashboard" ? <div style={{position:'absolute',top:12,right:24}}>*/}
        {/*当前位置：*/}
        {/*<span style={{ width: 175,display:'inline-block' }} >*/}
        {/*<TreeSelect labelInValue value={defaultSelected} onChange={this.handleChange}/>*/}
        {/*</span>*/}
        {/*</div>:*/}
        {/*pathname.indexOf('/system/organization') !== -1?*/}
        {/*<div style={{position:'absolute',top:12,right:24}}>*/}
        {/*<Search*/}
        {/*placeholder="请输入成员名字"*/}
        {/*onSearch={value=>onSearch&&onSearch(value)}*/}
        {/*style={{ width: 200 }}*/}
        {/*/>*/}
        {/*</div>:null*/}
        {/*}*/}
        <div className={styles.detail}>
          {logo && <div className={styles.logo}>{logo}</div>}
          <div className={styles.main}>
            <div className={styles.row}>
              {title && <h1 className={styles.title}>{title}</h1>}
              {action && <div className={styles.action}>{action}</div>}
            </div>
            <div className={styles.row}>
              {content && <div className={styles.content}>{content}</div>}
              {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
            </div>
          </div>
        </div>
        {tabList &&
        tabList.length && (
          <Tabs
            className={styles.tabs}
            {...activeKeyProps}
            onChange={this.onChange}
            tabBarExtraContent={tabBarExtraContent}
          >
            {tabList.map(item => <TabPane tab={item.tab} key={item.key} />)}
          </Tabs>
        )}
      </div>
    );
  }
}


export default connect(({ global = {}, dashboard }) => ({
  collapsed: global.collapsed,
  unit_tree: global.unit_tree,
  //unit:dashboard.unit
}))(PageHeader);
