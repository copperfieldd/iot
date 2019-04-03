import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import ServiceDemo from "./ServiceDemo";
import ServiceLife from "./ServiceLife";
import ServiceRAM from "./ServiceRAM";
import ServiceDisk from "./ServiceDisk";


export default class ManageIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/platformOperation/serviceDemo' component={ServiceDemo} exact/>
        <Route path='/platformOperation/serviceDemo/editLife/:data' component={ServiceLife}/>
        <Route path='/platformOperation/serviceDemo/editRAM/:data' component={ServiceRAM}/>
        <Route path='/platformOperation/serviceDemo/editDisk/:data' component={ServiceDisk}/>
      </Switch>
    )
  }
}
