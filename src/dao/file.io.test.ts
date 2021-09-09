/*
 * @Author: your name
 * @Date: 2021-09-07 13:41:09
 * @LastEditTime: 2021-09-07 15:50:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\file.io.test.ts
 */
import { IFile, ruletableFileConfig } from "../config";
import { file, path, system } from "../../modulejs";
import { Container, Service, Inject } from "typedi";
import "reflect-metadata";

import { CFileOperate } from "./file.io";

@Service("主程序")
class FileTest {
    // @Inject("本地文件操作操作类")
    // filehandler!: CFileOperate;
    async fileUnitTest(): Promise<any> {
        // let filehandler = Container.get<CFileOperate>("本地文件操作操作类");
        // let fileConfig = ruletableFileConfig;
        // fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
        // fileConfig.fileExtension = "txt";
        console.log(Object.keys([...Array(10)]));
        let fileNameArr = Object.keys([...Array(10)]);
        // let promises = fileNameArr.map((fileName) => {
        //     if (Number(fileName) % 2 === 0) {
        //         this.filehandler.fileContent = fileName + 10;
        //         fileConfig.fileName = fileName;
        //     } else {
        //         this.filehandler.fileContent = fileName + 20;
        //         fileConfig.fileName = fileName;
        //     }

        //     this.filehandler.file = fileConfig;

        //     this.filehandler.creatDir();

        //     // await filehandler.creatFile();
        //     return this.filehandler.writeFile();
        // });
        // let filehandler1 = this.filehandler;
        let promisesall = await Promise.all(
            fileNameArr.map(async (fileName) => {
                let fileConfig = ruletableFileConfig;
                fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
                fileConfig.fileExtension = "txt";

                if (Number(fileName) % 2 === 0) {
                    // filehandler.fileContent = fileName + 10;
                    fileConfig.fileName = fileName;
                } else {
                    // filehandler.fileContent = fileName + 20;
                    fileConfig.fileName = fileName;
                }
                let filehandler = new CFileOperate(fileConfig);
                console.log(filehandler.file);
                filehandler.fileContent = fileName + 10;
                // filehandler.file = fileConfig;
                // await filehandler.rmFile();
                filehandler.creatDir();
                // await system.delayms(1);
                // await filehandler.creatFile();
                return filehandler.writeFile();
            })
        );
        // const promiseall = await Promise.all(promises);

        return promisesall;
    }
}
// async function fileUnitTest() {
//     let filehandler = Container.get<CFileOperate>("本地文件操作操作类");
//     let fileConfig = ruletableFileConfig;
//     fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
//     fileConfig.fileExtension = "txt";
//     console.log(Object.keys([...Array(10)]));
//     let fileNameArr = Object.keys([...Array(10)]);
//     let promises = fileNameArr.map((fileName) => {
//         if (Number(fileName) % 2 === 0) {
//             filehandler.fileContent = fileName + 10;
//             fileConfig.fileName = fileName + 10;
//         } else {
//             filehandler.fileContent = fileName + 20;
//             fileConfig.fileName = fileName + 20;
//         }

//         filehandler.file = fileConfig;

//         filehandler.creatDir();

//         // await filehandler.creatFile();
//         return filehandler.writeFile();
//     });
//     const promiseall = await Promise.all(promises);

//     return promiseall;
// }
// fileUnitTest()
//     .then((item) => console.log(item))
//     .catch((e) => console.log(e));
// let fileConfig = ruletableFileConfig;
// let fileNewPath = path.resolve(fileConfig.filePath, "../fileTest");
// console.log(ruletableFileConfig, fileNewPath);

async function testFile() {
    let fileTestHandler = new FileTest();
    // let fileTestHandler = Container.get<FileTest>("主程序");

    return fileTestHandler.fileUnitTest();
}
testFile()
    .then((item) => {
        console.log(item);
    })
    .catch((err) => {
        console.log(err);
    });
