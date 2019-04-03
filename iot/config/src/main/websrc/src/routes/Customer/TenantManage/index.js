import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import TenantManage from "./TenantManage";
import TenantManageAdd from "./TenantManageAdd";
import TenantManageEdit from "./TenantManageEdit";
import TenantManageItem from "./TenantManageItem";

export default class TenantTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/customer/tenantManage' component={TenantManage} exact/>
        <Route path='/customer/tenantManage/add' component={TenantManageAdd}/>
        <Route path='/customer/tenantManage/edit/:data' component={TenantManageEdit}/>
        <Route path='/customer/tenantManage/item/:data' component={TenantManageItem}/>
      </Switch>
    )
  }
}
