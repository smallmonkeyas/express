/*
 * @Author: your name
 * @Date: 2021-09-01 21:39:41
 * @LastEditTime: 2021-09-02 10:17:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\rule.config.ts
 */

export interface IRuleStruct {
    id: string;
    name: string;
    content: string;
    paramInclude: string;
    paramNameInclude: string;
    factoryCatatory: string;
    ruleType: string;
    enabled: string;
    creatTime: string;
    epcode: string;
    ruleConfigParam: string;
    objectName: string;
    flagParam: string;
    SetValue: string;
    SetFlagValue: string;
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
export const RuleStruct = {
    id: String,
    name: { type: String },
    content: { type: String },
    paramInclude: { type: String },
    paramNameInclude: { type: String },
    factoryCatatory: { type: String },
    ruleType: String,
    enabled: String,
    creatTime: { type: String },
    epcode: String,
    ruleConfigParam: { type: String },
    objectName: { type: String },
    flagParam: { type: String },
    SetValue: String,
    SetFlagValue: String
};
