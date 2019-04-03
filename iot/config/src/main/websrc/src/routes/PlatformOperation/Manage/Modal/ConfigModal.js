import {Button, Checkbox, Form, List, Modal, Input, Radio} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from '../../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

const Search = Input.Search;
@Form.create()
@connect(({platformOperation, loading}) => ({
  platformOperation,
  loading: loading.effects['platformOperation/fetch_platformConfigList_list_action'],
}))
@injectIntl
export default class ConfigModal extends Component {
  constructor() {
    super();
    this.state = {
      checkValue: null,
    }
  }

  componentDidMount() {
    const {platformOperation: {config_list_params}} = this.props;
    const isSearch = true;
    this.loadConfigList_list(config_list_params, isSearch);
  };

  loadConfigList_list = (params, isSearch) => {
    const {id} = this.props;
    const _this = this;
    this.props.dispatch({
      type: "platformOperation/fetch_platformConfigList_list_action",
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

  handleInfiniteOnLoad = () => {
    const {platformOperation: {config_list_params}} = this.props;
    const isSearch = false;
    const start = config_list_params.start + 10;
    const params = {
      ...config_list_params,
      start: start,
    };
    this.loadConfigList_list(params, isSearch);

  };

  //选择
  checkValue = (e) => {
    const checkValue = JSON.parse(e.target.value);
    this.setState({
      checkValue: checkValue,
    })
  };

  handleSearch=(value)=>{
    const {platformOperation: {config_list_params}} = this.props;
    let params = {
      ...config_list_params,
      filter:{
        configFile:value
      }
    };
    const isSearch = true;

    this.loadConfigList_list(params, isSearch);
  }

  render() {
    const {platformOperation: {configManage_list_list, configListHasMore}, loading, modalVisible, onCancelModal, handleCheckValue,intl:{formatMessage}} = this.props;
    return (
      <Modal
        visible={modalVisible}
        title={formatMessage(basicMessages.select_file)}
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
            onSearch={this.handleSearch}
          />
          <Radio.Group
            //value={checkedGateway}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && configListHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={configManage_list_list}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify(item)}><span
                          style={{marginLeft: 36}}>{item.configFile}</span></Radio>
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
