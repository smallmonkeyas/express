/* eslint-disable no-eval */
/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-11-05 15:35:29
 * @LastEditTime: 2021-11-05 22:56:13
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \express\src\service\json-to-excel\json-to-excel.ts
 */

import { fs, file, path, system, XLSX_JSON, moment, readlineSync } from "../../../modulejs"
import { CFileOperate } from "../../dao"

import "reflect-metadata"
import { Container, Service, Inject } from "typedi"
Container.import([CFileOperate])
@Service("json转excel工具")
export class CJsonToExcel<T> extends CFileOperate {
    inDir!: Array<T>
    outDir!: Array<T>
    inputMode!: Array<T>
    outputMode!: Array<T>
    inputformat!: { templete: Array<T>; [prop: string]: any }
    // fileName!: Array<string>
    fileExtension!: T
    basicPath!: T
    read_jsonfile_to_excel(): // inDir: Array<string>,   // inputMode: Array<string>,    // outputMode: Array<string>,    // jsonformat: Array<string>

    void {
        let len = this.inDir.length
        for (let i = 0; i < len; i++) {
            switch (this.inputMode[i] + " + " + this.outputMode[i]) {
                case "input-files-param + out-multi-file":
                    console.log(
                        "模式选择：",
                        "多文件(每个json文件单参数)输入-多文件(每个文件对应一个excel)输出"
                    )
                    this.read_jsonfiles_to_multi_excel(this.inDir[i], this.outDir[i])
                    break
                case "input-file-params + out-single-file":
                    console.log(
                        "模式选择：",
                        "单文件(json文件中存在多参数)输入-单文件(当前文件夹下所有文件最终导出到一个excel)输出"
                    )
                    break
                case "input-files-param + out-single-file":
                    console.log(
                        "模式选择：",
                        "多文件(每个json文件单参数)输入-单文件(当前文件夹下所有文件最终导出到一个excel)输出"
                    )
                    break
                case "input-file-params + out-multi-file":
                    console.log(
                        "模式选择：",
                        "单文件(json文件中存在多参数)输入-多文件(每个文件对应一个excel)输出"
                    )
                    break
                default:
                    console.log("模式选择：", "files-param")
            }
        }
    }
    async read_jsonfile_to_multi_excel(
        inDir: T,
        inputMode: T,
        outputMode: T,
        jsonformat: T
    ): Promise<any> {}
    async read_jsonfile_to_one_excel(
        inDir: T,
        inputMode: T,
        outputMode: T,
        jsonformat: T
    ): Promise<any> {}
    read_jsonfiles_to_multi_excel(inDir: T, outDir: T): void {
        // TODO: 获取当前目录下所有json文件

        let filePath = path.resolve(this.basicPath, inDir)
        let filesName: Array<string> = file.get(`${this.fileExtension}`, filePath)
        console.log("filesName", filesName)
        // TODO: 遍历json文件，转为excel文件
        filesName.forEach((fileName: string) => {
            // TODO: 读取json文件
            let jsonRead = XLSX_JSON.readJsonFile(filePath, fileName)
            console.log("jsonRead", jsonRead)
            // TODO: 转为excel格式数据
            let jsonArr = eval(`jsonRead${this.inputformat["templete"]}`)
            // let jsonArr = system.evil(`jsonRead${this.inputformat["templete"]}`)
            let dateConfig = this.inputformat["date-set"]
            if (dateConfig["enabled"]) {
                let format = dateConfig["format"]
                jsonArr = jsonArr.map((item: any) => {
                    dateConfig["params"].forEach((param: string) => {
                        item[param] = moment(item[param]).format(format)
                    })
                    // item.startDatatimestamp = moment(item.startDatatimestamp).format(
                    //     "YYYY-MM-DD HH:mm:ss"
                    // )
                    return item
                })
            }
            // TODO: 导出excel文件
            let outputDir = path.resolve(this.basicPath, outDir)
            XLSX_JSON.jsonToExcel(jsonArr, outputDir, fileName)
        })
    }
    async read_jsonfiles_to_one_excel(
        inDir: T,
        inputMode: T,
        outputMode: T,
        jsonformat: T
    ): Promise<any> {}
}
