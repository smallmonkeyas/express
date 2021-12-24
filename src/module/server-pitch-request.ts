/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-09-10 00:44:38
 * @LastEditTime : 2021-12-24 15:27:15
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/module/server-pitch-request.ts
 */
import "reflect-metadata"
// import mongoose from 'mongoose';

import { Container, Service, Inject } from "typedi"
import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../dao"
import {
    factoryConfig,
    ruletableConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig,
    vhConfig,
    trendConfig,
    ruletableFileConfig,
    GetPropertyValueNetConfig,
    GetPropertyValuesNetConfig,
    GetPropertyInfosNetConfig,
    SetPropertyValuesNetConfig,
    IRuleStruct,
    IAlarmStruct,
    alarmtableConfig,
    AlarmObjnameConfig,
    AlarmTypeDescConfig,
    AlarmTypeDeprecated
} from "../config"
import { CSingleRuleInfo } from "./rule"
import { CRuleTable } from "./ruletable"
import { CVendorData, IVendorData } from "./vendor"
import { CSupOSData } from "./supos"
import { User } from "./user"
import { request, system, XLSX_JSON, fs, moment } from "../../modulejs"
import { factoryCollectorTempleData } from "../respository/factory/collector"

// interface IVHRequest {
//     getDayAvg(): Promise<any>;
//     getHourAvg(): Promise<any>;
//     getHourCou(): Promise<any>;
// }
// interface ISuposRequest{
//     setPropertyValues(): Promise<any>;
// }

// export const vhConfig = function (netParam: object) {
//     return {
//         netAddress: netAddress,
//         netPath: "serverapi/data/vh/history",
//         netParam: netParam
interface INetParamType {
    name: string
    begintime: string
    endtime: string
    mode?: string
    datamode?: string
}
@Service("大库数据接口")
export class CVHTrendRequest extends CVendorData {
    // netConfig!: IVendorConfig;
    // vendorApi!: CVendorData;
    name!: string
    // dayAvgData!: Array<any>;
    // hourAvgData!: Array<any>;
    // hourCouData!: Array<any>;
    // vhData!: Array<any>;
    netParam!: INetParamType
    // initNetParam() {
    //     let beginTime = moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
    //         endTime = moment().format("YYYY-MM-DD HH:mm:ss");
    //     this.netParam = {
    //         name: this.name,
    //         begintime: beginTime,
    //         endtime: endTime,
    //         mode: "day",
    //         datamode: "avg"
    //     };
    // }
    // async getDayAvg(): Promise<any> {
    //     this.netParam.mode = "day";
    //     this.netParam.datamode = "avg";
    //     // this.netConfig = vhConfig(netParam);
    //     this.vendor = vhConfig(this.netParam);
    //     let dayAvgRes = await this.get();
    //     if (dayAvgRes.info.toLocaleLowerCase() === "success") {
    //         return dayAvgRes.data;
    //         // this.dayAvgData = dayAvgRes.data;
    //     } else {
    //         return false;
    //     }
    // }
    // async getHourAvg(): Promise<any> {
    //     this.netParam.mode = "hour";
    //     this.netParam.datamode = "avg";
    //     this.vendor = vhConfig(this.netParam);
    //     let hourAvgRes = await this.get();
    //     if (hourAvgRes.info.toLocaleLowerCase() === "success") {
    //         this.hourAvgData = hourAvgRes.data;
    //     }
    // }
    // async getHourCou(): Promise<any> {
    //     this.netParam.mode = "hour";
    //     this.netParam.datamode = "avg";
    //     this.vendor = vhConfig(this.netParam);
    //     let hourCouRes = await this.get();
    //     if (hourCouRes.info.toLocaleLowerCase() === "success") {
    //         this.hourCouData = hourCouRes.data;
    //     }
    // }
    async getVhData(requesttype: string): Promise<any> {
        let [mode, datamode] = requesttype.split("-")
        let timediff = datamode === "cou" ? 1 : 24
        let beginTime = moment().subtract(timediff, "hours").format("YYYY-MM-DD HH:mm:ss"),
            endTime = moment().format("YYYY-MM-DD HH:mm:ss")
        this.netParam = {
            name: this.name,
            begintime: beginTime,
            endtime: endTime,
            mode: mode,
            datamode: datamode
        }
        // this.initNetParam();
        // await this.getDayAvg();
        // await this.getHourAvg();
        // await this.getHourCou();
        // this.netParam.mode = "hour";
        // this.netParam.datamode = "avg";
        this.vendor = vhConfig(this.netParam)
        let vhDataRes = await this.get()
        if (vhDataRes.info.toLocaleLowerCase() === "success") {
            return vhDataRes.data
        } else {
            return false
        }
    }
    async getTrendData(): Promise<any> {
        let beginTime = moment().subtract(10, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            endTime = moment().format("YYYY-MM-DD HH:mm:ss")
        this.netParam = {
            name: this.name,
            begintime: beginTime,
            endtime: endTime
        }
        // this.initNetParam();
        // await this.getDayAvg();
        // await this.getHourAvg();
        // await this.getHourCou();
        // this.netParam.mode = "hour";
        // this.netParam.datamode = "avg";
        this.vendor = trendConfig(this.netParam)
        let trendDataRes = await this.get()
        if (trendDataRes.info.toLocaleLowerCase() === "success") {
            return trendDataRes.data
        } else {
            return false
        }
    }
}

// class CTrendRequest extends CVendorData {
//     async getTrendData(): Promise<any> {}
// }
@Service("supOS对象属性接口")
export class CPropertyRequest extends CSupOSData {
    objname!: string
    propname!: string
    propValues!: object
    // propertyNetParam!: { type: string; page: number; per_page: number };
    async getPropertyValues(): Promise<any> {
        this.supos = GetPropertyValuesNetConfig(this.objname, this.propname)
        let res = await this.post()

        // alarmConfigParam.forEach(async (propName, index) => {
        //     this.plantInterface.supos = GetPropertyValueNetConfig(objnameInclude, propName);
        //     let res: { result: number; [prop: string]: any } = await this.plantInterface.get();

        //     configParamValue.push(res.result);
        // });

        // let isNumber = /(\d+,\d+)|(^\d.*\d$)/g.test(configParamValue.toString());
        // if (!isNumber) {
        //     return alarmConfigParamValue;
        // }
        return res
    }
    async setPropertyValues(): Promise<any> {
        let objname = this.objname
        let propValues = JSON.parse(JSON.stringify(this.propValues))
        this.supos = SetPropertyValuesNetConfig(objname, propValues)
        let res = await this.post()
        return res
    }
    async getPropertyInfos(objname: string, page: number, per_page: number): Promise<any> {
        //*

        let netParam = { page: page, per_page: per_page, type: "own" }
        this.supos = GetPropertyInfosNetConfig(objname, netParam)
        return await this.get()
    }
    async getPropertyInfoList(): Promise<any> {
        let propList = []
        let objname = this.objname
        let page = 1
        let per_page = 3000

        let onePageProperitiesObj = await this.getPropertyInfos(objname, page, per_page)
        if (!onePageProperitiesObj.list) {
            throw new Error(`查询${objname}属性失败，错误信息：${onePageProperitiesObj}`)
        }
        // //console.log("onePageProperitiesObj", onePageProperitiesObj);
        propList.push(...onePageProperitiesObj.list)
        const pageSum = Math.ceil(onePageProperitiesObj.pagination.total / per_page)
        // ?方式1:Promise.all
        // let together = new Array(pageSum + 1).fill(null);
        // const promise = together.map((item, index) => {
        //     return this.getPropertyInfos(objName, index + 1, perPage);
        // });
        // const promiseall = await Promise.all(promise);
        // ?方式2：await
        for (let index = 2; index < pageSum + 1; index++) {
            page = index
            // this.supos = GetPropertyInfosNetConfig(objname, netParam);
            onePageProperitiesObj = await this.getPropertyInfos(objname, page, per_page)
            propList.push(...onePageProperitiesObj.list)
        }
        return propList
    }
    async getPropertyList(): Promise<any> {
        let propList = []
        let objname = this.objname
        let page = 1
        let per_page = 3000

        let onePageProperitiesObj = await this.getPropertyInfos(objname, page, per_page)
        if (!onePageProperitiesObj.list) {
            throw new Error(`查询${objname}属性失败，错误信息：${onePageProperitiesObj}`)
        }
        // //console.log("onePageProperitiesObj", onePageProperitiesObj);
        propList.push(...onePageProperitiesObj.list)
        const pageSum = Math.ceil(onePageProperitiesObj.pagination.total / per_page)
        // ?方式1:Promise.all
        // let together = new Array(pageSum + 1).fill(null);
        // const promise = together.map((item, index) => {
        //     return this.getPropertyInfos(objName, index + 1, perPage);
        // });
        // const promiseall = await Promise.all(promise);
        // ?方式2：await
        for (let index = 2; index < pageSum + 1; index++) {
            page = index
            // this.supos = GetPropertyInfosNetConfig(objname, netParam);
            onePageProperitiesObj = await this.getPropertyInfos(objname, page, per_page)
            propList.push(...onePageProperitiesObj.list)
        }
        let propListStr = JSON.stringify(propList)
        // let propNameArr = propListStr.match(
        //     /(?<="name("|\"): *)((?!Double|Integer|String|Float|Long|Boolean|DataStruct).)+?(?=("|\"),)/g
        // );
        let propNameArr = propListStr.match(
            /(?<="name("|\\"|'): *("|\\"))((?!Double|Integer|String|Float|Long|Boolean|DataStruct).)+?(?=("|\\"|'),)/g
            // /(?<="name("|\"): *)((?!Double|Integer|String|Float|Long|Boolean|DataStruct).)+?(?=("|\"),)/g
        )
        // console.log("propNameArr", propNameArr, propListStr);
        return propNameArr
    }
}

// class CAlarmParamRequest extends CSupOSData {

// }

// async function setPropertyValues(){

// }
