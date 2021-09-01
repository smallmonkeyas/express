/*
 * @Author: your name
 * @Date: 2021-08-23 00:40:51
 * @LastEditTime: 2021-08-25 14:37:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\app.ts
 */
// let a:number;
// a = 10;
// interface ss {}
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

function getSmallPet(): Fish | Bird {
    // ...
}
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
let pet = getSmallPet();
if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}
