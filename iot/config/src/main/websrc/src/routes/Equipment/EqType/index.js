import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import EquipmentType from "./EquipmentType";
import EquipmentTypeAdd from "./EquipmentTypeAdd";
import EquipmentTypeEdit from "./EquipmentTypeEdit";
import EquipmentTypeItem from "./EquipmentTypeItem";

export default class EqTypeIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/equipmentType' component={EquipmentType} exact/>
        <Route path='/equipment/equipmentType/add' component={EquipmentTypeAdd}/>
        <Route path='/equipment/equipmentType/edit/:data' component={EquipmentTypeEdit}/>
        <Route path='/equipment/equipmentType/item/:data' component={EquipmentTypeItem}/>
      </Switch>
    )
  }
}
