/*
 * @Author: your name
 * @Date: 2021-08-27 13:37:43
 * @LastEditTime: 2021-08-27 13:46:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\ts.ts
 */
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

class ExampleClass {
    @first()
    @second()
    method() {
        console.log('method() called');
    }
}

const cl = new ExampleClass();
cl.second.method();
