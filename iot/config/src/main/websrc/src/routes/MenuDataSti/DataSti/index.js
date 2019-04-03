import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import Statistics from "./Statistics";

export default class DataStiIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/menuDataSti/dataSti' component={Statistics} exact/>
      </Switch>
    )
  }
}
