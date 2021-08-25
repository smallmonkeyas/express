/*
 * @Author: your name
 * @Date: 2021-08-21 17:14:41
 * @LastEditTime: 2021-08-21 18:36:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\script\class-test.js
 */
this.x = x
class test {
    constructor() {
        this.num = 100;

        
    }
    setfunc(){ 
        console.log(this.num); // 100
        setTimeout(function () {
            console.log(this.num); // undefined
        }, 500);
    };
}
var obj = new test();
obj.setfunc();
// ——————————————————————————————————————————————————————————————————

const testjs = function(dd,d) {
    console.log(dd,d)
}

