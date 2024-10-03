import { Injectable } from '@nestjs/common';
import ImageKit = require('imagekit');

@Injectable()
export class ImageKitService {
  private imageKit;

  constructor() {
    this.imageKit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  async upload(file: any): Promise<ImageKitResponse> {
    return await this.imageKit.upload({
      file: file.buffer,
      fileName: file.originalname,
    });
  }

  async uploadMultiple(files: any[]): Promise<ImageKitResponse[]> {
    try {
      const uploadPromises = files.map((file) =>
        this.imageKit.upload({
          file: file.buffer,
          fileName: file.originalname,
        }),
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      throw error;
    }
  }

  async delete(file_id: string): Promise<void> {
    try {
      await this.imageKit.deleteFile(file_id);
    } catch (error) {
      throw error;
    }
  }

  async createFolder(
    folderName: string,
    parentFolderPath?: string,
  ): Promise<void> {
    try {
      await this.imageKit.createFolder({
        folderName: folderName,
        parentFolderPath: parentFolderPath || '/',
      });
    } catch (error) {
      throw error;
    }
  }
}

export interface ImageKitResponse {
  fileId: string;
  name: string;
  size: number;
  versionInfo?: {
    id: string;
    name: string;
  };
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  //AITags: string | null;
}
