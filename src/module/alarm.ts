/*
 * @Author: your name
 * @Date: 2021-09-02 08:28:45
 * @LastEditTime: 2021-09-03 17:07:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\alarm.ts
 */

import { CDataMiss, CMeanAlarm, CEmissionAlarm } from './data-anamaly';
import { Container, Service, Inject } from 'typedi';
import 'reflect-metadata';
import {
    IAlarmStruct,
    SetPropertyValueNetConfig,
    GetPropertyValueNetConfig,
    CreatObjectConfig,
    CreatProperityConfig
} from '../config';
import { CSupOSData } from './supos';

//* supos工业操作系统平台上报警对象实例
@Service('supOS平台报警实例与属性设置')
class CPlatformAlarmObject {
    @Inject('supOS数据接口')
    plantInterface!: CSupOSData;
    alarmInfo!: IAlarmStruct;
    alarmSetValue!: number;
    // alarmGetValue
    //* 设置属性值
    async setPropertyValue() {
        const {
            alarmObjname,
            alarmObjDisplayName,
            alarmObjDescription,
            alarmParamName,
            alarmParamDisplayName,
            alarmParamDescription
        } = this.alarmInfo;
        this.plantInterface.supos = SetPropertyValueNetConfig(
            alarmObjname,
            alarmObjDisplayName,
            alarmObjDescription,
            alarmParamName,
            alarmParamDisplayName,
            alarmParamDescription,
            this.alarmSetValue
        );
        return await this.plantInterface.post();
    }
    //* 创建对象实例
    creatObject() {
        const { alarmObjname, alarmObjDisplayName, alarmObjDescription } = this.alarmInfo;
        this.plantInterface.supos = CreatObjectConfig(
            alarmObjname,
            alarmObjDisplayName,
            alarmObjDescription
        );
        this.plantInterface.post();
    }
    //* 创建对象属性
    creatProperityWithAlarm() {
        const {
            alarmObjname,
            alarmObjDisplayName,
            alarmObjDescription,
            alarmParamName,
            alarmParamDisplayName,
            alarmParamDescription,
            alarmProperityName,
            alarmProperityDisplayName,
            alarmProperityDescription
        } = this.alarmInfo;
        this.plantInterface.supos = CreatProperityConfig(
            alarmObjname,
            alarmObjDisplayName,
            alarmObjDescription,
            alarmParamName,
            alarmParamDisplayName,
            alarmParamDescription,
            this.alarmSetValue,
            alarmProperityName,
            alarmProperityDisplayName,
            alarmProperityDescription
        );
        this.plantInterface.post();
    }
}

Container.import([CDataMiss, CMeanAlarm, CEmissionAlarm, CSupOSData]);
// TODO: 已知报警库单条报警配置——>判断是否使能->判断报警类型->根据报警类型和报警配置选择报警判断算法->报警输出

class CAlarm {}

interface IAlarmTask {
    alarmInfo: IAlarmStruct;
    // dataAnamalyHandler: any;
    platformAlarmObject: CPlatformAlarmObject;
    exec(): void;
}
@Service('数据缺失设置报警任务')
class CDataMissAlarmTask implements IAlarmTask {
    alarmInfo!: IAlarmStruct;
    @Inject('连续10分钟无数据或值为0')
    dataMissHandler!: CDataMiss;
    @Inject('supOS平台报警实例与属性设置')
    platformAlarmObject!: CPlatformAlarmObject;
    async exec(): Promise<any> {
        if (this.alarmInfo.enableStatus) {
            return await this.setDataMissAlarm();
        } else {
            return false;
        }
    }
    async setDataMissAlarm(): Promise<any> {
        this.dataMissHandler.epcode = this.alarmInfo.epcode;
        this.dataMissHandler.configLimitValue = Number(this.alarmInfo.alarmConfigParamValue);
        this.dataMissHandler.includeParam = String(this.alarmInfo.includeParamName);
        let alarmSetValue = await this.dataMissHandler.getDataMissAlarm();
        this.platformAlarmObject.alarmInfo = this.alarmInfo;
        this.platformAlarmObject.alarmSetValue = alarmSetValue;
        return await this.platformAlarmObject.setPropertyValue();
    }
}
@Service('均值异常设置报警任务')
class CMeanAbnormalAlarmTask implements IAlarmTask {
    alarmInfo!: IAlarmStruct;
    @Inject('日数据不等于小时数据汇总')
    meanAlarmHandler!: CMeanAlarm;
    @Inject('supOS平台报警实例与属性设置')
    platformAlarmObject!: CPlatformAlarmObject;
    async exec(): Promise<any> {
        if (this.alarmInfo.enableStatus) {
            return await this.setMeanAlarm();
        } else {
            return false;
        }
    }
    async setMeanAlarm(): Promise<any> {
        // this.meanAlarmHandler.epcode = this.alarmInfo.epcode;
        this.meanAlarmHandler.configLimitValue = Number(this.alarmInfo.alarmConfigParamValue);
        this.meanAlarmHandler.includeParam = String(this.alarmInfo.includeParamName);

        let alarmSetValue = await this.meanAlarmHandler.getMeanAlarm();

        this.platformAlarmObject.alarmInfo = this.alarmInfo;
        this.platformAlarmObject.alarmSetValue = alarmSetValue;
        return await this.platformAlarmObject.setPropertyValue();
    }
}
@Service('排放量异常设置报警任务')
class CEmissionAbnormalAlarmTask implements IAlarmTask {
    alarmInfo!: IAlarmStruct;
    @Inject('排放量不等于浓度乘以流量')
    emissionAlarmHandler!: CEmissionAlarm;
    @Inject('supOS平台报警实例与属性设置')
    platformAlarmObject!: CPlatformAlarmObject;
    async exec(): Promise<any> {
        if (this.alarmInfo.enableStatus) {
            return await this.setEmissionAlarm();
        } else {
            return false;
        }
    }
    async setEmissionAlarm(): Promise<any> {
        // this.meanAlarmHandler.epcode = this.alarmInfo.epcode;
        this.emissionAlarmHandler.configLimitValue = Number(this.alarmInfo.alarmConfigParamValue);
        this.emissionAlarmHandler.includeEmissParam = this.alarmInfo.includeParamName[0];
        this.emissionAlarmHandler.includeFlowParam = this.alarmInfo.includeParamName[1];

        let alarmSetValue = await this.emissionAlarmHandler.getEmissAlarm();

        this.platformAlarmObject.alarmInfo = this.alarmInfo;
        this.platformAlarmObject.alarmSetValue = alarmSetValue;
        return await this.platformAlarmObject.setPropertyValue();
    }
}

// @Service('单报警执行')
// class CSingleAlarmTask {
//     alarmInfo!: IAlarmStruct;
//     @Inject('连续10分钟无数据或值为0')
//     dataMissHandler!: CDataMiss;
//     @Inject('日数据不等于小时数据汇总')
//     meanAlarmHandler!: CMeanAlarm;
//     @Inject('排放量不等于浓度乘以流量')
//     emissionAlarmHandler!: CEmissionAlarm;
//     @Inject('supOS平台报警实例与属性设置')
//     platformAlarmObject!: CPlatformAlarmObject;
//     exec() {
//         if (this.alarmInfo.enableStatus) {
//             switch (this.alarmInfo.alarmType) {
//                 case 1:
//                     this.setDataMissAlarm();
//                     break;
//                 case 11:
//                     this.setMeanAlarm();
//                     break;
//                 case 12:
//                     this.setEmissionAlarm();
//             }
//         }
//     }

//     async setDataMissAlarm(): Promise<any> {
//         this.dataMissHandler.epcode = this.alarmInfo.epcode;
//         this.dataMissHandler.configLimitValue = Number(this.alarmInfo.alarmConfigParamValue);
//         this.dataMissHandler.includeParam = String(this.alarmInfo.includeParamName);
//         let alarmSetValue = await this.dataMissHandler.getDataMissAlarm();

//         this.platformAlarmObject.alarmInfo = this.alarmInfo;
//         this.platformAlarmObject.alarmSetValue = alarmSetValue;
//         return await this.platformAlarmObject.setPropertyValue();
//     }
//     async setMeanAlarm(): Promise<any> {
//         // this.meanAlarmHandler.epcode = this.alarmInfo.epcode;
//         this.meanAlarmHandler.configLimitValue = Number(this.alarmInfo.alarmConfigParamValue);
//         this.meanAlarmHandler.includeParam = String(this.alarmInfo.includeParamName);

//         let alarmSetValue = await this.meanAlarmHandler.getMeanAlarm();

//         this.platformAlarmObject.alarmInfo = this.alarmInfo;
//         this.platformAlarmObject.alarmSetValue = alarmSetValue;
//         return await this.platformAlarmObject.setPropertyValue();
//     }
//     async setEmissionAlarm(): Promise<any> {
//         // this.meanAlarmHandler.epcode = this.alarmInfo.epcode;
//         this.emissionAlarmHandler.configLimitValue = Number(this.alarmInfo.alarmConfigParamValue);
//         this.emissionAlarmHandler.includeEmissParam = this.alarmInfo.includeParamName[0];
//         this.emissionAlarmHandler.includeFlowParam = this.alarmInfo.includeParamName[1];

//         let alarmSetValue = await this.emissionAlarmHandler.getEmissAlarm();

//         this.platformAlarmObject.alarmInfo = this.alarmInfo;
//         this.platformAlarmObject.alarmSetValue = alarmSetValue;
//         return await this.platformAlarmObject.setPropertyValue();
//     }
// }
