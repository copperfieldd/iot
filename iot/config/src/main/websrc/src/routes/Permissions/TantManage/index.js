import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import TenantManage from "./TenantManage";
import TenantManageAdd from "./TenantManageAdd";
import TenantManageEdit from "./TenantManageEdit";

export default class TantManageIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/permissions/tenantManage' component={TenantManage} exact/>
        <Route path='/permissions/tenantManage/add' component={TenantManageAdd}/>
        <Route path='/permissions/tenantManage/edit/:id' component={TenantManageEdit}/>
        {/*<Route path='/asset/inbound/history' component={HistoryList}/>*/}
      </Switch>
    )
  }
}
