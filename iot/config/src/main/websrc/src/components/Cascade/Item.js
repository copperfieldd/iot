import React, { Component, Fragment } from 'react';
import {
  Card,
  Button,
  Icon,
  Col,
  Input,
  message,
} from 'antd';
import { connect } from 'dva';
import { Route, Redirect, Switch, Link,routerRedux } from 'dva/router';
import styles from './index.less';
import List from './List';
import { FormattedMessage, injectIntl } from 'react-intl';

@injectIntl
@connect(({ equipmentTypeManage, loading }) => ({
  equipmentTypeManage,
    loading: loading.effects['equipmentTypeManage/fetch_getFirstType_list_action'],
}))
export default class Item extends Component{
    state={
        show:false,
    }

    handleClick = () => {
        const { show } = this.state;
        this.setState({
            show:!show
        })
    }

    handleChange = (e) =>{
        const keyword = e.target.value;
        const { selected, title } = this.props;
        const nextLevel = title.level;
        let params  ={
                start:0,
                count:10,
                level:nextLevel,
        }
        if(keyword){
            params.keyword = keyword;
        }
        if(selected[nextLevel-1]){
            params.id=selected[nextLevel-1].id;
        }else{
            // message.warning('请先选择上一级菜单');
            return;
        }
        this.props.dispatch({
            type:'equipmentTypeManage/fetch_getFirstType_list_action',
            payload:{
                ...params,
            }
        });
    }

    render(){
        const { data, width, handleClick, title, selected, intl:{formatMessage} } = this.props;
        const { show } = this.state;
        return(
            <div className={styles.item} style={{width:width}}>
                <div className={styles.title_item}>
                    {title.name}
                    {
                        title.search && <span onClick={this.handleClick} style={{cursor:'pointer',float:'right',marginRight:6}}><Icon type="search" /></span>
                    }
                </div>
                <div className={styles.content_item}>
                    {
                        show && <span style={{position:'relative'}}>
                                    <Input
                                        //placeholder={`${formatMessage(messages.input)}${title.name}`}
                                        onChange={this.handleChange}
                                    />
                                    {/* <Icon onClick={this.handleSearch} style={{position:'absolute',color:'#fff',right:5,top:2,cursor:'pointer'}} type="search" /> */}
                                </span>
                    }
                    <List 
                        handleClick={handleClick} 
                        title={title} 
                        data={data}
                        selected={selected}
                    />
                </div>
            </div>
        )
    }
}
