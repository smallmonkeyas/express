/*
 * @Author: your name
 * @Date: 2021-08-30 15:26:03
 * @LastEditTime: 2021-09-01 13:32:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\typedi\demo.ts
 */
import 'reflect-metadata';

import { Container, Inject, Service } from 'typedi';
import { CVendorData, IVendorData } from '../../src/module/vendor';
import { request, system } from '../../modulejs';
Container.import([CVendorData]);

@Service()
class BeanFactory {
    create() {
        console.log('BeanFactory');
    }
}

@Service()
class SugarFactory {
    create() {
        console.log('SugarFactory');
    }
}

@Service()
class WaterFactory {
    create() {
        console.log('WaterFactory');
    }
}
// @Service()
// interface ICoffee {
//     creat(): void;
// }

// @Service()
// class CCoffee implements ICoffee {
//     creat(): void {
//         console.log('能成功吧！');
//     }
// }
@Service()
abstract class ACoffee {
    @Inject()
    waterFactory!: WaterFactory;
    make(): void {}
}
@Service()
class CCoffee extends ACoffee {
    waterFactory!: WaterFactory;
    make(): void {
        this.waterFactory.create();
        console.log('抽象可行！');
    }
}

@Service('shi')
class CoffeeMaker {
    @Inject()
    beanFactory!: BeanFactory;

    @Inject()
    sugarFactory!: SugarFactory;

    @Inject()
    waterFactory!: WaterFactory;

    // @Inject()
    // coffeeFactory!: ICoffee;
    make() {
        this.beanFactory.create();
        this.sugarFactory.create();
        this.waterFactory.create();
        // this.coffeeFactory.creat();
    }
}
//* 企业接入类
@Service('企业所有接入')
class CFactoryDataReceive {
    vendorConfig: string;
    // @Inject('贴源数据接口')
    // vendorHandler!: CVendorData;
    constructor(vendor: string) {
        this.vendorConfig = vendor;
    }
    // getCollector() {
    //     this.vendorHandler.vendor = this.vendorConfig;
    //     this.vendorHandler.get();
    //     //     const params = { epcode: '320400010005', mode: 1 };
    //     //     const res = vendor.get('serverapi/data/rtd', JSON.stringify(params));
    // }
    set() {
        console.log('吃啥');
    }
}
// let coffeeMaker = Container.get(CoffeeMaker);
// let coffeeMaker = Container.get<CoffeeMaker>('shi');
// coffeeMaker.make();
// console.log('coffeeMaker', coffeeMaker);

// let coffeeMake = Container.get(CCoffee);
// coffeeMake.make();
// console.log('coffeeMake', coffeeMake);
let handler = Container.get<CFactoryDataReceive>('企业所有接入');
handler.set();
