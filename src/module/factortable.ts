/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-20 02:45:23
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2021-12-24 20:27:58
 * @Description  : Do not edit
 * @FilePath     : /express/src/module/factortable.ts
 * @github-name  : scxmonkeyas
 */

import * as _ from "lodash"
import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
// import mongoose from 'mongoose';
import { fs, file, path, system, XLSX_JSON, moment, readlineSync } from "../../modulejs"
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
    batchQueryConfig
} from "../config"
import { CVHTrendRequest, CPropertyRequest } from "./server-pitch-request"
import { CVendorData, IVendorData } from "./vendor"
import { CSupOSData } from "./supos"
import { User } from "./user"

Container.import([CSupOSData, User])

@Service("监测因子数据库")
export class CFactorTable extends CTable {
    @Inject("贴源数据接口")
    vendorHandler!: CVendorData
    @Inject("supOS对象属性接口")
    propertyHandler!: CPropertyRequest
    async getObjectFactors(objList: Array<string>): Promise<any> {
        let factorInfoList = []
        for (let objname of objList) {
            this.propertyHandler.objname = objname
            let propInfoList = await this.propertyHandler.getPropertyInfoList()
            for (let propInfo of propInfoList) {
                if (propInfo["bindingSourceName"] && propInfo["description"]) {
                    let name = propInfo.name
                    // ?监测因子正常为E10000形式，但也有些特殊情况(铜山华润为例(GK_9132031279905990XA)：G8016/G801511/G326XX)
                    if (/^[A-Z]{1}([0-9A-Z]{4,6})$/gm.test(name)) {
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
    async getFactor(netParam?: object): Promise<any> {
        this.vendorHandler.vendor = cfgFactorConfig(netParam)
        let factors = await this.vendorHandler.get()
        if (factors.info.toLocaleLowerCase() === "success") {
            return factors.data
        } else {
            return false
        }
    }
}

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

    const factortable = await factorTableHandler.select(null, null)
    await factorTableHandler.disconnect()
    // alarmTableHandler.ruletable = ruletable
    // await alarmTableHandler.getAlarmTable()
    // let alarmTable = alarmTableHandler.table
    // // console.log("alarmTable", alarmTable)
    // return await alarmTableFun(alarmTable)
    // console.log('alarmTableFun', alarmTableHandler.table);
    return factortable
}

// factorTableTest().then((item) => {
//     console.log(item)
// })
