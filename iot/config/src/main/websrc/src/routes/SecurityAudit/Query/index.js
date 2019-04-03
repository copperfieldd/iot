import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import AuditQuery from "./AuditQuery";
//import RoleManageAdd from "./RoleManageAdd";
//import RoleManageEdit from "./RoleManageEdit";

export default class AreasIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/securityAudit/auditQuery' component={AuditQuery} exact/>
        {/*<Route path='/permissions/roleManage/add' component={RoleManageAdd}/>*/}
        {/*<Route path='/permissions/roleManage/edit/:data' component={RoleManageEdit}/>*/}
      </Switch>
    )
  }
}
