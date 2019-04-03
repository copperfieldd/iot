import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import AdapterManage from "./AdapterManage";
import AdapterManageAdd from "./AdapterManageAdd";
import AdapterManageEdit from "./AdapterManageEdit";

export default class AdapterIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/adapterManage' component={AdapterManage} exact/>
        <Route path='/equipment/adapterManage/add' component={AdapterManageAdd}/>
        <Route path='/equipment/adapterManage/edit/:data' component={AdapterManageEdit}/>
      </Switch>
    )
  }
}
