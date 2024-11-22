import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

@Injectable()
export class StorageService {
    // Récupérer la liste des fichiers d'un répertoire
    async getFiles(storagePath: string): Promise<string[]> {
        const readdir = util.promisify(fs.readdir);
        return await readdir(storagePath);
    }

    // Récupérer un fichier par son chemin
    async getFile(storagePath: string, filePath: string): Promise<Buffer> {
        const readFile = util.promisify(fs.readFile);
        const fullPath = path.join(storagePath, filePath);
        return await readFile(fullPath);
    }

    // Sauvegarder un fichier
    async saveFile(storagePath: string, fileName: string, fileContent: Buffer): Promise<void> {
        const writeFile = util.promisify(fs.writeFile);
        const fullPath = path.join(storagePath, fileName);
        await writeFile(fullPath, fileContent);
    }

    // Supprimer un fichier
    async deleteFile(storagePath: string, filePath: string): Promise<void> {
        const unlink = util.promisify(fs.unlink);
        const fullPath = path.join(storagePath, filePath);
        await unlink(fullPath);
    }
}
