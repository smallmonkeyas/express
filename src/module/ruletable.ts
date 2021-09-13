/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:09
 * @LastEditTime: 2021-09-08 18:02:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\ruletable.ts
 */
import "reflect-metadata";
// import mongoose from 'mongoose';

import { Container, Service, Inject } from "typedi";
import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../dao";
import {
    factoryConfig,
    ruletableConfig,
    IRuleStruct,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig,
    ruletableFileConfig
} from "../config";
import { CVendorData, IVendorData } from "./vendor";
import { request, system, XLSX_JSON, file, fs } from "../../modulejs";
import { factoryCollectorTempleData } from "../respository/factory/collector";
Container.import([CFileOperate]);
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
@Service("规则库操作类")
export class CRuleTable extends CTable {}
//* 规则数据表本地操作类
@Service("规则数据表本地操作类")
export class CRuleTableLocal extends CFileOperate {
    file!: IFile;
    // fileContent: any;
    // @Inject("本地文件操作操作类")
    // operateHandler!: CFileOperate;
    // constructor(file: IFile) {
    //     this.file = file;
    // }
    readFile(): string {
        let fileDirectory = `${this.file.filePath}/${this.file.fileName}.${this.file.fileExtension}`;
        // let fileDirectory = `${this.file.filePath}\\${this.file.fileName}.${this.file.fileExtension}`;
        let fileStr = fs.readFileSync(fileDirectory);
        return fileStr;
    }
    // async writeFile(): Promise<any> {
    //     let fileDirectory = `${this.file.filePath}\\${this.file.fileName}.${this.file.fileExtension}`;
    //     this.operateHandler.file = this.file;
    //     this.operateHandler.fileContent = this.fileContent;
    //     this.operateHandler.writeFile();
    // }
    excelTojson(): Array<IRuleStruct> {
        let pathFileDir = this.file.filePath,
            fileName = this.file.fileName;
        return XLSX_JSON.excelToJson(pathFileDir, fileName);
    }
    patchExcelToJson(): Array<IRuleStruct> {
        let pathFileDir = this.file.filePath;
        let fileType = this.file.fileExtension;
        let filesName = file.get(`.${fileType}`, pathFileDir);
        let jsonTotal: Array<any> = [];
        filesName.forEach((currfileName: string) => {
            this.file.fileName = currfileName;
            jsonTotal.push(...this.excelTojson());
        });
        return jsonTotal;
    }
}

// ? 文件测试
// let ruleTableHandler = Container.get<CRuleTableLocal>("规则数据表本地操作类");

// ruleTableHandler.file = ruletableFileConfig;
// const excelTojson = ruleTableHandler.patchExcelToJson();

// let fileStr = ruleTableHandler.readFile();
// ruletableFileConfig.fileName = "数据输出";
// ruleTableHandler.file = ruletableFileConfig;

// ruleTableHandler.fileContent = fileStr;
// ruleTableHandler.writeFile();
// console.log(fileStr);
// console.log(excelTojson.length);
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

// // ?规则库保存到MongoDB数据库-单元测试
// const ruleTableFun = async function () {
//     let ruleTableHandler = Container.get<CRuleTable>('规则库操作类');
//     ruleTableHandler.mongodb.conneConfig = ruletableConfig;
//     let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

//     ruleTableLocalHandler.file = ruletableFileConfig;
//     const ruleJson = ruleTableLocalHandler.excelTojson();

//     // let dataRes = factoryCollectorTempleData;
//     // if (dataRes.info.toLocaleLowerCase() === 'success') {
//     const resConnect = await ruleTableHandler.connect();
//     // const resDelete = await ruleTableHandler.deleteAll();
//     await ruleTableHandler.add(ruleJson);
//     const res = await ruleTableHandler.select(null, null);
//     // const res = await factoryTableHandler.select({ epcode: '3210230203000304' }, [
//     //     'objname',
//     //     'epcode'
//     // ]);
//     let fieldFilterArr = [
//         // { $sort: { id: 1, status: -1 } }
//         // {
//         //     $match: {
//         //         typeNum: {
//         //             $gt: 1,
//         //             $lte: 2
//         //         }
//         //     }
//         // },
// { $project: { itemDescription: { $concat: [ "$item", " - ", "$description" ] } } }
//         {
//             $group: {
//                 _id: '$epcode',
//                 typeNum: { $sum: 1 },
//                 id: { $first: '$id' },
//                 objname: { $first: '$objname' },
//                 mn: { $first: '$mn' },
//                 status: { $first: '$status' }
//             }
//         }
//     ];
//     // const res = await ruleTableHandler.distinct(fieldFilterArr);
//     await ruleTableHandler.disconnect();
//     // console.log('ruleTableFunRes', resDelete);
//     console.log('ruleTableFunRes', res, res.length);
//     // console.log('ruleTableFunRes', res, resDelete, res.length);
// };
// ruleTableFun().then((item) => {
//     console.log('ruleTable', item);
// });

// //* 单元测试新
// async function mongoUnitTest() {
//     let ruleTableHandler = Container.get<CRuleTable>("规则库操作类");
//     ruleTableHandler.mongodb.conneConfig = ruletableConfig;
//     let ruleTableLocalHandler = Container.get<CRuleTableLocal>("规则数据表本地操作类");

//     ruleTableLocalHandler.file = ruletableFileConfig;
//     const ruleJson = ruleTableLocalHandler.patchExcelToJson();
//     // const ruleJson = this.ruleTableLocalHandler.excelTojson();
//     // return ruleJson;
//     // TODO: 2、存到规则库
//     //     let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

//     // let dataRes = factoryCollectorTempleData;
//     // if (dataRes.info.toLocaleLowerCase() === 'success') {
//     await ruleTableHandler.connect();
//     await ruleTableHandler.deleteAll();
//     await ruleTableHandler.add(ruleJson);
//     await ruleTableHandler.update({ ruleType: "恒值异常" }, { ruleType: "数据恒值" });
//     const ruletable = await ruleTableHandler.select(null, null);
//     await ruleTableHandler.disconnect();
//     return ruletable;
// }

// mongoUnitTest().then((item) => {
//     console.log("ruletable", item);
// });
