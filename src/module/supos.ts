/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-08-25 15:00:34
 * @LastEditTime : 2021-12-23 20:42:16
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/module/supos.ts
 */

import { request, unirest, system, ExcelTemplate, Excel, fs, stream } from "../../modulejs"
import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
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
    rmObjectConfig,
    objnameTempleFileConfig,
    alarmObjFileConfig,
    GetAlarmObjFileNetConfig
} from "../config"
import { User } from "./user"
Container.import([User])

export interface ISupOSData {
    supos: ISupOSConfig
    get(): object
    post(): object
}

@Service("supOS数据接口")
export class CSupOSData implements ISupOSData {
    supos!: ISupOSConfig
    @Inject("authorization-token")
    authorizationToken!: string // 需要在用户登录后通过全局预设
    get(): Promise<any> {
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params
        if (!this.supos) {
            throw new Error("api接口输入数据不足")
        }
        url = this.supos.netAddress
        if (this.supos.netPath) {
            url = `${this.supos.netAddress}/${this.supos.netPath}`
        }
        if (this.supos.netParam) {
            let paramObj, paramStr
            paramObj = this.supos.netParam
            paramStr = JSON.stringify(paramObj)
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"?(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "")
            url = `${this.supos.netAddress}/${this.supos.netPath}?${params}`
        }

        //   const authorization = global.authorization;
        let options = {
            method: "GET",
            url: url,
            headers: {
                Authorization: Container.get("authorization-token"),
                "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            }
            // body: JSON.stringify(this.supos.netData)
        }
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error)
                }
                let res = response
                    ? response.body
                        ? system.isJSON(response.body)
                            ? JSON.parse(response.body)
                            : response.body
                        : response
                    : "错误请求"

                // let res = JSON.parse(response.body);
                // if (res instanceof IVendorResponseConfig) {
                // resolve(res);
                // return { error: 1, info: 'success', data: [] };
                // }
                resolve(res)
            })
        })
    }
    post(): Promise<any> {
        Container.import([User])
        let supos = JSON.parse(JSON.stringify(this.supos))
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params
        if (!supos) {
            throw new Error("supos接口输入数据不足")
        }
        url = supos.netAddress
        if (supos.netPath) {
            url = `${supos.netAddress}/${supos.netPath}`
        }
        if (supos.netParam) {
            let paramObj, paramStr
            paramObj = supos.netParam
            paramStr = JSON.stringify(paramObj)
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"?(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "")
            url = `${supos.netAddress}/${supos.netPath}?${params}`
        }

        //   const authorization = global.authorization;
        let options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: Container.get("authorization-token"),
                "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            },
            // body: JSON.stringify({
            //     propName: "QCL_TLT_SO2_01_L"
            // })
            body: JSON.stringify(supos.netData)
        }
        let authorization = this.authorizationToken
        return new Promise(function (resolve, reject) {
            // console.log("options", supos, options)
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                // if (error) {
                //     throw new Error(error);
                // }
                console.log(
                    "this.authorizationToken",
                    authorization,
                    "User.token:",
                    Container.get("authorization-token")
                )
                if (error) {
                    resolve(error)
                }
                let res = response
                    ? response.body
                        ? system.isJSON(response.body)
                            ? JSON.parse(response.body)
                            : response.body
                        : response
                    : response
                // let res = JSON.parse(response.body);
                // if (res instanceof IVendorResponseConfig) {
                // resolve(res);
                // return { error: 1, info: 'success', data: [] };
                // }
                resolve(res)
            })
        })
    }
    postForm() {
        let supos = JSON.parse(JSON.stringify(this.supos))
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url: string, router, params
        if (!supos) {
            throw new Error("supos接口输入数据不足")
        }
        url = supos.netAddress
        if (supos.netPath) {
            url = `${supos.netAddress}/${supos.netPath}`
        }
        if (supos.netParam) {
            let paramObj, paramStr
            paramObj = supos.netParam
            paramStr = JSON.stringify(paramObj)
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"?(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "")
            url = `${supos.netAddress}/${supos.netPath}?${params}`
        }
        let header = {
            Authorization: Container.get("authorization-token"),
            Cookie: "vertx-web.session=5102a8ff0d1c27d4224e4bf794e65123"
        }
        const { file, ...args } = supos.netData
        return new Promise(function (resolve, reject) {
            var req = unirest("POST", url)
                .headers(header)
                .attach(
                    {
                        file: file
                    }
                    // "file",
                    // "E:/files/program/docker/debian/express/src/respository/objname/报警对象实例.xlsx"
                )
                .field(args)
                // .field("type", "object")
                // .field("skipOnError", "false")
                .end(function (res: any) {
                    if (res.error) {
                        resolve(res.error)
                        throw new Error(res.error)
                    }
                    resolve(res.raw_body)
                    console.log(res.raw_body)
                })
        })
    }
    postFile(): Promise<any> {
        let supos = JSON.parse(JSON.stringify(this.supos))
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params
        if (!supos) {
            throw new Error("supos接口输入数据不足")
        }
        url = supos.netAddress
        if (supos.netPath) {
            url = `${supos.netAddress}/${supos.netPath}`
        }
        if (supos.netParam) {
            let paramObj, paramStr
            paramObj = supos.netParam
            paramStr = JSON.stringify(paramObj)
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"?(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "")
            url = `${supos.netAddress}/${supos.netPath}?${params}`
        }
        // console.log("supos.netData", supos.netData)
        //   const authorization = global.authorization;
        let options = {
            method: "POST",
            url: url,
            headers: {
                Authorization: Container.get("authorization-token"),
                // "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            },
            // body: JSON.stringify({
            //     propName: "QCL_TLT_SO2_01_L"
            // })
            formData: supos.netData
        }
        return new Promise(function (resolve, reject) {
            // console.log("options", supos, options);
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                // if (error) {
                //     throw new Error(error);
                // }
                if (error) {
                    console.log("错误")
                    resolve(error)
                }
                let res = response
                    ? response.body
                        ? system.isJSON(response.body)
                            ? JSON.parse(response.body)
                            : response.body
                        : response
                    : response
                // let res = JSON.parse(response.body);
                // if (res instanceof IVendorResponseConfig) {
                // resolve(res);
                // return { error: 1, info: 'success', data: [] };
                // }
                resolve(res)
            })
        })
    }
    delete(): Promise<any> {
        // let arguments = args;
        // const ip = this.ip;
        let paramsObj, url, router, params
        if (!this.supos) {
            throw new Error("supos接口输入数据不足")
        }
        url = this.supos.netAddress
        if (this.supos.netPath) {
            url = `${this.supos.netAddress}/${this.supos.netPath}`
        }
        if (this.supos.netParam) {
            let paramObj, paramStr
            paramObj = this.supos.netParam
            paramStr = JSON.stringify(paramObj)
            // params = paramsObj.replace(/[\"\"{}]/g,"").replace(/:/g,"="),replace(/,/g,"&");
            params = paramStr
                .replace(/\"(:{1})(\")?/g, "=")
                .replace(/\"?(,{1})\"/g, "&")
                .replace(/[{}\"]/g, "")
            url = `${this.supos.netAddress}/${this.supos.netPath}?${params}`
        }

        //   const authorization = global.authorization;
        let options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: Container.get("authorization-token"),
                // "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135734456f355ba9d47a5ac8"
            }
            // body: JSON.stringify({
            //     propName: "QCL_TLT_SO2_01_L"
            // })
            // body: JSON.stringify(this.supos.netData)
        }
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                // let res: IVendorResponseConfig;
                if (error) {
                    throw new Error(error)
                }
                let res = response
                    ? response.body
                        ? system.isJSON(response.body)
                            ? JSON.parse(response.body)
                            : response.body
                        : response
                    : "错误请求"
                // resolve(response.body);

                // let res = JSON.parse(response.body);
                // // if (res instanceof IVendorResponseConfig) {
                // // resolve(res);
                // // return { error: 1, info: 'success', data: [] };
                // // }
                resolve(res)
            })
        })
    }
}

//* supos工业操作系统平台上对象实例对象属性
@Service("supOS平台对象属性设置类")
export class CPlatformObject {
    @Inject("supOS数据接口")
    plantInterface!: CSupOSData
    properityInfo!: ISuposProperity
    // alarmInfo!: IAlarmBasicStruct;
    // alarmSetValue!: number;
    propSetValue!: number
    // alarmGetValue
    //* 设置属性值
    async setPropertyValue() {
        let { objectName, propName } = this.properityInfo
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
            )
            return await this.plantInterface.post()
        }
    }
    async getProperityValue(): Promise<any> {
        let { objectName, propName } = this.properityInfo
        // if (this.alarmInfo) {
        //     const { alarmObjname, alarmParamName } = this.alarmInfo;
        //     objectName = alarmObjname;
        //     propName = alarmParamName;
        // }
        if (objectName && propName) {
            this.plantInterface.supos = GetPropertyValueNetConfig(objectName, propName)
            let res: { result: number; [prop: string]: any } = await this.plantInterface.post()
            return res.result
        } else {
            throw new Error("数据输入不足")
        }
    }
    //* 创建对象实例
    async creatObject(): Promise<any> {
        let { objectName, objectDisplayName, objectDescription } = this.properityInfo
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
            )
            return await this.plantInterface.post()
        } else {
            throw new Error("数据输入不足")
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
        } = this.properityInfo
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
            )
            return await this.plantInterface.post()
        }
    }
    async creatProperityExcludeAlarm(): Promise<any> {
        const { objectName, propName, propDisplayName, propDescription, primitiveType } =
            this.properityInfo
        if (objectName && propName && propDisplayName && propDescription && primitiveType) {
            this.plantInterface.supos = CreatProperityExcludeAlarmConfig(
                objectName,
                propName,
                propDisplayName,
                propDescription,
                primitiveType
            )
            return await this.plantInterface.post()
        } else {
            throw new Error("数据输入不足")
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
        } = this.properityInfo
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
            )
            return await this.plantInterface.post()
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
            )
            return await this.plantInterface.post()
        } else {
            throw new Error("数据输入不足")
        }
    }
    async rmObject(): Promise<any> {
        let { objectName } = this.properityInfo
        // if (this.alarmInfo) {
        //     const { alarmObjname } = this.alarmInfo;
        //     objectName = alarmObjname;
        // }
        if (objectName) {
            this.plantInterface.supos = rmObjectConfig(objectName)
            let res = await this.plantInterface.delete()
            return res
        } else {
            throw new Error("数据输入不足")
        }
    }
    async rmProperity(): Promise<any> {
        let { objectName, propName } = this.properityInfo
        // if (this.alarmInfo) {
        //     const { alarmObjname, alarmParamName } = this.alarmInfo;
        //     objectName = alarmObjname;
        //     propName = alarmParamName;
        // }
        if (objectName && propName) {
            this.plantInterface.supos = rmProperityConfig(objectName, propName)
            let res = await this.plantInterface.delete()
            return res
        } else {
            throw new Error("数据输入不足")
        }
    }
    //* 通过配置文件创建对象实例(包括实例和属性)
    async createAlarmObjInstanceByTemplateConfigFile(
        objdatas: Array<object>,
        propertydatas: Array<object>
    ): Promise<any> {
        const templateConfigFileDir = `${objnameTempleFileConfig.filePath}/${objnameTempleFileConfig.fileName}.${objnameTempleFileConfig.fileExtension}`
        const objInstanceOutFileDir = `${alarmObjFileConfig.filePath}/${alarmObjFileConfig.fileName}.${alarmObjFileConfig.fileExtension}`

        // todo: 读取配置文件模板文件
        const exlBuf = fs.readFileSync(templateConfigFileDir)
        // todo: 按照模板文件批量添加配置内容并生成配置文件
        const data = [[{ table_name: "添加对象实例", date: "2021-10-02" }], propertydatas, objdatas]

        // 用数据源(对象)data渲染Excel模板
        // cachePath 为编译缓存路径, 对于模板文件比较大的情况, 可显著提高运行效率, 绝对路径, 若不设置, 则无缓存
        const exlBuf2 = await ExcelTemplate.renderExcel(exlBuf, data, {
            cachePath: `${alarmObjFileConfig.filePath}/cache`
        })
        // var bufferStream = new stream.PassThrough()
        // // 将Buffer写入
        // bufferStream.end(exlBuf2)
        const workbook = new Excel.Workbook()
        //   let workbookOrigin = await workbook.xlsx.readFile(pathOutDir);
        await workbook.xlsx.load(exlBuf2)
        await workbook.xlsx.writeFile(objInstanceOutFileDir)
        // todo:按照系统提供的导入配置文件接口将配置文件导入系统，以此创建对象实例(原来系统没有的则创建，若有的则不更新)
        // 创建一个bufferstream
        // const streamValue = fs.createReadStream(
        //     "E:/Download_Temp/Google/对象实例创建测试/ejsExcel/ejsExcel/test/对象实例生成2.xlsx"
        // )

        // this.plantInterface.supos = GetAlarmObjFileNetConfig(
        //     "E:/Download_Temp/Google/对象实例创建测试/ejsExcel/ejsExcel/test/对象实例生成2.xlsx",
        //     streamValue
        // )
        this.plantInterface.supos = GetAlarmObjFileNetConfig(objInstanceOutFileDir)
        return await this.plantInterface.postForm()
        // return await this.plantInterface.postFile()
        // return this.plantInterface.supos
    }
}

const supOSEnvTest = async function () {
    let user = Container.get<User>("用户")
    await user.login()
    let supOSObjInstance = Container.get<CPlatformObject>("supOS平台对象属性设置类")
    // supOSObjInstance.properityInfo = {
    //     objectName: "atest",
    //     // propName: ""
    //     objectDisplayName: "创建对象测试",
    //     objectDescription: "测试描述",
    //     propName: "alarmtestDisplayName",
    //     propDisplayName: "ee",
    //     propDescription: "t11描述",
    //     primitiveType: "Double",
    //     alarmProperityName: "Assd11",
    //     alarmProperityDescription: "报警参数描述11"
    // };
    supOSObjInstance.properityInfo = {
        objectName: "aatest1",
        // propName: ""
        objectDisplayName: "创建对象测试",
        objectDescription: "测试描述",
        propName: "t111",
        propDisplayName: "t111名称",
        propDescription: "t111描述",
        primitiveType: "Double"
        // alarmProperityName: "assd11",
        // alarmProperityDescription: "报警参数描述11"
    }
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
    let res: any = []
    for (var i = 0; i < 10; i++) {
        supOSObjInstance.properityInfo = {
            objectName: "aatest1",
            // propName: ""
            objectDisplayName: "创建对象测试",
            objectDescription: "测试描述",
            propName: "s" + i,
            propDisplayName: "s" + i + "名称",
            propDescription: "s" + i + "描述",
            primitiveType: "Integer",
            alarmProperityName: "assd" + i,
            alarmProperityDescription: "报警参数描述" + i
        }
        supOSObjInstance.propSetValue = 700 + i
        //     // return await supOSObjInstance.creatProperityExcludeAlarm();
        // await supOSObjInstance.rmProperity();
        // res.push(await supOSObjInstance.creatProperity());
        res.push(await supOSObjInstance.setPropertyValue())
    }
    return res
}
// supOSEnvTest().then((item) => {
//     console.log("item", item);
// });
// async function supos(){

// }
