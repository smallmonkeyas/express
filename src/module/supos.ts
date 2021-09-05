/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:00:34
 * @LastEditTime: 2021-09-05 14:07:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\properity.ts
 */

import { request, system } from "../../modulejs";
import "reflect-metadata";
import { Container, Service, Inject } from "typedi";
import {
    ISupOSConfig,
    ISuposProperity,
    IAlarmBasicStruct,
    IAlarmStruct,
    CreatObjectConfig,
    SetPropertyValueNetConfig,
    GetPropertyValueNetConfig,
    CreatProperityConfig,
    CreatProperityExcludeAlarmConfig,
    rmProperityConfig,
    rmObjectConfig
} from "../config";
import { User } from "./user";

Container.import([User]);

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
            // body: JSON.stringify({
            //     propName: "QCL_TLT_SO2_01_L"
            // })
            body: JSON.stringify(this.supos.netData)
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
    delete(): Promise<any> {
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
            method: "DELETE",
            url: url,
            headers: {
                Authorization: this.authorizationToken,
                // "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            }
            // body: JSON.stringify({
            //     propName: "QCL_TLT_SO2_01_L"
            // })
            // body: JSON.stringify(this.supos.netData)
        };
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error);
                }

                resolve(response.body);

                // let res = JSON.parse(response.body);
                // // if (res instanceof IVendorResponseConfig) {
                // // resolve(res);
                // // return { error: 1, info: 'success', data: [] };
                // // }
                // resolve(res);
            });
        });
    }
}

//* supos工业操作系统平台上对象实例对象属性
@Service("supOS平台对象属性设置类")
export class CPlatformObject {
    @Inject("supOS数据接口")
    plantInterface!: CSupOSData;
    properityInfo!: ISuposProperity;
    // alarmInfo!: IAlarmBasicStruct;
    // alarmSetValue!: number;
    propSetValue!: number;
    // alarmGetValue
    //* 设置属性值
    async setPropertyValue() {
        let { objectName, propName } = this.properityInfo;
        // if (this.alarmInfo) {
        //     const { alarmObjname, alarmParamName } = this.alarmInfo;
        //     objectName = alarmObjname;
        //     propName = alarmParamName;
        // }
        // objectDescription = objectDescription ? objectDescription : objectDisplayName;
        // propDescription = propDescription ? propDescription : propDisplayName;
        if (objectName && propName) {
            this.plantInterface.supos = SetPropertyValueNetConfig(
                objectName,
                propName,
                this.propSetValue
            );
            return await this.plantInterface.post();
        }
    }
    async getProperityValue(): Promise<any> {
        let { objectName, propName } = this.properityInfo;
        // if (this.alarmInfo) {
        //     const { alarmObjname, alarmParamName } = this.alarmInfo;
        //     objectName = alarmObjname;
        //     propName = alarmParamName;
        // }
        if (objectName && propName) {
            this.plantInterface.supos = GetPropertyValueNetConfig(objectName, propName);
            let res: { result: number; [prop: string]: any } = await this.plantInterface.post();
            return res.result;
        } else {
            throw new Error("数据输入不足");
        }
    }
    //* 创建对象实例
    async creatObject(): Promise<any> {
        let { objectName, objectDisplayName, objectDescription } = this.properityInfo;
        // if (this.alarmInfo) {
        //     const { alarmObjname, alarmObjDisplayName, alarmObjDescription } = this.alarmInfo;
        //     objectName = alarmObjname;
        //     objectDisplayName = alarmObjDisplayName;
        //     objectDescription = alarmObjDescription;
        // }
        if (objectName && objectDisplayName && objectDescription) {
            this.plantInterface.supos = CreatObjectConfig(
                objectName,
                objectDisplayName,
                objectDescription
            );
            return await this.plantInterface.post();
        } else {
            throw new Error("数据输入不足");
        }
    }
    //* 创建对象属性
    async creatProperityWithAlarm(): Promise<any> {
        const {
            objectName,
            // objectDisplayName ,
            // objectDscription ,
            propName,
            propDisplayName,
            propDescription,
            primitiveType,
            // propValue: number,
            alarmProperityName,
            // alarmPropDisplayName ,
            alarmProperityDescription
        } = this.properityInfo;
        if (
            propName &&
            propDisplayName &&
            propDescription &&
            primitiveType &&
            alarmProperityName &&
            alarmProperityDescription
        ) {
            this.plantInterface.supos = CreatProperityConfig(
                objectName,
                // objectDisplayName ,
                // objectDscription ,
                propName,
                propDisplayName,
                propDescription,
                primitiveType,
                // propValue: number,
                alarmProperityName,
                // alarmPropDisplayName ,
                alarmProperityDescription
            );
            return await this.plantInterface.post();
        }
    }
    async creatProperityExcludeAlarm(): Promise<any> {
        const { objectName, propName, propDisplayName, propDescription, primitiveType } =
            this.properityInfo;
        if (objectName && propName && propDisplayName && propDescription && primitiveType) {
            this.plantInterface.supos = CreatProperityExcludeAlarmConfig(
                objectName,
                propName,
                propDisplayName,
                propDescription,
                primitiveType
            );
            return await this.plantInterface.post();
        } else {
            throw new Error("数据输入不足");
        }
    }
    async creatProperity(): Promise<any> {
        const {
            objectName,
            propName,
            propDisplayName,
            propDescription,
            primitiveType,
            alarmProperityName,
            // alarmPropDisplayName ,
            alarmProperityDescription
        } = this.properityInfo;
        if (
            objectName &&
            propName &&
            propDisplayName &&
            propDescription &&
            primitiveType &&
            !alarmProperityName &&
            !alarmProperityDescription
        ) {
            this.plantInterface.supos = CreatProperityExcludeAlarmConfig(
                objectName,
                propName,
                propDisplayName,
                propDescription,
                primitiveType
            );
            return await this.plantInterface.post();
        } else if (
            objectName &&
            propName &&
            propDisplayName &&
            propDescription &&
            primitiveType &&
            alarmProperityName &&
            alarmProperityDescription
        ) {
            this.plantInterface.supos = CreatProperityConfig(
                objectName,
                // objectDisplayName ,
                // objectDscription ,
                propName,
                propDisplayName,
                propDescription,
                primitiveType,
                // propValue: number,
                alarmProperityName,
                // alarmPropDisplayName ,
                alarmProperityDescription
            );
            return await this.plantInterface.post();
        } else {
            throw new Error("数据输入不足");
        }
    }
    async rmObject(): Promise<any> {
        let { objectName } = this.properityInfo;
        // if (this.alarmInfo) {
        //     const { alarmObjname } = this.alarmInfo;
        //     objectName = alarmObjname;
        // }
        if (objectName) {
            this.plantInterface.supos = rmObjectConfig(objectName);
            let res = await this.plantInterface.delete();
            return res;
        } else {
            throw new Error("数据输入不足");
        }
    }
    async rmProperity(): Promise<any> {
        let { objectName, propName } = this.properityInfo;
        // if (this.alarmInfo) {
        //     const { alarmObjname, alarmParamName } = this.alarmInfo;
        //     objectName = alarmObjname;
        //     propName = alarmParamName;
        // }
        if (objectName && propName) {
            this.plantInterface.supos = rmProperityConfig(objectName, propName);
            let res = await this.plantInterface.delete();
            return res;
        } else {
            throw new Error("数据输入不足");
        }
    }
}

const supOSEnvTest = async function () {
    let user = Container.get<User>("用户");
    await user.login();
    let supOSObjInstance = Container.get<CPlatformObject>("supOS平台对象属性设置类");
    supOSObjInstance.properityInfo = {
        objectName: "atest",
        // propName: ""
        objectDisplayName: "创建对象测试",
        objectDescription: "测试描述",
        propName: "Property_012",
        propDisplayName: "ee",
        propDescription: "t11描述",
        primitiveType: "Double",
        alarmProperityName: "Assd11",
        alarmProperityDescription: "报警参数描述11"
    };
    // supOSObjInstance.properityInfo = {
    //     objectName: "aatest",
    //     // propName: ""
    //     objectDisplayName: "创建对象测试",
    //     objectDescription: "测试描述",
    //     propName: "t11",
    //     propDisplayName: "t11名称",
    //     propDescription: "t11描述",
    //     primitiveType: "Double",
    //     alarmProperityName: "Assd11",
    //     alarmProperityDescription: "报警参数描述11"
    // };
    // supOSObjInstance.properityInfo = {
    //     alarmObjname: "aatest",
    //     // propName: ""
    //     alarmObjDisplayName: "创建对象测试",
    //     alarmObjDescription: "测试描述",
    //     alarmParamName: "t1",
    //     alarmParamDisplayName: "t1名称",
    //     alarmParamDescription: "t1描述",
    //     alarmProperityName: "a1s",
    //     alarmProperityDisplayName: "报警名称",
    //     alarmProperityDescription: "报警描述"
    // };
    // eslint-disable-next-line space-unary-ops
    let res = [];
    for (var i = 0; i < 10; i++) {
        supOSObjInstance.propSetValue = 121 + i;
        // return await supOSObjInstance.creatProperityExcludeAlarm();
        // await supOSObjInstance.rmProperity();
        // await supOSObjInstance.creatProperity();
        res.push(await supOSObjInstance.setPropertyValue());
    }
    return res;
};
supOSEnvTest().then((item) => {
    console.log("item", item);
});
// async function supos(){

// }
