/*
 * @Author: your name
 * @Date: 2021-09-03 13:49:10
 * @LastEditTime: 2021-10-18 23:55:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\user.ts
 */
import { loginConfig } from "../config"
import { request, system } from "../../modulejs"
import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
import { CSupOSData } from "./supos"
// TODO: 用户登录
@Service("用户")
export class User {
    login() {
        var options = {
            method: "POST",
            url: `${loginConfig.netAddress}/${loginConfig.netPath}`,
            headers: {
                "Content-Type": "application/json",
                Cookie: "vertx-web.session=79b80599135735456f355b89d4775ac8"
            },
            body: JSON.stringify(loginConfig.netData)
        }
        return new Promise(function (resolve, reject) {
            request(options, function (error: any, response: { body: string }) {
                if (error) {
                    resolve({ error: error })
                }
                const result = JSON.parse(response.body)
                let authorization = `Bearer ${result.ticket}`
                Container.set("authorization-token", authorization) // 设置全局authorization
                // global.authorization = authorization;
                // console.log(response.body);
                resolve(result)
            })
        })
    }
}

// ?用户安全登录测试
// const usr = async function () {
//     let userHandler = Container.get<User>('用户');
//     const res = await userHandler.login();
//     Container.import([CSupOSData]);
//     let suposHandler = Container.get<CSupOSData>('supOS数据接口');

//     console.log(res, suposHandler.authorizationToken);
//     return suposHandler.authorizationToken;
// };

// usr().then((item) => {
//     console.log('res', item);
// });
