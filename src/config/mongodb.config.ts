/*
 * @Author: your name
 * @Date: 2021-08-25 15:17:14
 * @LastEditTime: 2021-09-14 20:16:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\mongodb.config.ts
 */
import { RuleStruct } from "./rule.config";
import { FactoryStruct } from "./factory.config";
import { AlarmStruct } from "./alarm.config";
import { ServerRequestStruct } from "./server-request.config";
const ip = "mongo-solid-pollution:27017";
const factoryConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Factory",
    schema: FactoryStruct
};

const ruletableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Ruletable",
    schema: RuleStruct
};
const alarmtableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Alarmtable",
    schema: AlarmStruct
};

const requesttableConfig = {
    ip: ip,
    datasename: "workCondition_subSystem",
    collectionname: "Requesttable",
    schema: ServerRequestStruct
};
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
export { factoryConfig, ruletableConfig, alarmtableConfig, requesttableConfig };

// export interface ImongodbConfig {
//     ip: string;
//     datasename: string;
//     collectionname: string;
//     schema: Object;
// }
