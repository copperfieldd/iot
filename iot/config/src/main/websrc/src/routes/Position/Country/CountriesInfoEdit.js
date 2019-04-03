import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Button, Form, Input, Card,} from 'antd';
import styles from '../Position.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import * as routerRedux from "react-router-redux";
import {injectIntl} from 'react-intl';
import messages from '../../../messages/position';
import basicMessages from '../../../messages/common/basicTitle';


const FormItem = Form.Item;


@connect(({position, loading}) => ({
  position,
  loading: loading.effects['position/fetch_editCountry_action'],
}))
@injectIntl
@Form.create()
export default class CountriesInfoEdit extends Component {
  constructor() {
    super();
    this.state = {}
  };

  componentWillMount() {
  };

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  //添加
  handleSubmit = (e) => {
    const {match: {params: {data}}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {form} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'position/fetch_editCountry_action',
          payload: {id: item.id, ...values},
        });
      }
    });
  };

  render() {
    const {history, match: {params: {data}}, loading, intl: {formatMessage}} = this.props;
    const item = JSON.parse(decodeURIComponent(data));
    const {getFieldDecorator} = this.props.form;
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

    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '30px 32px 0 '}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 500}}>
            <Form>
              <FormItem
                label={formatMessage(messages.country)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, message: formatMessage(messages.countryInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: item && item.name
                  })(
                    <Input placeholder={formatMessage(messages.countryInput)}/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.code)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('code', {
                    rules: [{
                      required: true, message: formatMessage(messages.codeInput),
                    }, {
                      max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                    }],
                    initialValue: item && item.code
                  })(
                    <Input placeholder={formatMessage(messages.codeInput)}/>
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
                      this.props.dispatch(routerRedux.push('/position/countriesInfo'))
                    }}
            >{formatMessage(basicMessages.return)}</Button>
          </div>
        </Card>

      </PageHeaderLayout>
    );
  }
}
