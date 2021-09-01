/*
 * @Author: your name
 * @Date: 2021-08-31 10:35:51
 * @LastEditTime: 2021-08-31 10:38:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\decoporate\callDecorate.ts
 */
import { decoporate } from './mothod-decoporate';
const { ExamClass } = decoporate;
console.log(decoporate);
console.log(ExamClass);
const cl = new ExamClass();
cl.method();
