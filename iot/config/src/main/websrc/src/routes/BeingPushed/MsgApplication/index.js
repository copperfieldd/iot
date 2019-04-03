import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import MessageApp from "./MessageApp";
import AddMsgApplication from "./AddMsgApplication";
import MessageAppItem from "./MessageAppItem";
import EditMsgApplication from "./EditMsgApplication";

export default class ListIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/beingPushed/msgApplication' component={MessageApp} exact/>
        <Route path='/beingPushed/msgApplication/add/:data' component={AddMsgApplication}/>
        <Route path='/beingPushed/msgApplication/item/:id' component={MessageAppItem}/>
        <Route path='/beingPushed/msgApplication/edit/:data' component={EditMsgApplication}/>
      </Switch>
    )
  }
}
