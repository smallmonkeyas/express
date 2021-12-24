/*
 * @Author       : Chengxin Sun
 * @Date         : 2021-12-20 00:30:34
 * @LastEditors  : Chengxin Sun
 * @LastEditTime : 2021-12-21 20:48:07
 * @Description  : Do not edit
 * @FilePath     : /express/src/config/factor.config.ts
 * @github-name  : scxmonkeyas
 */

import { toString } from "cheerio/lib/api/manipulation"

export interface IFactorStruct {
    id: number | string
    objname: string
    // displayname: string
    description: string
    epcode: string | number
    remark: string
    name: string
    hj212mn: string
    datatype: string
    unit: string
    h: number | string
    l: number | string
    ah: number | string
    al: number | string
    keyparam: boolean
    filterrule: number | string
    plid: number | string
    ppid: number | string
    pdid: number | string
    //
    displayname: string
    type: string
    period: string
}
export const FactorStruct = {
    id: { type: Number },
    objname: { type: String },
    description: { type: String },
    epcode: { type: String },
    remark: { type: String },
    name: { type: String },
    hj212mn: { type: String },
    datatype: { type: String },
    unit: { type: String },
    h: { type: Number },
    l: { type: Number },
    ah: { type: Number },
    al: { type: Number },
    keyparam: { type: Boolean },
    filterrule: { type: Number },
    plid: { type: Number },
    ppid: { type: Number },
    pdid: { type: Number },
    //
    displayname: { type: String },
    type: { type: String },
    period: { type: String }
}
