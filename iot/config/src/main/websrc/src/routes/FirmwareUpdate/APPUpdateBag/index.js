import React, { PureComponent, Fragment } from 'react';
import { Route, Switch } from 'dva/router';
import APPUpdateBagList from "./APPUpdateBagList";
import UploadUpdateBag from "./UploadUpdateBag";
import UpdUpdateBag from "./UpdUpdateBag";

export default class APPUpdateIndex extends PureComponent {
  render(){
    return(
      <Switch>
        <Route path='/firmwareUpdate/appUpdateBag' component={APPUpdateBagList} exact/>
        <Route path='/firmwareUpdate/appUpdateBag/upload' component={UploadUpdateBag}/>
        <Route path='/firmwareUpdate/appUpdateBag/update/:date' component={UpdUpdateBag}/>
      </Switch>
    )
  }
}
