import {Button, Checkbox, Form, List, Modal,Input} from "antd";
import styles from "../../routes/Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {selectData} from "../../utils/utils";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../messages/customer';
import basicMessages from '../../messages/common/basicTitle';
import Ellipsis from "../Ellipsis";

const Search = Input.Search;

@injectIntl
@Form.create()
@connect(({permissions, loading}) => ({
  permissions,
  loading: loading.effects['permissions/fetch_getModalApiList_list_action'],

}))
export default class ApiList extends Component {
  constructor(){
    super();
    this.state={
      checkAll:false,
      checkedApiValues:[],
      dealCheckedValues:null,
      searchValue:null,
      indeterminate: false,
    }
  }

  componentDidMount(){
    const {permissions:{modal_api_list}} = this.props;
    if(modal_api_list&&modal_api_list.length===0){
      this.loadModalApiList();
    }
  };

  loadModalApiList=(params)=>{
    this.props.dispatch({
      type:'permissions/fetch_getAPIandMenu_action',
      payload:params,
    })
  };


  //多选
  checkApiValue = (checkedValues,searchList) => {
    const checkedApiValues = checkedValues.map(e =>JSON.parse(e));
    this.setState({
      checkedApiValues: checkedApiValues,
      indeterminate: !!checkedValues.length && (checkedValues.length < searchList.length),
    });
    this.dealCheckedValue(checkedApiValues);
  };

  dealCheckedValue=(checkedApiValues)=>{
    const dealCheckedValues = checkedApiValues.map(e=>{
      return JSON.stringify(e)
    });

    this.setState({
      dealCheckedValues:dealCheckedValues
    })
  };

  handleSearch=(value)=>{
    const {permissions:{modal_api_list}} = this.props;
    let searchList = selectData(modal_api_list,value);
    this.setState({
      searchValue:value,
      indeterminate:false,
      checkAll: this.state.checkAll,
      checkedApiValues: this.state.checkAll?searchList:[],
    });
    this.dealCheckedValue(this.state.checkAll?searchList:[])
  };

  onCheckAllChange = (e,searchList) => {
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
      checkedApiValues: searchList,
    });
    e.target.checked ? this.dealCheckedValue(searchList) : this.dealCheckedValue([]);
  }


  render(){
    const {permissions:{modal_api_list},loading,apiModalVisible,onCancelModal,handleRoleSubmit,defaultApi,intl:{formatMessage} } = this.props;
    const {dealCheckedValues,searchValue} = this.state;
    let defaultApiValue = defaultApi&&defaultApi.map(o=>{
      return JSON.stringify(o)
    });

    let searchList = selectData(modal_api_list,searchValue);

    return(
      <Modal
        visible={apiModalVisible}
        title={formatMessage(basicMessages.selectApi)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={900}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleRoleSubmit&&handleRoleSubmit(this.state.checkedApiValues);
              onCancelModal&&onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder={formatMessage(basicMessages.keyWord)}
            onSearch={this.handleSearch}
          />
          <Checkbox
            style={{margin:'10px 0'}}
            indeterminate={this.state.indeterminate}
            onChange={(e)=>{this.onCheckAllChange(e,searchList)}}
            checked={this.state.checkAll}
          >
            {formatMessage(basicMessages.totalSelection)}
          </Checkbox>
          <Checkbox.Group
            value={dealCheckedValues?dealCheckedValues:defaultApiValue}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={(e)=>{this.checkApiValue(e,searchList)}}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <List
                bordered
                loading={loading}
                dataSource={searchList}
                renderItem={item => (
                  <List.Item key={item.id}>
                    <div style={{width:'100%',whiteSpace:'nowrap',overflow:'hidden',textAlign:'left'}}>
                      <Checkbox value={JSON.stringify(item)}>
                        <span style={{display:'inline-block',width:150,position:"relative",top:5}}> <Ellipsis tooltip={item.complexName} lines={1}>{item.complexName}</Ellipsis></span>
                        <span style={{display:'inline-block',width:230,position:"relative",top:5}}><Ellipsis tooltip={item.name} lines={1}>{item.name}</Ellipsis></span>
                        <span style={{marginLeft: 25,display:'inline-block',width:300,position:"relative",top:5}}><Ellipsis tooltip={item.dataUrl} lines={1}>{item.dataUrl}</Ellipsis></span>
                      </Checkbox>
                    </div>
                  </List.Item>
                )}
              >
              </List>
            </div>
          </Checkbox.Group>
        </div>

      </Modal>
    )
  }


}
