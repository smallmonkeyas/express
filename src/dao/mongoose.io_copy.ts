// /* eslint-disable no-unused-vars */
// /*
//  * @Author: your name
//  * @Date: 2021-08-25 15:11:34
//  * @LastEditTime: 2021-10-18 19:27:25
//  * @LastEditors: Please set LastEditors
//  * @Description: In User Settings Edit
//  * @FilePath: \express\src\dao\mongoose.config.ts
//  */

// import mongoose from "mongoose"
// import { factoryConfig, ruletableConfig } from "../config/mongodb.config"
// import { Container, Service } from "typedi"
// // const mongoInstance = new mongoose.Mongoose();
// // const mongoInstance1 = new mongoose.Mongoose();
// // // import { factoryConfig, ruletableConfig } from '../config/mongodb.config';
// // // mongoInstance.connect('mongodb://localhost:27017/workCondition_subSystem', {
// // //     useNewUrlParser: true,
// // //     useUnifiedTopology: true
// // // });
// // mongoInstance1.connect('mongodb://localhost:27016/workCondition_subSystem', {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// // });
// // // ?建立集合结构(表结构)
// // // const { Schema } = mongoInstance;

// // // const factorySchema = new Schema(factoryConfig.schema);
// // // const ruletableSchema = new Schema(ruletableConfig.schema);

// // const FactoryModel = mongoInstance.model(factoryConfig.collectionname, factorySchema);
// // // const RuletableModel = mongoose.model(ruletableConfig.collectionname, ruletableSchema);

// // // const FactoryInstance = new FactoryModel();
// // // const RuletableInstance = new RuletableModel();
// // // FactoryInstance.save().then(() => {
// // //     console.log('FactoryInstance successfully saved');
// // //     // mongoose.disconnect();
// // // });
// // // RuletableInstance.save().then(() => {
// // //     console.log('RuletableInstance successfully saved');
// // //     // mongoose.disconnect();
// // // });
// // // const query = FactoryModel.find(); // `query` is an instance of `Query`
// // FactoryModel.insertMany([{ objname: 'small6', dd: 'dd' }])
// //     .then(async function () {
// //         console.log('mongoInstance', mongoInstance);
// //         console.log('Data inserted'); // Success
// //         FactoryModel.findOne({ objname: 'small6' }, { _id: 0, __v: 0 }).then(
// //             async (docs: any, err: any) => {
// //                 console.log(docs, err);
// //                 await mongoInstance.disconnect();
// //                 console.log('mongoInstance1', mongoInstance);
// //             }
// //         );
// //         // query.select({ objname: 'small1', _id: 0 }).then((docs: any, err: any, item: any) => {
// //         //     console.log(docs, err, item);
// //         // });
// //         // query.select({ objname: 'small1', _id: 0 }).exec((err: any, res: any) => {
// //         //     if (err) {
// //         //         return handleError(err);
// //         //     }
// //         //     console.log(res);
// //         // });
// //         // let res = await query.select({ objname: 'small2' });
// //         // console.log(res);
// //     })
// //     .catch(function (error) {
// //         console.log(error); // Failure
// //     });

// function handleError(err: any) {
//     throw new Error("Function not implemented.")
// }
// // const kitty = new Cat({ name: 'Zildjian' });
// // kitty.save().then(() => {
// //     console.log('meow');
// //     mongoose.disconnect();
// // });

// // export { FactoryModel, RuletableModel, FactoryInstance, RuletableInstance, mongoose };

// // class Cat {
// //     name: string;
// //     constructor(name: string) {
// //         this.name = name;
// //     }
// //     async getAsync() {
// //         let res = await FactoryInstance.save();
// //         return res;
// //     }
// // }

// // let catInstance = new Cat('小喵');
// // catInstance.getAsync();
// // ! 修饰器部分
// async function query() {}

// interface IMongDB {
//     connect(): void
//     disconnect(): void
//     add(dataArr: Array<Object>): void
//     delete(filterObj: Object): void
//     update(filterObj: Object, newItem: Object): void
//     select(whereFilterObj: Object | null, projection: Array<string>): void
// }

// @Service()
// export class CMongoDB implements IMongDB {
//     // instantiateObject: mongoose.Mongoose | undefined;
//     conneConfig: ImongodbConfig
//     // static instantiateObject: typeof mongoose;
//     public instantiateDatabase: mongoose.Mongoose = new mongoose.Mongoose()
//     public modelCollection: any
//     public instantiateCollection: any
//     constructor(config: ImongodbConfig) {
//         this.conneConfig = config
//         // this.connect();
//     }
//     connect(): void {
//         // let instantiateDatabase = new mongoose.Mongoose();
//         this.instantiateDatabase.connect(
//             `mongodb://${this.conneConfig.ip}/${this.conneConfig.datasename}`,
//             {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true
//             }
//         )
//         const { Schema } = this.instantiateDatabase
//         let schema = new Schema(this.conneConfig.schema)
//         this.modelCollection = this.instantiateDatabase.model(
//             this.conneConfig.collectionname,
//             schema
//         )
//         this.instantiateCollection = new this.modelCollection()
//     }
//     disconnect(): void {
//         this.instantiateDatabase.disconnect()
//     }
//     async add(dataArr: Array<Object>): Promise<any> {
//         const ss = this.instantiateCollection
//         return await this.modelCollection.insertMany(dataArr)
//     }
//     async delete(filterObj: Object): Promise<any> {
//         return await this.modelCollection.deleteMany(Object)
//     }
//     async update(filterObj: Object, newItem: Object): Promise<any> {
//         return await this.modelCollection.update(filterObj, newItem)
//     }
//     // @query
//     async select(
//         whereFilterObj: Object | null,
//         fieldFilterArr: Array<string> | null
//     ): Promise<Array<Object>> {
//         fieldFilterArr = fieldFilterArr || [""]
//         // fieldFilterArr.push(...['-_id', '-__v']);
//         fieldFilterArr.push(...["-_id"])
//         let fieldRemoveIdFilter: Array<string> = fieldFilterArr
//         // return await this.modelCollection.find(filterObj, { _id: 0, __v: 0 });
//         return await this.modelCollection.find(whereFilterObj, fieldRemoveIdFilter.join(" "))
//     }
// }

// // 单元测试
// /* const classObj = new CMongoDB(factoryConfig);
// classObj.connect();
// const oo = { objname: 'sss' }; */
// // classObj.add([{ objname: 'sss', displayname: 'hhh', description: 'lll' }]).then(() => {
// //     classObj.select({ displayname: 'hhh' }, ['displayname']).then((res) => {
// //         console.log('ss', res);
// //     });
// // });
// // classObj.delete({ _id: 0 }).then(() => {
// //     classObj.select(null, null).then((res) => {
// //         console.log('ss', res);
// //     });
// // });

// // classObj.select(null, null).then((res) => {
// //     console.log('ss', res);
// // });
