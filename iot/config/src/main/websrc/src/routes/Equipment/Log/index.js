import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import LogManage from "./LogManage";
//import RoleManageAdd from "./RoleManageAdd";
//import RoleManageEdit from "./RoleManageEdit";

export default class LogIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/logManage' component={LogManage} exact/>
        {/*<Route path='/permissions/roleManage/add' component={RoleManageAdd}/>*/}
        {/*<Route path='/permissions/roleManage/edit/:data' component={RoleManageEdit}/>*/}
      </Switch>
    )
  }
}
