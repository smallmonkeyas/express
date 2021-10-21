"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectInfo = void 0;
/*
 * @Author: your name
 * @Date: 2021-09-03 00:24:26
 * @LastEditTime: 2021-09-03 00:26:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\supos\object.config.ts
 */
const objectInfo = function (objectName, objectDisplayName, objectDscription) {
    return {
        showName: objectDisplayName,
        templateName: 'GenericObject',
        name: objectName,
        description: objectDscription,
        icon: '',
        range: 'public',
        status: true
    };
};
exports.objectInfo = objectInfo;
