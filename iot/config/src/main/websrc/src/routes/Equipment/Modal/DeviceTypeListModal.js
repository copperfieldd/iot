import {Button, Checkbox, Form, List, Modal, Input, Radio} from "antd";
import styles from "../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {count} from '../../../utils/utils'
import basicMessages from "../../../messages/common/basicTitle";
import {injectIntl} from "react-intl";

const Search = Input.Search;
@Form.create()
@connect(({equipment, loading}) => ({
  equipment,
  loading: loading.effects['equipment/fetch_deviceTypePullList_list_action'],
}))
@injectIntl
export default class DeviceTypeListModal extends Component {
  constructor() {
    super();
    this.state = {
      checkValue: {},
      defaultCheckedValue: null,
      isSearch: null,
    }
  }

  componentDidMount() {
    const {equipment: {deviceTypePullList_params,deviceTypePullList},status,defaultValue} = this.props;
    const params = {
      ...deviceTypePullList_params,
      status:status,
    }
    const isSearch = false;
    if(deviceTypePullList.length===0){
      this.loadDeviceTypeListPull_list_list(params, isSearch);
    }
    this.setState({
      checkValue:defaultValue
    })
  };

  loadDeviceTypeListPull_list_list = (params, isSearch) => {
    const {id} = this.props;
    const _this = this;
    this.props.dispatch({
      type: "equipment/fetch_deviceTypePullList_list_action",
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

  defaultCheckedValue = (item) => {
    this.setState({
      checkValue: item
    })
  };

  handleInfiniteOnLoad = () => {
    const {equipment: {deviceTypePullList_params},status} = this.props;

    const isSearch = false;
    const start = deviceTypePullList_params.start + 10;
    const params = {
      ...deviceTypePullList_params,
      start: start,
      status:status,
    };
    this.loadDeviceTypeListPull_list_list(params, isSearch);

  };

  //选择
  checkValue = (e) => {
    const checkValue = JSON.parse(e.target.value);
    this.setState({
      checkValue: checkValue,
    })
  };

  handSearchServiceConfig = (value) => {
    const {status} = this.props;
    this.setState({
      isSearch: true,
    });
    const isSearch = true;
    const params = {
      status:status,
      count: count,
      start: 0,
      name: value
    }
    this.loadDeviceTypeListPull_list_list(params, isSearch);
  };

  render() {
    const {modalVisible, onCancelModal, equipment: {deviceTypePullList,deviceTypePullMore}, loading, handleCheckValue} = this.props;
    const {intl:{formatMessage}} = this.props;
    return (
      <Modal
        visible={modalVisible}
        title={formatMessage(basicMessages.select_config)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={400}
        onCancel={onCancelModal && onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => {
              handleCheckValue && handleCheckValue(this.state.checkValue)
              onCancelModal && onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal && onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder={formatMessage(basicMessages.keyWord)}
            onSearch={this.handSearchServiceConfig}
          />
          <Radio.Group
            value={JSON.stringify(this.state.checkValue)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && deviceTypePullMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={deviceTypePullList}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify({id:item.id,name:item.name})}><span
                          style={{marginLeft: 36}}>{item.name}</span></Radio>
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
