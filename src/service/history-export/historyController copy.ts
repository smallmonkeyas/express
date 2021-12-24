/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-20 01:49:15
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2021-12-21 23:48:20
 * @Description  : Do not edit
 * @FilePath     : /express/src/service/history-export/historyController.ts
 * @github-name  : scxmonkeyas
 */
/* eslint-disable space-unary-ops */

// TODO: 引入模块及配置
import * as _ from "lodash"
import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
// import mongoose from 'mongoose';

import { fs, file, path, system, XLSX_JSON, moment, readlineSync } from "../../../modulejs"
import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../../dao"
import {
    factoryConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFactoryStruct,
    IVendorConfig,
    factortableConfig,
    suposHistorytableConfig,
    IHistorySuposStruct,
    IFactorStruct,
    cfgFactorConfig,
    batchQueryConfig
} from "../../config"
import {
    CVendorData,
    IVendorData,
    CSupOSData,
    User,
    CSuposHistoryTable,
    CFactorTable,
    CFactorySiteTable
} from "../../module"

Container.import([CSupOSData, User, CMongoDB, CTable])
let basicPath = path.resolve(process.cwd(), "./")
// let basicPath = path.resolve(__dirname, "./")
console.log("basicPath", basicPath)

// ? 监测因子数据库测试

const factorTableTest = async function () {
    let user = Container.get<User>("用户")
    await user.login()
    let factorTableHandler = Container.get<CFactorTable>("监测因子数据库")
    let factorTable = await factorTableHandler.getFactor({ epcode: "320200000006" })

    // console.log("历史:", hisTable)
    factorTableHandler.conneConfig = factortableConfig
    // factorTableHandler.mongodb.conneConfig = factortableConfig
    await factorTableHandler.connect()

    if (factorTable) {
        await factorTableHandler.deleteAll()
        await factorTableHandler.add(factorTable)
    }
    let nameArr = await factorTableHandler.distinct("name", { id: { $gt: 0 } })
    const factortable = await factorTableHandler.select(null, null)
    await factorTableHandler.disconnect()
    // alarmTableHandler.ruletable = ruletable
    // await alarmTableHandler.getAlarmTable()
    // let alarmTable = alarmTableHandler.table
    // // console.log("alarmTable", alarmTable)
    // return await alarmTableFun(alarmTable)
    // console.log('alarmTableFun', alarmTableHandler.table);
    return { factors: nameArr, factorHandler: factorTableHandler }
}

// factorTableTest().then((item) => {
//     console.log(item)
// })

// ? 历史数据库测试

const hisTableTest = async function (factorname: Array<string>) {
    // let user = Container.get<User>("用户")
    // await user.login()
    // let names = factorname
    let historyTableHandler = Container.get<CSuposHistoryTable>("supOS历史数据库")
    // let hisTable = await historyTableHandler.getCompliantHistoryData(
    //     names,
    //     "2021-11-07T10:30:00Z",
    //     "2021-12-19T11:00:00Z",
    //     "days",
    //     7
    // )
    // console.log("历史:", hisTable)
    historyTableHandler.conneConfig = suposHistorytableConfig
    // historyTableHandler.mongodb.conneConfig = suposHistorytableConfig
    await historyTableHandler.connect()
    // await historyTableHandler.deleteAll()
    // await historyTableHandler.add(hisTable)
    const historytable = await historyTableHandler.select(null, null)
    // await historyTableHandler.disconnect()
    // alarmTableHandler.ruletable = ruletable
    // await alarmTableHandler.getAlarmTable()
    // let alarmTable = alarmTableHandler.table
    // // console.log("alarmTable", alarmTable)
    // return await alarmTableFun(alarmTable)
    // console.log('alarmTableFun', alarmTableHandler.table);
    return { hisData: historytable, hisHandler: historyTableHandler }
}

// hisTableTest().then((item) => {
//     console.log(item)
// })

const patchHis = async function (
    hisHandler: CSuposHistoryTable,
    factorToInfo: { [prop: string]: IFactorStruct },
    factor: string
) {
    let item = factor
    let factorInfo = factorToInfo[item]
    await hisHandler.update({ name: item }, factorInfo)
    let timeAgg = [
        { $match: { name: item } },
        {
            $group: {
                _id: "$time",
                time: { $first: "$time" },
                // timeConvert: {
                //     $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" }
                // },
                name: { $first: "$name" },
                numberValue: { $first: "$numberValue" },
                value: { $first: "$numberValue" },
                description: { $first: "$description" },
                epcode: { $first: "$epcode" },
                hj212mn: { $first: "$hj212mn" },
                objname: { $first: "$objname" },
                displayname: { $first: "$displayname" },
                siteType: { $first: "$siteType" },
                keyparam: { $first: "$keyparam" },
                period: { $first: "$period" },
                unit: { $first: "$unit" },
                status: { $first: "$status" }
                // zerosNumber:{$sum:}
                // propNumInOneAlarmObj: { $sum: 1 },
                // alarmObjname: { $first: "$alarmObjname" },
                // alarmObjDisplayName: { $first: "$alarmObjDisplayName" },
                // alarmObjDescription: { $first: "$alarmObjDescription" }
            }
        },
        {
            $project: {
                _id: 0,
                // __v: 0,
                // _id: "$alarmObjname",
                time: { $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" } },
                // timeConvert: {
                //     $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" }
                // },
                name: 1,
                // numberValue: 1,
                value: "$numberValue",
                description: "$description",
                epcode: 1,
                hj212mn: 1,
                objname: 1,
                factorySite: "$displayname",
                siteType: "$type",
                keyparam: 1,
                sitePeriod: "$period",
                unit: 1,
                status: 1
            }
        },
        { $sort: { time: 1 } } // 排序
    ]
    let factorHis = await hisHandler.aggregate(timeAgg)
    // let factorHis = await hisHandler.select({ name: item }, null)
    // resLen.push(factorHis.length)
    console.log("factorHis", factorHis[0])
    let pathFileDir = path.resolve(__dirname, "./淮安国信")
    // XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${item}`)
    // ? hisHandler.exportHistoryDataByTemplete(factorHis, factorInfo)
    XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${factorInfo.description}`)
    // XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${factorInfo.description}`)
    if (Array.isArray(factorHis)) {
        return factorHis.length
    } else {
        return `${item}未查询到历史数据`
    }
}
//* ********************************************************************************** */
// * 历史数据main*/
let promise
const main = async function () {
    let user = Container.get<User>("用户")
    await user.login()
    //* 企业采集站点库
    let factorySiteHandler = Container.get<CFactorySiteTable>("企业站点库")
    factorySiteHandler.conneConfig = factoryConfig
    factorySiteHandler.connect()
    let collectors = await factorySiteHandler.getCollector()
    let collectorKeyInfo: { [prop: string]: any } = {}
    let objnameArr: Array<string> = []
    if (Array.isArray(collectors)) {
        collectors.forEach((collector: IFactoryStruct) => {
            let { objname, displayname, period, type, ...arg } = collector
            collectorKeyInfo[objname] = { displayname, period, type }
            objnameArr.push(objname)
        })
    }
    await factorySiteHandler.deleteAll()
    await factorySiteHandler.add(collectors)
    await factorySiteHandler.disconnect()
    //* 企业监测因子库
    // let { factors, factorHandler } = await factorTableTest()
    // let { hisData, hisHandler } = await hisTableTest(factors)

    let factorHandler = Container.get<CFactorTable>("监测因子数据库")
    factorHandler.conneConfig = factortableConfig
    // factorHandler.mongodb.conneConfig = factortableConfig
    await factorHandler.connect()
    let factorTable = await factorHandler.getFactor()
    if (Array.isArray(factorTable)) {
        await factorHandler.deleteAll()
        await factorHandler.add(factorTable)
    }
    // 更新监测因子库
    if (objnameArr.length) {
        objnameArr.forEach(async (objname) => {
            await factorHandler.update({ objname: objname }, collectorKeyInfo[objname])
        })
    }

    let factors = await factorHandler.distinct("name", { epcode: 3208030200001903 })
    // let factors = await factorHandler.distinct("name", { epcode: 3211910200001925 })
    // let factors = await factorHandler.distinct("name", { epcode: 320200000006 })
    let factorsInfo = await factorHandler.select({ epcode: 3208030200001903 }, null)
    console.log("factorsInfo", factors.length)
    let factorToInfo: { [prop: string]: IFactorStruct } = {}
    factorsInfo.forEach((fact: IFactorStruct) => {
        factorToInfo[fact.name] = fact
    })
    await factorHandler.disconnect()

    // //* 因子分批
    // let factorSlice = []
    // for (var i = 0; i < factors.length; i += 68) {
    //     factorSlice.push(factors.slice(i, i + 68))
    // }
    // console.log("factorSlice", factorSlice)

    let hisHandler = Container.get<CSuposHistoryTable>("supOS历史数据库")
    hisHandler.conneConfig = suposHistorytableConfig
    await hisHandler.connect()
    let factorExistInHisTable = await hisHandler.distinct("name", {
        epcode: 3208030200001903
    })
    let factorMiss = factors.reduce((arr: any, item: string) => {
        // console.log(factorExistInHisTable.includes(item))
        !factorExistInHisTable.includes(item) && arr.push(item)
        return arr
    }, [])
    console.log("factorMiss", factorExistInHisTable.length, factorMiss.length)
    // await hisHandler.deleteAll()
    await hisHandler.addHisdata(
        factorMiss,
        "2021-11-07T10:30:00Z",
        "2021-12-19T11:00:00Z",
        "days",
        1,
        68
    )
    // factorMiss = factors
    // let promise = factorSlice.map((factors) => {
    const together = new Array(factorMiss.length).fill(null)
    let promise_factor = together.map((item, index) => {
        return patchHis(hisHandler, factorToInfo, factorMiss[index])
    })
    const promiseall = await Promise.all(promise_factor)

    // const res = await patchHis(hisHandler, factorToInfo, factorMiss[1])
    // //* 往历史数据库中增加历史数据

    // hisHandler.conneConfig = suposHistorytableConfig
    // await hisHandler.connect()
    // await hisHandler.deleteAll()
    // let hisTable: Array<any> = []
    // for (let i = 0; i < factorSlice.length; i++) {
    //     let factorSelHisTable = await hisHandler.getCompliantHistoryData(
    //         factorSlice[i],
    //         "2021-11-07T10:30:00Z",
    //         "2021-12-19T11:00:00Z",
    //         "days",
    //         1
    //     )

    //     hisTable = [...hisTable, ...factorSelHisTable]
    //     console.log(hisTable[0])
    // }
    // await hisHandler.add(hisTable)
    // hisHandler.schema.path("time").set(function (val: any) {
    // return moment(val).format("YYYY-MM-DD HH:mm:ss")
    // })
    // hisHandler.schema.path("time").get(function (val: any) {
    //     return moment(val).format("YYYY-MM-DD HH:mm:ss")
    // })
    // hisHandler.schema.set("toObject", {
    //     transform: function (doc: any, ret: any, options: any) {
    //         console.log("transform", ret)
    //         if (ret.time) {
    //             console.log("toJSON", ret.time)
    //             ret.time = moment(ret.time).format("YYYY-MM-DD HH:mm")
    //         }

    //         return ret
    //     }
    // })
    // hisHandler.schema.set("toJSON", { getters: true })
    // !批量添加历史数据
    // console.log("factors", factors)

    // ?同步请求分批因子
    // let promise = factorSlice.map((factors) => {
    //     const together = new Array(factors.length).fill(null)
    //     let promise_splice = together.map((item, index) => {
    //         return patchHis(hisHandler, factorToInfo, factors[index])
    //     })
    //     return Promise.all(promise_splice)
    // })
    // const promiseall = await Promise.all(promise)
    // let promiseall = []
    // for (let ii = 0; ii < factorSlice.length; ii++) {
    //     let factorsSel = factorSlice[ii]
    //     const together = new Array(factorsSel.length).fill(null)
    //     let promise_splice = together.map((item, index) => {
    //         return patchHis(hisHandler, factorToInfo, factorsSel[index])
    //     })
    //     let promiseCol = await Promise.all(promise_splice)
    //     promiseall.push(...promiseCol)
    // }

    // ! 原始请求
    // for (let i = 0; i < factors.length; i++) {
    //     let item = factors[i]
    //     // let factorInfo = await factorHandler.select({ name: item }, null)
    //     // console.log("factorInfo", factorInfo)
    //     let factorInfo = factorToInfo[item]
    //     await hisHandler.update({ name: item }, factorInfo)
    //     let timeAgg = [
    //         { $match: { name: item } },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 // __v: 0,
    //                 // _id: "$alarmObjname",
    //                 time: { $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" } },
    //                 // timeConvert: {
    //                 //     $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" }
    //                 // },
    //                 name: 1,
    //                 numberValue: 1,
    //                 description: "$description",
    //                 epcode: 1,
    //                 hj212mn: 1,
    //                 objname: 1,
    //                 factorySite: 1,
    //                 siteType: 1,
    //                 sitePeriod: 1,
    //                 unit: 1,
    //                 value: 1,
    //                 status: 1
    //             }
    //         }
    //     ]
    //     let factorHis = await hisHandler.aggregate(timeAgg)
    //     console.log("factorHis", factorHis[0])
    //     let pathFileDir = path.resolve(__dirname, "./光大镇江")
    //     XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${factorInfo.description}`)
    // }

    await hisHandler.disconnect()
    // return factorsInfo
    return promiseall
}

main().then((item) => {
    console.log("success", item)
})
