import {
    applyDecorators,
    Logger,
    UseInterceptors,
} from '@nestjs/common';
import { FileCleanupInterceptor } from '../interceptors/file-cleanup.interceptor';
import { FileUploadOptions } from '../interfaces/file-upload-options';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileValidation } from '../filters/file-validation/file-validation.filter';
import { join } from 'path';
import { CustomRequest } from '../interfaces/custom_request';
import { diskStorage } from 'multer';

export function MultipleFieldsUpload(fields: FileUploadOptions[]) {
    const interceptors = []

    interceptors.push(createFilesInterceptor(fields));
    interceptors.push(FileCleanupInterceptor);

    return applyDecorators(
        UseInterceptors(...interceptors)
    );
}

export function createFilesInterceptor(
    data: FileUploadOptions[]
) {
    return FileFieldsInterceptor(data.map((field) => {
        return { name: field.fieldName, maxCount: 1 };
    }), {
        storage: diskStorage({
            destination: function (req, file, cb) {
                cb(null, process.cwd() + data.find(x => x.fieldName === file.fieldname).filePathEnum);
            },
            filename: function (req: CustomRequest, file, cb) {
                const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
                const filePath = join(process.cwd(), data.find(x => x.fieldName === file.fieldname).filePathEnum, uniqueSuffix);
                if (!req.filesToDelete) {
                    req.filesToDelete = [];
                }
                req.filesToDelete.push(filePath);
                cb(null, uniqueSuffix);
            }
        }),
        fileFilter: (req, file, callback) => {
            try {
                const fileObject = data.find(x => x.fieldName === file.fieldname);
                FileValidation(fileObject.fileType, file, callback);
                Logger.log('File is valid');
            } catch (error) {
                Logger.error(`File validation error: ${error.message}`);
                return callback(error, false);
            }
        }
    });
}