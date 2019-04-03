import {Button, Checkbox, Form, List, Modal,Input,Radio} from "antd";
import styles from "../../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';

const Search = Input.Search;
@Form.create()
@connect(({permissions, loading}) => ({
  permissions,
  loading: loading.effects['permissions/fetch_platformConfigList_list_action'],
}))
export default class RoleListModal extends Component {
  constructor(){
    super();
    this.state={
      checkValue:null,
    }
  }

  componentDidMount(){
    const {permissions:{config_list_params}} = this.props;
    const isSearch = false;
    this.loadConfigList_list(config_list_params,isSearch);
  };

  loadConfigList_list=(params,isSearch)=>{
    const {id} = this.props;
    this.props.dispatch({
      type:"permissions/fetch_platformConfigList_list_action",
      payload:params,
      isSearch:isSearch,
      callBack:(res)=>{
        const _this = this;
        if(id){
          res.map((item)=>{
            if(id===item.id){
              _this.defaultCheckedValue(item)
            }
          })
        }
      }
    })
  };

  handleInfiniteOnLoad=()=>{
    const {permissions:{config_list_params}} = this.props;
    const isSearch = false;
    const start = config_list_params.start+10;
    const params = {
      ...config_list_params,
      start:start,
    };
    this.loadConfigList_list(params,isSearch);

  };

  //选择
  checkValue = (e) => {
    const checkValue = JSON.parse(e.target.value);
    this.setState({
      checkValue: checkValue,
    })
  };
  render(){
    const {permissions:{configManage_list_list,configListHasMore},loading,modalVisible,onCancelModal,handleCheckValue } = this.props;
    return(
      <Modal
        visible={modalVisible}
        title='选择接口'
        //destroyOnClose={true}
        className='dealModal_styles'
        width={400}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              this.props.dispatch({
                type:'permissions/configManageCheckedValue',
                payload:this.state.checkValue,
              });
              handleCheckValue&&handleCheckValue(this.state.checkValue);
              onCancelModal&&onCancelModal()
            }}>确认</Button>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>取消</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder="请输入关键字"
          />
          <Radio.Group
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
                        <Radio value={JSON.stringify(item)}><span style={{marginLeft: 36}}>{item.configFile}</span></Radio>
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
