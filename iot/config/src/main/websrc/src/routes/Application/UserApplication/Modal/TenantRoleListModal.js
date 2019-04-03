import {Button, Radio, Form, List, Modal,Input} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";
const Search = Input.Search;

@injectIntl
@Form.create()
@connect(({application, loading}) => ({
  application,
  loading: loading.effects['application/fetch_getMenuApi_action'],

}))
export default class TenantRoleListModal extends Component {
  constructor(){
    super();
    this.state={
      checkedApiValues:[],
      defaultCheckedApiValue:[],
    }
  }

  componentDidMount(){
    const {application:{modal_tenantRole_params,modal_tenantRole_list},roleCheckedValue} = this.props;
    const isSearch = false;
    if(modal_tenantRole_list.length===0){
      this.loadModalTenantList(modal_tenantRole_params,isSearch);
    }
    this.setState({
      checkedApiValues:roleCheckedValue
    })
  };

  loadModalTenantList=(params,isSearch)=>{
    this.props.dispatch({
      type:'application/fetch_tenantRole_list_action',
      payload:params,
      callBack:(res)=>{

      },
      isSearch:isSearch,

    })
  };

  handleInfiniteOnLoad=()=>{
    const {application:{modal_tenantRole_params}} = this.props;
    const isSearch = false;
    const start = modal_tenantRole_params.start+10;
    const params = {
      ...modal_tenantRole_params,
      start:start,
    };
    this.loadModalTenantList(params,isSearch);
  };


  handleSearch=(value)=>{
    const {application:{modal_tenantRole_params}} = this.props;
    const isSearch = true;
    let params ={
      ...modal_tenantRole_params,
      start:0,
      name:value,
    }
    this.loadModalTenantList(params,isSearch);
  }


  //多选
  checkApiValue = (e) => {
    this.setState({
      checkedApiValues: JSON.parse(e.target.value)
    })
  };


  render(){
    const {application:{modal_tenantRole_list,tenantRoleHasMore},loading,tenantRoleModalVisible,onCancelModal,handTenantValue,roleCheckedValue } = this.props;
    const {intl:{formatMessage}} = this.props;

    return(
      <Modal
        visible={tenantRoleModalVisible}
        title={formatMessage(basicMessages.selectRoles)}
        className='dealModal_styles'
        destroyOnClose={true}
        width={400}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handTenantValue&&handTenantValue(this.state.checkedApiValues?this.state.checkedApiValues:roleCheckedValue);
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
          <Radio.Group
            value={JSON.stringify(this.state.checkedApiValues?this.state.checkedApiValues:roleCheckedValue)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkApiValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && tenantRoleHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={modal_tenantRole_list}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify({name:item.name,id:item.id})}>{item.name}
                        </Radio>
                      </div>
                    </List.Item>
                  )}
                >
                </List>
              </InfiniteScroll>
            </div>
          </Radio.Group>
        </div>
      </Modal>
    )
  }
}
