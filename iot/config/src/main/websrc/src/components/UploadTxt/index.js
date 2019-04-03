import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card, Modal, Input, DatePicker,Select,message} from 'antd';
import * as routerRedux from "react-router-redux";
import styles from './index.less'
import { FormattedMessage, injectIntl } from 'react-intl';
import { getLoginUserType } from '../../utils/utils';
import $ from 'jquery';
//import UploadTxt from '../../../components/UploadTxt'

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({equipmentAdapter, loading}) => ({
  equipmentAdapter,
  loading: loading.effects['equipmentAdapter/fetch_adapterList_action'],
}))
@injectIntl
@Form.create()
export default class UploadTxt extends Component {
  constructor() {
    super();
    this.state = {
      visible:false,
      fileString:'',
      fileName:'',
    }
  };

  componentDidMount(){
  };


  import=()=>{
    $("#fileId").click();
  };

  importFile=()=> {
    const {handleSubmit} = this.props;

    let fileString;
    let fileName;
    let _this = this;
    let objFile = document.getElementById("fileId");
    if (objFile.value == "") {
      message.error("请选择文件")
      return;
    }
    let files = $('#fileId').prop('files');//获取到文件列表
    fileName = files[0].name
    if (files.length == 0) {
      message.error('请选择文件');
      return;
    } else {
      let reader = new FileReader();//新建一个FileReader
      reader.readAsText(files[0], "UTF-8");//读取文件
      reader.onload = function (evt) { //读取完文件之后会回来这里
        fileString = evt.target.result; // 读取文件内容
        _this.setState({
          fileString:fileString.split('\n'),
          fileName:fileName,
        })
        handleSubmit&&handleSubmit(fileString.split('\n'))
      }
    }
  }


  render() {
    const {fileString,fileName} = this.state;
    const {importWord} = this.props;
    return (


      <div>
        {/*<UploadTxt*/}
          {/*importWord={'批量导入'}*/}
          {/*handleSubmit={(res)=>{*/}
            {/*console.log(res)*/}
          {/*}}*/}
        {/*/>*/}
          <div className={styles.customDiv}>
            <input className={styles.customInput} onChange={this.importFile} type="file" name = "file" id = "fileId" />
            <Button type={'primary'} onClick={this.import}>导入</Button>
            <span style={{marginLeft:8}}>{fileName}</span>
          </div>
      </div>
    );
  }
}
