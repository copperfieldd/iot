import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Input, InputNumber, DatePicker, Select, Card, Divider, Modal} from 'antd';
import styles from './index.less';
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import Query from "../../components/Query/index";
import * as routerRedux from "react-router-redux";
import { FormattedMessage, injectIntl } from 'react-intl';
import basicMessages from '../../messages/common/basicTitle';
import {formatParams} from "../../utils/utils";
import indexPage from "../../assets/indexPage.png"

const FormItem = Form.Item;

@connect(({position, loading}) => ({
  position,
  loading: loading.effects['position/fetch_countryList_action'],
}))
@injectIntl
@Form.create()
export default class IndexPage extends Component {
  constructor() {
    super();
    this.state = {
      visible:false
    }
  };

  componentDidMount(){
  }





  render() {
    const {loading,intl:{formatMessage}} = this.props;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <div style={{margin:'200px auto 0px',width:650}}>
          <div style={{width:650}}>
            <div style={{display:'flex',alignItems:"center"}}>
              <img style={{width:'300px',height:260}} src={indexPage}/>
              <div style={{textAlign:'center'}}>
              <h1>{formatMessage(basicMessages.welcome)}</h1>
              <h1>{formatMessage(basicMessages.basic)}</h1>
              </div>
            </div>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
