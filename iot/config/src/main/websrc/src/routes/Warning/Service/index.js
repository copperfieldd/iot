import React,{PureComponent} from 'react';
import {Route,Switch} from 'dva/router';
import ServiceConfig from './ServiceConfig';
import ServiceConfigAdd from './ServiceConfigAdd';
import ServiceConfigEdit from './ServiceConfigEdit';

export default class ServiceIndex extends PureComponent{
  render(){
    return(
      <Switch>
        <Route path='/warning/serviceConfig' component={ServiceConfig} exact/>
        <Route path='/warning/serviceConfig/add' component={ServiceConfigAdd}/>
        <Route path='/warning/serviceConfig/edit/:data' component={ServiceConfigEdit}/>
      </Switch>
    );
  }
}
