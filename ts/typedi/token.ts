/*
 * @Author: your name
 * @Date: 2021-08-30 17:29:30
 * @LastEditTime: 2021-08-31 23:45:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\typedi\token.ts
 */
// Factory.ts
import 'reflect-metadata';
import { Container, Service, Token } from 'typedi';

interface Factory {
    // name: string;
    create(): any;
}
class Factory1 {
    // name: string;
    create(): any {
        console.log('ss');
    }
}
// FactoryToken.ts
const FactoryToken = new Token<Factory1>('factories');

// BeanFactory.ts
@Service({ id: FactoryToken, multiple: true })
class BeanFactory implements Factory {
    create() {
        console.log('bean created');
    }
}

// SugarFactory.ts
@Service({ id: FactoryToken, multiple: true })
class SugarFactory implements Factory {
    create() {
        console.log('sugar created');
    }
}

// WaterFactory.ts
@Service({ id: FactoryToken, multiple: true })
class WaterFactory implements Factory {
    create() {
        console.log('water created');
    }
}

// app.ts
// now you can get all factories in a single array
// Container.import([BeanFactory, SugarFactory]);
const factories = Container.getMany(FactoryToken); // factories is Factory[]
factories.forEach((factory) => factory.create());
console.log('FactoryToken', FactoryToken);
