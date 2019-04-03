import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Form, Input, Card} from 'antd';
import styles from '../Position.less';
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
export default class AdministrativeAreasItem extends Component {
  constructor() {
    super();
    this.state = {}
  };

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  render() {
    const {history, match: {params: {id}}, loading, position: {areaItems}, intl: {formatMessage}} = this.props;
    const item = areaItems[id];
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
      <div style={{border: 'solid 1px #d9d9d9', background: '#f7f7f7',}}>
        <div style={{
          lineHeight: '40px',
          textAlign: 'center',
          color: '#3f89e1',
        }}>{formatMessage(messages.areaDetails)}</div>
        <Card
          bodyStyle={{padding: '30px 32px 30px '}}
          bordered={false}
        >
          <div className='mrgTB30' style={{width: 500}}>
            <Form>
              <FormItem
                label={formatMessage(messages.areaName)}
                {...formItemLayout}
              >
                {
                  getFieldDecorator('name', {
                    rules: [{
                      required: true, //message: '请输入区域名称!',
                    }],
                    initialValue: item && item.name
                  })(
                    <Input disabled/>
                  )
                }

              </FormItem>

              <FormItem
                label={formatMessage(messages.areaCode)}

                {...formItemLayout}
              >
                {
                  getFieldDecorator('code', {
                    rules: [{
                      required: true, //message: '请输入区域代码!',
                    }],
                    initialValue: item && item.regionCode
                  })(
                    <Input disabled/>
                  )
                }

              </FormItem>
            </Form>
          </div>

        </Card>
      </div>
    );
  }
}
