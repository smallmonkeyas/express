"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-10-18 12:55:41
 * @LastEditTime: 2021-10-19 00:35:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\service\excel-export\index.ts
 */
const modulejs_1 = require("../../../modulejs");
const module_1 = require("../../module");
require("reflect-metadata");
const typedi_1 = require("typedi");
typedi_1.Container.import([module_1.CSupOSData, module_1.User]);
let basicPath = modulejs_1.path.resolve(process.cwd(), "./");
// let basicPath = path.resolve(__dirname, "./")
console.log("basicPath", basicPath);
const test = async function () {
    let config = JSON.parse(modulejs_1.fs.readFileSync(`${basicPath}/config.json`));
    console.log("读取配置文件成功");
    let requestCollections = config["request-collection"];
    // let jsonArr
    let resObj = { "realtime-alarm": {}, "history-alarm": {} };
    if (config["linked"]) {
        console.log("选择联网模式");
        let user = typedi_1.Container.get("用户");
        await user.login();
        // if (loginRes.error) {
        //     throw new Error(loginRes.error)
        // }
        let suposRequestHandler = typedi_1.Container.get("supOS对象属性接口");
        requestCollections.forEach(async (item) => {
            let requestObj = config[item];
            let method = requestObj["method"];
            let options = requestObj["http-request-option"];
            suposRequestHandler.supos = options;
            let dataRes;
            let requestMethod = method.toUpperCase();
            if (requestMethod === "DELETE") {
                dataRes = await suposRequestHandler.delete();
            }
            else if (requestMethod === "POST") {
                dataRes = await suposRequestHandler.post();
            }
            else if (requestMethod === "GET") {
                dataRes = await suposRequestHandler.get();
            }
            else {
                dataRes = await suposRequestHandler.get();
            }
            let returnConfig = requestObj["http-request-return"];
            let keySelct = Object.keys(returnConfig["templete"])[0];
            let json = dataRes[keySelct];
            resObj[item] = json;
            console.log("resObj[item]", json);
            // console.log("dataRes", dataRes)
            modulejs_1.XLSX_JSON.saveJsonToFile(json, basicPath, item);
            // requestCollections.forEach((item: string) => {
            // let json = resObj[item]
            let jsonArr = resObj[item];
            // console.log("resObj", resObj)
            let dateConfig = requestObj["http-request-return"]["date-set"];
            if (dateConfig["enabled"]) {
                let format = dateConfig["format"];
                json = jsonArr.map((item) => {
                    dateConfig["params"].forEach((param) => {
                        item[param] = modulejs_1.moment(item[param]).format(format);
                    });
                    // item.startDatatimestamp = moment(item.startDatatimestamp).format(
                    //     "YYYY-MM-DD HH:mm:ss"
                    // )
                    return item;
                });
            }
            let outDir = modulejs_1.path.resolve(basicPath, requestObj["export"]["outDir"]);
            let fileName = requestObj["export"]["fileName"];
            modulejs_1.XLSX_JSON.jsonToExcel(json, outDir, fileName);
            let res = config;
            return res;
            // })
        });
    }
    else {
        console.log("选择本地模式");
        requestCollections.forEach((item) => {
            let requestObj = config[item];
            let jsonArr = modulejs_1.XLSX_JSON.readJsonFile(basicPath, item);
            resObj[item] = jsonArr;
            jsonArr = resObj[item];
            let json = jsonArr;
            // console.log("resObj", resObj)
            let dateConfig = requestObj["http-request-return"]["date-set"];
            if (dateConfig["enabled"]) {
                let format = dateConfig["format"];
                json = jsonArr.map((item) => {
                    dateConfig["params"].forEach((param) => {
                        item[param] = modulejs_1.moment(item[param]).format(format);
                    });
                    // item.startDatatimestamp = moment(item.startDatatimestamp).format(
                    //     "YYYY-MM-DD HH:mm:ss"
                    // )
                    return item;
                });
            }
            // console.log(json)
            let outDir = modulejs_1.path.resolve(basicPath, requestObj["export"]["outDir"]);
            let fileName = requestObj["export"]["fileName"];
            modulejs_1.XLSX_JSON.jsonToExcel(json, outDir, fileName);
            let res = config;
            return res;
            // })
        });
    }
    // let res = []
    // for (let i = 0; i < 1; i++) {
    //     await user.login()
    //     await system.delayms(1000)
    // }
};
test()
    .then((item) => {
    console.log("json转换xlsx格式成功");
    // process.stdin.pause()
    var userName = modulejs_1.readlineSync.question("please enter any key for exporting ");
    // XLSX_JSON.saveJsonToFile(item, __dirname, "reslog")
})
    .catch((e) => {
    console.log(e, "e");
    // file.writeFile(
    //     `${basicPath}/error.log`,
    //     `时间：${moment().format("YYYY-MM-DD HH:mm:ss")}  ${e.toString()}`,
    //     "utf8"
    // )
    modulejs_1.fs.appendFileSync(`${basicPath}/error.log`, `\r\n 时间：${modulejs_1.moment().format("YYYY-MM-DD HH:mm:ss")}  ${e.toString()}`, "utf8");
    // process.stdin.pause()
    console.log("运行出错");
    var userName = modulejs_1.readlineSync.question("please enter any key");
});
