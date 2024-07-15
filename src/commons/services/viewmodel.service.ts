import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuditProperties } from '../enums/audit_properties.enum';
import { UserMinVm } from '../shared/viewmodels/user.min.vm';

@Injectable()
export class ViewmodelService {
  constructor(private readonly prismaService: PrismaService) { }

  /**
   * Creates a view model instance based on the provided data and view model class.
   * @param data - The data to be used for creating the view model.
   * @param viewModel - The view model class to be instantiated.
   * @param extended_audit - Optional. Indicates whether extended audit fields should be processed.
   * @param properties - Optional. The audit properties to be processed. Defaults to [AuditProperties.CREATED_BY, AuditProperties.UPDATED_BY, AuditProperties.DELETED_BY].
   * @returns A promise that resolves to the created view model instance.
   * @throws HttpException if the data is not found.
   */
  async createViewModel<T>(
    data: any,
    viewModel: new (data: any) => T,
    extended_audit?: boolean,
    properties: AuditProperties[] = [
      AuditProperties.CREATED_BY,
      AuditProperties.UPDATED_BY,
      AuditProperties.DELETED_BY,
    ]
  ): Promise<T> {
    if (!data) {
      throw new HttpException('Donnée introuvable', 404);
    }

    const additionalProperties = await this.processAuditFields(
      data,
      extended_audit,
      properties
    );
    return new viewModel({ ...data, ...additionalProperties });
  }

  /**
   * Creates an array of view models from an array of data objects.
   * @template T - The type of the view model.
   * @param dataArray - The array of data objects.
   * @param viewModel - The constructor function for the view model.
   * @param extended_audit - Optional flag to enable extended audit.
   * @param properties - Optional array of audit properties.
   * @returns A promise that resolves to an array of view models.
   * @throws HttpException if the dataArray is not an array.
   */
  async createArrayViewModel<T>(
    dataArray: any[],
    viewModel: new (data: any) => T,
    extended_audit?: boolean,
    properties: AuditProperties[] = [
      AuditProperties.CREATED_BY,
      AuditProperties.UPDATED_BY,
      AuditProperties.DELETED_BY,
    ]
  ): Promise<T[]> {
    if (!Array.isArray(dataArray)) {
      throw new HttpException('Données introuvables', 404);
    }

    const viewModelPromises = dataArray.map(async (data) => {
      return this.createViewModel(data, viewModel, extended_audit, properties);
    });

    return Promise.all(viewModelPromises);
  }

  /**
   * Creates a paginated view model from the given data.
   * @param data - The data to create the view model from.
   * @param viewModel - The view model class to use for creating the view model objects.
   * @param extended_audit - Optional. Indicates whether extended audit properties should be included.
   * @param properties - Optional. The audit properties to include in the view model.
   * @returns A promise that resolves to an object containing the paginated view model and the total number of results.
   * @throws HttpException if the data is not found.
   */
  async createPaginatedViewModel<T>(
    data: any,
    viewModel: new (data: any) => T,
    extended_audit?: boolean,
    properties: AuditProperties[] = []
  ): Promise<{ result: T[]; total: number }> {
    if (!data) {
      throw new HttpException('Données introuvables', 404);
    }

    const formattedResult = await this.createArrayViewModel(
      data.result,
      viewModel,
      extended_audit,
      properties
    );

    return {
      ...data,
      result: formattedResult,
    };
  }

  /**
   * Retrieves a user by their ID.
   * @param userId - The ID of the user to retrieve.
   * @returns A Promise that resolves to the user object, or null if not found.
   */
  async getUserById(userId): Promise<any> {
    return this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Parses a string value and returns the corresponding value as a string, number, or boolean.
   * If the value is 'true', it returns `true`.
   * If the value is 'false', it returns `false`.
   * If the value can be parsed as a number, it returns the parsed number.
   * Otherwise, it returns the original value.
   * @param value - The string value to parse.
   * @returns The parsed value as a string, number, or boolean.
   */
  parseValue(value: string): string | number | boolean {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else if (!isNaN(Number(value))) {
      return Number(value);
    }
    return value;
  }

  /**
   * Processes the audit fields of the data object.
   * @param data - The data object to process.
   * @param extended_audit - Optional. Indicates whether extended audit is enabled.
   * @param properties - Optional. An array of audit properties to process.
   * @returns A promise that resolves to an object containing the resolved audit properties.
   */
  async processAuditFields(
    data: any,
    extended_audit?: boolean,
    properties: AuditProperties[] = []
  ): Promise<any> {
    if (extended_audit !== undefined) {
      if (!extended_audit) {
        properties = [];
        data.created_by = null;
        data.updated_by = null;
        data.deleted_by = null;
      } else if (properties.length === 0) {
        properties = [
          AuditProperties.CREATED_BY,
          AuditProperties.UPDATED_BY,
          AuditProperties.DELETED_BY,
        ];
      }
    }

    const propertyPromises = properties.map(async (prop) => {
      const userId = data[prop];

      if (userId) {
        const user = await this.getUserById(userId);
        return user ? { [prop]: new UserMinVm(user) } : { [prop]: null };
      }
      return { [prop]: null };
    });

    const resolvedProperties = await Promise.all(propertyPromises);
    return resolvedProperties.reduce((acc, prop) => ({ ...acc, ...prop }), {});
  }
}
