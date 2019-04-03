import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Icon, Form, Input, DatePicker, Select, Card, Modal, Button} from 'antd';
import styles from '../../Equipment.less';
import DataDealListModal from "../../Modal/DataDealListModal";
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../../../messages/equipment';
import basicMessages from '../../../../messages/common/basicTitle';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const TextArea = Input.TextArea;


@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@injectIntl
@Form.create()
export default class AddRuleModal extends Component {
  constructor() {
    super();
    this.state = {
      modalDataDealVisible:false,
      checkedDataDealValue:null,
    }
  };

  componentWillMount() {
  };

  changeModalDataDealVisible=()=>{
    this.setState({
      modalDataDealVisible:!this.state.modalDataDealVisible,
    })
  };

  handleSubmit = (e) => {
    const {form,handleValue} = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleValue&&handleValue(this.state.checkedDataDealValue)
      }
    });
  };


  render() {
    const {title,visible,onCancel,intl:{formatMessage}} = this.props;
    const {modalDataDealVisible,checkedDataDealValue} = this.state;
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
        className='dealModal_styles'
        visible={visible}
        destroyOnClose={true}
        onCancel={()=>{
          onCancel();
          this.setState({
            checkedDataDealValue:null,
          })
        }}
        footer={
          <div style={{textAlign: 'center'}}>
            <Button type="primary" onClick={(e)=>{
              this.handleSubmit(e);
              onCancel();
              this.setState({
                checkedDataDealValue:null,
              })
            }}>{formatMessage(basicMessages.confirm)}</Button>
            <Button onClick={()=>{
              onCancel();
              this.setState({
                checkedDataDealValue:null,
              })
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          <FormItem
            label={formatMessage(messages.equipmentRuleName)}
            {...formItemLayouts}
          >

            {
              getFieldDecorator('id', {
                rules: [{
                  required: true, message: formatMessage(messages.equipmentRuleName),
                }],
              })(
                <div onClick={this.changeModalDataDealVisible} className={styles.ele_input_addStype} style={{height: 35}}>
                  <div style={{padding: '0 8px', height: 35, lineHeight: '32px'}}>
                    <span>{checkedDataDealValue && checkedDataDealValue.name}</span>
                  </div>
                  <Input value={checkedDataDealValue && checkedDataDealValue.id} style={{display: 'none'}}/>
                  <Icon className={styles.down_icon} type="down"/>
                </div>
              )
            }


          </FormItem>

          <FormItem
            label={formatMessage(basicMessages.describe)}
            {...formItemLayouts}
          >
            <span>{checkedDataDealValue&&checkedDataDealValue.desc}</span>
          </FormItem>
        </Form>

        <DataDealListModal
          status={1}
          modalVisible={modalDataDealVisible}
          onCancelModal={this.changeModalDataDealVisible}
          handleCheckValue={(value) => {
            this.setState({
              checkedDataDealValue: value
            });
            this.props.form.setFieldsValue({id:value.id})
          }}
        />
      </Modal>
    );
  }
}
