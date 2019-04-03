import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip,Select } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import adminIcon from '../../assets/admin.png';
import styles from './index.less';
import {injectIntl} from "react-intl";
const Option = Select.Option;
import messages from '../../messages/common/basicTitle';
import {connect} from "dva";


@injectIntl
@connect(({ login, loading,global }) => ({
  login,
  global,
}))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  getNoticeData() {
    const { notices } = this.props;
    if (notices == null || notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      collapsed,
      isMobile,
      logo,
      onMenuClick,
      local,
      changeLocal,
      intl:{formatMessage},
      login:{loginInfo}
    } = this.props;
    let language= 'cn';
    if(local!=='cn' && local!=='en'){
      language = 'cn';
    }else{
      language = local;
    }
    const menu = (
      <div className='menu_div'>
        <div style={{display:'flex',padding:'4px 16px'}}>
          <Avatar className={styles.avatar} style={{marginTop:3}} src={adminIcon} />
          <div>
            <p style={{marginLeft:2,lineHeight:'18px'}}>{loginInfo&&loginInfo.loginName}</p>
            <p style={{marginLeft:2,lineHeight:'18px',display:'inline-block'}}> {loginInfo&&loginInfo.type===0?formatMessage(messages.login_administrator):loginInfo&&loginInfo.type===1?formatMessage(messages.login_tenant):formatMessage(messages.login_application)}</p>
          </div>
        </div>
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="updatePassword">
          <Icon type="user" style={{fontSize:16}}/>{formatMessage(messages.updatePassword)}
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon style={{fontSize:16}} type="logout" />{formatMessage(messages.logout)}
        </Menu.Item>
      </Menu>
      </div>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <span style={{marginLeft:12,color:'#fff',fontSize:20}}>{formatMessage(messages.basic)}</span>

        <span className={styles.country}>
            <Select defaultValue={language} onChange={changeLocal} style={{width:60}}>
              <Option value="cn">
                {/* <img src={cn} style={{marginRight:8}}/> */}
                中文
              </Option>
              <Option value="en">
                {/* <img src={en} style={{marginRight:8}}/> */}
                EN
              </Option>
            </Select>
          </span>
        <div className={styles.right}>
          <Icon type="mail" style={{cursor:'pointer',fontSize:20,color:'#fff',padding: 12,position: 'relative',top: 5}}/>
          {/* <NoticeIcon
            count={12}
          /> */}
          <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar className={styles.avatar} src={adminIcon} />
              </span>
          </Dropdown>
        </div>
      </div>
    );
  }
}
