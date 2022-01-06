/* eslint-disable no-use-before-define */
/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-20 01:49:15
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2022-01-06 12:20:18
 * @Description  : Do not edit
 * @FilePath     : /express/src/service/history-export/historyController.ts
 * @github-name  : scxmonkeyas
 */
/* eslint-disable space-unary-ops */

// TODO: 引入模块及配置
import mongoose from "mongoose"
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
// let basicPath = path.resolve(process.cwd(), "./")
let basicPath = path.resolve(__dirname, "./")
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
let fileIndex = 1
const patchHis = async function (
    hisHandler0: CSuposHistoryTable,
    factorToInfo: { [prop: string]: IFactorStruct },
    factor: string
) {
    var hisHandler = _.cloneDeep(hisHandler0)
    // let hisHandler = JSON.parse(JSON.stringify(hisHandler0))
    console.log(
        `正在从${currFactory}数据库中读取监测因子${factor}的历史数据,当前企业索引:${
            epcodeFinished.length + 1
        }`
    )
    let item = factor
    let factorInfo: { [prop: string]: any } = factorToInfo[item]
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
    await hisHandler.update({ name: item }, factorInfo)
    let timeAgg = [
        {
            $match: {
                name: item,
                time: { $gte: new Date(startTimeOrigin), $lte: new Date(endTimeOrigin) }
            }
        },
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
    // let zerosValueSelct = await factorHis.select({ numberValue: 0 }, ["numberValue"])
    let zerosValueSelct = _.filter(factorHis, { value: 0 })
    // let normalStatusSelct = await hisHandler.select({ status: "0" }, ["status"])
    let normalStatusSelct = _.filter(factorHis, { status: "0" })
    // let uniqueValueDist = await hisHandler.distinct("numberValue")
    let uniqueValueDist = _.uniqBy(factorHis, "value")

    factorInfo.timeRange = `${moment(startTimeOrigin).format("YYYY-MM-DD HH:mm:ss")}~~${moment(
        endTimeOrigin
    ).format("YYYY-MM-DD HH:mm:ss")}`
    factorInfo.zerosNumber = zerosValueSelct.length
    factorInfo.totalNumber = factorHis.length
    factorInfo.errorStatusNumber = factorHis.length - normalStatusSelct.length
    factorInfo.uniqueNumber = uniqueValueDist.length
    // let factorHis = await hisHandler.select({ name: item }, null)
    // resLen.push(factorHis.length)

    if (Array.isArray(factorHis)) {
        console.log(
            `第${fileIndex++}/${
                Object.keys(factorToInfo).length
            }个因子${factor}历史数据获取成功，长度为：${
                factorHis.length
            },正在转换格式并写入excel文件`
        )
    } else {
        console.log(`未获取到${factor}数据`)
    }

    // let pathFileDir = path.resolve(__dirname, "./淮安国信")

    factorInfo.description = factorInfo.description.replace(/[\？\?\*\\\/:|<>\"]{1,}/g, "_")
    // XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${item}`)
    let factoryIndexStr = "000" + epcodeFinished.length + 1
    factorInfo.factoryIndexStr = factoryIndexStr.slice(factoryIndexStr.length - 3)
    await hisHandler.exportHistoryDataByTemplete(factorHis, factorInfo)
    // ? XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${description}`)
    // XLSX_JSON.jsonToExcel(factorHis, pathFileDir, `${factorInfo.description}`)
    if (Array.isArray(factorHis)) {
        return factorHis.length
    } else {
        return `${item}未查询到历史数据`
    }
}

const getFactoryHistory = async function (epcode: string): Promise<any> {
    /** *********************************************************************** */
    /** *********************************************************************** */
    let factorySiteHandler = Container.get<CFactorySiteTable>("企业站点库")
    factorySiteHandler.conneConfig = factoryConfig
    await factorySiteHandler.connect()
    let factoryInfo = await factorySiteHandler.select({ epcode: epcode, type: "GK" }, null)
    let factoryName: string
    if (factoryInfo.length) {
        factoryName = factoryInfo[0].displayname
    } else {
        factoryInfo = await factorySiteHandler.select({ epcode: epcode, type: "MD" }, null)
        let factoryNameArr: Array<string> = factoryInfo[0].displayname.match(
            /.{2,}(处理厂|公司|南厂|水务)(\)|）)*/g
        )
        if (Array.isArray(factoryNameArr)) {
            factoryName = factoryNameArr[0]
        } else {
            factoryName = `未知企业名-${epcode}`
        }
    }

    const databaseName = factoryName.slice(0, 20) // 数据库名字与工况企业名称一致，即一个库存一个企业的历史数据
    factorySiteHandler.disconnect()
    /** *********************************************************************** */
    /** *********************************************************************** */
    let factorHandler = Container.get<CFactorTable>("监测因子数据库")
    factorHandler.conneConfig = factortableConfig
    // factorHandler.mongodb.conneConfig = factortableConfig
    await factorHandler.connect()
    let factors = await factorHandler.distinct("name", { epcode: epcode })
    // let factors = await factorHandler.distinct("name", { epcode: "320300000089" })
    // let factors = await factorHandler.distinct("name", { epcode: "321000000035" })
    // let factors = await factorHandler.distinct("name", { epcode: "3210230203000304" })
    // let factors = await factorHandler.distinct("name", { epcode: 3208030200001903 })
    // let factors = await factorHandler.distinct("name", { epcode: 3211910200001925 })
    // let factors = await factorHandler.distinct("name", { epcode: 320200000006 })
    let factorsInfo = await factorHandler.select({ epcode: epcode }, null)
    console.log("factorsInfo", factors.length)
    let factorToInfo: { [prop: string]: IFactorStruct } = {}
    factorsInfo.forEach((fact: IFactorStruct) => {
        factorToInfo[fact.name] = fact // ? 后期如果因子接口（serverapi/cfg/factor）有更新，需要特别留意
    })
    await factorHandler.disconnect()

    let hisHandler = Container.get<CSuposHistoryTable>("supOS历史数据库")
    suposHistorytableConfig.datasename = databaseName
    // suposHistorytableConfig.datasename = "铜山华润电力有限公司"
    // suposHistorytableConfig.datasename = "扬州港口污泥"
    // suposHistorytableConfig.datasename = "光大环保能源（宝应）有限公司"
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
        factorMiss.length,
        factorMiss
    )
    // !若判断配置文件中做只导出历史数据而不做supOS历史数据请求的设置，则此时退出当前函数
    if (!isLinked) {
        await hisHandler.disconnect()
        await system.delayms(6000)
        return { databaseName, factors: factorMiss, factorToInfo }
    }

    // console.log("factorSlice", factorSlice.length)
    //* 时间分批

    // let startTimeOrigin = "2021-11-07T10:30:00Z"
    // let endTimeOrigin = "2021-12-19T11:00:00Z"
    let splitType = "days"
    let timeInterval = 300
    let timeRangeSplit = hisHandler.splitTime(
        startTimeOrigin,
        endTimeOrigin,
        splitType,
        timeInterval
    )
    console.log("timeRangeSplit", timeRangeSplit)
    // //* 数据库初始化清零处理
    // await hisHandler.deleteCollectionsContent(hisCollectionsName)
    // if (!!hisCollectionsName) {
    //     console.log(`删除数据库:${databaseName}`)
    //     hisHandler.deleteCollections(hisCollectionsName)
    //     hisHandler.deleteDatabase()
    // }
    // *按照时间分批请求
    let timeSplitNum = timeRangeSplit.length - 1
    for (let ii = 0; ii < timeSplitNum; ii++) {
        let startTime = timeRangeSplit[ii]
        let endTime = timeRangeSplit[ii + 1]
        // *请求supOS历史接口数据并存入数据库
        let requestTimeInterval = 1
        let requestFactorInterval = 50
        // let requestFactorInterval = 60
        hisHandler.factoryInfo = { epcodeFinished, currFactory }
        // hisHandler.factoryInfo = { epcodeFinished, factoryFinished, currFactory }
        const addRes = await hisHandler.addHisdata(
            factorMiss,
            startTime,
            endTime,
            splitType,
            requestTimeInterval,
            requestFactorInterval
        )
        // await hisHandler.disconnect()
        await system.delayms(6000)
        // return { databaseName, factors: factorMiss, factorToInfo }
        // await user.login()
    }
    await hisHandler.disconnect()
    await system.delayms(6000)
    return { databaseName, factors: factorMiss, factorToInfo }
}
const initFactorySiteTable = async function (): Promise<any> {
    //* 企业采集站点库
    let factorySiteHandler = Container.get<CFactorySiteTable>("企业站点库")
    factorySiteHandler.conneConfig = factoryConfig
    factorySiteHandler.connect()
    let collectors = await factorySiteHandler.getCollector()
    await factorySiteHandler.deleteAll()
    await factorySiteHandler.add(collectors)
    // !人为更新collector接口返回的企业信息错误
    await factorySiteHandler.update(
        { epcode: "3210230203000304", type: "GK" },
        { name: "GK_YZ_GD_HBNY", objname: "GK_YZ_GD_HBNY" }
    )
    await factorySiteHandler.update(
        { epcode: "321000000035", type: "GK" },
        { name: "GK_YZ_GKWNFD", objname: "GK_YZ_GKWNFD" }
    )
    await factorySiteHandler.update(
        { epcode: "320300000089", type: "GK" },
        { name: "GK_9132031279905990XA", objname: "GK_9132031279905990XA" }
    )
    await factorySiteHandler.update(
        { epcode: "3213000200000227", type: "GK" },
        { name: "GK_91321300066260235Y", objname: "GK_91321300066260235Y" }
    )
    let collectorObjList = await factorySiteHandler.distinct("objname")
    // // 避免objname与name字段值不一致
    // for (let objname of collectorObjList) {
    //     await factorySiteHandler.update({ objname: objname }, { name: objname })
    // }
    let objList = await factorySiteHandler.getSystemObject(/^(GK_)|^(MD_)/) // 长度245：2021-12-29记录
    let objFactoryInfo = await factorySiteHandler.getObjectOfFactoryInfo(objList)
    // todo: 验证supOS平台上对象实例有，但是collector接口返回上没有的企业信息,并添加到企业信息库中
    let sharedObjname: Array<string> = []
    let collectorObjnameMiss = objList.reduce((arr: any, objname: string) => {
        if (!collectorObjList.includes(objname)) {
            arr.push(objname)
        } else {
            sharedObjname.push(objname)
        }

        return arr
    }, [])
    let factoryMissInfoList: Array<any> = []
    for (let objname of collectorObjnameMiss) {
        factoryMissInfoList.push(objFactoryInfo[objname])
    }
    await factorySiteHandler.add(factoryMissInfoList)
    // ? 更新企业信息库中的企业名称displayname(可能不止displayname字段？)(仅更新supOS和collector共有的企业)
    for (let objname of sharedObjname) {
        await factorySiteHandler.update(
            { objname: objname },
            { displayname: objFactoryInfo[objname].displayname }
        )
    }
    // ?更新缺失企业的epcode
    let missFactoryEpcode: { [prop: string]: string } = {
        GK_JY_GD_WHCL: "320200800038",
        MD_23040280001601: "3212830200013543",
        MD_23040283219998: "3212010200005257",
        MD_32082600005803: "3208260200001862",
        MD_81733553204110: "320400010043",
        MD_JLWZYX23211005: "3211010200101506",
        MD_JLWZYX23211402: "3211010200101506"
    }
    for (let objname of Object.keys(missFactoryEpcode)) {
        await factorySiteHandler.update(
            { objname: objname },
            { epcode: missFactoryEpcode[objname] }
        )
    }
    // todo:验证collector接口上有，但是supOS平台上没有的企业及对象实例信息，并从库中删除该部分企业信息
    let objnameRedundant = collectorObjList.reduce((arr: any, objname: string) => {
        !objList.includes(objname) && arr.push(objname)
        return arr
    }, [])
    // 删除企业库中supOS上没有对象实例的记录
    // let delObjnameList = [
    //     "GK_321200820070", // 靖江市华汇城市污水处理有限公司
    //     "GK_3209220202001829", // 国家电投集团协鑫滨海发电有限公司
    //     "GK_3212030200000918", // 江苏港城污水处理有限公司
    //     "GK_321300100014", // 国家能源集团宿迁发电有限公司
    //     "GK_3210810201000353", // 扬州中化化雨环保有限公司
    //     "GK_3213000200000227" // 江苏泗阳海峡环保有限公司
    // ]
    // let deleCollectorList = delObjnameList.map((item) => {
    //     return { name: item }
    // })
    // await factorySiteHandler.delete({ $or: deleCollectorList })
    await factorySiteHandler.delete({ objname: { $in: objnameRedundant } })
    let collectorKeyInfo: { [prop: string]: any } = {}
    let objnameArr: Array<string> = []
    let newcollectors = await factorySiteHandler.select(null, null)
    if (Array.isArray(newcollectors)) {
        newcollectors.forEach((collector: IFactoryStruct) => {
            let { objname, displayname, period, type, epcode, mn, ...arg } = collector
            let hj212mn = mn
            collectorKeyInfo[objname] = { displayname, period, type, epcode, hj212mn }
            objnameArr.push(objname)
        })
    }
    let factoryNoEpcodeInfo = await factorySiteHandler.select({ epcode: "" }, null)
    let epcodeArr: Array<string> = await factorySiteHandler.distinct("epcode")
    await factorySiteHandler.disconnect()
    return { collectorKeyInfo, objnameArr, epcodeArr, factoryNoEpcodeInfo }
}

const initFactorTableByVendor = async function (
    collectorKeyInfo: { [prop: string]: any },
    objnameArr: Array<string>
): Promise<any> {
    //* 企业监测因子库
    // let { factors, factorHandler } = await factorTableTest()
    // let { hisData, hisHandler } = await hisTableTest(factors)

    let factorHandler = Container.get<CFactorTable>("监测因子数据库")
    factorHandler.conneConfig = factortableConfig
    // factorHandler.mongodb.conneConfig = factortableConfig
    await factorHandler.connect()
    let factorTable = await factorHandler.getFactor()

    // // !后期添加扬州港口污泥的工况监测因子，factor接口返回中无该监测因子
    // let missFactorList = await factorHandler.getObjectFactors(["GK_YZ_GKWNFD"])
    // !factor接口返回中扬州港口污泥（有末端无工况），下面为后期添加的工况监测因子
    let missFactorList = await factorHandler.getObjectFactors([
        "GK_YZ_GKWNFD"
        // "GK_9132031279905990XA",
        // "MD_60679742320611",
        // "MD_60679742320612"
    ])
    console.log("补充因子长度: ", missFactorList.length)
    factorTable = [...factorTable, ...missFactorList]
    // ? factor接口返回的宝应光大的因子的对应的对象实例有问题，需要将对象实例由GK_JY_GD_WHCL修改为GK_YZ_GD_HBNY
    // ?factor接口返回的铜山华润电力的因子的对应的对象实例有问题，需要将对象实例由GK_320300000089修改为GK_9132031279905990XA

    let factorRex = JSON.stringify(factorTable)
        .replace(/GK_JY_GD_WHCL\./g, "GK_YZ_GD_HBNY.")
        .replace(/GK_320300000089\./g, "GK_9132031279905990XA.")

    factorTable = JSON.parse(factorRex)
    if (Array.isArray(factorTable)) {
        await factorHandler.deleteAll()
        await factorHandler.add(factorTable)
    }

    //* 更新监测因子库
    // ? 纠错接口返回中光大宝应监测因子对象实例
    await factorHandler.update(
        { epcode: "3210230203000304", objname: "GK_JY_GD_WHCL" },
        { objname: "GK_YZ_GD_HBNY" }
    )
    // ? 纠错接口返回中铜山华润电力监测因子对象实例
    await factorHandler.update(
        { epcode: "320300000089", objname: "GK_320300000089" },
        { objname: "GK_9132031279905990XA" }
    )
    if (objnameArr.length) {
        objnameArr.forEach(async (objname) => {
            await factorHandler.update({ objname: objname }, collectorKeyInfo[objname])
        })
    }
}

const initFactorTableBySupos = async function (
    collectorKeyInfo: { [prop: string]: any },
    objnameArr: Array<string>
): Promise<any> {
    let factorHandler = Container.get<CFactorTable>("监测因子数据库")
    factorHandler.conneConfig = factortableConfig
    // factorHandler.mongodb.conneConfig = factortableConfig
    await factorHandler.connect()
    let factorTable: Array<object> = []
    for (let objname of objnameArr) {
        let factorInfoList = await factorHandler.getObjectFactors([objname])
        console.log(`${objname}因子个数: `, factorInfoList.length)
        factorTable = [...factorTable, ...factorInfoList]
    }
    if (Array.isArray(factorTable)) {
        await factorHandler.deleteAll()
        await factorHandler.add(factorTable)
        objnameArr.forEach(async (objname) => {
            await factorHandler.update({ objname: objname }, collectorKeyInfo[objname])
        })
    }
}
//* ********************************************************************************** */
// * 历史数据main*/
let promise
let startTimeOrigin = "2022-01-01T04:00:00Z"
let endTimeOrigin = "2022-01-02T12:00:00Z"
// let startTimeOrigin = "2021-11-01T04:00:00Z"
// let endTimeOrigin = "2022-01-01T04:00:00Z"
// let startTimeOrigin = "2021-02-13T04:00:00Z"
// let endTimeOrigin = "2021-05-13T04:00:00Z"
// let startTimeOrigin = "2021-09-01T04:00:00Z"
// let endTimeOrigin = "2021-11-01T04:00:00Z"
// let startTimeOrigin = "2021-05-13T04:00:00Z"
// let endTimeOrigin = "2021-09-01T04:00:00Z"
let isLinked: boolean, isExported: boolean
let epcodeRequiredFinished: Array<string> = []
let epcodeFinished: Array<string> = []
// let factoryFinished: Array<string> = []
let epcodeExportedFinished: Array<string> = []
let factoryExportedFinished: Array<string> = []

let currFactory: string
// let startTimeOrigin = "2021-09-26T04:00:00Z"
// let endTimeOrigin = "2021-10-20T04:00:00Z"
let logPath = path.resolve(__dirname, "./log")
const main = async function () {
    let user = Container.get<User>("用户")
    await user.login()

    let { collectorKeyInfo, objnameArr, epcodeArr } = await initFactorySiteTable()
    console.log("企业个数：", epcodeArr.length)
    // ?获取监测因子并存入监测因子数据库，使用8999/serverapi/cfg/factor接口获取监测因子，部分出错
    // await initFactorTableByVendor(collectorKeyInfo, objnameArr)
    // *此处使用supOS自带接口获取对象实例下的对象属性(即监测因子)更为准确
    await initFactorTableBySupos(collectorKeyInfo, objnameArr)
    let resPromise: Array<any> = []
    //* 判断当前完成进度，还剩下哪些企业没有完成
    // !注意：hisResult.json文件至少要有一个空对象{}
    let hisResult: { [prop: string]: any } = JSON.parse(
        fs.readFileSync(`${basicPath}/hisResult.json`)
    )
    let hisOriginResult: { [prop: string]: any } = hisResult
    // !注意：config.json文件至少要有一个空对象{}
    let config: { [prop: string]: any } = JSON.parse(fs.readFileSync(`${basicPath}/config.json`))
    let currConfig = config[`${startTimeOrigin}->>${endTimeOrigin}`]
    if (currConfig) {
        isLinked = currConfig["isLinked"]
        isExported = currConfig["isExported"]
    } else {
        config[`${startTimeOrigin}->>${endTimeOrigin}`] = { isLinked: true, isExported: true }
        XLSX_JSON.saveJsonToFile(config, basicPath, "config")
        isLinked = true
        isExported = true
    }
    let epcodeAll: Array<string> = epcodeArr
    // if (isExported) {
    //     epcodeAll = epcodeArr
    // }

    console.log("读取配置文件成功")
    // let { `${startTimeOrigin}->>${endTimeOrigin}`, ...leftHisResult } = hisResult
    let currHisResult = hisResult[`${startTimeOrigin}->>${endTimeOrigin}`]
    // 读取请求企业情况
    let missEpcode: Array<string> = []
    let epcodeRequiredArr: Array<string> = epcodeArr
    let hasOriginRequired: { [prop: string]: any } = {}

    if (currHisResult && currHisResult.hasRequired) {
        hasOriginRequired = currHisResult.hasRequired
        let hasRequiredEpcode = Object.keys(hasOriginRequired)
        // let hasFinishedFactory = currHisResult.hasFinished.factory
        missEpcode = epcodeArr.reduce((arr: any, item: string) => {
            !hasRequiredEpcode.includes(item) && arr.push(item)
            return arr
        }, [])
        epcodeRequiredArr = missEpcode
        epcodeAll = epcodeRequiredArr
        epcodeRequiredFinished = hasRequiredEpcode
        epcodeFinished = epcodeRequiredFinished
        // factoryFinished = hasFinishedFactory
    } else {
        hisResult[`${startTimeOrigin}->>${endTimeOrigin}`] = {}
        currHisResult = {}
    }
    let hasCurrentRequired: { [prop: string]: any } = hasOriginRequired
    // 读取当前导出情况
    let missExportedEpcode: Array<string> = []
    let epcodeExportedAll: Array<string> = epcodeArr
    let hasOriginExported: { [prop: string]: any } = {}
    if (currHisResult && currHisResult.hasExported) {
        hasOriginExported = currHisResult.hasExported
        let hasExportedEpcode = Object.keys(hasOriginExported)
        // let hasFinishedFactory = currHisResult.hasFinished.factory
        missExportedEpcode = epcodeArr.reduce((arr: any, item: string) => {
            !hasExportedEpcode.includes(item) && arr.push(item)
            return arr
        }, [])
        epcodeExportedAll = missExportedEpcode
        epcodeExportedFinished = hasExportedEpcode
        epcodeFinished = epcodeExportedFinished
        // factoryFinished = hasFinishedFactory
    }
    let hasCurrentExported: { [prop: string]: any } = hasOriginExported

    if (!isLinked && isExported) {
        epcodeAll = epcodeExportedAll
    }
    //* 遍历还没有完成导出历史数据的企业，查询并保存到历史数据库中，并写入到excel文件中
    for (let epcode of epcodeAll) {
        let { factors, factorToInfo, databaseName } = await getFactoryHistory(epcode)

        console.log("当前企业:", databaseName, "\n监测因子个数：", factors.length)
        let hisHandler = Container.get<CSuposHistoryTable>("supOS历史数据库")
        databaseName = databaseName.slice(0, 20)
        suposHistorytableConfig.datasename = databaseName
        currFactory = databaseName
        hisHandler.conneConfig = suposHistorytableConfig
        await hisHandler.connect()
        console.log(`连接history数据库:数据库名：${databaseName}`)
        // //* 因子分批--避免写数据文件奔溃
        let factorSlice: Array<any> = []
        for (var i = 0; i < factors.length; i += 2) {
            factorSlice.push(factors.slice(i, i + 2))
        }
        fileIndex = 1 // 文件索引，每个excel文件保存一个监测因子，文件索引用来记录当前企业中已经写入excel文件的因子个数
        // * 从历史数据库中读取数据并写入文件中
        let promisesall: Array<any> = []
        for (let factorSel of factorSlice) {
            // const together = new Array(factorSel.length).fill(null)
            let promise_factor = factorSel.map((factor: string) => {
                hisHandler.convertCollectionTo(factor)
                return patchHis(hisHandler, factorToInfo, factor)
            })
            let promiseall = await Promise.all(promise_factor)
            promisesall.push(...promiseall)
        }
        resPromise.push({ [databaseName]: promisesall })
        await hisHandler.disconnect()
        epcodeFinished.push(epcode)
        // factoryFinished.push(databaseName)
        //* 保存企业历史数据导出结果到记录中，方便下次直接从未完成导出历史数据的企业开始
        if (isLinked) {
            hasCurrentRequired = { ...hasCurrentRequired, [epcode]: databaseName }
            hisResult[`${startTimeOrigin}->>${endTimeOrigin}`]["hasRequired"] = hasCurrentRequired
        }
        if (isExported) {
            hasCurrentExported = { ...hasCurrentExported, [epcode]: databaseName }
            hisResult[`${startTimeOrigin}->>${endTimeOrigin}`]["hasExported"] = hasCurrentExported
        }

        XLSX_JSON.saveJsonToFile(hisResult, basicPath, "hisResult")
    }

    return resPromise
}
// let basicPath: string = path.resolve(__dirname, "./")
main()
    .then((item) => {
        console.log("success", item)
        XLSX_JSON.saveJsonToFile(
            item,
            logPath,
            `hislog-${(startTimeOrigin + "--" + endTimeOrigin).replace(/:/g, "_")}`
        )
    })
    .catch((e) => {
        console.log(e, "e")
        // file.writeFile(
        //     `${basicPath}/error.log`,
        //     `时间：${moment().format("YYYY-MM-DD HH:mm:ss")}  ${e.toString()}`,
        //     "utf8"
        // )
        fs.appendFileSync(
            `${basicPath}/log/error.log`,
            `\r\n 时间：${moment().format("YYYY-MM-DD HH:mm:ss")}  ${e.toString()}`,
            "utf8"
        )
        // process.stdin.pause()
        console.log("运行出错")
        // var userName = readlineSync.question("please enter any key")
    })
