import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import AuditType from "./AuditType";
import AuditTypeAdd from "./AuditTypeAdd";
import AuditTypeEdit from "./AuditTypeEdit";

export default class AreasIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/securityAudit/auditType' component={AuditType} exact/>
        <Route path='/securityAudit/auditType/add' component={AuditTypeAdd}/>
        <Route path='/securityAudit/auditType/edit/:data' component={AuditTypeEdit}/>
      </Switch>
    )
  }
}
