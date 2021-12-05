/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:35
 * @LastEditTime : 2021-12-05 22:46:06
 * @LastEditors  : Chengxin Sun
 * @Description: 提取规则库中每个规则的信息：企业对象实例、企业名称、企业类型、规则内容、企业编码、报警类型编号、报警类型描述、报警涉及参数以及报警配置参数等信息
 * @FilePath     : /express/src/module/rule.ts
 */
import { IRuleStruct, AlarmTypeConfig, AlarmTypeDescConfig, AlarmTypeDeprecated } from "../config"
import { Container, Service, Inject } from "typedi"
@Service("单规则信息")
export class CSingleRuleInfo {
    rule!: IRuleStruct
    // alarmType!: string;
    getObjnameInclude(): string {
        return this.rule.objectName.toLocaleUpperCase().replace(/ /g, "")
    }
    getRuleConfigObjName(): string {
        return this.rule.RuleConfigObjName.replace(/ /g, "")
    }
    getFactoryName(): string {
        return this.rule.name
    }
    getFactoryType(): string {
        return this.rule.factoryCatatory
    }
    getRuleContent(): string {
        return this.rule.content || ""
    }
    getEpcode(): string {
        return String(this.rule.epcode).toLocaleUpperCase()
    }
    getAlarmtype(): number {
        let alarmType = AlarmTypeDescConfig.indexOf(this.rule.ruleType.replace(/ /g, "")) + 1
        let alarmTypeIncluded = AlarmTypeConfig.includes(alarmType)
        // console.log(alarmType, alarmTypeIncluded, this.rule.ruleType)
        if (!alarmTypeIncluded) {
            throw new Error("报警类型无效")
        }
        return alarmType
    }
    getAlarmtypeDescription(): string {
        return this.rule.ruleType || ""
    }
    getParamNameInclude(): Array<string> {
        let paramNameInclude: string = this.rule.paramNameInclude || ""
        paramNameInclude = paramNameInclude.toLocaleUpperCase()
        return paramNameInclude
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,]{1,}/g, ",")
            .split(/,/)
    }
    getParamDescInclude(): Array<string> {
        let paramDescInclude: string = this.rule.paramInclude || ""
        return paramDescInclude
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,、]{1,}/g, ",")
            .split(/,/)
    }
    getConfigParam(): Array<string> {
        let ruleConfigParam: string = this.rule.ruleConfigParam || ""
        return ruleConfigParam
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,]{1,}/g, ",")
            .split(/,/)
    }
    getConfigParamDefaultValue(): Array<number> {
        let configParamDefaultValue: string = this.rule.SetValue || ""
        let configParamDefaultValueStrArr = configParamDefaultValue
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,]{1,}/g, ",")
            .split(/,/)
        // let configParamDefaultValueNumArr: Array<number> = [];
        // configParamDefaultValueStrArr.forEach((item) => {
        //     configParamDefaultValueNumArr.push(parseFloat(item));
        // });
        let configParamDefaultValueNumArr = configParamDefaultValueStrArr.map(Number)
        return configParamDefaultValueNumArr
    }
    getFlagParam(): string {
        let ruleConfigParam: string = this.rule.flagParam || ""
        return ruleConfigParam.replace(/( )|,{1,}$/g, "").replace(/[，,]{1,}/g, ",")
    }
    getFlagParamValue(): boolean {
        let flagParamDefaultValue = String(this.rule.SetFlagValue) || ""
        let alarmType = this.getAlarmtype()
        let hasNullParam = this.getParamNameInclude()
            .join("_")
            .match(/(x{2,})|(X{2,})/g)

        let flag = !AlarmTypeDeprecated.includes(alarmType) && !hasNullParam
        // if (alarmType === 1) {
        //     console.log("alarmType");
        // }
        // let flagValueRes =
        return (flagParamDefaultValue === "1" || "是") && flag ? true : false
        // return flagParamDefaultValue;
    }
}
