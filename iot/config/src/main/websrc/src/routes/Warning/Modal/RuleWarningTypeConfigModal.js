import {Button, Checkbox, Form, List, Modal, Input, Radio} from "antd";
import styles from "../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {count} from '../../../utils/utils'
import basicMessages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

const Search = Input.Search;
@Form.create()
@connect(({warning, loading}) => ({
  warning,
  loading: loading.effects['warning/fetch_warningServiceList_list_action'],
}))
@injectIntl
export default class RuleWarningTypeConfigModal extends Component {
  constructor() {
    super();
    this.state = {
      checkValue: {},
      defaultCheckedValue: null,
      isSearch: null,
    }
  }

  componentDidMount() {
    const {warning: {warningType_list_params}} = this.props;
    const isSearch = true;
    let params = {
      ...warningType_list_params,
      start: 0
    }
    this.loadWarningType_list_list(params, isSearch);
  };

  loadWarningType_list_list = (params, isSearch) => {
    const {id} = this.props;
    const _this = this;
    this.props.dispatch({
      type: "warning/fetch_warningTypeListResult_list_action",
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
    const {warning: {warningType_list_params}} = this.props;
    const isSearch = false;
    const start = warningType_list_params.start + 10;
    const params = {
      ...warningType_list_params,
      start: start,
    };
    this.loadWarningType_list_list(params, isSearch);

  };

  //选择
  checkValue = (e) => {
    const checkValue = JSON.parse(e.target.value);
    this.setState({
      checkValue: checkValue,
    })
  };

  handSearchServiceConfig = (value) => {
    this.setState({
      isSearch: true,
    });
    const isSearch = true;
    const params = {
      count: count,
      start: 0,
      alarmName: value
    };
    this.loadWarningType_list_list(params, isSearch);
  };

  render() {
    const {modalVisible, onCancelModal, warning: {warningType_list_list, warningTypeHasMore}, loading, handleCheckValue, intl: {formatMessage}} = this.props;
    return (
      <Modal
        visible={modalVisible}
        title={formatMessage(basicMessages.select_type)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={400}
        onCancel={onCancelModal && onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => {
              handleCheckValue && handleCheckValue(this.state.checkValue)
              this.props.dispatch({
                type: 'warning/ruleAlarmTypeCheckedValue',
                payload: this.state.checkValue,
              });
              onCancelModal && onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal && onCancelModal}
                    style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
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
                hasMore={!loading && warningTypeHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={warningType_list_list}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>
                        <Radio value={JSON.stringify(item)}><span
                          style={{marginLeft: 36}}>{item.alarmName}</span></Radio>
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
