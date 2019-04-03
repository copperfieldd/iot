import React, { Component, Fragment } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { LocaleProvider, Spin } from 'antd';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import { addLocaleData, IntlProvider } from 'react-intl';
import i18n from './i18n';
const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
import IntlLayout from './layouts/IntlLayout';
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

@connect(({ global }) => ({
  global,
}))
class RouterData extends Component{


  render(){
    const {history,UserLayout,BasicLayout,global:{local} } = this.props;
    let language;
    if(local !== 'cn' && local !== 'en'){
      language = 'cn';
    }else{
      language = local;
    }
    const appLocale = i18n[language];
    addLocaleData(appLocale.data);
    return(
      <LocaleProvider locale={appLocale.antd}>
        <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
          <ConnectedRouter history={history}>
              <Switch>
                <IntlLayout>
                <Route path="/user" component={UserLayout} />
                <AuthorizedRoute
                  path="/"
                  render={props => <BasicLayout {...props} />}
                  authority='user'
                  redirectPath="/user/login"
                />
                </IntlLayout>
              </Switch>
          </ConnectedRouter>
        </IntlProvider>
      </LocaleProvider>
    )
  }
}
function RouterConfig({history, app}) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <RouterData history = {history} BasicLayout={BasicLayout} UserLayout={UserLayout}/>
  );
}

export default RouterConfig;
