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

export function SingleFileUpload(
    data: FileUploadOptions
) {
    const fileInterceptor = createFileInterceptor(data);

    return applyDecorators(
        UseInterceptors(
            fileInterceptor,
            FileCleanupInterceptor,
        ),
    );
}

export function createFileInterceptor(
    data: FileUploadOptions
) {
    const { fieldName, fileType, fileSizeLimitMB, filePathEnum } = data;

    return FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: function (req, file, cb) {
                cb(null, process.cwd() + filePathEnum);
            },
            filename: function (req: CustomRequest, file, cb) {
                const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
                const filePath = join(process.cwd(), filePathEnum, uniqueSuffix);
                if (!req.filesToDelete) {
                    req.filesToDelete = [];
                }
                req.filesToDelete.push(filePath);
                cb(null, uniqueSuffix);
            }
        }),
        limits: {
            fileSize: fileSizeLimitMB * 1024 * 1024, // Convert to bytes
        },
        fileFilter: (req, file, callback) => {
            try {
                FileValidation(fileType, file, callback);
                Logger.log('File is valid');
            } catch (error) {
                Logger.error(`File validation error: ${error.message}`);
                return callback(error, false);
            }
        }
    });
}