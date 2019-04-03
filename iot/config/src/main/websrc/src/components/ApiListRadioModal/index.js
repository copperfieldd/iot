import {Button, Radio, Form, List, Modal,Input} from "antd";
import styles from "../../routes/Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {selectData} from '../../utils/utils';
import basicMessages from "../../messages/common/basicTitle";
import {injectIntl} from "react-intl";

const Search = Input.Search;

@Form.create()
@connect(({permissions, loading}) => ({
  permissions,
  loading: loading.effects['permissions/fetch_getMenuApi_action'],
}))
@injectIntl
export default class ApiList extends Component {
  constructor(){
    super();
    this.state={
      checkedApiValues:[],
      defaultCheckedApiValue:[],
      searchValue:null,
    }
  }

  componentDidMount(){
    //const {permissions:{modal_api_params,modal_menuApi_list}} = this.props;
    //if(modal_menuApi_list.length===0){
      this.loadModalApiList();
    //}
  };

  loadModalApiList=(params)=>{
    //const isSearch = false;
    this.props.dispatch({
      type:'permissions/fetch_getMenuApi_action',
      payload:params,
      // isSearch:isSearch,
      // callBack:()=>{
      //
      // },
    })
  };

  // handleInfiniteOnLoad=()=>{
  //   const {permissions:{modal_api_params}} = this.props;
  //   const isSearch = false;
  //   const start = modal_api_params.start+10;
  //   const params = {
  //     ...modal_api_params,
  //     start:start,
  //   };
  //   this.loadModalApiList(params,isSearch);
  // };



  handleSearch=(value)=>{
    const {permissions:{modal_menuApi_list}} = this.props;
    this.setState({
      searchValue:value,
    })
    // let searchList = selectData(modal_menuApi_list,value);
    // this.props.dispatch({
    //   type:'permissions/modalMenuApiList',
    //   payload:{response:searchList},
    // })
  }


  //多选
  checkApiValue = (e) => {
    this.setState({
      checkedApiValues: JSON.parse(e.target.value)
    })
  };


  render(){
    const {permissions:{modal_menuApi_list,apiHasMore},loading,apiModalVisible,onCancelModal,handleRoleSubmit,intl:{formatMessage}  } = this.props;
    const {defaultCheckedApiValue,searchValue} = this.state;

    let searchList = selectData(modal_menuApi_list,searchValue);
    return(
      <Modal
        visible={apiModalVisible}
        title={formatMessage(basicMessages.selectApi)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={900}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleRoleSubmit&&handleRoleSubmit(this.state.checkedApiValues);
              onCancelModal&&onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <div style={{padding: 24}}>
          <Search
            placeholder={formatMessage(basicMessages.keyWord)}
            onSearch={this.handleSearch}
          />
          <Radio.Group
            value={JSON.stringify(this.state.checkedApiValues)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkApiValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              {/*<InfiniteScroll*/}
                {/*initialLoad={false}*/}
                {/*pageStart={0}*/}
                {/*loadMore={this.handleInfiniteOnLoad}*/}
                {/*hasMore={!loading && apiHasMore}*/}
                {/*useWindow={false}*/}
              {/*>*/}
                <List
                  bordered
                  loading={loading}
                  dataSource={searchList}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div style={{width:'100%',whiteSpace:'nowrap',overflow:'hidden',textAlign:'left'}}>
                        <Radio value={JSON.stringify(item)}>
                          <span style={{display:'inline-block',width:150}}>{item.complexName}</span>

                          <span style={{display:'inline-block',width:230}}>{item.name}</span>
                          <span style={{marginLeft: 25,display:'inline-block',width:150}}>{item.dataUrl}</span>
                        </Radio>
                      </div>
                    </List.Item>
                  )}
                >
                </List>
              {/*</InfiniteScroll>*/}
            </div>
          </Radio.Group>
        </div>

      </Modal>
    )
  }


}
