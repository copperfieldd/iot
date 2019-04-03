import {Button, Radio, Form, List, Modal,Input} from "antd";
import styles from "../../Permissions/Permissions.less";
import InfiniteScroll from "react-infinite-scroller";
import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import basicMessages from '../../../messages/common/basicTitle';
import {injectIntl} from "react-intl";

const Search = Input.Search;

@Form.create()
@connect(({dataSti, loading}) => ({
  dataSti,
  loading: loading.effects['dataSti/fetch_serviceList_action'],
}))
@injectIntl
export default class ApiList extends Component {
  constructor(){
    super();
    this.state={
      checkValue:null,
      searchValue:null,
    }
  }

  componentDidMount(){
    const {dataSti:{serviceListPull_params}} = this.props;
    const isSearch = true;
    const params = {
      ...serviceListPull_params,
      start:0
    };
    this.loadModalApiList(params,isSearch);
  };

  loadModalApiList=(params,isSearch)=>{
    this.props.dispatch({
      type:'dataSti/fetch_serviceList_action',
      payload:params,
      isSearch:isSearch,
      callBack:()=>{

      },
    })
  };

  handleInfiniteOnLoad=()=>{
    const {dataSti:{serviceListPull_params}} = this.props;
    const isSearch = false;
    const start = serviceListPull_params.start+10;
    const params = {
      ...serviceListPull_params,
      start:start,
    };
    this.loadModalApiList(params,isSearch);
  };



  handleSearch=(value)=>{
    const {dataSti:{serviceListPull_params}} = this.props;
    const isSearch = true;
    const params = {
      ...serviceListPull_params,
      start:0,
      serviceName:value,
    };
    this.loadModalApiList(params,isSearch);
  }


  //多选
  checkValue = (e) => {
    this.setState({
      checkValue: JSON.parse(e.target.value)
    })
  };


  render(){
    const {dataSti:{serviceListPull_Result,hasMore},loading,visible,onCancelModal,handleServiceSubmit,defaultValue,intl:{formatMessage}} = this.props;
    const {checkValue} = this.state;
    return(
      <Modal
        visible={visible}
        title={formatMessage(basicMessages.select_service)}
        className='dealModal_styles'
        //destroyOnClose={true}
        width={500}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleServiceSubmit&&handleServiceSubmit(checkValue);
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
            value={checkValue?JSON.stringify(checkValue):JSON.stringify(defaultValue)}
            style={{display: 'flex', justifyContent: 'center'}}
            onChange={this.checkValue}>
            <div className={styles.infinite_container} style={{width: '100%'}}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
              >
                <List
                  bordered
                  loading={loading}
                  dataSource={serviceListPull_Result}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div style={{width:'100%',whiteSpace:'nowrap',overflow:'hidden',textAlign:'left'}}>
                        <Radio value={JSON.stringify({serviceName:item.serviceName,serviceId:item.id})}>
                          <span style={{display:'inline-block',width:150}}>{item.serviceName}</span>
                        </Radio>
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
