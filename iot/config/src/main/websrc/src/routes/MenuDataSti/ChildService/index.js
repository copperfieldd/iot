import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import ChildService from "./ChildService";
import ChildServiceAdd from "./ChildServiceAdd";
import ChildServiceEdit from "./ChildServiceEdit";
//import TenantTypeItem from "./TenantTypeItem";

export default class TenantTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/menuDataSti/childService' component={ChildService} exact/>
        <Route path='/menuDataSti/childService/add' component={ChildServiceAdd}/>
        <Route path='/menuDataSti/childService/edit/:data' component={ChildServiceEdit}/>
        {/*<Route path='/customer/tenantType/item/:data' component={TenantTypeItem}/>*/}
      </Switch>
    )
  }
}
