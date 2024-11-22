import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  ModelMappingPrefix,
  ModelMappingTable
} from '../enums/model-mapping.enum';
import { generateRandomString } from '../utils/random';
import { PrismaService } from './prisma.service';

@Injectable()
export class ReferenceService {
  constructor(private prisma: PrismaService) { }

  /**
   * Generates a unique reference string with the given prefix.
   * 
   * @param prefix - The prefix to be used for the reference.
   * @param length - The length of the random string to be appended to the prefix.
   * @param referenceField - The field name in the database table where the reference is stored.
   * @returns A promise that resolves to the generated reference string.
   * @throws {HttpException} If the table corresponding to the prefix is not found.
   */
  async generate(
    prefix: ModelMappingPrefix,
    length: number = 10,
    referenceField: string = 'reference'
  ): Promise<string> {

    if (!prefix) {
      throw new HttpException('Préfixe non trouvé', 500);
    }

    const reference = `${prefix}-${generateRandomString(length)}`;

    const property = Object.keys(ModelMappingPrefix).find(
      (key) => ModelMappingPrefix[key] === prefix
    );

    const table = ModelMappingTable[property];

    if (!table) {
      throw new HttpException('Table non trouvée pour le préfixe: ' + prefix, 500);
    }

    // Type assertion to inform TypeScript of the correct model type
    const model: any = this.prisma[table];

    const existingReference = await model.findFirst({
      where: {
        [referenceField]: reference
      }
    });

    if (existingReference) {
      return this.generate(prefix, length, referenceField);
    }

    return reference.toUpperCase();
  }
}
