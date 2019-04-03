import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Icon,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  List,
  Tree,
} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query";
import * as routerRedux from "react-router-redux";
import {getRoutes, isInArray} from "../../../utils/utils";
import InfiniteScroll from "react-infinite-scroller";
import {Route, Switch} from "react-router-dom";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';


@injectIntl
@connect(({customer,organization,loading}) => ({
  customer,
  organization,
  tenantLoading: loading.effects['customer/fetch_organization_tenant_list_action'],

}))
@Form.create()
export default class Organization extends Component {
  constructor() {
    super();
    this.state = {
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.close);
    const {customer:{organization_tenant_params,organization_tenantList},} = this.props;
    const isSearch = true;
    this.loadOrganizationTenantParams(organization_tenant_params,isSearch);
  };


  loadOrganizationTenantParams=(params,isSearch)=>{
    this.props.dispatch({
      type:'customer/fetch_organization_tenant_list_action',
      payload:params,
      isSearch:isSearch,
      callBack:(res)=>{
      }
    })
  };

  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  };

  handleInfiniteOnLoad=()=>{
    const {customer:{organization_tenant_params}} = this.props;
    const isSearch = false;
    const start = organization_tenant_params.start+organization_tenant_params.count;
    const params = {
      ...organization_tenant_params,
      start:start,
    };
    this.loadOrganizationTenantParams(params,isSearch);
  }


  loadTree=(params)=>{
    this.props.dispatch({
      type:'organization/fetch_getOrganizationTree_action',
      payload:{tenantId:params},
    })
  }



  render() {
    const {customer:{organization_tenantList,organTenantHasMore},loading,routerData,match,tenantLoading,intl:{formatMessage} } = this.props;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB' >
            <div></div>
          </div>

          <div style={{display:'flex'}}>
            <div style={{width:265,border:'solid 1px #d9d9d9',background:'#eff3fb',height:600,overflowY:'scroll',padding:'0 1px'}} >
              <div style={{lineHeight:'40px',textAlign:'center',color:'#3f89e1',}}><FormattedMessage {...basicMessages.tenantList} /></div>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!tenantLoading && organTenantHasMore}
                useWindow={false}
              >
                <List
                  bordered={false}
                  loading={loading}
                  dataSource={organization_tenantList}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div style={{padding:'0 20px',width:'100%'}} onClick={()=>{
                        this.props.dispatch(routerRedux.push(`/customer/organization/tenantItem/${item.id}`))
                        this.loadTree(item.id);
                      }}>
                        <i className={styles.icon_user}/>
                        <span style={{marginLeft:4,    position: 'relative',bottom: 4}}>{item.name}</span>
                      </div>
                    </List.Item>
                  )}
                >
                </List>
              </InfiniteScroll>
            </div>
            <div style={{background:'#f7f7f7',marginLeft:5,width:'calc(100% - 270px)'}}>
              <Switch>
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                    />
                  ))
                }
                <Route
                  render={()=>{return <div style={{minHeight:600}}></div>}} />
              </Switch>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
