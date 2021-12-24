/* eslint-disable space-unary-ops */
/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:09
 * @LastEditTime : 2021-12-20 12:19:38
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/module/alarmtable.ts
 */
import "reflect-metadata"
// import mongoose from 'mongoose';

import { Container, Service, Inject } from "typedi"
import { IDatabase, IMongDB, CMongoDB, CMongoose, CFileOperate, CTable } from "../dao"
import {
    factoryConfig,
    ruletableConfig,
    ImongodbConfig,
    collectorUrlConfig,
    IFile,
    IVendorConfig,
    ruletableFileConfig,
    GetPropertyValueNetConfig,
    IRuleStruct,
    IAlarmStruct,
    alarmtableConfig,
    AlarmObjnameConfig,
    AlarmTypeDescConfig,
    AlarmTypeDeprecated
} from "../config"
import { CSingleRuleInfo } from "./rule"
import { CRuleTable } from "./ruletable"
import { CVendorData, IVendorData } from "./vendor"
import { CSupOSData } from "./supos"
import { User } from "./user"
import { request, system, XLSX_JSON, fs } from "../../modulejs"
import { factoryCollectorTempleData } from "../respository/factory/collector"

Container.import([CFileOperate, CSingleRuleInfo, CRuleTable, User])
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
@Service("报警配置表记录（行）生成任务")
export class AlarmTableRecordGenerateTask {
    @Inject("单规则信息")
    singleRule!: CSingleRuleInfo
    ruleRecord!: IRuleStruct
    singleAlarm!: IAlarmStruct
    @Inject("supOS数据接口")
    plantInterface!: CSupOSData
    getDefaultAlarmTableRecord(): void {
        let objnameInclude = this.singleRule.getObjnameInclude(),
            ruleConfigObjname = this.singleRule.getRuleConfigObjName(),
            factoryName = this.singleRule.getFactoryName(),
            epcode = this.singleRule.getEpcode(),
            factoryType = this.singleRule.getFactoryType(),
            includeParamName = this.singleRule.getParamNameInclude(),
            includeParamDescription = this.singleRule.getParamDescInclude(),
            alarmType = this.singleRule.getAlarmtype(),
            alarmTypeDescription = this.singleRule.getAlarmtypeDescription(),
            alarmCondition = this.singleRule.getRuleContent(),
            alarmConfigParam = this.singleRule.getConfigParam(),
            alarmConfigParamValue = this.singleRule.getConfigParamDefaultValue(),
            enableConfigparam = this.singleRule.getFlagParam(),
            enableStatus = this.singleRule.getFlagParamValue(),
            alarmObjname = AlarmObjnameConfig[alarmType - 1],
            alarmObjDisplayName = `异常类型_${AlarmTypeDescConfig[alarmType - 1]}`,
            alarmObjDescription = AlarmTypeDescConfig[alarmType - 1],
            alarmParamName = `${objnameInclude}__${includeParamName.join("__")}`,
            alarmParamDisplayName = `${factoryName}_涉及参数_${includeParamDescription.join("__")}`,
            alarmParamDescription = `企业:${factoryName};涉及参数:${includeParamDescription.join(
                "_"
            )};报警产生条件:${alarmCondition};使能配置参数:${enableConfigparam};报警条件：属性值为1则触发报警`,
            alarmProperityName = `A${epcode}_${alarmType}_xxx_${includeParamName.join("_")}`,
            alarmProperityDisplayName = `配置参数_${alarmConfigParam.join("__")}`,
            alarmProperityDescription = `${AlarmTypeDescConfig[alarmType - 1]}`

        this.singleAlarm = {
            // id: this.tableIndex++,
            objnameInclude: objnameInclude,
            ruleConfigObjname: ruleConfigObjname,
            objnameDisplaynameInclude: factoryName,
            epcode: epcode,
            factoryType: factoryType,
            includeParamName: includeParamName,
            includeParamDisplayname: includeParamDescription,
            includeParamDescription: includeParamDescription,
            alarmType: alarmType,
            alarmTypeDescription: alarmTypeDescription,
            alarmConfigParam: alarmConfigParam,
            alarmConfigParamValue: alarmConfigParamValue,
            enableConfigparam: enableConfigparam,
            enableStatus: enableStatus,
            alarmObjname: alarmObjname,
            alarmObjDisplayName: alarmObjDisplayName,
            alarmObjDescription: alarmObjDescription,
            alarmParamName: alarmParamName,
            alarmParamDisplayName: alarmParamDisplayName,
            alarmParamDescription: alarmParamDescription,
            alarmProperityName: alarmProperityName,
            alarmProperityDisplayName: alarmProperityDisplayName,
            alarmProperityDescription: alarmProperityDescription
        }
    }
    // TODO:读取配置参数对应的对象属性是否有变化(若没值，则按默认值来)，若有变化，则更新
    async getConfigParamValue(): Promise<Array<number>> {
        const { objnameInclude, alarmConfigParam, alarmConfigParamValue, ruleConfigObjname } =
            this.singleAlarm
        let configParamValue: Array<number> = []
        for (let propName of alarmConfigParam) {
            this.plantInterface.supos = GetPropertyValueNetConfig(ruleConfigObjname, propName)
            let res: { result: number; [prop: string]: any } = await this.plantInterface.post()

            configParamValue.push(res.result)
        }
        // alarmConfigParam.forEach(async (propName, index) => {
        //     this.plantInterface.supos = GetPropertyValueNetConfig(objnameInclude, propName);
        //     let res: { result: number; [prop: string]: any } = await this.plantInterface.get();

        //     configParamValue.push(res.result);
        // });

        let isNumber = /(\d+,\d+)|(^\d.*\d$)/g.test(configParamValue.toString())
        if (!isNumber) {
            return alarmConfigParamValue
        }
        return configParamValue
    }
    async getConfigFlagValue(): Promise<any> {
        const { objnameInclude, enableConfigparam, enableStatus, ruleConfigObjname } =
            this.singleAlarm
        let configflagValue: number
        this.plantInterface.supos = GetPropertyValueNetConfig(ruleConfigObjname, enableConfigparam)
        // this.plantInterface.supos = GetPropertyValueNetConfig(objnameInclude, enableConfigparam)
        let res: { result: number; [prop: string]: any } = await this.plantInterface.post()

        configflagValue = res.result
        if (!configflagValue) {
            return enableStatus
        }
        return configflagValue === 1 ? true : false
    }
    async getAlarmTableRecord() {
        this.singleRule.rule = this.ruleRecord
        this.getDefaultAlarmTableRecord()
        this.singleAlarm.alarmConfigParamValue = await this.getConfigParamValue()
        this.singleAlarm.enableStatus = await this.getConfigFlagValue()
        return this.singleAlarm
    }
}

@Service("报警配置库")
export class CAlarmTable extends CTable {}
//* 报警配置表生成(生产者)
@Service("报警配置表生成任务类")
export class CAlarmTableGenerateTask {
    // @Inject('单规则信息')
    // singleRule!: CSingleRuleInfo;
    // @Inject("规则库操作类")
    // ruleTableOperate!: CRuleTable;
    // singleAlarm!: IAlarmStruct;
    // tableIndex: number = 1;
    ruletable!: Array<IRuleStruct>
    table: Array<IAlarmStruct> = []
    @Inject("报警配置表记录（行）生成任务")
    tableRecordTask!: AlarmTableRecordGenerateTask
    async getAlarmTable(): Promise<any> {
        // let ruleTableHandler = Container.get<CRuleTable>('规则库操作类');
        // this.ruleTableOperate.mongodb.conneConfig = ruletableConfig;
        // const resConnect = await this.ruleTableOperate.connect();
        // const ruletableBasic = await this.ruleTableOperate.update(
        //     { ruleType: "恒值异常" },
        //     { ruleType: "数据恒值" }
        // );
        // const ruletable = await this.ruleTableOperate.select(null, null);
        // const disconnectRes = await this.ruleTableOperate.disconnect();
        // console.log("disconnectRes", disconnectRes);
        let ruletable = this.ruletable
        if (Array.isArray(ruletable)) {
            let tableRecordIndex: number = 1
            for (let ruleRecord of ruletable) {
                this.tableRecordTask.ruleRecord = ruleRecord
                let alarmRecord = await this.tableRecordTask.getAlarmTableRecord()
                alarmRecord.id = tableRecordIndex++
                this.table.push(alarmRecord)
            }
        }

        // return this.table;
        // console.log(this.table);
        // console.log('ruletable', ruletableBasic);
        // console.log('ruletable', ruletable, ruletableBasic);
    }
}

// class CRuleTableLocal {
//     file: IFile;
//     fileContent: any;
//     @Inject('本地文件操作操作类')
//     operateHandler!: CFileOperate;
//     constructor(file: IFile) {
//         this.file = file;
//     }
//     readFile(): string {
//         let fileDirectory = `${this.file.filePath}\\${this.file.fileName}.${this.file.fileExtension}`;
//         let fileStr = fs.readFileSync(fileDirectory);
//         return fileStr;
//     }
//     writeFile(): void {
//         let fileDirectory = `${this.file.filePath}\\${this.file.fileName}.${this.file.fileExtension}`;
//         this.operateHandler.file = this.file;
//         this.operateHandler.fileContent = this.fileContent;
//         this.operateHandler.writeFile();
//     }
//     excelTojson(): Array<object> {
//         let pathFileDir = this.file.filePath,
//             fileName = this.file.fileName;
//         return XLSX_JSON.excelToJson(pathFileDir, fileName);
//     }
// }

// ? 文件测试
// let ruleTableHandler = Container.get(CRuleTableLocal);

// ruleTableHandler.file = ruletableFileConfig;
// const excelTojson = ruleTableHandler.excelTojson();

// let fileStr = ruleTableHandler.readFile();
// ruletableFileConfig.fileName = '数据输出';
// ruleTableHandler.file = ruletableFileConfig;

// ruleTableHandler.fileContent = fileStr;
// ruleTableHandler.writeFile();
// console.log(fileStr);
// console.log(excelTojson);
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

// ?报警配置库-单元测试
const alarmTableFun = async function (alarmJson: any): Promise<any> {
    let alarmTableHandler = Container.get<CAlarmTable>("报警配置库")
    alarmTableHandler.conneConfig = alarmtableConfig
    // alarmTableHandler.mongodb.conneConfig = alarmtableConfig
    // let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

    // ruleTableLocalHandler.file = ruletableFileConfig;
    // const ruleJson = ruleTableLocalHandler.excelTojson();

    // let dataRes = factoryCollectorTempleData;
    // if (dataRes.info.toLocaleLowerCase() === 'success') {
    const resConnect = await alarmTableHandler.connect()
    const resDelete = await alarmTableHandler.deleteAll()
    await alarmTableHandler.add(alarmJson)
    const res = await alarmTableHandler.select(null, null)
    // const res = await alarmTableHandler.select({ epcode: '3210230203000304' }, [
    //     'objname',
    //     'epcode'
    // ]);
    let fieldFilterArr = [
        // { $sort: { id: 1, status: -1 } }
        // {
        //     $match: {
        //         typeNum: {
        //             $gt: 1,
        //             $lte: 2
        //         }
        //     }
        // },
        {
            $group: {
                _id: "$epcode",
                typeNum: { $sum: 1 },
                id: { $first: "$id" },
                objname: { $first: "$objname" },
                mn: { $first: "$mn" },
                status: { $first: "$status" }
            }
        }
    ]
    // const res = await ruleTableHandler.distinct(fieldFilterArr);
    await alarmTableHandler.disconnect()
    // console.log('alarmTableFunRes', resDelete);
    console.log("alarmTableFunRes", res, res.length)
    // console.log('alarmTableFunRes', res, resDelete, res.length);
    return res
}
// ruleTableFun().then((item) => {
//     console.log('ruleTable', item);
// });

// ? 报警配置库测试

const alarmTableTest = async function () {
    let user = Container.get<User>("用户")
    await user.login()
    let alarmTableHandler = Container.get<CAlarmTableGenerateTask>("报警配置表生成任务类")
    let ruleTableHandler = Container.get<CRuleTable>("规则库操作类")
    ruleTableHandler.conneConfig = ruletableConfig
    // ruleTableHandler.mongodb.conneConfig = ruletableConfig
    await ruleTableHandler.connect()
    const ruletable = await ruleTableHandler.select(null, null)
    await ruleTableHandler.disconnect()
    alarmTableHandler.ruletable = ruletable
    await alarmTableHandler.getAlarmTable()
    let alarmTable = alarmTableHandler.table
    // console.log("alarmTable", alarmTable)
    return await alarmTableFun(alarmTable)
    // console.log('alarmTableFun', alarmTableHandler.table);
}

// alarmTableTest().then((item) => {
//     console.log(item)
// })
