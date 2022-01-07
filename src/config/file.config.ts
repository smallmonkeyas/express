/*
 * @Author: your name
 * @Date: 2021-09-01 20:18:53
 * @LastEditTime : 2022-01-06 16:25:41
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/src/config/file.config.ts
 */
import { path } from "../../modulejs"
// let dir = __dirname;
// let configDir = path.resolve(process.cwd(), './');
let configDir = path.resolve(__dirname, "./")
let respositoryDir = path.resolve(configDir, "../respository/")
const ruletableFileConfig = {
    filePath: `${respositoryDir}/ruletable`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "50家规则库11.29",
    fileExtension: "xlsx"
}
const objnameTempleFileConfig = {
    filePath: `${respositoryDir}/objname`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "报警对象实例模板",
    fileExtension: "xlsx"
}
const alarmObjFileConfig = {
    filePath: `${respositoryDir}/objname`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "报警对象实例",
    fileExtension: "xlsx"
}
const historyTempleFileConfig = {
    filePath: `${respositoryDir}/history`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "历史数据模板",
    fileExtension: "xlsx"
}
const historyDataFileConfig = {
    filePath: `${respositoryDir}/history`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "",
    fileExtension: "xlsx"
}
export {
    ruletableFileConfig,
    alarmObjFileConfig,
    objnameTempleFileConfig,
    historyTempleFileConfig,
    historyDataFileConfig
}
