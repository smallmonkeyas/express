/*
 * @Author: your name
 * @Date: 2021-09-01 20:18:53
 * @LastEditTime: 2021-09-27 17:31:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\file.config.ts
 */
import { path } from "../../modulejs"
// let dir = __dirname;
// let configDir = path.resolve(process.cwd(), './');
let configDir = path.resolve(__dirname, "./")
let respositoryDir = path.resolve(configDir, "../respository/")
const ruletableFileConfig = {
    filePath: `${respositoryDir}/ruletable`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "光大高新环保新能源（常州）有限公司规则库",
    fileExtension: "xlsx"
}
const objnameTempleFileConfig = {
    filePath: `${respositoryDir}/objname`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "对象实例模板",
    fileExtension: "xlsx"
}
const objnameFileConfig = {
    filePath: `${respositoryDir}/objname`,
    // filePath: `${respositoryDir}\\ruletable`,
    fileName: "对象实例",
    fileExtension: "xlsx"
}
export { ruletableFileConfig, objnameFileConfig, objnameTempleFileConfig }
