/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-09-05 01:33:25
 * @LastEditTime: 2021-09-08 01:11:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\main\index.ts
 */

import "reflect-metadata";
import { Container, Service, Inject } from "typedi";
import { ruletableFileConfig, ruletableConfig, alarmtableConfig, IAlarmStruct } from "../config";
import {
    User,
    CSupOSData,
    CRuleTable,
    CRuleTableLocal,
    CAlarmTable,
    AlarmTableRecordGenerateTask,
    CAlarmTableGenerateTask,
    CPlatformAlarmObject,
    CDataMissAlarmTask,
    CDataMiss,
    CAlarmUpdateTask,
    CMeanAbnormalAlarmTask,
    CMeanAlarm,
    CEmissionAbnormalAlarmTask
} from "../module";
import { system, XLSX_JSON } from "../../modulejs";
// Container.import([User, CAlarmTableGenerateTask, AlarmTableRecordGenerateTask]);
@Service()
class AbsTask {
    @Inject("规则库操作类")
    ruleTableHandler!: CRuleTable;
    @Inject("规则数据表本地操作类")
    ruleTableLocalHandler!: CRuleTableLocal;
    @Inject("用户")
    user!: User;
    @Inject("报警配置表生成任务类")
    alarmTableGenerateHandler!: CAlarmTableGenerateTask;
    @Inject("报警配置库")
    alarmTableHandler!: CAlarmTable;
    @Inject("supOS平台报警实例与属性设置")
    platformAlarmObject!: CPlatformAlarmObject;
    @Inject("报警更新任务类")
    alarmUpdateHandler!: CAlarmUpdateTask;
    @Inject("数据缺失设置报警任务")
    dataMissHandler!: CDataMissAlarmTask;
    @Inject("均值异常设置报警任务")
    meanAbnormalHandler!: CMeanAbnormalAlarmTask;
    @Inject("排放量异常设置报警任务")
    emissionAbnormalHandler!: CEmissionAbnormalAlarmTask;
}

@Service("主程序")
class CTask extends AbsTask {
    async main(): Promise<any> {
        // TODO: 1、读取规则文件
        // let ruleTableHandler = Container.get<CRuleTable>('规则库操作类');
        this.ruleTableHandler.mongodb.conneConfig = ruletableConfig;
        // let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

        this.ruleTableLocalHandler.file = ruletableFileConfig;
        const ruleJson = this.ruleTableLocalHandler.patchExcelToJson();
        // const ruleJson = this.ruleTableLocalHandler.excelTojson();
        // return ruleJson;
        // TODO: 2、存到规则库
        //     let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

        // let dataRes = factoryCollectorTempleData;
        // if (dataRes.info.toLocaleLowerCase() === 'success') {
        await this.ruleTableHandler.connect();
        await this.ruleTableHandler.deleteAll();
        await this.ruleTableHandler.add(ruleJson);
        await this.ruleTableHandler.update({ ruleType: "恒值异常" }, { ruleType: "数据恒值" });
        const ruletable = await this.ruleTableHandler.select(null, null);
        await this.ruleTableHandler.disconnect();
        // return rule;
        // TODO: 3、生成报警配置表
        // let user = Container.get<User>("用户");
        // const oauth = await this.user.login();
        // console.log(rule);
        // return ruleJson;
        // Container.import([User]);
        //     let alarmTableHandler = Container.get<CAlarmTableGenerateTask>("报警配置表生成任务类");
        this.alarmTableGenerateHandler.ruletable = ruletable;
        await this.alarmTableGenerateHandler.getAlarmTable();
        let alarmConfigTableJson = this.alarmTableGenerateHandler.table;
        // return alarmConfigTableJson;
        // TODO: 4、保存到报警配置库
        // // let alarmTableHandler = Container.get<CAlarmTable>("报警配置库");
        this.alarmTableHandler.mongodb.conneConfig = alarmtableConfig;
        await this.alarmTableHandler.connect();
        await this.alarmTableHandler.deleteAll();
        await this.alarmTableHandler.add(alarmConfigTableJson);

        // TODO: 5、获取报警配置库数据
        const alarmTable = await this.alarmTableHandler.select(null, null);
        await this.alarmTableHandler.disconnect();
        // return alarmTable;
        // TODO: 6、遍历报警配置数据，完成以下任务：
        let res = [];

        for (let alarmRecord of alarmTable) {
            if (alarmRecord.enableStatus) {
                // console.log(alarmRecord);
                // if (alarmRecord.alarmType !== 1) {
                //     continue;
                // }
                // console.log(alarmRecord);
                // TODO: ①创建平台报警对象
                this.platformAlarmObject.alarmInfo = alarmRecord;
                this.platformAlarmObject.setProperityInfo();
                // let createObjRes = await this.platformAlarmObject.rmObject();
                let createObjRes = await this.platformAlarmObject.creatObject();
                let createPropRes = await this.platformAlarmObject.creatProperity();
                // // console.log(createObjRes, createPropRes);
                // console.log(createObjRes);
                res.push(createObjRes, createPropRes);
                // res.push(createObjRes);
            }
        }
        // Promise.all(
        //     alarmTable.map(async (alarmRecord: IAlarmStruct) => {
        //         if (!alarmRecord.enableStatus) {
        //             return "报警不使能";
        //         }
        //         // TODO: ②依据异常算法判定是否报警
        //         // if (alarmRecord.enableStatus) {
        //         this.alarmUpdateHandler.alarmInfo = alarmRecord;
        //         if (alarmRecord.alarmType === 1) {
        //             this.alarmUpdateHandler.alarmTaskHandler = this.dataMissHandler;
        //         } else if (alarmRecord.alarmType === 11) {
        //             this.alarmUpdateHandler.alarmTaskHandler = this.meanAbnormalHandler;
        //         } else if (alarmRecord.alarmType === 12) {
        //             this.alarmUpdateHandler.alarmTaskHandler = this.emissionAbnormalHandler;
        //         } else {
        //             return "其它类型";
        //         }
        //         await this.alarmUpdateHandler.exec();
        //         // res.push(alarmExecRes);
        //         // console.log(alarmExecRes);
        //         // } else {
        //         //     return `报警不使能`;
        //         // }
        //     })
        // );
        // let promise = alarmTable.map((alarmRecord: any) => {
        //     if (!alarmRecord.enableStatus) {
        //         return "报警不使能";
        //     }
        //     // TODO: ②依据异常算法判定是否报警
        //     // if (alarmRecord.enableStatus) {
        //     // this.alarmUpdateHandler.alarmInfo = alarmRecord;
        //     if (alarmRecord.alarmType === 1) {
        //         // this.dataMissHandler.alarmInfo = alarmRecord;
        //         let newDataMissHandler = new CDataMissAlarmTask();
        //         newDataMissHandler.alarmInfo = alarmRecord;
        //         newDataMissHandler.dataMissHandler = new CDataMiss();
        //         newDataMissHandler.platformAlarmObject = new CPlatformAlarmObject();
        //         newDataMissHandler.exec();
        //         // Container.set("数据缺失设置报警任务", new CDataMissAlarmTask());
        //         // Container.import([CDataMissAlarmTask]);
        //         // return this.dataMissHandler.exec();
        //     } else if (alarmRecord.alarmType === 11) {
        //         let newMeanAbnormalAlarmHandler = new CMeanAbnormalAlarmTask();
        //         newMeanAbnormalAlarmHandler.alarmInfo = alarmRecord;
        //         newMeanAbnormalAlarmHandler.meanAlarmHandler = new CMeanAlarm();
        //         newMeanAbnormalAlarmHandler.platformAlarmObject = new CPlatformAlarmObject();
        //         newMeanAbnormalAlarmHandler.exec();
        //         this.meanAbnormalHandler.alarmInfo = alarmRecord;

        //         return this.meanAbnormalHandler.exec();
        //     } else if (alarmRecord.alarmType === 12) {
        //         this.emissionAbnormalHandler.alarmInfo = alarmRecord;

        //         return this.emissionAbnormalHandler.exec();
        //     } else {
        //         return "其它类型";
        //     }
        //     // return this.alarmUpdateHandler.exec();
        //     // res.push(alarmExecRes);
        //     // console.log(alarmExecRes);
        //     // } else {
        //     //     return `报警不使能`;
        //     // }
        // });

        let promise = alarmTable.map((alarmRecord: IAlarmStruct) => {
            if (!alarmRecord.enableStatus) {
                return "报警不使能";
            }
            // TODO: ②依据异常算法判定是否报警
            // if (alarmRecord.enableStatus) {
            this.alarmUpdateHandler.alarmInfo = alarmRecord;
            if (alarmRecord.alarmType === 1) {
                this.alarmUpdateHandler.alarmTaskHandler = this.dataMissHandler;
                return this.alarmUpdateHandler.exec();
            } else if (alarmRecord.alarmType === 11) {
                this.alarmUpdateHandler.alarmTaskHandler = this.meanAbnormalHandler;
                return this.alarmUpdateHandler.exec();
            } else if (alarmRecord.alarmType === 12) {
                this.alarmUpdateHandler.alarmTaskHandler = this.emissionAbnormalHandler;
                return this.alarmUpdateHandler.exec();
            } else {
                return "其它类型";
            }
            // return this.alarmUpdateHandler.exec();
            // res.push(alarmExecRes);
            // console.log(alarmExecRes);
            // } else {
            //     return `报警不使能`;
            // }
        });
        const promiseall = await Promise.all(promise);

        // for (let alarmRecord of alarmTable) {
        //     // TODO: ②依据异常算法判定是否报警
        //     if (alarmRecord.enableStatus) {
        //         this.alarmUpdateHandler.alarmInfo = alarmRecord;
        //         if (alarmRecord.alarmType === 1) {
        //             this.alarmUpdateHandler.alarmTaskHandler = this.dataMissHandler;
        //         } else if (alarmRecord.alarmType === 11) {
        //             this.alarmUpdateHandler.alarmTaskHandler = this.meanAbnormalHandler;
        //         } else if (alarmRecord.alarmType === 12) {
        //             this.alarmUpdateHandler.alarmTaskHandler = this.emissionAbnormalHandler;
        //         }
        //         let alarmExecRes = await this.alarmUpdateHandler.exec();
        //         // res.push(alarmExecRes);
        //         console.log(alarmExecRes);
        //     } else {
        //         res.push(`${alarmRecord}报警不使能`);
        //     }
        // }
        return promiseall;
        // return true;
    }
}

const test = async function () {
    let user = Container.get<User>("用户");
    await user.login();
    let res = [];
    for (let i = 0; i < 1; i++) {
        await user.login();
        let teskHandler = Container.get<CTask>("主程序");

        await system.delayms(1000);
        res.push(await teskHandler.main());
    }
    return res;
};

test().then((item) => {
    console.log("main", item);
    XLSX_JSON.saveJsonToFile(item, __dirname, "reslog");
});
