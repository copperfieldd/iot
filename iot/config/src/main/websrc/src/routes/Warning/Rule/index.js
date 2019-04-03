import React,{PureComponent} from 'react';
import {Route,Switch} from 'dva/router';
import WarningRule from './WarningRule';
import WarningRuleAdd from './WarningRuleAdd';
import WarningRuleEdit from './WarningRuleEdit';
import WarningRuleItem from './WarningRuleItem';

export default class RuleIndex extends PureComponent{
  render(){
    return(
      <Switch>
        <Route path='/warning/warningRule' component={WarningRule} exact/>
        <Route path='/warning/warningRule/add' component={WarningRuleAdd}/>
        <Route path='/warning/warningRule/edit/:data' component={WarningRuleEdit}/>
        <Route path='/warning/warningRule/item/:data' component={WarningRuleItem}/>
      </Switch>
    );
  }
}
