import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Icon, Form, Upload, Tree, message} from 'antd';
import styles from '../Position.less';
import * as routerRedux from "react-router-redux";
import {getRoutes, isInArray, getUrl, callStatusInfo} from "../../../utils/utils";
import {Route, Switch} from "react-router-dom";
import {getAuthority} from "../../../utils/authority";
import {stringify} from 'qs';
import request from '../../../utils/request';
import {injectIntl} from 'react-intl';
import messages from '../../../messages/position';
import basicMessages from '../../../messages/common/basicTitle';


const TreeNode = Tree.TreeNode;

@connect(({position, loading}) => ({
  position,
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class AdministrativeAreas extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      expandedKeys: [],
      client: {
        X: 0,
        Y: 0,
      },
      dataSource: [],
    }
  };


  componentDidMount() {
    document.addEventListener("click", this.close);
    const {match: {params: {id}}} = this.props;
    const params = {
      countryId: id,
    }
    //this.loadAreaTree(params)
  }

  loadAreaTree = (params) => {
    this.props.dispatch({
      type: 'position/fetch_areasTree_action',
      payload: params,
    })
  };

  close = (e) => {
    e.stopPropagation();
    this.setState({
      visible: false,
    })
  };

  changeExpandedKeys = (e) => {
    const {expandedKeys} = this.state;
    const {node: {props}} = e;
    const {key, isLeaf} = props.dataRef;
    if (isInArray(expandedKeys, key)) {
      const newKeys = expandedKeys.filter(i => i !== key);
      this.setState({expandedKeys: newKeys});
    } else {
      if (!isLeaf) {
        expandedKeys.push(key);
        this.setState({expandedKeys});
      }
    }
  };

  onExpand = (onExpandedKeys, e) => {
    this.changeExpandedKeys(e);
  };


  onLoadData = (treeNode) => {
    const {dispatch, position} = this.props;
    const parentId = treeNode.props.dataRef.id;
    this.setState({
      treeNode: treeNode,
      parentId: parentId,
    });
    let areaTree = position.areasTree;
    const params = {
      id: parentId,
    };
    return request(`/geography/api/region/children?${stringify(params)}`).then(res => {
      const children = res.value;
      treeNode.props.dataRef.children = children;
      areaTree = [...areaTree];
      dispatch({
        type: "position/areasTreeResult",
        payload: areaTree,
      })
    });
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<i
            className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                    title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} icon={<i
        className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };


  onSelect = (selectedKeys, e) => {
    const {match: {params: {id}}} = this.props;
    if (selectedKeys.length !== 0) {
      this.props.dispatch(routerRedux.push(`/position/administrativeAreas/areaItem/${id}/${selectedKeys[0]}`));
      this.props.dispatch({
        type: 'position/fetch_areaItem_action',
        payload: {id: selectedKeys[0]}
      })
    } else {
      return
    }
  };


  handleChange = (fileList) => {
    const {file: {response, status}} = fileList;
    const {match: {params: {id}}} = this.props;
    const params = {
      countryId: id
    };
    //const { dispatch } = this.props;
    if (response && status === 'done') {
      if (response.status === 0) {
        callStatusInfo(response.status, window, response.value);
        this.props.dispatch(routerRedux.push(`/position/administrativeAreas/areaItem/${id}`));
        this.props.dispatch({
          type: 'position/fetch_areasTree_action',
          payload: params,
        })
      } else {
        callStatusInfo(response.status, window, response.value);
        this.props.dispatch(routerRedux.push(`/position/administrativeAreas/areaItem/${id}`));

      }
    }
    if (status === 'error') {
      message.error('导入失败，请稍后再试')
    }
  }

  render() {
    const {expandedKeys, visible, client: {X, Y}, dataSource} = this.state;
    const token = getAuthority() && getAuthority().value && getAuthority().value.token || '';
    const {loading, routerData, match, position: {areasTree}, match: {params: {id}}, intl: {formatMessage}} = this.props;

    return (
      <div className='dlxB' style={{height: 600}}>
        <div style={{width: 300, border: 'solid 1px #d9d9d9',}}>
          <div style={{lineHeight: '40px', textAlign: 'center', color: '#3f89e1',}} className={styles.areaStyles}>
            <span style={{marginLeft: 35}}>{formatMessage(messages.countryDetails)}</span>
            <span style={{float: 'right', fontSize: 12}}>
              <Icon type="upload" theme="outlined" style={{marginRight: 6}}/>
            <Upload
              action={getUrl("/geography/api/region/import")}
              onChange={this.handleChange}
              data={{countryId: id}}
              accept=".xls,.xlsx"
              headers={{
                'Authorization': token
              }}
            >
              <a style={{fontSize: 12, marginRight: 6}}>{formatMessage(basicMessages.import)}</a>
            </Upload>
            </span>
          </div>
          <div className='dlxB' style={{background: '#fff'}}>
            <div className={styles.organization_tree_box}>
              {
                areasTree.length > 0 ?
                  <Tree
                    showIcon
                    onExpand={this.onExpand}
                    //expandedKeys={expandedKeys}
                    onSelect={this.onSelect}
                    //loadData={this.onLoadData}
                    onRightClick={this.rightClick}
                  >
                    {this.renderTreeNodes(areasTree)}
                  </Tree> : <div className='noData'>{formatMessage(basicMessages.noData)}</div>
              }


            </div>
          </div>
        </div>

        <div style={{height: '100%', width: 20, background: "#fff"}}></div>
        <div style={{background: '#fff'}}>
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
            <Route path="/position/administrativeAreas/areaItem/:id/:id" render={() => {
              return <div style={{minHeight: 600}}></div>
            }}/>
          </Switch>
        </div>

      </div>
    );
  }
}
