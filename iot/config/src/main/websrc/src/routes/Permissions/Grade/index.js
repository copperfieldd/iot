import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import TenantGrade from "./TenantGrade";
import TenantGradeAdd from "./TenantGradeAdd";
import TenantGradeEdit from "./TenantGradeEdit";

export default class GradeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/permissions/tenantGrade' component={TenantGrade} exact/>
        <Route path='/permissions/tenantGrade/add' component={TenantGradeAdd}/>
        <Route path='/permissions/tenantGrade/edit/:id' component={TenantGradeEdit}/>
      </Switch>
    )
  }
}
