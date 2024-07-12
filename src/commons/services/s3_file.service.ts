import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ModelMappingPrefix } from '../enums/model-mapping.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3FileService {
  constructor(
    private configService: ConfigService,
  ) { }

  private readonly s3Instance = new S3({
    accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
  });

  /**
   * Uploads a file to S3.
   *
   * @param file - The file to be uploaded.
   * @param bucket - The S3 bucket name.
   * @param name - The name of the file in S3.
   * @param mimetype - The MIME type of the file.
   * @returns A promise that resolves to the S3 upload response, or null if an error occurs.
   */
  async s3_upload(
    file: Express.Multer.File,
    bucket: string,
    name: string,
    mimetype: string,
  ): Promise<S3.ManagedUpload.SendData | null> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file.buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.configService.get<string>('AWS_REGION'),
      },
    };

    try {
      return await this.s3Instance.upload(params).promise();
    } catch (e) {
      Logger.log(e);
      return null;
    }
  }

  /**
   * Uploads a file to S3 with a prefix and automatically generated name.
   *
   * @param file - The file to be uploaded.
   * @param prefix - The prefix to be used in the file name.
   * @returns A promise that resolves to the S3 upload response, or null if an error occurs.
   */
  async upload(file: Express.Multer.File, prefix: ModelMappingPrefix): Promise<S3.ManagedUpload.SendData | null> {
    Logger.log('Uploading the following file: ', file);

    const fileExtension = file.mimetype.split('/')[1];
    const imageName = `IMG-${ModelMappingPrefix[prefix]}-${Date.now()}`;

    return await this.s3_upload(
      file,
      this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      `${imageName}.${fileExtension}`,
      file.mimetype,
    );
  }

  /**
   * Deletes a file from S3.
   *
   * @param file_name - The name of the file to be deleted in S3.
   * @returns A promise that resolves when the file is deleted.
   */
  async deleteFile(file_name: string): Promise<void> {
    const params = {
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: file_name,
    };

    this.s3Instance.deleteObject(params, function (err, data) {
      if (err) Logger.log(err, err.stack);
      else Logger.log(data);
    });
  }
}
