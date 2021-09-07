/*
 * @Author: your name
 * @Date: 2021-09-02 08:28:45
 * @LastEditTime: 2021-09-06 11:06:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\alarm.ts
 */

import { CDataMiss, CMeanAlarm, CEmissionAlarm } from "./data-anamaly";
import { Container, Service, Inject } from "typedi";
import "reflect-metadata";
import {
    IAlarmStruct
    // SetPropertyValueNetConfig,
    // GetPropertyValueNetConfig,
    // CreatObjectConfig,
    // CreatProperityConfig
} from "../config";
import { CSupOSData, CPlatformObject } from "./supos";
import { User } from "./user";
//* supos工业操作系统平台上报警对象实例
@Service("supOS平台报警实例与属性设置")
export class CPlatformAlarmObject extends CPlatformObject {
    // @Inject("supOS数据接口")
    // plantInterface!: CSupOSData;
    alarmInfo!: IAlarmStruct;
    // alarmSetValue!: number;

    // properityInfo!: ISuposProperity;
    setProperityInfo() {
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
        this.properityInfo = {
            objectName: alarmObjname,
            objectDisplayName: alarmObjDisplayName,
            objectDescription: alarmObjDescription,
            propName: alarmParamName,
            propDisplayName: alarmParamDisplayName,
            propDescription: alarmParamDescription,
            primitiveType: "Integer",
            alarmProperityName: alarmProperityName,
            alarmProperityDisplayName: alarmProperityDisplayName,
            alarmProperityDescription: alarmProperityDescription
        };
    }
    // // alarmGetValue
    // //* 设置属性值
    // async setPropertyValue() {
    //     const { alarmObjname, alarmParamName } = this.alarmInfo;
    //     this.plantInterface.supos = SetPropertyValueNetConfig(
    //         alarmObjname,
    //         alarmParamName,
    //         this.alarmSetValue
    //     );
    //     return await this.plantInterface.post();
    // }
    // //* 创建对象实例
    // creatObject() {
    //     const { alarmObjname, alarmObjDisplayName, alarmObjDescription } = this.alarmInfo;
    //     this.plantInterface.supos = CreatObjectConfig(
    //         alarmObjname,
    //         alarmObjDisplayName,
    //         alarmObjDescription
    //     );
    //     this.plantInterface.post();
    // }
    // //* 创建对象属性
    // creatProperityWithAlarm() {
    //     const {
    //         alarmObjname,
    //         alarmObjDisplayName,
    //         alarmObjDescription,
    //         alarmParamName,
    //         alarmParamDisplayName,
    //         alarmParamDescription,
    //         alarmProperityName,
    //         alarmProperityDisplayName,
    //         alarmProperityDescription
    //     } = this.alarmInfo;
    //     this.plantInterface.supos = CreatProperityConfig(
    //         alarmObjname,
    //         alarmObjDisplayName,
    //         alarmObjDescription,
    //         alarmParamName,
    //         alarmParamDisplayName,
    //         alarmParamDescription,
    //         this.alarmSetValue,
    //         alarmProperityName,
    //         alarmProperityDisplayName,
    //         alarmProperityDescription
    //     );
    //     this.plantInterface.post();
    // }
}

Container.import([CDataMiss, CMeanAlarm, CEmissionAlarm, CSupOSData]);
// TODO: 已知报警库单条报警配置——>判断是否使能->判断报警类型->根据报警类型和报警配置选择报警判断算法->报警输出

class CAlarm {}

interface IAlarmTask {
    alarmInfo: IAlarmStruct;
    // dataAnamalyHandler: any;
    platformAlarmObject: CPlatformAlarmObject;
    exec(): Promise<any>;
}
@Service("数据缺失设置报警任务")
export class CDataMissAlarmTask implements IAlarmTask {
    alarmInfo!: IAlarmStruct;
    service!: string;
    @Inject("连续10分钟无数据或值为0")
    dataMissHandler!: CDataMiss;
    @Inject("supOS平台报警实例与属性设置")
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
        let paramInclude = String(this.alarmInfo.includeParamName);
        let objnameInclude = this.alarmInfo.objnameInclude;
        this.dataMissHandler.includeParam = `${objnameInclude}.${paramInclude}`;
        // this.dataMissHandler.objnameInclude = this.alarmInfo.objnameInclude
        let alarmSetValue = await this.dataMissHandler.getDataMissAlarm();
        this.platformAlarmObject.alarmInfo = this.alarmInfo;
        this.platformAlarmObject.setProperityInfo();
        this.platformAlarmObject.propSetValue = alarmSetValue;
        return await this.platformAlarmObject.setPropertyValue();
    }
}
// export class CDataMissAlarmTotalTask {
//     alarmlist!: Array<IAlarmStruct>;

//     async exec(): Promise<any> {
//         // let promise = this.alarmlist.map((alarmRecord) => {});
//         Promise.all(
//             this.alarmlist.map(async (alarmRecord: IAlarmStruct) => {
//                 if (!alarmRecord.enableStatus) {
//                     return "报警不使能";
//                 }
//                 // let datamiss = new CDataMiss();
//                 let dataMissTask = new CDataMissAlarmTask();
//                 dataMissTask.alarmInfo = alarmRecord;
//                 dataMissTask.dataMissHandler = new CDataMiss();
//                 dataMissTask.platformAlarmObject = new CPlatformAlarmObject();
//                 dataMissTask.exec();
//                 // res.push(alarmExecRes);
//                 // console.log(alarmExecRes);
//                 // } else {
//                 //     return `报警不使能`;
//                 // }
//             })
//         );
//     }
// }
@Service("均值异常设置报警任务")
export class CMeanAbnormalAlarmTask implements IAlarmTask {
    alarmInfo!: IAlarmStruct;
    @Inject("日数据不等于小时数据汇总")
    meanAlarmHandler!: CMeanAlarm;
    @Inject("supOS平台报警实例与属性设置")
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

        let paramInclude = String(this.alarmInfo.includeParamName);
        let objnameInclude = this.alarmInfo.objnameInclude;
        // this.dataMissHandler.includeParam = `${objnameInclude}.${paramInclude}`;

        this.meanAlarmHandler.includeParam = `${objnameInclude}.${paramInclude}`;

        let alarmSetValue = await this.meanAlarmHandler.getMeanAlarm();

        this.platformAlarmObject.alarmInfo = this.alarmInfo;
        this.platformAlarmObject.setProperityInfo();

        this.platformAlarmObject.propSetValue = alarmSetValue;
        return await this.platformAlarmObject.setPropertyValue();
    }
}
@Service("排放量异常设置报警任务")
export class CEmissionAbnormalAlarmTask implements IAlarmTask {
    alarmInfo!: IAlarmStruct;
    @Inject("排放量不等于浓度乘以流量")
    emissionAlarmHandler!: CEmissionAlarm;
    @Inject("supOS平台报警实例与属性设置")
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

        let [includeEmissParam, includeFlowParam] = this.alarmInfo.includeParamName;
        // let  = this.alarmInfo.includeParamName[1];

        let objnameInclude = this.alarmInfo.objnameInclude;

        this.emissionAlarmHandler.includeEmissParam = `${objnameInclude}.${includeEmissParam}`;
        this.emissionAlarmHandler.includeFlowParam = `${objnameInclude}.${includeFlowParam}`;

        let alarmSetValue = await this.emissionAlarmHandler.getEmissAlarm();

        this.platformAlarmObject.alarmInfo = this.alarmInfo;
        this.platformAlarmObject.setProperityInfo();

        this.platformAlarmObject.propSetValue = alarmSetValue;
        return await this.platformAlarmObject.setPropertyValue();
    }
}
@Service("报警更新任务类")
export class CAlarmUpdateTask {
    alarmTaskHandler!: IAlarmTask;
    alarmInfo!: IAlarmStruct;
    constructor(alarmTask: IAlarmTask) {
        this.alarmTaskHandler = alarmTask;
    }
    async exec(): Promise<any> {
        this.alarmTaskHandler.alarmInfo = this.alarmInfo;
        return await this.alarmTaskHandler.exec();
    }
}
//* CAlarmUpdateTask测试
// async function exec(): Promise<any> {
//     let user = Container.get<User>("用户");
//     await user.login();
//     let alarmUpdateTask = Container.get<CAlarmUpdateTask>("报警更新任务类");
//     let emissionAbnormalAlarmTask =
//         Container.get<CEmissionAbnormalAlarmTask>("排放量异常设置报警任务");
//     alarmUpdateTask.alarmTaskHandle = emissionAbnormalAlarmTask;
//     alarmUpdateTask.alarmInfo = {
//         // _id: ObjectId("6132654c2bfecd7c5cf00e54"),
//         includeParamName: ["HJ2005_01", "HJ2005_B02"],
//         includeParamDisplayname: ["3#炉监测点-烟尘", "3#炉监测点-废气"],
//         includeParamDescription: ["3#炉监测点-烟尘", "3#炉监测点-废气"],
//         alarmConfigParam: ["PFLYC_YC_FQ_03"],
//         alarmConfigParamValue: [10],
//         objnameInclude: "GK_CZ_GD_GXHB",
//         objnameDisplaynameInclude: "光大高新环保新能源（常州）有限公司",
//         epcode: "3204110200006190",
//         factoryType: "垃圾焚烧厂",
//         alarmType: 12,
//         alarmTypeDescription: "排放量异常",
//         enableConfigparam: "PFLYC_YC_FQ_03_BZW",
//         enableStatus: true,
//         alarmObjname: "EmissionAlarm",
//         alarmObjDisplayName: "排放量异常",
//         alarmObjDescription: "排放量异常",
//         alarmParamName: "GK_CZ_GD_GXHB__HJ2005_01__HJ2005_B02",
//         alarmParamDisplayName:
//             "光大高新环保新能源（常州）有限公司_涉及参 数_3#炉监测点-烟尘__3#炉监测点-废气",
//         alarmParamDescription:
//             "光大高新环保新能源（常州）有限公司_涉及参数_3#炉监测点-烟尘_3#炉监测点-废气_报警产生条件：排放量不等于浓度乘以流量（误差范围大于10%）",
//         alarmProperityName: "A_12_xxx_HJ2005_01_HJ2005_B02",
//         alarmProperityDisplayName: "配置参数_PFLYC_YC_FQ_03",
//         alarmProperityDescription: "使能配置参数:PFLYC_YC_FQ_03_BZW,报警条件：为1则触发报警",
//         id: 132
//         // __v: 0
//     };
//     console.log(alarmUpdateTask);
//     return alarmUpdateTask.exec();
// }
// exec().then(() => {});

//*
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
