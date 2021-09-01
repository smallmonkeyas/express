/*
 * @Author: your name
 * @Date: 2021-08-31 18:58:52
 * @LastEditTime: 2021-08-31 20:14:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\src\dao\file.io.ts
 */
import { IFile } from '../config';
import { file } from '../../modulejs';
// ! 文件操作接口
export interface IFileOperate {
    creatDir(): void;
    creatFile(): void;
    rmDir(): void;
    rmFile(): void;
}

export class CFileOperate implements IFileOperate {
    file: IFile;
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
            return await file.writeFile(fileFullName, '', this.file.fileCode);
        } else {
            return await file.writeFile(fileFullName, '');
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
