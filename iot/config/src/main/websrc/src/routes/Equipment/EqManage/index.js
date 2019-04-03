import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import EquipmentManage from "./EquipmentManage";
import EquipmentManageAdd from "./EquipmentManageAdd";
import EquipmentManageEdit from "./EquipmentManageEdit";
import EquipmentManageItem from "./EquipmentManageItem";
import EquipmentManageImport from './EquipmentManageImport';
import EquipmentManagePerview from './EquipmentManagePerview';
import EquipmentManageImportItem from './EquipmentManageImportItem';

export default class EqManageIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/equipment/equipmentManage' component={EquipmentManage} exact/>
        <Route path='/equipment/equipmentManage/add' component={EquipmentManageAdd}/>
        <Route path='/equipment/equipmentManage/edit/:data' component={EquipmentManageEdit}/>
        <Route path='/equipment/equipmentManage/item/:data' component={EquipmentManageItem}/>
        <Route path='/equipment/equipmentManage/import' component={EquipmentManageImport}/>
        <Route path='/equipment/equipmentManage/preview/:id' component={EquipmentManagePerview}/>
        <Route path='/equipment/equipmentManage/importItem/:id' component={EquipmentManageImportItem}/>
      </Switch>
    )
  }
}
