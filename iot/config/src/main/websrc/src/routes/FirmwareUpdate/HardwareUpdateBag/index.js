import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import HardwareUpdateBagList from "./HardwareUpdateBagList";
import UpdateSuccess from "./UpdateSuccess";
import UpdateFails from "./UpdateFails";
import UploadUpdateBag from "./UploadUpdateBag";
import UpdUpdateBag from "./UpdUpdateBag";

export default class HardwareBagIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/firmwareUpdate/hardwareUpdateBag' component={HardwareUpdateBagList} exact/>
        <Route path='/firmwareUpdate/hardwareUpdateBag/updateSuccess/:id' component={UpdateSuccess}/>
        <Route path='/firmwareUpdate/hardwareUpdateBag/updateFails/:id' component={UpdateFails}/>
        <Route path='/firmwareUpdate/hardwareUpdateBag/upload' component={UploadUpdateBag}/>
        <Route path='/firmwareUpdate/hardwareUpdateBag/update/:date' component={UpdUpdateBag}/>
      </Switch>
    )
  }
}
