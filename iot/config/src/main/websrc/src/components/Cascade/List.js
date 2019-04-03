import React, { Component, Fragment } from 'react';
import {
  Icon,
  List, 
  Spin,
  message,
} from 'antd';   
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './index.less';   
import Ellipsis from "../../components/Ellipsis";
import { FormattedMessage, injectIntl } from 'react-intl';
//import messages from '../../messages/devices';

//const brokenStatus=[<FormattedMessage {...messages.deviceTypeok} />,<FormattedMessage {...messages.unconfirmed} />,<FormattedMessage {...messages.confirmed} />];

@injectIntl
@connect(({ global, loading }) => ({
    global,
    loading: loading.effects['global/changeCascade'],
}))
export default class InfiniteList extends Component{
    state = {
        hasMore: true,
    }

    getData = () => {
        const { title, selected, dispatch, global:{ cityId, cascade_start } } = this.props;
        const level = title.level;
        let id;
        if(level !== 0){
            id = selected[level-1] && selected[level-1].id;
        }else{
            id = cityId;
        }
        const params = {
            count:10,
            level: level,
            id:id,
            start:cascade_start+10,
        }

        dispatch({
            type:'global/changeCascade',
            payload:{
                ...params,
            }
        })
    }

    handleInfiniteOnLoad = () => {
        let { data, intl:{formatMessage} } = this.props;
        if (data.length % 10 !== 0) {
            //message.warning(formatMessage(messages.loaded));
            this.setState({
                hasMore: false,
            });
            return;
        }
        this.getData();
    }

    render() {
        const { data, title, selected, loading } = this.props;
        const level = title.level;
        const noSelect = title.noSelect;
        const selectedId = selected[level] && selected[level].id || undefined;
        return (
            <div className= {styles.infinite_container}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                    dataSource={data}
                    renderItem={item => (
                        <List.Item key={item.id}>
                            <div style={{background: item.id===selectedId ? '#009efb' : 'transparent', color: '#666'}}  onClick={()=> !noSelect && this.props.handleClick(item,level+1)} className={styles.list_item}>
                                {
                                    !title.isLeaf ? (
                                        <div>
                                            <div style={{float: 'left',width:'80%'}}><Ellipsis tooltip lines={1}>{item.name}</Ellipsis></div>
                                            <span style={{float:'right'}}>
                                                <Icon type="caret-right" />
                                            </span>
                                        </div>
                                    ):(
                                        <div style={{float: 'left',width:'80%'}}><Ellipsis tooltip lines={1}>{item.name}</Ellipsis></div>
                                    )
                                }
                            </div>
                        </List.Item>
                    )}
                    >
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}
