import {
    applyDecorators,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { join } from 'path';
  import { Logger } from '@nestjs/common';
  import { CustomRequest } from '../interfaces/custom_request';
  import { FileValidation } from '../filters/file-validation/file-validation.filter';
  import { FileCleanupInterceptor } from '../interceptors/file-cleanup.interceptor';
  import { FileUploadOptions } from '../interfaces/file-upload-options';
  import { Transform } from 'class-transformer';
  
  export function FileUploadProperty(data: FileUploadOptions): PropertyDecorator {
    const fileInterceptor = createFileInterceptor(data);
  
    return applyDecorators(
      UseInterceptors(fileInterceptor, FileCleanupInterceptor),
      Transform(({ obj }) => obj[data.fieldName]), // Associe le fichier à la propriété du DTO
    );
  }
  
  function createFileInterceptor(data: FileUploadOptions) {
    const { fieldName, fileType, fileSizeLimitMB, filePathEnum } = data;
  
    return FileInterceptor(fieldName, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.cwd() + filePathEnum);
        },
        filename: (req: CustomRequest, file, cb) => {
          const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9) + '.' + file.mimetype.split('/')[1];
          const filePath = join(process.cwd(), filePathEnum, uniqueSuffix);
          
          if (!req.savedFiles) req.savedFiles = [];
          req.savedFiles.push(filePath);
          
          cb(null, uniqueSuffix);
        },
      }),
      limits: {
        fileSize: fileSizeLimitMB * 1024 * 1024, // Convertir en octets
      },
      fileFilter: (req, file, callback) => {
        try {
          FileValidation(fileType, file, callback);
          Logger.log('File is valid');
        } catch (error) {
          Logger.error(`File validation error: ${error.message}`);
          callback(error, false);
        }
      },
    });
  }
  