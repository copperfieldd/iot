import React, { PureComponent, Fragment } from 'react';
import { Button, Icon } from 'antd';
import styles from './style.less';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from '../../messages/customer';
import basicMessages from '../../messages/common/basicTitle';

@injectIntl
export default class Query extends React.Component{
    render(){
        const { visible, handleOk, handleReset, handelCancel,intl:{formatMessage} } = this.props;
        const translateX = visible?'0':'100%';
        return(
            <div className={styles.query} style={{height:`calc(100% - 118px`,transform: `translateX(${translateX})`}}>
                <div className={styles.header}>
                    <Icon onClick={handelCancel} type="close" style={{fontSize: 20,marginLeft: 12,marginTop:15,cursor: 'pointer',float:'left'}}/>
                    <span style={{fontSize:14}}>{formatMessage(basicMessages.filter)}</span>
                </div>
                <div className={styles.content}>
                    { this.props.children }
                </div>
                <div className={styles.footer}>
                    <Button onClick={handleOk} type="primary">{formatMessage(basicMessages.search)}</Button>
                    <Button onClick={handleReset} type="primary" style={{marginLeft:48}}>{formatMessage(basicMessages.reset)}</Button>
                </div>
            </div>
        )
    }
}
