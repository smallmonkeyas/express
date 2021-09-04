/* eslint-disable no-unused-vars */
/*
 * @Author: your name
 * @Date: 2021-08-31 18:28:46
 * @LastEditTime: 2021-09-03 13:46:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\interface.ts
 */
// ! MongoDB接口配置
export interface ImongodbConfig {
    ip: string;
    datasename: string;
    collectionname: string;
    schema: Object;
}
// ! 第三方接口配置
export interface IVendorConfig {
    netAddress: string; // 10.32.203.157:8999
    netPath?: string; // serverapi/data/rtd
    netParam?: object; // ? epcode=320400010005&mode=1=>{epcode:'320400010005',mode:1,}
    netData?: Object;
}
// ! supos接口配置
export interface ISupOSConfig {
    netAddress: string; // 10.32.203.157:8080
    netPath?: string; // api/metadata/objects/objectV1/properties
    netParam?: object; //  ?xxx
    netData?: Object; // post data
    // authorization: string;
}
export interface IVendorResponseConfig {
    error: number;
    info: string; // success||failed
    data: Array<any>;
}
// ! 本地文件属性接口
export interface IFile {
    fileName: string;
    filePath: string;
    fileExtension?: string;
    fileCode?: string;
}

// ! 本地持久化保存->保存到本地文件
// export interface IFilePersistence{

// }
