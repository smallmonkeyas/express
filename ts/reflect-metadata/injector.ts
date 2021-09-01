/*
 * @Author: your name
 * @Date: 2021-08-30 11:34:47
 * @LastEditTime: 2021-08-30 13:26:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\reflect-metadata\injector.ts
 */
import 'reflect-metadata';
// Injector.ts
interface Type<T> {
    new (...args: any[]): T;
}

export const Injector = new (class {
    // resolving instances
    resolve<T>(target: Type<any>): T {
        // tokens are required dependencies, while injections are resolved tokens from the Injector
        let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
            injections = tokens.map((token: any) => Injector.resolve<any>(token));

        return new target(...injections);
    }
})();

// export const d = new Date {}
