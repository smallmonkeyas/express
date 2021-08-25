/*
 * @Author: your name
 * @Date: 2021-08-19 02:05:50
 * @LastEditTime: 2021-08-23 23:35:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\controller\testController.js
 */
const path = require('path');
// const wxm = require("wxmnode");
const moment = require('moment');

var fs = require('fs');

const WebSocket = require('ws'); // 模块引入
// const creatFolder = function (filePath) {
//     if (!fs.existsSync(filePath)) {
//       fs.mkdirSync(filePath);
//     }
//   };
let mkDirsSync = function mkDirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkDirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};
const basicdir = path.resolve(
    __dirname,
    `../data/history/${moment().format('YYYY-MM-DD_HH_mm_ss')}`
);
console.log('basicdir: ' + basicdir);
mkDirsSync(basicdir);
/**
 * @微信提示
 */

function sendMessage(message) {
    let name = '289768';
    let pwd = '79523';
    let txt1 = message;
    let txt2 = 'b';
    let txt3 = 'c';

    setTimeout(async () => {
        // wxm.sendMsgToUser(name, pwd, txt1, txt2, txt3);  //是这个函数或者下面  两个函数
        // or
        wxm.init(name, pwd); // init 只需要一次就可以了
        let ret = await wxm.sendMsg(txt1, txt2, txt3);
        console.log('ret:', ret);
    }, 1000);
}
// sendMessage('是')
const beginTime = '2021-07-06 11:16:00',
    endTime = moment().format('YYYY-MM-DD HH:mm:ss');
const basicPath = path.resolve(
    __dirname,
    `../data/history/${moment(beginTime).format('YYYY-MM-DD_HH_mm_ss')}to${moment(endTime).format(
        'YYYY-MM-DD_HH_mm_ss'
    )}`
);
let pathFileDir = path.resolve(basicPath, `./shi`),
    hh;
hh = pathFileDir;
class Base {
    constructor(code) {
        this.code = code;
    }
    setCode(code) {
        this.code = code;
    }
}
const res = new Base(0);
console.log(res);
