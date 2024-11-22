import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { VerifyOwnershipGuard } from '../guards/ownership.guard';
import { ModelMappingTable } from '../enums/model-mapping.enum';

export function VerifyOwnership(data: { target: 'params' | 'body' | 'query', key?: string, table: ModelMappingTable, tableProperty?: string, propertyPath: string }) {
    data.key = data.key || 'id';
    data.tableProperty = data.tableProperty || 'id';

    return applyDecorators(
        SetMetadata('verify-ownership-target', data.target),
        SetMetadata('verify-ownership-key', data.key),
        SetMetadata('verify-ownership-table', data.table),
        SetMetadata('verify-ownership-tableProperty', data.tableProperty),
        SetMetadata('verify-ownership-propertyPath', data.propertyPath),
        UseGuards(VerifyOwnershipGuard),
    );
}
