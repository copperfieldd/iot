import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import DataTable from "./DataTable";
import DataTableAdd from "./DataTableAdd";
import DataTableEdit from "./DataTableEdit";
import DataTableItem from "./DataTableItem";

export default class TenantTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/menuDataSti/dataTable' component={DataTable} exact/>
        <Route path='/menuDataSti/dataTable/add' component={DataTableAdd}/>
        <Route path='/menuDataSti/dataTable/edit/:data' component={DataTableEdit}/>
        <Route path='/menuDataSti/dataTable/item/:data' component={DataTableItem}/>
      </Switch>
    )
  }
}
