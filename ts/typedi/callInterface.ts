/*
 * @Author: your name
 * @Date: 2021-08-31 00:19:08
 * @LastEditTime: 2021-08-31 00:29:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\typedi\callInterface.ts
 */
import { Factory, CoffeeMaker, WaterFactory } from './interface';
import { Container, Service, Inject } from 'typedi';

Container.import([CoffeeMaker, WaterFactory]);
// let coffeeMaker = Container.get<CoffeeMaker>('coffee.maker');
let waterMaker = Container.get<WaterFactory>('water.factory');
let waterMaker1 = Container.get<Factory>('water.factory');
// coffeeMaker.make();

waterMaker.create();
waterMaker1.create();
