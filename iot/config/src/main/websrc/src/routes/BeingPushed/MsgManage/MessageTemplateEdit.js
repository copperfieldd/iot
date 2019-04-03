import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {
  Button,
  Form,
  Input,
  Card,
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@connect(({noInventory, loading}) => ({
  loading: loading.effects['noInventory/fetch_getNoInventoryList_action'],
}))
@Form.create()
export default class MessageTemplateEdit extends Component {
  constructor() {
    super();
    this.state = {

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
    const {history} = this.props;
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
    const {getFieldDecorator} = this.props.form;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '20px 32px 0px'}}
          bordered={false}
        >
          <Card
            title={
              <span style={{color: '#3f89e1'}}>修改模板</span>
            }
          >
            <div className='mrgTB30' style={{width: 600}}>
              <Form>
                <FormItem
                  label="模板名称"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '请输入模板名称!',
                      }],
                    })(
                      <Input placeholder='请输入模板名称'/>
                    )
                  }

                </FormItem>

                <FormItem
                  label="短信模板ID"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('id', {
                      rules: [{
                        required: true, message: '请输入短信模板ID!',
                      }],
                    })(
                      <Input placeholder='请输入短信模板ID'/>
                    )
                  }

                </FormItem>

                <FormItem
                  label="内容"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('description', {
                      rules: [{
                        required: true, message: '请输入内容!',
                      }],
                    })(
                      <TextArea rows={4} placeholder='请输入内容'/>
                    )
                  }

                </FormItem>
              </Form>
            </div>
          </Card>
          <div className='TxTCenter'  style={{width:500,margin:'30px auto'}}>
            <Button type='primary' onClick={(e)=>{
              this.handleSubmit(e);
            }}>确定</Button>
            <Button className='mrgLf20'
                    onClick={()=>{
                      history.goBack(-1);
                    }}
            >返回</Button>
          </div>



        </Card>
      </PageHeaderLayout>
    );
  }
}
