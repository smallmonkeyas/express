/*
 * @Author: your name
 * @Date: 2021-08-25 15:00:34
 * @LastEditTime: 2021-09-04 01:48:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\properity.ts
 */

import { request, system } from "../../modulejs";
import { Service, Inject } from "typedi";
import { ISupOSConfig } from "../config";

export interface ISupOSData {
    supos: ISupOSConfig;
    get(): object;
    post(): object;
}

@Service("supOS数据接口")
export class CSupOSData implements ISupOSData {
    supos!: ISupOSConfig;
    @Inject("authorization-token")
    authorizationToken!: string; // 需要在用户登录后通过全局预设
    get(): Promise<any> {
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params;
        if (!this.supos) {
            throw new Error("api接口输入数据不足");
        }
        url = this.supos.netAddress;
        if (this.supos.netPath) {
            url = `${this.supos.netAddress}/${this.supos.netPath}`;
        }
        if (this.supos.netParam) {
            let paramObj, paramStr;
            paramObj = this.supos.netParam;
            paramStr = JSON.stringify(paramObj);
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "");
            url = `${this.supos.netAddress}/${this.supos.netPath}?${params}`;
        }

        //   const authorization = global.authorization;
        let options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: this.authorizationToken,
                "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            }
            // body: JSON.stringify(this.supos.netData)
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error);
                }

                let res = JSON.parse(response.body);
                // if (res instanceof IVendorResponseConfig) {
                // resolve(res);
                // return { error: 1, info: 'success', data: [] };
                // }
                resolve(res);
            });
        });
    }
    post(): Promise<any> {
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params;
        if (!this.supos) {
            throw new Error("supos接口输入数据不足");
        }
        url = this.supos.netAddress;
        if (this.supos.netPath) {
            url = `${this.supos.netAddress}/${this.supos.netPath}`;
        }
        if (this.supos.netParam) {
            let paramObj, paramStr;
            paramObj = this.supos.netParam;
            paramStr = JSON.stringify(paramObj);
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "");
            url = `${this.supos.netAddress}/${this.supos.netPath}?${params}`;
        }

        //   const authorization = global.authorization;
        let options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: this.authorizationToken,
                "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            },
            body: JSON.stringify({
                propName: "QCL_TLT_SO2_01_L"
            })
            // body: JSON.stringify(this.supos.netData)
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error);
                }

                let res = JSON.parse(response.body);
                // if (res instanceof IVendorResponseConfig) {
                // resolve(res);
                // return { error: 1, info: 'success', data: [] };
                // }
                resolve(res);
            });
        });
    }
}
