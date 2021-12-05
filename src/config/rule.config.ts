/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-09-01 21:39:41
 * @LastEditTime : 2021-12-04 23:45:25
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/config/rule.config.ts
 */

export interface IRuleStruct {
    id: number // 修改string为number
    name: string
    content: string
    paramInclude: string
    paramNameInclude: string
    factoryCatatory: string
    ruleType: string
    enabled: string
    creatTime: string
    epcode: string
    ruleConfigParam: string
    objectName: string
    flagParam: string
    SetValue: string
    SetFlagValue: string
    RuleConfigObjName: string // 新增：规则库配置参数所在的对象实例别名
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
// let counter = 1
export const RuleStruct = {
    id: Number, // 修改String为Number
    // id: String,
    // id_number: {
    //     type: Number,
    //     default: () => {
    //         counter++
    //     }
    // },
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
    SetFlagValue: String,
    RuleConfigObjName: { type: String } // 新增：规则库配置参数所在的对象实例别名
}
