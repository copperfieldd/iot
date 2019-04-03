import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import ConfigManage from "./ConfigManage";
import ConfigManageAdd from "./ConfigManageAdd";
import ConfigManageEdit from "./ConfigManageEdit";

export default class ManageIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/platformOperation/configManage' component={ConfigManage} exact/>
        <Route path='/platformOperation/configManage/add' component={ConfigManageAdd}/>
        <Route path='/platformOperation/configManage/edit/:data' component={ConfigManageEdit}/>
      </Switch>
    )
  }
}
