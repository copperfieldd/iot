import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Form,
  Select,
  Modal, Col, Row,
} from 'antd';
import styles from '../../Equipment.less';
@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class DateMessageItemModal extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible:false,
      appConfigVisible:false,
      addressInputList:[],
    }
  };

  componentWillMount() {
  };

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };


  render() {
    const {visible,onCancel,title} = this.props;

    return (
      <Modal
        title={title}
        visible={visible}
        className='dealModal_styles'
        onCancel={()=>{
          onCancel()
        }}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={()=>{
              onCancel()
            }}>确认</Button>
            <Button onClick={()=>{
              onCancel()
            }} style={{marginLeft: 16}}>取消</Button>
          </div>
        }
      >
        <Row style={{width:400,margin:'20px auto'}}>
          <Col span={12} style={{textAlign:'right'}}>属性：</Col>
          <Col span={12} style={{textAlign:'left'}}>key1</Col>
        </Row>
        <Row style={{width:400,margin:'20px auto'}}>
          <Col span={12} style={{textAlign:'right'}}>属性：</Col>
          <Col span={12} style={{textAlign:'left'}}>key2</Col>
        </Row>
        <Row style={{width:400,margin:'20px auto'}}>
          <Col span={12} style={{textAlign:'right'}}>属性：</Col>
          <Col span={12} style={{textAlign:'left'}}>key3</Col>
        </Row>

      </Modal>
    );
  }
}
