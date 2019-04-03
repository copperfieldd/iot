import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Modal,
} from 'antd';
import styles from '../../Warning.less';

import {injectIntl} from 'react-intl';
import basicMessages from '../../../../messages/common/basicTitle';

const FormItem = Form.Item;
@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class ConfigMessageModal extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible: false,
      appConfigVisible: false,
      messageList: [],
      messageValue: [],
    }
  };


  componentWillReceiveProps(nextProps) {
    const {value, id} = nextProps;
    if (id && value && this.state.messageList.length === 0) {
      this.setState({
        messageList: value.messages,
      })
    }
  }

  changeVisible = () => {
    this.setState({
      visible: !this.state.visible,
    })
  };

  handleSubmit = (e) => {
    const {form, handleSubmitData} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let value = [];
      if (!err) {
        for (let key in values) {
          value.push(values[key]);
        }
        this.setState({
          messageValue: value
        });
        let newValue = value.filter(item => item);
        let messages = {messages: newValue};
        handleSubmitData && handleSubmitData(messages);
      }
    });
  };

  render() {
    const {visible, onCancel, title, value, intl: {formatMessage}} = this.props;
    const {messageList} = this.state;

    let message = value ? value.messages : [];
    const formItemLayouts = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };

    const {getFieldDecorator} = this.props.form;
    return (
      <Modal
        title={title}
        visible={visible}
        className='dealModal_styles'
        onCancel={() => {
          onCancel()
        }}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={(e) => {
              onCancel();
              this.handleSubmit(e);
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={() => {
              onCancel()
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          {
            messageList.map((item, index) => {
              return (
                <FormItem
                  key={item}
                  colon={false}
                  label={<span></span>}
                  {...formItemLayouts}
                  style={{marginBottom: 10}}

                >
                  <div className={styles.address_config_box}>
                    {getFieldDecorator(`message${index}`, {
                      rules: [
                        {
                          pattern: /^1[34578]\d{9}$/, message: formatMessage(basicMessages.correctPhone),
                        }
                      ],
                      initialValue: message[index]
                    })(
                      <Input/>
                    )}
                    <Icon type="close" theme="outlined" className={styles.address_config_close} onClick={() => {
                      const value = this.state.messageList.filter((c, cIndex) => {
                        return c != item;
                      });
                      this.setState({
                        messageList: value
                      })
                    }}/>
                  </div>
                </FormItem>
              )
            })
          }

          <FormItem
            colon={false}
            label={<span></span>}
            {...formItemLayouts}
          >
            <div style={{
              borderRadius: '25px',
              height: 25,
              width: 25,
              border: 'solid 1px #333',
              textAlign: 'center',
              lineHeight: '25px',
              marginTop: 10
            }}>
              <Icon type="plus" theme="outlined" onClick={() => {
                this.setState({
                  messageList: this.state.messageList.concat(`message` + this.state.messageList.length),
                })
              }}/>
            </div>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
