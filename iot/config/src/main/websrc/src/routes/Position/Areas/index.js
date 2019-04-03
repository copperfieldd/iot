import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Form,
  Card,
  List,
  Spin,
} from 'antd';
import styles from '../Position.less';
import excel from '../../../assets/areaTemplate.xlsx';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import {getRoutes} from "../../../utils/utils";
import InfiniteScroll from "react-infinite-scroller";
import {Route, Switch} from "react-router-dom";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/position';
import basicMessages from '../../../messages/common/basicTitle';


@connect(({position, loading}) => ({
  position,
  loading: loading.effects['position/fetch_countryList_action'],
}))
@injectIntl
@Form.create()
export default class Organization extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      client: {
        X: 0,
        Y: 0,
      },
      dataSource: [],
    }
  };

  componentDidMount() {
    document.addEventListener("click", this.close);
    const {position: {country_params, country_list}} = this.props;
    if (country_list.length === 0) {
      this.loadCountryList(country_params);
    }
    document.addEventListener("click", this.close);
  }

  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
  };


  loadCountryList = (params) => {
    this.props.dispatch({
      type: 'position/fetch_countryList_list_action',
      payload: params,
    })
  };
  handleInfiniteOnLoad = () => {
    const {position: {country_params}} = this.props;
    const isSearch = false;
    const start = country_params.start + country_params.count;
    const params = {
      ...country_params,
      start: start,
    };
    this.loadCountryList(params, isSearch);
  };

  handelVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  };


  rightMenu = ({event, item}) => {
    const {intl: {formatMessage}} = this.props;
    event.preventDefault();
    event.stopPropagation();
    let dataSource = [formatMessage(messages.delete_area)];
    this.setState({
      client: {
        X: event.pageX - 230,
        Y: event.pageY - 120,
      },
      countryId: item.id,
      visible: true,
      dataSource: dataSource,
    })
  };

  handleClick = (item) => {
    const {position: {country_params}, history} = this.props;
    const isSearch = true;
    const params = {
      ...country_params,
      start: 0,
    };
    this.props.dispatch({
      type: 'position/fetch_delAreaTree_action',
      payload: {countryId: this.state.countryId},
      callback: (res) => {
        if (res.status === 0) {
          const params = {
            countryId: this.state.countryId
          };
          this.props.dispatch({
            type: 'position/fetch_areasTree_action',
            payload: params,
          });
          if (this.state.countryId) {
            this.props.dispatch(routerRedux.push(`/position/administrativeAreas/areaItem/${this.state.countryId}`));
          } else {
            this.props.dispatch(routerRedux.push(`/position/administrativeAreas`));

          }
        }
      }
    })
  };


  render() {
    const {history, position: {country_list, countryHasMore}, loading, routerData, match, intl: {formatMessage}} = this.props;
    const {visible, client: {X, Y}, dataSource} = this.state;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            <Button type="primary" href={excel}
                    style={{marginLeft: 8}}
            >{formatMessage(messages.positionDownloadTemplate)}</Button>
          </div>

          <div style={{display: 'flex'}}>
            <div style={{width: 300, border: 'solid 1px #d9d9d9', height: 600, overflowY: 'scroll', padding: '0 1px'}}>
              <div style={{
                lineHeight: '40px',
                textAlign: 'center',
                color: '#3f89e1',
                background: '#f7f7f7',
              }}>{formatMessage(messages.countryList)}</div>
              {
                visible && <div
                  className={styles.list}
                  style={{
                    position: 'absolute',
                    left: X,
                    top: Y,
                    zIndex: 99,
                    whiteSpace: 'nowrap',
                    background: '#fff'
                  }}>
                  <List
                    className={styles.areas_right_menu}
                    size="small"
                    bordered
                    dataSource={dataSource}
                    renderItem={item => (<List.Item>
                      <div style={{textAlign: "center"}} onClick={() => this.handleClick(item)}>{item}</div>
                    </List.Item>)}
                  />
                </div>
              }
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.handleInfiniteOnLoad}
                hasMore={!loading && countryHasMore}
                useWindow={false}
              >
                <List
                  bordered={false}
                  //loading={loading}
                  dataSource={country_list}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div style={{padding: '0 20px', width: '100%'}}
                           onContextMenu={(event) => this.rightMenu({event, item})} onClick={() => {
                        const params = {
                          countryId: item.id
                        };
                        this.props.dispatch({
                          type: 'position/fetch_areasTree_action',
                          payload: params,
                        });
                        this.props.dispatch(routerRedux.push(`/position/administrativeAreas/areaItem/${item.id}`))
                      }}>
                        <i className={styles.icon_company}/>
                        <span style={{marginLeft: 10}}>{item.name}</span>
                      </div>
                    </List.Item>
                  )}
                >

                  {loading && (
                    <div className="demo-loading-container">
                      <Spin/>
                    </div>
                  )}
                </List>
              </InfiniteScroll>
            </div>
            <div style={{background: '#f7f7f7', marginLeft: 5}}>
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
                <Route path="/permissions/organization" render={() => {
                  return <div style={{minHeight: 600}}></div>
                }}/>
              </Switch>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
