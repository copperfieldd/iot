import {Button, Checkbox, Form, List, Modal,Input,Radio} from "antd";
import styles from "../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from "../../../messages/common/basicTitle";
import {injectIntl} from "react-intl";

const Search = Input.Search;
@Form.create()
@connect(({permissions, loading}) => ({
  permissions,
  loading: loading.effects['permissions/fetch_permissions_role_list_action'],
}))
@injectIntl

export default class RoleRadioModal extends Component {
  constructor(){
    super();
    this.state={
      checkedRoleValues:[],
    }
  }

  componentDidMount(){
    const {permissions:{permissions_role_params,permissions_role_list}} = this.props;
    const isSearch = false;
    if(permissions_role_list.length===0){
      this.loadPermissionsRoles(permissions_role_params,isSearch);
    };
  };

  loadPermissionsRoles=(params,isSearch)=>{
    this.props.dispatch({
      type:'permissions/fetch_permissions_role_list_action',
      payload:params,
      isSearch:isSearch,
      callBack:(value)=>{
      }
    })
  };

  handleInfiniteOnLoad=()=>{
    const {permissions:{permissions_role_params}} = this.props;
    const isSearch = false;
    const start = permissions_role_params.start+10;
    const params = {
      ...permissions_role_params,
      start:start,
    };
    this.loadPermissionsRoles(params,isSearch);
  }



  //多选
  checkRoleValue = (e) => {
    this.setState({
      checkedRoleValues: JSON.parse(e.target.value)
    })
  };
  render(){
    const {permissions:{permissions_role_list,permissionsRoleHasMore},loading } = this.props;
    const {modalVisible,onCancelModal,handleRoleSubmit} = this.props;
    const {intl:{formatMessage}} = this.props;

    return(
      <Modal
        visible={modalVisible}
        title={formatMessage(basicMessages.selectRoles)}
        //destroyOnClose={true}
        width={400}
        className='dealModal_styles'
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleRoleSubmit&&handleRoleSubmit(this.state.checkedRoleValues)
              onCancelModal&&onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder={formatMessage(basicMessages.keyWord)}
            //onSearch={this.handleSearchGateway}
          />
          <Radio.Group
            value={JSON.stringify(this.state.checkedRoleValues)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkRoleValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && permissionsRoleHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={permissions_role_list}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify(item)}>{item.name}
                          {/*<span style={{marginLeft: 36}}>{item.logicalUnitName}</span>*/}
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
