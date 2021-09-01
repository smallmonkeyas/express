/*
 * @Author: your name
 * @Date: 2021-08-25 15:17:14
 * @LastEditTime: 2021-09-01 16:25:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\mongodb.config.ts
 */
const factoryConfig = {
    ip: 'localhost:27017',
    datasename: 'workCondition_subSystem',
    collectionname: 'Factory',
    schema: {
        id: { type: Number },
        objname: { type: String },
        displayname: { type: String },
        description: { type: String },
        type: { type: String },
        status: { type: Number },
        mn: { type: String },
        st: { type: String },
        epcode: { type: String },
        remark: { type: String },
        period: { type: String }
    }
};
const ruletableConfig = {
    ip: 'localhost:27017',
    datasename: 'workCondition_subSystem',
    collectionname: 'Ruletale',
    schema: {
        id: { type: Number },
        name: { type: String },
        content: { type: String },
        paramInclude: { type: String },
        factoryCatatory: { type: String },
        ruleType: { type: String },
        enabled: { type: String },
        creatTime: { type: String },
        epcode: { type: String },
        ruleConfigParam: { type: String },
        objectName: { type: String },
        flagParam: { type: String },
        SetValue: { type: String },
        SetFlagValue: { type: String }
    }
};
export { factoryConfig, ruletableConfig };

// export interface ImongodbConfig {
//     ip: string;
//     datasename: string;
//     collectionname: string;
//     schema: Object;
// }
