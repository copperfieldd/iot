import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {callStatusInfo, getUrl} from '../../utils/utils';
import {Checkbox, Alert, Icon, Input, Form, Select, Row, Col} from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import loginLogo from '../../assets/login_ch.png';
import wrap from '../../assets/wrap.png';
import ball from '../../assets/ball.png';
import {FormattedMessage, injectIntl} from 'react-intl';
import messages from '../../messages/common/basicTitle';


const FormItem = Form.Item;
const {Tab, UserName, Password, Mobile, Captcha, Submit} = Login;
const Option = Select.Option;

@Form.create()
@injectIntl
@connect(({login, loading, global}) => ({
  login,
  global,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    see: false,
    time: moment().format('x')
  }

  refreshCaptcha = () => {
    const time = moment().format('x');
    this.setState({
      time
    })
  };

  handleSubmit = (err, values) => {
    const {form: {validateFields}} = this.props;
    if (!err) {
      validateFields((err, params) => {
        if (!err) {
          this.props.dispatch({
            type: 'login/login',
            payload: {
              ...values,
              ...params
            },
            callback: () => {
              this.props.dispatch({
                type: 'global/fetch_getPlatMenu_action',
                payload: null
              })
            }
          });
        }
      })
    }
  };

  renderMessage = (content) => {
    const {intl: {formatMessage}} = this.props;
    return (
      <Alert style={{marginBottom: 24}} message={formatMessage(messages.username_password_wrong)} type="error"
             showIcon/>
    );
  };

  changeAutoLogin = (e) => {
    const autoLogin = e.target.checked;
    this.props.dispatch({
      type: 'login/changeAutoLogin',
      payload: {
        autoLogin: autoLogin,
      },
    });
  };

  changeSee = () => {
    const {see} = this.state;
    this.setState({
      see: !see,
    })
  };

  render() {
    const {login, submitting, login: {autoLogin}, form: {getFieldDecorator}, intl: {formatMessage}, global: {local}} = this.props;
    const {see, time} = this.state;
    const userInfo = localStorage.getItem('config_user') && JSON.parse(localStorage.getItem('config_user'));
    const loginName = userInfo && userInfo.username;
    const password = userInfo && userInfo.password;
    const type = userInfo && userInfo.type;
    return (
      <div>
        <div className={styles.left}>
          <div className={styles.wrap}>
            <img src={wrap} className={styles.wrapimg}/>
            <img src={ball} className={styles.ball}/>
          </div>
        </div>
        <div className={styles.main}>
          <Login
            onSubmit={this.handleSubmit}
          >
            <div style={{paddingTop: 20}}>
              {
                login.status !== 0 &&
                !login.submitting &&
                this.renderMessage(login.status)
              }
              <div className={styles.top}>
                <Row>
                  <Col span={11} style={{lineHeight: '36px'}}>
                    <img src={loginLogo} className={styles.loginLogo}/>
                  </Col>
                  <Col span={12}>
                    <span
                      className={local === 'en' ? styles.loginBoxs : styles.loginBox}>{formatMessage(messages.basic)}</span>
                  </Col>
                </Row>
              </div>
              <UserName defaultValue={loginName} name="username" placeholder="请输入账号"
                        rules={[{required: true, message: '账号不能为空'}]}/>
              <Password type={see ? 'text' : 'password'} defaultValue={password} name="password" placeholder="请输入密码"
                        rules={[{required: true, message: '密码不能为空'}]}
                        suffix={<Icon onClick={this.changeSee} style={{cursor: 'pointer'}} type="eye-o"/>}/>
              <FormItem
                //lable='登陆用户类型'
                style={{height: 40, lineHeight: '40px'}}
              >
                {
                  getFieldDecorator('type', {
                    rules: [{
                      required: true, message: '类型不能为空'
                    }],
                    initialValue: type ? type : 0
                  })(
                    <Select className={styles.loginType} style={{height: 40, lineHeight: '40px'}} placeholder='请选择登录角色'>
                      <Option value={0}>{formatMessage(messages.login_administrator)}</Option>
                      <Option value={1}>{formatMessage(messages.login_tenant)}</Option>
                      <Option value={3}>{formatMessage(messages.login_application)}</Option>
                    </Select>
                  )
                }
              </FormItem>
            </div>
            <div style={{overflow: 'hidden'}}>
              <span style={{float: 'left'}}><Checkbox style={{color: '#1890ff'}} defaultChecked={autoLogin}
                                                      onChange={this.changeAutoLogin}>{formatMessage(messages.remember)}</Checkbox></span>
              {/* <Link to="/user/forgetPassword" style={{ float: 'right',color:'#12c5cc' }} href="">忘记密码</Link> */}
            </div>

            <Submit loading={submitting} style={{
              background: '#12c5cc',
              color: '#fff',
              fontSize: 18
            }}>{formatMessage(messages.login)}</Submit>
            <div className={styles.other}>
              {/* <Link className={styles.register} to="/user/register">注册账户</Link> */}
            </div>
          </Login>
        </div>
      </div>
    );
  }
}
