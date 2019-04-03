import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import IndexPage from "./IndexPage";

export default class HomePageIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/index' component={IndexPage} exact/>
      </Switch>
    )
  }
}
