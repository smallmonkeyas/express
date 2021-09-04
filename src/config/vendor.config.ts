/*
 * @Author: your name
 * @Date: 2021-08-25 15:17:14
 * @LastEditTime: 2021-09-03 09:39:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\mongodb.config.ts
 */
// export interface IVendorConfig {
//     netAddress: string; // 10.32.203.157:8999
//     netPath?: string; // serverapi/data/rtd
//     method?: string; // ? epcode=320400010005&mode=1
// }
import { IVendorConfig } from './interface.config';
const netAddressConfig = {
    IPAddress: '10.32.203.157',
    Port: '8999'
};
const netAddress = `http://${netAddressConfig.IPAddress}:${netAddressConfig.Port}`;

export const collectorUrlConfig: IVendorConfig = {
    netAddress: netAddress,
    netPath: 'serverapi/cfg/collector'
};

export const trendConfig = function (netParam: object) {
    return {
        netAddress: netAddress,
        netPath: 'serverapi/data/trend',
        netParam: netParam
        // ? netParam->{ epcode: epcode, name: name, begintime: begintime, endtime: endtime } -> epcode=320400010005&mode=1
        // netData?: Object;
    };
};

export const vhConfig = function (netParam: object) {
    return {
        netAddress: netAddress,
        netPath: 'serverapi/data/vh/history',
        netParam: netParam
        // eslint-disable-next-line max-len
        // ? name=MD_73034683210015.A21026&begintime=2021-08-17+00:00:01&endtime=2021-08-21+12:00:00&mode=day&datamode=avg=>{name:'MD_73034683210015.A21026',mode:1,}
        /**
         * name：查询的位号，多个位号用逗号隔开：比如：GK_XXXX.G71031,MD_XXX.G71032 (前面是objectname）
         * mode：查询模式，minute，hour，day，month
         * datamode：数据模式：avg，max，min，cou （累计值）
         * count：数据个数，可以不传
         *  begintime：查询开始时间 endtime：查询结束时间
         */
    };
};
