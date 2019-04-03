import React, {Component, Fragment} from 'react';
import {
  Spin,
  Modal,
  Input,
  Form,
  message,
  Icon, List, Button,
} from 'antd';
import {connect} from 'dva';
import {Route, Redirect, Switch, Link, routerRedux} from 'dva/router';
import Item from './Item';
import styles from './index.less';
import {isAbsolute} from 'path';
import InfiniteScroll from "react-infinite-scroller";
import Ellipsis from "../Ellipsis";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../messages/equipment';
import basicMessages from '../../messages/common/basicTitle';
const FormItem = Form.Item;

@connect(({equipmentTypeManage, loading}) => ({
  equipmentTypeManage,
  loading1: loading.effects['equipmentTypeManage/fetch_getFirstType_list_action'],
  loading2: loading.effects['equipmentTypeManage/fetch_getSecondType_list_action'],
}))
@injectIntl

export default class Cascade extends Component {
  static defaultProps = {
    selected: [],
    label: {
      labelCol: {span: 0},
      wrapperCol: {span: 24},
    },
  }

  state = {
    show: false,
    selected: [],
    selectedChild: [],
  }

  // componentWillReceiveProps(nextProps){
  //     const nextCityId = nextProps.global.cityId;
  //     const cityId = this.props.global.cityId;
  //     const stateSlected = this.state.selected;
  //     const { selected } = nextProps;
  //     if(stateSlected.length === 0){
  //         this.setState({
  //             selected:selected
  //         })
  //     }
  //     if(nextCityId && nextCityId !== cityId){
  //       const { dispatch } = this.props;
  //       dispatch({
  //         type: 'global/changeCascade',
  //         payload: {
  //             id:nextCityId,
  //             start:0,
  //             count:10,
  //             level: 0,
  //         },
  //       });
  //     }
  //   }

  componentDidMount() {
    const {equipmentTypeManage: {getFirstTypeList_params}} = this.props;
    const params = {
      ...getFirstTypeList_params,
      start: 0,
    }
    const isSearch = true;
    this.getFirstTypeList(params, isSearch)
  }

  getFirstTypeList = (params, isSearch) => {
    this.props.dispatch({
      type: 'equipmentTypeManage/fetch_getFirstType_list_action',
      payload: params,
      isSearch: isSearch,
      callBack: (res) => {
      }
    })
  };

  loadChildType = (params, isSearch) => {
    this.props.dispatch({
      type: 'equipmentTypeManage/fetch_getSecondType_list_action',
      payload: params,
      isSearch: isSearch,
      callBack: (res) => {
      }
    })
  }


  handleInfiniteOnLoad = () => {
    const {equipmentTypeManage: {getFirstTypeList_params}} = this.props;
    const isSearch = false;
    const start = getFirstTypeList_params.start + 10;
    const params = {
      ...getFirstTypeList_params,
      start: start,
    };
    this.getFirstTypeList(params, isSearch);

  };


  handleModel = () => {
    const {show} = this.state;
    this.setState({
      show: !show,
      //selected:[],
      //selectedChild:[],

    });
  };

  handleSubmit = () => {
    const {onSubmit,intl:{formatMessage}} = this.props;
    const {selected, selectedChild} = this.state;

    if (selected.length === 0) {
      message.error(formatMessage(messages.eq_select_first_type));
      return
    } else if (selectedChild.length === 0) {
      message.error(formatMessage(messages.eq_select_second_type));
      return
    }
    onSubmit(selectedChild.id);
    const value = selected.name + '/' + selectedChild.name;
    this.props.form.setFieldsValue({area: value});
    this.handleModel();
  };

  handleClick = (data) => {
    const {equipmentTypeManage: {getSecondTypeList_params}} = this.props;
    this.setState({
      selected: data,
      selectedChild: [],
    })
    const isSearch = true;
    const params = {
      ...getSecondTypeList_params,
      deviceTypeName: data.name,
    };
    this.loadChildType(params, isSearch)
  };

  handleClickChild = (data) => {

    this.setState({
      selectedChild: data
    })

  }

  render() {
    const {show, selected, selectedChild} = this.state;
    const { equipmentTypeManage: {getFirstTypeList, getFirstTypeHasMore, getSecondTypeList, getSecondTypeHasMore}, loading1, loading2, label, inputStyle, placeholder, defaultValues, clearInput, isClear,intl:{formatMessage}} = this.props;
    return (
      <span>
        <FormItem
          colon={false}
          {...label}
        >
          <span className={styles.closeBox}>
            {this.props.form.getFieldDecorator('area', {
              initialValue: defaultValues&&defaultValues.deviceModelName,
            })(
              <Input readOnly style={inputStyle} placeholder={placeholder} maxLength={0} onClick={this.handleModel}/>
            )
            }
            {isClear && <Icon onClick={() => clearInput()} className={styles.close} type="close-circle-o"/>}
          </span>
        </FormItem>
        <Modal
          className='dealModal_styles'
          visible={show}
          title={formatMessage(messages.equipment_device_model)}
          width={600}
          bodyStyle={{maxHeight: 560, padding: ' 0 24px 24px'}}
          //onOk={this.handleSubmit}
          //onCancel={this.handleModel}


          footer={
            <div style={{textAlign: 'center'}}>
              <Button type="primary" onClick={()=>{
                this.handleSubmit();
                //this.handleModel();
              }}>{formatMessage(basicMessages.confirm)}</Button>
              <Button onClick={this.handleModel} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
            </div>
          }
        >

            <div className={styles.cascade}>
             <div className={styles.infinite_container}>
                <InfiniteScroll
                  style={{width: '100%'}}
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!loading1 && getFirstTypeHasMore}
                  useWindow={false}
                >
                    <List
                      dataSource={getFirstTypeList}
                      loading={loading1}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <div style={{background: item.id === selected.id ? '#f4f4f4' : 'transparent', color: '#666'}}
                               onClick={() => this.handleClick(item)} className={styles.list_item}>
                            {
                              <div>
                                <div style={{float: 'left', width: '80%'}}>
                                  <Ellipsis tooltip lines={1}>{item.name}</Ellipsis>
                                </div>
                                <span style={{float: 'right'}}><Icon type="caret-right"/></span>
                              </div>
                            }
                          </div>
                        </List.Item>
                      )}
                    >
                    </List>
                </InfiniteScroll>
             </div>
             <div className={styles.infinite_container}>
                <InfiniteScroll
                  style={{width: '100%'}}
                  initialLoad={false}
                  pageStart={0}
                  loadMore={this.handleInfiniteOnLoad}
                  hasMore={!loading2 && getSecondTypeHasMore}
                  useWindow={false}
                >
                    <List
                      dataSource={getSecondTypeList}
                      loading={loading2}
                      renderItem={item => (
                        <List.Item key={item.id}>
                          <div style={{
                            background: item.id === selectedChild.id ? '#f4f4f4' : 'transparent',
                            color: '#666'
                          }}
                               onClick={() => this.handleClickChild(item)} className={styles.list_item}>
                            {
                              <div>
                                <div style={{float: 'left', width: '80%'}}>
                                  <Ellipsis tooltip lines={1}>{item.name}</Ellipsis>
                                </div>
                              </div>
                            }
                          </div>
                        </List.Item>
                      )}
                    >
                    </List>
                </InfiniteScroll>
             </div>
            </div>
        </Modal>
      </span>
    )
  }
}
