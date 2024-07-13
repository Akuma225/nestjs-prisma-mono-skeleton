import { HttpException, Logger } from '@nestjs/common';
import { SupportedTypesFile } from 'src/commons/enums/supported-types-file.enum';

export const FileValidation = (type: string, file, callback) => {
  Logger.log("Validating file");
  Logger.log("File type: " + type);
  Logger.log(file, "File object");

  const supportedTypes = SupportedTypesFile[type];

  if (!supportedTypes) {
    const error = new HttpException(
      `Type de fichier non pris en charge (${type}). Les types de fichiers pris en charge sont: ${Object.keys(SupportedTypesFile).join(',')}`,
      400,
    );

    return callback(error, false);
  }

  // Get mimeType from file.originalname
  const mimeType = file.originalname.split('.').pop().toLowerCase();
  let SUPPORTED_TYPES = supportedTypes.split('|').map((x) => x.toLowerCase().trim());

  if (!SUPPORTED_TYPES.includes(mimeType)) {
    const error = new HttpException(
      `Format de fichier non pris en charge (${file.originalname}). Les formats de fichiers pris en charge sont: ${SUPPORTED_TYPES.map((x) => x.toUpperCase()).join(',')}`,
      400,
    );

    return callback(error, false);
  }

  callback(null, true);
};
