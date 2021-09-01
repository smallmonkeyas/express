/* eslint-disable no-use-before-define */
/*
 * @Author: your name
 * @Date: 2021-08-31 22:06:38
 * @LastEditTime: 2021-08-31 23:48:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\typedi\service_object.ts
 */
import { Container, Service } from 'typedi';

// const FactoryToken = new Token<Factory>('factories');

// 注入一个对象,创建
function createCar(name: string) {
    return new Car(name);
}
function createCar2() {
    return new Car('V9');
}

// @Service({ factory: createCar1 }) // 使用注入的对象
@Service({ factory: createCar }) // 使用注入的对象
class Car {
    engineType: string;
    constructor(engineType: string) {
        this.engineType = engineType;
    }
}
// 创建实例
const car = Container.get(Car);
console.log(car.engineType); // 打印 "V8"
