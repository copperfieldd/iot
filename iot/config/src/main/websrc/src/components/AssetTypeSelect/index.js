import React, { Component } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';

const Option =  Select.Option;

@connect(({ global }) => ({
    global,
}))
export default class AssetTypeSelect extends Component {
    static defaultProps = {
        multiple:　false,
        disabled:false,
        labelInValue: false,
        placeholder:'请选择资产类别'
    }

    constructor(props) {
      super(props);
  
      const value = this.props.value;
      this.state = {
        value: value,
      };
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value) {
        const value = nextProps.value;
        this.setState({
          value : value
        });
      }else{
        this.setState({
          value : undefined
        });
      }
    }

    handleCurrencyChange = (currency) => {
        this.setState({ value:currency });
        this.triggerChange({ currency });
    }

    triggerChange = (changedValue) => {
      const current = changedValue.currency;
      const onChange = this.props.onChange;
      if (onChange) {
        onChange(current);
      }
    }  

    renderNodes = (data) => {
        return data.map((e,i)=>{
            return <Option key={i} value={e}>{e}</Option>
        })
    }

    componentDidMount(){
        const { dispatch } =this.props;
        dispatch({
            type:'global/fetch_asset_type',
        })
    }

    render() {
        const { value } = this.state;
        const { global:{asset_type}, placeholder, labelInValue, disabled, multiple } =this.props;
        return (
          <Select
              labelInValue={labelInValue}
              style={{ width: '100%' }}
              value={value}
              disabled={disabled}
              placeholder={placeholder}
              onChange={this.handleCurrencyChange}
              multiple = {multiple}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          >
            {this.renderNodes(asset_type)}
          </Select>
        );
    }
}