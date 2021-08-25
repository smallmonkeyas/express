/*
 * @Author: your name
 * @Date: 2021-08-23 00:40:51
 * @LastEditTime: 2021-08-24 00:56:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\app.ts
 */
// let a:number;
// a = 10;
// interface ss {}
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim(); // errors
