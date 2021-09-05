/*
 * @Author: your name
 * @Date: 2021-09-01 20:18:53
 * @LastEditTime: 2021-09-05 20:50:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\file.config.ts
 */
import { path } from "../../modulejs";
// let dir = __dirname;
// let configDir = path.resolve(process.cwd(), './');
let configDir = path.resolve(__dirname, "./");
let respositoryDir = path.resolve(configDir, "../respository/");
const ruletableFileConfig = {
    filePath: `${respositoryDir}\\ruletable`,
    fileName: "光大高新环保新能源（常州）有限公司规则库",
    fileExtension: "xlsx"
};
export { ruletableFileConfig };
