/*
 * @Author: your name
 * @Date: 2021-08-31 18:58:52
 * @LastEditTime: 2021-09-07 12:27:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\file.io.ts
 */
import { IFile, ruletableFileConfig } from "../config";
import { file, path } from "../../modulejs";
import { Container, Service, Inject } from "typedi";
import "reflect-metadata";
// ! 文件操作接口
export interface IFileOperate {
    creatDir(): void;
    creatFile(): void;
    rmDir(): void;
    rmFile(): void;
}
@Service("本地文件操作操作类")
export class CFileOperate implements IFileOperate {
    file: IFile;
    fileContent!: string;
    constructor(file: IFile) {
        this.file = file;
    }
    creatDir() {
        file.creatdir(this.file.filePath);
    }
    async creatFile() {
        let fileFullName = `${this.file.filePath}\\${this.file.fileName}`;
        // let res: boolean;
        if (this.file.fileExtension) {
            fileFullName = `${fileFullName}.${this.file.fileExtension}`;
        }
        if (this.file.fileCode) {
            return await file.writeFile(fileFullName, "", this.file.fileCode);
        } else {
            return await file.writeFile(fileFullName, "");
        }
    }
    async writeFile(): Promise<any> {
        let fileFullName = `${this.file.filePath}\\${this.file.fileName}`;
        // let res: boolean;
        if (this.file.fileExtension) {
            fileFullName = `${fileFullName}.${this.file.fileExtension}`;
        }
        let content;
        if (!this.fileContent) {
            content = "";
        } else {
            content = this.fileContent;
        }
        if (this.file.fileCode) {
            return await file.writeFile(fileFullName, content, this.file.fileCode);
        } else {
            return await file.writeFile(fileFullName, content);
        }
    }
    async rmFile() {
        let fileFullName = `${this.file.filePath}\\${this.file.fileName}`;
        // let res: boolean;
        if (this.file.fileExtension) {
            fileFullName = `${fileFullName}.${this.file.fileExtension}`;
        }
        return await file.rmFileSync(fileFullName);
    }
    async rmDir() {
        file.rmdir(this.file.filePath);
    }
}

async function filoUnitTest() {
    let filehandler = Container.get<CFileOperate>("本地文件操作操作类");
    let fileConfig = ruletableFileConfig;
    fileConfig.filePath = path.resolve(fileConfig.filePath, "../fileTest");
    fileConfig.fileExtension = "txt";
    console.log(Object.keys([...Array(10)]));
    let fileNameArr = Object.keys([...Array(10)]);
    let promises = fileNameArr.map((fileName) => {
        if (Number(fileName) % 2 === 0) {
            filehandler.fileContent = fileName + 10;
            fileConfig.fileName = fileName + 10;
        } else {
            filehandler.fileContent = fileName + 20;
            fileConfig.fileName = fileName + 20;
        }

        filehandler.file = fileConfig;

        filehandler.creatDir();

        // await filehandler.creatFile();
        return filehandler.writeFile();
    });
    const promiseall = await Promise.all(promises);

    return promiseall;
}
filoUnitTest()
    .then((item) => console.log(item))
    .catch((e) => console.log(e));
// let fileConfig = ruletableFileConfig;
// let fileNewPath = path.resolve(fileConfig.filePath, "../fileTest");
// console.log(ruletableFileConfig, fileNewPath);
