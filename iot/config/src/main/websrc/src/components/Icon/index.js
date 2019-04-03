import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Modal, Input, DatePicker, Select, message, Tooltip} from 'antd';
import * as routerRedux from "react-router-redux";
import styles from './index.less'
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from "../../messages/common/basicTitle";

const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
@Form.create()
export default class Index extends Component {
  constructor() {
    super();
    this.state = {

    }
  };

  componentDidMount(){
  };

  //edit 编辑,changeQuota 改变额度,deleted 删除,download 下载,editPassword 修改密码,enable 启用,item 详情,stop 暂停,auditor 审核,recovery 恢复 onCancel 取消,end 终止 look 查看



  render() {
    const {intl:{formatMessage},edit,changeQuota,deleted,download,editPassword,enable,item,stop,auditor,recovery,onCancel,end,look,disable} = this.props;
    let tips =
      edit? formatMessage(basicMessages.modify):
        deleted?formatMessage(basicMessages.delete):
          item?formatMessage(basicMessages.details):
            stop?formatMessage(basicMessages.suspend):
              recovery?formatMessage(basicMessages.recovery):
                onCancel?formatMessage(basicMessages.cancel):
                  end?formatMessage(basicMessages.end):
                    changeQuota?formatMessage(basicMessages.changeQuota):
                      download?formatMessage(basicMessages.download):
                        editPassword?formatMessage(basicMessages.editPassword):
                          enable?formatMessage(basicMessages.enable):
                            auditor?formatMessage(basicMessages.auditor):
                              formatMessage(basicMessages.see)
    return (
      <Tooltip title={tips}>
        {
          edit?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/edit.png'):require('../../assets/icon/edit1.png')}/>:null
        }
        {
          changeQuota?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/changeQuota.png'):require('../../assets/icon/changeQuota1.png')}/>:null
        }
        {
          deleted?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/delete.png'):require('../../assets/icon/delete1.png')}/>:null
        }
        {
          download?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/download.png'):require('../../assets/icon/download1.png')}/>:null
        }
        {
          editPassword?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/editPassword.png'):require('../../assets/icon/editPassword1.png')}/>:null
        }
        {
          enable?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/enable.png'):require('../../assets/icon/enable1.png')}/>:null
        }
        {
          item?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/item.png'):require('../../assets/icon/item1.png')}/>:null
        }
        {
          stop?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/stop.png'):require('../../assets/icon/stop1.png')}/>:null
        }
        {
          auditor?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/auditor.png'):require('../../assets/icon/auditor1.png')}/>:null
        }
        {
          recovery?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/enable.png'):require('../../assets/icon/enable1.png')}/>:null
        }
        {
          onCancel?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/stop.png'):require('../../assets/icon/stop1.png')}/>:null
        }
        {
          end?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/end.png'):require('../../assets/icon/end1.png')}/>:null
        }
        {
          look?<img style={{width:16,height:16}} src={!disable?require('../../assets/icon/look.png'):require('../../assets/icon/look1.png')}/>:null
        }

      </Tooltip>
    );
  }
}
