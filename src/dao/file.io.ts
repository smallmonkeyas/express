/*
 * @Author: your name
 * @Date: 2021-08-31 18:58:52
 * @LastEditTime: 2021-09-04 21:32:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\file.io.ts
 */
import { IFile } from "../config";
import { file } from "../../modulejs";
import { Container, Service, Inject } from "typedi";

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
