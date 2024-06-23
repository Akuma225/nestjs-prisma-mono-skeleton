import { HttpException } from '@nestjs/common';
import { SupportedTypesFile } from 'src/commons/enums/supported-types-file.enum';

export const FileValidation = (type: SupportedTypesFile, file, callback) => {
  // Get mimeType from file.originalname
  const mimeType = file.originalname.split('.').pop().toLowerCase();
  let SUPPORTED_TYPES = SupportedTypesFile[type].split('|').map((x) => x.toLowerCase().trim());

  if (!SUPPORTED_TYPES.includes(mimeType)) {
    const error = new HttpException(
      `Format de fichier non pris en charge (${file.originalname}). Les formats de fichiers pris en charge sont: ${SUPPORTED_TYPES.map((x) => x.toUpperCase()).join(',')}`,
      400,
    );

    return callback(error, false);
  }

  callback(null, true);
};
