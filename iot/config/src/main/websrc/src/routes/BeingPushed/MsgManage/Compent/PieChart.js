import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Form, Row, Col} from 'antd';
import {Pie} from '../../../../components/Charts/index';
import messages from "../../../../messages/bushing";
import {injectIntl} from "react-intl";


@Form.create()
@injectIntl
export default class PieChart extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      tabKey: '1'
    }
  };


  render() {
    const {data1,data2,data3,style} = this.props;
    const {intl:{formatMessage}} = this.props;

    return (
      <Row gutter={16} style={style}>
        <Col span={8}>
          <Pie
            showLabel
            height={200}
            hasLegend={false}
            data={data1}
          />
          <p style={{textAlign:'center'}}>{formatMessage(messages.msg_push_success)}</p>
        </Col>
        <Col span={8}>
          <Pie
            showLabel
            height={200}
            hasLegend={false}
            data={data2}
          />
          <p style={{textAlign:'center'}}>{formatMessage(messages.msg_push_failed)}</p>

        </Col>
        <Col span={8}>
          <Pie
            showLabel
            height={200}
            hasLegend={false}
            data={data3}
          />
          <p style={{textAlign:'center'}}>{formatMessage(messages.msg_push_cancel)}</p>

        </Col>
      </Row>
    );
  }
}
