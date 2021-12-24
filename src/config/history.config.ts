/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-19 23:44:55
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2021-12-21 13:12:52
 * @Description  : Do not edit
 * @FilePath     : /express/src/config/history.config.ts
 * @github-name  : scxmonkeyas
 */
import moment from "moment"
export interface IHistorySuposStruct {
    time: string | number
    epcode: string | number
    hj212mn: string | number
    objname: string
    name: string
    description: string
    unit: string
    value: number
    numberValue: number
    status: string | number
    // !
    displayname: string
    type: string
    period: string
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
function convertTime(val: string) {
    let time = moment(val).format("YYYY-MM-DD HH:mm:ss")
    console.log("time", time)
    return time
}
export const HistorySuposStruct = {
    // time: { type: Date },
    time: { type: Date, get: convertTime },
    epcode: { type: String },
    hj212mn: { type: String },
    objname: { type: String },
    factorySite: { type: String },
    siteType: { type: String },
    sitePeriod: { type: String },
    name: { type: String },
    description: { type: String },
    unit: { type: String },
    value: { type: Number },
    numberValue: { type: Number },
    status: { type: String },
    // !
    displayname: { type: String },
    type: { type: String },
    period: { type: String }
}
// console.log(moment("2021-11-26T07:10:40.000Z").format("YYYY-MM-DD HH:mm:ss"))
