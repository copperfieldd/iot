import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal,Button } from 'antd';
import { stringify } from 'qs';
import request from '../../utils/request';

export default class CustomModal extends Component {
  constructor(){
    super();
    this.state={

    };
  }
  componentWillMount(){

  }

  render() {
    const {
      title,
      modalLoading,
      cancelModal,
      modalVisible,
      children,
      handleOnSubmit,
      isFooter = true,
      destroyOnClose = true,
      maskClosable = true,
      width = 450,
    } = this.props;
    return (
      <Modal
        width={width}
        title={title}
        className='dealModal_styles'
        visible={modalVisible}
        onOk={this.handleOk}
        onCancel={()=>cancelModal()}
        destroyOnClose={destroyOnClose}
        maskClosable={maskClosable}
        footer={
          isFooter?
              <div style={{textAlign: 'center'}}>
                <Button
                  loading={modalLoading}
                  type="primary"
                  onClick={
                    () => {handleOnSubmit && handleOnSubmit()
                  }}>确认
                </Button>
                <Button
                  onClick={() => {
                    cancelModal();
                  }}
                  style={{marginLeft: 16}}>取消
                </Button>
              </div>
          :null
        }
      >
        {children&&children}
      </Modal>
    )
  }

}
