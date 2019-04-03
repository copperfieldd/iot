import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Card, Col, Row, Tabs, Table, Progress, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Trend from '../../components/Trend';
import { Pie, Bar, LineChart } from '../../components/Charts';
// import styles from './style.less';
// import assetsIcon from '../../assets/assets.png';
// import warningIcon from '../../assets/warning.png';
// import nouseIcon from '../../assets/nouse.png';
// import schedulingIcon from '../../assets/scheduling.png';
// import addnewIcon from '../../assets/addnew.png';
// import AssetListModal from "../../components/AssetListModal";

const TabPane = Tabs.TabPane;
const todoColumns = [
  {
    align:'center',
    title: '名称',
    dataIndex: 'name',
  },
  {
    align:'center',
    title: '类型',
    dataIndex: 'type',
  },
  {
    align:'center',
    title: '时间',
    dataIndex: 'createTime',
  },
];
const ranking = [
  {
    align:'center',
    title: '排名',
    dataIndex: 'id',
    render:(value,record,index)=>{
      return (index+1);
    }
  },
  {
    align:'center',
    title: '资产名称',
    dataIndex: 'name',
  },
  {
    align:'center',
    title: '有效使用时长(h)',
    dataIndex: 'time',
  },
];
const warning = [
  {
    align:'center',
    title: '类型',
    dataIndex: 'name',
  },
  {
    align:'center',
    title: '资产名称',
    dataIndex: 'type',
  },
  {
    align:'center',
    title: '地点',
    dataIndex: 'logicalUnitName',
  },
  {
    align:'center',
    title: '告警时间',
    dataIndex: 'createTime',
  },
];

@connect(({ dashboard, loading}) => ({
  dashboard,
  loading1: loading.effects['dashboard/fetch_leaderboard'],
  loading2: loading.effects['dashboard/fetch_todo'],
  loading3: loading.effects['dashboard/fetch_compare'],
  loading4: loading.effects['dashboard/fetch_alarm_list'],
  loading5: loading.effects['dashboard/fetch_statistics'],
  loading6: loading.effects['dashboard/fetch_asset_type'],
  loading7: loading.effects['dashboard/fetch_distributed'],
  loading8: loading.effects['dashboard/fetch_curve'],
}))
export default class Dashboard extends React.Component {
  state = {
    showModal: false,
    itemId: null,
  }

  // handleModel = (e) => {
  //   const {showModal} = this.state;
  //   this.setState({showModal: !showModal});
  // }
  //
  // componentWillReceiveProps(nextProps){
  //   const { dashboard:{unit : prevUnit} } = this.props;
  //   const { dispatch, dashboard:{unit} } = nextProps;
  //   const prevUnitId = prevUnit && prevUnit.value || '';
  //   const unitId = unit && unit.value || '';
  //   if(unitId !== prevUnitId){
  //     dispatch({
  //       type:'dashboard/fetch_leaderboard',
  //       payload:{
  //         start:0,
  //         count:6,
  //         unitId:unitId,
  //         leaderboardType:1
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_todo',
  //       payload:{
  //         start:0,
  //         count:6,
  //         type:1
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_compare',
  //       payload:{
  //         unitId:unitId,
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_alarm_list',
  //       payload:{
  //         unitId:unitId,
  //         start:0,
  //         count:6
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_statistics',
  //       payload:{
  //         unitId:unitId,
  //         start:0,
  //         count:6
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_asset_type',
  //       payload:{
  //         unitId:unitId,
  //         type:1,
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_distributed',
  //       payload:{
  //         unitId:unitId,
  //       }
  //     })
  //     dispatch({
  //       type:'dashboard/fetch_curve',
  //       payload:{
  //         unitId:unitId,
  //       }
  //     })
  //   }
  // }
  //
  // componentDidMount(){
  //   const { dispatch, dashboard:{unit} } = this.props;
  //   const unitId = unit.value;
  //   dispatch({
  //     type:'dashboard/fetch_leaderboard',
  //     payload:{
  //       start:0,
  //       count:6,
  //       unitId:unitId,
  //       leaderboardType:1
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_todo',
  //     payload:{
  //       start:0,
  //       count:6,
  //       type:1
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_compare',
  //     payload:{
  //       unitId:unitId,
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_alarm_list',
  //     payload:{
  //       unitId:unitId,
  //       start:0,
  //       count:6
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_statistics',
  //     payload:{
  //       unitId:unitId,
  //       start:0,
  //       count:6
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_asset_type',
  //     payload:{
  //       unitId:unitId,
  //       type:1,
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_distributed',
  //     payload:{
  //       unitId:unitId,
  //     }
  //   })
  //   dispatch({
  //     type:'dashboard/fetch_curve',
  //     payload:{
  //       unitId:unitId,
  //     }
  //   })
  // }

  // tabChange = (key) => {
  //   const { dispatch, dashboard:{unit} } = this.props;
  //   const unitId = unit && unit.value || '';
  //   let leaderboardType;
  //   if(key === '1'){
  //     leaderboardType = 1;
  //   }else{
  //     leaderboardType = 2;
  //   }
  //   dispatch({
  //     type:'dashboard/fetch_leaderboard',
  //     payload:{
  //       start:0,
  //       count:6,
  //       unitId:unitId,
  //       leaderboardType:leaderboardType
  //     }
  //   })
  // }
  //
  // typeChange = (key) => {
  //   const { dispatch, dashboard:{unit} } = this.props;
  //   const unitId = unit && unit.value || '';
  //   let type;
  //   if(key === '1'){
  //     type = 1;
  //   }else{
  //     type = 2;
  //   }
  //   dispatch({
  //     type:'dashboard/fetch_asset_type',
  //     payload:{
  //       unitId:unitId,
  //       type:type,
  //     }
  //   })
  // }
  
  render() {
    // const { showModal, itemId } = this.state;
    // const { dashboard:{ leaderboard, todo, compare, alarm_list, statistics, asset_type, distributed, curve }, dispatch } = this.props;
    // const { currentTransferCount,addCompare,currentLdleCount,alarmConpare,ldleCompare,assetCountcompare,transferCompare,currentAssetCount,currentAlarmCount,currentAddCount } = compare; //环比
    // const { value, totalCount } = asset_type;
    // const statisticsData = statistics.value.map(e=>{
    //   return{
    //     x:e.type,
    //     y:e.totalCount
    //   }
    // });
    //
    // const salesData = [];
    // for (const key in distributed) {
    //   if (distributed.hasOwnProperty(key)) {
    //     const value = distributed[key];
    //     salesData.push({
    //       x: key,
    //       y: value,
    //     });
    //   }
    // }
    // const chartData = [];
    // for (const key in curve) {
    //   if (curve.hasOwnProperty(key)) {
    //     const value = curve[key];
    //     chartData.push({
    //       x: key,
    //       y1: value.addCount,
    //       y2: value.transferCount,
    //       y3: value.alarmCount,
    //       y4: value.ldleCount,
    //     });
    //   }
    // }

    return (
      <PageHeaderLayout>
        {/*<div className={styles.dashboard}>*/}
          {/*<div className={styles.loading_box}>*/}
            {/*<Spin spinning={this.props.loading3}>*/}
              {/*<div className={styles.tabs}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*bodyStyle={{padding:12}}*/}
                {/*>*/}
                  {/*<div className={styles.tabInner}>*/}
                    {/*<div>*/}
                      {/*<img width="34" className={styles.homeIcon} src={assetsIcon} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                      {/*<div className={styles.text}>资产总数</div>*/}
                      {/*<h1 className={styles.num}>{currentAssetCount}</h1>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                  {/*<div className={styles.trend}>*/}
                    {/*月环比*/}
                    {/*{*/}
                      {/*parseInt(assetCountcompare) ? <Trend flag={(parseInt(assetCountcompare) > 100)?"up":"down"} reverseColor={true} style={{ marginLeft: 8 }}>{assetCountcompare}</Trend>*/}
                      {/*:*/}
                      {/*<span style={{ marginLeft: 8 }}>{assetCountcompare}</span>*/}
                    {/*}*/}
                  {/*</div>*/}
                {/*</Card>*/}
              {/*</div>*/}
              {/*<div className={styles.tabs}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*bodyStyle={{padding:12}}*/}
                {/*>*/}
                  {/*<div className={styles.tabInner}>*/}
                    {/*<div>*/}
                      {/*<img width="34" className={styles.homeIcon} src={warningIcon} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                      {/*<div className={styles.text}>异常告警</div>*/}
                      {/*<h1 className={styles.num}>{currentAlarmCount}</h1>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                  {/*<div className={styles.trend}>*/}
                    {/*月环比*/}
                    {/*{*/}
                      {/*parseInt(alarmConpare) ? <Trend flag={(parseInt(alarmConpare) > 100)?"up":"down"} reverseColor={true} style={{ marginLeft: 8 }}>{assetCountcompare}</Trend>*/}
                      {/*:*/}
                      {/*<span style={{ marginLeft: 8 }}>{alarmConpare}</span>*/}
                    {/*}*/}
                  {/*</div>*/}
                {/*</Card>*/}
              {/*</div>*/}
              {/*<div className={styles.tabs}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*bodyStyle={{padding:12}}*/}
                {/*>*/}
                  {/*<div className={styles.tabInner}>*/}
                    {/*<div>*/}
                      {/*<img width="34" className={styles.homeIcon} src={nouseIcon} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                      {/*<div className={styles.text}>闲置资产</div>*/}
                      {/*<h1 className={styles.num}>{currentLdleCount}</h1>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                  {/*<div className={styles.trend}>*/}
                    {/*月环比*/}
                    {/*{*/}
                      {/*parseInt(ldleCompare) ? <Trend flag={(parseInt(ldleCompare) > 100)?"up":"down"} reverseColor={true} style={{ marginLeft: 8 }}>{assetCountcompare}</Trend>*/}
                      {/*:*/}
                      {/*<span style={{ marginLeft: 8 }}>{ldleCompare}</span>*/}
                    {/*}*/}
                  {/*</div>*/}
                {/*</Card>*/}
              {/*</div>*/}
              {/*<div className={styles.tabs}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*bodyStyle={{padding:12}}*/}
                {/*>*/}
                  {/*<div className={styles.tabInner}>*/}
                    {/*<div>*/}
                      {/*<img width="34" className={styles.homeIcon} src={schedulingIcon} alt=""/>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                      {/*<div className={styles.text}>本月调拨</div>*/}
                      {/*<h1 className={styles.num}>{currentTransferCount}</h1>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                  {/*<div className={styles.trend}>*/}
                    {/*月环比*/}
                    {/*{*/}
                      {/*parseInt(transferCompare) ? <Trend flag={(parseInt(transferCompare) > 100)?"up":"down"} reverseColor={true} style={{ marginLeft: 8 }}>{assetCountcompare}</Trend>*/}
                      {/*:*/}
                      {/*<span style={{ marginLeft: 8 }}>{transferCompare}</span>*/}
                    {/*}*/}
                  {/*</div>*/}
                {/*</Card>*/}
              {/*</div>*/}
              {/*<div className={styles.tabs}>*/}
              {/*<Card*/}
                {/*bordered={false}*/}
                {/*bodyStyle={{padding:12}}*/}
              {/*>*/}
                {/*<div className={styles.tabInner}>*/}
                  {/*<div>*/}
                    {/*<img width="34" className={styles.homeIcon} src={addnewIcon} alt=""/>*/}
                  {/*</div>*/}
                  {/*<div>*/}
                    {/*<div className={styles.text}>本月新增</div>*/}
                    {/*<h1 className={styles.num}>{currentAddCount}</h1>*/}
                  {/*</div>*/}
                {/*</div>*/}
                {/*<div className={styles.trend}>*/}
                  {/*月环比*/}
                  {/*{*/}
                      {/*parseInt(addCompare) ? <Trend flag={(parseInt(addCompare) > 100)?"up":"down"} reverseColor={true} style={{ marginLeft: 8 }}>{assetCountcompare}</Trend>*/}
                      {/*:*/}
                      {/*<span style={{ marginLeft: 8 }}>{addCompare}</span>*/}
                    {/*}*/}
                {/*</div>*/}
              {/*</Card>*/}
            {/*</div>*/}
            {/*</Spin>*/}
          {/*</div>*/}
          {/*<div className={styles.card}>*/}
            {/*<Row gutter={16}>*/}
              {/*<Col md={24} lg={12} className={styles.row}>*/}
              {/*<div className={styles.todo}>*/}
                {/*<Card*/}
                  {/*extra={<Link to="/works/todo">更多</Link>}*/}
                  {/*bordered={false}*/}
                  {/*title="我的待办"*/}
                  {/*bodyStyle={{height:343}}*/}
                {/*>*/}
                    {/*<Table*/}
                      {/*rowClassName='operationRow'*/}
                      {/*bordered*/}
                      {/*size="small"*/}
                      {/*pagination={false}*/}
                      {/*loading={this.props.loading2}*/}
                      {/*columns={todoColumns}*/}
                      {/*dataSource={todo.value}*/}
                      {/*rowKey={(record,index) => index}*/}
                      {/*onRow={(record) => {*/}
                        {/*return {*/}
                          {/*onClick: () => {*/}
                            {/*dispatch(routerRedux.push(`/asset/scheduling/item/${record.id}`))*/}
                          {/*},*/}
                        {/*};*/}
                      {/*}}*/}
                    {/*/>*/}
                {/*</Card>*/}
                {/*</div>*/}
              {/*</Col>*/}
              {/*<Col md={24} lg={12} className={styles.row}>*/}
                {/*<AssetListModal*/}
                  {/*editble={false}*/}
                  {/*showModal={showModal}*/}
                  {/*handleModel={this.handleModel}*/}
                  {/*id={itemId}*/}
                {/*/>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*title="排行榜"*/}
                  {/*bodyStyle={{height:343}}*/}
                {/*>*/}
                  {/*<Tabs onChange={this.tabChange} type="card">*/}
                    {/*<TabPane tab="忙碌" key="1">*/}
                        {/*<Table*/}
                        {/*bordered*/}
                        {/*rowClassName='operationRow'*/}
                        {/*size="small"*/}
                        {/*pagination={false}*/}
                        {/*loading={this.props.loading1}*/}
                        {/*columns={ranking}*/}
                        {/*dataSource={leaderboard}*/}
                        {/*rowKey={(record,index) => index}*/}
                        {/*onRow={(record) => {*/}
                          {/*return {*/}
                            {/*onClick: () => {*/}
                              {/*this.setState({*/}
                                {/*showModal: !showModal,*/}
                                {/*itemId: record.id,*/}
                              {/*})*/}
                            {/*},*/}
                          {/*};*/}
                        {/*}}*/}
                      {/*/>*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab="闲置" key="2">*/}
                        {/*<Table*/}
                          {/*bordered*/}
                          {/*rowClassName='operationRow'*/}
                          {/*size="small"*/}
                          {/*loading={this.props.loading1}*/}
                          {/*pagination={false}*/}
                          {/*columns={ranking}*/}
                          {/*dataSource={leaderboard}*/}
                          {/*rowKey={(record,index) => index}*/}
                          {/*onRow={(record) => {*/}
                            {/*return {*/}
                              {/*onClick: () => {*/}
                                {/*this.setState({*/}
                                  {/*showModal: !showModal,*/}
                                  {/*itemId: record.id,*/}
                                {/*})*/}
                              {/*},*/}
                            {/*};*/}
                          {/*}}*/}
                        {/*/>*/}
                    {/*</TabPane>*/}
                  {/*</Tabs>*/}
                {/*</Card>*/}
              {/*</Col>*/}
            {/*</Row>*/}
          {/*</div>*/}
          {/*<div className={styles.card}>*/}
            {/*<Row gutter={16}>*/}
              {/*<Col md={24} lg={12} className={styles.row}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*title="异常告警列表"*/}
                  {/*bodyStyle={{height:343}}*/}
                {/*>*/}
                  {/*<Table*/}
                      {/*bordered*/}
                      {/*size="small"*/}
                      {/*pagination={false}*/}
                      {/*loading={this.props.loading4}*/}
                      {/*columns={warning}*/}
                      {/*dataSource={alarm_list}*/}
                      {/*rowKey={(record,index) => index}*/}
                    {/*/>*/}
                {/*</Card>*/}
              {/*</Col>*/}
              {/*<Col md={24} lg={12} className={styles.row}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*title="异常告警统计"*/}
                  {/*bodyStyle={{height:343,paddingTop:54}}*/}
                  {/*>*/}
                  {/*<Spin spinning={this.props.loading5}>*/}
                    {/*<Pie*/}
                      {/*showLabel*/}
                      {/*height={240}*/}
                      {/*hasLegend*/}
                      {/*data={statisticsData}*/}
                    {/*/>*/}
                  {/*</Spin>*/}
                {/*</Card>*/}
              {/*</Col>*/}
            {/*</Row>*/}
          {/*</div>*/}
          {/*<div className={styles.card}>*/}
            {/*<Row gutter={16}>*/}
              {/*<Col md={24} lg={12} className={styles.row}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*title="资产分类情况"*/}
                  {/*bodyStyle={{height:343}}*/}
                {/*>*/}
                  {/*<Spin spinning={this.props.loading6}>*/}
                    {/*<Tabs onChange={this.typeChange} type="card">*/}
                    {/*<TabPane tab="分类" key="1">*/}
                      {/*<div style={{height:256,overflow:'scroll'}}>*/}
                        {/*{*/}
                          {/*value.map((e,i)=>{*/}
                            {/*const percent = parseFloat(((e.totalCount/totalCount)*100).toFixed(2));*/}
                            {/*return(*/}
                              {/*<div key={i}>*/}
                                {/*<div className={styles.progressBar}>*/}
                                    {/*<span>*/}
                                        {/*{e.name}*/}
                                    {/*</span>*/}
                                    {/*<span>*/}
                                      {/*{percent}% ({e.totalCount})*/}
                                    {/*</span>*/}
                                {/*</div>*/}
                                {/*<Progress strokeColor="#1890ff" percent={percent} showInfo={false} />*/}
                              {/*</div>*/}
                            {/*)*/}
                          {/*})*/}
                        {/*}*/}
                      {/*</div>*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab="状态" key="2">*/}
                       {/*<div style={{height:256,overflow:'scroll'}}>*/}
                        {/*{*/}
                          {/*value.map((e,i)=>{*/}
                            {/*const percent = parseFloat(((e.totalCount/totalCount)*100).toFixed(2));*/}
                            {/*return(*/}
                              {/*<div key={i}>*/}
                                {/*<div className={styles.progressBar}>*/}
                                    {/*<span>*/}
                                        {/*{e.name}*/}
                                    {/*</span>*/}
                                    {/*<span>*/}
                                      {/*{percent}% ({e.totalCount})*/}
                                    {/*</span>*/}
                                {/*</div>*/}
                                {/*<Progress strokeColor="#1890ff" percent={percent} showInfo={false} />*/}
                              {/*</div>*/}
                            {/*)*/}
                          {/*})*/}
                        {/*}*/}
                      {/*</div>*/}
                    {/*</TabPane>*/}
                  {/*</Tabs>*/}
                  {/*</Spin>*/}
                {/*</Card>*/}
              {/*</Col>*/}
              {/*<Col md={24} lg={12} className={styles.row}>*/}
                {/*<Card*/}
                  {/*bordered={false}*/}
                  {/*title="资产分布统计"*/}
                  {/*bodyStyle={{height:343}}*/}
                {/*>*/}
                  {/*<Spin spinning={this.props.loading7}>*/}
                    {/*<Bar*/}
                      {/*color="#49c6db"*/}
                      {/*height={300}*/}
                      {/*data={salesData}*/}
                    {/*/>*/}
                  {/*</Spin>*/}
                {/*</Card>*/}
              {/*</Col>*/}
            {/*</Row>*/}
          {/*</div>*/}
          {/*<div className={styles.card} >*/}
            {/*<div className={styles.row}>*/}
              {/*<Card*/}
                {/*bordered={false}*/}
                {/*title="历史状态汇总"*/}
              {/*>*/}
                {/*<Spin spinning={this.props.loading8}>*/}
                  {/*<LineChart*/}
                    {/*height={300}*/}
                    {/*data={chartData}*/}
                    {/*titleMap={{ y1: '新增', y2: '调拨', y3: '告警' ,y4: '闲置' }}*/}
                  {/*/>*/}
                {/*</Spin>*/}
              {/*</Card>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      </PageHeaderLayout>
    );
  }
}
