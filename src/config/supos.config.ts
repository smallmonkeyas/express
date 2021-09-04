/*
 * @Author: your name
 * @Date: 2021-09-02 23:03:24
 * @LastEditTime: 2021-09-03 23:10:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\supos.config.ts
 */
import { ISupOSConfig } from './interface.config';
import { properityInfo, objectInfo } from './supos';
const netAddressConfig = {
    IPAddress: '10.32.203.157',
    Port: '8080'
};
const netAddress = `http://${netAddressConfig.IPAddress}:${netAddressConfig.Port}`;

// export const collectorUrlConfig: ISupOSConfig = {
//     netAddress: netAddress,
//     netPath: 'serverapi/cfg/collector'
// };

export const CreatProperityConfig = function (
    objectName: string,
    objectDisplayName: string,
    objectDscription: string,
    propName: string,
    propDisplayName: string,
    propDescription: string,
    propValue: number,
    alarmPropName: string,
    alarmPropDisplayName: string,
    alarmPropDescription: string
) {
    return {
        netAddress: netAddress,
        netPath: `api/metadata/objects/${objectName}/properties`,
        netData: properityInfo(
            objectName,
            objectDisplayName,
            objectDscription,
            propName,
            propDisplayName,
            propDescription,
            propValue,
            alarmPropName,
            alarmPropDisplayName,
            alarmPropDescription
        )
    };
};

export const CreatObjectConfig = function (
    objectName: string,
    objectDisplayName: string,
    objectDscription: string
) {
    return {
        netAddress: netAddress,
        netPath: 'api/metadata/objects',
        netData: objectInfo(objectName, objectDisplayName, objectDscription)
    };
};

export const SetPropertyValueNetConfig = function (
    objectName: string,
    objectDisplayName: string,
    objectDscription: string,
    propName: string,
    propDisplayName: string,
    propDescription: string,
    propValue: number
) {
    return {
        netAddress: netAddress,
        netPath: `api/runtime/objects/${objectName}/debugServices/setPropertyValue`,
        netData: {
            propName: `${propName}`,
            propValue: `${propValue}`
        }
    };
    // response.body
    // {
    //     "result": null,
    //     "logs": "[]"
    // }
};

export const GetPropertyValueNetConfig = function (objectName: string, propName: string) {
    return {
        netAddress: netAddress,
        netPath: `api/runtime/objects/${objectName}/debugServices/getPropertyValue`,
        netData: {
            propName: `${propName}`
        }
    };
    // response.body
    // {
    //     "result": 11.0,
    //     "logs": "[]"
    // }
};
