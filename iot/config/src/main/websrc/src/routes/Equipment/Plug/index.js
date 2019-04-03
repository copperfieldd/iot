import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import PlugManage from "./PlugManage";
import PlugManageAdd from "./PlugManageAdd";
import PlugManageEdit from "./PlugManageEdit";

export default class PlugIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/plugManage' component={PlugManage} exact/>
        <Route path='/equipment/plugManage/add' component={PlugManageAdd}/>
        <Route path='/equipment/plugManage/edit/:data' component={PlugManageEdit}/>
      </Switch>
    )
  }
}
