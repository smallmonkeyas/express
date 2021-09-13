/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-09-10 12:34:18
 * @LastEditTime: 2021-09-14 00:44:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\servertable.ts
 */

import "reflect-metadata";
// import mongoose from 'mongoose';

import { Container, Service, Inject } from "typedi";
import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../dao";
import {
    // factoryConfig,
    ruletableConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig,
    ruletableFileConfig,
    GetPropertyValueNetConfig,
    GetPropertyValuesNetConfig,
    IRuleStruct,
    IAlarmStruct,
    alarmtableConfig,
    AlarmObjnameConfig,
    AlarmTypeDescConfig,
    AlarmTypeDeprecated,
    IServerRequestStruct,
    requesttableConfig
} from "../config";
import { CSingleRuleInfo } from "./rule";
import { CRuleTable } from "./ruletable";
import { CAlarmTable } from "./alarmtable";
import { CVHTrendRequest, CPropertyRequest } from "./server-pitch-request";
import { CVendorData, IVendorData } from "./vendor";
import { CSupOSData } from "./supos";
import { User } from "./user";
import { request, system, XLSX_JSON, fs } from "../../modulejs";
import { factoryCollectorTempleData } from "../respository/factory/collector";
import { CDataMiss, CMeanAlarm, CEmissionAlarm } from "./data-anamaly";
// Container.import([CFileOperate, CSingleRuleInfo, CRuleTable, User]);
// @Service("大库数据接口")
// export class CVHRequest extends CVendorData {
@Service("服务请求配置库")
export class CServerRequestTable extends CTable {
    @Inject("大库数据接口")
    vhRequestHandler!: CVHTrendRequest;
    @Inject("supOS对象属性接口")
    propertyRequestHandler!: CPropertyRequest;
    @Inject("连续10分钟无数据或值为0")
    dataMissHandler!: CDataMiss;
    @Inject("日数据不等于小时数据汇总")
    meanAlarmHandler!: CMeanAlarm;
    @Inject("排放量不等于浓度乘以流量")
    emissionAlarmHandler!: CEmissionAlarm;
    // TODO:需要初始化name字段
    async setName(): Promise<any> {
        await this.update({ _id: { $exists: true } }, [
            { $set: { name: { $concat: ["$objname", ".", "$propname"] } } }
        ]);
    }
    async getPropValues(filterObj?: object): Promise<object> {
        let propnameValueArr = await this.select(
            { requesttype: "setPropertyValue", ...filterObj },
            ["value", "propname"]
        );
        // console.log(propnameValueArr);
        let propValues: { [x: string]: any } = {};
        if (!Array.isArray(propnameValueArr)) {
            throw new Error("没有筛选出属性数据");
        }
        propnameValueArr.forEach((item: { [x: string]: any }) => {
            let propname: string = item["propname"];
            if (propname) {
                if (!item["value"]) {
                    throw new Error(`${propname}属性无value值`);
                }
                propValues[propname] = item["value"][0];
            }
        });
        // console.log("propValues", propValues);
        return propValues;
        // let propnameValueStr = JSON.stringify(propnameValueArr);
        // //console.log("propnameValueStr", propnameValueStr);
        // let propValuesStr1 = propnameValueStr.replace(
        //     /("propname":)|(,"value")|[\{\}\\]\\[]]*/gm,
        //     ""
        // );
        // let propValues = `[${propValuesStr1}]`;
        // //console.log("propValues", propValues);
        // // let propValues = propValuesStr1.replace(/\[/g, "{").replace(/\]/g, "}");
        // return JSON.parse(propValues);
    }

    async setPropValues(): Promise<any> {
        let requesttype = "setPropertyValue";
        let objnameArr = await this.distinct("objname", { requesttype: requesttype });
        // console.log("objnameArr", objnameArr);
        const promises = objnameArr.map(async (item: string) => {
            // if (item !== "DataMissAlarm") {
            //     return "返回";
            // }
            let propValues = await this.getPropValues({ objname: item, propexist: true });
            // //console.log(name);
            this.propertyRequestHandler.objname = item;
            this.propertyRequestHandler.propValues = propValues;
            return await this.propertyRequestHandler.setPropertyValues();
            // return await this.propertyRequestHandler.setPropertyValues(item, propValues);
        });
        let promiseall = await Promise.all(promises);
        // return dayAvgRecord;
        return promiseall;
    }
    // async selectName(filterObj: Object): Promise<string> {
    //     let nameObjArr = await this.select(filterObj, ["name"]);
    //     let nameObjStr = JSON.stringify(nameObjArr);
    //     let nameStr = nameObjStr.replace(/[{}\"\[\]:]|(name)/g, "");
    //     return nameStr;
    // }
    async getFieldValueStr(fieldName: string, filterObj: Object): Promise<any> {
        let fieldObjArr = await this.select(filterObj, [fieldName]);
        let fieldObjStr = JSON.stringify(fieldObjArr);
        var reg = new RegExp(`[{}\\"\\[\\]:]|(${fieldName})`, "g");
        // var reg = new RegExp('[{}"[]:]|(' + fieldName + ")", "g");
        let fieldStr = fieldObjStr.replace(reg, "");
        // let fieldStr = fieldObjStr.replace(/[{}\"\[\]:]|(name)/g, "");
        return fieldStr;
    }
    async getFieldValueArr(
        fieldName: string,
        fieldType: string,
        filterObj: Object
    ): Promise<Array<string>> {
        // let type = ['string','number']
        // let regType: string;

        let regType = fieldType === "String" ? '("|\\")' : "";
        let fieldObjArr = await this.select(filterObj, [fieldName]);
        let fieldObjStr = JSON.stringify(fieldObjArr);
        // var reg = new RegExp(`(?<="${fieldName}("|\\"): *("|\\")).+?(?=("|\\"),)`, "g");
        var reg = new RegExp(`(?<="${fieldName}("|\\"|'): *${regType}).+?(?=${regType}},)`, "g");
        // console.log(reg, fieldObjStr);
        // var reg = new RegExp(`[{}\\":]|(${fieldName})`, "g");
        // let fieldStr = fieldObjStr.replace(reg, "");
        // let fieldStr = fieldObjStr.replace(/[{}\"\[\]:]|(name)/g, "");
        // return JSON.parse(fieldStr);
        let fieldValueArr = fieldObjStr.match(reg);
        if (!fieldValueArr) {
            return [];
        }
        // console.log("fieldValueArr", fieldValueArr);
        // if ((fieldType === "Number" || fieldType === "Array") && Array.isArray(fieldValueArr)) {
        //     let fidldValueArr = fieldValueArr.map(Number);
        //     return fidldValueArr;
        // }
        return fieldValueArr;
    }
    async getFieldArrValueArr(fieldName: string, filterObj: Object): Promise<any> {
        let fieldObjArr = await this.select(filterObj, [fieldName]);
        let fieldObjStr = JSON.stringify(fieldObjArr);
        // var reg = new RegExp(`(?<="${fieldName}("|\\"): *("|\\")).+?(?=("|\\"),)`, "g");
        // var reg = new RegExp(`(?<="${fieldName}("|\\"|'): *("|\\")).+?(?=("|\\"|')},)`, "g");
        // //console.log(reg, fieldObjStr);
        var reg = new RegExp(`[{}\\":]|(${fieldName})`, "g");
        let fieldStr = fieldObjStr.replace(reg, "");
        // let fieldStr = fieldObjStr.replace(/[{}\"\[\]:]|(name)/g, "");
        return JSON.parse(fieldStr);
        // let fieldValueArr = fieldObjStr.match(reg);
        // return fieldValueArr;
    }
    // async updateDayAvgValue() {
    //     let name = await this.selectName({ requesttype: "day-avg" });
    //     this.vhRequestHandler.name = name;
    //     this.vhRequestHandler.initNetParam();
    //     let dataDayAvg = await this.vhRequestHandler.getDayAvg();
    //     let dayAvgRecord = await this.select({ requesttype: "day-avg" }, null);
    //     let promises = dayAvgRecord.map((item: IServerRequestStruct, index: number) => {
    //         return this.update({ id: item.id }, { $set: { value: dataDayAvg[index] } });
    //     });
    //     let promiseall = await Promise.all(promises);
    //     // return dayAvgRecord;
    //     return promiseall;
    //     // return dataDayAvg;
    // }
    // async updateHourAvgValue() {
    //     let name = await this.selectName({ requesttype: "hour-avg" });
    //     this.vhRequestHandler.name = name;
    //     this.vhRequestHandler.initNetParam();
    //     let dataDayAvg = await this.vhRequestHandler.getDayAvg();
    //     let dayAvgRecord = await this.select({ requesttype: "day-avg" }, null);
    //     let promises = dayAvgRecord.map((item: IServerRequestStruct, index: number) => {
    //         return this.update({ id: item.id }, { $set: { value: dataDayAvg[index] } });
    //     });
    //     let promiseall = await Promise.all(promises);
    //     // return dayAvgRecord;
    //     return promiseall;
    //     // return dataDayAvg;
    // }
    async batchUpdateValueField(
        whereFilterObj: { requesttype?: string; [prop: string]: any },
        fieldFilter: Array<string> | null,
        fillValueArr: Array<any>,
        fillFieldName?: string
    ) {
        let value = "value";
        if (fillFieldName) {
            value = fillFieldName;
        }
        const { requesttype } = whereFilterObj;
        if (requesttype === "trend") {
            let promises = fillValueArr.map((item) => {
                // //console.log("item", item);
                return this.update(
                    { propname: item[0]["name"], ...whereFilterObj },
                    { $set: { [value]: item } }
                );
            });
            let promiseall = await Promise.all(promises);
            // return dayAvgRecord;
            return promiseall;
        }
        let requestItemArr = await this.select(whereFilterObj, fieldFilter);
        let promises = requestItemArr.map((item: IServerRequestStruct, index: number) => {
            return this.update({ id: item.id }, { $set: { [value]: fillValueArr[index] } });
        });
        let promiseall = await Promise.all(promises);
        // return dayAvgRecord;
        return promiseall;
    }
    async batchUpdateConvertvalueField(
        whereFilterObj: { requesttype?: string; [prop: string]: any },
        fieldFilter: Array<string> | null,
        fillValueArr: Array<any>
    ) {
        const { requesttype } = whereFilterObj;
        if (requesttype === "trend") {
            let promises = fillValueArr.map((item) => {
                // //console.log("item", item);
                return this.update(
                    { propname: item[0]["name"], ...whereFilterObj },
                    // { convertvalue: `<${new Date()}>${JSON.stringify(item)}` }
                    [
                        {
                            $set: {
                                convertvalue: { $concat: ["<", "$id", ">", JSON.stringify(item)] }
                            }
                        }
                    ]
                );
            });
            let promiseall = await Promise.all(promises);
            // return dayAvgRecord;
            return promiseall;
        }
        let requestItemArr = await this.select(whereFilterObj, fieldFilter);
        let promises = requestItemArr.map((item: IServerRequestStruct, index: number) => {
            return this.update(
                { id: item.id },
                {
                    convertvalue: `<${item.id}>${JSON.stringify(fillValueArr[index])}`
                }
            );
        });
        let promiseall = await Promise.all(promises);
        // return dayAvgRecord;
        return promiseall;
    }
    async updateVHValue(requesttype: string) {
        let objnameArr = await this.distinct("objname", { requesttype: requesttype });
        const promises = objnameArr.map(async (item: string) => {
            let name = await this.getFieldValueStr("name", {
                requesttype: requesttype,
                objname: item
            });
            this.vhRequestHandler.name = name;
            // this.vhRequestHandler.initNetParam();
            let vhDataArr = await this.vhRequestHandler.getVhData(requesttype);
            // //console.log("vhDataArr", vhDataArr);
            let updateValue = await this.batchUpdateValueField(
                { requesttype: requesttype, objname: item },
                null,
                vhDataArr
            );
            let updateConvertvalue = await this.batchUpdateConvertvalueField(
                { requesttype: requesttype, objname: item },
                null,
                vhDataArr
            );

            return [updateValue, updateConvertvalue];
            // return await Promise.all([updateValue, updateConvertvalue]);
        });

        // let name = await this.getFieldValueStr("name", { requesttype: requesttype });
        // this.vhRequestHandler.name = name;
        // // this.vhRequestHandler.initNetParam();
        // let vhDataArr = await this.vhRequestHandler.getVhData(requesttype);
        // return await this.pitchUpdateFieldValues({ requesttype: requesttype }, null, vhDataArr);
        // let requestItemArr = await this.select({ requesttype: requesttype }, null);
        // let promises = requestItemArr.map((item: IServerRequestStruct, index: number) => {
        //     return this.update({ id: item.id }, { $set: { value: vhDataArr[index] } });
        // });
        let promiseall = await Promise.all(promises);
        // // return dayAvgRecord;
        return promiseall;
    }
    async updateTrendValue() {
        let requesttype = "trend";
        let objnameArr = await this.distinct("objname", { requesttype: requesttype });
        const promises = objnameArr.map(async (item: string) => {
            let name = await this.getFieldValueStr("name", {
                requesttype: requesttype,
                objname: item
            });
            // //console.log(name);
            this.vhRequestHandler.name = name;
            // this.vhRequestHandler.initNetParam();
            let vhDataArr = await this.vhRequestHandler.getTrendData();
            // //console.log("vhDataArr", vhDataArr);
            let updateValue = await this.batchUpdateValueField(
                { requesttype: requesttype, objname: item },
                null,
                vhDataArr
            );
            let updateConvertvalue = await this.batchUpdateConvertvalueField(
                { requesttype: requesttype, objname: item },
                null,
                vhDataArr
            );

            return [updateValue, updateConvertvalue];
        });
        // let name = await this.getFieldValueStr("name", { requesttype: requesttype });
        // //console.log("name", name);
        // this.vhRequestHandler.name = name;
        // // this.vhRequestHandler.initNetParam();
        // let vhDataArr = await this.vhRequestHandler.getTrendData();
        // //console.log("vhDataArr", vhDataArr);
        // return await this.pitchUpdateFieldValues({ requesttype: requesttype }, null, vhDataArr);
        // let requestItemArr = await this.select({ requesttype: requesttype }, null);
        // let promises = requestItemArr.map((item: IServerRequestStruct, index: number) => {
        //     return this.update({ id: item.id }, { $set: { value: vhDataArr[index] } });
        // });
        let promiseall = await Promise.all(promises);
        // // return dayAvgRecord;
        return promiseall;
    }

    async updateGetPropertyValues() {
        let requesttype = "getPropertyValue";
        // TODO:筛选企业->objname
        let objnameArr = await this.distinct("objname", { requesttype: "getPropertyValue" });
        // TODO:遍历企业依次请求每个企业的所有配置属性，需要完成以下工作：
        // todo:①筛选该企业对应的服务请求配置库的所有propname（以“,”连接）
        // todo:②getPropertyValues获取该企业所有配置属性的当前值
        // todo:③属性当前值拼接
        // TODO:写库
        const promise = objnameArr.map(async (item: string) => {
            let propnamesStr = await this.getFieldValueStr("propname", {
                objname: item,
                requesttype: "getPropertyValue"
            });
            this.propertyRequestHandler.objname = item;
            this.propertyRequestHandler.propname = propnamesStr;
            let propValuesRes = await this.propertyRequestHandler.getPropertyValues();
            let propValuesArr = propValuesRes.result;
            if (!propValuesArr) {
                throw new Error("请检查supOS-getPropertyValues接口");
            }
            // let propValuesStr = JSON.stringify(propValuesArr.result);
            // let updateMid = propnamesStr.replace(/,/g, '\\":)|(');
            // let propnamesRegexStr = new RegExp(`(${updateMid})`, "g");
            // //console.log(propnamesRegexStr);
            // return propValuesStr
            //     .replace(propnamesRegexStr, "")
            //     .replace(/{/g, "[")
            //     .replace(/}/g, "]");
            let pronameArr = propnamesStr.split(",");
            let propertyValuesArr: Array<any> = [];
            pronameArr.forEach((propname: string | number) => {
                propertyValuesArr.push(propValuesArr[propname]);
            });
            let updateValue = await this.batchUpdateValueField(
                { requesttype: requesttype, objname: item },
                null,
                propertyValuesArr
            );

            return updateValue;
        });
        // 获取
        const promiseall = await Promise.all(promise);
        // //console.log(promiseall[0]);
        // TODO:根据getProperty项的value是否为空来决定是否用dafaultvalue来填充
        // this.select({requesttype: "getPropertyValue",value:null})
        // await this.update({ requesttype: requesttype, value: null }, [
        //     { $set: { value: { $concat: ["$defaultvalue"] } } }
        // ]);
        await this.update({ requesttype: requesttype, value: null }, [
            { $set: { value: { $concat: ["$defaultvalue"] } } }
        ]);
        // await this.update({ requesttype: requesttype },
        //     [
        //         { $set: { convertvalue: { $concat: ["$defaultvalue"] } } }
        //     ]
        // );
        // await this.update({ requesttype: requesttype }, [
        //     {
        //         $set: {
        //             convertvalue: {
        //                 $concat: [{ $substr: ["<", "$id", ">", "$value"] }]
        //             }
        //         }
        //     }
        // ]);
        // await this.update({ requesttype: requesttype }, [
        //     { $project: { convertvalue: { $concatArrays: ["$id", "$value"] } } }
        // ]);
        // await this.update({ requesttype: requesttype }, [
        //     {
        //         $set: {
        //             convertvalue: {
        //                 $concat: ["<", "$id", ">", { $convert: { $toString: "$value" } }]
        //             }
        //         }
        //     }
        // ]);
        // await this.update({ requesttype: requesttype }, [
        //     {
        //         // $set: {
        //         convertvalue: {
        //             $concat: [
        //                 "<",
        //                 "$id",
        //                 ">",
        //                 {
        //                     $convert: {
        //                         input: "$value",
        //                         to: "string",
        //                         onError: {
        //                             // $concat表示字段拼接操作符
        //                             $concat: [
        //                                 "can not convert ",
        //                                 { $toString: "$value" },
        //                                 " to string type"
        //                             ]
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //         // }
        //     }
        // ]);
        // await this.update({ requesttype: requesttype }, [
        //     {
        //         $set: {
        //             convertvalue: {
        //                 $concat: [
        //                     "<",
        //                     "$id",
        //                     ">",
        //                     { $addFields: { value: { $toString: "$value" } } }
        //                 ]
        //             }
        //         }
        //     }
        // ]);
        // await this.update({ requesttype: requesttype }, [
        //     {
        //         $set: {
        //             convertvalue: {
        //                 $concat: [
        //                     "<",
        //                     "$id",
        //                     ">",
        //                     { $map: { input: "$value", in: { $toString: "$value" } } }
        //                 ]
        //             }
        //         }
        //     }
        // ]);
        // await this.update(
        //     { requesttype: requesttype },
        //     {
        //         convertvalue: {
        //             $map: {
        //                 input: "$value",
        //                 in: { $toString: "$$this" }
        //             }
        //         }
        //     }
        // );
        // await this.update(
        //     { requesttype: requesttype },
        //     {
        //         $addFields: {
        //             convertvalue: {
        //                 $map: {
        //                     input: "$value",
        //                     in: { $toString: "$$this" }
        //                 }
        //             }
        //         }
        //     }
        // );
        // await this.update({ requesttype: requesttype }, [
        //     {
        //         $set: {
        //             convertvalue: {
        //                 $map: {
        //                     input: "$value",
        //                     in: { $toString: "$$this" }
        //                 }
        //             }
        //         }
        //     }
        // ]);
        // return objnameArr;
        return promiseall;
    }
    async updateSetPropertyValues() {
        /**
         * *功能：批量执行数据缺失任务并返回报警结果数组集合，返回的数组中元素为1则代表报警，0则正常
         * @param {hisDataArrArr:Array<Array<any>>}
         * @return {alarmResultArr:Array<number>}
         */
        // this.select({ alarmtype: 1, requesttype: "trend" });
        let convertValueArr = await this.distinct("convertvalue", {
            alarmtype: 1,
            requesttype: "trend"
        });

        let convertValueArrStr = JSON.stringify(convertValueArr);
        let valueArrStr = convertValueArrStr
            .replace(/(<.*?>)/g, "")
            .replace(/("(?=\[))|((?<=\])")|\\/g, "");
        let valueArr = JSON.parse(valueArrStr);
        let datamissAlarmRes = this.dataMissHandler.batchAlgorithmExec(valueArr);
        let updateDatamissValue = await this.batchUpdateValueField(
            { alarmtype: 1, requesttype: "setPropertyValue" },
            null,
            datamissAlarmRes
        );
        // //console.log("valueArrStr", valueArrStr);
        console.log("数据缺失判定结果(0正常，1报警)：", datamissAlarmRes);
        XLSX_JSON.saveJsonToFile(datamissAlarmRes, __dirname, "datamisslog");
        // //console.log("valueArrStr", convertValueArrStr, valueArrStr);
        // //console.log("valueArr", valueArr.length);
        // return convertValueArr;
        // return updateDatamissValue;
        // todo:均值异常
        let meanAlarmConvertvalueDayavg = await this.distinct("convertvalue", {
            alarmtype: 11,
            requesttype: "day-avg"
        });
        let meanAlarmConvertvalueHouravg = await this.distinct("convertvalue", {
            alarmtype: 11,
            requesttype: "hour-avg"
        });
        let meanAlarmConvertvalueConfig = await this.getFieldArrValueArr("value", {
            alarmtype: 11,
            mark: "configParam"
        });
        let meanAlarmConvertvalueArr = [
            meanAlarmConvertvalueDayavg,
            meanAlarmConvertvalueHouravg,
            meanAlarmConvertvalueConfig
        ];
        let meanAlarmConvertvalueArrStr = JSON.stringify(meanAlarmConvertvalueArr);
        let meanAlarmValueArrStr = meanAlarmConvertvalueArrStr
            .replace(/(<.*?>)/g, "")
            .replace(/("(?=\[))|((?<=\])")|\\/g, "");
        let meanAlarmValueArr = JSON.parse(meanAlarmValueArrStr);
        // //console.log(
        //     "meanAlarmValueArr",
        //     meanAlarmConvertvalueArr,
        //     meanAlarmConvertvalueArrStr,
        //     meanAlarmValueArrStr,
        //     meanAlarmValueArr
        // );
        let meanAlarmRes = this.meanAlarmHandler.batchAlgorithmExec(
            meanAlarmValueArr[0],
            meanAlarmValueArr[1],
            meanAlarmValueArr[2]
        );

        let updateMeanAlarmValue = await this.batchUpdateValueField(
            { alarmtype: 11, requesttype: "setPropertyValue" },
            null,
            meanAlarmRes
        );
        console.log("均值异常判定结果(0正常，1报警)：", meanAlarmRes);
        // return updateMeanAlarmValue;
        // todo:排放量异常
        let emissAlarmConvertvalueEmiss = await this.distinct("convertvalue", {
            alarmtype: 12,
            requesttype: "hour-cou"
        });
        let emissAlarmConvertvalueConcentra = await this.distinct("convertvalue", {
            alarmtype: 12,
            requesttype: "hour-avg",
            mark: "concentraParam"
        });
        let emissAlarmConvertvalueFlow = await this.distinct("convertvalue", {
            alarmtype: 12,
            requesttype: "hour-avg",
            mark: "flowParam"
        });
        let emissAlarmConvertvalueConfig = await this.getFieldArrValueArr("value", {
            alarmtype: 12,
            mark: "configParam"
        });
        // let emissAlarmConvertvalueConfig = await this.distinct("convertvalue", {
        //     alarmtype: 12,
        //     mark: "configParam"
        // });
        // //console.log(
        //     emissAlarmConvertvalueEmiss,
        //     emissAlarmConvertvalueConcentra,
        //     emissAlarmConvertvalueFlow,
        //     emissAlarmConvertvalueConfig
        // );
        // //console.log(
        //     emissAlarmConvertvalueEmiss.length,
        //     emissAlarmConvertvalueConcentra.length,
        //     emissAlarmConvertvalueFlow.length,
        //     emissAlarmConvertvalueConfig.length
        // );
        let emissAlarmConvertvalueArr = [
            emissAlarmConvertvalueEmiss,
            emissAlarmConvertvalueConcentra,
            emissAlarmConvertvalueFlow,
            emissAlarmConvertvalueConfig
        ];
        let emissAlarmConvertvalueArrStr = JSON.stringify(emissAlarmConvertvalueArr);
        let emissAlarmValueArrStr = emissAlarmConvertvalueArrStr
            .replace(/(<.*?>)/g, "")
            .replace(/("(?=\[))|((?<=\])")|\\/g, "");
        let emissAlarmValueArr = JSON.parse(emissAlarmValueArrStr);
        // //console.log(
        //     "meanAlarmValueArr",
        //     meanAlarmConvertvalueArr,
        //     meanAlarmConvertvalueArrStr,
        //     meanAlarmValueArrStr,
        //     meanAlarmValueArr
        // );
        // //console.log("emissAlarmValueArr", emissAlarmValueArr);
        // //console.log(
        //     "emissAlarmValueArrLength",
        //     emissAlarmValueArr[0].length,
        //     emissAlarmValueArr[1].length,
        //     emissAlarmValueArr[2].length,
        //     emissAlarmValueArr[3].length
        // );
        let emissAlarmRes = this.emissionAlarmHandler.batchAlgorithmExec(
            emissAlarmValueArr[0],
            emissAlarmValueArr[1],
            emissAlarmValueArr[2],
            emissAlarmValueArr[3]
        );

        let updateEmissAlarmValue = await this.batchUpdateValueField(
            { alarmtype: 12, requesttype: "setPropertyValue" },
            null,
            emissAlarmRes
        );
        console.log("排放量异常判定结果(0正常，1报警)：", emissAlarmRes);
        return [updateDatamissValue, updateMeanAlarmValue, updateEmissAlarmValue];
        // return emissAlarmValueArr;
    }
    //* 更新属性是否存在列
    async updatePropExist() {
        let requesttype = "setPropertyValue";
        let objnameArr = await this.distinct("objname", { requesttype: requesttype });
        // console.log("objnameArr", objnameArr);
        const promises = objnameArr.map(async (item: string) => {
            // if (item !== "DataMissAlarm") {
            //     return "返回";
            // }
            this.propertyRequestHandler.objname = item;
            let propExistList = await this.propertyRequestHandler.getPropertyList();
            // let propSetList = await this.getFieldValueArr("propname", "string", {
            //     requesttype: requesttype,
            //     objname: item
            // });
            // let propSetList = await this.getFieldValueArr("value", "number", {
            //     requesttype: requesttype,
            //     objname: item
            // });
            let propSetList = await this.getFieldValueArr("propname", "String", {
                requesttype: requesttype,
                objname: item
            });
            // console.log("propSetList", propSetList);
            // console.log("propExistList", propExistList);
            let propExistArr = propSetList.map((item) => {
                return propExistList.includes(item);
            });
            // console.log("属性存在情况：", propExistArr);
            let updateExistFieldValue = await this.batchUpdateValueField(
                { requesttype: requesttype, objname: item },
                null,
                propExistArr,
                "propexist"
            );
            // propSetList.
            return updateExistFieldValue;
            // return await this.propertyRequestHandler.setPropertyValues(item, propValues);
        });
        let promiseall = await Promise.all(promises);
        // return dayAvgRecord;
        return promiseall;
    }
    async updateRequestTable() {
        await this.setName(); // 增加nama字段(即表格的列)：为(对象实例.对象属性)格式
        // const requestTableSel = await this.distinct("objname", { requesttype: "trend" });
        // console.log("requestTableSel", requestTableSel);
        await this.updateVHValue("day-avg"); // 请求大库接口更新value字段中所有日均值数据(只请求均值异常和排放量异常中涉及参数对应的value)
        await this.updateVHValue("hour-avg"); // 请求大库接口更新value字段中所有日小时均值数据(只请求均值异常和排放量异常中涉及参数对应的value)
        await this.updateVHValue("hour-cou"); // 请求大库接口更新value字段中日累计数据(只请求排放量异常中涉及参数对应的value)
        await this.updateTrendValue(); // 请求trend接口更新数据缺失所有记录(即表中的行)对应的value字段值
        await this.updateGetPropertyValues(); // 获取配置参数对应的默认值和配置参数的当前值，并写值到对应的value字段；判断有无当前值，若无当前值，以默认值填充
        let setPropertyRes = await this.updateSetPropertyValues(); //* 算法核心程序：数据缺失、均值异常、排放量异常算法执行，并得到对应的报警结果，报警结果写到value字段(只写到所有报警对象对应的记录)
        // // let propValues = await requestTableHandler.getPropValues();
        await this.updatePropExist(); // 判断要写到平台的报警对象是否存在，若不存在，则标记对应的报警为false，不往对应的对象属性写值
        return setPropertyRes;
    }
}

@Service("服务请求库生成任务类")
export class CServerRequestTableGenerateTask {
    alarmRecord!: IAlarmStruct;
    alarmTableWithEnabled!: Array<IAlarmStruct>;
    requestTableIndex: number = 0;
    dayAvgIndex: number = 0;
    hourAvgIndex: number = 0;
    hourCouIndex: number = 0;
    trendIndex: number = 0;
    getPropertyIndex: number = 0;
    setPropertyIndex: number = 0;
    serverRequestTable: Array<any> = [];
    getDayAvgRecord() {
        // ?前提：已知配置报警配置库的对应的需要请求日均值的记录=>dayAvgRecordByAlarmTable
        let {} = this.alarmRecord;
    }
    getHourAvgRecords() {}
    getHourCouRecords() {}
    getGetPropertyValuesRecords() {}
    getSetPropertyValuesRecords() {}

    getServerRequestTable() {
        this.alarmTableWithEnabled.forEach((alarmRecord) => {
            let {
                objnameInclude,
                includeParamName,
                alarmObjname,
                alarmParamName,
                alarmConfigParam,
                enableConfigparam,
                alarmType,
                alarmConfigParamValue,
                enableStatus
            } = alarmRecord;
            if (alarmType !== 1 && alarmType !== 11 && alarmType !== 12) {
                return;
            }
            if (alarmType === 1) {
                // 数据缺失
                this.serverRequestTable.push({
                    id: String(this.requestTableIndex++),
                    index: String(this.trendIndex++),
                    alarmtype: alarmType,
                    objname: objnameInclude,
                    propname: String(includeParamName),
                    requesttype: "trend"
                });
            }
            if (alarmType === 11) {
                // 均值异常
                this.serverRequestTable.push({
                    id: String(this.requestTableIndex++),
                    index: String(this.dayAvgIndex++),
                    alarmtype: alarmType,
                    objname: objnameInclude,
                    propname: String(includeParamName),
                    datamode: "avg",
                    mode: "day",
                    requesttype: "day-avg"
                });
                this.serverRequestTable.push({
                    id: String(this.requestTableIndex++),
                    index: String(this.hourAvgIndex++),
                    alarmtype: alarmType,
                    objname: objnameInclude,
                    propname: String(includeParamName),
                    datamode: "avg",
                    mode: "hour",
                    requesttype: "hour-avg"
                });
            }
            if (alarmType === 12) {
                // 排放量异常
                this.serverRequestTable.push({
                    id: String(this.requestTableIndex++),
                    index: String(this.hourCouIndex++),
                    alarmtype: alarmType,
                    objname: objnameInclude,
                    propname: includeParamName[0],
                    datamode: "cou",
                    mode: "hour",
                    requesttype: "hour-cou"
                });
                this.serverRequestTable.push({
                    id: String(this.requestTableIndex++),
                    index: String(this.hourAvgIndex++),
                    alarmtype: alarmType,
                    objname: objnameInclude,
                    propname: includeParamName[0],
                    datamode: "avg",
                    mode: "hour",
                    requesttype: "hour-avg",
                    mark: "concentraParam"
                });
                this.serverRequestTable.push({
                    id: String(this.requestTableIndex++),
                    index: String(this.hourAvgIndex++),
                    alarmtype: alarmType,
                    objname: objnameInclude,
                    propname: includeParamName[1],
                    datamode: "avg",
                    mode: "hour",
                    requesttype: "hour-avg",
                    mark: "flowParam"
                });
            }
            this.serverRequestTable.push({
                id: String(this.requestTableIndex++),
                index: String(this.getPropertyIndex++),
                alarmtype: alarmType,
                objname: objnameInclude,
                propname: String(alarmConfigParam),
                requesttype: "getPropertyValue",
                mark: "configParam",
                defaultvalue: String(alarmConfigParamValue)
            });
            this.serverRequestTable.push({
                id: String(this.requestTableIndex++),
                index: String(this.getPropertyIndex++),
                alarmtype: alarmType,
                objname: objnameInclude,
                propname: String(enableConfigparam),
                requesttype: "getPropertyValue",
                mark: "enableParam",
                defaultvalue: String(enableStatus)
            });
            this.serverRequestTable.push({
                id: String(this.requestTableIndex++),
                index: String(this.setPropertyIndex++),
                alarmtype: alarmType,
                objname: alarmObjname,
                propname: String(alarmParamName),
                requesttype: "setPropertyValue",
                mark: "alarmParam"
            });
        });
    }
}
// id?: number;
// objnameInclude: string;
// objnameDisplaynameInclude: string;
// epcode: string;
// factoryType: string;
// includeParamName: Array<string>;
// includeParamDisplayname: Array<string>;
// includeParamDescription: Array<string>;
// alarmObjname: string;
// alarmObjDisplayName: string;
// alarmObjDescription: string;
// alarmParamName: string;
// alarmParamDisplayName: string;
// alarmParamDescription: string;
// alarmProperityName: string;
// alarmProperityDisplayName: string;
// alarmProperityDescription: string;
// alarmType: number;
// alarmTypeDescription: string;
// alarmConfigParam: Array<string>;
// alarmConfigParamValue: Array<number>;
// enableStatus: boolean;
// enableConfigparam: string;
// TODO:筛选报警配置库中包括数据缺失、均值异常、排放量异常在内的表记录(以enableStatus为true即可筛选)

// @Service("服务请求配置库")
// export class CServerRequestTable extends CTable {}

// @Service("服务请求库生成任务类")
// export class CServerRequestTableGenerateTask {}
// /** ************* */
// let alarmTableHandler = Container.get<CAlarmTable>("报警配置库");
// alarmTableHandler.mongodb.conneConfig = alarmtableConfig;
// let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

// ruleTableLocalHandler.file = ruletableFileConfig;
// const ruleJson = ruleTableLocalHandler.excelTojson();

// let dataRes = factoryCollectorTempleData;
// if (dataRes.info.toLocaleLowerCase() === 'success') {
// const resConnect = await alarmTableHandler.connect();
// const resDelete = await alarmTableHandler.deleteAll();
// await alarmTableHandler.add(alarmJson);
// const res = await alarmTableHandler.select(null, null);

// @Service("服务请求配置库")
// export class CServerRequestTable extends CTable {}

Container.import([CAlarmTable]);
async function getRequestTable() {
    let user = Container.get<User>("用户");
    await user.login();
    // let authorization = `Bearer $ticket`;
    // Container.set("authorization-token", authorization); // 设置全局authorization

    const requestTableTaskHandler =
        Container.get<CServerRequestTableGenerateTask>("服务请求库生成任务类");

    const alarmTableHandler = Container.get<CAlarmTable>("报警配置库");
    alarmTableHandler.mongodb.conneConfig = alarmtableConfig;
    const resConnect = await alarmTableHandler.connect();
    // const resDelete = await alarmTableHandler.deleteAll();
    // await alarmTableHandler.add(alarmJson);
    const alarmTable = await alarmTableHandler.select({ enableStatus: true }, null);
    await alarmTableHandler.disconnect();
    requestTableTaskHandler.alarmTableWithEnabled = alarmTable;
    requestTableTaskHandler.getServerRequestTable();

    const requestTable = requestTableTaskHandler.serverRequestTable;
    const requestTableHandler = Container.get<CServerRequestTable>("服务请求配置库");
    requestTableHandler.mongodb.conneConfig = requesttableConfig;
    await requestTableHandler.connect();
    const resDelete = await requestTableHandler.deleteAll();
    //* 增加服务请求配置库
    await requestTableHandler.add(requestTable);
    //*
    // const requestTableSel = await requestTableHandler.select({ requesttype: "vh-hour-cou" }, null);
    // const requestTableSel = await requestTableHandler.select(
    //     { requesttype: "setPropertyValue" },
    //     null
    // );
    // const requestTableSel = await requestTableHandler.select({ requesttype: "trend" }, null);
    // const requestTableSel = await requestTableHandler.select(
    //     { requesttype: "getPropertyValue" },
    //     null
    // );
    // const requestTableSel = await requestTableHandler.select({ requesttype: "vh-hour-avg" }, null);
    // const requestTableSel = await requestTableHandler.select({ requesttype: "vh-day-avg" }, [
    //     "datamode",
    //     "mode",
    //     "objname",
    //     "propname"
    // ]);
    // await requestTableHandler.update({ _id: { $exists: true } }, [
    //     { $set: { name: { $concat: ["$objname", ".", "$propname"] } } }
    // ]);
    // await requestTableHandler.update(
    //     { requesttype: "vh-day-avg" },
    //     { $push: { values: { $each: [2, 3] } } },
    //     { upsert: true }
    //     // { $push: { values: { $each: [[{ name: "ddd" }], [{ name: "d4dd" }]] } } }
    // );
    // const requestTableSel = await requestTableHandler.select({ requesttype: "vh-day-avg" }, null);

    // ? await requestTableHandler.setName();

    // let dataDayAvgRes = await requestTableHandler.updateVHValue("day-avg");
    // //console.log(dataDayAvgRes);

    // const namestr = await requestTableHandler.selectName({ requesttype: "setPropertyValue" });
    // const namestr = await requestTableHandler.selectName({ requesttype: "trend" });
    // const namestr = await requestTableHandler.selectName({ requesttype: "vh-hour-avg" });
    // const namestr = await requestTableHandler.selectName({ requesttype: "vh-day-avg" });
    // const requestTableSel = await requestTableHandler.distinct("objname", {
    //     _id: { $exists: true }
    // });
    //* 核心代码--更新服务请求配置库
    // await requestTableHandler.setName();
    // const requestTableSel = await requestTableHandler.distinct("objname", { requesttype: "trend" });
    // // console.log("requestTableSel", requestTableSel);
    // await requestTableHandler.updateVHValue("day-avg");
    // await requestTableHandler.updateVHValue("hour-avg");
    // await requestTableHandler.updateVHValue("hour-cou");
    // await requestTableHandler.updateTrendValue();
    // await requestTableHandler.updateGetPropertyValues();
    // let res = await requestTableHandler.updateSetPropertyValues();
    // // // let propValues = await requestTableHandler.getPropValues();
    // let setPropExist = await requestTableHandler.updatePropExist();
    let updateRes = await requestTableHandler.updateRequestTable();
    console.log("请求配置库更新情况：", updateRes);
    let setPropertyRes = await requestTableHandler.setPropValues();

    await requestTableHandler.disconnect();
    // return alarmTable;
    // return requestTableSel;
    // return namestr;
    // return requestTableSel;
    // return setPropExist;
    return setPropertyRes;
    // return propValues;
    // return res;
}

// getRequestTable().then((item) => {
//     console.log("三类型报警批量写值情况", item);
//     console.log(`数据缺失报警写值情况：${item[0].result ? "成功" : "失败"}`);
//     console.log(`均值异常报警写值情况：${item[1].result ? "成功" : "失败"}`);
//     console.log(`排放量异常报警写值情况：${item[2].result ? "成功" : "失败"}`);
//     XLSX_JSON.saveJsonToFile(item, __dirname, "reslog");
// });
