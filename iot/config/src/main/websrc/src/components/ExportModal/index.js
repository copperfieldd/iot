import React, { Component } from 'react';
import basicMessages from '../../messages/common/basicTitle';

import {
  Button,
  Modal,
  Form,
  Select,
} from 'antd';

import styles from './index.less';
import {injectIntl} from "react-intl";

const FormItem = Form.Item;
const Option = Select.Option;
const formProps = {
    colon:false,
    labelCol:{span: 10},
    wrapperCol:{ span: 12 },
};
@injectIntl
export default class ExportModal extends Component{
    static defaultProps={
        text:'导出',
    }

    state={
        show:false,
    }

    handleModel = (e) => {
        if(e){
            e.stopPropagation();
        }
        const { show } = this.state;
        this.setState({show:!show});
    }

    handleOk = (e) => {
        e.stopPropagation();
        const { handleExport } = this.props;
        handleExport(this.handleModel)
    }

    render(){
        const { show } = this.state; 
        const { form, size, loading, disabled, text,intl:{formatMessage} } = this.props;
        const {getFieldDecorator} = form;
        return(
            <span style={{marginLeft:8}}>
                <Button onClick={(e)=>this.handleModel(e)} disabled={disabled} type="primary"  size={size}>{text}</Button>
                <Modal
                    wrapClassName={styles.modal}
                    className='dealModal_styles'
                    visible={show}
                    title={formatMessage(basicMessages.select_export_type)}
                    centered
                    footer={null}
                    onCancel={this.handleModel}
                >
                    <div className={styles.modal}>
                        <FormItem
                            {...formProps}
                            label={<span>{formatMessage(basicMessages.select_type)}：</span>}
                            >
                            {getFieldDecorator('excleType', {
                                initialValue:2
                            })(
                                <Select placeholder={formatMessage(basicMessages.select_export_type)}>
                                    <Option value={1}>office2003</Option>
                                    <Option value={2}>office2007</Option>
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <div style={{textAlign:'center',padding:'18px 0',borderTop:'1px solid #e8e8e8'}}>
                        <Button loading={loading} type="primary" onClick={this.handleOk}>{formatMessage(basicMessages.confirm)}</Button>
                        <Button onClick={this.handleModel} style={{marginLeft:16}}>{formatMessage(basicMessages.cancel)}</Button>
                    </div>
                </Modal>
            </span>
        )
    }
}
