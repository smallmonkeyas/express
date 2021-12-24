/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:11:34
 * @LastEditTime : 2021-12-22 05:07:58
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/dao/mongoose.io.ts
 */
import * as _ from "lodash"
import mongoose from "mongoose"
import { factoryConfig, ruletableConfig, ImongodbConfig, ruletableFileConfig } from "../config"
import { Container, Service, Inject } from "typedi"
export interface IDatabase {
    add(dataArr: Array<Object>): void
    delete(filterObj: Object): void
    update(filterObj: Object, newItem: Object | Array<any>, options: Object): void
    select(whereFilterObj: Object | null, projection: Array<string> | null): void
}

//* mongodb数据库接口定义
export interface IMongDB extends IDatabase {
    connect(): void
    disconnect(): void
    // add(dataArr: Array<Object>): void;
    // delete(filterObj: Object): void;
    // update(filterObj: Object, newItem: Object): void;
    // select(whereFilterObj: Object | null, projection: Array<string>): void;
}
@Service("mongodb基类")
export class CMongoose extends mongoose.Mongoose {}

//* 接口实现mongodb数据库基本操作：连接，断开连接以及增删改查操作
@Service("mongodb操作类")
export class CMongoDB implements IMongDB {
    conneConfig: ImongodbConfig
    // public instantiateDatabase: mongoose.Mongoose = new mongoose.Mongoose();
    @Inject("mongodb基类")
    instantiateDatabase!: CMongoose
    public modelCollection: any
    public instantiateCollection: any
    public schema: any
    constructor(config: ImongodbConfig) {
        this.conneConfig = config
    }
    async connect(): Promise<boolean> {
        if (!this.conneConfig) {
            throw new Error("mongoose输入数据不足")
        }
        await this.instantiateDatabase.connect(
            `mongodb://${this.conneConfig.ip}/${this.conneConfig.datasename}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        const { Schema } = this.instantiateDatabase
        this.schema = new Schema(this.conneConfig.schema)
        this.modelCollection =
            this.instantiateDatabase.models[this.conneConfig.collectionname] ||
            this.instantiateDatabase.model(this.conneConfig.collectionname, this.schema)
        this.instantiateCollection = new this.modelCollection()
        return true
    }
    convertCollectionTo(collectionName: string) {
        this.modelCollection =
            this.instantiateDatabase.models[collectionName] ||
            this.instantiateDatabase.model(collectionName, this.schema)
        this.instantiateCollection = new this.modelCollection()
    }
    async disconnect(): Promise<any> {
        return await this.instantiateDatabase.disconnect()
    }
    async add(dataArr: Array<Object>): Promise<any> {
        // const ss = this.instantiateCollection;
        // var modelCollection = _.cloneDeep(this.modelCollection)
        return await this.modelCollection.insertMany(dataArr)
        // return await modelCollection.insertMany(dataArr)
    }
    async delete(filterObj: Object): Promise<any> {
        // var modelCollection = _.cloneDeep(this.modelCollection)
        return await this.modelCollection.deleteMany(Object)
    }
    async update(filterObj: Object, newItem: Object | Array<any>): Promise<any> {
        // let modelCollection = JSON.parse(JSON.stringify(this.modelCollection))
        // var modelCollection = _.cloneDeep(this.modelCollection)
        // let modelCollection = JSON.parse(JSON.stringify(this.modelCollection))
        return await this.modelCollection.updateMany(filterObj, newItem)
        // return await modelCollection.updateMany(filterObj, newItem)
    }
    // @query
    async select(
        whereFilterObj: Object | null,
        fieldFilterArr: Array<string> | null
    ): Promise<Array<any>> {
        // var modelCollection = _.cloneDeep(this.modelCollection)
        // let modelCollection = JSON.parse(JSON.stringify(this.modelCollection))
        fieldFilterArr = fieldFilterArr || [""]
        // fieldFilterArr.push(...['-_id', '-__v']);
        if (Number(fieldFilterArr) === 0) {
            fieldFilterArr.push(...["-_id", "-__v"])
        } else {
            fieldFilterArr.push(...["-_id"])
        }
        // fieldFilterArr.push(...["-_id", "-__v"]);
        let fieldRemoveIdFilter: Array<string> = fieldFilterArr
        // return await this.modelCollection.find(filterObj, { _id: 0, __v: 0 });
        return await this.modelCollection.find(whereFilterObj, fieldRemoveIdFilter.join(" ")).lean()
    }
    async aggregate(fieldFilterArr: Array<object>): Promise<any> {
        // var modelCollection = _.cloneDeep(this.modelCollection)
        // let modelCollection = JSON.parse(JSON.stringify(this.modelCollection))
        return await this.modelCollection.aggregate(fieldFilterArr).allowDiskUse(true)
        // return await this.modelCollection.aggregate(fieldFilterArr, { allowDiskUse: true })
        // return await this.modelCollection.distinct(fieldFilterArr);
    }
    async distinct(fieldFilter: string, query?: object): Promise<Array<any>> {
        // var modelCollection = _.cloneDeep(this.modelCollection)
        // let modelCollection = JSON.parse(JSON.stringify(this.modelCollection))

        return await this.modelCollection.distinct(fieldFilter, query)
        // return await modelCollection.distinct(fieldFilter, query)
    }
}

// ? 单元测试
// const classObj = new CMongoDB(factoryConfig);
// classObj.connect();
// const oo = { objname: "sss" };
// classObj.add([{ objname: "sss", displayname: "hhh", description: "lll" }]).then(() => {
//     classObj.select({ displayname: "hhh" }, ["displayname"]).then((res) => {
//         console.log("ss", res);
//     });
// });
// classObj.delete({ _id: 0 }).then(() => {
//     classObj.select(null, null).then((res) => {
//         console.log("ss", res);
//     });
// });

// classObj.select(null, null).then((res) => {
//     console.log("ss", res);
// });
