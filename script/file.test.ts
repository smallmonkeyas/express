/* eslint-disable space-unary-ops */
/*
 * @Author: your name
 * @Date: 2021-09-06 21:38:49
 * @LastEditTime: 2021-09-30 20:18:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\script\file.test.ts
 */

import { path, XLSX, xlsx, fs, file, ExcelTemplate, Excel } from "../modulejs"
import { objnameTempleFileConfig, objnameFileConfig } from "../src/config"
// const EXCEL = require("xlsx-style")
// // let dir = __dirname;
// // let configDir = path.resolve(process.cwd(), './');
// let configDir = path.resolve(__dirname, "./")
// // console.log(configDir, __dirname)
// // XLSX.utils.()
// var workbook = XLSX.readFile("E:/Download_Temp/Google/对象实例信息.xlsx")
// var sheetNames = workbook.SheetNames
// var worksheet = workbook.Sheets[sheetNames[2]]
// // var worksheet = workbook.Sheets;
// // let files = fs.readFileSync("E:/Download_Temp/Google/对象实例信息.xlsx")
// // var filestr = JSON.parse(fs.readFileSync("E:/Download_Temp/Google/对象实例信息.xlsx"))
// // var datas = XLSX.utils.sheet_to_json(worksheet)
// var datas = []
// for (let ii = 0; ii < 10; ii++) {
//     // for (let jj = 0; jj < Math.ceil(ii / 100); jj++) {
//     var excelJson = {
//         "*实例别名": "GenericObject_008",
//         实例名称: "ffff",
//         "*属性名称": `p${ii}名称`,
//         "*属性别名": `p${ii}`,
//         "*类型": "Double",
//         量程上限: "100",
//         量程下限: "0",
//         单位: "",
//         小数: "",
//         属性描述: `描述${ii}`,
//         属性标签: "",
//         默认值: "",
//         "*读写状态": "读写",
//         "*持久化": "是",
//         "*历史": "是",
//         数据源: "",
//         时间戳: "服务器时间",
//         时间粒度: "",
//         // "": "",
//         _1: "",
//         _2: "",
//         _3: "",
//         统计类型: "",
//         // _3: "",
//         _4: "",
//         _5: "",
//         _6: ""
//     }

//     datas.push(excelJson)
//     // var ad = XLSX.utils.sheet_add_json(worksheet, datas)
//     // file.creatdir(`E:/Download_Temp/Google/对象实例创建测试`)
//     // XLSX.writeFile(workbook, `E:/Download_Temp/Google/对象实例创建测试/对象实例信息${jj}.xlsx`)
//     // }
// }

// // var ws = XLSX.utils.json_to_sheet(excelJson)
// var ad = XLSX.utils.sheet_add_json(worksheet, datas)
// // var excelDatas = XLSX.utils.sheet_to_json(excel)
// // XLSX.utils.book_append_sheet(wb, ws, fileName);
// //     XLSX.writeFile(wb, newfileDirectory);
// // XLSX.utils.book_append_sheet(workbook, excel)
// // var stream = fs.createReadStream("E:/Download_Temp/Google/对象实例信息3.xlsx")
// // console.log(stream)
// XLSX.writeFile(workbook, "E:/Download_Temp/Google/对象实例创建测试/对象实例信息9.xlsx")

// console.log("excel", datas)
// // // console.log("wr", wr)
// // console.log("ad", ad)
// // console.log(Math.floor(11 / 111))

/* -------------------------------------------------------------------------------------*/
// let content = fs.readFileSync("E:/Download_Temp/Google/对象实例信息.xlsx", "utf-8")

// var workbook = EXCEL.readFile("E:/Download_Temp/Google/对象实例信息.xlsx")
// var workbook1 = XLSX.readFile("E:/Download_Temp/Google/对象实例信息.xlsx")
// var sheetNames = workbook.SheetNames
// var worksheet = workbook.Sheets[sheetNames[2]]
var datas = []
for (let ii = 0; ii < 1001; ii++) {
    // for (let jj = 0; jj < Math.ceil(ii / 100); jj++) {
    var excelJson = {
        objName: "GenericObject_008",
        objDisplayName: "ffff",
        propName: `q${ii}`,
        propDisplayName: `q${ii}属性名称`,
        propDesc: `描述${ii}`
    }

    datas.push(excelJson)
}

// var ad = XLSX.utils.sheet_add_json(worksheet, datas)
// EXCEL.writeFileSync(workbook, "E:/Download_Temp/Google/对象实例创建测试/对象实例信息9.xlsx", {
//     type: "buffer",
//     // type: "buffer",
//     bookType: "xlsx"
// })

// console.log("excel", datas)

/** *************************************************************** */

// var sheets = xlsx.parse("E:/Download_Temp/Google/对象实例信息.xlsx") // 获取到所有sheets
// console.log(sheets)

// let content = fs.readFileSync("E:/Download_Temp/Google/对象实例信息.xlsx", "utf-8")
// // let tempCode = JSON.parse(content)
// console.log("content", content)
// const ejsexcel = require("ejsexcel") // 官网教程： https://github.com/sail-sail/ejsExcel
// const fs = require("fs")
const util = require("util")
const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)

;(async function () {
    // 获得Excel模板的buffer对象
    const fileTempleDir = `${objnameTempleFileConfig.filePath}/${objnameTempleFileConfig.fileName}.${objnameTempleFileConfig.fileExtension}`
    const exlBuf = fs.readFileSync(fileTempleDir)
    // const exlBuf = await readFileAsync("E:/Download_Temp/Google/对象实例信息.xlsx")
    // 数据源
    // const data: any[] = []
    const data = [[{ table_name: "属性", date: "2021-04-09" }], datas]
    // 用数据源(对象)data渲染Excel模板

    // 用数据源(对象)data渲染Excel模板
    // cachePath 为编译缓存路径, 对于模板文件比较大的情况, 可显著提高运行效率, 绝对路径, 若不设置, 则无缓存
    const exlBuf2 = await ExcelTemplate.renderExcel(exlBuf, data, {
        cachePath: `${objnameFileConfig.filePath}/cache`
    })
    // await writeFileAsync("E:/Download_Temp/Google/对象实例创建测试/对象实例信息12.xlsx", exlBuf2)
    const fileOutDir = `${objnameFileConfig.filePath}/${objnameFileConfig.fileName}.${objnameFileConfig.fileExtension}`

    // // const pathOutDir = path.resolve(__dirname, "./对象实例生成1.xlsx")
    // fs.writeFileSync(fileOutDir, exlBuf2, { type: "buffer" })
    let fileOutDir1 = `${objnameFileConfig.filePath}/${objnameFileConfig.fileName}1.${objnameFileConfig.fileExtension}`
    // const fileR = fs.createReadStream(fileOutDir)
    // const strFileR = JSON.stringify(fileR)
    // console.log(strFileR)
    // const fileR1 = fs.createReadStream(fileOutDir1)
    // const fileR1 = await readFileAsync(fileOutDir1)
    // fs.writeFileSync(`${objnameFileConfig.filePath}/fileOutOrigin.txt`, JSON.stringify(fileR))
    // fs.writeFileSync(`${objnameFileConfig.filePath}/fileOutTrue.txt`, JSON.stringify(fileR1))
    // console.log(new Uint8Array(exlBuf2))
    // fs.writeFileSync(fileOutDir, new Uint8Array(exlBuf2))
    // let value = fs.createReadStream(fileOutDir)
    // console.log(value)
    // await writeFileAsync(fileOutDir, fileR)
    // // fs.writeFileSync(fs.readFileSync(fileOutDir))
    // console.log("对象实例信息.xlsx", fileR)
    // console.log(xlsx.parse(exlBuf2))
    const workbook = new Excel.Workbook()
    //   let workbookOrigin = await workbook.xlsx.readFile(pathOutDir);
    //   let workbookOrigin = await workbook.xlsx.readFile(pathOutDir);
    await workbook.xlsx.load(exlBuf2)
    //   console.log("workbookOrigin", workbookOrigin);
    await workbook.xlsx.writeFile(fileOutDir1)
})()
