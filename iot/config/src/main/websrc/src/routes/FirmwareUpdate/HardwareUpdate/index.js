import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import HardwareUpdateList from "./HardwareUpdateList";
import HardwareUpdateListItemU from "./HardwareUpdateListItemU";
import HardwareUpdateAdd from "./HardwareUpdateAdd";
import HardwareUpdateEdit from "./HardwareUpdateEdit";
import HardwareUpdateItem from "./HardwareUpdateItem";
import UpdateSuccess from "./UpdateSuccess";
import UpdateFails from "./UpdateFails";

export default class HardWareUpdateIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/firmwareUpdate/hardwareUpdate' component={HardwareUpdateList} exact/>
        <Route path='/firmwareUpdate/hardwareUpdate/dutyItemU/:data' component={HardwareUpdateListItemU}/>
        <Route path='/firmwareUpdate/hardwareUpdate/add' component={HardwareUpdateAdd}/>
        <Route path='/firmwareUpdate/hardwareUpdate/edit/:data' component={HardwareUpdateEdit}/>
        <Route path='/firmwareUpdate/hardwareUpdate/item/:data' component={HardwareUpdateItem}/>
        <Route path='/firmwareUpdate/hardwareUpdate/updateSuccess/:id' component={UpdateSuccess}/>
        <Route path='/firmwareUpdate/hardwareUpdate/updateFails/:id' component={UpdateFails}/>
      </Switch>
    )
  }
}
