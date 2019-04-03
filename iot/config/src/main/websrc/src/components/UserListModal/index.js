import {Button, Checkbox, Form, List, Modal,Input} from "antd";
import styles from "../../routes/Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../messages/customer';
import basicMessages from '../../messages/common/basicTitle';

const Search = Input.Search;

@Form.create()
@injectIntl
@connect(({permissions, loading}) => ({
  permissions,
  loading: loading.effects['permissions/fetch_permissions_role_list_action'],
}))
export default class RoleList extends Component {
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
        //console.log(value)
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
  };

  handleSearch=(value)=>{
    const {permissions:{permissions_role_params}} = this.props;
    const isSearch = true;
    const params = {
      ...permissions_role_params,
      start:0,
      name:value,
    };
    this.loadPermissionsRoles(params,isSearch);
  }



  //多选
  checkRoleValue = (checkedValues) => {
    const checkedRoleValues = checkedValues.map(e => JSON.parse(e));
    this.setState({
      checkedRoleValues: checkedRoleValues
    })
  };
  render(){
    const {permissions:{permissions_role_list,permissionsRoleHasMore},loading,intl:{formatMessage}  } = this.props;
    const {modalVisible,onCancelModal,handleRoleSubmit} = this.props;
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
            onSearch={this.handleSearch}
          />
          <Checkbox.Group
            //value={checkedGateway}
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
                        <Checkbox value={JSON.stringify(item)}>{item.name}
                          {/*<span style={{marginLeft: 36}}>{item.logicalUnitName}</span>*/}
                        </Checkbox>
                      </div>
                    </List.Item>
                  )}
                >
                </List>
              </InfiniteScroll>
            </div>
          </Checkbox.Group>
        </div>

      </Modal>
    )
  }


}