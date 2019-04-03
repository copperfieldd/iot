import React, {Component, Fragment} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Table, Button, Icon, Badge, Form, Card} from 'antd';
import styles from '../Equipment.less';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import Query from "../../../components/Query/index";
import { Resizable } from 'react-resizable';


//Resizable构造拖拽表格列
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th {...restProps} />
    </Resizable>
  );
};

@connect(({equipment, loading}) => ({
  equipment,
  loading: loading.effects['equipment/fetch_getLogList_action'],
}))
@Form.create()
export default class LogManage extends Component {
  constructor() {
    super();
    this.state = {
      columns: [{
        title: '实体类型',
        dataIndex: 'name',
        key: 'name',
        className:'table_row_styles',
        width:100,
      }, {
        title: '实体名称',
        dataIndex: 'source',
        key: 'source',
        className:'table_row_styles',
        width:100,
      },{
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        className:'table_row_styles',
        width:100,

      },{
        title: '状态',
        dataIndex:'status',
        key: 'status',
        className:'table_row_styles',
        width:100,

      },{
        title: '日志详情',
        dataIndex:'details',
        key: 'details',
        className:'table_row_styles',
        width:100,

      },{
        title: '日志时间',
        dataIndex:'time',
        key: 'time',
        className:'table_row_styles',
        width:100,
      }],
    }
  };

  componentDidMount(){
    const {equipment:{logList_params}} = this.props;
    this.loadLogList(logList_params);
  }

  loadLogList=(params)=>{
    this.props.dispatch({
      type:'equipment/fetch_getLogList_action',
      payload:params,
    })
  };

  /****拖拽表格必要方法*****/
  components = {
    header: {
      cell: ResizeableTitle,
    },
  };


  //拖拽的方法
  handleResize = index => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  /****拖拽表格必要方法*****/


  changeTablePage=(pagination)=>{
    const {equipment:{logList_params}} = this.props;
    const params = {
      ...logList_params,
      start:(pagination.current -1) *logList_params.count,
    }
    this.loadLogList(params);

  };


  handelVisible=()=>{
    this.setState({
      visible:!this.state.visible,
    })
  }

  render() {
    const {equipment:{logList_params,logList}} = this.props;

    const paginationProps = {
      pageSize:logList_params.count,
      total:logList.totalCount,
      current:(logList_params.start / logList_params.count) +1,
    };

    //构造列元素columns
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: column => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));


    const {visible} = this.state;
    return (
      <PageHeaderLayout>
        <div className='topline_div_style'>
          <div className='topline_style' style={{width: 'calc(100% - 248px)'}}></div>
        </div>
        <Card
          bodyStyle={{padding: '6px 32px'}}
          bordered={false}
        >
          <div className='mrgTB12 dlxB'>
            <div>
            </div>

            <div>
              <span className='search' onClick={() => {
                this.setState({
                  visible: true,
                })
              }}><Icon className='query_icon' type="search"/>筛选</span>
            </div>
            <Query
              visible={visible}
              handelCancel={this.handelVisible}
              handleOk={this.handleOk}
              //handleReset={this.handleReset}
            >
              {/*{queryForm}*/}
            </Query>
          </div>
          <Table
            //bordered
            rowKey={record => record.id}
            dataSource={logList&&logList.value}
            columns={columns}
            pagination={paginationProps}
            onChange={this.changeTablePage}
            components={this.components}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
