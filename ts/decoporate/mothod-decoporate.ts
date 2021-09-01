/*
 * @Author: your name
 * @Date: 2021-08-30 20:04:48
 * @LastEditTime: 2021-08-31 10:36:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\decoporate\mothod-decoporate.ts
 */
export module decoporate {
    function first() {
        console.log('first(): factory evaluated');
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log('first(): called', target, descriptor);
        };
    }

    function second() {
        console.log('second(): factory evaluated');
        return function get(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log('second(): called');
        };
    }

    export class ExamClass {
        // second: any;
        @first()
        @second()
        method() {
            console.log('method() called');
        }
    }

    // const cl = new ExamClass();
    // cl.method();
}
