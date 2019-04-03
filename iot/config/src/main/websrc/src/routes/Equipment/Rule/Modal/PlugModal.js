import {Button, Checkbox, Form, List, Modal, Input, Radio} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {count} from '../../../../utils/utils'
import {injectIntl} from "react-intl";
import messages from '../../../../messages/equipment';
import basicMessages from '../../../../messages/common/basicTitle';
const Search = Input.Search;
@Form.create()
@injectIntl
@connect(({equipment, loading}) => ({
  equipment,
  loading: loading.effects['equipment/fetch_pluginPullLists_list_action'],
}))
export default class PlugModal extends Component {
  constructor() {
    super();
    this.state = {
      checkValue: {},
      defaultCheckedValue: null,
      isSearch: null,
    }
  }

  componentDidMount() {
    const {equipment: {pluginPullList_params,pluginPullList},status} = this.props;
    const params = {
      ...pluginPullList_params,
      //status:status,
    }
    const isSearch = true;
    this.loadPluginPull_list_list(params, isSearch);
  };

  loadPluginPull_list_list = (params, isSearch) => {
    const _this = this;
    const {id} = this.props;
    this.props.dispatch({
      type: "equipment/fetch_pluginPullLists_list_action",
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
    const {equipment: {pluginPullLists_params},status} = this.props;

    const isSearch = false;
    const start = pluginPullLists_params.start + 10;
    const params = {
      ...pluginPullLists_params,
      start: start,
      status:status,
    };
    this.loadPluginPull_list_list(params, isSearch);

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
    })
    const isSearch = true;
    const params = {
      status:status,
      count: count,
      start: 0,
      name: value
    }
    this.loadPluginPull_list_list(params, isSearch);
  };

  render() {
    const {modalVisible, onCancelModal, equipment: {pluginPullLists,pluginPullsMore}, loading, handleCheckValue,modalCheckedPluginValue,intl: {formatMessage}} = this.props;
    return (
      <Modal
        visible={modalVisible}
        title={formatMessage(messages.equipment_select_filter)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={400}
        onCancel={onCancelModal && onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => {
              handleCheckValue && handleCheckValue(this.state.checkValue);
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
            value={this.state.checkValue&&this.state.checkValue.id?JSON.stringify(this.state.checkValue):JSON.stringify(modalCheckedPluginValue)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && pluginPullsMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={pluginPullLists}
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
