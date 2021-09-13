/*
 * @Author: your name
 * @Date: 2021-09-10 10:10:18
 * @LastEditTime: 2021-09-13 15:45:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\server-request.config.ts
 */

export interface IServerRequestStruct {
    id?: string;
    objname: string;
    // objnameDisplaynameInclude: string;
    // epcode: string;
    // factoryType: string;
    propname: string;
    propexist: boolean;
    // includeParamDisplayname: Array<string>;
    // includeParamDescription: Array<string>;
    // alarmObjname: string;
    // alarmObjDisplayName: string;
    // alarmObjDescription: string;
    // alarmParamName: string;
    // alarmParamDisplayName: string;
    // alarmParamDescription: string;
    // alarmProperityName: string;
    // alarmProperityDisplayName: string;
    // alarmProperityDescription: string;
    // alarmType: number;
    // alarmTypeDescription: string;
    // alarmConfigParam: Array<string>;
    // alarmConfigParamValue: Array<number>;
    // enableStatus: boolean;
    // enableConfigparam: string;
    name: string;
    datamode: string;
    mode: string;
    requesttype: string;
    mark: string;
    alarmtype: string;
    index: string;
    // value: any;
    value: Array<any>;
    defaultvalue: string;
    convertvalue: string;
}
// export const RuleStruct = {
//     id: {},
//     name: { type: String },
//     content: { type: String },
//     paramInclude: { type: String },
//     paramNameInclude: { type: String },
//     factoryCatatory: { type: String },
//     ruleType: {},
//     enabled: {},
//     creatTime: { type: String },
//     epcode: {},
//     ruleConfigParam: { type: String },
//     objectName: { type: String },
//     flagParam: { type: String },
//     SetValue: {},
//     SetFlagValue: {}
// };
export const ServerRequestStruct = {
    id: String,
    objname: { type: String },
    // objnameDisplaynameInclude: { type: String },
    // epcode: { type: String },
    // factoryType: { type: String },
    propname: { type: String },
    propexist: { type: Boolean },
    // includeParamDisplayname: [String],
    // includeParamDescription: [String],
    // alarmObjname: { type: String },
    // alarmObjDisplayName: { type: String },
    // alarmObjDescription: { type: String },
    // alarmParamName: { type: String },
    // alarmParamDisplayName: { type: String },
    // alarmParamDescription: { type: String },
    // alarmProperityName: { type: String },
    // alarmProperityDisplayName: { type: String },
    // alarmProperityDescription: { type: String },
    // alarmType: Number,
    // alarmTypeDescription: { type: String },
    // alarmConfigParam: [String],
    // alarmConfigParamValue: [Number],
    // enableStatus: Boolean,
    // enableConfigparam: { type: String }
    name: { type: String },
    datamode: { type: String },
    mode: { type: String },
    requesttype: { type: String },
    mark: { type: String },
    alarmtype: { type: String },
    index: { type: String },
    // value: Number
    value: [
        //     // {
        //     //     name: String,
        //     //     value: String,
        //     //     unit: String,
        //     //     time: String,
        //     //     status: String,
        //     //     description: String
        //     // }
    ],
    defaultvalue: { type: String },
    convertvalue: { type: String }
};
