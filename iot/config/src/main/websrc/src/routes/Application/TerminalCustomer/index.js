import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import TerminalList from "./TerminalList";
import TerminalAdd from "./TerminalAdd";
import TerminalEdit from "./TerminalEdit";
import TerminalItem from "./TerminalItem";

export default class ListIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/application/terminalCustomer' component={TerminalList} exact/>
        <Route path='/application/terminalCustomer/add' component={TerminalAdd}/>
        <Route path='/application/terminalCustomer/edit/:data' component={TerminalEdit}/>
        <Route path='/application/terminalCustomer/item/:data' component={TerminalItem}/>
      </Switch>
    )
  }
}
