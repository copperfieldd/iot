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
  loading: loading.effects['equipment/fetch_pluginPullList_list_action'],
}))
@injectIntl
export default class PluginListModal extends Component {
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
      status:status,
    }
    const isSearch = false;
    if(pluginPullList.length===0||pluginPullList_params.status!==status){
      this.loadPluginPull_list_list(params, isSearch);
    }
  };

  loadPluginPull_list_list = (params, isSearch) => {
    const {id} = this.props;
    const _this = this;
    this.props.dispatch({
      type: "equipment/fetch_pluginPullList_list_action",
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
    const {equipment: {pluginPullList_params},status} = this.props;

    const isSearch = false;
    const start = pluginPullList_params.start + 10;
    const params = {
      ...pluginPullList_params,
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
    const {modalVisible, onCancelModal, equipment: {pluginPullList,pluginPullMore}, loading, handleCheckValue} = this.props;
    const {intl:{formatMessage}} = this.props;
    return (
      <Modal
        visible={modalVisible}
        title={formatMessage(basicMessages.select_plug)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={400}
        onCancel={onCancelModal && onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => {
              handleCheckValue && handleCheckValue(this.state.checkValue)
              // this.props.dispatch({
              //   type: 'warning/ruleAlarmTypeCheckedValue',
              //   payload: this.state.checkValue,
              // });
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
                hasMore={!loading && pluginPullMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={pluginPullList}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify({...item})}><span
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
