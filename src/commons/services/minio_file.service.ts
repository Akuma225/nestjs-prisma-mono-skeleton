import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1');
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;

    await this.createBucketIfNotExists();

    const metaData = {
      'Content-Type': file.mimetype,
    };

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
    );

    const url = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucketName}/${fileName}`;
    return { url };
  }

  async deleteFile(fileUrl: string) {
    const fileName = fileUrl.split('/').pop();
    await this.minioClient.removeObject(this.bucketName, fileName);
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<{ url: string }[]> {
    await this.createBucketIfNotExists();

    const uploadPromises = files.map(async (file) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const metaData = {
        'Content-Type': file.mimetype,
      };
      await this.minioClient.putObject(
        this.bucketName,
        fileName,
        file.buffer,
        file.size,
        metaData,
      );
      return {
        url: `${this.configService.get<string>('MINIO_ENDPOINT')}:${this.configService.get<number>('MINIO_PORT')}/${this.bucketName}/${fileName}`,
      };
    });

    return await Promise.all(uploadPromises);
  }
}
