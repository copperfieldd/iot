import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import TypeManage from "./TypeManage";
import FirstTypeAdd from "./FirstTypeAdd";
import FirstTypeEdit from "./FirstTypeEdit";
import SecondTypeAdd from "./SecondTypeAdd";
import SecondTypeEdit from "./SecondTypeEdit";
import TypeFirstManage from './TypeFirstManage';

export default class AdapterIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/typeManage' component={TypeManage} exact/>
        <Route path='/equipment/TypeFirstManage' component={TypeFirstManage}/>
        <Route path='/equipment/TypeFirstManage/firstAdd' component={FirstTypeAdd}/>
        <Route path='/equipment/typeManage/SecondAdd' component={SecondTypeAdd}/>
        <Route path='/equipment/TypeFirstManage/firstEdit/:data' component={FirstTypeEdit}/>
        <Route path='/equipment/typeManage/SecondEdit/:data' component={SecondTypeEdit}/>
      </Switch>
    )
  }
}
