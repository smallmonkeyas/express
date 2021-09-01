/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-31 10:00:24
 * @LastEditTime: 2021-09-01 14:45:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\vendor.ts
 */
import { request, system } from '../../modulejs';
import { Service } from 'typedi';
import { IVendorConfig, IVendorResponseConfig } from '../config';

export interface IVendorData {
    vendor: IVendorConfig;
    get(): object;
    post(): object;
}
@Service('贴源数据接口')
export class CVendorData implements IVendorData {
    vendor: IVendorConfig;
    constructor(vendor: IVendorConfig) {
        this.vendor = vendor;
    }
    // eslint-disable-next-line no-unused-vars
    get() {
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params;
        if (!this.vendor) {
            throw new Error('vendor接口输入数据不足');
        }
        url = this.vendor.netAddress;
        if (this.vendor.netPath) {
            url = `${this.vendor.netAddress}/${this.vendor.netPath}`;
        }
        if (this.vendor.netParam) {
            let paramObj, paramStr;
            paramObj = this.vendor.netParam;
            paramStr = JSON.stringify(paramObj);
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, '=')
                .replace(/\"(,{1})\"/g, '&')
                .replace(/[{}\"]/g, '');
            url = `${this.vendor.netAddress}/${this.vendor.netPath}?${params}`;
        }

        //   const authorization = global.authorization;
        let options = {
            method: 'GET',
            url: url,
            headers: {
                //   Authorization: authorization,
                Cookie: 'vertx-web.session=79b80599135734456f355ba9d47a5ac8'
            }
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error);
                }

                res = JSON.parse(response.body);
                // if (res instanceof IVendorResponseConfig) {
                // resolve(res);
                // return { error: 1, info: 'success', data: [] };
                // }
                resolve(res);
            });
        });
    }

    // eslint-disable-next-line no-unused-vars
    // post(...args: any[]): Object {
    post(): Object {
        let paramsObj, url, router, params, data;
        url = this.vendor.netAddress;
        if (this.vendor.netPath) {
            url = `${this.vendor.netAddress}/${this.vendor.netPath}`;
        }
        if (this.vendor.netData) {
            data = this.vendor.netData;
        }
        // data = arguments[1];
        // router = arguments[0];
        // url = `http://${ip}:8999/${router}`;

        //   const authorization = global.authorization;
        let options = {
            method: 'POST',
            url: url,
            headers: {
                //   Authorization: authorization,
                Cookie: 'vertx-web.session=79b80599135734456f355ba9d47a5ac8'
            },
            body: JSON.stringify(data)
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                if (error) {
                    throw new Error(error);
                }
                // console.log(response.body);
                // resolve(JSON.parse(response.body));
                let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error);
                }

                // res = JSON.parse(response.body);
                res = JSON.parse(response.body);
                resolve(res);
            });
        });
    }
}

// TODO: 内网8999端口->接口接收测试
// const urlConfig = {
//     netAddress: '10.32.203.157:8999', // 10.32.203.157:8999
//     netPath: 'serverapi/data/rtd', // serverapi/data/rtd
//     netParam: { epcode: '320400010005', mode: '1' } // ? epcode=320400010005&mode=1=>{epcode:'320400010005',mode:1,}
//     // netData?: Object;
// };
// async function getVendorData() {
//     const vendor = new CVendorData(urlConfig);
//     // const params = { epcode: '320400010005', mode: 1 };
//     const res = vendor.get();
//     return res;
// }

// getVendorData().then((item) => {
//     console.log(item);
// });
