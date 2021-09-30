/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-09-05 01:33:25
 * @LastEditTime: 2021-09-30 16:59:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\main\index.ts
 */

import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
import {
    ruletableFileConfig,
    ruletableConfig,
    alarmtableConfig,
    IAlarmStruct,
    requesttableConfig
} from "../config"
import {
    User,
    // CSupOSData,
    CRuleTable,
    CRuleTableLocal,
    CAlarmTable,
    // AlarmTableRecordGenerateTask,
    CAlarmTableGenerateTask,
    CPlatformAlarmObject,
    // CDataMissAlarmTask,
    // CDataMiss,
    CAlarmUpdateTask,
    // CMeanAbnormalAlarmTask,
    // CMeanAlarm,
    // CEmissionAbnormalAlarmTask,
    CServerRequestTableGenerateTask,
    CServerRequestTable
} from "../module"
import { system, XLSX_JSON } from "../../modulejs"
// Container.import([User, CAlarmTableGenerateTask, AlarmTableRecordGenerateTask]);
@Service()
class AbsTask {
    @Inject("规则库操作类")
    ruleTableHandler!: CRuleTable
    @Inject("规则数据表本地操作类")
    ruleTableLocalHandler!: CRuleTableLocal
    @Inject("用户")
    user!: User
    @Inject("报警配置表生成任务类")
    alarmTableGenerateHandler!: CAlarmTableGenerateTask
    @Inject("报警配置库")
    alarmTableHandler!: CAlarmTable
    @Inject("supOS平台报警实例与属性设置")
    platformAlarmObject!: CPlatformAlarmObject
    @Inject("报警更新任务类")
    alarmUpdateHandler!: CAlarmUpdateTask
    // @Inject("数据缺失设置报警任务")
    // dataMissHandler!: CDataMissAlarmTask;
    // @Inject("均值异常设置报警任务")
    // meanAbnormalHandler!: CMeanAbnormalAlarmTask;
    // @Inject("排放量异常设置报警任务")
    // emissionAbnormalHandler!: CEmissionAbnormalAlarmTask;
    @Inject("服务请求库生成任务类")
    requestTableTaskHandler!: CServerRequestTableGenerateTask
    @Inject("服务请求配置库")
    requestTableHandler!: CServerRequestTable
}

@Service("主程序")
class CTask extends AbsTask {
    async main(): Promise<any> {
        // !该程序关键在于报警配置库与服务请求配置库的构建，我们报警对象的创建由报警配置库来完成，依据报警配置库又接着构建服务器接口请求配置库，用于管理所有位号的批量请求和报警对象的写值工作
        // TODO: 1、读取规则文件，该规则文件由一个个按照固定模板的表格组成，只需将所有规则文件放置到同一目录下即可
        // let ruleTableHandler = Container.get<CRuleTable>('规则库操作类');
        this.ruleTableHandler.mongodb.conneConfig = ruletableConfig
        // let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

        this.ruleTableLocalHandler.file = ruletableFileConfig
        const ruleJson = this.ruleTableLocalHandler.patchExcelToJson()
        // const ruleJson = this.ruleTableLocalHandler.excelTojson();
        // return ruleJson;
        // TODO: 2、存到规则库 将规则表存在数据库(MongoDB)，用于后面的筛选和管理，也是报警配置库生成的基础
        //     let ruleTableLocalHandler = Container.get<CRuleTableLocal>('规则数据表本地操作类');

        // let dataRes = factoryCollectorTempleData;
        // if (dataRes.info.toLocaleLowerCase() === 'success') {
        await this.ruleTableHandler.connect()
        await this.ruleTableHandler.deleteAll()
        await this.ruleTableHandler.add(ruleJson)
        // 考虑的规则表不一定准确，可以利用数据库操作很方便的做必要的修改工作，这也是将规则表存到数据库的一个原因
        await this.ruleTableHandler.update({ ruleType: "恒值异常" }, { ruleType: "数据恒值" })
        const ruletable = await this.ruleTableHandler.select(null, null)
        await this.ruleTableHandler.disconnect()
        // return rule;
        // TODO: 3、生成报警配置表
        this.alarmTableGenerateHandler.ruletable = ruletable
        await this.alarmTableGenerateHandler.getAlarmTable()
        let alarmConfigTableJson = this.alarmTableGenerateHandler.table
        // return alarmConfigTableJson;
        // TODO: 4、保存到报警配置库
        // // let alarmTableHandler = Container.get<CAlarmTable>("报警配置库");
        this.alarmTableHandler.mongodb.conneConfig = alarmtableConfig
        await this.alarmTableHandler.connect()
        await this.alarmTableHandler.deleteAll()
        await this.alarmTableHandler.add(alarmConfigTableJson)

        // TODO: 5、获取报警配置库数据
        const alarmTable = await this.alarmTableHandler.select({ enableStatus: true }, null)
        await this.alarmTableHandler.disconnect()
        // return alarmTable;
        // TODO: 6、遍历报警配置数据，完成以下任务：
        let res = []
        // todo:① 更新平台报警对象
        for (let alarmRecord of alarmTable) {
            if (alarmRecord.enableStatus) {
                // console.log(alarmRecord);
                // if (alarmRecord.alarmType !== 1) {
                //     continue;
                // }
                // console.log(alarmRecord);
                // TODO: ①创建平台报警对象
                this.platformAlarmObject.alarmInfo = alarmRecord
                this.platformAlarmObject.setProperityInfo()
                // let createObjRes = await this.platformAlarmObject.rmObject();//必要时可删除对象实例
                let createObjRes = await this.platformAlarmObject.creatObject()
                let createPropRes = await this.platformAlarmObject.creatProperity()
                // // console.log(createObjRes, createPropRes);
                // console.log(createObjRes);
                res.push(createObjRes, createPropRes)
                // res.push(createObjRes);
            }
        }
        // 保存属性增加记录
        XLSX_JSON.saveJsonToFile(res, __dirname, "creatProplog")
        // ?以下大量注释部分为向服务器进行单位号d的请求版本，出现同时大量请求，到时平台服务奔溃现象，故更新了新版本

        //* 我们增加了一个服务配置库来统一管理所有接口服务的请求，所有位号的数据接口请求均需经过该配置库进行筛选和批量请求
        // todo:② 基于报警配置库和平台其它信息生成服务器请求配置库，我们需要根据该请求库完成批量位号请求与报警的设置(报警对象写值请求，写值0平台不报警，写值1则报警，报警驱动由平台提供，我们只需负责创建属性、设置报警配置和完成写值即可)
        this.requestTableTaskHandler.alarmTableWithEnabled = alarmTable
        this.requestTableTaskHandler.getServerRequestTable()

        const requestTable = this.requestTableTaskHandler.serverRequestTable
        // const requestTableHandler = Container.get<CServerRequestTable>("服务请求配置库");
        this.requestTableHandler.mongodb.conneConfig = requesttableConfig
        await this.requestTableHandler.connect()
        const resDelete = await this.requestTableHandler.deleteAll()
        //* 增加服务请求配置库
        await this.requestTableHandler.add(requestTable)
        // * 更新报警请求配置库
        let updateRes = await this.requestTableHandler.updateRequestTable()
        console.log("请求配置库更新情况：", updateRes)
        XLSX_JSON.saveJsonToFile(updateRes, __dirname, "updatelog")
        //* 根据报警请求配置库进行报警写值
        let setPropertyRes = await this.requestTableHandler.setPropValues()

        await this.requestTableHandler.disconnect()
        return setPropertyRes
        // return promiseall;
        // return true;
    }
}

const test = async function () {
    let user = Container.get<User>("用户")
    await user.login()
    let res = []
    for (let i = 0; i < 1; i++) {
        await user.login()
        let teskHandler = Container.get<CTask>("主程序")

        await system.delayms(1000)
        res.push(await teskHandler.main())
    }
    return res
}

test().then((item) => {
    console.log("main", item)
    XLSX_JSON.saveJsonToFile(item, __dirname, "reslog")
})
