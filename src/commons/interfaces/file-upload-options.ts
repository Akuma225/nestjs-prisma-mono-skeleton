import { FilePath } from "../enums/file_path.enum";

export interface FileUploadOptions {
    fieldName: string;
    fileType: string;
    fileSizeLimitMB: number;
    filePathEnum: FilePath;
}