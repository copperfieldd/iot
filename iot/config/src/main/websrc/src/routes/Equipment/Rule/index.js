import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import RuleManage from "./RuleManage";
import RuleManageAdd from "./RuleManageAdd";
import RuleManageEdit from "./RuleManageEdit";
import RuleManageItem from './RuleManageItem';

export default class RuleIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/ruleManage' component={RuleManage} exact/>
        <Route path='/equipment/ruleManage/add' component={RuleManageAdd}/>
        <Route path='/equipment/ruleManage/edit/:data' component={RuleManageEdit}/>
        <Route path='/equipment/ruleManage/item/:data' component={RuleManageItem}/>
      </Switch>
    )
  }
}
