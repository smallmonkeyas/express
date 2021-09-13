/*
 * @Author: your name
 * @Date: 2021-08-25 15:07:35
 * @LastEditTime: 2021-09-10 18:32:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\rule.ts
 */
import { IRuleStruct, AlarmTypeConfig, AlarmTypeDescConfig, AlarmTypeDeprecated } from "../config";
import { Container, Service, Inject } from "typedi";
@Service("单规则信息")
export class CSingleRuleInfo {
    rule!: IRuleStruct;
    // alarmType!: string;
    getObjnameInclude(): string {
        return this.rule.objectName.toLocaleUpperCase();
    }
    getFactoryName(): string {
        return this.rule.name;
    }
    getFactoryType(): string {
        return this.rule.factoryCatatory;
    }
    getRuleContent(): string {
        return this.rule.content || "";
    }
    getEpcode(): string {
        return String(this.rule.epcode).toLocaleUpperCase();
    }
    getAlarmtype(): number {
        let alarmType = AlarmTypeDescConfig.indexOf(this.rule.ruleType) + 1;
        let alarmTypeIncluded = AlarmTypeConfig.includes(alarmType);

        if (!alarmTypeIncluded) {
            throw new Error("报警类型无效");
        }
        return alarmType;
    }
    getAlarmtypeDescription(): string {
        return this.rule.ruleType || "";
    }
    getParamNameInclude(): Array<string> {
        let paramNameInclude: string = this.rule.paramNameInclude || "";
        paramNameInclude = paramNameInclude.toLocaleUpperCase();
        return paramNameInclude
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,]{1,}/g, ",")
            .split(/,/);
    }
    getParamDescInclude(): Array<string> {
        let paramDescInclude: string = this.rule.paramInclude || "";
        return paramDescInclude
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,、]{1,}/g, ",")
            .split(/,/);
    }
    getConfigParam(): Array<string> {
        let ruleConfigParam: string = this.rule.ruleConfigParam || "";
        return ruleConfigParam
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,]{1,}/g, ",")
            .split(/,/);
    }
    getConfigParamDefaultValue(): Array<number> {
        let configParamDefaultValue: string = this.rule.SetValue || "";
        let configParamDefaultValueStrArr = configParamDefaultValue
            .replace(/( )|,{1,}$/g, "")
            .replace(/[，,]{1,}/g, ",")
            .split(/,/);
        // let configParamDefaultValueNumArr: Array<number> = [];
        // configParamDefaultValueStrArr.forEach((item) => {
        //     configParamDefaultValueNumArr.push(parseFloat(item));
        // });
        let configParamDefaultValueNumArr = configParamDefaultValueStrArr.map(Number);
        return configParamDefaultValueNumArr;
    }
    getFlagParam(): string {
        let ruleConfigParam: string = this.rule.flagParam || "";
        return ruleConfigParam.replace(/( )|,{1,}$/g, "").replace(/[，,]{1,}/g, ",");
    }
    getFlagParamValue(): boolean {
        let flagParamDefaultValue = String(this.rule.SetFlagValue) || "";
        let alarmType = this.getAlarmtype();
        let hasNullParam = this.getParamNameInclude()
            .join("_")
            .match(/(x{2,})|(X{2,})/g);

        let flag = !AlarmTypeDeprecated.includes(alarmType) && !hasNullParam;
        // if (alarmType === 1) {
        //     console.log("alarmType");
        // }
        // let flagValueRes =
        return (flagParamDefaultValue === "1" || "是") && flag ? true : false;
        // return flagParamDefaultValue;
    }
}
