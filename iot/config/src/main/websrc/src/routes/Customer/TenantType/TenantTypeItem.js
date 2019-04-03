import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card, Tree, Icon, Tooltip} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ApiList from "../../../components/ApiListModal";
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const {TextArea} = Input;

const TreeNode = Tree.TreeNode;

@injectIntl
@connect(({tenantType, permissions, loading, global}) => ({
  tenantType,
  permissions,
  global,
  loading: loading.effects['tenantType/fetch_addGradeList_action'],
  menuLoading: loading.effects['tenantType/fetch_userMenuList_action'],
}))
@Form.create()
export default class TenantTypeItem extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'tenantType/fetch_userMenuList_action',
      payload: null,
    });
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type: 'tenantType/fetch_gradeItem_action',
      payload: {id: item.id},
      callback: (res) => {
        let menusId = res.menus.map(i => {
          return i.id
        });
        let apiIds = res.apis.map(i => {
          return i.id
        });
        let pid = res.menus.map(i => {
          if (i.pid !== '0') {
            return i.pid
          }
        });
        let pIds = Array.from(new Set(pid)).filter(i => i);

        this.setState({
          checkedApiValues: res.apis,
          checkedKeys: menusId,
          expandedKeys: pIds,

        });
        this.props.form.setFieldsValue({menuIds: menusId});
        this.props.form.setFieldsValue({apiIds: apiIds});
      }

    })
  }


  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  renderTreeNodes = (data) => {
    const {global: {local}} = this.props;
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id}
                    dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={local === 'en' && item.englishName ? item.englishName : item.name} key={item.id}
                       dataRef={item}/>;
    });
  };

  onCheck = (checkedKeys) => {
    this.setState({checkedKeys});
    this.props.form.setFieldsValue({menuIds: checkedKeys})
  };


  render() {
    const {history, tenantType: {}, permissions: {menuTree}, match: {params: {data}}, intl: {formatMessage},} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {expandedKeys, apiModalVisible, checkedApiValues} = this.state;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 5},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const {getFieldDecorator} = this.props.form;

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px',}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 1000}}>
            <Form>
              <FormItem
                label={<FormattedMessage {...messages.typeName} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.typeAddName),
                    }],
                    initialValue: item.name
                  })(
                    <Input disabled/>
                  )
                }
              </FormItem>

              <FormItem
                label={<FormattedMessage {...basicMessages.describe} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('remarks', {
                    initialValue: item.remarks
                  })(
                    <TextArea disabled rows={4}/>
                  )
                }
              </FormItem>

              <FormItem
                label={<FormattedMessage {...basicMessages.menuList} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('menuIds', {
                    initialValue: item.menuIds
                  })(
                    <div className={styles.formTree}>
                      <Tree
                        checkable
                        showIcon
                        disabled
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        checkStrictly={true}
                        expandedKeys={expandedKeys}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                      >
                        {this.renderTreeNodes(menuTree)}
                      </Tree>
                    </div>
                  )
                }
              </FormItem>

              <FormItem
                label={<FormattedMessage {...basicMessages.apiList} />}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('apiIds', {
                    initialValue: item.apiIds
                  })(
                    <div className={styles.ele_input_addStype} style={{maxHeight: 200, lineHeight: '32px'}}>
                      {checkedApiValues && checkedApiValues ? checkedApiValues.map((item, index) => {
                        return (
                          <div className={styles.ele_input_style} key={index}>
                            <Tooltip title={item.complexName}>
                              <span className='list_break' style={{width: 90}}>{item.complexName}</span>
                            </Tooltip>
                            <Tooltip title={item.name}>
                              <span className='list_break' style={{width: 220}}>{item.name}</span>
                            </Tooltip>
                            <Tooltip title={item.dataUrl}>
                              <span className='list_break' style={{width: 180}}>{item.dataUrl}</span>
                            </Tooltip>
                            <span></span>
                          </div>)
                      }) : null}
                      <Icon className={styles.down_icon} type="down"/>
                    </div>
                  )
                }
              </FormItem>

            </Form>
          </div>

          <ApiList
            apiModalVisible={apiModalVisible}
            onCancelModal={this.openApiModal}
            handleRoleSubmit={(values) => {
              let apiMapIds = values.map(item => {
                return item.id;
              });
              this.props.form.setFieldsValue({apiIds: apiMapIds});
              this.setState({
                checkedApiValues: values,
              })
            }}
          />

          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button
              onClick={() => {
                history.goBack(-1);
              }}
            ><FormattedMessage {...basicMessages.return} /></Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
