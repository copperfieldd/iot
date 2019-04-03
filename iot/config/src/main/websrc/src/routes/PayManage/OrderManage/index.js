import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import OrderList from "./OrderList";
import OrderListItem from "./OrderListItem";

export default class ListIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/payManage/orderManage' component={OrderList} exact/>
        <Route path='/payManage/orderManage/item/:data' component={OrderListItem}/>
      </Switch>
    )
  }
}
