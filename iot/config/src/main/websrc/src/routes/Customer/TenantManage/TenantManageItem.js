import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Form, Input, Select, Card} from 'antd';
import styles from '../Customer.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../messages/customer';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const {TextArea} = Input;
const Option = Select.Option;

@injectIntl
@connect(({tenantManage, loading}) => ({
  tenantManage,
  loading: loading.effects['tenantManage/fetch_editTenant_action'],
}))
@Form.create()
export default class TenantManageItem extends Component {
  constructor() {
    super();
    this.state = {
      see: false,
      modalVisible: false,
      modalUserVisible: false,
      gradeCheckedValue: null,
      roleCheckedValue: null,
    }
  };

  componentDidMount(){
    const {match: {params: {data}}} = this.props;
    const tenantManageItem = JSON.parse(decodeURIComponent(data));
    this.props.dispatch({
      type:'tenantManage/fetch_tenantItem_action',
      payload:{id:tenantManageItem.id},
      callback:(res)=>{
        let role = res.role&&res.role.length>0?res.role.map(o=>{
          return o
        }):[];
        let roleId = res.role&&res.role.length>0?res.role.map(o=>{
          return o.id
        }):[];


        this.setState({
          roleCheckedValue:role[0],
          defaultValue:res,
        })
      }
    })

    this.props.dispatch({
      type:'tenantManage/fetch_appListByTenant_action',
      payload:{tenantId:tenantManageItem.id},
    })
  }

  handleSubmit = (e) => {
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'tenantManage/fetch_editTenant_action',
          payload: values,
        })
      }
    });
  };

  changeSee = () => {
    this.setState({
      see: !this.state.see
    })
  };



  render() {
    const {history, loading, match: {params: {data}},tenantManage:{tenantItems,appListByTenant},intl:{formatMessage}} = this.props;
    const tenantManageItem = JSON.parse(decodeURIComponent(data));
    const item = tenantItems[tenantManageItem.id];
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };

    const columns = [{
      title: formatMessage(basicMessages.applicationName),
      dataIndex: 'name',
      key: 'name',
      className: 'table_row_styles',

    },  {
      title: formatMessage(basicMessages.creator),
      dataIndex: 'creatorName',
      key: 'creatorName',
      className: 'table_row_styles',

    }, {
      title: formatMessage(basicMessages.createTime),
      dataIndex: 'createTime',
      key: 'createTime',
      className: 'table_row_styles',
    }];

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0'}}
          bordered={false}
        >
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <p className='TxTCenter' style={{marginBottom: 18}}><FormattedMessage {...messages.tenantInformation} /></p>
                <FormItem
                  label={<FormattedMessage {...messages.tenantName} />}
                  {...formItemLayout}
                >
                  <Input value={tenantManageItem && tenantManageItem.name} disabled/>

                </FormItem>

                <FormItem
                  label={<FormattedMessage {...messages.category} />}
                  {...formItemLayout}
                >

                  <Input value={item && item.gradeName} disabled/>
                </FormItem>

                <FormItem
                  label={formatMessage(messages.abbreviation)}
                  {...formItemLayout}
                >

                  <Input disabled value={tenantManageItem && tenantManageItem.tag}/>
                </FormItem>

                <FormItem
                  label={formatMessage(messages.tenantDescribe)}
                  {...formItemLayout}
                >

                  <TextArea disabled value={tenantManageItem && tenantManageItem.remarks} rows={4}/>

                </FormItem>

                <FormItem
                  label={formatMessage(messages.tenantEnabled)}
                  {...formItemLayout}
                >

                  <Select disabled defaultValue={tenantManageItem&&tenantManageItem.valid}>
                    <Option value={true}>{formatMessage(basicMessages.yes)}</Option>
                    <Option value={false}>{formatMessage(basicMessages.no)}</Option>
                  </Select>

                </FormItem>

                <p className='TxTCenter'>{formatMessage(basicMessages.administrator)}</p>


                <FormItem
                  label={formatMessage(basicMessages.account)}
                  {...formItemLayout}
                >
                  {
                    <div>{item&&item.user&&item.user.userName}</div>
                  }
                </FormItem>

              </Form>
            </div>

            <p className='TxTCenter' style={{marginBottom: 18}}>{formatMessage(basicMessages.applicationList)}</p>

            <Table
              loading={loading}
              rowKey={record => record.id}
              columns={columns}
              dataSource={appListByTenant && appListByTenant}
              pagination={false}
            />
          <div className='TxTCenter' style={{width: 600, margin: '30px auto'}}>
            <Button
                    onClick={() => {
                      history.goBack(-1);
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
