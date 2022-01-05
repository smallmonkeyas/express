/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-20 01:49:15
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2021-12-31 14:26:08
 * @Description  : Do not edit
 * @FilePath     : /express/src/service/history-export/bakup/historyController copy 2.ts
 * @github-name  : scxmonkeyas
 */
/* eslint-disable space-unary-ops */

// TODO: 引入模块及配置
import mongoose from "mongoose"
import * as _ from "lodash"
import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
// import mongoose from 'mongoose';

import { fs, file, path, system, XLSX_JSON, moment, readlineSync } from "../../../../modulejs"
import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../../../dao"
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
} from "../../../config"
import {
    CVendorData,
    IVendorData,
    CSupOSData,
    User,
    CSuposHistoryTable,
    CFactorTable,
    CFactorySiteTable
} from "../../../module"

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
    hisHandler0: CSuposHistoryTable,
    factorToInfo: { [prop: string]: IFactorStruct },
    factor: string
) {
    var hisHandler = _.cloneDeep(hisHandler0)
    // let hisHandler = JSON.parse(JSON.stringify(hisHandler0))
    console.log(`正在从数据库中读取的监测因子${factor}的历史数据`)
    let item = factor
    let factorInfo = factorToInfo[item]
    // await hisHandler.update({ name: item }, factorInfo)
    // let timeAgg = [
    //     { $match: { name: item } },
    //     {
    //         $group: {
    //             _id: "$time",
    //             time: { $first: "$time" },
    //             // timeConvert: {
    //             //     $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" }
    //             // },
    //             name: { $first: "$name" },
    //             numberValue: { $first: "$numberValue" },
    //             value: { $first: "$numberValue" },
    //             description: { $first: "$description" },
    //             epcode: { $first: "$epcode" },
    //             hj212mn: { $first: "$hj212mn" },
    //             objname: { $first: "$objname" },
    //             displayname: { $first: "$displayname" },
    //             siteType: { $first: "$siteType" },
    //             keyparam: { $first: "$keyparam" },
    //             period: { $first: "$period" },
    //             unit: { $first: "$unit" },
    //             status: { $first: "$status" }
    //             // zerosNumber:{$sum:}
    //             // propNumInOneAlarmObj: { $sum: 1 },
    //             // alarmObjname: { $first: "$alarmObjname" },
    //             // alarmObjDisplayName: { $first: "$alarmObjDisplayName" },
    //             // alarmObjDescription: { $first: "$alarmObjDescription" }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             // __v: 0,
    //             // _id: "$alarmObjname",
    //             time: { $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" } },
    //             // timeConvert: {
    //             //     $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" }
    //             // },
    //             name: 1,
    //             // numberValue: 1,
    //             value: "$numberValue",
    //             description: "$description",
    //             epcode: 1,
    //             hj212mn: 1,
    //             objname: 1,
    //             factorySite: "$displayname",
    //             siteType: "$type",
    //             keyparam: 1,
    //             sitePeriod: "$period",
    //             unit: 1,
    //             status: 1
    //         }
    //     },
    //     { $sort: { time: 1 } } // 排序
    // ]
    // await hisHandler.update({ name: item }, factorInfo)
    let timeAgg = [
        { $match: { name: item } },
        {
            $group: {
                _id: "$time",
                time: { $first: "$time" },
                // timeConvert: {
                //     $dateToString: { format: "%Y-%m-%d %H:%M:%S.%L", date: "$time" }
                // },
                // name: { $first: "$name" },
                numberValue: { $first: "$numberValue" },
                value: { $first: "$numberValue" },
                // description: { $first: "$description" },
                // epcode: { $first: "$epcode" },
                // hj212mn: { $first: "$hj212mn" },
                // objname: { $first: "$objname" },
                // displayname: { $first: "$displayname" },
                // siteType: { $first: "$siteType" },
                // keyparam: { $first: "$keyparam" },
                // period: { $first: "$period" },
                // unit: { $first: "$unit" },
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
                // name: 1,
                // numberValue: 1,
                value: "$numberValue",
                // description: "$description",
                // epcode: 1,
                // hj212mn: 1,
                // objname: 1,
                // factorySite: "$displayname",
                // siteType: "$type",
                // keyparam: 1,
                // sitePeriod: "$period",
                // unit: 1,
                status: 1
            }
        },
        { $sort: { time: 1 } } // 排序
    ]
    let factorHis = await hisHandler.aggregate(timeAgg)
    // let factorHis = await hisHandler.select({ name: item }, null)
    // resLen.push(factorHis.length)
    if (Array.isArray(factorHis)) {
        console.log(
            `获取到${factor}数据成功，长度为：${factorHis.length},正在转换格式并写入excel文件`
        )
    } else {
        console.log(`未获取到${factor}数据`)
    }

    let pathFileDir = path.resolve(__dirname, "./淮安国信")
    // XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${item}`)
    await hisHandler.exportHistoryDataByTemplete(factorHis, factorInfo)
    // ? XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${factorInfo.description}`)
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
            let { objname, displayname, period, type, epcode, ...arg } = collector
            if (epcode == "3210230203000304" && type == "GK") {
                objname = "GK_YZ_GD_HBNY" // 光大环保能源（宝应）有限公司
            }
            collectorKeyInfo[objname] = { displayname, period, type }
            objnameArr.push(objname)
        })
    }
    await factorySiteHandler.deleteAll()
    await factorySiteHandler.add(collectors)
    await factorySiteHandler.update(
        { epcode: "3210230203000304", type: "GK" },
        { name: "GK_YZ_GD_HBNY", objname: "GK_YZ_GD_HBNY" }
    )
    await factorySiteHandler.disconnect()
    //* 企业监测因子库
    // let { factors, factorHandler } = await factorTableTest()
    // let { hisData, hisHandler } = await hisTableTest(factors)

    let factorHandler = Container.get<CFactorTable>("监测因子数据库")
    factorHandler.conneConfig = factortableConfig
    // factorHandler.mongodb.conneConfig = factortableConfig
    await factorHandler.connect()
    let factorTable = await factorHandler.getFactor()
    let factorRex = JSON.stringify(factorTable).replace(/GK_JY_GD_WHCL./g, "GK_YZ_GD_HBNY.")
    factorTable = JSON.parse(factorRex)
    if (Array.isArray(factorTable)) {
        await factorHandler.deleteAll()
        await factorHandler.add(factorTable)
    }

    //* 更新监测因子库
    // ? 更新光大宝应
    await factorHandler.update(
        { epcode: "3210230203000304", objname: "GK_JY_GD_WHCL" },
        { objname: "GK_YZ_GD_HBNY" }
    )
    if (objnameArr.length) {
        objnameArr.forEach(async (objname) => {
            await factorHandler.update({ objname: objname }, collectorKeyInfo[objname])
        })
    }

    let factors = await factorHandler.distinct("name", { epcode: "3210230203000304" })
    // let factors = await factorHandler.distinct("name", { epcode: 3208030200001903 })
    // let factors = await factorHandler.distinct("name", { epcode: 3211910200001925 })
    // let factors = await factorHandler.distinct("name", { epcode: 320200000006 })
    let factorsInfo = await factorHandler.select({ epcode: "3210230203000304" }, null)
    console.log("factorsInfo", factors.length)
    let factorToInfo: { [prop: string]: IFactorStruct } = {}
    factorsInfo.forEach((fact: IFactorStruct) => {
        factorToInfo[fact.name] = fact
    })
    await factorHandler.disconnect()

    let hisHandler = Container.get<CSuposHistoryTable>("supOS历史数据库")
    suposHistorytableConfig.datasename = "光大环保能源（宝应）有限公司"
    hisHandler.conneConfig = suposHistorytableConfig
    await hisHandler.connect()
    // hisHandler.instantiateDatabase.connection.on("open", function (ref) {
    //     console.log("Connected to mongo server.")
    //     // trying to get collection names
    //     hisHandler.instantiateDatabase.connection.db
    //         .listCollections()
    //         .toArray(function (err, names) {
    //             console.log(names) // [{ name: 'dbname.myCollection' }]
    //             module.exports.Collection = names
    //         })
    // })
    // let hisCollectionsName: Array<string> = []
    // hisHandler.instantiateDatabase.connection.db.listCollections().toArray(function (err, names) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         names.forEach(function (e, i, a) {
    //             // mongoose.connection.db.dropCollection(e.name)
    //             console.log("--->>", e.name)
    //             hisCollectionsName.push(e.name)
    //         })
    //     }
    // })
    // const model = hisHandler.instantiateDatabase.model
    // const connection = hisHandler.instantiateDatabase.connection
    // const connections = hisHandler.instantiateDatabase.connections
    // console.log("--->>", model, "\n", "--->>", connection, "\n", "--->>", connections)
    // Object.keys(hisHandler.instantiateDatabase.models).forEach((collection) => {
    //     // You can get the string name.
    //     console.log("collection", collection)
    //     // Or you can do something else with the model.
    //     // connection.models[collection].remove({})
    // })

    // let factorExistInHisTable = await hisHandler.distinct("name", {
    //     epcode: 3208030200001903
    // })
    let hisCollectionsName: Array<string> = await hisHandler.getCollectionsName()
    hisCollectionsName = []
    // console.log("factorExistInHisTable", hisCollectionsName)
    let factorExistInHisTable: Array<string> = hisCollectionsName
    let factorMiss = factors.reduce((arr: any, item: string) => {
        // console.log(factorExistInHisTable.includes(item))
        !factorExistInHisTable.includes(item) && arr.push(item)
        return arr
    }, [])
    console.log(
        "库中监测因子数量：",
        factorExistInHisTable.length,
        "缺失监测因子数量：",
        factorMiss.length
    )

    // console.log("factorSlice", factorSlice.length)
    //* 时间分批
    let startTimeOrigin = "2021-11-07T10:30:00Z"
    let endTimeOrigin = "2021-12-19T11:00:00Z"
    let splitType = "days"
    let timeInterval = 3
    let timeRangeSplit = hisHandler.splitTime(
        startTimeOrigin,
        endTimeOrigin,
        splitType,
        timeInterval
    )
    console.log("timeRangeSplit", timeRangeSplit)
    //* 数据库初始化清零处理
    await hisHandler.deleteCollectionsContent(hisCollectionsName)
    if (!!hisCollectionsName) {
        console.log("删除数据库")
        hisHandler.deleteCollections(hisCollectionsName)
        hisHandler.deleteDatabase()
    }
    // *按照时间分批请求
    let timeSplitNum = timeRangeSplit.length - 1
    for (let ii = 1; ii < timeSplitNum; ii++) {
        let startTime = timeRangeSplit[ii]
        let endTime = timeRangeSplit[ii + 1]
        // *请求数据并存入数据库
        let requestTimeInterval = 1
        let requestFactorInterval = 60
        const addRes = await hisHandler.addHisdata(
            factorMiss,
            startTime,
            endTime,
            splitType,
            requestTimeInterval,
            requestFactorInterval
        )
        await system.delayms(6000)
        // await user.login()
    }

    // //* 因子分批--避免写数据文件奔溃
    let factorSlice = []
    for (var i = 0; i < factorMiss.length; i += 2) {
        factorSlice.push(factorMiss.slice(i, i + 2))
    }
    // * 从历史数据库中读取数据并写入文件中
    let promisesall: Array<any> = []
    for (let factorSel of factorSlice) {
        const together = new Array(factorSel.length).fill(null)
        let promise_factor = together.map((item, index) => {
            hisHandler.convertCollectionTo(factorSel[index])
            return patchHis(hisHandler, factorToInfo, factorSel[index])
        })
        let promiseall = await Promise.all(promise_factor)
        promisesall.push(...promiseall)
    }
    // factorSlice.forEach(async (factorSel) => {
    //     const together = new Array(factorSel.length).fill(null)
    //     let promise_factor = together.map((item, index) => {
    //         hisHandler.convertCollectionTo(factorSel[index])
    //         return patchHis(hisHandler, factorToInfo, factorSel[index])
    //     })
    //     let promiseall = await Promise.all(promise_factor)
    //     promisesall.push(...promiseall)
    // })

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
    // return [promiseall, addRes]
    return [promisesall, []]
}

main().then((item) => {
    console.log("success", item[0], item[1])
})
