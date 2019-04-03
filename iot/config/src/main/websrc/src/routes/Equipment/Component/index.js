import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import ComponentManage from "./ComponentManage";
import ComponentManageAdd from "./ComponentManageAdd";
import ComponentManageEdit from "./ComponentManageEdit";

export default class ComponentIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/componentManage' component={ComponentManage} exact/>
        <Route path='/equipment/componentManage/add' component={ComponentManageAdd}/>
        <Route path='/equipment/componentManage/edit/:data' component={ComponentManageEdit}/>
      </Switch>
    )
  }
}
