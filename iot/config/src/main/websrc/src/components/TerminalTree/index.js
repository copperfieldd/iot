import {Button, Checkbox, Form, List, Modal,Input} from "antd";
import styles from "../../routes/Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from "../../messages/common/basicTitle";
import {injectIntl} from "react-intl";
const Search = Input.Search;


const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

@Form.create()
@injectIntl

@connect(({application, loading}) => ({
  application,
  loading: loading.effects['application/fetch_modal_terminalUserList_params_action'],
}))
export default class RoleList extends Component {
  constructor(){
    super();
    this.state={
      checkedRoleValues:[],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    }
  }

  componentDidMount(){
    const {application:{modal_terminalUserList_params,modal_terminalUserList_list}} = this.props;
    const isSearch = false;
    if(modal_terminalUserList_list.length===0){
      this.loadTerminalCustomer(modal_terminalUserList_params,isSearch);
    };
  };

  loadTerminalCustomer=(params,isSearch)=>{
    this.props.dispatch({
      type:'application/fetch_terminalUserList_list_action',
      payload:params,
      isSearch:isSearch,
      callBack:(value)=>{
        // this.setState({
        //   checkedList:value
        // })
        if(this.state.checkAll){
          this.setState({
            checkedList:value.map(e=>JSON.stringify(e))
          })
        }
      }
    })
  };



  handleInfiniteOnLoad=()=>{
    const {application:{modal_terminalUserList_params}} = this.props;
    const isSearch = false;
    const start = modal_terminalUserList_params.start+10;
    const params = {
      ...modal_terminalUserList_params,
      start:start,
    };
    this.loadTerminalCustomer(params,isSearch);
  };

  //多选
  checkRoleValue = (checkedValues) => {
    const {application:{modal_terminalUserList_list} } = this.props;
    const checkedRoleValues = checkedValues.map(e => JSON.parse(e));

    this.setState({
      checkedRoleValues: checkedRoleValues
    });

    this.setState({
      checkedList:checkedValues,
      indeterminate: !!checkedValues.length && (checkedValues.length < modal_terminalUserList_list.length),
      checkAll: checkedValues.length === modal_terminalUserList_list.length,
    });
  };


  onCheckAll = (e) => {
    const {application:{modal_terminalUserList_list} } = this.props;
    this.setState({
      checkAll: e.target.checked,
      checkedList:e.target.checked?modal_terminalUserList_list.map(e=>JSON.stringify(e)):[],
    });
  };


  render(){
    const {application:{modal_terminalUserList_list,terminalUserListHasMore},loading,intl:{formatMessage} } = this.props;
    const {modalVisible,onCancelModal,handleCustomerSubmit} = this.props;
    const {checkedList} = this.state;
    const handList = checkedList.map(o=>JSON.parse(o))
    return(
      <Modal
        visible={modalVisible}
        title={formatMessage(basicMessages.select_end_user)}
        destroyOnClose={true}
        width={400}
        className='dealModal_styles'
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleCustomerSubmit&&handleCustomerSubmit(handList)
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
          <Checkbox
            onChange={this.onCheckAll}
            checked={this.state.checkAll}
            indeterminate={this.state.indeterminate}
          > {formatMessage(basicMessages.totalSelection)}</Checkbox>
          <Checkbox.Group
            value={checkedList}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkRoleValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && terminalUserListHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={modal_terminalUserList_list}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Checkbox value={JSON.stringify(item)}>{item.userName}
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
