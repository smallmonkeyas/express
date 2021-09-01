/*
 * @Author: your name
 * @Date: 2021-08-30 14:14:55
 * @LastEditTime: 2021-08-30 14:16:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\ts\tyscript-ioc\demo.ts
 */
import { Inject } from 'typescript-ioc';

class PersonDAO {
    @Inject
    restProxy: PersonRestProxy;
}
let personDAO: PersonDAO = new PersonDAO();
