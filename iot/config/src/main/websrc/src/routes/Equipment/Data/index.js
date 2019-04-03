import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import DataManage from "./DataManage";
import DataManageItem from "./DataManageItem";
import DataManageEdit from "./DataManageEdit";

export default class FunctionIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/dataManage' component={DataManage} exact/>
        <Route path='/equipment/dataManage/item/:data' component={DataManageItem}/>
        {/*<Route path='/equipment/dataManage/edit/:data' component={DataManageEdit}/>*/}
      </Switch>
    )
  }
}
