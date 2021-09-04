/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:11:34
 * @LastEditTime: 2021-09-02 19:25:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\mongoose.config.ts
 */

import mongoose from 'mongoose';
import { factoryConfig, ruletableConfig, ImongodbConfig } from '../config';
import { Container, Service, Inject } from 'typedi';
export interface IDatabase {
    add(dataArr: Array<Object>): void;
    delete(filterObj: Object): void;
    update(filterObj: Object, newItem: Object): void;
    select(whereFilterObj: Object | null, projection: Array<string> | null): void;
}

//* mongodb数据库接口定义
export interface IMongDB extends IDatabase {
    connect(): void;
    disconnect(): void;
    // add(dataArr: Array<Object>): void;
    // delete(filterObj: Object): void;
    // update(filterObj: Object, newItem: Object): void;
    // select(whereFilterObj: Object | null, projection: Array<string>): void;
}
@Service('mongodb基类')
export class CMongoose extends mongoose.Mongoose {}

//* 接口实现mongodb数据库基本操作：连接，断开连接以及增删改查操作
@Service('mongodb操作类')
export class CMongoDB implements IMongDB {
    conneConfig: ImongodbConfig;
    // public instantiateDatabase: mongoose.Mongoose = new mongoose.Mongoose();
    @Inject('mongodb基类')
    instantiateDatabase!: CMongoose;
    public modelCollection: any;
    public instantiateCollection: any;
    constructor(config: ImongodbConfig) {
        this.conneConfig = config;
    }
    async connect(): Promise<boolean> {
        if (!this.conneConfig) {
            throw new Error('mongoose输入数据不足');
        }
        await this.instantiateDatabase.connect(
            `mongodb://${this.conneConfig.ip}/${this.conneConfig.datasename}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        const { Schema } = this.instantiateDatabase;
        let schema = new Schema(this.conneConfig.schema);
        this.modelCollection = this.instantiateDatabase.model(
            this.conneConfig.collectionname,
            schema
        );
        this.instantiateCollection = new this.modelCollection();
        return true;
    }
    async disconnect(): Promise<any> {
        return await this.instantiateDatabase.disconnect();
    }
    async add(dataArr: Array<Object>): Promise<any> {
        // const ss = this.instantiateCollection;
        return await this.modelCollection.insertMany(dataArr);
    }
    async delete(filterObj: Object): Promise<any> {
        return await this.modelCollection.deleteMany(Object);
    }
    async update(filterObj: Object, newItem: Object): Promise<any> {
        return await this.modelCollection.updateMany(filterObj, newItem);
    }
    // @query
    async select(
        whereFilterObj: Object | null,
        fieldFilterArr: Array<string> | null
    ): Promise<Array<Object>> {
        fieldFilterArr = fieldFilterArr || [''];
        // fieldFilterArr.push(...['-_id', '-__v']);
        fieldFilterArr.push(...['-_id']);
        let fieldRemoveIdFilter: Array<string> = fieldFilterArr;
        // return await this.modelCollection.find(filterObj, { _id: 0, __v: 0 });
        return await this.modelCollection.find(whereFilterObj, fieldRemoveIdFilter.join(' '));
    }
    async distinct(fieldFilterArr: Array<object>): Promise<any> {
        return await this.modelCollection.aggregate(fieldFilterArr);
        // return await this.modelCollection.distinct(fieldFilterArr);
    }
}

// ? 单元测试
/* const classObj = new CMongoDB(factoryConfig);
classObj.connect();
const oo = { objname: 'sss' }; */
// classObj.add([{ objname: 'sss', displayname: 'hhh', description: 'lll' }]).then(() => {
//     classObj.select({ displayname: 'hhh' }, ['displayname']).then((res) => {
//         console.log('ss', res);
//     });
// });
// classObj.delete({ _id: 0 }).then(() => {
//     classObj.select(null, null).then((res) => {
//         console.log('ss', res);
//     });
// });

// classObj.select(null, null).then((res) => {
//     console.log('ss', res);
// });
