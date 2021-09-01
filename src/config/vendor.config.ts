/*
 * @Author: your name
 * @Date: 2021-08-25 15:17:14
 * @LastEditTime: 2021-09-01 14:19:05
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
export const netAddressConfig = {
    IPAddress: '10.32.203.157',
    Port: '8999'
};
const netAddress = `http://${netAddressConfig.IPAddress}:${netAddressConfig.Port}`;

export const collectorUrlConfig: IVendorConfig = {
    netAddress: netAddress,
    netPath: 'serverapi/cfg/collector'
};
