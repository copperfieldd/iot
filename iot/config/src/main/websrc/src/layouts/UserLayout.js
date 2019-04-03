import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import { getRoutes, getPageQuery, getQueryPath } from '../utils/utils';
import {connect} from "dva";
import {injectIntl} from "react-intl";
import messages from "../messages/common/basicTitle";

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

function getLoginPathWithRedirectPath() {
  const params = getPageQuery();
  const { redirect } = params;
  return getQueryPath('/user/login', {
    // redirect,
  });
}

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location,intl:{formatMessage} } = this.props;
    const { pathname } = location;
    let title = formatMessage(messages.basic);
    // if (routerData[pathname] && routerData[pathname].name) {
    //   title = `${routerData[pathname].name} - 物联网实物资产管理平台`;
    // }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect from="/user" to={getLoginPathWithRedirectPath()} />
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ global = {} }) => ({
  collapsed: global.collapsed,
  menuTree: global.menuTree,
  local:global.local
}))(injectIntl(UserLayout));
