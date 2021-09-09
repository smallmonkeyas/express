/*
 * @Author: your name
 * @Date: 2021-04-20 21:21:44
 * @LastEditTime: 2021-04-21 01:54:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \components\src\controls\dataAnamaly\anamalyDetectChartTab\anamalyDetectChartTab_test183_v0420_2.js
 */

/* eslint-disable prefer-destructuring */

/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */

/* eslint-disable import/no-unresolved */
import React, { Component, lazy, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import {
  Select,
  Button,
  Table,
  DatePicker,
  Input,
  Tabs,
  Popconfirm,
  message,
} from 'antd';
import moment from 'moment';
import Highcharts from '../Highcharts-8.2.2/code/highcharts';

window.moment = moment;
window.Highcharts = Highcharts;
// const path = require('path');
const bgAnamalyTotal =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异动数/bg_anamalyTotal.svg';
const bgAnamalyTotalIcon =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异动数/bg_anamalyTotalIcon.svg';
const bgAnamalyProcessed =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异动数/bg_anamalyProcessed.svg';
const bgAnamalyProcessedIcon =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异动数/bg_anamalyProcessedIcon.svg';
const bgAnamalyNoTreat =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异动数/bg_anamalyNoTreat.svg';
const bgAnamalyNoTreatIcon =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异动数/bg_anamalyNoTreatIcon.svg';
const bgAnamalyDetectFormLogo =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异常检测表/bg_anamaly_detect_form_logo.svg';
const bgAnamalyParamTopLeft =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异常检测参数表/bg_anamalyParamTopLeft.svg';
const bgAnamalyParamTopRight =
  'resource/App_6b8d684522bb4c3eb492e1a02110eb80/img/异动分析/异常检测参数表/bg_anamalyParamTopRight.svg';
Highcharts.setOptions({
  global: {
    useUTC: false,
  },
});
/*
 * 选择器设置-下拉框内容设置
 */
const { Option } = Select;
const staticChildren = [];
const equipmentChildren = [];
const anamalyLevelChildren = [];
const anamalyCatagoryChildren = [];
// G1
const staticSelectArr = ['已处理', '待处理'];
const equipmentSelectArr = ['设备1', '设备2', '设备3'];
const anamalyLevelSelectArray = [1, 2, 3, 4];
const alarmTypeArr = [
  '其它',
  '数据缺失',
  '陡升陡降',
  '关联度异常',
  '恒值异常',
  '满屏跳',
  '排放超标',
  '设备异常',
  '设限值',
  '数据超范围',
  '去除率异常',
];
const anamalyCatagorySelectArr = [
//   '满屏跳',
  '恒值异常',
   '数据缺失',
  '设限值',
  //   '相关性异常',
//   '陡升陡降',
];
staticSelectArr.forEach(item => {
  staticChildren.push(<Option key={item}>{item}</Option>);
});
equipmentSelectArr.forEach(item => {
  equipmentChildren.push(<Option key={item}>{item}</Option>);
});
anamalyLevelSelectArray.forEach(item => {
  anamalyLevelChildren.push(<Option key={item}>{item}</Option>);
});
anamalyCatagorySelectArr.forEach(item => {
  anamalyCatagoryChildren.push(<Option key={item}>{item}</Option>);
});

/**
 * @table配置
 * @异常统计表部分
 */
const anamalyTableHeader = [
  '异常编号',
  '发生时间',
  //   '异常设备',
  '异常类型',
  '位号名称',
  '异常位号',
  '管理状态',
  '异常等级',
  '确认时间',
  '确认人员',
];
// const anamalyTableHeaderParamName = [
//   'id',
//   'startTime',
//   'equipment',
//   'anamalyCatagory',
//   'propDisName',
//   'propName',
//   'processingStatic',
//   'anamalyLevel',
//   'verifyTime',
// ];
const anamalyTableHeaderParamName = [
  'id',
  'starttime',
  //   'devicename',
  'description',
  'sourceshowname',
  'sourcename',
  'processingstatic',
  'priority',
  'confirmtime',
  'confirmuser',
];
const anamalyTableHeaderWidth = [80, 170, 120, 150, 120, 120, 80, 170, 80];
const columns = [];
// columns.push({
//   title: '时间',
//   dataIndex: 'time',
//   key: 'time',
//   width: 140,
//   align: 'left',
// });

// anamalyTableHeader.forEach((item, index) => {
//   console.log('item', item);
//   columns.push({
//     title: item,
//     // dataIndex: `param${(index + 1).toString()}`,
//     dataIndex: anamalyTableHeaderParamName[index],
//     key: anamalyTableHeaderParamName[index],
//     width: anamalyTableHeaderWidth[index],
//   });
// });

/* columns.push({
  title: '操作',
  key: 'action',
  dataIndex: 'action',
  render: (text, record) => (
    <div id="table-action">
      <Button
        size="small"
        disabled={record.action === '1'}
        className={record.action === '1' ? 'btn-processed' : 'btn-untreated'}
      >
        确认
      </Button>
      <Button size="small">删除</Button>
    </div>
  ),
});
console.log(columns); */
// 数据初始化
/* const data = [];

for (let ii = 1; ii < 10; ii += 1) {
  const dataCell = {};
  dataCell.key = ii.toString();
  // eslint-disable-next-line no-loop-func
  columns.forEach(item => {
    // console.log(item.dataIndex);
    dataCell[item.dataIndex] = item.dataIndex + ii.toString();
  });
  data.push(dataCell);
} */

// const dataCell = {};
// dataCell.key = ii.toString();
// columns.forEach(item => {
//   dataCell[item.dataIndex] = `item ${ii.toString()}`;
// });
// data.push(dataCell);
/**
 * @table配置
 * @参数表部分
 */
const paramTableHeader = ['序号', '数值', '单位'];
const paramTablePropName = ['id', 'propValue', 'unit'];
const paramTableHeaderWidth = [80, 90, 80];
const columnsParam = [];
paramTableHeader.forEach((item, index) => {
  columnsParam.push({
    title: item,
    dataIndex: paramTablePropName[index],
    key: paramTablePropName[index],
    width: paramTableHeaderWidth[index],
  });
});
columnsParam.push({
  title: '时间',
  dataIndex: `time`,
});
// const dataParam = [];
// let jj = 1;

// for (jj; jj < 100; jj += 1) {
//   const dataParamCell = {};
//   //   dataCell = {};
//   dataParamCell.key = jj.toString();
//   // eslint-disable-next-line no-loop-func
//   columnsParam.forEach(item => {
//     // console.log(item.dataIndex);
//     dataParamCell[item.dataIndex] = `item ${jj.toString()}`;
//   });
//   dataParam.push(dataParamCell);
// }
/**
 * @function模块
 */
const parmseToObject = function() {
  let parmse = window.location.search;
  if (!parmse) return {};
  parmse = parmse.replace(/\?/, '').split('&');
  const obj = {};
  parmse.forEach(item => {
    const o = item.split('=');
    obj[o[0]] = o[1];
  });
  return obj;
};
/**
 * @时间筛选
 */
let chart;
/* const onRangePickerChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
    this.starttime = dateString[0];
    this.endtime = dateString[1];
  };
 */
const onRangePickerOk = value => {
  console.log('onOk: ', value);
};

const onSearch = value => console.log(value);
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
  adapterPage();
  console.log('tabIndex', tabIndex);
  // eslint-disable-next-line no-use-before-define
}
/**
 * @时间转换
 */
function utc2beijing(dateForm) {
  if (dateForm === '') {
    // 解决deteForm为空传1970-01-01 00:00:00
    return '';
  }
  const dateee = new Date(dateForm).toJSON();
  const date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '');
  return date;
}
/**
 * @页面适配
 */
function adapterPage() {
  const radio = document.documentElement.clientWidth / 1400;
  console.log('radio', radio + 10);
  document.querySelector(
    '#data-anamaly-tabs'
  ).style.transform = `scale(${radio.toString()})`;
  document.querySelector('#data-anamaly-tabs').style.webkitTransformOrigin =
    '0% 0%';
  document.querySelector('#data-anamaly-tabs').style.transformOrigin = '0% 0%';
  //   if (tabIndex === 1) {
  //     document.querySelector('.draw_g6CsK').style.height = `${Math.floor(
  //       680 * radio
  //     ).toString()}px`;
  //     return;
  //   }
  //   document.querySelector('.draw_g6CsK').style.height = `${Math.floor(
  //     680 * radio
  //   ).toString()}px`;
  // console.log(Math.round(897*radio).toString()+'px')
}

/**
 * @历史数据异步请求
 */
const objName = 'GK_CZ_JT_DEWS';
const propName = 'E101F1';
const startTime = '2021-04-13T10:32:28Z';
const endTime = '2021-04-13T13:32:28Z';
const inputs = {
  objName,
  propNames: [propName],
  startTime,
  endTime,
  limit: '500',
  pageNo: '1',
};

function getPropertiesHistoryService(inputsParam) {
  return new Promise(resolve => {
    scriptUtil.excuteScriptService(
      {
        objName: 'HistoryDataInterface', // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: 'getPropertiesHistory', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { inputs: JSON.stringify(inputsParam) },
      },
      res => {
        resolve(res);
        // result = res;
        // console.log('res',res)
        // result = res
      }
    );
  });
}
function getPropsList(objName) {
  return new Promise(resolve => {
    scriptUtil.excuteScriptService(
      {
        objName: 'HistoryDataInterface', // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: 'getPropInfoByObj', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { obj: objName },
      },
      res => {
        resolve(res);
        // result = res;
        // console.log('res',res)
        // result = res
      }
    );
  });
}

async function getSinglePropHis(obj, prop, starttime, endtime) {
  let ii = 1;
  const resArr = [];
  inputs.objName = obj;
  inputs.propNames = [prop];
  inputs.startTime = starttime;
  inputs.endTime = endtime;
  // let res = await getPropertiesHistory(inputs)
  // if(res.code==='200'&&res.result.list[0].hasNext){
  //   resArr.push(...res.result.list[0][prop])
  // }
  let res = { code: '200' };
  console.log('hhh');
  console.log('res', res);
  // const hasNext=true
  while (res.code === '200') {
    console.log(ii);
    inputs.pageNo = ii.toString();
    console.log('inputs', inputs);
    res = await getPropertiesHistoryService(inputs);
    console.log('res1', res);
    // const dataResObj=res.result.list[0]
    const dataResObj = res.result ? res.result.list[0] : {};
    if (!dataResObj) break;
    console.log('dataResObj', dataResObj);
    if (Object.keys(dataResObj).length > 0) {
      resArr.push(...dataResObj[prop]);
      if (!dataResObj.hasNext) break;
      ii += 1;
      console.log('res2-ii', ii);
    }
  }
  // var result = await Promise.all(resArr)
  // return result
  return resArr;
}
// const myAsnc = getSinglePropHis('GK_CZ_JT_DEWS','E101F1','2021-04-13T10:32:28Z','2021-04-13T13:32:28Z')
// myAsnc.then(resArr=>{console.log('myAsnc',resArr,resArr.length)}).catch((e) =>
// console.log(e)
// );
function cutPropsArrByAllList(propsArr) {
  const factoryListName = [
    '常州市光大高新环保新能源（常州）有限公司',
    '连云港光大城乡再生能源（灌云）有限公司',
    '淮安市明通环保工程有限公司',
  ];
  const propsArrSelect = [];
  const factoryList = ['GK_CZ_GD_GXHB', 'GK_LYG_GDCXZSNY', 'GK_HA_MT_WSCL'];
  factoryList.forEach(item => {
    const reg = new RegExp(`${item}`, 'g');
    propsArr.forEach(item => {
      if (item.search(reg) === 0) {
        propsArrSelect.push(item);
      }
    });

    // let n = arr[3].search(reg)
  });
  return propsArrSelect;
}

async function getAllPropsHisData(obj, starttime, endtime) {
  const res = await getPropsList(obj);
  let propList = [];
  let propHisArr = [];
  const propsHisArr = [];
  let propsHisArrObj = {};
  if (res.code === '200') {
    const propListOrgin = res.result;
    propList = cutPropsArrByAllList(propListOrgin);
    console.log('propList', propList);
    // var prop = propList[9]
    for (let ii = 0; ii < propList.length; ii += 1) {
      const prop = propList[ii];
      propHisArr = await getSinglePropHis(obj, prop, starttime, endtime);
      const propsHisArrItem = {};
      propsHisArrItem[prop] = propHisArr;
      console.log('propsHisArrItem', propsHisArrItem);
      propsHisArr.push(propsHisArrItem);
    }
    // propList.forEach(item =>{
    //   const prop=item
    //   // console.log('prop',prop)
    //   (async () => {
    //     console.log(obj)
    //     propHisArr =await getSinglePropHis(obj,prop,starttime,endtime)
    //     propsHisArr.push({prop:propHisArr})

    // })();
    // // nothing else
    // // propHisArr =await getSinglePropHis(obj,prop,starttime,endtime)
    // // propsHisArr.push({prop:propHisArr})
    // })
  }
  propsHisArrObj = { list: propsHisArr };
  console.log('propList', propList);
  console.log('propHisArr', propHisArr);
  console.log('propsHisArrObj', propsHisArrObj);
  return propsHisArrObj;
}

// const propListPromise = getAllPropsHisData(
//   'FactoryList',
//   '2021-04-01T00:00:00Z',
//   '2021-04-17T14:00:00Z'
// );
// propListPromise.then(propsHisArrObj => {
//   console.log('propListPromise', propsHisArrObj);
// });
function convertHisData(hisData) {
  let res = {};
  const arrArrAlermData = [];
  const objArrAlermData = [];
  console.log('hisData.length', hisData.length);
  hisData.forEach((item, index) => {
    arrArrAlermData.push([moment.utc(item.time).valueOf(), item.numberValue]);
    objArrAlermData.push({
      id: index.toString(),
      propValue: item.numberValue,
      //   unit: 'mg/l',
      unit: '',
      time: moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
    });
  });
  res = { arrArrAlermData, objArrAlermData };
  return res;
}
/**
 * @后端数据交互模块
 * @获取历史报警数据并保存至后端数据库
 * *******
 * @获取企业对象实例下的属性信息
 * @依据属性别名得到属性描述并填充到筛选后前端展示的位号名称列中
 */
// function
async function fetchAlarmListByInterface(epcode, starttime, endtime) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  // console.log('fetchAlarmList', this.starttime, this.endtime);
  // this.setState({ loading: true });
  if (!epcode) {
    epcode = '320802000005';
  }
  const response = await fetch(
    `http://${window.location.hostname}:8999/serverapi/event/total/alarmhis?epcode=${epcode}&alarmtype=1,4,8&begintime=${starttime}&endtime=${endtime}`,
    requestOptions
  );
  const result = await response.text();
  const httpResultJson = JSON.parse(result);
  //   let tableRowFetchRow = [];
  if (httpResultJson.info === 'Success' && httpResultJson.data.length > 0) {
    //  getch(result)
    // eslint-disable-next-line no-use-before-define
    console.log('httpResultJson', httpResultJson);

    // tableRowFetchRow = await addAlarmInfo(JSON.stringify(httpResultJson));
  }
  return httpResultJson;
  //   .then(response => response.text())
  //   .then(result => {
  //     const httpResultJson = JSON.parse(result);
  //     console.log(result);
  //     this.setState({ loading: false });
  //     if (
  //       httpResultJson.info === 'Success' &&
  //       httpResultJson.data.length > 0
  //     ) {
  //       //  getch(result)
  //       // eslint-disable-next-line no-use-before-define
  //       console.log('httpResultJson', httpResultJson);
  //        addAlarmInfo(JSON.stringify(httpResultJson));
  //     }
  //   });
}
// const fetchAlarmInfoPromise = fetchAlarmListByInterface(
//   '320802000005',
//   '2021-04-19 10:10:10',
//   '2021-04-20 10:10:10'
// );
// fetchAlarmInfoPromise.then(tableRowFetchRow => {
//   console.log('fetchAlarmInfoPromise', tableRowFetchRow);
// });

function addAlarmInfo(data) {
  return new Promise(resolve => {
    scriptUtil.excuteScriptService(
      {
        objName: 'httpAlermInterface', // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: 'addAlarmHisData', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { data },
        // params: { epcode: '320802000005', beginTime:'2021-04-07+11:48:39',endTime:'2021-04-08+11:48:39'},
      },
      res => {
        resolve(res);
        // console.log('addAlarmInfo-------22', res);
        // if (res.code === '200') {
        //   console.log('addAlarmInfo-------111', res);
        //   this.setState({
        //     dataSource: res.result,
        //   });
        //   // selectAlarmInfo();
        // }
      }
    );
  });
}

/**
 *获取实例下属性信息
 */

function getInstanceInfo(objName) {
  return new Promise(resolve => {
    scriptUtil.excuteScriptService(
      {
        objName: 'httpAlermInterface', // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: 'getInstanceInfo', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { obj: objName },
        // params: { epcode: '320802000005', beginTime:'2021-04-07+11:48:39',endTime:'2021-04-08+11:48:39'},
      },
      res => {
        resolve(res);
      }
    );
  });
}
// 根据实例下所有属性信息，提取描述以及属性别名，每个属性转换为对象{别名：描述}
function convertInstanceInfo(propsInfoArr) {
  //   const propDesc = [];
  const propDesc = {};
  propsInfoArr.forEach(item => {
    // propDesc.push({
    //   [item.name]: item.description,
    // });
    propDesc[item.name] = item.description;
  });
  return propDesc;
}

/**
 * @融合报警数据查询和实例信息查询
 */
let propsInfoArr;
async function getAlarmInfo(epcode, starttime, endtime) {
  console.log(epcode, starttime, endtime);
  //   let result = {};
  const httpResultJson = await fetchAlarmListByInterface(
    epcode,
    starttime,
    endtime
  );
  console.log('httpResultJson', httpResultJson);
  if (httpResultJson.info === 'Success' && httpResultJson.data.length > 0) {
    const tableRowFetchRow = await addAlarmInfo(JSON.stringify(httpResultJson));
    //   result.dataAlarm = tableRowFetchRow.result;
    const res = await getInstanceInfo(httpResultJson.data[0].objectname);
    const propsInfo = await convertInstanceInfo(res.result);
    propsInfoArr = propsInfo;
    console.log('getAlarmInfo', res, propsInfo, httpResultJson);
    return tableRowFetchRow.result;
  }
  return [];
}

//  getInstanceInfo('GK_CZ_LY_DEWSC').then(res => {
//     if (res.code === '200') {
//       console.log('getInstanceInfo', res.result);
//       const instanceInfo = res.result;
//       const propsInfo = convertInstanceInfo(instanceInfo);
//       console.log('instanceInfo', propsInfo);
//     }
//   });
/**
 * ***********************异常检测曲线*******************************************
 * @异常曲线追溯图
 * @初始化
 * **********************************************************************
 */
function traceDataAnamalyParamHistoryPicInit() {
  chart = Highcharts.chart('anamalyDetectPic', {
    global: {
      useUTC: false,
    },
    loading: {
      // 加载中选项配置
      labelStyle: {
        color: 'white',
        fontSize: '12px',
      },
    },
    chart: {
      type: 'spline',
      spacing: [20, 20, 20, 20],
      backgroundColor: '#09344C',
    },

    title: {
      text: '数据异动监测图',
      style: {
        color: '#FFFFFF',
        'font-family': 'Microsoft YaHei',
        'font-weight': 'bold',
      },
    },
    /* subtitle: {
          text: '非规律性时间内的变化',
        }, */
    xAxis: {
      type: 'datetime',
      title: {
        text: null,
      },
      labels: {
        style: {
          color: '#FFFFFF',
        },
        autoRotation: -20,
        step: 1,
        formatter() {
          return Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.value);
        },
      },
      dateTimeLabelFormats: {
        millisecond: '%H:%M:%S.%L',
        second: '%H:%M:%S',
        minute: '%H:%M',
        hour: '%H:%M',
        day: '%m-%d',
      },
    },

    colors: ['#00FEFE', '#39F', '#06C', '#036', '#000'],
    yAxis: {
      title: {
        text: '参数值',
        style: {
          color: '#FFFFFF',
        },
      },
      labels: {
        style: {
          color: '#FFFFFF',
        },
      },
      gridLineColor: 'rgba(255,255,255,0.5)',
      //   min: 0,
    },
    tooltip: {
      style: {
        fontSize: '18px',
        color: '#FFFFFF',
      },
      backgroundColor: 'rgba(0,0,0,0.8)',
      formatter() {
        return `<span style="color:${this.series.color}">.</span><b>${
          this.series.name
        }</b><br/>时间：${moment(this.point.x).format('HH:mm:ss')}<br/>数值：${
          this.point.y
        }<br/>`;
      },
      //   headerFormat: '<b>{series.name}</b><br>',
      //   pointFormat: '{point.x:%e. %b}: {point.y:.2f}mg/l',
    },
    plotOptions: {
      spline: {
        dataLabels: {
          enabled: true,
          style: { textOutline: 'none' },
        },
        marker: {
          shadow: false,
          enabled: true,
          style: { textOutline: 'none' },
        },
      },
    },
    legend: {
      // backgroundColor: '#FFFFFF',
      itemStyle: { cursor: 'pointer', color: '#FFFFFF' },
      itemHoverStyle: { color: '#00FEFE' },
    },
    series: [
      {
        name: 'xxx参数',
        // Define the data points. All series have a dummy year
        // of 1970/71 in order to be compared on the same x axis. Note
        // that in JavaScript, months start at 0 for January, 1 for February etc.
        data: [],
      },
    ],
  });
}

/**
 *
 */

/**
 * @异常数统计部分
 * @param{异常数、已处理数、未处理数}
 */

const countAnamalySum = 1000;
const countAnamalyProcessed = 800;
const countAnamalyNoTreated = 200;
const anamalyStatisNumberChildern = [];
const textAnamalyStatisticArr = ['异常数', '已处理', '待处理'];
const countAnamalyArr = [
  countAnamalySum,
  countAnamalyProcessed,
  countAnamalyNoTreated,
];
textAnamalyStatisticArr.forEach((item, index) => {
  anamalyStatisNumberChildern.push(
    <div
      className="anamaly-static"
      /* style={{ backgroundImage: `url(${bgAnamalyTotal}})` }} */
    >
      <div className="anamly-number-icon" />
      <div className="anamly-number-text">
        <span>{item}</span>
        <span>{countAnamalyArr[index]}</span>
      </div>
    </div>
  );
});
/** ************************************@main******************************* */
/**
 * @组件部分
 * @数据异动分析class组件
 */
// const classRef = React.createRef();
class AnamalyDetectChartTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      dataParam: [],
      pagination: { pageSize: 20 },
      loading: false,
    };
    this.staticFilterRef = React.createRef();
    this.equipmentFilterRef = React.createRef();
    this.levelFilterRef = React.createRef();
    this.anamalyCatagoryFilterRef = React.createRef();
    this.endtime = moment().format('YYYY-MM-DD HH:mm:ss');
    this.starttime = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD HH:mm:ss');
    this.initColumn();
  }

  initColumn = () => {
    anamalyTableHeader.forEach((item, index) => {
      console.log('item', item);
      if (item === '发生时间') {
        columns.push({
          title: item,
          // dataIndex: `param${(index + 1).toString()}`,
          dataIndex: anamalyTableHeaderParamName[index],
          key: anamalyTableHeaderParamName[index],
          width: anamalyTableHeaderWidth[index],
          render: (text, record) => (
            <span>
              {moment(moment.utc(record.starttime).valueOf()).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
            </span>
          ),
        });
        return;
      }
      if (item === '确认时间') {
        columns.push({
          title: item,
          // dataIndex: `param${(index + 1).toString()}`,
          dataIndex: anamalyTableHeaderParamName[index],
          key: anamalyTableHeaderParamName[index],
          width: anamalyTableHeaderWidth[index],
          render: (text, record) => (
            <span>
              {record.confirmtime
                ? moment(moment.utc(record.confirmtime).valueOf()).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )
                : ''}
            </span>
          ),
        });
        return;
      }
      if (item === '管理状态') {
        columns.push({
          title: item,
          // dataIndex: `param${(index + 1).toString()}`,
          dataIndex: anamalyTableHeaderParamName[index],
          key: anamalyTableHeaderParamName[index],
          width: anamalyTableHeaderWidth[index],
          render: (text, record) => (
            <span>{record.confirmtime ? '已处理' : '待处理'}</span>
          ),
        });
        return;
      }
      if (item === '位号名称') {
        columns.push({
          title: item,
          // dataIndex: `param${(index + 1).toString()}`,
          dataIndex: anamalyTableHeaderParamName[index],
          key: anamalyTableHeaderParamName[index],
          width: anamalyTableHeaderWidth[index],
          render: (text, record) => {
            console.log('propsInfoArr[record.sourcename]', propsInfoArr);
            return <span>{propsInfoArr[record.sourcename]}</span>;
          },
        });
        return;
      }
      columns.push({
        title: item,
        // dataIndex: `param${(index + 1).toString()}`,
        dataIndex: anamalyTableHeaderParamName[index],
        key: anamalyTableHeaderParamName[index],
        width: anamalyTableHeaderWidth[index],
      });
    });
    columns.push({
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, record) => (
        <div id="table-action">
          <Popconfirm
            title="是否确认该条报警"
            onConfirm={() => {
              this.confirmConfirm(record);
            }}
            onCancel={this.confirmCancel}
            okText="是"
            cancelText="否"
          >
            <Button
              size="small"
              disabled={record.confirmtime !== ''}
              className={
                record.confirmtime !== '' ? 'btn-processed' : 'btn-untreated'
              }
            >
              确认
            </Button>
          </Popconfirm>
          <Popconfirm
            title="是否确认删除该条记录"
            onConfirm={() => {
              this.deleteConfirm(record);
            }}
            onCancel={this.deleteCancel}
            okText="是"
            cancelText="否"
          >
            <Button size="small">删除</Button>
          </Popconfirm>
        </div>
      ),
    });
    console.log(columns);
  };

  fetchPostDeleteAlarm = (record, method, info) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      name: record.name,
    });

    const requestOptions = {
      method,
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      `http://${window.location.hostname}:8999/serverapi/event/alarm`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        message.success(`${info}成功`);
        // 原始用法
        // this.fetchAlarmList();
        this.fetchAlarmListAsync();

        console.log(result);
      })
      .catch(error => console.log('error', error));
  };

  confirmConfirm = record => {
    console.log(record);
    const preRecord = record;
    const method = 'POST';
    const backMessage = '确认';
    this.fetchPostDeleteAlarm(preRecord, method, backMessage);
  };

  confirmCancel = e => {
    console.log(e);
    message.error('取消确认');
  };

  deleteConfirm = record => {
    console.log(record);
    const preRecord = record;
    const method = 'DELETE';
    const backMessage = '删除';
    this.fetchPostDeleteAlarm(preRecord, method, backMessage);
  };

  deleteCancel = e => {
    console.log(e);
    message.error('取消删除');
  };

  // 查询刷新历史报警
  checkAnamaly = () => {
    // 原始用法
    // this.fetchAlarmList();
    this.fetchAlarmListAsync();
  };

  // 获取报警列表
  getAlermformList = () => {
    scriptUtil.excuteScriptService(
      {
        objName: 'httpAlermInterface', // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: 'saveToTableByAlarmInterface', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { epcode: this.epcode },
      },
      res => {
        console.log('getAlermformList', res);
        if (res.code === '200') {
          console.log('getAlermformList', res.result.list);
          this.setState({
            dataSource: res.result,
          });
        }
      }
    );
  };

  // 异步获取报警列表
  fetchAlarmListAsync = () => {
    this.setState({
      loading: true,
    });
    const getAlarmInfoPromise = getAlarmInfo(
      this.epcode,
      this.starttime,
      this.endtime
    );
    getAlarmInfoPromise.catch(e => console.log('fetchAlarmListAsync_e', e));
    getAlarmInfoPromise.then(data => {
      console.log('fetchAlarmListAsync_getAlarmInfoPromise', data);
      this.setState({
        dataSource: data,
        loading: false,
      });
    });
  };

  // 获取报警列表-原始方法
  fetchAlarmList = () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    console.log('fetchAlarmList', this.starttime, this.endtime);
    this.setState({ loading: true });
    if (!this.epcode) {
      this.epcode = '320802000005';
    }
    fetch(
      `http://${window.location.hostname}:8999/serverapi/event/total/alarmhis?epcode=${this.epcode}&alarmtype=1,2,4,5,8&begintime=${this.starttime}&endtime=${this.endtime}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        const httpResultJson = JSON.parse(result);
        console.log(result);
        this.setState({ loading: false });
        if (
          httpResultJson.info === 'Success' &&
          httpResultJson.data.length > 0
        ) {
          //  getch(result)
          // eslint-disable-next-line no-use-before-define
          console.log('httpResultJson', httpResultJson);

          this.addAlarmInfo(JSON.stringify(httpResultJson));
        }
      });
  };

  addAlarmInfo = data => {
    scriptUtil.excuteScriptService(
      {
        objName: 'httpAlermInterface', // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: 'addAlarmHisData', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { data },
        // params: { epcode: '320802000005', beginTime:'2021-04-07+11:48:39',endTime:'2021-04-08+11:48:39'},
      },
      res => {
        console.log('addAlarmInfo-------22', res);
        if (res.code === '200') {
          console.log('addAlarmInfo-------111', res);
          this.setState({
            dataSource: res.result,
          });
          // selectAlarmInfo();
        }
      }
    );
  };

  getTableDataBySelectFilter = param => {
    const input = param;
    console.log('input', input);
    scriptUtil.excuteScriptService(
      {
        objName: 'httpAlermInterface', // 对象实例名
        serviceName: 'selectAlermHistory', // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: input,
      },
      res => {
        console.log('data', res);
        if (res.code === '200') {
          this.setState({
            // dataSource: res.result.list.data.dataSource,
            dataSource: res.result,
          });
        }
      }
    );
  };

  /**
   * @获取所选报警表格行对应的历史时刻的区间实时值
   */
  getchHisData = selectedRows => {
    const hisEndTime = moment(selectedRows.starttime)
      .add(1, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');
    const hisStartTime = moment(selectedRows.starttime)
      .subtract(12, 'hours')
      .format('YYYY-MM-DD HH:mm:ss');

    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    this.setState({ loading: true });
    fetch(
      `http://${window.location.hostname}:8999/serverapi/data/trend?epcode=${this.epcode}&sourcename=${selectedRows.sourcename}&begintime=${hisStartTime}&endtime=${hisEndTime}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        console.log(result);
        this.setState({ loading: false });
        const httpResultJson = JSON.parse(result);
        if (httpResultJson.info === 'Success') {
          this.getCurveTableValue(httpResultJson.data[0]);
        }
      })
      .catch(error => console.log('error', error));
  };

  preTreatHisData = hisData => {
    let res = {};
    const arrArrAlermData = [];
    const objArrAlermData = [];
    console.log('hisData.length', hisData.length);
    hisData.forEach((item, index) => {
      arrArrAlermData.push([moment.utc(item.time).valueOf(), item.value]);
      objArrAlermData.push({
        id: index.toString(),
        propValue: item.value,
        // unit: 'mg/l',
        unit: '',
        time: moment(item.time).format('YYYY-MM-DD HH:mm:ss'),
      });
    });
    res = { arrArrAlermData, objArrAlermData };
    return res;
  };

  getCurveTableValue = hisData => {
    console.log('hisData', hisData);
    const curveTableValue = this.preTreatHisData(hisData);
    console.log('curveTableValue', curveTableValue);
    while (chart.series.length > 0) {
      chart.series[0].remove(true);
    }
    const seriesData = [
      {
        type: 'line',
        name: this.tag,
        data: curveTableValue.arrArrAlermData,
      },
    ];
    chart.addSeries(seriesData[0]);

    this.setState({
      dataParam: curveTableValue.objArrAlermData,
    });
  };
  /**
   *@查询历史值
   */

  getAnamalyCurveTable = selectedRows => {
    const hisEndTime = moment(selectedRows.starttime)
      .add(1, 'hours')
      .utc()
      .format();

    const hisStartTime = moment(selectedRows.starttime)
      .subtract(12, 'hours')
      .utc()
      .format();
    const obj = 'FactoryList';
    const prop = `${selectedRows.objectname}_${selectedRows.sourcename}`;
    const propHisPromise = getSinglePropHis(
      obj,
      prop,
      hisStartTime,
      hisEndTime
    );
    chart.showLoading();
    // chart.hideLoading();
    propHisPromise.then(resArr => {
      console.log('propHisPromise', resArr);
      const hisData = resArr.reverse();
      const curveTableValue = convertHisData(hisData);
      //   const curveTableValue = this.preTreatHisData(hisData);
      console.log('propHisPromise_curveTableValue', curveTableValue);
      while (chart.series.length > 0) {
        chart.series[0].remove(true);
      }
      const seriesData = [
        {
          type: 'line',
          name: this.tag,
          data: curveTableValue.arrArrAlermData,
        },
      ];
      chart.addSeries(seriesData[0]);
      chart.hideLoading();
      this.setState({
        dataParam: curveTableValue.objArrAlermData,
      });
    });
  };

  //   getAnamalyCurveTable = param => {
  //     const input = param;
  //     scriptUtil.excuteScriptService(
  //       {
  //         objName: 'AlermInterface', // 对象实例名
  //         serviceName: 'getAlermCurveTable', // 服务名
  //         // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
  //         params: input,
  //       },
  //       res => {
  //         console.log('data', res.result.arrArrAlermData);
  //         if (res.code === '200') {
  //           while (chart.series.length > 0) {
  //             chart.series[0].remove(true);
  //           }
  //           const seriesData = [
  //             {
  //               type: 'line',
  //               name: this.tag,
  //               data: res.result.arrArrAlermData,
  //             },
  //           ];
  //           chart.addSeries(seriesData[0]);

  //           this.setState({
  //             dataParam: res.result.arrObjAlermData,
  //           });
  //         }
  //       }
  //     );
  //   };

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

  onSearch = value => console.log(value);

  /**
   * @table表格部分
   */
  onTableRowclick = e => {
    // eslint-disable-next-line no-underscore-dangle
    /* console.log(e._dispatchInstances);
        console.log(e.currentTarget);
        // eslint-disable-next-line no-underscore-dangle
        console.log(document.querySelector('table')); */
    //   const tableArr = document.querySelectorAll('tr.ant-table-row');
    //   tableArr.forEach(item => {
    //     // console.log('item', item);
    //     // eslint-disable-next-line no-param-reassign
    //     // item.style.backgroundColor = '#09344C';
    //     // eslint-disable-next-line no-param-reassign
    //     item.style.backgroundColor = '#09344C';
    //     // eslint-disable-next-line no-param-reassign
    //     item.style.color = '#E9E9E9';
    //   });
    //   // document.querySelectorAll('table')[1].style.backgroundColor = '#09344C';
    //   // document.querySelector('table').style.backgroundColor = '#09344C';
    //   document.querySelector('div.ant-table-body').style.color = '#E9E9E9';
    //   // console.log('点击', e);
    //   //   e.currentTarget.style.color = 'black';
    //   e.currentTarget.style.backgroundColor = 'rgba(19,100,120,1)';
    //   selectColor = 'black';
  };

  // 点击行
  /* const onTableRowDoubleClick = e => {
        console.log(e);
      };
      const onTableRowContextMenuevent = e => {
        console.log(e);
        
      }; */
  // 鼠标移入行
  onTableRowMouseEnter = e => {
    // this.setState({ dataSource: [data[1]] });
    /* console.log(e);
        console.log(e.currentTarget); */
    //   console.log(e.currentTarget);
    //   selectColor = e.currentTarget.style.color;
    //   //   e.currentTarget.style.color = 'black';
    //   e.currentTarget.style.backgroundColor = 'red';
  };

  // 鼠标移出行
  onTableRowMouseLeaver = e => {
    // console.log(e);
    //   e.currentTarget.style.color = selectColor;
  };

  // let compentRef;
  rowCheckSelect = (selectedRowKeys, selectedRows) => {
    console.log('chart', chart);

    chart.update({
      chart: {
        type: 'line',
      },
    });
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows
    );
    console.log(
      moment(selectedRows[0].starttime).format('YYYY-MM-DD HH:mm:ss'),
      moment(selectedRows[0].starttime).valueOf()
    );
    // console.log(
    //   'utc时间',
    //   moment(moment(selectedRows[0].starttime).valueOf())
    //     .utc()
    //     .format()
    // );
    console.log(
      'utc时间',
      moment(selectedRows[0].starttime)
        .utc()
        .format()
    );
    if (selectedRows.length > 0) {
      this.checkId = selectedRows[0].id;
      //   this.tag = selectedRows[0].devicename + selectedRows[0].sourceshowname;
      this.tag = propsInfoArr[selectedRows[0].sourcename];

      const paramObj = {
        alermTime: selectedRows[0].starttime,
      };
      /*  clearInterval(this.alarmFreshTime); */
      //   this.getchHisData(selectedRows[0]);
      this.getAnamalyCurveTable(selectedRows[0]);
      //   this.getAnamalyCurveTable(paramObj);
    } else {
      this.checkId = null;
      //   this.forceUpdate();
      this.setState({ state: this.state });
      //   this.getAlermformList();
      /* this.alarmFreshTime = setInterval(() => {
        // this.getAlermformList();
        this.fetchAlarmList();
      }, 60000); */
    }
  };

  selectFilterChange = value => {
    this.arrFilterSelect = {};

    setTimeout(() => {
      this.arrFilterSelect = [
        ...this.staticFilterRef.current.rcSelect.state.value,
        ...this.equipmentFilterRef.current.rcSelect.state.value,
        ...this.levelFilterRef.current.rcSelect.state.value,
        ...this.anamalyCatagoryFilterRef.current.rcSelect.state.value,
      ];
      let type = alarmTypeArr
        .indexOf(this.anamalyCatagoryFilterRef.current.rcSelect.state.value[0])
        .toString();
      if (type === '-1') {
        type = '';
      }
      this.arrFilterSelectParam = {
        staticFilter: this.staticFilterRef.current.rcSelect.state.value[0],
        equipmentFilter: this.equipmentFilterRef.current.rcSelect.state
          .value[0],
        levelFilter: this.levelFilterRef.current.rcSelect.state.value[0],
        anamalyCatagoryFilter: this.anamalyCatagoryFilterRef.current.rcSelect
          .state.value[0],
        anamalyTypeFilter: type,
      };
      console.log(
        'arrFilterSelect',
        this.arrFilterSelectParam
        //   this.staticFilterRef.current.rcSelect.state.value
      );
      console.log(
        'anamalyTypeIndex',
        alarmTypeArr
          .indexOf(
            this.anamalyCatagoryFilterRef.current.rcSelect.state.value[0]
          )
          .toString()
      );
      this.getTableDataBySelectFilter(this.arrFilterSelectParam);
    }, 200);
  };

  //   selectFilterOnBlur = value => {
  //     const arrFilterSelect = [];
  //     arrFilterSelect.push(
  //       this.staticFilterRef.current,
  //       this.equipmentFilterRef.current,
  //       this.levelFilterRef.current,
  //       this.anamalyCatagoryFilterRef
  //     );
  //     console.log(
  //       'arrFilterSelect',
  //       this.staticFilterRef
  //       //   this.staticFilterRef.current.rcSelect.state.value
  //     );
  //     // this.getTableDataBySelectFilter(this.arrFilterSelectParam);
  //   };

  selectOnSearch = value => {
    console.log('selectOnSearch', value);
  };

  /**
   * @Table页面切换
   */
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    console.log(pager);
    /* this.setState({
      pagination: pager,
    }); */
    /* this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    }); */
  };

  componentDidMount = () => {
    // sumDataAnamalyCatagoryPicInit();
    // sumDataAnamalyLevelPicInit();
    // sumDataAnamalyEquipmentPicInit();

    const oobj = parmseToObject();
    this.epcode = oobj.epcode;
    console.log('epcodeepcode', this.epcode);
    traceDataAnamalyParamHistoryPicInit();
    // this.getTableDataBySelectFilter('');
    adapterPage();
    window.onresize = adapterPage;
    // this.getAlermformList();

    // 原始用法
    // this.fetchAlarmList();
    this.fetchAlarmListAsync();
    // getInstanceInfo('GK_CZ_LY_DEWSC').then(res => {
    //   if (res.code === '200') {
    //     console.log('getInstanceInfo', res.result);
    //     const instanceInfo = res.result;
    //     const propsInfo = convertInstanceInfo(instanceInfo);
    //     console.log('instanceInfo', propsInfo);
    //   }
    // });

    /* this.alarmFreshTime = setInterval(() => {
      //   this.getAlermformList();
      this.fetchAlarmList();
    }, 60000); */

    //     const script = document.createElement('script');
    //     script.src = `${pathHighchart}`;
    //     script.async = true;
    //     script.onload = () => this.scriptLoaded();
    //     document.body.appendChild(script);
    // console.log('statisticTableRef.current', statisticTableRef.current);
    console.log('this', this);
    // compentRef = this;
    /* const timeObj = setInterval(() => {
      console.log('1秒', data);
      this.forceUpdate();
    }, 1000); */
  };

  render() {
    const { dataSource, dataParam, pagination, loading } = this.state;

    // eslint-disable-next-line prefer-const
    let rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys', selectedRowKeys);
        this.rowCheckSelect(selectedRowKeys, selectedRows);
        // eslint-disable-next-line no-use-before-define
      },
      getCheckboxProps: record => {
        // console.log('this.checkId', this.checkId);
        // if (this.checkId) {
        //   return {
        //     disabled: record.id !== this.checkId,
        //     // Column configuration not to be checked
        //     name: record.name,
        //   };
        // }
        return {};
      },
    };
    /**
     * todo:***************************************************************************
     * todo:*********************************************************************************
     * todo:*****************************************************************************
     * @html布局
     * todo:****************************************************************************
     * todo:*******************************************************************************
     * todo:************************************************************************************
     */

    const anamalyStaticContainer = (
      <div id="anamalyStaticContainer">{anamalyStatisNumberChildern}</div>
    );

    const loadingDiv = (
      <div>
        Loading...
        <div>网速有点慢哈</div>
      </div>
    );
    // const statisticChartContainer = (
    //   <div id="statisticChartContainer">
    //     <div id="anamaly-static-container">{anamalyStaticContainer}</div>
    //     <div id="anamaly-catagory-container">
    //       {/* <AnamalyCatagoryStatisticCom /> */}
    //     </div>
    //     <div id="anamaly-level-statistic">
    //       {/* <AnamalyLevelStatisticCom /> */}
    //     </div>
    //     <div id="anamaly-equipment-statistic">
    //       {/* <AnamalyEquipmentStatisticCom /> */}
    //     </div>
    //   </div>
    // );
    /**
     * @统计表格部分
     * @select选择器筛选
     */

    const staticFilterSelect = (
      <Select
        className="statistic-filter-select"
        ref={this.staticFilterRef}
        dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
        allowClear
        onDropdownVisibleChange={this.changedropdownVisible}
        onBlur={this.selectFilterOnBlur}
        onChange={this.selectFilterChange}
        onSearch={this.selectOnSearch}
        placeholder="异常状态筛选"
      >
        {staticChildren}
      </Select>
    );
    const equipmentFilterSelect = (
      <Select
        className="statistic-filter-select"
        ref={this.equipmentFilterRef}
        dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
        allowClear
        onBlur={this.selectFilterOnBlur}
        onChange={this.selectFilterChange}
        placeholder="异常设备筛选"
      >
        {equipmentChildren}
      </Select>
    );
    const levelFilterSelect = (
      <Select
        className="statistic-filter-select"
        ref={this.levelFilterRef}
        dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
        allowClear
        onBlur={this.selectFilterOnBlur}
        onChange={this.selectFilterChange}
        placeholder="异常等级筛选"
      >
        {anamalyLevelChildren}
      </Select>
    );
    const anamalyCatagoryFilterSelect = (
      <Select
        className="statistic-filter-select"
        ref={this.anamalyCatagoryFilterRef}
        dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
        allowClear
        onBlur={this.selectFilterOnBlur}
        onChange={this.selectFilterChange}
        placeholder="异常类型筛选"
      >
        {anamalyCatagoryChildren}
      </Select>
    );

    /**
     * @统计表格部分
     * @按照多种类别对统计表格进行筛选
     */
    const statisTableFilterContainer = (
      <div id="statisTableFilterContainer">
        <div id="static-filter" className="table-filter">
          {staticFilterSelect}
        </div>
        <div id="equipment-filter" className="table-filter">
          {equipmentFilterSelect}
        </div>
        <div id="level-filter" className="table-filter">
          {levelFilterSelect}
        </div>
        <div id="anamaly-catagory-filter" className="table-filter">
          {anamalyCatagoryFilterSelect}
        </div>
      </div>
    );
    /**
     * @统计表格部分
     * @表格主体部分
     */
    const { RangePicker } = DatePicker;
    // const statisticTableRef = React.createRef();
    const statisticTable = (
      <div id="statisticTable">
        <div id="statistic-table-header">
          {statisTableFilterContainer}
          <div
            id="statistic-table-header-right"
            /* style={{
              width: '450px',
              height: '38px',
              position: 'absolute',
              right: 0,
              top: 0,
            }} */
          >
            <RangePicker
              style={{
                width: '350px',
                height: '38px',
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
            <Button className="anamaly-check-btn" onClick={this.checkAnamaly}>
              查询
            </Button>
          </div>
        </div>
        <div id="statistic-table-body">
          <Table
            // ref={statisticTableRef}
            rowSelection={{
              ...rowSelection,
            }}
            locale={{ emptyText: '暂无数据' }}
            columns={columns}
            dataSource={dataSource}
            // pagination={pagination}
            pagination={false}
            scroll={{ y: 180 }}
            loading={loading}
            /* onChange={this.handleTableChange} */
            size="small"
            onRow={record => {
              return {
                onClick: event => {
                  this.onTableRowclick(event);
                }, // 点击行
                onDoubleClick: event => {
                  this.onTableRowDoubleClick(event);
                },
                onContextMenu: event => {
                  this.onTableRowContextMenu(event);
                },
                onMouseEnter: event => {
                  this.onTableRowMouseEnter(event);
                }, // 鼠标移入行
                onMouseLeave: event => {
                  this.onTableRowMouseLeaver(event);
                },
              };
            }}
            /* bordered */
          />
        </div>
      </div>
    );
    /**
     * @统计表格部分
     * @主框架
     */
    /* const statisticTableContainer = (
    <div id="statisticTableContainer">
      <div id="statistic-table-filter-container">
        {statisTableFilterContainer}
      </div>
      <div id="statistic-table">{statisticTable}</div>
    </div>
  ); */
    /**
     * @数据异动核心部分
     * @参数表格部分
     */
    const { Search } = Input;
    const paramCatagoryFilterSelect = (
      <Select
        className="param-filter-select"
        dropdownStyle={{ backgroundColor: 'rgba(135,158,192,0.9)' }}
        allowClear
        placeholder="请选择参数"
      >
        {anamalyCatagoryChildren}
      </Select>
    );

    const dataAnamalyParametersTable = (
      <div
        id="dataAnamalyParametersTable"
        style={{ width: '100%', height: '100%' }}
      >
        {/* <div id="anamaly-param-form-content-header">
       {paramCatagoryFilterSelect}
       <Search
         placeholder="input search text"
         onSearch={onSearch}
         style={{ width: 200 }}
       />
     </div> */}
        <div id="anamaly-param-form-content-table">
          <Table
            columns={columnsParam}
            dataSource={dataParam}
            pagination={false}
            scroll={{ y: 180 }}
            /* bordered */
            size="small"
          />
        </div>
      </div>
    );
    /**
     * @数据异动核心部分
     * @单曲线数据异动呈现
     * @数据缺失恒值满屏跳陡升陡降
     *
     */
    const dataAnamalySingleCurve = (
      <div id="dataAnamalySingleCurve">
        <div id="single-curve-container" className="curve-container" />
      </div>
    );
    /**
     * @数据异动核心部分
     * @双曲线数据异动呈现
     * @设限值
     */
    const dataAnamalyDoubleCurve = (
      <div id="dataAnamalyDoubleCurve">
        <div id="double-curve-container" className="curve-container" />
      </div>
    );
    /**
     * @数据异动核心部分
     * @组合曲线数据异动呈现
     * @关联度异常监测曲线
     */
    const dataAnamalyGroupCurve = (
      <div id="dataAnamalyGroupCurve">
        <div id="group-curve-container" className="curve-container" />
      </div>
    );
    /**
     * @数据异动核心部分
     * @数据异动曲线呈现框架
     */
    const dataAnamalyChartContainer = (
      <div id="dataAnamalyChartContainer">
        <div id="data-anamaly-single-curve" className="data-anamaly-curve">
          {dataAnamalySingleCurve}
        </div>
        <div id="data-anamaly-double-curve" className="data-anamaly-curve">
          {dataAnamalyDoubleCurve}
        </div>
        <div id="data-anamaly-group-curve" className="data-anamaly-curve">
          {dataAnamalyGroupCurve}
        </div>
      </div>
    );
    /**
     * @数据异动核心部分
     * @主框架
     */
    const dataAnamalyContainer = (
      <div id="dataAnamalyContainer">
        <div id="data-anamaly-parameters-table">
          {dataAnamalyParametersTable}
        </div>
        <div id="data-anamaly-chart-container">{dataAnamalyChartContainer}</div>
      </div>
    );
    /**
     *@svg背景部分
     *@异常检测表背景
     */
    const anamalyDetectFormSVG = (
      <div
        style={{
          width: '100%',
          height: '350px',
          position: 'absolute',
        }}
      >
        <svg
          version="1.1"
          style={{
            width: '14px',
            height: '10.98px',
            position: 'absolute',
            right: '0px',
          }}
        >
          <path
            fill="transparent"
            stroke="#DFF0FE"
            strokeWidth="4"
            d="M0 2 L 8 2 T 14 20"
            className="path"
          />
        </svg>
        <svg
          version="1.1"
          style={{
            width: '100%',
            height: '350px',
            position: 'absolute',
            left: '0px',
          }}
        >
          <path
            fill="#09344C"
            stroke="#09344C"
            strokeWidth="1"
            d="M1373 3 L 5 3 L 5 318 L 100 350 L 1393 350 T 1393 17"
            className="path"
          />
          <path
            fill="transparent"
            stroke="#00898B"
            strokeWidth="1"
            d="M1380 1 L 2 1 L 2 350 T 1398 350"
            className="path"
          />
          <path
            fill="transparent"
            stroke="#00898B"
            strokeWidth="1"
            d="M1398 350 T 1398 17"
            className="path"
          />
        </svg>
      </div>
    );

    const anamalyDetectFormBorder = (
      <div id="bg-anamaly-chart-form-border">
        <div id="bg-anamaly-chart-form-border-left">
          <div className="form-border-left" />
          <div className="form-border-left" />
          <div className="form-border-left" />
          <div className="form-border-left" />
          <div className="form-border-left" />
        </div>
        <div id="bg-anamaly-chart-form-border-right">
          <div className="form-border-right" />
          <div className="form-border-right" />
          <div className="form-border-right" />
        </div>
      </div>
    );

    /**
     *@svg背景部分
     *@异常检测参数表背景
     */
    const anamalyDetectParamSVG = (
      <div
        style={{
          width: '456px',
          height: '284px',
        }}
      >
        {/* <embed
       id="anamaly-param-top-right"
       src={bgAnamalyParamTopRight}
       type="image/svg+xml"
     /> */}
        <img
          id="anamaly-param-top-right"
          src={bgAnamalyParamTopRight}
          alt="1"
        />
        <img id="anamaly-param-top-left" src={bgAnamalyParamTopLeft} alt="2" />
        {/* <svg
       version="1.1"
       style={{
         width: '20px',
         height: '7px',
         position: 'absolute',
         right: '0px',
       }}
     >
       <path
         fill="transparent"
         stroke="#DFF0FE"
         strokeWidth="4"
         d="M0 1 L 10 1 T 17 7"
         className="path"
       />
     </svg>
     <svg
       version="1.1"
       style={{
         width: '20px',
         height: '7px',
         position: 'absolute',
         left: '0px',
       }}
     >
       <path
         fill="transparent"
         stroke="#DFF0FE"
         strokeWidth="4"
         d="M2 7 L 10 1 T 18 1"
         className="path"
       />
     </svg> */}
        <svg
          version="1.1"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: '0px',
          }}
        >
          <path
            fill="#09344C"
            stroke="#09344C"
            strokeWidth="1"
            d="M445 5 L 11 5 L5 12 L 5 257 L 25 284 L 451 284 L 451 12 T 445 5"
            className="path"
          />
          <path
            fill="transparent"
            stroke="#00898B"
            strokeWidth="1"
            d="M430 1 T 26 1 "
            className="path"
          />
          <path
            fill="transparent"
            stroke="#00898B"
            strokeWidth="1"
            d="M2 12 L 2 257 L 25 284 L 454 284 T 454 12"
            className="path"
          />
        </svg>
      </div>
    );
    const anamalyDetectParamBorder = (
      <div id="bg-anamaly-chart-param-border">
        <div id="bg-anamaly-chart-param-border-left">
          <div className="param-border-left" />
          <div className="param-border-left" />
          <div className="param-border-left" />
          <div className="param-border-left" />
          <div className="param-border-left" />
        </div>
        <div id="bg-anamaly-chart-param-border-right">
          <div className="param-border-right" />
          <div className="param-border-right" />
          <div className="param-border-right" />
        </div>
      </div>
    );

    /**
     * @标签页部分
     * @标签页序列1_异常检测图表_总体内容_框架
     */
    const anamalyDetectFormContentFrame = (
      <div id="anamaly-detect-form-content-frame">
        <div id="anamaly-detect-form-logo">
          {/*       <img
         id="anamaly-detect-form-logo-svg"
         src={bgAnamalyDetectFormLogo}
         alt="3"
       /> */}
          <div id="form-logo-inframe">
            <div id="anamaly-detect-form-logo-text">异常监测图表</div>
          </div>
        </div>
        <div id="anamaly-detect-form-content">{statisticTable}</div>
      </div>
    );

    /**
     * @标签页部分
     * @标签页序列1_异常检测图表_总体框架
     */
    const anamalyDetectForm = (
      <div
        /* id="anamalyDetectForm" */
        style={{
          width: '100%',
          height: '350px',
          position: 'absolute',
        }}
      >
        {anamalyDetectFormBorder}
        {anamalyDetectFormContentFrame}
      </div>
    );
    const anamalyParamForm = (
      <div
        style={{
          width: '456px',
          height: '284px',
          position: 'absolute',
        }}
      >
        {anamalyDetectParamSVG}
        <div
          style={{
            width: '456px',
            height: '284px',
            position: 'absolute',
            top: '0px',
          }}
        >
          {anamalyDetectParamBorder}
          <div
            id="anamaly-param-form-content"
            style={{ width: '100%', height: '100%' }}
          >
            {dataAnamalyParametersTable}
            {/* <div id="anamaly-param-form-content-header">表格头</div>
         <div id="anamaly-param-form-content-table">表格</div> */}
          </div>
        </div>
      </div>
    );
    /**
     * @异常检测图
     */

    const anamalyDetectPic = <div id="anamalyDetectPic" />;
    const anamalyDetectChartTab = (
      <div id="anamaly-detect-chart-tab">
        <div id="anamaly-detect-form">
          {anamalyDetectFormSVG}
          {anamalyDetectForm}
        </div>
        <div id="anamaly-detect-param-pic">
          <div id="anamaly-detect-pic">{anamalyDetectPic}</div>
          <div id="anamaly-detect-param">{anamalyParamForm}</div>
        </div>
      </div>
    );
    /**
     * @标签页部分
     * @标签页序列2_异动种类分析_背景
     */
    const bgAnamalyCatagoryStatisticLogo = (
      <div id="anamaly-catagory-statistic-logo">
        <div id="anamaly-catagory-statistic-logo-text">异动种类分析</div>
      </div>
    );
    const bgAnamalyCatagoryStatisticSVG = (
      <div
        style={{
          width: '100%',
          height: '684px',
        }}
      >
        <svg
          version="1.1"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <path
            fill="transparent"
            stroke="#017F84"
            strokeWidth="1"
            d="M899 40 T 899 630 "
            className="path"
          />
          <path
            fill="transparent"
            stroke="#017F84"
            strokeWidth="1"
            d="M899 342 T 1369 342 "
            className="path"
          />
        </svg>
      </div>
    );
    const bgAnamalyCatagoryStatistic = (
      <div id="bgAnamalyCatagoryStatistic">
        <div id="bg-anamaly-catagory-statistic-logo">
          {bgAnamalyCatagoryStatisticLogo}
        </div>
        <div
          id="bg-anamaly-catagory-statistic-svg"
          style={{
            width: '1400px',
            height: '684px',
            position: 'absolute',
            bottom: 0,
          }}
        >
          {bgAnamalyCatagoryStatisticSVG}
        </div>
      </div>
    );
    /**
     * @标签页部分
     * @标签页序列2_异动种类分析_内容
     */
    const anamalyDetectTotalPic = (
      <div
        id="anamaly-detect-total-pic-container"
        style={{
          width: '837px',
          height: '570px',
        }}
      />
    );
    const anamalyDectectLevelProportionPic = (
      <div
        id="anamaly-detect-level-proportion-pic-container"
        style={{
          width: '470px',
          height: '278px',
        }}
      />
    );
    const anamalyDectectEquipmentProportionPic = (
      <div
        id="anamaly-detect-equipment-proportion-pic-container"
        style={{
          width: '470px',
          height: '278px',
        }}
      />
    );
    const contentAnamalyCatagoryStatistic = (
      <div
        id="contentAnamalyCatagoryStatistic"
        style={{
          width: '1400px',
          height: '684px',
        }}
      >
        <div
          id="anamaly-detect-total-pic"
          style={{
            width: '837px',
            height: '570px',
          }}
        >
          {anamalyDetectTotalPic}
        </div>
        <div
          id="anamaly-detect-level-proportion-pic"
          style={{
            width: '470px',
            height: '278px',
          }}
        >
          {anamalyDectectLevelProportionPic}
        </div>
        <div
          id="anamaly-detect-equipment-proportion-pic"
          style={{
            width: '470px',
            height: '278px',
            position: 'relative',
            top: '-30px',
          }}
        >
          {anamalyDectectEquipmentProportionPic}
        </div>
      </div>
    );
    /**
     * @标签页部分
     * @标签页序列2_异动种类分析_总体框架
     */

    const anamalyCatagoryStatisticTab = (
      <div id="anamaly-catagory-statistic-tab">
        <div
          id="bg-anamaly-catagory-statistic"
          /* style={{ width: '1400px', height: '684px', position: 'absolute' }} */
        >
          {bgAnamalyCatagoryStatistic}
        </div>
        <div
          id="content-anamaly-catagory-statistic"
          style={{
            width: '1400px',
            height: '684px',
            position: 'absolute',
            bottom: 0,
          }}
        >
          {contentAnamalyCatagoryStatistic}
        </div>
      </div>
    );

    /**
     * @标签页部分
     * @标签页框架
     */
    const { TabPane } = Tabs;
    const anamalyTabContainer = (
      <Tabs
        defaultActiveKey="2"
        animated={{ inkBar: false, tabPane: false }}
        onChange={tabsCallback}
      >
        <TabPane
          forceRender="true"
          tab={<span style={{ fontSize: 18 }}>异常监测图表</span>}
          key="1"
        >
          {anamalyDetectChartTab}
        </TabPane>
        <TabPane
          forceRender="true"
          tab={<span style={{ fontSize: 18 }}>异动种类分析</span>}
          key="2"
        >
          {anamalyCatagoryStatisticTab}
        </TabPane>
      </Tabs>
    );

    return (
      // 异动分析总框架

      <div id="data-anamaly-tabs">{anamalyDetectChartTab}</div>
    );
  }
}

export default AnamalyDetectChartTab;

const css = document.createElement('style');
css.type = 'text/css';
css.innerHTML = `

text.highcharts-credits {
    display:none;
}
g.highcharts-exporting-group {
  display: none;
}
#frame-container{
    width:1400px;
    /*height:100%;*/
    /*max-height:921px;*/
    /*width:100%;
    height:100%;*/
    background: #0E213E;
    border: #eee solid 0;
}
#data-anamaly-container-iframe{
    position:relative;
    /*left:66px;*/
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: space-around;
    align-items: stretch;
}
#statisticChartContainer{
    display:flex;
    width: 100%;
    height: 1600px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: space-around;
    align-items: stretch;
}
#anamaly-static-container{
    width:360px;
    height:900px;

}
#anamaly-catagory-container{
    width:1497px;
    height:900px;
    background-color:#1F2293;
}
#anamaly-level-statistic{
    width:878px;
    height:662px;
    background-color:#1F1193;
}
#anamaly-equipment-statistic{
    width:973px;
    height:662px;
    background-color:#1F6A11;
}
#data-anamaly-static-container{
    width:100%;
    height:120px;
}

/******总框架样式-flex布局********/
#anamalyStaticContainer{
    display:flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: space-around;
    align-items: stretch;
}
#anamalyStaticContainer .anamaly-static{
    background-color: #9CBBFF;  
    height:100%;
    width: 456px;
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-content: center;
    align-items: stretch;
}
/*****异常处理量统计样式******/

#anamalyStaticContainer .anamly-number-icon{
    width:102px;
    height:102px;
    background-color:#88B0FF;
    align-self: center;
    flex-basis: auto;

}
#anamalyStaticContainer .anamaly-static:nth-child(1){

  background-position: center;
  background-size: cover;
  background: url(${bgAnamalyTotal}) no-repeat center;
}

#anamalyStaticContainer .anamaly-static:nth-child(1) .anamly-number-icon{
    /* background-color:#518A54; */
    background:url(${bgAnamalyTotalIcon}) no-repeat center;
    
}
#anamalyStaticContainer .anamaly-static:nth-child(2){

    background-position: center;
    background-size: cover;
    background: url(${bgAnamalyProcessed}) no-repeat center;
  }

#anamalyStaticContainer .anamaly-static:nth-child(2) .anamly-number-icon{
    /* background-color:#575B7C; */
    background:url(${bgAnamalyProcessedIcon}) no-repeat center;
}
#anamalyStaticContainer .anamaly-static:nth-child(3){

    background-position: center;
    background-size: cover;
    background: url(${bgAnamalyNoTreat}) no-repeat center;
  }

#anamalyStaticContainer .anamaly-static:nth-child(3) .anamly-number-icon{
    /* background-color:#807DFD; */
    background:url(${bgAnamalyNoTreatIcon}) no-repeat center;
}


#anamalyStaticContainer .anamly-number-text{
    align-self: center;
    flex-basis: auto;
    width:250px;
    height:100%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-content: center;
    align-items: stretch;
    display:flex;
}
#anamalyStaticContainer .anamly-number-text>span{
    align-self: flex-end;

}
#anamalyStaticContainer .anamly-number-text>span:nth-child(1){
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #FFFFFF;
    opacity: 1;

}
#anamalyStaticContainer .anamaly-static:nth-child(1) .anamly-number-text>span:nth-child(2){
    /* width: 141px; */
    height: 79px;
    font-size: 60px;
    font-family: Microsoft YaHei;
    font-weight: 400;
 /*    line-height: 129px; */
    color: #FF9353;
    text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;


}
#anamalyStaticContainer .anamaly-static:nth-child(2) .anamly-number-text>span:nth-child(2){
    /* width: 141px; */
    height: 79px;
    font-size: 60px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #00DCDD;
    text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;

}
#anamalyStaticContainer .anamaly-static:nth-child(3) .anamly-number-text>span:nth-child(2){
    /* width: 141px; */
    height: 79px;
    font-size: 60px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #00ADE1;
    text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;

}
/******** tabs标签页样式********/

#data-anamaly-tabs{
    position:relative;
    /*top:-10px;*/
    width:1400px;
    height:660px; 
    /* background: #09344C; */

}
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
/*******异常检测图表内容框架*********/
#anamaly-detect-chart-tab{

    width:100%;
    height:660px;
    background-color:#0E213E;
    display:flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
}



/***********异常检测表****************/
#anamaly-detect-form{
    width:100%;
    height:350px;
/*     background-color:#FFFFFF; */
}

#anamaly-detect-form-content-frame{
    width:100%;
    height:350px;
    display:flex;

    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
}
#form-logo-inframe{
  display:flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: stretch;
  align-items: center; 
  width: 100%;
  height: 100%;
}
#anamaly-detect-form-logo{
    width:385px;
    height:38px;
    position:absolute;
    left:0px;
    top:0px;
    /* background-color:#FFFFFF; */
    background:url(${bgAnamalyDetectFormLogo})
    
}
#bgAnamalyDetectFormLogo{
  posision:absolute;
  top:0px
}
#anamaly-detect-form-logo-text{
    /* width: 200px; */
    height: 26px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 26px;
    color: #FFFFFF;
    opacity: 1;
    position:relative;
/*     top:-38px; */
    left:-82px;
    /* display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-content: stretch;
    align-items: center; */
}
#anamaly-detect-form-content{
    width:1340px;
    height:252px;
    background-color:#FFFFFF;
    position:relative;
    top:15px;
}
/****************异常检测表header*******************/
#statistic-table-header{
  background:#09344C;

  display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-align-content: stretch;
    -ms-flex-line-pack: stretch;
    align-content: stretch;
    -webkit-align-items: flex-start;
    -ms-flex-align: start;
    align-items: flex-start;
}
#statistic-table-header-right{
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-align-content: stretch;
    -ms-flex-line-pack: stretch;
    align-content: stretch;
    -webkit-align-items: flex-start;
    -ms-flex-align: start;
    align-items: flex-start;

    width: 450px;
    height: 38px;
    /* position: absolute;
    right: 0;
    top: 0; */
    background: #09344C;
}
.anamaly-check-btn,.anamaly-check-btn:hover,.anamaly-check-btn:active,.anamaly-check-btn:focus,.anamaly-check-btn:not([disabled]):hover{
    width:90px;
    height:32px;
    background:#0360A5;
    border-color: #0360A5;
    color:#FFFFFF;
    font-size:16px;
}
#statistic-table-header-right .ant-btn:hover, #statistic-table-header-right .ant-btn:focus{
    width:90px;
    height:32px;
    background:#0360A5;
    border-color: #0360A5;
    color:#FFFFFF;
    font-size:16px;
}


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
    top: -1px;
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
/*****************异常检测表内容****************************/
#table-action{
    display:flex;
    width: 100px;

    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-content: space-around;
    align-items: stretch;
}
/******************异常检测表foot*******************************/
#root .ant-pagination {
    margin-top: 0px; 
}


/************异常检测图****************/
#anamaly-detect-param-pic{
    width:100%;
    height:300px;
    display:flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
}
#anamaly-detect-pic{
    width:935px;
    height:284px;
    border: 1px solid #08475A;
    opacity: 1;
    border-radius: 2px;
    /* background-color:#586455; */
}
#anamalyDetectPic{
    width:933px;
    height:282px;
    overflow:inherit
}
#anamaly-detect-param{
  width:456px;
  height:284px;
  /* background-color:#257958; */
}
#anamaly-param-top-right{
  width:20px;
  height:7px;
  position: absolute;
  right:0px;
  /* background:url(${bgAnamalyParamTopRight}) */
}
#anamaly-param-top-left{
  width:20px;
  height:7px;
  position: absolute;
  left:0px;
 /*  background:url(${bgAnamalyParamTopLeft}) */
}

/***********************************************/
/***************异常检测图表背景设计**********************/
/***********************************************/
/*异常检测表格背景*/
#bg-anamaly-chart-form-border{
    display:flex;
    position:absolute;
    width: 100%;
    height: 350px;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
}
#bg-anamaly-chart-form-border-left{
    position:relative;
    left:1px;
    width:50px;
    height:100%;
}
#bg-anamaly-chart-form-border-left .form-border-left:nth-child(1){

    position: absolute;
    left:0px;
    top:103px;
    /* background-color:#58A585; */
    width: 2px;
    height: 4px;
    border: 1px solid #13A59C;
    opacity: 1;

}
#bg-anamaly-chart-form-border-left .form-border-left:nth-child(2){

    position: absolute;
    left:0px;
    top:170px;
    /* background-color:#58A585; */
    width: 1px;
    height: 11px;
    background: #00FFFF;
    opacity: 1;

}
#bg-anamaly-chart-form-border-left .form-border-left:nth-child(3){

    position: absolute;
    left:0px;
    top:254px;
    /* background-color:#58A585; */
    width: 3px;
    height: 3px;
    background: #00FFFF;
    border-radius: 50%;
    opacity: 1;
    

}
#bg-anamaly-chart-form-border-left .form-border-left:nth-child(4){

    position: absolute;
    left:0px;
    top:267px;
    /* background-color:#58A585; */
    width: 3px;
    height: 3px;
    background: #00FFFF;
    border-radius: 50%;
    opacity: 1;

}
#bg-anamaly-chart-form-border-left .form-border-left:nth-child(5){
 /*    width:20px;
    height:20px; */
    position: absolute;
    left:0px;
    top:290px;
    /* background-color:#58A585; */
    width: 2px;
    height: 4px;
    border: 1px solid #AAB9C5;
    opacity: 1;
}

#bg-anamaly-chart-form-border-right{
    width:50px;
    height:100%;
    position:relative;
    right:1px;
}
#bg-anamaly-chart-form-border-right .form-border-right:nth-child(1){

    position: absolute;
    right:0px;
    top:84px;
    /* background-color:#58A585; */
    width: 3px;
    height: 3px;
    background: #00FFFF;
    border-radius: 50%;
    opacity: 1;

}
#bg-anamaly-chart-form-border-right .form-border-right:nth-child(2){
    width:20px;
    height:20px;
    position: absolute;
    right:1px;
    top:170px;
    /* background-color:#58A585; */
    width: 1px;
    height: 11px;
    background: #00FFFF;
    opacity: 1;

}
#bg-anamaly-chart-form-border-right .form-border-right:nth-child(3){
    width:20px;
    height:20px;
    position: absolute;
    right:1px;
    top:307px;
    /* background-color:#58A585; */
    width: 2px;
    height: 4px;
    border: 1px solid #AAB9C5;
    opacity: 1;

}
/*****************异常检测参数表背景*****************/
#bg-anamaly-chart-param-border{
    display:flex;
    position:absolute;
    width: 100%;
    height: 284px;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
}
#bg-anamaly-chart-param-border-left{
    position:relative;
    left:1px;
    width:50px;
    height:100%;
}
#bg-anamaly-chart-param-border-left .param-border-left:nth-child(1){

    position: absolute;
    left:0px;
    top:81px;
    /* background-color:#58A585; */
    width: 2px;
    height: 4px;
    border: 1px solid #13A59C;
    opacity: 1;

}
#bg-anamaly-chart-param-border-left .param-border-left:nth-child(2){

    position: absolute;
    left:0px;
    top:135px;
    /* background-color:#58A585; */
    width: 1px;
    height: 10px;
    background: #00FFFF;
    opacity: 1;

}
#bg-anamaly-chart-param-border-left .param-border-left:nth-child(3){

    position: absolute;
    left:0px;
    top:204px;
    /* background-color:#58A585; */
    width: 3px;
    height: 3px;
    background: #00FFFF;
    border-radius: 50%;
    opacity: 1;
    

}
#bg-anamaly-chart-param-border-left .param-border-left:nth-child(4){

    position: absolute;
    left:0px;
    top:213px;
    /* background-color:#58A585; */
    width: 3px;
    height: 3px;
    background: #00FFFF;
    border-radius: 50%;
    opacity: 1;

}
#bg-anamaly-chart-param-border-left .param-border-left:nth-child(5){
    width:20px;
    height:20px;
    position: absolute;
    left:0px;
    top:215px;
    /* background-color:#58A585; */
    width: 2px;
    height: 4px;
    border: 1px solid #AAB9C5;
    opacity: 1;

}
#bg-anamaly-chart-param-border-right{
    width:50px;
    height:100%;
    position:relative;
    right:0px;
}
#bg-anamaly-chart-param-border-right .param-border-right:nth-child(1){

    position: absolute;
    right:1px;
    top:67px;
    /* background-color:#58A585; */
    width: 3px;
    height: 3px;
    background: #00FFFF;
    border-radius: 50%;
    opacity: 1;

}
#bg-anamaly-chart-param-border-right .param-border-right:nth-child(2){
    width:20px;
    height:20px;
    position: absolute;
    right:2px;
    top:135px;
    /* background-color:#58A585; */
    width: 1px;
    height: 10px;
    background: #00FFFF;
    opacity: 1;

}
#bg-anamaly-chart-param-border-right .param-border-right:nth-child(3){
    width:20px;
    height:20px;
    position: absolute;
    right:1px;
    top:239px;
    /* background-color:#58A585; */
    width: 2px;
    height: 4px;
    border: 1px solid #AAB9C5;
    opacity: 1;

}

/**
 * @异常检测图表
 * @内容部分
 */
/*************************选择器部分*********************/
 /* i.anticon.anticon-down.ant-select-arrow-icon {
  display: none;
} */
.ant-select-selection--single .ant-select-selection__rendered {
  margin-right: 4px;
  color:#B2B2B2;
}
.ant-select-selection__placeholder {
  left: -15px;
}
.ant-select-arrow .ant-select-arrow-icon svg {
  transition: transform 0.3s;
  fill: #00FFFF;
}
.ant-select-selection.ant-select-selection--single {
  width: 108px;
  height: 28px;
  background: #0F203E;
  border: 1px solid #00898B;
  opacity: 1;
  border-radius: 2px;
}
.ant-select-selection__rendered {
    display: block;
    margin-left: 11px;
    margin-right: 11px;
    position: relative;
    line-height: 27px;
}
/*************************表格部分*********************/
div#statisticTable {
  background: #09344C;
  height:100%;
}
/* .ant-table-wrapper {
  position: relative;
  top: 10px;
} */
/* .ant-table-body {
  max-height: 180px;
} */
.ant-table-header.ant-table-hide-scrollbar {
  position:relative;
  top:10px;
}
/* .ant-table-header.ant-table-hide-scrollbar {
  background:#09344C;
} */
table {
  background: #09344C;
}
div.ant-table-body {
  color:#E9E9E9;
  overflow-y: scroll;
  max-height: 180px;
}
div.ant-table-body {
  max-height: 180px;
}
span.ant-table-column-title {
  color: #E9E9E9;
} 
.ant-table-small {
  border: 0px solid #e8e8e8;
  border-radius: 0px;
}
.ant-table-thead > tr, .ant-table-tbody > tr {
  transition: all 0s, height 0s;
}
.ant-table-small > .ant-table-content .ant-table-header {
  background-color: #09344C;
}
.ant-table-fixed-header .ant-table-scroll .ant-table-header {
  margin-bottom: -45px;
  padding-bottom: 20px;
  overflow: scroll;
  opacity: 0.9999;
}
.ant-table table {
  width: 100%;
  text-align: left;
  border-radius: 0px 0px 0 0;
  border-collapse: separate;
  border-spacing: 0;
}
.ant-table-tbody > tr > td {
  border-bottom: 0.1px solid #00898B;
  border-bottom-color: rgba(0,137,139,0.35);
  transition: all 0s, border 0s;
}
.ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
    background: rgba(15,74,98,0.8);
}
.ant-table-tbody > tr.ant-table-row-selected td {
    color: inherit;
    background: rgba(20,120,155,1);
}
.ant-table-thead > tr:hover.ant-table-row-selected > td, .ant-table-tbody > tr:hover.ant-table-row-selected > td {
    background: rgba(20,120,155,1)!important;
}
/* .ant-table-thead > tr > th {
    border-bottom: 0px solid #e8e8e8;
    transition: background 0.3s ease;
} */
.ant-table-thead > tr > th {
    border-bottom: 0px solid #e8e8e8;
    border-bottom-color:rgba(0,0,0,0);
    /* padding-bottom:10px;
    margin-bottom: -35px; */
    transition: background 0.3s ease;
}
/* .ant-table-fixed-header .ant-table-scroll .ant-table-header {
    margin-bottom: -35px;
    padding-bottom: 10px;
    overflow: scroll;
    opacity: 0.9999;
} */
.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body {
    position: relative;
    /*border-left: 11px solid #888;*/
    background: #09344C;
    padding: 0px 0px;
}
/*************************时间选择部分*********************/
.ant-calendar-picker-input.ant-input {
  line-height: 1.5;
  background: #0F203E;
  border: 0px solid #00F;
  color: white;
  font-family: Source Han Sans CN;
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
/**
 * 异常检测曲线表格内容
 */
/*  div#table-action .ant-btn:nth-child(1) {
    background: #03A3A5;
    border: 0;
    color: white;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
} */
button.ant-btn.btn-processed.ant-btn-sm {
    /* disabled:true;
    pointer-events: none; */
    background:#B2B2B2;
    border: 0;
    color: white;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
}
button.ant-btn.btn-untreated.ant-btn-sm {
    /* disabled:true;
    pointer-events: none; */
    background:#03A3A5;
    border: 0;
    color: white;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
}

div#table-action .ant-btn:nth-child(2) {
    background: #FD9727;
    border: 0;
    color: white;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
}






/**
 * @异常参数图表
 * @内容部分
 */
 #anamaly-param-form-content{
   display:flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: center;
 }

/******************头部(参数类型选择器//参数搜索输入框)********************************/
#anamaly-param-form-content-header{
  width:395px;
  height:28px;
}

#anamaly-param-form-content-table{
  width:395px;
 /*  height:218px; */
  height:234px;

}
input.ant-input {
  /* width: 128px; */
  color:#B2B2B2;
  height: 28px;
  background: #0F203E;
  border: 1px solid #00898B;
  opacity: 1;
  border-radius: 2px;
}
i.anticon.anticon-search.ant-input-search-icon svg{
  fill:rgba(182,182,182,1)
}
.ant-table-header.ant-table-hide-scrollbar:nth-child(2) {
  position:relative;
  top:15px;
}

/**********/

/**************************************************************/
/**************************************************************/
/****todo: 异动种类分析******/
/**************************************************************/
/***************************************************************/

/*********异动种类分析tab内容框架**********/
#anamaly-catagory-statistic-tab{
  width: 1400px;
  height: 684px;
  background: #09344C;
  opacity: 0.99;

/*   display:flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: stretch;
  align-items: stretch; */
}

/***********************************************/
/***************异动种类分析背景设计**********************/
/***********************************************/
#anamaly-catagory-statistic-logo{
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: center;


  width:385px;
  height:38px;
  /* position:absolute; */
  background:url(${bgAnamalyDetectFormLogo})
}
#bgAnamalyCatagoryStatistic{
    width:1400px;
    height:684px;
    /* position:absolute; */

}
#anamaly-catagory-statistic-logo-text{
  position:relative;
/*     top:-38px; */
  left:-82px;
  width: 120px;
  height: 26px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  line-height: 26px;
  color: #FFFFFF;
  opacity: 1;

}

/***************异常种类分析内容部分************************/
/**
 * 异常种类分析内容框架
 */
#contentAnamalyCatagoryStatistic{
  display:flex;
  /* background-color:tomato; */
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
  align-items: stretch;
}
/* span.highcharts-title {
    position: absolute;
    font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
    font-size: 18px;
    white-space: nowrap;
    margin-left: 0px;
    margin-top: 0px;
    left: 179px;
    top: 13px;
    color: rgb(255, 255, 255);
} */
text.highcharts-title{
    position: absolute;
    font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
    font-size: 18px;
    white-space: nowrap;
    margin-left: 0px;
    margin-top: 0px;
    left: 179px;
    top: 13px;
    color: rgb(255, 255, 255);
}

/**************原内容****************/
#statisticTableContainer{
    display:flex;
    width: 100%;
    height: 551px;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-content: space-around;
    align-items: stretch;
}
#statistic-table-filter-container{
    width:209px;
    height:100%;
    background-color: #1F6A93;
}
#statistic-table{
    width:1625px;
    height:100%;
    background-color: #1F8893;
}
#statisTableFilterContainer{
    display:flex;
    width: 528px;
    height: 28px;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-content: space-start;
    align-items: stretch;
}
#statisTableFilterContainer .table-filter{
    width: 108px;
    height: 28px;
    background-color: #9CBBFF;
    font-size:10px;
    color:#FFFDAB;
    text-align:center;
}
#statisTableFilterContainer .statistic-filter-select{
    width: 108px;
}

.ant-select-selection--single {
    height: 38px;
}
.ant-select-selection__placeholder, .ant-select-search__field__placeholder {
    text-align: center;
    font-size:12px
}
/* .ant-select-selection__placeholder {
    font-size: 12px;
} */
#dataAnamalyContainer{
    display:flex;
    width: 100%;
    height: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    align-items: stretch;
}
#data-anamaly-parameters-table{
    height:100%;
    width:636px;
    background-color: #eee;
}
#data-anamaly-chart-container{
    height:100%;
    width:1200px;
    background-color: #abc;
}
#dataAnamalyParametersTable{
    display:flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
}
#dataAnamalyParametersTable .param-filter-select{
    width: 150px;
}
#dataAnamalyChartContainer{
    display:flex;
    background-color:tomato;
    width: 100%;
    height: 100%;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: stretch;
    align-items: stretch;
}
#dataAnamalyChartContainer .data-anamaly-curve{
    width: 100%;
    height:720px;
    background-color: #152558
}
#dataAnamalyChartContainer .curve-container{
    width: 100%;
    height: 700px;
}
#htDiv-kkf8i7oj0-1760{
    transform: matrix(1, 0, 0, 1, 1022, 2000);
}
`;

document.getElementsByTagName('head')[0].appendChild(css);
