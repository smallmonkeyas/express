/* eslint-disable space-unary-ops */
/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-20 02:45:08
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2022-01-06 16:02:19
 * @Description  : Do not edit
 * @FilePath     : /express/src/module/historytable.ts
 * @github-name  : scxmonkeyas
 */

// TODO: 引入模块及配置
import * as _ from "lodash"
import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
// import mongoose from 'mongoose';
import {
    request,
    unirest,
    ExcelTemplate,
    Excel,
    stream,
    fs,
    path,
    XLSX_JSON,
    system,
    moment,
    file as files
} from "../../modulejs"

import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../dao"
import {
    // factoryConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig,
    GetPropertyValueNetConfig,
    GetPropertyValuesNetConfig,
    IServerRequestStruct,
    factortableConfig,
    suposHistorytableConfig,
    IHistorySuposStruct,
    IFactorStruct,
    cfgFactorConfig,
    batchQueryConfig,
    historyTempleFileConfig,
    historyDataFileConfig
} from "../config"
import { CVHTrendRequest, CPropertyRequest } from "./server-pitch-request"
import { CVendorData, IVendorData } from "./vendor"
import { CSupOSData } from "./supos"
import { User } from "./user"

Container.import([CSupOSData, User])
// let user = Container.get<User>("用户")

let basicPath = path.resolve(process.cwd(), "./")
// let basicPath = path.resolve(__dirname, "./")
// console.log("basicPath", basicPath)

@Service("supOS历史数据库")
export class CSuposHistoryTable extends CTable {
    names!: string | Array<string>
    startTime!: string
    endTime!: string
    limit?: number
    aggrType?: string
    timeSplitType!: string
    timeInterval!: number
    @Inject("supOS数据接口")
    suposHandler!: CSupOSData
    @Inject("本地文件操作操作类")
    fileHandler!: CFileOperate
    @Inject("supOS对象属性接口")
    propertyHandler!: CPropertyRequest
    factoryInfo!: {
        epcodeFinished: string[]
        // factoryFinished: string[]
        currFactory: string
    }
    factorTotal!: number
    factorCurrTotal!: number
    async getObjectFactors(objList: Array<string>): Promise<any> {
        let factorInfoList = []
        for (let objname of objList) {
            this.propertyHandler.objname = objname
            let propInfoList = await this.propertyHandler.getPropertyInfoList()
            for (let propInfo of propInfoList) {
                if (propInfo["bindingSourceName"] && propInfo["description"]) {
                    let name = propInfo.name
                    if (/^[A-Z]{1}([0-9A-Z]{5})$/gm.test(name)) {
                        let currPropertyInfo: { [prop: string]: any } = {}
                        currPropertyInfo.name = `${objname}.${name}`
                        currPropertyInfo.objname = objname
                        currPropertyInfo.description = propInfo.description
                        currPropertyInfo.unit = propInfo.unit ? propInfo.unit : ""
                        factorInfoList.push(currPropertyInfo)
                    }
                }
            }
        }
        return factorInfoList
    }
    // !注意此处keyWord必须为正则表达式
    async getSystemObject(regexKeyWord?: RegExp): Promise<any> {
        let objList = []
        let objInfoList = await this.propertyHandler.getObjectInfoList()
        if (regexKeyWord) {
            for (let objInfo of objInfoList) {
                if (regexKeyWord.test(objInfo.name)) {
                    objList.push(objInfo.name)
                    // objList.push({ objname: objInfo.name, displayname: objInfo.showName })
                }
            }
        } else {
            for (let objInfo of objInfoList) {
                objList.push(objInfo.name)
            }
        }

        return objList
    }
    async batchQuery(names: Array<string>, startTime: string, endTime: string): Promise<any> {
        this.suposHandler.supos = batchQueryConfig(
            names,
            startTime,
            endTime,
            this.aggrType,
            this.limit
        )
        let res = await this.suposHandler.post()
        return res
    }
    splitTime(
        beginTime: string | number,
        endTime: string | number,
        splitType: string,
        timeInterval: number
    ): Array<string> {
        const beginTimestamp = moment(beginTime).valueOf()
        const endTimestamp = moment(endTime).valueOf()
        // const rangeDays = moment(endTime).diff(beginTime,'days',true);//精确计算时间差
        const rangeDays = moment(endTimestamp).diff(beginTimestamp, splitType)
        let together = new Array(rangeDays + 1).fill(beginTimestamp)
        let timeSplit = together.map((item, index) => {
            return moment(beginTimestamp).add(index, splitType).valueOf()
        })
        if (endTimestamp === timeSplit[rangeDays]) {
            // return timeSplit
        } else {
            timeSplit.push(endTimestamp)
            // return timeSplit
        }
        // let timeSplit = this.splitTime(this.startTime, this.endTime, this.timeSplitType)
        let timeSplitIndex = Math.floor(timeSplit.length / timeInterval)

        let timeSelect = new Array(timeSplitIndex).fill(timeSplit[0])
        if (!timeSplitIndex) {
            timeSelect[0] = beginTime
        }
        timeSelect = timeSelect.map((item, index) => {
            return moment(timeSplit[timeInterval * index])
                .utc()
                .format()
        })
        if (timeSplit.length % timeInterval) {
            timeSelect.push(moment(endTime).utc().format())
        }
        return timeSelect
    }
    async getHistoryData(names: Array<string>, startTime: string, endTime: string): Promise<any> {
        // let timeSplit = this.splitTime(this.startTime, this.endTime, this.timeSplitType)
        // let timeSplitIndex = Math.floor(timeSplit.length / this.timeInterval)
        // let timeSelect = new Array(timeSplitIndex).fill(timeSplit[0])
        // if (!timeSplitIndex) {
        //     timeSelect[0] = this.startTime
        // }
        // timeSelect = timeSelect.map((item, index) => {
        //     return moment(timeSplit[this.timeInterval * index])
        //         .utc()
        //         .format()
        // })
        // if (timeSplit.length % this.timeInterval) {
        //     timeSelect.push(this.endTime)
        // }
        // let timeSelect = this.splitTime(this.startTime, this.endTime, this.timeSplitType)
        // let requestNum = timeSelect.length - 1
        // if (!Array.isArray(this.names)) {
        //     this.names = this.names.split(",")
        // }
        // let hisdata: { [prop: string]: any } = {}
        // this.names.forEach((item: string) => {
        //     hisdata[item] = []
        // })
        // for (let ii = 0; ii < requestNum; ii++) {
        //     const resHis = await this.batchQuery(startTime,endTime)
        //     if (resHis) {
        //         for (let item of this.names) {
        //             // resHis[item].list = resHis[item] || 0
        //             if (resHis.results) {
        //                 console.log(resHis.results[0].datas[0])
        //             }
        //             // console.log(resHis)
        //             // if (system.isJSON(JSON.stringify(resHis[item]))) {
        //             if (!!resHis[item]) {
        //                 hisdata[item] = [...hisdata[item], ...resHis[item].list]
        //                 // hisdata[item].push(...resHis[item].list)
        //             } else {
        //                 console.log(
        //                     "出错",
        //                     item,
        //                     Object.keys(resHis).length,
        //                     Object.keys(resHis),
        //                     timeSelect[ii],
        //                     timeSelect[ii + 1]
        //                 )
        //             }
        //         }
        //         // this.names.forEach((item: string) => {
        //         //     // resHis[item].list = resHis[item] || 0
        //         //     if (resHis.results) {
        //         //         console.log(resHis.results[0].datas[0])
        //         //     }
        //         //     // console.log(resHis)
        //         //     if (system.isJSON(JSON.stringify(resHis[item]))) {
        //         //         hisdata[item].push(...resHis[item].list)
        //         //     } else {
        //         //         console.log("出错", item, timeSelect[ii], timeSelect[ii + 1])
        //         //     }
        //         // })
        //     }
        // }
        // return hisdata
    }

    getCollectionsName(): Promise<any> {
        let handler = this
        return new Promise(function (resolve, reject) {
            handler.instantiateDatabase.connection.db
                .listCollections()
                .toArray(function (err: any, names: Array<any>) {
                    if (err) {
                        console.log(err)
                    } else {
                        let hisCollectionsName: Array<any> = []
                        names.forEach(function (e: any) {
                            // mongoose.connection.db.dropCollection(e.name)
                            // console.log("--->>", e.name)
                            hisCollectionsName.push(e.name.toLocaleUpperCase())
                        })
                        resolve(hisCollectionsName)
                    }
                })
        })
    }
    deleteCollections(collections: Array<string>) {
        let handler = this
        collections.forEach((collectionName) => {
            handler.convertCollectionTo(collectionName.toLocaleUpperCase())

            handler.instantiateDatabase.connection.db.dropCollection(
                collectionName.toLocaleUpperCase()
            )
            handler.convertCollectionTo(collectionName)
            handler.instantiateDatabase.connection.db.dropCollection(collectionName)
        })
        // return new Promise(function (resolve, reject) {
        //     handler.instantiateDatabase.connection.db
        //         .listCollections()
        //         .toArray(function (err: any, names: Array<any>) {
        //             if (err) {
        //                 console.log(err)
        //             } else {
        //                 let hisCollectionsName: Array<any> = []
        //                 if (!!collections) {
        //                     collections.forEach((collectionName) => {
        //                         handler.convertCollectionTo(collectionName)
        //                         handler.instantiateDatabase.connection.db.dropCollection(
        //                             collectionName.toLocaleLowerCase()
        //                         )
        //                     })
        //                 } else {
        //                     names.forEach(function (e: any) {
        //                         handler.instantiateDatabase.connection.db.dropCollection(e.name)
        //                         // console.log("--->>", e.name)
        //                         // hisCollectionsName.push(e.name.toLocaleUpperCase())
        //                     })
        //                 }

        //                 resolve(true)
        //             }
        //         })
        // })
    }
    deleteDatabase() {
        this.instantiateDatabase.connection.db.dropDatabase()
    }
    enhance(list: Array<object>, source: object) {
        return _.map(list, (element) => {
            return _.extend({}, element, source)
        })
    }
    async addHisdata(
        names: string | Array<string>,
        startTime: string,
        endTime: string,
        timeSplitType: string,
        timeInterval: number,
        splitFactor: number,
        limit?: number,
        aggrType?: string
    ): Promise<any> {
        ;[
            this.names,
            this.startTime,
            this.endTime,
            this.timeSplitType,
            this.timeInterval,
            this.limit,
            this.aggrType
        ] = [names, startTime, endTime, timeSplitType, timeInterval, limit, aggrType]
        // //* 因子分批
        let factorSlice = []
        for (var i = 0; i < names.length; i += splitFactor) {
            factorSlice.push(names.slice(i, i + splitFactor))
        }
        // this.conneConfig = suposHistorytableConfig
        // await this.connect()
        // await this.deleteAll()
        // let hisTable: Array<any> = []
        // for (let ii = 0; ii < requestNum; ii++) {
        //     const resHis = await this.batchQuery(timeSelect[ii], timeSelect[ii + 1])
        //     if (resHis) {
        //         for (let item of this.names) {
        //             if (!!resHis[item]) {
        //                 let propertyHis = resHis[item].list
        //                 let propertyHisCompliantData = this.enhance(propertyHis, { name: item })
        //                 this.add(propertyHisCompliantData)
        //             }
        //         }
        //     }
        // }
        // const promises = factorSlice.map((factors) => {
        //     return this.addCompliantHistoryData(
        //         factors,
        //         this.startTime,
        //         this.endTime,
        //         this.timeSplitType,
        //         this.timeInterval,
        //         this.limit,
        //         this.aggrType
        //     )
        // })
        // const promiseall = await Promise.all(promises)
        this.factorTotal = names.length
        this.factorCurrTotal = 0
        for (let i = 0; i < factorSlice.length; i++) {
            this.factorCurrTotal += factorSlice[i].length
            await this.addCompliantHistoryData(
                factorSlice[i],
                startTime,
                endTime,
                timeSplitType,
                timeInterval,
                limit,
                aggrType
            )
        }
        // return promiseall
    }
    async addCompliantHistoryData(
        names: string | Array<string>,
        startTime: string,
        endTime: string,
        timeSplitType: string,
        timeInterval: number,
        limit?: number,
        aggrType?: string
    ): Promise<any> {
        // ;[
        //     this.names,
        //     this.startTime,
        //     this.endTime,
        //     this.timeSplitType,
        //     this.timeInterval,
        //     this.limit,
        //     this.aggrType
        // ] = [names, startTime, endTime, timeSplitType, timeInterval, limit, aggrType]
        if (!Array.isArray(names)) {
            names = names.split(",")
        }
        // 切割时间
        let timeSelect: Array<string> = this.splitTime(
            startTime,
            endTime,
            timeSplitType,
            timeInterval
        )
        //* 先选监测因子，然后按照时间区间进行请求
        let requestNum = timeSelect.length - 1
        console.log(
            `企业索引:${this.factoryInfo.epcodeFinished.length + 1}`,
            `当前企业:${this.factoryInfo.currFactory}`,
            "当前请求监测因子个数:",
            names.length,
            "时间范围",
            `${timeSelect[0]}-->>${timeSelect[requestNum]}`
        )
        let removeFactorslist: Array<any> = []
        let namesCurrent: Array<any> = names
        for (let ii = 0; ii < requestNum; ii++) {
            names = namesCurrent
            namesCurrent = []
            let resHis = await this.getWhileHisdata(names, timeSelect[ii], timeSelect[ii + 1])
            // if (resHis) {
            // let currentFactorRes: Array<string> = Object.keys(resHis)
            // while (
            //     currentFactorRes.includes("message") ||
            //     currentFactorRes.includes("errors")
            // ) {
            //     system.delayms(1000)
            //     console.log("addCompliantHistoryData-resHisObjectkeys", resHis)
            //     // if (resHis["message"] === "401") {
            //     let user = Container.get<User>("用户")
            //     const authLoginRes = await user.login()
            //     console.log("authLogin", authLoginRes)

            //     resHis = await this.batchQuery(names, timeSelect[ii], timeSelect[ii + 1])
            //     currentFactorRes = Object.keys(resHis)
            //     // }
            //     // continue
            // }
            // let factorMiss = names.reduce((arr: any, item: string) => {
            //     // console.log(factorExistInHisTable.includes(item))
            //     !currentFactorRes.includes(item) && arr.push(item)
            //     return arr
            // }, [])
            // let resMissHis = await this.getWhileHisdata(
            //     factorMiss,
            //     timeSelect[ii],
            //     timeSelect[ii + 1]
            // )

            // resHis = { ...resHis, ...resMissHis }

            for (let index = 0; index < names.length; index++) {
                let item = names[index]
                // console.log("addCompliantHistoryData-names-forof", names, item)
                if (!!resHis[item]) {
                    namesCurrent.push(item)
                    let propertyHis = resHis[item].list
                    let propertyHisCompliantData = this.enhance(propertyHis, { name: item })
                    this.convertCollectionTo(item)
                    await this.add(propertyHisCompliantData)
                    console.log(
                        "成功",
                        `企业索引:${this.factoryInfo.epcodeFinished.length + 1}`,
                        `因子统计(当前-${names.length}/已完成-${this.factorCurrTotal}/${this.factorTotal})`,
                        item,
                        "请求数据量:",
                        propertyHisCompliantData.length,
                        timeSelect[ii],
                        timeSelect[ii + 1]
                    )
                } else {
                    removeFactorslist = [...removeFactorslist, item]
                    console.log(
                        "出错",
                        `企业索引:${this.factoryInfo.epcodeFinished.length + 1}`,
                        `因子统计(当前-${names.length}/已完成-${this.factorCurrTotal}/${this.factorTotal})`,
                        item,
                        Object.keys(resHis).length,
                        Object.keys(resHis),
                        names.length,
                        names,
                        timeSelect[ii],
                        timeSelect[ii + 1]
                    )
                }

                // propertiesHistory = [...propertiesHistory, ...propertyHisCompliantData]
            }
            // } else {
            //     console.log("请求出错")
            // }
        }
    }

    // *一直访问历史数据，直到得到正确的结果

    async getWhileHisdata(names: Array<string>, startTime: string, endTime: string): Promise<any> {
        if (names.length === 0) {
            return {}
        }
        let resHis: { [prop: string]: any } = await this.batchQuery(names, startTime, endTime)
        // if (resHis) {
        let currentFactorRes: Array<string> = Object.keys(resHis)
        while (
            currentFactorRes.includes("message") ||
            currentFactorRes.includes("errors") ||
            currentFactorRes.includes("errno")
        ) {
            system.delayms(1000)
            console.log(
                `getWhileHisdata-currentFactor--因子长度：${names.length}-${names[0]}-${startTime}~${endTime}`,
                `因子统计(当前-${names.length}/已完成-${this.factorCurrTotal}/${this.factorTotal})`,
                resHis
            )
            // if (resHis["message"] === "401") {
            let user = Container.get<User>("用户")
            const authLoginRes = await user.login()
            console.log("authLogin", authLoginRes)

            resHis = await this.batchQuery(names, startTime, endTime)
            currentFactorRes = Object.keys(resHis)
            if (currentFactorRes.includes("errors") && Array.isArray(resHis.errors)) {
                resHis = {}
                break
            }
            // }
            // continue
        }

        let factorMiss = names.reduce((arr: any, item: string) => {
            // console.log(factorExistInHisTable.includes(item))
            !currentFactorRes.includes(item) && arr.push(item)
            return arr
        }, [])
        let resMissHis: { [prop: string]: any } = await this.batchQuery(
            factorMiss,
            startTime,
            endTime
        )
        let missFactorRes: Array<string> = Object.keys(resMissHis)
        while (
            missFactorRes.includes("message") ||
            missFactorRes.includes("errors") ||
            missFactorRes.includes("errno")
        ) {
            system.delayms(1000)
            console.log(
                `getWhileHisdata-missFactor-因子长度：${names.length} ${names[0]}-${startTime}~${endTime}`,
                `因子统计(当前-${names.length}/已完成-${this.factorCurrTotal}/${this.factorTotal})`,
                resMissHis
            )
            // if (resHis["message"] === "401") {
            let user = Container.get<User>("用户")
            const authLoginRes = await user.login()
            console.log("authLogin", authLoginRes)

            resMissHis = await this.batchQuery(factorMiss, startTime, endTime)
            missFactorRes = Object.keys(resMissHis)
            if (missFactorRes.includes("errors") && Array.isArray(resMissHis.errors)) {
                resMissHis = {}
                break
            }
            // }
            // continue
        }
        resHis = { ...resHis, ...resMissHis }
        return resHis
    }
    //* 通过模板文件导出历史数据
    async exportHistoryDataByTemplete(
        factorhisdatas: Array<any>,
        factorInfo: { [prop: string]: any }
    ): Promise<any> {
        let timeRange = factorInfo.timeRange.replace(/[\？\?\*\\\/:|<>\"]{1,}/g, "_")
        const templateConfigFileDir = `${historyTempleFileConfig.filePath}/${historyTempleFileConfig.fileName}.${historyTempleFileConfig.fileExtension}`
        // eslint-disable-next-line max-len
        const historyDataOutFilePath = `${historyTempleFileConfig.filePath}/data/${timeRange}/${factorInfo.factoryIndexStr}_${factorInfo.displayname}/`
        const historyDataOutFileDir = `${historyDataOutFilePath}/${factorInfo.description}.${historyTempleFileConfig.fileExtension}`
        files.mkDirsSync(historyDataOutFilePath)
        // todo: 读取配置文件模板文件
        const exlBuf = fs.readFileSync(templateConfigFileDir)
        // todo: 按照模板文件批量添加配置内容并生成配置文件
        const data = [
            [{ table_name: factorInfo.description, date: moment().format("YYYY-MM-DD") }],
            factorhisdatas,
            factorInfo
        ]

        // 用数据源(对象)data渲染Excel模板
        // cachePath 为编译缓存路径, 对于模板文件比较大的情况, 可显著提高运行效率, 绝对路径, 若不设置, 则无缓存
        const exlBuf2 = await ExcelTemplate.renderExcel(exlBuf, data, {
            cachePath: `${historyTempleFileConfig.filePath}/cache`
        })
        // var bufferStream = new stream.PassThrough()
        // // 将Buffer写入
        // bufferStream.end(exlBuf2)
        const workbook = new Excel.Workbook()
        //   let workbookOrigin = await workbook.xlsx.readFile(pathOutDir);
        await workbook.xlsx.load(exlBuf2)
        // this.fileHandler.file = {
        //     filename: factorInfo.description,
        //     filePath: historyDataOutFilePath,

        // }
        // this.fileHandler.creatDir()

        await workbook.xlsx.writeFile(historyDataOutFileDir)
    }
}

// ? 历史数据库测试

const hisTableTest = async function () {
    let user = Container.get<User>("用户")
    await user.login()
    let historyTableHandler = Container.get<CSuposHistoryTable>("supOS历史数据库")
    let hisTable = await historyTableHandler.addCompliantHistoryData(
        ["GK_WX_YL_RDGS.G40101", "GK_WX_YL_RDGS.G40102"],
        "2021-11-07T10:30:00Z",
        "2021-12-19T11:00:00Z",
        "days",
        7
    )
    // console.log("历史:", hisTable)
    historyTableHandler.conneConfig = suposHistorytableConfig
    // historyTableHandler.mongodb.conneConfig = suposHistorytableConfig
    await historyTableHandler.connect()
    await historyTableHandler.deleteAll()
    await historyTableHandler.add(hisTable)
    const historytable = await historyTableHandler.select(null, null)
    await historyTableHandler.disconnect()
    // alarmTableHandler.ruletable = ruletable
    // await alarmTableHandler.getAlarmTable()
    // let alarmTable = alarmTableHandler.table
    // // console.log("alarmTable", alarmTable)
    // return await alarmTableFun(alarmTable)
    // console.log('alarmTableFun', alarmTableHandler.table);
    return historytable
}

// hisTableTest().then((item) => {
//     console.log(item)
// })
