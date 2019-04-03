import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import MessageService from "./MessageService";
import MessageTemplateAdd from "./MessageTemplateAdd";
import MessageTemplateEdit from "./MessageTemplateEdit";

export default class TemplateIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/beingPushed/msgService' component={MessageService} exact/>
        <Route path='/beingPushed/messageTemplate/add' component={MessageTemplateAdd}/>
        <Route path='/beingPushed/messageTemplate/edit/:data' component={MessageTemplateEdit}/>
      </Switch>
    )
  }
}
