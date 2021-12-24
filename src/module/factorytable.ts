/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:09
 * @LastEditTime : 2021-12-21 02:46:55
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
    async getCollector(): Promise<any> {
        this.vendorHandler.vendor = collectorUrlConfig
        const res = await this.vendorHandler.get()
        if (res.info.toLocaleLowerCase() === "success") {
            return res.data
        } else {
            return false
        }
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
