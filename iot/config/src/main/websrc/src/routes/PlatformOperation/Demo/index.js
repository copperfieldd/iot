import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import DemoManage from "./DemoManage";
import DemoManageAdd from "./DemoManageAdd";
import DemoManageEdit from "./DemoManageEdit";

export default class DemoIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/platformOperation/demoManage' component={DemoManage} exact/>
        <Route path='/platformOperation/demoManage/add' component={DemoManageAdd}/>
        <Route path='/platformOperation/demoManage/edit/:data' component={DemoManageEdit}/>
      </Switch>
    )
  }
}
