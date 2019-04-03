import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Icon,
  Form,
  Input,
  Modal
} from 'antd';
import styles from '../../Warning.less';

import {injectIntl} from 'react-intl';
import basicMessages from '../../../../messages/common/basicTitle';

const FormItem = Form.Item;
@injectIntl
@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class ConfigAddressModal extends Component {
  constructor() {
    super();
    this.state = {
      messageConfigVisible: false,
      appConfigVisible: false,
      addressInputList: [],
      addressValue: [],
    }
  };

  componentWillReceiveProps(nextProps) {
    const {value, id} = nextProps;
    if (id && value && this.state.addressInputList.length === 0) {
      this.setState({
        addressInputList: value.emails
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
          value.push(values[key])
        }
        this.setState({
          addressValue: value
        });
        let newValue = value.filter(item => item);
        let email = {emails: newValue};
        handleSubmitData && handleSubmitData(email);
      }
    });
  };


  render() {
    const {visible, onCancel, title, value, intl: {formatMessage}} = this.props;
    const {addressInputList} = this.state;
    let emails = value ? value.emails : [];
    const formItemLayouts = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
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
            addressInputList.map((item, index) => {
              return (
                <FormItem
                  key={item}
                  colon={false}
                  label={<span></span>}
                  {...formItemLayouts}
                  style={{marginBottom: 10}}
                >
                  <div className={styles.address_config_box}>
                    {getFieldDecorator(`address${index}`, {
                      rules: [{
                        type: 'email', message: formatMessage(basicMessages.correctEmail),
                      }, {
                        max: 512, message: formatMessage(basicMessages.cannot_more_than_512)
                      }],
                      initialValue: emails[index]
                    })(
                      <Input/>
                    )
                    }
                    <Icon type="close" theme="outlined" className={styles.address_config_close} onClick={() => {
                      const value = this.state.addressInputList.filter((c, cIndex) => {
                        return c != item;
                      });
                      this.setState({
                        addressInputList: value
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
                  addressInputList: this.state.addressInputList.concat('address' + this.state.addressInputList.length + 1),
                })
              }}/>
            </div>
          </FormItem>
        </Form>

      </Modal>
    );
  }
}
