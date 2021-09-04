/*
 * @Author: your name
 * @Date: 2021-09-01 20:18:53
 * @LastEditTime: 2021-09-02 09:38:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\config\file.config.ts
 */
import { path } from '../../modulejs';
// let dir = __dirname;
// let configDir = path.resolve(process.cwd(), './');
let configDir = path.resolve(__dirname, './');
let respositoryDir = path.resolve(configDir, '../respository/');
const ruletableFileConfig = {
    filePath: `${respositoryDir}\\ruletable`,
    fileName: '规则库常高新(改)',
    fileExtension: 'xlsx'
};
export { ruletableFileConfig };
