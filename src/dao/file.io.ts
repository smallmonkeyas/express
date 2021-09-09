/*
 * @Author: your name
 * @Date: 2021-08-31 18:58:52
 * @LastEditTime: 2021-09-08 17:58:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\file.io.ts
 */
import { IFile, ruletableFileConfig } from "../config";
import { file as files, path, system } from "../../modulejs";
import { Container, Service, Inject } from "typedi";
import "reflect-metadata";
// ! 文件操作接口
// namespace Reflect {
//     let file!: IFile;
//     let fileContent!: string;

//     function creatDir() {
//         files.creatdir(file.filePath);
//     }
//     async function creatFile() {
//         let fileFullName = `${file.filePath}\\${file.fileName}`;
//         // let res: boolean;
//         if (file.fileExtension) {
//             fileFullName = `${fileFullName}.${file.fileExtension}`;
//         }
//         if (file.fileCode) {
//             return await files.writeFile(fileFullName, "", file.fileCode);
//         } else {
//             return await files.writeFile(fileFullName, "");
//         }
//     }
//     async function writeFile(file: IFile) {
//         // let file = _file;
//         // await system.delayms(1);
//         // await system.delayus(1);
//         console.log("function writeFile(file: IFile)", file);
//         let fileFullName = `${file.filePath}\\${file.fileName}`;
//         // let res: boolean;
//         if (file.fileExtension) {
//             fileFullName = `${fileFullName}.${file.fileExtension}`;
//         }
//         let content;
//         if (!fileContent) {
//             content = "";
//         } else {
//             content = fileContent;
//         }
//         await system.delayus(1);
//         if (file.fileCode) {
//             return await files.writeFile(fileFullName, content, file.fileCode);
//         } else {
//             return await files.writeFile(fileFullName, content);
//         }
//     }
//     async function rmFile() {
//         let fileFullName = `${file.filePath}\\${file.fileName}`;
//         // let res: boolean;
//         if (file.fileExtension) {
//             fileFullName = `${fileFullName}.${file.fileExtension}`;
//         }
//         return await files.rmFileSync(fileFullName);
//     }
//     async function rmDir() {
//         files.rmdir(file.filePath);
//     }
//     async function tmp1(fileName: string, fileConfig1: any) {
//         let fileConfig = fileConfig1;
//         fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
//         fileConfig.fileExtension = "txt";

//         if (Number(fileName) % 2 === 0) {
//             // filehandler.fileContent = fileName + 10;
//             fileConfig.fileName = fileName;
//         } else {
//             // filehandler.fileContent = fileName + 20;
//             fileConfig.fileName = fileName;
//         }
//         // let filehandler = new CFileOperate(fileConfig);
//         // console.log(filehandler.file);
//         fileContent = fileName + 10;
//         file = fileConfig;
//         let filess = fileConfig;
//         // filehandler.file = fileConfig;
//         // await filehandler.rmFile();
//         console.log(filess);
//         creatDir();
//         return await writeFile(filess);
//         // await system.delayms(1);
//         // await filehandler.creatFile();
//         // return promiseArr.push(writeFile(filess));
//     }
//     async function tmp(fileName: string, fileConfig1: any) {
//         let fileConfig = fileConfig1;
//         fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
//         fileConfig.fileExtension = "txt";

//         if (Number(fileName) % 2 === 0) {
//             // filehandler.fileContent = fileName + 10;
//             fileConfig.fileName = fileName;
//         } else {
//             // filehandler.fileContent = fileName + 20;
//             fileConfig.fileName = fileName;
//         }
//         // let filehandler = new CFileOperate(fileConfig);
//         // console.log(filehandler.file);
//         fileContent = fileName + 10;
//         file = fileConfig;
//         let filess = fileConfig;
//         // filehandler.file = fileConfig;
//         // await filehandler.rmFile();
//         console.log(filess);
//         creatDir();
//         return await writeFile(filess);
//         // await system.delayms(1);
//         // await filehandler.creatFile();
//         // return promiseArr.push(writeFile(filess));
//     }
//     // @Service("主程序")
//     // class FileTest {
//     //     @Inject("本地文件操作操作类")
//     //     filehandler!: CFileOperate;
//     async function fileUnitTest() {
//         // let filehandler = Container.get<CFileOperate>("本地文件操作操作类");
//         // let fileConfig = ruletableFileConfig;
//         // fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
//         // fileConfig.fileExtension = "txt";
//         console.log(Object.keys([...Array(10)]));
//         let fileNameArr = Object.keys([...Array(10)]);
//         // let promises = fileNameArr.map((fileName) => {
//         //     if (Number(fileName) % 2 === 0) {
//         //         filehandler.fileContent = fileName + 10;
//         //         fileConfig.fileName = fileName;
//         //     } else {
//         //         filehandler.fileContent = fileName + 20;
//         //         fileConfig.fileName = fileName;
//         //     }

//         //     filehandler.file = fileConfig;

//         //     filehandler.creatDir();

//         //     // await filehandler.creatFile();
//         //     return filehandler.writeFile();
//         // });
//         // let filehandler1 = filehandler;
//         let fileConfig1 = ruletableFileConfig;
//         let promiseArr: any[] = [];
//         let e0 = tmp(fileNameArr[0], fileConfig1);
//         let e2 = tmp1(fileNameArr[2], fileConfig1);
//         // let e0 = await tmp(fileNameArr[0], fileConfig1);
//         // let e1 = await tmp(fileNameArr[1], fileConfig1);
//         // const promise = fileNameArr.map(async (fileName, index) => {
//         //     if (index > 2) {
//         //         return "暂不添加文件";
//         //     }
//         //     promiseArr.push(await tmp(fileName, fileConfig1));
//         //     // return tmp(fileName, fileConfig1);
//         // });
//         // let d1 = await e0;
//         // let d2 = await e1;

//         const promiseall = await Promise.all([e0, e2]);
//         // const promiseall = await Promise.all(promise);
//         // const promiseall = await Promise.all(promiseArr);

//         // return [d1, d2];
//         return promiseall;

//         /** ********************** */
//         // // let filehandler = Container.get<CFileOperate>("本地文件操作操作类");
//         // let fileConfig = ruletableFileConfig;
//         // fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
//         // fileConfig.fileExtension = "txt";
//         // console.log(Object.keys([...Array(10)]));
//         // let fileNameArr = Object.keys([...Array(10)]);
//         // let promises = fileNameArr.map((fileName) => {
//         //     if (Number(fileName) % 2 === 0) {
//         //         filehandler.fileContent = fileName + 10;
//         //         fileConfig.fileName = fileName + 10;
//         //     } else {
//         //         filehandler.fileContent = fileName + 20;
//         //         fileConfig.fileName = fileName + 20;
//         //     }
//         //     filehandler.file = fileConfig;
//         //     filehandler.creatDir();
//         //     // await filehandler.creatFile();
//         //     return filehandler.writeFile();
//         // });
//         // const promiseall = await Promise.all(promises);
//         // return promiseall;
//     }
//     // }
//     // // async function fileUnitTest() {
//     // //     let filehandler = Container.get<CFileOperate>("本地文件操作操作类");
//     // //     let fileConfig = ruletableFileConfig;
//     // //     fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
//     // //     fileConfig.fileExtension = "txt";
//     // //     console.log(Object.keys([...Array(10)]));
//     // //     let fileNameArr = Object.keys([...Array(10)]);
//     // //     let promises = fileNameArr.map((fileName) => {
//     // //         if (Number(fileName) % 2 === 0) {
//     // //             filehandler.fileContent = fileName + 10;
//     // //             fileConfig.fileName = fileName + 10;
//     // //         } else {
//     // //             filehandler.fileContent = fileName + 20;
//     // //             fileConfig.fileName = fileName + 20;
//     // //         }

//     // //         filehandler.file = fileConfig;

//     // //         filehandler.creatDir();

//     // //         // await filehandler.creatFile();
//     // //         return filehandler.writeFile();
//     // //     });
//     // //     const promiseall = await Promise.all(promises);

//     // //     return promiseall;
//     // // }
//     // // fileUnitTest()
//     // //     .then((item) => console.log(item))
//     // //     .catch((e) => console.log(e));
//     // // let fileConfig = ruletableFileConfig;
//     // // let fileNewPath = path.resolve(fileConfig.filePath, "../fileTest");
//     // // console.log(ruletableFileConfig, fileNewPath);

//     async function testFile() {
//         // let fileTestHandler = Container.get<FileTest>("主程序");
//         return await fileUnitTest();
//     }
//     testFile()
//         .then((item) => {
//             console.log(item);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }

export interface IFileOperate {
    creatDir(): void;
    creatFile(): void;
    rmDir(): void;
    rmFile(): void;
}
@Service("本地文件操作操作类")
export class CFileOperate implements IFileOperate {
    file!: IFile;
    fileContent!: string;
    constructor(file: IFile) {
        this.file = file;
    }
    creatDir() {
        files.creatdir(this.file.filePath);
    }
    async creatFile() {
        let fileFullName = `${this.file.filePath}/${this.file.fileName}`;
        // let fileFullName = `${this.file.filePath}\\${this.file.fileName}`;
        // let res: boolean;
        if (this.file.fileExtension) {
            fileFullName = `${fileFullName}.${this.file.fileExtension}`;
        }
        if (this.file.fileCode) {
            return await files.writeFile(fileFullName, "", this.file.fileCode);
        } else {
            return await files.writeFile(fileFullName, "");
        }
    }
    async writeFile(): Promise<any> {
        // let file = JSON.parse(JSON.stringify(this.file));
        let file = { ...this.file };

        let fileContent = this.fileContent;
        await system.delayms(1);
        await system.delayus(1);

        let fileFullName = `${file.filePath}/${file.fileName}`;
        // let fileFullName = `${file.filePath}\\${file.fileName}`;
        // let res: boolean;
        if (file.fileExtension) {
            fileFullName = `${fileFullName}.${file.fileExtension}`;
        }
        let content;
        if (!fileContent) {
            content = "";
        } else {
            content = fileContent;
        }
        // await system.delayus(1);
        if (file.fileCode) {
            return await files.writeFile(fileFullName, content, file.fileCode);
        } else {
            return await files.writeFile(fileFullName, content);
        }
    }
    async rmFile() {
        let fileFullName = `${this.file.filePath}/${this.file.fileName}`;
        // let fileFullName = `${this.file.filePath}\\${this.file.fileName}`;
        // let res: boolean;
        if (this.file.fileExtension) {
            fileFullName = `${fileFullName}.${this.file.fileExtension}`;
        }
        return await files.rmFileSync(fileFullName);
    }
    async rmDir() {
        files.rmdir(this.file.filePath);
    }
}
/** ************************ */
