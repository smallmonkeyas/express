/*
 * @Author: your name
 * @Date: 2021-07-30 00:18:42
 * @LastEditTime: 2021-07-30 00:18:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SolidPollutionItem\compenent\flowchart\flowReuseCom_copy.js
 */
/* eslint-disable no-use-before-define */
/* eslint-disable object-shorthand */
/* eslint-disable vars-on-top */
/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
/* eslint-disable no-unused-vars */

import React, { Component } from "react";
import moment from "moment";

window.moment = moment;
// var layout = document.querySelector('div#Layout_f2a2f29271924e8d885e63249f7a65d4')

let cookie = {};
const now = moment();
class CustomComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      factoryName: "sss",
      locationX: 0,
      locationY: 0,
    };
    this.factoryRef = React.createRef();
  }
  componentDidMount = () => {
    cookie = getCookie();
    // // console.log('cookie', cookie);
    // 趋势y轴自适应
    const listenObj = document.querySelector("div.wrap_36Hx4");
    setSelectContentChangeEvt(listenObj);
    // 全屏操作
    document.body.onload = addEventListenerToBtn();
    window.onbeforeunload = removeBtnObj;
    // 定时刷新
    initFreshData(); // 初始化-监听
    // setInterval(intervalFreshData, 3000);
    // 新增factoryElement元素
    // document.querySelector(".htDivFlex").after(factoryElement);
    /* let factoryEle = document.querySelector("#factory-element").parentNode.parentNode.parentNode;
    this.factoryRef.current.style.height = '60px';
    this.factoryRef.current.style.left = '0px';
    this.factoryRef.current.style.position = 'float'
    // this.factoryRef.current.clientWidth = '100px'

    // console.log(factoryEle,document.body.clientWidth,this.factoryRef.current.parentNode.parentNode.parentNode); */
    // 流程图标题修改
    const oobj = parmseToObject(); // 获取pageid传参
    let factoryName;
    if (!!(oobj && oobj.factoryName)) {
      // console.log("factoryName", oobj.factoryName);
      factoryName = decodeURIComponent(oobj.factoryName);
    } else {
      factoryName = "";
    }
    const setFactoryNamePromise = setFactoryName(factoryName);
    setFactoryNamePromise.then((res) => {
      console.log(res);
    });
  };

  render() {
    const { factoryName, locationX, locationY } = this.state;
    return (
      <div
        id="factory-element"
        ref={this.factoryRef}
        style={{
          position: "absolute",
          left: locationX,
          top: locationY,
          zIndex: 111,
          fontSize: "40px",
          color: "white",
          width: "800px",
          height: "100px",
          backgroundColor: "#0F203E",
        }}
      >
        {factoryName}
      </div>
    );
  }
}

export default CustomComp;

/**
 *
 */
// 客户端为IE11浏览器时不支持ES6脚本
let css;
const cssInnerHTML = `
    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    }
    
    /* Tooltip text */
    .tooltip .tooltiptext {
      visibility: hidden;
      width: 140px;
      
      font-size:200%;
      background-color: #000;
      color: #fff;
      text-align: center;
      /*vertical-align: middle;*/
      padding: 5px 0;
      border-radius: 6px;
    
      /* Position the tooltip text */
      position: absolute;
      z-index: 1;
      bottom: 125%;
      right: 0%;
      margin-left: -60px;
    
      /* Fade in tooltip */
      opacity: 0;
      transition: opacity 0.8s;
    }
    
    /* Tooltip arrow */
    .tooltip .tooltiptext::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #555 transparent transparent transparent;
    }
    
    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
    `;
// document.getElementsByTagName("head")[0].appendChild(css);

const toggleFullscreen = function () {
  const element = document.documentElement;
  const isFull = !!(
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement
  ); //! document.webkitIsFullScreen都为true。因此用!!

  // elem.call(document)
  if (!isFull) {
    const fullElem =
      element.requestFullScreen || //W3C
      element.webkitRequestFullScreen || //Chrome等
      element.mozRequestFullScreen || //FireFox
      element.msRequestFullScreen; //IE11;
    //   // console.log('fullElem',fullElem)
    fullElem.call(element);

    // document.documentElement.requestFullscreen();
  } else {
    // 判断各种浏览器，找到正确的方法
    const exitfullElem =
      document.exitFullscreen || //W3C
      document.mozCancelFullScreen || //Chrome等
      document.webkitExitFullscreen || //FireFox
      document.webkitExitFullscreen; //IE11
    //   // console.log('exitfullElem',exitfullElem)
    // if (document.exitFullscreen) {
    // document.exitFullscreen();
    exitfullElem.call(document);
    // }
  }
};

const addTooltipText = function (item) {
  // // console.log(item);
  const sapnTooltipText = document.createElement("span");
  if (!document.fullscreenElement) {
    sapnTooltipText.innerText = "进入全屏";
  } else if (document.exitFullscreen) {
    sapnTooltipText.innerText = "退出全屏";
  }
  sapnTooltipText.className = "tooltiptext";
  item.parentNode.appendChild(sapnTooltipText);
  item.parentNode.className = "tooltip";
};
const toggleToolTipText = function (item) {
  const sapnTooltipText = document.querySelector("span.tooltiptext");
  // // console.log('hoverText', sapnTooltipText);
  const isFull = !!(
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement
  ); //! document.webkitIsFullScreen都为true。因此用!!
  if (!isFull) {
    sapnTooltipText.innerText = "进入全屏";
  } else {
    // if (document.exitFullscreen) {
    sapnTooltipText.innerText = "退出全屏";
    // }
  }
};
const addEventListenerToBtn = function () {
  // // console.log('页面加载完成');
  const btnObj = document.querySelector("button.ant-btn.printHidden") || {};
  if (btnObj !== {}) {
    addTooltipText(btnObj);
    btnObj.addEventListener("click", toggleFullscreen);
    btnObj.addEventListener("mouseover", toggleToolTipText);
  }
  css = document.createElement("style");
  css.innerHTML = cssInnerHTML;
  document.getElementsByTagName("head")[0].appendChild(css);
};
const removeBtnObj = function () {
  css.remove();
};
/** **************************************************************************************** */
/**
 * * 数据刷新模块
 */
// 时间转换utc->YYYY-MM-DD HH:mm:ss
// var utc_datetime = "2017-03-31T08:02:06Z";
function utc2beijing(dateForm) {
  if (dateForm === "") {
    // 解决deteForm为空传1970-01-01 00:00:00
    return "";
  }
  const dateee = new Date(dateForm).toJSON();
  const date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");
  return date;
}
// 获取最新数据及刷新时间
function getPropertyLastVQTValue(objName, propName) {
  return new Promise((resolve) => {
    scriptUtil.excuteScriptService(
      {
        objName, // 对象实例名
        // serviceName: 'getAlarmInterfaceInfo', // 服务名
        serviceName: "getPropertyVQTValue", // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { propName },
      },
      (res) => {
        resolve(res);
        // result = res;
        // // // console.log('res',res)
        // result = res
      }
    );
  });
}
// 延时200ms
function delayXms(x, X) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, X);
  });
}
// 定时刷新数据
const intervalFreshData = async function () {
  let dataProperityPArr;
  while (true) {
    const x = await delayXms(200);
    const dataLinkObj = document.querySelector(".datalink-tooltip .properties");
    dataProperityPArr = dataLinkObj.querySelectorAll("p");
    const objName = dataProperityPArr[0].lastChild.textContent;
    const propName = dataProperityPArr[2].lastChild.textContent;
    if (propName && objName) break;
  }

  // // // console.log('objName',objName);
  // // // console.log('propName',propName);
  // // // console.log('propName===',propName==='')

  const freshData = await renderFreshData(dataProperityPArr);
  //   renderFreshDataPromise.then(renderFreshData => {
  //   // console.log('renderFreshData',renderFreshData)
  // 更新最后一次数据更新时间
  dataProperityPArr[6].innerHTML = `<span>最后更新时间：</span><br>${freshData.lastTimeStr}`;
  // //   更新当前时间
  // dataProperityPArr[7].innerHTML = `<span>当前时间：</span><br>${utc2beijing(
  //   new Date()
  // )}`;
  // 数据刷新频率
  dataProperityPArr[8].innerHTML = `<span>刷新频率：</span><br>${freshData.fzRangeStr}`;
  return true;
  //   });
};
async function renderFreshData(dataTooltipPArr) {
  const dataProperityPArr = dataTooltipPArr;
  const objName = dataProperityPArr[0].lastChild.textContent;
  const propName = dataProperityPArr[2].lastChild.textContent;
  // getPropertyLastVQTValue获取数据源最后一次有效的数据信息
  const propertyLastHisDataRes = await getPropertyLastVQTValue(
    objName,
    propName
  );
  const res = propertyLastHisDataRes;
  let originVQTTime = 0;
  //   // console.log('res', res);
  const isActive = res.code === "200" ? !!res.result.tags : false;
  if (!isActive)
    return {
      lastTimeStr: "——",
      fzRangeStr: "——",
    };

  originVQTTime =
    res.result.tags.quality === "0" && res.result.tags.originalTime > 0
      ? res.result.tags.originalTime
      : res.result.tags.status === "0" && res.result.tags.serverTime > 0
      ? res.result.tags.serverTime
      : 0;

  // // console.log('propertyLastHisDataPromiseRes', res);

  // TODO: 获取数据刷新频率
  const startTime = moment(now).subtract(12, "days").utc().format();
  const endTime = moment(now).utc().format();
  const limit = 100;
  const fzRange = await getSinglePropFz(
    objName,
    propName,
    startTime,
    endTime,
    limit
  );
  // // console.log(fzRange);
  let fzRangeStr = "";
  if (fzRange.minFz === -Infinity || fzRange.minFz === Infinity|| isNaN(fzRange.minFz)) {
    fzRangeStr = "——";
  } else {
    fzRangeStr =
      fzRange.maxFz === fzRange.minFz
        ? ` ${fzRange.minFz} S`
        : ` ${fzRange.minFz} ~ ${fzRange.maxFz} S`;
  }

  // TODO: 最后一次数据刷新时间
  const lastTime = await getLastFreshTime(objName, propName, originVQTTime);
  const lastTimeStr = moment(lastTime).utc().format("YYYY-MM-DD HH:mm:ss");
  return {
    lastTimeStr: lastTimeStr,
    fzRangeStr: fzRangeStr,
  };
}
async function getLastFreshTime(objName, propName, originVQTTime) {
  // // console.log('getLastFreshTime', originVQTTime);
  const nowTime = new Date().getTime();
  const VQTnowTimeDiff = nowTime - originVQTTime;
  let lastTime;
  if (VQTnowTimeDiff / 1000 > 30 * 60) {
    lastTime = originVQTTime;
    return lastTime;
  }

  // 数据刷新频率
  let startTime = moment(originVQTTime).utc().format();
  let endTime = moment().utc().format();
  let limit = VQTnowTimeDiff / 1000;
  if (VQTnowTimeDiff < 0) {
    // 数据刷新频率
    startTime = moment().subtract(1, "hours").utc().format();
    endTime = moment().utc().format();
    limit = 3600;
  }

  const fzRange = await getSinglePropFz(
    objName,
    propName,
    startTime,
    endTime,
    limit
  );
  lastTime = fzRange.hisData.pop().time;
  const lastTimeOffset = moment(lastTime).add(334, "seconds");
  const nowMoment = moment();
  const lastFreshTime =
    lastTimeOffset > nowMoment
      ? nowMoment.utc().format()
      : lastTimeOffset.utc().format();
  return lastFreshTime;
}

// 数据刷新初始化
const initFreshData = function () {
  // 删除数据源无关属性
  const dataLinkObj = document.querySelector(".datalink-tooltip .properties");
  const dataProperityPArr = dataLinkObj.querySelectorAll("p");
  // // console.log('dataProperityArr', dataProperityPArr);
  // // console.log('datalink-tooltip', dataLinkObj);

  for (let ii = 0; ii < 3; ii++) {
    dataProperityPArr[ii].style.display = "none";
  }
  // 添加数据刷新时间
  const freshTimeElement = document.createElement("p");
  const freshTimeStr = "<span>最后更新时间：</span><br>";

  freshTimeElement.innerHTML = freshTimeStr;

  // var parser = new DOMParser();
  // var lastFreshTime=parser.parseFromString(lastFreshTimeStr, "text/html");

  dataProperityPArr[5].after(freshTimeElement);
  // // console.log('lastFreshTime', freshTimeElement);
  const nowTimeElement = document.createElement("p");
  const nowTimeStr = "<span>当前时间：</span><br>";

  nowTimeElement.innerHTML = nowTimeStr;
  freshTimeElement.after(nowTimeElement);
  const fzElement = document.createElement("p");
  const fzElementStr = "<span>刷新频率：</span><br>";

  fzElement.innerHTML = fzElementStr;
  nowTimeElement.after(fzElement);
  addDataLinkListen();
  // 	setSelectContentChangeEvt(dataProperityPArr[2]);
};
let timer1s;
let timer3s;
// TODO: 设置数据源监听事件-监听鼠标移入、移出事件
const setIntervalfunc = function (func, xms) {
  func();
  return setInterval(func, xms);
};
const freshNowTime = function () {
  const dataLinkObj = document.querySelector(".datalink-tooltip .properties");
  const dataProperityPArr = dataLinkObj.querySelectorAll("p");
  //   更新当前时间
  dataProperityPArr[7].innerHTML = `<span>当前时间：</span><br>${utc2beijing(
    new Date()
  )}`;
};

function addDataLinkListen() {
  //   const dataLinkObj = document.querySelector('.datalink-tooltip .properties');
  //   const dataProperityPArr = dataLinkObj.querySelectorAll('p');
  const listenObjArr = document.querySelectorAll(".draw_g6CsK img");
  // // console.log('addDataLinkListen',dataProperityPArr,listenObjArr)
  // document.querySelectorAll('.draw_g6CsK img').forEach(function(item){item.onclick=function(){// // console.log('也是哦')}})
  listenObjArr.forEach((item, index) => {
    listenObjArr[index].onmouseover = function () {
      timer1s = setIntervalfunc(freshNowTime, 1000);
      timer3s = setIntervalfunc(intervalFreshData, 5000);
      // // console.log('');
    };
    listenObjArr[index].onmouseout = function () {
      clearInterval(timer1s);
      clearInterval(timer3s);
      // // console.log();
    };
  });
}
// 监听事件
// var config,observer;
//  function setSelectContentChangeEvt(listenObj){
//     /****内容改变的监听配置 */
//     // 1.观察器的配置（需要观察什么变动）
//     config = { childList: true, subtree: true,characterData:true };
//     // 2.创建一个观察器实例并传入回调函数
//     observer = new MutationObserver(callback);
//     // 3.选择需要观察变动的节点
//     // // console.log(observer)
//     // 4.以上述配置开始观察目标节点
//     observer.observe(listenObj, config);
//   }

//  function callback(mutationsList, observer){
//      setTimeout(()=>{

//         var dataLinkObj = document.querySelector('.datalink-tooltip .properties')
//         var dataProperityPArr = dataLinkObj.querySelectorAll('p')
//         var objName = dataProperityPArr[0].lastChild.textContent
//         var propName = dataProperityPArr[2].lastChild.textContent
//         // // console.log('objName',objName);
//         // // console.log('propName',propName);
//         // // console.log('propName===',propName==='')
//         if(propName===''||objName==='')return
//         const propertyLastHisDataPromise = getPropertyLastVQTValue(objName,propName)
//     	//更新最后一次刷新时间
//     	propertyLastHisDataPromise.then(res=>{
//     	    if(res.code=='200'){

//     	        if(res.result.time){
//     	            dataProperityPArr[6].innerHTML='<span>最后更新时间：</span><br>'+utc2beijing(res.result.time)
//     	        }
//     	        // // console.log('propertyLastHisDataPromiseRes',utc2beijing(res.result.time))
//     	    }

//     	})
//     	//更新当前时间
//     	dataProperityPArr[7].innerHTML='<span>当前时间：</span><br>'+utc2beijing(new Date())

//             // observer.disconnect();
//             // // 重新观察目标节点
//             // listenObj = document.querySelector('div.wrap_36Hx4')
//             // observer.observe(listenObj, config);
//      },500)
//   };

/**
 * @获取数据刷新频率
 */

function getPropertiesHistoryService(inputsParam) {
  return new Promise((resolve) => {});
}
// 获取单属性历史

// 获取单属性频率
// const dataInfo = {
//     objName:'FactoryList',
//     propName:'GK_CZ_GD_GXHB_G20521',
//     startTime:'2021-05-19T08:41:33Z',
//     endTime:'2021-05-20T08:51:33Z',
//     limit:10000
// }
async function getSinglePropFz(objName, propName, startTime, endTime, limit) {
  const dataInfo = {
    objName: objName,
    propName: propName,
    startTime: startTime,
    endTime: endTime,
    limit: limit,
  };
  // const requestOptions = getRequestOptions(cookie);
  const historyData = await fetchGetHistory(dataInfo);
  const arrTimeDiff = await getTimeDiff(historyData);

  const fzMinMax = {
    minFz: Math.min(...arrTimeDiff) / 1000,
    maxFz: Math.max(...arrTimeDiff) / 1000,
    hisData: historyData.list,
  };
  console.log("fzMinMax", fzMinMax);
  return fzMinMax;
}
async function getTimeDiff(historyData) {
  // // console.log('historyData', historyData);
  const hisDataObj = historyData.list;
  const arrTime = [];
  hisDataObj.forEach((item) => {
    const timestamp = new Date(item.time).getTime();
    arrTime.push(timestamp);
  });
  // // console.log(arrTime);
  const arrTimePop = [...arrTime];
  const arrTimeDiff = [];
  arrTimePop.pop();

  arrTimePop.forEach((item, index) => {
    // // console.log(index, item);
    arrTimeDiff.push(arrTime[index + 1] - item);
  });
  let diffTime = [];
  arrTimeDiff.forEach((item) => {
    if (item > 1000 * 60 * 30) return;
    diffTime.push(diffTime);
  });
  console.log(diffTime, arrTimeDiff);
  // // 开头添加0后删除最后一位
  // arrTime.unshift(0)
  // arrTime.pop();
  // const arrTimeShiftRight = arrTime;
  // // // console.log('arrTimeShiftRight',arrTimeShiftRight)
  // const arrTimeDiff =
  // // console.log(arrTimeDiff);
  return diffTime;
}
// Array.prototype.max = function(){
//     return Math.max.apply({},this)
//     }
//     Array.prototype.min = function(){
//     return Math.min.apply({},this)
//     }
/**
 * @系统信息api
 */

// TODO: 获取Authorization
// TODO: 获取cookie
var getCookie = function (name) {
  // 获取当前所有cookie
  var strCookies = document.cookie;
  // 截取变成cookie数组
  var array = strCookies.replace(/ /g, "").split(";");
  // var array = strCookies.split('; ');
  // // console.log(array);
  // 循环每个cookie
  const cookieObj = {};
  array.forEach((item) => {
    const o = item.split("=");
    cookieObj[o[0]] = o[1];
  });
  // for (var i = 0; i < array.length; i++) {
  //     // 将cookie截取成两部分
  //     var item = array[i].split("=");
  //     // // // console.log(item)
  //     // 判断cookie的name 是否相等
  //     if (item[0] === name) {
  //         return item[1];
  //     }
  // }
  return cookieObj;
};

async function getRequestOptions(dataInfo) {
  const { objName, propName, startTime, endTime, limit } = dataInfo;
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${cookie.suposTicket}`);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Cookie",
    `vertx-web.session=${cookie["vertx-web.session"]}`
  );

  var rawObj = {
    list: [
      {
        dataSource: `${objName}.${propName}`,
        type: "Property",
        filters: {
          minDate: startTime,
          maxDate: endTime,
          aggrType: "first", // first|last
          group: "",
          isHistory: true,
          limit: limit,
        },
      },
    ],
  };
  var raw = JSON.stringify(rawObj);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  return requestOptions;
}

async function fetchGetHistory(dataInfo) {
  const { objName, propName, startTime, endTime, limit } = dataInfo;
  const requestOptions = await getRequestOptions(dataInfo);
  const response = await fetch(
    `http://${window.location.hostname}:8080/api/compose/manage/objectdata/batchQuery`,
    requestOptions
  );
  const result = await response.text();
  const hisData = JSON.parse(result);
  return hisData[`${objName}.${propName}`];
}

// fetch("http://10.32.203.157:8080/api/compose/manage/objectdata/batchQuery", requestOptions)
//   .then(response => response.text())
//   .then(result => // // console.log(JSON.parse(result)))
//   .catch(error => // // console.log('error', error));

// setTimeout(()=>{
//     var listenObj = document.querySelector('div.wrap_36Hx4')
//     // // console.log('listenObj',listenObj)
//     setSelectContentChangeEvt(listenObj);
// },1000)
// TODO: 趋势y轴自适应
// 事件监听
var config;
var observer;
function setSelectContentChangeEvt(listenObj) {
  /** **内容改变的监听配置 */
  // 1.观察器的配置（需要观察什么变动）
  config = { childList: true, subtree: true };
  // 2.创建一个观察器实例并传入回调函数
  observer = new MutationObserver(callback);
  // 3.选择需要观察变动的节点
  // console.log(observer);
  // 4.以上述配置开始观察目标节点
  observer.observe(listenObj, config);
}

function callback(mutationsList, observer) {
  setTimeout(() => {
    var listenObj = document.querySelectorAll("div.trendChart");
    if (listenObj.length === 0) return;
    listenObj.forEach((item) => {
      const o = item.id.split("_");
      const id = o[0];
      var trendChartWarning = scriptUtil.getRegisterReactDom(
        // 'htDiv-kgxmbs3m0-10672'
        id
      );
      trendChartWarning.setCurrentConfig("extra->isYAxisCustom", true);
    });
    // observer.disconnect();
    // // 重新观察目标节点
    // listenObj = document.querySelector('div.wrap_36Hx4')
    // observer.observe(listenObj, config);
  }, 500);
}

/*
 *流程图传参获取
 */
const parmseToObject = function () {
  let parmse = window.location.search;
  if (!parmse) return {};
  parmse = parmse.replace(/\?/, "").split("&");
  const obj = {};
  parmse.forEach((item) => {
    const o = item.split("=");
    obj[o[0]] = o[1];
  });
  return obj;
};

//往factoryTemplemte实例下的factoryName属性写值

function setPropertyValue(objName, propName, propValue) {
  return new Promise((resolve) => {
    scriptUtil.excuteScriptService(
      {
        objName: objName, // 对象实例名
        serviceName: "setPropertyValue", // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { propName: propName, propValue: propValue },
      },
      (res) => {
        resolve(res);
        // result = res;
        // // // console.log('res',res)
        // result = res
      }
    );
  });
}

//往factoryTemplemte实例下的factoryName属性读值

function getPropertyValue(objName, propName) {
  return new Promise((resolve) => {
    scriptUtil.excuteScriptService(
      {
        objName: objName, // 对象实例名
        serviceName: "getPropertyValue", // 服务名
        // fields: 列名数组,多列用','号分割.若filelds不传值或为空值则查询全部列.
        params: { propName: propName },
      },
      (res) => {
        resolve(res);
        // result = res;
        // // // console.log('res',res)
        // result = res
      }
    );
  });
}

async function setFactoryName(factoryName) {
  const objName = "factoryTemplemte";
  const propName = "factoryName";
  const propValue = factoryName;
  if (factoryName !== "") {
    const setPropertyValueRes = await setPropertyValue(
      objName,
      propName,
      propValue
    );
  }
  const getPropertyValueRes = await getPropertyValue(objName, propName);
  const facArr = document.querySelectorAll(
    ".labelContent_2A4Q7,.labelContent_middle_CeyZZ"
  );
  if (getPropertyValueRes.code === "200" && facArr.length > 0) {
    // console.log("getPropertyValueRes", getPropertyValueRes);
    // const facArr = document.querySelectorAll(
    //   ".labelContent_2A4Q7,.labelContent_top_1ihD9"
    // );
    facArr.forEach((item) => {
      item.innerText = getPropertyValueRes.result;
    });
    return "改变企业名称成功";
  } else {
    return "未改变企业名称";
  }

  // return getPropertyValue;
}
// 添加企业div并覆盖到原先位置上
function renderFactoryElement() {
  const factoryElement = document.createElement("div");
  const factoryElementStr = "<span>  </span><br>";

  factoryElement.innerHTML = factoryElementStr;
  document.querySelector(".htDivFlex").after(factoryElement);
}
