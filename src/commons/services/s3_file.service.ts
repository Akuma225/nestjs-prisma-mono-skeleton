import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ModelMappingPrefix } from '../enums/model-mapping.enum';

@Injectable()
export class S3FileService {
  constructor() {}
  private readonly s3Instance = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async s3_upload(
    file: Express.Multer.File,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file.buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_REGION,
      },
    };

    try {
      return await this.s3Instance.upload(params).promise();
    } catch (e) {
      Logger.log(e);
      return null;
    }
  }

  async upload(file: Express.Multer.File, prefix: ModelMappingPrefix) {
    Logger.log('Uploading following file: ', file);

    const fileExtension = file.mimetype.split('/')[1];
    const imageName = `IMG-${ModelMappingPrefix[prefix]}-${Date.now()}`;

    return await this.s3_upload(
      file,
      process.env.AWS_S3_BUCKET_NAME,
      `${imageName}.${fileExtension}`,
      file.mimetype,
    );
  }

  async deleteFile(file_name: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file_name,
    };

    this.s3Instance.deleteObject(params, function (err, data) {
      if (err) Logger.log(err, err.stack);
      else Logger.log(data);
    });
  }
}
