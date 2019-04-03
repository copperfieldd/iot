import {Button, Checkbox, Form, List, Modal,Input,Radio} from "antd";
import styles from "../../Permissions.less";
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
export default class GradeListModal extends Component {
  constructor(){
    super();
    this.state={
      checkValue:null,
    }
  }

  componentDidMount(){
    const {permissions:{tenant_grade_params}} = this.props;
    const isSearch = true;
    let params = {
      ...tenant_grade_params,
      start:0,
    }
    this.loadGradeModal_list(params,isSearch);
  };

  loadGradeModal_list=(params,isSearch)=>{
    const {id} = this.props;
    this.props.dispatch({
      type:"permissions/fetch_tenant_grade_list_action",
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
    const {permissions:{tenant_grade_params}} = this.props;
    const isSearch = false;
    const start = tenant_grade_params.start+10;
    const params = {
      ...tenant_grade_params,
      start:start,
    };
    this.loadGradeModal_list(params,isSearch);

  };


  changeModalVisible = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
    })
  }

  //选择
  checkValue = (e) => {
    const checkValue = JSON.parse(e.target.value);
    this.setState({
      checkValue: checkValue,
    })
  };
  render(){
    const {permissions:{tenant_grade_list,tenantGradeHasMore},loading,modalVisible,onCancelModal,handleCheckValue } = this.props;
    return(
      <Modal
        visible={modalVisible}
        title='选择接口'
        className='dealModal_styles'
        destroyOnClose={true}
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
                hasMore={!loading && tenantGradeHasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={tenant_grade_list}
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
