import {Button, Radio, Form, List, Modal,Input} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from "../../../../messages/common/basicTitle";
import {injectIntl} from "react-intl";

const Search = Input.Search;

@Form.create()
@connect(({application, loading}) => ({
  application,
  loading: loading.effects['application/fetch_tenantApp_list_action'],
}))
@injectIntl
export default class TenantAppListModal extends Component {
  constructor(){
    super();
    this.state={
      checkedApiValues:[],
      defaultCheckedApiValue:[],
    }
  }


  loadModalTenantList=(params)=>{
    const isSearch = false;
    this.props.dispatch({
      type:'application/fetch_tenantApp_list_action',
      payload:params,
      callBack:(res)=>{

      },
      isSearch:isSearch,

    })
  };

  handleInfiniteOnLoad=()=>{
    const {application:{modal_tenantApp_params}} = this.props;
    const isSearch = false;
    const start = modal_tenantApp_params.start+10;
    const params = {
      ...modal_tenantApp_params,
      start:start,
    };
    this.loadModalTenantList(params,isSearch);
  };

  //多选
  checkApiValue = (e) => {
    this.setState({
      checkedApiValues: JSON.parse(e.target.value)
    })
  };


  render(){
    const {application:{tenantAppHasMore},loading,tenantAppVisible,onCancelModal,handTenantValue,tenantAppList } = this.props;
    const {intl:{formatMessage}} = this.props;
    return(
      <Modal
        visible={tenantAppVisible}
        title={formatMessage(basicMessages.selectRoles)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={400}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handTenantValue&&handTenantValue(this.state.checkedApiValues);

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
            value={JSON.stringify(this.state.checkedApiValues)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkApiValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && tenantAppHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={tenantAppList}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify(item)}>{item.name}
                          <span style={{marginLeft: 36}}>{item.dataUrl}</span>
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
