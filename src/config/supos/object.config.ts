/*
 * @Author: your name
 * @Date: 2021-09-03 00:24:26
 * @LastEditTime: 2021-09-03 00:26:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\supos\object.config.ts
 */
export const objectInfo = function (
    objectName: string,
    objectDisplayName: string,
    objectDscription: string
) {
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
