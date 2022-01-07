/*
 * @Author: your name
 * @Date: 2021-08-31 11:23:25
 * @LastEditTime : 2022-01-06 17:37:48
 * @LastEditors  : Chengxin Sun
 * @Description: In User Settings Edit
 * @FilePath     : /express/modulejs/index.ts
 */

//* 引入本地库
export const request = require("request")
export const unirest = require("unirest")
export const axios = require("axios")
export const FormData = require("form-data")

// var request = require("request");
export const XLSX = require("xlsx")

export const xlsx = require("node-xlsx")
export const Excel = require("exceljs")
// export { renderExcel } from "ejsexcel" // excel模板化插件，官网教程： https://github.com/sail-sail/ejsExcel

export const ExcelTemplate = require("ejsexcel") // excel模板化插件，官网教程： https://github.com/sail-sail/ejsExcel
export const stream = require("stream")

export const fs = require("fs")
export const moment = require("moment")
export const os = require("os")
export const path = require("path") /* nodejs自带的模块*/
export const cheerio = require("cheerio")
export const jsdom = require("jsdom")
export const json2xls = require("json2xls")
export const csv2json = require("csv2json")
export const csv = require("csv")
export const readlineSync = require("readline-sync")
// TODO: 引入本地库(node版)
// export const XLSX_JSON = require('../script/XLSX_JSON');
// export const system = require('../script/system');
export * from "../script"
export const table = require("../api/home/runtime/datatable")
export const oauth = require("../api/home/system/oauth")
export const properties = require("../api/home/metadata/properity")
export const object = require("../api/home/metadata/object")
export const metadata = require("../api/home/metadata/data")
export const database = require("../api/home/runtime/database")
export const vendor = require("../api/vendor/vendor")
