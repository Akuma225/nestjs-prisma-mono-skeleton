import {
    applyDecorators,
    UseInterceptors,
} from '@nestjs/common';
import { FileCleanupInterceptor } from '../interceptors/file-cleanup.interceptor';
import { FileUploadOptions } from '../interfaces/file-upload-options';
import { createFileInterceptor } from './single-file-upload.decorator';

export function MultipleFieldsUpload(fields: FileUploadOptions[]) {
    const interceptors = fields.map(field =>
        createFileInterceptor(field)
    );
    interceptors.push(FileCleanupInterceptor);
    return applyDecorators(
        UseInterceptors(...interceptors)
    );
}