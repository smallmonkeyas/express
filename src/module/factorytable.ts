/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:09
 * @LastEditTime: 2021-09-01 18:53:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\factorytable.ts
 */
import 'reflect-metadata';
import mongoose from 'mongoose';

import { Container, Service, Inject } from 'typedi';
import { IDatabase, IMongDB, CMongoDB, CMongoose } from '../dao';
import {
    factoryConfig,
    ruletableConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig
} from '../config';
import { CVendorData, IVendorData } from './vendor';
import { request, system } from '../../modulejs';
import { factoryCollectorTempleData } from '../respository/factory/collector';
Container.import([CMongoDB, CMongoose, CVendorData]);
interface IFactoryCollector {
    id: number;
    objname: string;
    displayname: string;
    description: string;
    type: string;
    status: number;
    mn: string;
    epcode: string;
    remark: string;
    period: string;
}
// interface IFactory extends IFactoryCollector {}
interface IFactoryTable extends IDatabase {}
// class CFactory {}
@Service()
class CFactoryTable implements IFactoryTable {
    @Inject('mongodb操作类')
    mongodb!: CMongoDB;
    async connect(): Promise<any> {
        this.mongodb.conneConfig = factoryConfig;
        return await this.mongodb.connect();
        // this.mongodb.instantiateDatabase = new mongoose.Mongoose();
    }
    async disconnect(): Promise<any> {
        return await this.mongodb.disconnect();
    }
    async add(dataArr: Array<Object>): Promise<any> {
        // let mongodbInstance = Container.get<IMongDB>('mongodb类');
        // return mongodbInstance.add(dataArr);
        return await this.mongodb.add(dataArr);
    }
    async delete(filterObj: Object): Promise<any> {
        // let mongodbInstance = Container.get<IMongDB>('mongodb操作类');
        return await this.mongodb.delete(filterObj);
    }
    async update(filterObj: Object, newItem: Object): Promise<any> {
        // let mongodbInstance = Container.get<IMongDB>('mongodb操作类');
        // return mongodbInstance.update(filterObj, newItem);
        return await this.mongodb.update(filterObj, newItem);
    }
    async select(whereFilterObj: Object | null, projection: Array<string> | null): Promise<any> {
        // let mongodbInstance = Container.get<IMongDB>('mongodb操作类');
        // return mongodbInstance.select(whereFilterObj, projection);
        return await this.mongodb.select(whereFilterObj, projection);
    }
    async deleteAll(): Promise<any> {
        // let mongodbInstance = Container.get<IMongDB>('mongodb操作类');
        // return mongodbInstance.delete({ _id: 0 });
        return await this.mongodb.delete({ _id: 0 });
    }
    async distinct(projection: Array<object>): Promise<any> {
        // let mongodbInstance = Container.get<IMongDB>('mongodb操作类');
        // return mongodbInstance.select(whereFilterObj, projection);
        return await this.mongodb.distinct(projection);
    }
}
//* 企业数据本地持久化类
class CFactoryTablePersistent {
    file: IFile;
    constructor(file: IFile) {
        this.file = file;
    }
}

//* 企业接入类
@Service('企业所有接入')
class CFactoryDataReceive {
    vendorConfig: IVendorConfig;
    @Inject('贴源数据接口')
    vendorHandler!: CVendorData;
    constructor(vendor: IVendorConfig) {
        this.vendorConfig = vendor;
    }
    async getCollector() {
        if (!this.vendorConfig) {
            this.vendorHandler.vendor = collectorUrlConfig;
        } else {
            this.vendorHandler.vendor = this.vendorConfig;
        }
        const res = await this.vendorHandler.get();
        // console.log(res);
        //     const params = { epcode: '320400010005', mode: 1 };
        //     const res = vendor.get('serverapi/data/rtd', JSON.stringify(params));
    }
}

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

// ?企业采集器接口获取企业信息-单元测试
// const factoryTableFun = async function () {
//     let factoryTableHandler = Container.get(CFactoryTable);
//     let dataRes = factoryCollectorTempleData;
//     if (dataRes.info.toLocaleLowerCase() === 'success') {
//         const resConnect = await factoryTableHandler.connect();
//         const resDisConnect = await factoryTableHandler.deleteAll();
//         // await factoryTableHandler.add(dataRes.data);
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
//         const res = await factoryTableHandler.distinct(fieldFilterArr);
//         await factoryTableHandler.disconnect();
//         console.log('factoryTableFunRes', res, resDisConnect);
//     }
// };
// factoryTableFun().then((item) => {
//     console.log('factoryTable', item);
// });
