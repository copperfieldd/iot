import {Button, Checkbox, Form, List, Modal,Input} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {count} from "../../../../utils/utils";
import {injectIntl} from "react-intl";
import messages from '../../../../messages/equipment';
import basicMessages from '../../../../messages/common/basicTitle';
const Search = Input.Search;
@Form.create()
@injectIntl
@connect(({equipmentRule, loading}) => ({
  equipmentRule,
  loading: loading.effects['equipmentRule/fetch_componentPullList_list_action'],
}))
export default class FilterModal extends Component {
  constructor(){
    super();
    this.state={
      checkedFilterValues:[],
    }
  }

  componentDidMount() {
    const {equipmentRule: {componentPullList_params,componentPullList},status,type} = this.props;
    const params = {
      ...componentPullList_params,
      // status:status,
      // type:type,
    }
    const isSearch = true;
    this.loadDataDealPull_list_list(params, isSearch);
  };


  loadDataDealPull_list_list = (params, isSearch) => {
    const {id} = this.props;
    const _this = this;

    this.props.dispatch({
      type: "equipmentRule/fetch_componentPullList_list_action",
      payload: params,
      isSearch: isSearch,
      callBack: (res) => {
        if (id) {
          res.map((item) => {
            if (id === item.id) {
              _this.defaultCheckedValue(item)
            }
          })
        }
      }
    })
  };


  handleInfiniteOnLoad=()=>{
    const {equipmentRule: {componentPullList_params},status} = this.props;

    const isSearch = false;
    const start = componentPullList_params.start + 10;
    const params = {
      ...componentPullList_params,
      start: start,
    };
    this.loadDataDealPull_list_list(params, isSearch);
  }


  handSearchServiceConfig = (value) => {
    const {equipmentRule: {componentPullList_params}} = this.props;
    this.setState({
      isSearch: true,
    });
    const isSearch = true;
    const params = {
      ...componentPullList_params,
      count: count,
      start: 0,
      name: value
    };
    this.loadDataDealPull_list_list(params, isSearch);
  };


  defaultCheckedValue = (item) => {
    this.setState({
      checkValue: item
    })
  };


  //多选
  checkFilterValue = (checkedValues) => {
    const checkedFilterValues = checkedValues.map(e => JSON.parse(e));

    this.setState({
      checkedFilterValues: checkedFilterValues
    })
  };
  render(){
    const {modalVisible,onCancelModal,equipmentRule: {componentPullList,componentPullMore}, loading, handleCheckValue,modalCheckedFilterValue,intl: {formatMessage}} = this.props;
    const {checkedFilterValues} = this.state;

    let defaultCheckedFilterValues  = checkedFilterValues.map(item=>{
      return JSON.stringify(item)
    });
    return(
      <Modal
        visible={modalVisible}
        title={formatMessage(messages.equipment_select_filter)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={400}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleCheckValue&&handleCheckValue(checkedFilterValues)
              onCancelModal&&onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder={formatMessage(basicMessages.keyWord)}
            onSearch={this.handSearchServiceConfig}
          />
          <Checkbox.Group
            value={defaultCheckedFilterValues.length>0?defaultCheckedFilterValues:modalCheckedFilterValue}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkFilterValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && componentPullMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={componentPullList}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Checkbox value={JSON.stringify({id:item.id,name:item.name})}>{item.name}<span
                          style={{marginLeft: 36}}>{item.logicalUnitName}</span></Checkbox>
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
