/*
 * @Author: your name
 * @Date: 2021-08-30 13:26:28
 * @LastEditTime: 2021-08-30 13:33:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\reflect-metadata\main.ts
 */
import 'reflect-metadata';
type GenericClassDecorator<T> = (target: T) => void;
interface Type<T> {
    new (...args: any[]): T;
}
const Service = (): GenericClassDecorator<Type<object>> => {
    return (target: Type<object>) => {
        // do something with `target`, e.g. some kind of validation or passing it to the Injector and store them
    };
};
const Injector = new (class {
    // resolving instances
    resolve<T>(target: Type<any>): T {
        // tokens are required dependencies, while injections are resolved tokens from the Injector
        let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
            injections = tokens.map((token: any) => Injector.resolve<any>(token));

        return new target(...injections);
    }
})();
@Service()
class Foo {
    doFooStuff() {
        console.log('foo');
    }
}

@Service()
class Bar {
    constructor(public foo: Foo) {}

    doBarStuff() {
        console.log('bar');
    }
}

@Service()
class Foobar {
    constructor(public foo: Foo, public bar: Bar) {}
}

const foobar = Injector.resolve<Foobar>(Foobar);
foobar.bar.doBarStuff();
foobar.foo.doFooStuff();
foobar.bar.foo.doFooStuff();
