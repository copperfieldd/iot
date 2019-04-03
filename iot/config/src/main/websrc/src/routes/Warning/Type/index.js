import React,{PureComponent} from 'react';
import {Route,Switch} from 'dva/router';
import WarningType from './WarningType';
import WarningTypeAdd from './WarningTypeAdd';
import WarningTypeEdit from './WarningTypeEdit';

export default class TypeIndex extends PureComponent{
  render(){
    return(
      <Switch>
        <Route path='/warning/warningType' component={WarningType} exact/>
        <Route path='/warning/warningType/add' component={WarningTypeAdd}/>
        <Route path='/warning/warningType/edit/:data' component={WarningTypeEdit}/>
      </Switch>
    );
  }
}
