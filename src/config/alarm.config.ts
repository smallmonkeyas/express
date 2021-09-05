/*
 * @Author: your name
 * @Date: 2021-09-01 22:28:47
 * @LastEditTime: 2021-09-05 13:10:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\factory.config.ts
 */

export interface IAlarmBasicStruct {
    alarmObjname: string;
    // alarmObjDisplayName: string;
    // alarmObjDescription: string;
    alarmParamName: string;
    alarmParamDisplayName: string;
    alarmParamDescription: string;
    alarmProperityName: string;
    // alarmProperityDisplayName: string;
    alarmProperityDescription: string;
}
export interface IAlarmStruct {
    id?: number;
    objnameInclude: string;
    objnameDisplaynameInclude: string;
    epcode: string;
    factoryType: string;
    includeParamName: Array<string>;
    includeParamDisplayname: Array<string>;
    includeParamDescription: Array<string>;
    alarmObjname: string;
    alarmObjDisplayName: string;
    alarmObjDescription: string;
    alarmParamName: string;
    alarmParamDisplayName: string;
    alarmParamDescription: string;
    alarmProperityName: string;
    alarmProperityDisplayName: string;
    alarmProperityDescription: string;
    alarmType: number;
    alarmTypeDescription: string;
    alarmConfigParam: Array<string>;
    alarmConfigParamValue: Array<number>;
    enableStatus: boolean;
    enableConfigparam: string;
}
export const AlarmStruct = {
    id: Number,
    objnameInclude: { type: String },
    objnameDisplaynameInclude: { type: String },
    epcode: { type: String },
    factoryType: { type: String },
    includeParamName: [String],
    includeParamDisplayname: [String],
    includeParamDescription: [String],
    alarmObjname: { type: String },
    alarmObjDisplayName: { type: String },
    alarmObjDescription: { type: String },
    alarmParamName: { type: String },
    alarmParamDisplayName: { type: String },
    alarmParamDescription: { type: String },
    alarmProperityName: { type: String },
    alarmProperityDisplayName: { type: String },
    alarmProperityDescription: { type: String },
    alarmType: Number,
    alarmTypeDescription: { type: String },
    alarmConfigParam: [String],
    alarmConfigParamValue: [Number],
    enableStatus: Boolean,
    enableConfigparam: { type: String }
};

export const AlarmTypeDescConfig = [
    "数据缺失",
    "",
    "关联度异常",
    "数据恒值",
    "",
    "数采仪离线",
    "设备异常",
    "",
    "数据超范围",
    "去除率异常",
    "均值异常",
    "排放量异常"
];

export const AlarmTypeConfig = [1, 3, 4, 6, 7, 9, 10, 11, 12];
export const AlarmTypeDeprecated = [3, 4, 6, 7, 9, 10];
export const AlarmObjnameConfig = [
    "DataMiss",
    "",
    "AbnormalRelevance",
    "DataConstant",
    "",
    "DataAcquisitionOffline",
    "EquipmentAbnormal",
    "",
    "DataOutofRange",
    "AbnormalRemovalrate",
    "DayMeanAlarm",
    "EmissionAlarm"
];
