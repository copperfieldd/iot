import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import CountriesInfo from "./CountriesInfo";
import CountriesInfoAdd from "./CountriesInfoAdd";
import CountriesInfoEdit from "./CountriesInfoEdit";

export default class CountryIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/position/countriesInfo' component={CountriesInfo} exact/>
        <Route path='/position/countriesInfo/add' component={CountriesInfoAdd}/>
        <Route path='/position/countriesInfo/edit/:data' component={CountriesInfoEdit}/>
      </Switch>
    )
  }
}
