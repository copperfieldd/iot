import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import TenantType from "./TenantType";
import TenantTypeAdd from "./TenantTypeAdd";
import TenantTypeEdit from "./TenantTypeEdit";
import TenantTypeItem from "./TenantTypeItem";

export default class TenantTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/customer/tenantType' component={TenantType} exact/>
        <Route path='/customer/tenantType/add' component={TenantTypeAdd}/>
        <Route path='/customer/tenantType/edit/:data' component={TenantTypeEdit}/>
        <Route path='/customer/tenantType/item/:data' component={TenantTypeItem}/>
      </Switch>
    )
  }
}
