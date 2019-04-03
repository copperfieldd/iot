import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import MessageManage from "./MessageManage";
import MessageTemplateAdd from "./MessageTemplateAdd";
import MessageTemplateEdit from "./MessageTemplateEdit";

export default class TemplateIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/beingPushed/msgManage' component={MessageManage} exact/>
        <Route path='/beingPushed/messageTemplate/add' component={MessageTemplateAdd}/>
        <Route path='/beingPushed/messageTemplate/edit/:data' component={MessageTemplateEdit}/>
      </Switch>
    )
  }
}
