/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:09
 * @LastEditTime : 2021-12-30 13:54:29
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/module/factorytable.ts
 */
import "reflect-metadata"
import mongoose from "mongoose"

import { Container, Service, Inject } from "typedi"
import { IDatabase, IMongDB, CMongoDB, CMongoose } from "../dao"
import {
    factoryConfig,
    ruletableConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig
} from "../config"
import { CTable } from "../dao"
import { CVendorData, IVendorData } from "./vendor"
import { CVHTrendRequest, CPropertyRequest } from "./server-pitch-request"
import { request, system } from "../../modulejs"
// import { factoryCollectorTempleData } from "../respository/factory/collector"
// Container.import([CMongoDB, CMongoose, CVendorData]);
// interface IFactoryCollector {
//     id: number;
//     objname: string;
//     displayname: string;
//     description: string;
//     type: string;
//     status: number;
//     mn: string;
//     epcode: string;
//     remark: string;
//     period: string;
// }
// interface IFactory extends IFactoryCollector {}
// interface IFactoryTable extends IDatabase {}
// class CFactory {}
@Service("企业站点库")
export class CFactorySiteTable extends CTable {
    @Inject("贴源数据接口")
    vendorHandler!: CVendorData
    @Inject("supOS对象属性接口")
    propertyHandler!: CPropertyRequest
    async getCollector(): Promise<any> {
        this.vendorHandler.vendor = collectorUrlConfig
        const res = await this.vendorHandler.get()
        if (res.info.toLocaleLowerCase() === "success") {
            return res.data
        } else {
            return false
        }
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
    /**
     *
     * @objList ["GK_XX","GK_XXX",...]
     * @returns {"GK_XX":{displayname:"光大",objname:"GK_XX",epcode:"1112301","hj212mn":"1333334333"},"GK_XXX":{displayname:""}}
     */
    async getObjectOfFactoryInfo(objList: Array<string>): Promise<any> {
        // let propsList: Array<string> = []

        // objList.forEach((objname) => {
        //     propsList.push(...[`${objname}.P_EPCODE`, `${objname}.P_WCA_MN_CODE`])
        // })
        // return await this.propertyHandler.propertyBatchQuery(propsList)

        let factoryInfoObjects = {}
        for (let objname of objList) {
            this.propertyHandler.objname = objname
            let propInfoList = await this.propertyHandler.getPropertyInfoList()
            // let propInfoList = await this.propertyHandler.getPropertyInfoList("P_")
            let factoryInfo: {
                objname: string
                epcode?: string
                mn?: string
                type?: string
                displayname?: string
            } = {
                objname: objname,
                type: /^MD_/.test(objname) ? "MD" : "GK",
                displayname: `${objname}-未知企业名`,
                epcode: ""
            }
            for (let propInfo of propInfoList) {
                if (propInfo["name"] == "P_EPCODE" || propInfo["name"] == "E_CODE") {
                    factoryInfo.epcode = propInfo.defaultValue ? propInfo.defaultValue.value : ""
                }
                if (propInfo["objShowName"]) {
                    factoryInfo.displayname = propInfo.objShowName
                }
                // if (propInfo["name"] == "Name") {
                //     factoryInfo.displayname = propInfo.defaultValue
                //         ? propInfo.defaultValue.value !== ""
                //             ? propInfo.defaultValue.value
                //             : factoryInfo.displayname
                //         : factoryInfo.displayname
                // }
                if (propInfo["name"] == "P_WCA_MN_CODE" || propInfo["name"] == "WCA_MN_CODE") {
                    factoryInfo.mn = propInfo.defaultValue ? propInfo.defaultValue.value : ""
                }
            }
            factoryInfoObjects = { ...factoryInfoObjects, [objname]: factoryInfo }
        }

        return factoryInfoObjects
    }
}
//* 企业数据本地持久化类
class CFactoryTablePersistent {
    file: IFile
    constructor(file: IFile) {
        this.file = file
    }
}

//* 企业接入类
// @Service("企业所有接入")
// export class CFactoryTable extends CVendorData {
// vendorConfig: IVendorConfig
// @Inject("贴源数据接口")
// vendorHandler!: CVendorData
// constructor(vendor: IVendorConfig) {
//     this.vendorConfig = vendor
// }
// async getCollector(): Promise<any> {
//     if (!this.vendorConfig) {
//         this.vendorHandler.vendor = collectorUrlConfig
//     } else {
//         this.vendorHandler.vendor = this.vendorConfig
//     }
//     const res = await this.vendorHandler.get()
//     // console.log(res);
//     //     const params = { epcode: '320400010005', mode: 1 };
//     //     const res = vendor.get('serverapi/data/rtd', JSON.stringify(params));
// }
// }

// ? 依赖注入测试
// const urlConfig = {
//     netAddress: 'http://10.32.203.157:8999', // 10.32.203.157:8999
//     netPath: 'serverapi/data/rtd', // serverapi/data/rtd
//     netParam: { epcode: '320400010005', mode: '1' } // ? epcode=320400010005&mode=1=>{epcode:'320400010005',mode:1,}
//     // netData?: Object;
// };
// Container.import([CFactoryDataReceive]);
// let handler = Container.get(CFactoryDataReceive);
// let handler = Container.get<CFactoryDataReceive>('企业所有接入');
// // handler.vendorConfig = collectorUrlConfig;
// handler.getCollector();
// handler.set();

// // ?企业采集器接口获取企业信息-单元测试
// const factoryTableFun = async function () {
//     let factoryTableHandler = Container.get(CFactoryTable);
//     factoryTableHandler.mongodb.conneConfig = factoryConfig;
//     let dataRes = factoryCollectorTempleData;
//     if (dataRes.info.toLocaleLowerCase() === 'success') {
//         const resConnect = await factoryTableHandler.connect();
//         // const resDelete = await factoryTableHandler.deleteAll();
//         // await factoryTableHandler.add(dataRes.data);
//         const res = await factoryTableHandler.select(null, null);
//         // const res = await factoryTableHandler.select({ epcode: '3210230203000304' }, [
//         //     'objname',
//         //     'epcode'
//         // ]);
//         let fieldFilterArr = [
//             // { $sort: { id: 1, status: -1 } }
//             // {
//             //     $match: {
//             //         typeNum: {
//             //             $gt: 1,
//             //             $lte: 2
//             //         }
//             //     }
//             // },
//             {
//                 $group: {
//                     _id: '$epcode',
//                     typeNum: { $sum: 1 },
//                     id: { $first: '$id' },
//                     objname: { $first: '$objname' },
//                     mn: { $first: '$mn' },
//                     status: { $first: '$status' }
//                 }
//             }
//         ];
//         // const res = await factoryTableHandler.distinct(fieldFilterArr);
//         await factoryTableHandler.disconnect();
//         // console.log('factoryTableFunRes', resDelete);
//         console.log('factoryTableFunRes', res, res.length);
//         // console.log('factoryTableFunRes', res, resDelete, res.length);
//     }
// };
// factoryTableFun().then((item) => {
//     console.log('factoryTable', item);
// });
