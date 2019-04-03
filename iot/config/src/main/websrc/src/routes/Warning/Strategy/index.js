import React,{PureComponent} from 'react';
import {Route,Switch} from 'dva/router';
import InformStrategy from './InformStrategy';
import InformStrategyAdd from './InformStrategyAdd';
import InformStrategyEdit from './InformStrategyEdit';

export default class StrategyIndex extends PureComponent{
  render(){
    return(
      <Switch>
        <Route path='/warning/informStrategy' component={InformStrategy} exact/>
        <Route path='/warning/informStrategy/add' component={InformStrategyAdd} exact/>
        <Route path='/warning/informStrategy/edit/:data' component={InformStrategyEdit} exact/>
      </Switch>
    );
  }
}
