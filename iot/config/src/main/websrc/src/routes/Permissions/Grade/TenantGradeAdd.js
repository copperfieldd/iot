import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Table,
  Button,
  Icon,
  Badge,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Card,
  Divider,
  Radio,
  Tree
} from 'antd';
import styles from '../Permissions.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {isInArray} from "../../../utils/utils";
import ApiList from "../../../components/ApiListModal";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const TreeNode = Tree.TreeNode;

const treeData = [
  {title: '展开菜单', key: '0'},
  {title: '展开菜单', key: '1'},
  {title: '菜单', key: '2', isLeaf: true},
  {title: '菜单', key: '3', isLeaf: true},
  {title: '菜单', key: '4', isLeaf: true},
  {title: '菜单', key: '5', isLeaf: true},
  {title: '菜单', key: '6', isLeaf: true},
  {title: '菜单', key: '7', isLeaf: true},
  {title: '菜单', key: '8', isLeaf: true},
  {title: '菜单', key: '9', isLeaf: true},
  {title: '菜单', key: '10', isLeaf: true},
  {title: '菜单', key: '11', isLeaf: true},
  {title: '菜单', key: '12', isLeaf: true},
  {title: '菜单', key: '13', isLeaf: true},
  {title: '菜单', key: '14', isLeaf: true},
  {title: '菜单', key: '15', isLeaf: true},
  {title: '菜单', key: '16', isLeaf: true},
  {title: '菜单', key: '17', isLeaf: true},
  {title: '菜单', key: '18', isLeaf: true},
];



@connect(({permissionsGrade, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class TenantGradeAdd extends Component {
  constructor() {
    super();
    this.state = {
      expandedKeys:[],
      apiModalVisible:false,
      checkedApiValues:[],
    }
  };

  //新增租户等级
  handleSubmit = (e) => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log(values);
      }
    });
  };


  changeExpandedKeys = (e) => {
    const {expandedKeys} = this.state;
    const {node: {props}} = e;
    const {key, isLeaf} = props.dataRef;
    if (isInArray(expandedKeys, key)) {
      const newKeys = expandedKeys.filter(i => i !== key)
      this.setState({expandedKeys: newKeys});
    } else {
      if (!isLeaf) {
        expandedKeys.push(key);
        this.setState({expandedKeys});
      }
    }
  };


  //展开/收起节点时触发
  onExpand = (onExpandedKeys, e) => {
    this.changeExpandedKeys(e);
  };

  //加载属性节点
  onLoadData = (treeNode) => {
    const {dispatch, organization} = this.props;
    const _this = this;
    const parentId = treeNode.props.dataRef.key;
    this.setState({
      treeNode: treeNode,
      parentId: parentId,
    });
    let unit_tree = organization.unit_tree;

    const params = {
      id: parentId,
    };
    return request(`/api/unit/tree?${stringify(params)}`).then(res => {
      const children = res.value;
      treeNode.props.dataRef.children = children;
      unit_tree = [...unit_tree];
      dispatch({
        type: "organization/unit_tree",
        payload: unit_tree,
      })
    });
  };

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<i
            className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                    title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} icon={<i
        className={item.type === 1 ? styles.icon_company : item.type === 2 ? styles.icon_mechanism : styles.icon_user}></i>}
                       dataRef={item}/>;
    });
  };

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  //打开接口列表
  openApiModal=()=>{
    this.setState({
      apiModalVisible:!this.state.apiModalVisible
    })
  }


  render() {
    const {expandedKeys,apiModalVisible,checkedApiValues} = this.state;

    const {history,checkedApiList} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const {getFieldDecorator} = this.props.form;
    const options = [
      { label: '公开', value: 1 },
      { label: '私有', value: 0 },
    ];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px',}}
          bordered={false}
        >
          <Card
            title={<span style={{color:'#3f89e1'}}>新增等级</span>}
          >
          <div className='mrgTB30' style={{width:500}}>
            <Form>
              <FormItem
                label="等级名称"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请输入等级名称!',
                    }],
                    //initialValue: details&&details.name
                  })(
                    <Input placeholder='请输入等级名称'/>
                  )
                }
              </FormItem>

              <FormItem
                label="等级描述"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('remarks', {
                    //initialValue: details&&details.name
                  })(
                    <TextArea rows={3} placeholder='请输入等级描述'/>
                  )
                }
              </FormItem>

              <FormItem
                label="菜单列表"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('menuIds', {
                    //initialValue: details&&details.name
                  })(
                    <div className={styles.formTree}>
                      <Tree
                        checkable
                        showIcon
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        onSelect={this.onSelect}
                        loadData={this.onLoadData}
                        onRightClick={this.rightClick}
                      >
                        {this.renderTreeNodes(treeData)}
                      </Tree>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label="接口列表"
                {...formItemLayout}
              >
                {
                  getFieldDecorator('apiIds', {
                    //initialValue: details&&details.name
                  })(
                    <div onClick={this.openApiModal} className={styles.ele_input_addStype}>
                      {checkedApiValues&&checkedApiValues?checkedApiValues.map((item,index)=>{
                        return(
                          <div className={styles.ele_input_style} key={index}>
                            <span>{item.name}</span>
                            <Icon onClick={(e) => {
                              this.delRoleValues(e, item)
                            }} style={{lineHeight: '28px'}} type="close"/>
                          </div>)
                      }):null}
                      <Icon className={styles.down_icon}  type="down" />
                    </div>
                  )
                }
              </FormItem>
            </Form>
          </div>
          </Card>

          <ApiList
            apiModalVisible={apiModalVisible}
            onCancelModal={this.openApiModal}
            handleRoleSubmit={(values)=>{
              this.setState({
                checkedApiValues:values,
              })
            }}
          />

          <div className='TxTCenter' style={{width:500,margin:'30px auto'}}>
            <Button type='primary' onClick={(e)=>{
              this.handleSubmit(e);
            }}>确定</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >返回</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
