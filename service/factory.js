/*
 * @Author: your name
 * @Date: 2021-08-21 20:23:54
 * @LastEditTime: 2021-08-23 00:56:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\service\datamiss.js
 */
//TODO: 引入第三方库
const request = require("request");
const fs = require("fs");
const readlineSync = require("readline-sync");
const moment = require("moment");
const os = require("os");
const path = require("path");
//TODO: 引入本地库
const XLSX_JSON = require("../script/XLSX_JSON");
const system = require("../script/system");
const table = require("../api/home/runtime/datatable");
const oauth = require("../api/home/system/oauth");
const properties = require("../api/home/metadata/properity");
const object = require("../api/home/metadata/object");
const metadata = require("../api/home/metadata/data");

const database = require("../api/home/runtime/database");

const vendor = require("../api/vendor/vendor");


const getDataTableEntry = async function (key1, key2) {
    let sql = `select ${key1} e,${key2} o from tbl_FactoryTable_factoryex limit 300 offset 0`;
    const data = { input: JSON.stringify({ sql: sql }), pageSize: "200" };
    const object = "FactoryTable";
    const jsonFactoryTable = await table.select(data, object);
    const arrFactoryTable = jsonFactoryTable.result
      ? jsonFactoryTable.result.error
        ? {}
        : jsonFactoryTable.result.data.dataSource
      : {};
    // if(jsonFactoryTable.result.error===true)
    // const arrFactoryTable = jsonFactoryTable.result.data.dataSource;
    const strFactoryTable = JSON.stringify(arrFactoryTable);
    const str = strFactoryTable
      .replace(/\",{1}\"/g, '":"')
      .replace(/(\"e\":)|(\"o\":)|[{}]/g, "")
      .replace(/\[/g, "{")
      .replace(/\]/g, "}");
    const obj = JSON.parse(str);
    // const objectName = objEpcodeObject["320281400009494"]
    return obj;
  };
  
  const getFactor = async function (router, params, factor) {
    const jsonData = await vendor.get(router, params);
    var arr = [];
    if (jsonData.info.toLocaleLowerCase() !== "success") return arr;
    jsonData.data.forEach((item) => {
      arr.push(item[factor]);
    });
    return arr;
  };
  //利用supos接口得到某企业多个因子的最近10分钟数据
  const getFactoryFactorsHis = async function (
    Epcode,
    EpcodeObjname,
    factoryName
  ) {
    //TODO: 获取该企业所有关键参数
    let currentEpcode = Epcode;
    //TODO: ①查询企业所有关键参数("serverapi/data/rtd?epcode=xxx&mode=1")
    let params = { epcode: currentEpcode, mode: "1" };
    const factors = await getFactor(
      "serverapi/data/rtd",
      JSON.stringify(params),
      "name"
    );
    const fatorsDesc = await getFactor(
      "serverapi/data/rtd",
      JSON.stringify(params),
      "description"
    );
    if (factors.length === 0) {
      return `${EpcodeObjname[Epcode]}-${factoryName}:未获取到关键参数`;
    }
    //TODO: ②遍历所有关键参数，获取每个参数最近10分钟的历史值
    const beginTime = moment().subtract(30, "minutes").utc().format();
    let objName = EpcodeObjname[Epcode];
    const datahisResult = await getPropertyVQTValues(objName, factors);
    if (Object.keys(datahisResult).length === 0)
      return `${EpcodeObjname[Epcode]}-${factoryName}:获取到关键参数,获取数据出错`;
    // //TODO: ③根据数据查询结果判断数据缺失情况
    let hisStatistic = [];
  
    Object.keys(datahisResult).forEach((item, index) => {
      let tags = datahisResult[item]
        ? datahisResult[item].tags
          ? datahisResult[item].tags
          : {}
        : {};
      if (Object.keys(tags).length === 0) return;
      let isAlarm = !!(
        moment(tags.serverTime).isBefore(beginTime) &&
        moment(tags.originalTime).isBefore(beginTime)
      )
        ? 1
        : 0;
      hisStatistic.push({
        //A3204110200006191_8_b00v05v00v00_G22221
        [`A${Epcode}_${item}`]: isAlarm,
        [`A${Epcode}_1_xxx_${item}`]: 1,
        propName: `A${Epcode}_${item}`,
        alarmName: `A${Epcode}_1_xxx_${item}`,
        displayName: `${factoryName}-${fatorsDesc[index]}`,
        serverTime: moment(datahisResult[item].tags.serverTime).format(
          "HH:mm:ss"
        ),
        originalTime: moment(datahisResult[item].tags.originalTime).format(
          "HH:mm:ss"
        ),
      });
    });
  
    return hisStatistic;
  };
  // 遍历所有关键参数，获取每个参数最新的历史值
  const getPropertyVQTValues = async function (objectName, factors) {
    const factorsStr = JSON.stringify(factors);
    const factorsParam = factorsStr.replace(/[\[\]\"]/g, "");
    let data = { propNames: factorsParam };
    let objName = objectName;
    const datahis = await database.getPropertyVQTValues(data, objName);
  
    const datahisResult = datahis ? (datahis.result ? datahis.result : {}) : {};
    return datahisResult;
  };
  //TODO: 添加数据缺失报警对象属性
  const addAlarmObjParam = async function (factory) {
    let factorHisStatis = [];
    factory.forEach((item) => {
      if (!Array.isArray(item)) return;
      factorHisStatis.push(...item);
    });
    //TODO: 数据缺失对象实例添加
    const dataMissObjName = "dataMiss";
    const dataMissDesc = "数据缺失";
    // let objName = dataMissObjName;
    await object.remove(dataMissObjName);
    const dataItem = metadata.objectData(dataMissObjName, dataMissDesc);
    const addRes = await object.add(dataItem);
  
    if (addRes.succeeded === true) {
      // console.log("增加实例成功");
      const promise = factorHisStatis.map((item) => {
        let objName = dataMissObjName,
          propName = item.propName,
          alarmParam = item.alarmName,
          propDesc = item.displayName;
        let data = metadata.properitiesData(
          objName,
          propName,
          alarmParam,
          propDesc,
          item[propName]
        );
        // // console.log(data)
        return properties.add(data, dataMissObjName);
      });
      const promiseall = await Promise.all(promise);
      // console.log("factorHisStatis", factorHisStatis);
      return factorHisStatis;
      
      /* for(let item in factorHisStatis){
        let objName = dataMissObjName,
          propName = item.propName,
          alarmParam = item.alarmName,
          propDesc = item.displayName;
        let data = metadata.properitiesData(
          objName,
          propName,
          alarmParam,
          propDesc
        );
        await properties.add(data, dataMissObjName);
      }
      // console.log(factorHisStatis) */
    }
    // console.log("factorHisStatis", factorHisStatis);
    // const promise = factorHisStatis.map((item) => {
    //   return properties.add();
    // });
    // const promiseall = Promise.all(promise);
  
    return factorHisStatis;
  };
  
  const setPropertyValues = async function (factorHisStatis){
    const stringfyFactory = JSON.stringify(factorHisStatis);
    // const str1 = stringfyFactory.replace(/,\S+(?!={)}/g,"");
    const str2 = stringfyFactory.match(/(?<={).+?(?=,)/g)
      const strConcat = `{${str2.toString()}}`
      const objPropnameValue = JSON.parse(strConcat)
    const objName = 'dataMiss';
    // const data = {"propValues":objPropnameValue};
    const res = await database.setPropertyValues(objPropnameValue, objName)
  
    // const properitiesValueStr = stringfyFactory.replace(/(,\S+(^{)})|{/g,"").replace(/\[/g,"{").replace(/]/g,"}")
    return res
  }
  const setPropertyValue = async function (factorHisStatis){
    const objName = 'dataMiss';
    let data;
    const promise = factorHisStatis.map(item=>{
      data = {
        "propName": item['propName'],
        "propValue": item[item['propName']]
    }
      return database.setPropertyValue(data, objName)
    })
    const promiseall = await Promise.all(promise);
    // const data = {"propValues":objPropnameValue};
    // const res = await database.setPropertyValues(strConcat, objName)
  
    // const properitiesValueStr = stringfyFactory.replace(/(,\S+(^{)})|{/g,"").replace(/\[/g,"{").replace(/]/g,"}")
    return promiseall
  }
  // //利用supos接口得到某企业多个因子的最近10分钟数据
  // const getFactoryFactorsHis = async function (Epcode, EpcodeObject) {
  //   //TODO: 获取该企业所有关键参数
  //   let currentEpcode = Epcode;
  //   //TODO: ①查询企业所有关键参数("serverapi/data/rtd?epcode=xxx&mode=1")
  //   let params = { epcode: currentEpcode, mode: "1" };
  //   const factors = await getFactor(
  //     "serverapi/data/rtd",
  //     JSON.stringify(params),
  //     "name"
  //   );
  //   //TODO: ②遍历所有关键参数，获取每个参数最近10分钟的历史值
  //   let list = [];
  //   const endTime = moment().utc().format();
  //   const beginTime = moment().subtract(10, "seconds").utc().format();
  //   if(factors.length===0){
  //     return `${EpcodeObject[Epcode]}-${Epcode}:未获取到关键参数`
  
  //   }
  //   factors.forEach((item) => {
  //     list.push({
  //       dataSource: `${EpcodeObject[Epcode]}.${item}`,
  //       type: "Property",
  //       filters: {
  //         minDate: beginTime,
  //         maxDate: endTime,
  //         aggrType: "", //first|last
  //         group: "", //10s(20s)
  //         isHistory: true,
  //         limit: 10000,
  //         // "order": "DESC"
  //       },
  //     });
  //   });
  //   let data = {list:list}
  //   const datahis = await database.batchQuery(data)
  //   // //TODO: ③根据数据查询结果判断数据缺失情况
  //   let hisStatistic = []
  //   Object.keys(datahis).forEach(item => {
  //     let hisLen = !!(datahis[item]&&datahis[item].list)?datahis[item].list.length:0
  //     hisStatistic.push({
  //       [item]:hisLen
  //     })
  //   })
  
  //   return hisStatistic;
  // };
  
  // //利用supos接口得到某企业多个因子的最近10分钟数据
  // const getFactoryFactorsHis = async function (Epcode, EpcodeObject) {
  //   //TODO: 获取该企业所有关键参数
  //   let currentEpcode = Epcode;
  //   //TODO: ①查询企业所有关键参数("serverapi/data/rtd?epcode=xxx&mode=1")
  //   let params = { epcode: currentEpcode, mode: "1" };
  //   const factors = await getFactor(
  //     "serverapi/data/rtd",
  //     JSON.stringify(params),
  //     "name"
  //   );
  //   const factorsStr = JSON.stringify(factors);
  //   const factorsParam = factorsStr.replace(/[\[\]\"]/g, "");
  //   const endTime = moment().format("YYYY-MM-DD HH:mm:ss");
  //   const beginTime = moment()
  //     .subtract(10, "minutes")
  //     .format("YYYY-MM-DD HH:mm:ss");
  //   params = {
  //     epcode: Epcode,
  //     name: factorsParam,
  //     begintime: beginTime,
  //     endtime: endTime,
  //   };
  //   const factorsHis = await getFactor(
  //     "serverapi/data/trend",
  //     JSON.stringify(params),
  //     "value"
  //   );
  //   // //TODO: ②遍历所有关键参数，获取每个参数最近10分钟的历史值
  //   // const promise = factors.map((item) => {
  //   //   return ;
  //   // });
  //   // const promiseall = Promise.all(promise);
  
  //   // //TODO: ③根据数据查询结果判断数据缺失情况
  //   // return promiseall;
  //   // console.log(
  //     "EpcodeObject[Epcode]",
  //     num++,
  //     Epcode,
  //     EpcodeObject[Epcode],
  //     JSON.stringify(factors).replace(/[\[\]\"]/g, "")
  //   );
  //   return factors;
  // };