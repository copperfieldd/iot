import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import ScriptManage from "./ScriptManage";
import ScriptManageAdd from "./ScriptManageAdd";
import ScriptManageEdit from "./ScriptManageEdit";
import ScriptManageItem from "./ScriptManageItem";

export default class TenantTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/menuDataSti/scriptManage' component={ScriptManage} exact/>
        <Route path='/menuDataSti/scriptManage/add' component={ScriptManageAdd}/>
        <Route path='/menuDataSti/scriptManage/edit/:data' component={ScriptManageEdit}/>
        <Route path='/menuDataSti/scriptManage/item/:data' component={ScriptManageItem}/>
      </Switch>
    )
  }
}
