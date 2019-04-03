import React, { Component } from 'react';
import { connect } from 'dva';
import {Tree, Modal, Input, Button} from 'antd';
import { stringify } from 'qs';
import request from '../../utils/request';
import styles from "../../routes/Customer/Customer.less";
import {injectIntl} from "react-intl";
import basicMessages from '../../messages/common/basicTitle';

const TreeNode =  Tree.TreeNode;
const Search = Input.Search;

@connect(({ organization }) => ({
  organization,
}))
@injectIntl

export default class OrganizationTree extends Component {
  static defaultProps = {
    multiple:　false,
    labelInValue: false,
    type: [4],
  }

  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value: value,
      defaultExpandedKeys:[],
      checkedNodes:[],
    };
  }


  handleCurrencyChange = (currency) => {
    this.setState({ value:currency });
    this.triggerChange({ currency });
  }

  triggerChange = (changedValue) => {
    const { multiple } =this.props;
    const current = changedValue.currency;
    const onChange = this.props.onChange;
    if (onChange) {
      if(multiple){
        const res = current;
        onChange(res);
      }else{
        onChange(current);
      }
    }
  }

  componentDidMount(){
    const {nodeId,nodeType} = this.props;
    if(nodeType===3){
      let params = {
        tenantId: nodeId
      }
      this.loadTree(params);
    }else if(nodeType===4){
      let params={
        appId:nodeId
      }
      this.loadTree(params);
    }
    this.loadTree();

  }

  loadTree=(params)=>{
    this.props.dispatch({
      type:'organization/fetch_getOrganizationTree_action',
      payload:{tenantId:params},
    })
  }

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
      return <TreeNode title={item.name} key={item.id} icon={<i className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };

  onLoadData = (treeNode) => {
    let { dispatch, organization:{organizationTree} } = this.props;
    const parentId = treeNode.props.dataRef.id;
    const params = {
      id:parentId,
    };

    return request(`/userservice/api/unit/children?${stringify(params)}`).then(res=>{
      const children = res.value;
      treeNode.props.dataRef.children = children;
      organizationTree = [...organizationTree];
      dispatch({
        type:"organization/treeResult",
        payload:organizationTree,
      })
    });
  }

  onCheck = (checkedKeys,e) => {
    let nodes = [];
    e.checkedNodes.forEach((item,index)=>{
      nodes.push(item.props.dataRef)
    })
    this.setState({checkedNodes:nodes})
    this.setState({ checkedKeys});
  };


  render() {
    const { value, defaultExpandedKeys } = this.state;
    const { placeholder, multiple, onCancelModal,handleOrganizationSubmit, disabled,OrganizationVisible,organization:{organizationTree} ,intl:{formatMessage}} =this.props;
    return (
      <Modal
        title={formatMessage(basicMessages.select_organization)}
        visible={OrganizationVisible}
        width={300}
        className='dealModal_styles'
        destroyOnClose={true}
        onCancel={onCancelModal&&onCancelModal}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              handleOrganizationSubmit&&handleOrganizationSubmit(this.state.checkedNodes);
              onCancelModal&&onCancelModal()
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={onCancelModal&&onCancelModal} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        {/*<Search/>*/}

        <div style={{ width: '100%',height:350,overflow:'scroll',border:'solid 1px #d9d9d9' }}>
        <Tree
          checkable
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          loadData={this.onLoadData}
          //value={value}
          //disabled={disabled}
          //treeDefaultExpandedKeys={defaultExpandedKeys}
          placeholder={placeholder}
          //onChange={this.handleCurrencyChange}
          multiple = {multiple}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        >
          {this.renderTreeNodes(organizationTree)}
        </Tree>
        </div>
      </Modal>
    );
  }
}
