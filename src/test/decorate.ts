/*
 * @Author: your name
 * @Date: 2021-08-31 11:02:21
 * @LastEditTime: 2021-08-31 11:05:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\test\decorate.ts
 */
function logParams(params: any) {
    return function (target: any, methodName: any, paramsIndex: any) {
        console.log(1, params);
        console.log(2, target);
        console.log(3, methodName);
        console.log(4, paramsIndex);

        // 增加属性
        target.apiUrl = params;
    };
}

class HttpClient {
    [x: string]: any;
    public url: any | undefined;
    constructor() {}

    getData(@logParams('uuid44') uuid: any) {
        console.log('我是getData里面的方法,uuid=', uuid);
    }
}

let http = new HttpClient();

http.getData(123456);

console.log(5, http.apiUrl);
