import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import ApplicationList from "./ApplicationList";
import AddApplication from "./AddApplication";
import EditApplication from "./EditApplication";

export default class ListIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/payManage/applicationList' component={ApplicationList} exact/>
        <Route path='/payManage/applicationList/add' component={AddApplication}/>
        <Route path='/payManage/applicationList/edit/:data' component={EditApplication}/>
      </Switch>
    )
  }
}
