import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Select,
  Card,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/equipment';
import basicMessages from '../../../messages/common/basicTitle';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
import * as routerRedux from "react-router-redux";

@connect(({equipmentAdapter, loading}) => ({
  equipmentAdapter,
  loading: loading.effects['equipmentAdapter/fetch_updAdpater_action'],
}))
@injectIntl
@Form.create()
export default class AdapterManageEdit extends Component {
  constructor() {
    super();
    this.state = {
      addressInputList: [],
    }
  };

  componentDidMount() {
    const {match: {params: {data}}} = this.props;
    this.loadAdapterItem(data);
  }

  loadAdapterItem = (data) => {
    this.props.dispatch({
      type: 'equipmentAdapter/fetch_adapterItem_action',
      payload: {id: data}
    })
  };

  handleSubmit = (e) => {
    const {match: {params: {data}}, equipmentAdapter: {adapterItems}} = this.props;
    const item = adapterItems[data];

    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'equipmentAdapter/fetch_updAdpater_action',
          payload: {...item, ...values},
        })
      }
    });
  };


  render() {
    const {match: {params: {data}}, equipmentAdapter: {adapterItems}, intl: {formatMessage}, loading} = this.props;
    const item = adapterItems[data];

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 15},
      },
    };
    const {getFieldDecorator} = this.props.form;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 600}}>
            <Form>
              <FormItem
                label={formatMessage(messages.adapterName)}
                {...formItemLayout}
              >
                <span>{item && item.name}</span>
              </FormItem>

              <FormItem
                label={formatMessage(messages.version)}
                {...formItemLayout}
              >
                <span>{item && item.version}</span>

              </FormItem>

              <FormItem
                label={formatMessage(messages.protocol)}
                {...formItemLayout}
              >
                <span>{item && item.protocol}</span>
              </FormItem>


              <FormItem
                label={formatMessage(basicMessages.describe)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('desc', {
                    rules: [{
                      max: 64, message: formatMessage(basicMessages.moreThan64)
                    }],
                    initialValue: item && item.desc
                  })(
                    <TextArea rows={4} placeholder={formatMessage(basicMessages.describeInput)}/>
                  )
                }

              </FormItem>
            </Form>
          </div>
          <div className='TxTCenter' style={{width: 500, margin: '30px auto'}}>
            <Button type='primary' loading={loading} onClick={(e) => {
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button className='mrgLf20'
                    onClick={() => {
                      this.props.dispatch(routerRedux.push(`/equipment/adapterManage`));
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>

        </Card>
      </PageHeaderLayout>
    );
  }
}
