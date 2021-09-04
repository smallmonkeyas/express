/*
 * @Author: your name
 * @Date: 2021-09-01 22:28:47
 * @LastEditTime: 2021-09-02 08:53:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\factory.config.ts
 */
export interface IFactoryStruct {
    id: number | string;
    objname: string;
    displayname: string;
    description: string;
    type: string | number;
    status: number | string;
    mn: string;
    st: string | number;
    epcode: string | number;
    remark: string;
    period: string;
}
export const FactoryStruct = {
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
};
