/*
 * @Author: your name
 * @Date: 2021-08-25 15:01:15
 * @LastEditTime: 2021-09-08 01:18:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\data-anamaly.ts
 */
import { moment } from "../../modulejs";
import { vhConfig, trendConfig } from "../config";
import { Container, Service, Inject } from "typedi";
import { CVendorData } from "./vendor";
import "reflect-metadata";

Container.import([CVendorData]);

interface IDataMissType {
    epcode: string;
    name: string;
    begintime: string;
    endtime: string;
}

//* 数据异常类
@Service("连续10分钟无数据或值为0")
export class CDataMiss {
    @Inject("贴源数据接口")
    vendorApi!: CVendorData;
    netParam!: IDataMissType;
    includeParam!: string; // 对象实例.对象属性
    epcode!: string;
    // objnameInclude!: string;
    configLimitValue!: number;
    setNetParam(): void {
        let beginTime = moment()
                .subtract(this.configLimitValue, "minutes")
                .format("YYYY-MM-DD HH:mm:ss"),
            endTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.netParam = {
            epcode: this.epcode,
            name: this.includeParam,
            begintime: beginTime,
            endtime: endTime
        };
    }
    async getHistoryIN10min(): Promise<any> {
        // TODO:需要定期检测trend接口返回值的时间范围情况，之前有出现时间范围在设定的开始时间-结束时间以外情况
        this.vendorApi.vendor = trendConfig(this.netParam);
        const trendRes = await this.vendorApi.get();
        if (trendRes.info.toLocaleLowerCase() === "success") {
            return trendRes.data[0];
        } else {
            return false;
        }
    }
    async getDataMissAlarm(): Promise<any> {
        this.setNetParam();
        let history10min = await this.getHistoryIN10min();
        if (!history10min) {
            return 0;
        }
        if (history10min.length === 0) {
            return 1; // 产生报警
        }
        // let historyArr = [];
        // history10min.forEach((item: { value: number; [prop: string]: any }) => {
        //     historyArr.push(item.value);
        // });
        // history10min = [{ value: 0 }, { value: 0 }];
        // TODO:判断10分钟内数据是否为0->求和判断是否为0
        let sumHistoryData = history10min.reduce(
            (acc: number, currdata: { value: number; [prop: string]: any }) => {
                return acc + currdata.value;
            },
            0
        );
        if (sumHistoryData === 0) {
            return 1; //* 产生报警
        } else {
            return 0; // 正常
        }
    }
}
// ?数据缺失异常测试
// let alarmHander = Container.get<CDataMiss>("连续10分钟无数据或值为0");
// alarmHander.includeParam = "E111F1";
// alarmHander.epcode = "320482000003";
// alarmHander.configLimitValue = 10;
// // console.log();
// alarmHander.getDataMissAlarm().then((item) => {
//     console.log(item);
// });
interface IDayMeanType {
    name: string;
    begintime: string;
    endtime: string;
    mode?: string;
    datamode?: string;
}
@Service("日数据不等于小时数据汇总")
export class CMeanAlarm {
    netParam!: IDayMeanType;
    includeParam!: string; // 需写入
    @Inject("贴源数据接口")
    vendorApi!: CVendorData;
    configLimitValue!: number;
    setNetParam(): void {
        let beginTime = moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
            endTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.netParam = {
            name: this.includeParam,
            begintime: beginTime,
            endtime: endTime,
            mode: "day",
            datamode: "avg"
        };
    }
    async getDayMean(): Promise<any> {
        this.netParam.mode = "day";
        // this.netParam.datamode = 'avg';
        this.vendorApi.vendor = vhConfig(this.netParam);
        let dayAvgRes = await this.vendorApi.get();
        let dayAvgData;
        if (dayAvgRes.info.toLocaleLowerCase() === "success") {
            dayAvgData = dayAvgRes.data[0][0].value;
        }

        return dayAvgData;
    }
    async getHoursMean(): Promise<any> {
        this.netParam.mode = "hour";
        // this.netParam.datamode = 'avg';
        this.vendorApi.vendor = vhConfig(this.netParam);
        let hoursAvgRes = await this.vendorApi.get();
        let hoursAvgData, hoursAvgDataArr, sum;
        if (hoursAvgRes.info.toLocaleLowerCase() === "success") {
            hoursAvgDataArr = hoursAvgRes.data[0];
            sum = hoursAvgDataArr.reduce((acc: any, currAvgData: any) => {
                return acc + currAvgData.value;
            }, 0);
            hoursAvgData = sum / hoursAvgDataArr.length;
        }

        return hoursAvgData;
    }
    async getMeanAlarm(): Promise<any> {
        this.setNetParam();
        let dayAvgData = await this.getDayMean();
        let hoursAvgData = await this.getHoursMean();
        // dayAvgData = 10;
        // hoursAvgData = 4;
        let LimitValuePercent =
            this.configLimitValue > 1 ? this.configLimitValue / 100 : this.configLimitValue;
        console.log("均值异常：日均值-时均值", dayAvgData, hoursAvgData);
        // return [dayAvgData, hoursAvgData];
        if (dayAvgData === 0 || hoursAvgData === 0) {
            // 若数据为0则产生报警
            return 1;
        }
        if (Math.abs(dayAvgData - hoursAvgData) / dayAvgData > LimitValuePercent) {
            return 1; //* 产生报警
        } else {
            return 0; // 正常
        }
    }
}

// ?均值异常测试
// let alarmHander = Container.get<CMeanAlarm>('日数据不等于小时数据汇总');
// alarmHander.includeParam = 'MD_73034683210015.A21026';
// alarmHander.configLimitValue = 10;
// console.log();
// alarmHander.getMeanAlarm().then((item) => {
//     console.log(item);
// });

interface IEmissionType {
    name: string;
    begintime: string;
    endtime: string;
    mode?: string;
    datamode?: string;
}
@Service("排放量不等于浓度乘以流量")
export class CEmissionAlarm {
    netParam!: IEmissionType;
    includeEmissParam!: string; // 需写入 排放量\浓度为一个参数
    // includeConcenParam!: string; // 需写入
    includeFlowParam!: string; // 需写入 流量
    @Inject("贴源数据接口")
    vendorApi!: CVendorData;
    configLimitValue!: number;
    setNetParam(): void {
        let beginTime = moment().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss"),
            endTime = moment().format("YYYY-MM-DD HH:mm:ss");
        this.netParam = {
            name: this.includeEmissParam,
            begintime: beginTime,
            endtime: endTime,
            mode: "hour",
            datamode: "avg"
        };
    }
    async getEmission(): Promise<any> {
        this.netParam.name = this.includeEmissParam;
        // this.netParam.mode = 'hour';
        this.netParam.datamode = "cou";
        this.vendorApi.vendor = vhConfig(this.netParam);
        let EmissRes = await this.vendorApi.get();
        let EmissData;
        if (EmissRes.info.toLocaleLowerCase() === "success") {
            EmissData = EmissRes.data[0][0].value;
        }

        return EmissData;
    }
    async getConcentration(): Promise<any> {
        this.netParam.name = this.includeEmissParam;
        // this.netParam.mode = 'hour';
        this.netParam.datamode = "avg";
        this.vendorApi.vendor = vhConfig(this.netParam);
        let ConcentraRes = await this.vendorApi.get();
        let ConcentraData;
        if (ConcentraRes.info.toLocaleLowerCase() === "success") {
            ConcentraData = ConcentraRes.data[0][0].value;
        }

        return ConcentraData;
    }
    async getFlow(): Promise<any> {
        this.netParam.name = this.includeFlowParam;
        // this.netParam.mode = 'hour';
        this.netParam.datamode = "cou";
        this.vendorApi.vendor = vhConfig(this.netParam);
        let FlowRes = await this.vendorApi.get();
        let FlowData;
        if (FlowRes.info.toLocaleLowerCase() === "success") {
            FlowData = FlowRes.data[0][0].value;
        }
        return FlowData;
    }
    async getEmissAlarm(): Promise<any> {
        this.setNetParam();
        let EmissData = await this.getEmission();
        let ConcentraData = await this.getConcentration();
        let FlowData = await this.getFlow();
        let LimitValuePercent =
            this.configLimitValue > 1 ? this.configLimitValue / 100 : this.configLimitValue;
        // dayAvgData = 10;
        // hoursAvgData = 4;
        // console.log(emissData, concentraData, flowData, concentraData * flowData * 1e-6);
        // return [dayAvgData, hoursAvgData];
        if (EmissData === 0 || ConcentraData === 0 || FlowData === 0) {
            return 1;
        }
        if (Math.abs(EmissData - ConcentraData * FlowData * 1e-6) / EmissData > LimitValuePercent) {
            return 1; // 报警
        } else {
            return 0; // 正常
        }
    }
}

// ?排放量异常测试
// let alarmHander = Container.get<CEmissionAlarm>('排放量不等于浓度乘以流量');
// alarmHander.includeEmissParam = 'MD_73034683210015.A21026';
// alarmHander.includeFlowParam = 'MD_73034683210015.A00000';
// alarmHander.configLimitValue = 10;
// console.log();
// alarmHander.getEmissAlarm().then((item) => {
//     console.log(item);
// });

// moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') // 当天0点的时间格式
//  moment().startOf('day').format('X') // 当天0点的时间缀，以10位Unix时间戳输出(秒）
//  moment().endOf('day').format('YYYY-MM-DD HH:mm:ss') // 当天23点59分59秒的时间格式
//  moment().endOf('day').format('x') //当天23点59分59秒以13位Unix时间戳输出（毫秒）

//  moment('2020-06-30').startOf('day').format('x') // 2020-06-30当天0点的以13位Unix时间戳输出（毫秒）
//  moment('2020-06-30').endOf('day').format('x') //  2020-06-30当天24点的以13位Unix时间戳输出（毫秒）
