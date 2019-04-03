import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import MessageTenantList from "./MessageTenantList";
import AddMsgTenant from "./AddMsgTenant";
import EditMsgTenant from "./EditMsgTenant";
import MsgTenantItem from "./MsgTenantItem";

export default class ListIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/beingPushed/msgTenant' component={MessageTenantList} exact/>
        <Route path='/beingPushed/msgTenant/add/:data' component={AddMsgTenant}/>
        <Route path='/beingPushed/msgTenant/edit/:data' component={EditMsgTenant}/>
        <Route path='/beingPushed/msgTenant/item/:data' component={MsgTenantItem}/>
        {/*<Route path='/permissions/roleManage/edit/:data' component={RoleManageEdit}/>*/}
      </Switch>
    )
  }
}
