/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import { Select, Button,Tabs,Table,DatePicker } from 'antd';
import moment from 'moment';
/**
 * @table配置
 * @历史异常标记统计表部分
 */
 const tagHisTableHeader = [
  '异常编号',
  '锅炉编号',
  '标记名称',
  '企业类型',
  '开始时间',
  '结束时间',
  '标记依据',
  '判定结果',
  // '确认时间',
  // '确认人员',
];
const tagHisTableHeaderParamName = [
  'id',
  'boilernumber',
  'tagname',
  'factorytype',
  'starttime',
  'endtime',
  'tagbasis',
  'verifyresult',
  // 'confirmtime',
  // 'confirmuser',
];
const tagHisTableHeaderWidth = [80, 170, 100, 150, 120, 120, 250, 80];
const tagHisParamLen = tagHisTableHeaderWidth.length;
const tagHisTableHeaderColumns = [];
tagHisTableHeader.forEach((item, index) => {
  
  console.log('item', item);
  if(index===tagHisParamLen-1)return;
  const column={
    title: item,
    // dataIndex: `param${(index + 1).toString()}`,
    dataIndex: tagHisTableHeaderParamName[index],
    key: tagHisTableHeaderParamName[index],
    width: tagHisTableHeaderWidth[index]*2.1,
  }
  if (item === '开始时间') {
    column.render = (text, record) => (
      <span>
        {moment(moment.utc(record.starttime).valueOf()).format(
          'YYYY-MM-DD HH:mm:ss'
        )}
      </span>
    )
    tagHisTableHeaderColumns.push(column);
    return;
  }
  tagHisTableHeaderColumns.push(column);
});
tagHisTableHeaderColumns.push({
  title: tagHisTableHeader[tagHisParamLen-1],
    // dataIndex: `param${(index + 1).toString()}`,
    dataIndex: tagHisTableHeaderParamName[tagHisParamLen-1],
    key: tagHisTableHeaderParamName[tagHisParamLen-1],
    // width: tagHisTableHeaderWidth[tagHisParamLen-1],
});
/**
 * @table配置
 * @实时标记统计表部分
 */
 const tagRunTableHeader = [
  // '异常编号',
  '锅炉编号',
  '标记名称',
  '企业类型',
  '开始时间',
  '结束时间',
  '标记说明',
  '标记依据',
  '判定结果',
  // '确认时间',
  // '确认人员',
];
const tagRunTableHeaderParamName = [
  // 'id',
  'boilernumber',
  'tagname',
  'factorytype',
  'starttime',
  'endtime',
  'tagdescription',
  'tagbasis',
  'verifyresult',
  // 'confirmtime',
  // 'confirmuser',
];
const tagRunTableHeaderWidth = [80, 170, 100, 150, 120, 300, 250, 80];
const tagRunParamLen = tagRunTableHeaderWidth.length;
const tagRunTableHeaderColumns = [];
tagRunTableHeader.forEach((item, index) => {
  console.log('item', item);
  if(index===tagRunParamLen-1)return;
  const column={
    title: item,
    // dataIndex: `param${(index + 1).toString()}`,
    dataIndex: tagRunTableHeaderWidth[index],
    key: tagRunTableHeaderWidth[index],
    width: tagRunTableHeaderWidth[index]*1.8,
  }
  if (item === '开始时间') {
    column.render = (text, record) => (
      <span>
        {moment(moment.utc(record.starttime).valueOf()).format(
          'YYYY-MM-DD HH:mm:ss'
        )}
      </span>
    )
    tagRunTableHeaderColumns.push(column);
    return;
  }
  
  
  tagRunTableHeaderColumns.push(column);
});
tagRunTableHeaderColumns.push({
  title: tagRunTableHeader[tagRunParamLen-1],
    // dataIndex: `param${(index + 1).toString()}`,
    dataIndex: tagRunTableHeaderParamName[tagRunParamLen-1],
    key: tagRunTableHeaderParamName[tagRunParamLen-1],
    // width: tagRunTableHeaderWidth[tagRunParamLen-1],
});
console.log('是吗')
class DataTagComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runDataSource: [],
      hisDataSource: [],
      pagination: { pageSize: 20 },
      runtimeloading: false,
      historyLoading: false,
    };
  }

    onRangePickerChange = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.starttime = dateString[0];
        this.endtime = dateString[1];
        // this.fetchAlarmList();
      };
    
      onRangePickerOk = value => {
        console.log('onOk: ', value);
      };

       // 查询刷新历史标记
       checkTagHis = () => {
    this.fetchAlarmList();
  };

  render() {

    const {
      hisDataSource,
      runDataSource,
      pagination,
      runtimeloading,
      historyLoading,
    } = this.state;
    /**
     * @实时数据标记表
     */
   const tagRunTable = (
    <Table
           columns={tagRunTableHeaderColumns}
           dataSource={runDataSource}
           pagination={false}
           // locale={{ emptyText: '暂无数据' }}
           loading={runtimeloading}
           scroll={{ y: 280 }}
           /* bordered */
           size="small"
         />
  ) 
    /**
     * @历史异常标记表
     */
   const tagHisTable = (
     <Table
            columns={tagHisTableHeaderColumns}
            dataSource={hisDataSource}
            pagination={false}
            // locale={{ emptyText: '暂无数据' }}
            loading={historyLoading}
            scroll={{ y: 280 }}
            /* bordered */
            size="small"
          />
   ) 
      /**
     * @标签页部分
     * @历史异常标记标签页内容
     */
    /**
     * @历史异常标记标签页内容
     * @①时间筛选部分
     */
      const { RangePicker } = DatePicker;
      const timeRangeofTagHistory = (
        <RangePicker
        style={{
          // width: '350px',
          height: '1.2rem',
        }}
        defaultValue={[
          moment(moment().subtract(1, 'days'), 'YYYY-MM-DD HH:mm:ss'),
          moment(moment(), 'YYYY-MM-DD HH:mm:ss'),
        ]}
        showTime={{ format: 'HH:mm:ss' }}
        format="YYYY-MM-DD HH:mm:ss"
        onChange={this.onRangePickerChange}
        onOk={this.onRangePickerOk}
      />
      )
      /**
     * @历史异常标记标签页内容
     * @①时间筛选按钮
     */
    const checkTagHisBtn = (<Button className="tag-his-check-btn" onClick={this.checkTagHis}>查询</Button>)

      const tabTagHistoryContainer =(
      <div className="container">
        <div className="tag-history-timerange">{timeRangeofTagHistory}</div>
        <div className="tag-history-timerange-check">{checkTagHisBtn}</div>
        <div className="tag-history-table">{tagHisTable}</div>
      </div>
      ) 
    /**
     * @标签页部分
     * @标签页框架
     */
    const { TabPane } = Tabs;
    const tabContainer = (
      <Tabs
        defaultActiveKey="1"
        animated={{ inkBar: false, tabPane: false }}
        onChange={tabsCallback}
      >
        <TabPane
          forceRender="true"
          tab={<span style={{ fontSize: '1.5rem' }}>实时异常标记</span>}
          key="1"
        >
          {tagRunTable}
        </TabPane>
        <TabPane
          forceRender="true"
          tab={<span style={{ fontSize: '1.5rem' }}>历史异常标记</span>}
          key="2"
        >
          {tabTagHistoryContainer}
        </TabPane>
      </Tabs>
    );
    return (

      <div style={{backgroundColor:'#0E213E'}}>{tabContainer}</div>
    );
  }
}
     
export default DataTagComp;

// 标签页function模块
let tabIndex;
function tabsCallback(key) {
  console.log(key);
  if (key === '1') {
    tabIndex = 1;
  } else if (key === '2') {
    tabIndex = 2;
  }
  // eslint-disable-next-line no-use-before-define
//   adapterPage();
  console.log('tabIndex', tabIndex);
  // eslint-disable-next-line no-use-before-define
}
const css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `
/******** tabs标签页样式********/

.ant-tabs-ink-bar.ant-tabs-ink-bar-no-animated {
    background-color: #73FBFD;
}
.ant-tabs-nav .ant-tabs-tab{
   transition: color 0s cubic-bezier(0.645, 0.045, 0.355, 1); 
}

div[aria-selected='false']{
    color: #FFFFFF;
    font-weight: 500;
}
.ant-tabs-nav .ant-tabs-tab:hover {
    color: #FFFFFF;
    font-weight: 500;
}
.ant-tabs-nav .ant-tabs-tab-active {
    color: #73FBFD;
    font-weight: 500;
}
.ant-tabs-nav .ant-tabs-tab-active:hover {
    color: #73FBFD;
    font-weight: 500;
}

.ant-tabs-bar {
    border-bottom: 0px solid #e8e8e8;
}
.ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
  background-color:#73FBFD;
}
/******** tabs标签页内容样式及grid布局********/
#data-anamaly-tabs{
    position:relative;
    /*top:-10px;*/
    width:1400px;
    height:660px; 
    /* background: #09344C; */

}

.container {
  display: grid;
  grid-template-columns: 80fr 40fr 8fr 1fr;
  grid-template-rows: 1fr 20fr;
  gap: 0.5rem 0.5rem;
  grid-auto-flow: row dense;
  justify-content: stretch;
  align-content: stretch;
  justify-items: stretch;
  align-items: stretch;
  grid-template-areas:
    ". tag-history-timerange tag-history-timerange-check"
    "tag-history-table tag-history-table tag-history-table";
}

.tag-history-timerange { 
  grid-area: tag-history-timerange; 
  background-color:#0E213E;
  width: 31rem;
  height: 3.5rem;
  justify-self: end; 
  align-self: end; 
}

.tag-history-timerange-check {
   grid-area: tag-history-timerange-check;
   background:#0E213E
   width: 8rem;
   height: 3rem;
   justify-self: end; 
}

.tag-history-table {
   grid-area: tag-history-table;
   background-color:#0E213E;
   height:58rem;
   width: 140rem;
   justify-self: end; 
}
/***********时间筛选**************/
/*************************时间范围选择部分*********************/
/* .ant-calendar-picker, .ant-calendar-picker:hover, .ant-calendar-picker:focus, .ant-calendar-picker:active{
  border: 0px solid #00898B;
  font-size: 22px;
} */
.ant-calendar-picker-input.ant-input, .ant-calendar-picker-input.ant-input:hover, .ant-calendar-picker-input.ant-input:focus, .ant-calendar-picker-input.ant-input:active {
  line-height: 1.5rem;
  height: 2.8rem;
  width: 31rem;
  background: #0F203E;
  border: 1px solid #00898B;
  color: white;
  font-family: Source Han Sans CN;
  font-size:1.2rem;
}
span.ant-calendar-range-picker-separator {
  color:#03A3A5;
}
/* #statistic-table-header div */
.ant-calendar-last-day-of-month .ant-calendar-date[aria-disable='false'] {
    color: #000000;
    font-weight: 500;
}
.ant-calendar-date[aria-selected='false'] {
    color: #0000FF;
    font-weight: 500;
}
.ant-calendar-last-month-cell .ant-calendar-date, .ant-calendar-next-month-btn-day .ant-calendar-date, .ant-calendar-last-month-cell .ant-calendar-date:hover, .ant-calendar-next-month-btn-day .ant-calendar-date:hover {
    color: rgba(0, 0, 0, 0.25);
    background: transparent;
    border-color: transparent;
}
/*******************时间筛选按钮***************/
.tag-his-check-btn,.tag-his-check-btn:hover,.tag-his-check-btn:active,.tag-his-check-btn:focus,.tag-his-check-btn:not([disabled]):hover{
    /* width:90px;
    height:40px; */
    width:8rem;
    height:2.5rem;
    background:#0360A5;
    border-color: #0360A5;
    color:#FFFFFF;
    font-size:1.2rem;
}
/******************历史标记表**********************/
.ant-table-small > .ant-table-content .ant-table-header {
  background-color:  #09344C;
}
.ant-table-small > .ant-table-content .ant-table-placeholder, .ant-table-small > .ant-table-content .ant-table-row:last-child td {
  /* border-bottom: 0; */
  background: #09344C;
}
.ant-empty-description {
  margin: 0;
  color: white;
}
/* #root .ant-pagination {
  margin-top: 0px; 
} */

.ant-table-body::-webkit-scrollbar{
  height:2px;
  width:10px;
}
.ant-table-body::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(129, 129, 128, 0.85);
}
.ant-table-body::-webkit-scrollbar-track {
  -webkit-box-shadow: none;
  border-radius: 0;
  background: rgba(0, 4, 40, 0.06);
}
.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body {
    position: relative;
    left: 1px;
    top: -10px;
    /* border-left: 11px solid #888; */
    background: #09344C;
    padding: 0px 0px;
}

.ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-thead > tr > th {
    color: #FFFFFF;
    
}

.ant-table-small > .ant-table-content > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #09344C;
    border-bottom: 1px solid #e8e8e8;
}
.ant-table-small > .ant-table-content > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th {
    background-color: #09344C;
    border-bottom: 0px solid #e8e8e8;
}
.ant-table .ant-table-tbody > tr > td {
    border-bottom: 1px solid #00898B;
}
i.anticon.anticon-calendar.ant-calendar-picker-icon svg {
    color: white;
}
#root .ant-input:focus, .ant-modal .ant-input:focus, .ant-row .ant-input:focus, .ant-form-item .ant-input:focus, #root .ant-input-number:focus, .ant-modal .ant-input-number:focus, .ant-row .ant-input-number:focus, .ant-form-item .ant-input-number:focus, #root .ant-input:not(:disabled):hover, .ant-modal .ant-input:not(:disabled):hover, .ant-row .ant-input:not(:disabled):hover, .ant-form-item .ant-input:not(:disabled):hover, #root .ant-input-number:not(:disabled):hover, .ant-modal .ant-input-number:not(:disabled):hover, .ant-row .ant-input-number:not(:disabled):hover, .ant-form-item .ant-input-number:not(:disabled):hover {
    -webkit-box-shadow: none;
    box-shadow: none;
    border-color: #4a68ea;
    border-right:0px;
}
`;
document.getElementsByTagName('head')[0].appendChild(css);

// grid地址'https://grid.layoutit.com/?id=QIHrULg'