import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import UserApplicationList from "./UserApplicationList";
import UserApplicationAdd from "./UserApplicationAdd";
import UserApplicationEdit from "./UserApplicationEdit";
import UserApplicationItem from "./UserApplicationItem";
import OrganizationForm from "./OrganizationForm";

export default class ListIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/application/userApplication' component={UserApplicationList} exact/>
        <Route path='/application/userApplication/add' component={UserApplicationAdd}/>
        <Route path='/application/userApplication/edit/:data' component={UserApplicationEdit}/>
        <Route path='/application/userApplication/item/:data' component={UserApplicationItem}/>
        <Route path='/application/userApplication/item/:data/organization/:id' component={OrganizationForm}/>
      </Switch>
    )
  }
}
