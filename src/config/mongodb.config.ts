/*
 * @Author: your name
 * @Date: 2021-08-25 15:17:14
 * @LastEditTime : 2021-12-20 00:47:53
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/config/mongodb.config.ts
 */
import { RuleStruct } from "./rule.config"
import { FactoryStruct } from "./factory.config"
import { AlarmStruct } from "./alarm.config"
import { ServerRequestStruct } from "./server-request.config"
import { HistorySuposStruct } from "./history.config"
import { FactorStruct } from "./factor.config"
// const ip = "localhost:27017"
const ip = "localhost:27017"
// const ip = "mongo-solid-pollution:27017"
const factoryConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Factory",
    schema: FactoryStruct
}

const ruletableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Ruletable",
    schema: RuleStruct
}
const alarmtableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Alarmtable",
    schema: AlarmStruct
}

const requesttableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Requesttable",
    schema: ServerRequestStruct
}

const factortableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Factortable",
    schema: FactorStruct
}

const suposHistorytableConfig = {
    ip: ip,
    datasename: "historyDB",
    collectionname: "Historytable",
    schema: HistorySuposStruct
}

// {
//     id: { String, Number },
//     name: { type: String },
//     content: { type: String },
//     paramInclude: { type: String },
//     paramNameInclude: { type: String },
//     factoryCatatory: { type: String },
//     ruleType: { type: String },
//     enabled: {},
//     creatTime: { type: String },
//     epcode: { type: String },
//     ruleConfigParam: { type: String },
//     objectName: { type: String },
//     flagParam: { type: String },
//     SetValue: { String, Number },
//     SetFlagValue: { String, Number }
// }
export {
    factoryConfig,
    ruletableConfig,
    alarmtableConfig,
    requesttableConfig,
    factortableConfig,
    suposHistorytableConfig
}

// export interface ImongodbConfig {
//     ip: string;
//     datasename: string;
//     collectionname: string;
//     schema: Object;
// }
