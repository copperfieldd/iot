import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import PlatManage from "./PlatManage";
import PlatManageAdd from "./PlatManageAdd";
import PlatManageEdit from "./PlatManageEdit";

export default class TenantTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/customer/platManager' component={PlatManage} exact/>
        <Route path='/customer/platManager/add' component={PlatManageAdd}/>
        <Route path='/customer/platManager/edit/:data' component={PlatManageEdit}/>
      </Switch>
    )
  }
}
