import { HttpException, Injectable } from '@nestjs/common';
import {
  ModelMappingPrefix,
  ModelMappingTable
} from '../enums/model-mapping.enum';
import { generateRandomString } from '../utils/random';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReferenceService {
  constructor(private prisma: PrismaService) {}

  async generate(prefix: ModelMappingPrefix, length: number = 10, referenceField: string = 'reference') {
    const reference = prefix + '-' + generateRandomString(length);

    const table = ModelMappingTable[prefix];

    if (!table) {
      throw new HttpException('Table non trouvée', 500);
    }

    // Type assertion to inform TypeScript of the correct model type
    const model: any = this.prisma[table];

    const existingReference = await model.findFirst({
      where: {
        [referenceField]: reference
      }
    });

    if (existingReference) {
      return this.generate(prefix, length);
    }

    return reference.toUpperCase();
  }
}
