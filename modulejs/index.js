"use strict";
/*
 * @Author: your name
 * @Date: 2021-08-31 11:23:25
 * @LastEditTime: 2021-08-31 19:25:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\module\module.ts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.vendor = exports.database = exports.metadata = exports.object = exports.properties = exports.oauth = exports.table = exports.readlineSync = exports.csv = exports.csv2json = exports.json2xls = exports.jsdom = exports.cheerio = exports.path = exports.os = exports.moment = exports.fs = exports.xlsx = exports.XLSX = exports.request = void 0;
//* 引入本地库
exports.request = require('request');
// var request = require("request");
exports.XLSX = require('xlsx');
exports.xlsx = require('node-xlsx');
exports.fs = require('fs');
exports.moment = require('moment');
exports.os = require('os');
exports.path = require('path'); /* nodejs自带的模块*/
exports.cheerio = require('cheerio');
exports.jsdom = require('jsdom');
exports.json2xls = require('json2xls');
exports.csv2json = require('csv2json');
exports.csv = require('csv');
exports.readlineSync = require('readline-sync');
// TODO: 引入本地库(node版)
// export const XLSX_JSON = require('../script/XLSX_JSON');
// export const system = require('../script/system');
__exportStar(require("../script"), exports);
exports.table = require('../api/home/runtime/datatable');
exports.oauth = require('../api/home/system/oauth');
exports.properties = require('../api/home/metadata/properity');
exports.object = require('../api/home/metadata/object');
exports.metadata = require('../api/home/metadata/data');
exports.database = require('../api/home/runtime/database');
exports.vendor = require('../api/vendor/vendor');
