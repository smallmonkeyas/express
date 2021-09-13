/*
 * @Author: your name
 * @Date: 2021-09-02 23:03:24
 * @LastEditTime: 2021-09-13 11:56:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\supos.config.ts
 */
import { ISupOSConfig } from "./interface.config";
import { properityInfo, objectInfo, properityExcludeAlarmInfo } from "./supos";
import { netIPAddress } from "./net.config";
const netAddressConfig = {
    IPAddress: netIPAddress,
    Port: "8080"
};
const netAddress = `http://${netAddressConfig.IPAddress}:${netAddressConfig.Port}`;

// export const collectorUrlConfig: ISupOSConfig = {
//     netAddress: netAddress,
//     netPath: 'serverapi/cfg/collector'
// };

export const CreatProperityConfig = function (
    objectName: string,
    // objectDisplayName: string,
    // objectDscription: string,
    propName: string,
    propDisplayName: string,
    propDescription: string,
    primitiveType: string,
    // propValue: number,
    alarmPropName: string,
    // alarmPropDisplayName: string,
    alarmPropDescription: string
) {
    return {
        netAddress: netAddress,
        netPath: `api/metadata/objects/${objectName}/properties`,
        netData: properityInfo(
            objectName,
            // objectDisplayName,
            // objectDscription,
            propName,
            propDisplayName,
            propDescription,
            primitiveType,
            // propValue,
            alarmPropName,
            // alarmPropDisplayName,
            alarmPropDescription
        )
    };
};

export const CreatProperityExcludeAlarmConfig = function (
    objectName: string,
    propName: string,
    propDisplayName: string,
    propDescription: string,
    primitiveType: string
) {
    return {
        netAddress: netAddress,
        netPath: `api/metadata/objects/${objectName}/properties`,
        netData: properityExcludeAlarmInfo(
            objectName,
            propName,
            propDisplayName,
            propDescription,
            primitiveType
        )
    };
};
export const rmProperityConfig = function (objectName: string, propName: string) {
    return {
        netAddress: netAddress,
        netPath: `api/metadata/objects/${objectName}/properties/${propName}`
    };
};

export const CreatObjectConfig = function (
    objectName: string,
    objectDisplayName: string,
    objectDscription: string
) {
    return {
        netAddress: netAddress,
        netPath: "api/metadata/objects",
        netData: objectInfo(objectName, objectDisplayName, objectDscription)
    };
};
export const rmObjectConfig = function (objectName: string) {
    return {
        netAddress: netAddress,
        netPath: `api/metadata/objects/${objectName}`
    };
};

export const SetPropertyValueNetConfig = function (
    objectName: string,
    propName: string,
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
export const SetPropertyValuesNetConfig = function (objectName: string, propValues: object) {
    return {
        netAddress: netAddress,
        netPath: `api/runtime/objects/${objectName}/debugServices/setPropertyValues`,
        netData: {
            propValues: JSON.stringify(propValues).replace(/[\\""']*/g, "")
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
export const GetPropertyValuesNetConfig = function (objectName: string, name: string) {
    return {
        netAddress: netAddress,
        netPath: `api/runtime/objects/${objectName}/debugServices/getPropertyValues`,
        netData: {
            propNames: `${name}`
        }
    };
    // response.body
    // {
    //     "result": 11.0,
    //     "logs": "[]"
    // }
};

export const GetPropertyInfosNetConfig = function (
    objectName: string,
    netParam: { type: string; page: number; per_page: number }
) {
    return {
        netAddress: netAddress,
        netPath: `api/metadata/objects/${objectName}/properties`,
        netParam: netParam // ?type=own&page=1&per_page=200
    };
    // response.body
    // {
    //     "result": 11.0,
    //     "logs": "[]"
    // }
};
export interface ISuposObjects {
    objectName: string;
    objectDisplayName: string;
    objectDescription: string;
}
export interface ISuposProperity {
    objectName: string;
    objectDisplayName?: string;
    objectDescription?: string;
    propName?: string;
    propDisplayName?: string;
    propDescription?: string;
    primitiveType?: string;
    alarmProperityName?: string;
    alarmProperityDisplayName?: string;
    alarmProperityDescription?: string;
}
