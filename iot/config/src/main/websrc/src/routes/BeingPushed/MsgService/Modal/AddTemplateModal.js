import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Form, Row, Col, Modal, Radio, Button, Input} from 'antd';
import {getLoginUserType} from "../../../../utils/utils";

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const TextArea = Input.TextArea;
import basicMessages from "../../../../messages/common/basicTitle";
import {injectIntl} from 'react-intl';
import messages from "../../../../messages/bushing";

@Form.create()
@injectIntl
export default class AddTemplateModal extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      tabKey: '1',
      value: 1,
    }
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const {addTemplateModalVisible, title, onCancel, isEdit, isDetails, handleSubmit, loading2,commentValue,isExamine,} = this.props;
    let userType = getLoginUserType();
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };
    const {intl: {formatMessage}} = this.props;
    const {getFieldDecorator} = this.props.form;

    return (
      <Modal
        title={isEdit ? formatMessage(messages.msg_template_item) : formatMessage(messages.msg_new_template)}
        visible={addTemplateModalVisible}
        className='dealModal_styles'
        destroyOnClose={true}
        width={750}
        onCancel={() => {
          onCancel()
        }}
        footer={
          <div style={{textAlign: 'center'}}>

            {!isDetails&&!isExamine?
              <Button type="primary" loading={loading2} onClick={(e) => {
                const {form} = this.props;
                e.preventDefault();
                form.validateFieldsAndScroll((err, values) => {
                  if (!err) {
                    handleSubmit && handleSubmit(values)
                  }
                });
              }}>{formatMessage(basicMessages.confirm)}</Button>:null
            }
            {
              isExamine&&!isDetails? <Button type="primary" loading={loading2} onClick={(e) => {
                const {form} = this.props;
                e.preventDefault();
                form.validateFieldsAndScroll((err, values) => {
                  if (!err) {
                    handleSubmit && handleSubmit(values)
                  }
                });
              }}>{formatMessage(basicMessages.auditor)}</Button>:null
            }

            <Button onClick={() => {
              onCancel()
            }} style={{marginLeft: 16}}>{formatMessage(basicMessages.cancel)}</Button>
          </div>
        }
      >
        <Form>
          <FormItem
            label={formatMessage(messages.msg_service_template_type)}
            {...formItemLayout}
            style={{marginBottom: '12px'}}

          >
            {
              getFieldDecorator('type', {
                rules: [{
                  required: true, message: formatMessage(messages.msg_select_template_type),
                }],
                initialValue:commentValue&&commentValue.type
              })(
                <RadioGroup disabled={isDetails}>
                  <Radio value={1}>{formatMessage(basicMessages.verification_code)}</Radio>
                  <Radio value={2}>{formatMessage(messages.msg_message_notice)}</Radio>
                  <Radio value={3}>{formatMessage(messages.msg_promote_SMS)}</Radio>
                </RadioGroup>
              )
            }
          </FormItem>
          <FormItem
            label={formatMessage(messages.msg_service_template_name)}
            {...formItemLayout}
            style={{marginBottom: '12px'}}

          >
            {
              getFieldDecorator('title', {
                rules: [{
                  required: true, message: formatMessage(messages.msg_input_template_name),
                },{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
                initialValue:commentValue&&commentValue.title
              })(
                <Input disabled={isDetails} placeholder={formatMessage(messages.msg_input_template_name)}/>
              )
            }

          </FormItem>
          <FormItem
            label={formatMessage(messages.msg_service_message_template_content)}
            {...formItemLayout}
            style={{marginBottom: '12px'}}

          >
            {
              getFieldDecorator('content', {
                rules: [{
                  required: true, message: formatMessage(messages.msg_input_template_content),
                },{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
                initialValue:commentValue&&commentValue.content
              })(
                <TextArea disabled={isDetails} rows={3} placeholder={formatMessage(messages.msg_input_template_content)}/>
              )
            }

          </FormItem>

          <FormItem
            label={formatMessage(messages.msg_template_explain)}
            {...formItemLayout}
            style={{marginBottom: '12px'}}
          >
            {
              getFieldDecorator('explain', {
                rules: [{
                  required: true, message: formatMessage(messages.msg_input_template_explain),
                },{
                  max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                }],
                initialValue:commentValue&&commentValue.explain
              })(
                <TextArea disabled={isDetails&&!isExamine} rows={3} placeholder={formatMessage(messages.msg_input_template_explain)}/>
              )
            }

          </FormItem>

          {userType===0||isDetails?
            <FormItem
              label={formatMessage(messages.msg_template_id)}
              {...formItemLayout}
              style={{marginBottom: '12px'}}
            >
              {
                getFieldDecorator('code', {
                  rules: [{
                    required: true, message: formatMessage(messages.msg_input_template_id),
                  },{
                    max:512,message:formatMessage(basicMessages.cannot_more_than_512)
                  }],
                  initialValue:commentValue&&commentValue.code
                })(
                  <Input disabled={isDetails&&!isExamine} placeholder={formatMessage(messages.msg_input_template_id)}/>
                )
              }

            </FormItem> :null}

        </Form>

        {
          (!isDetails||userType!==0)||isExamine ?
            <div style={{fontSize: '12px', padding: '0px 12px'}}>

              <p>短信模板需明确表述短信发送的实际内容，禁止发送一切有关黄赌毒、党政军、诈骗等违法内容</p>

              <p>短信模板可以包含变量，变量前后需加文字说明，以体现模板使用者的商业意图，不支持仅为变量或多个变量的组合，如：</p>

              <p>你好：$ &#123;content&#125;</p>

              <p>你好：$&#123;name&#125;，$&#123;content&#125;</p>

              <p>变量表示实际发送短信时，用户希望自定义变化的内容，固定格式如：$&#123;name&#125;、$&#123;content&#125;等，中间字母应代表变量属性； &#123; super&#125;内变量命名规则：首字母必须为英文字母、只支持字母、数字和下划线组成，不能为纯数字，同时不能为email、mobile、id、nick、site等</p>

              <p>验证码短信格式</p>

              <p>模板必须含验证码，注册码，校验码，动态码这4个词其中之一；</p>

              <p>模板必须包含使用平台，失效时间，用途其中之一</p>

              <p>模板只支持一个变量单位</p>

              <p>通知短信格式</p>

              <p>模板不允许出现相同的变量名称，例如：您家宝贝$&#123;name&#125;已经到达$&#123;name&#125;现场！</p>

              <p> 模板不支持短链接与变量直接组合的格式。例如:t.cn$&#123;code&#125;，t.cn为短链接，$&#123;code&#125;为变量</p>

              <p>营销推广短信格式</p>

              <p>营销推广短信不支持变量</p>

              <p>营销推广短信内容后面需要添加退订方式，支持TD或T或N进行短信退订回复,其它回复参数不支持</p>

              <p>持发送未经许可的发送行为，主要指邀请注册、邀请成为会员的商业性信息</p>
            </div> : null
        }


      </Modal>
    );
  }
}
