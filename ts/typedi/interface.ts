/*
 * @Author: your name
 * @Date: 2021-08-30 18:45:57
 * @LastEditTime: 2021-08-31 23:34:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\typedi\interface.ts
 */
import 'reflect-metadata';
import { Container, Service, Inject } from 'typedi';

export interface Factory {
    name: string;
    create(): void;
}

@Service('bean.factory')
class BeanFactory implements Factory {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    create() {
        console.log('BeanFactory');
    }
}

@Service('sugar.factory')
class SugarFactory implements Factory {
    public name!: string;
    constructor(name: string) {
        this.name = name;
    }
    create() {
        console.log('SugarFactory');
        console.log('name', this.name);
    }
}

@Service('water.factory')
export class WaterFactory implements Factory {
    public name!: string;
    constructor(name: string) {
        this.name = name;
    }
    set(d: string) {
        this.name = d;
    }
    create() {
        console.log('WaterFactory');
        console.log('name', this.name);
    }
}

@Service('coffee.maker')
export class CoffeeMaker {
    beanFactory: Factory;
    sugarFactory: Factory;

    @Inject('water.factory')
    waterFactory!: Factory;

    constructor(
        @Inject('bean.factory') beanFactory: BeanFactory,
        @Inject('sugar.factory') sugarFactory: SugarFactory
    ) {
        this.beanFactory = beanFactory;
        this.sugarFactory = sugarFactory;
    }

    make() {
        this.beanFactory.create();
        this.sugarFactory.create();
        // WaterFactory.name = 'sss';
        this.waterFactory.name = 'dd44'; //* 实例化对象赋值
        this.waterFactory.create();
    }
}

let coffeeMaker = Container.get<CoffeeMaker>('coffee.maker');
let waterMaker = Container.get<Factory>('water.factory');
coffeeMaker.make();
// BeanFactory.name = 'sss';

// waterMaker.create();
// let factory = Container.get(CoffeeMaker);
// factory.make();
