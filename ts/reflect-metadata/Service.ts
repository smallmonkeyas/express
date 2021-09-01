/*
 * @Author: your name
 * @Date: 2021-08-30 13:29:15
 * @LastEditTime: 2021-08-30 13:30:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\reflect-metadata\Service.ts
 */
// ServiceDecorator.ts
import 'reflect-metadata';
const Service = (): GenericClassDecorator<Type<object>> => {
    return (target: Type<object>) => {
        // do something with `target`, e.g. some kind of validation or passing it to the Injector and store them
    };
};
