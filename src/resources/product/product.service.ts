import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { ProductEntity } from './entities/product.entity';
import { SlugService } from 'src/commons/services/slug.service';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';

@Injectable()
export class ProductService extends BaseCRUDService<ProductEntity> {
  constructor(
    protected readonly slugService: SlugService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(modelName);
  }

  create(createProductDto: CreateProductDto, connectedUserId: string) {
    const slug = this.slugService.slugify(createProductDto.name);

    return this.genericCreate({
      data: {
        ...createProductDto,
        slug,
        image: createProductDto.image?.filename
      },
      connectedUserId,
      include: { category: true }
    });
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll({
      params,
      include: {
        category: true
      }
    });
  }

  findOne(id: string) {
    return this.genericFindOne({ id, include: { category: true } });
  }

  findOneBy(whereClause: any, include?: any, select?: any): Promise<ProductEntity> {
    return this.genericFindOneBy({ whereClause, include, select });
  }

  update(id: string, updateProductDto: UpdateProductDto, connectedUserId: string) {
    let slug = updateProductDto.name ? this.slugService.slugify(updateProductDto.name) : undefined;

    return this.genericUpdate({
      id,
      data: {
        ...updateProductDto,
        slug,
        image: updateProductDto.image ? updateProductDto.image.filename : undefined
      },
      connectedUserId,
      include: { category: true }
    });
  }

  delete(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete({id, connectedUserId, include: { category: true }});
  }

  restore(id: string, connectedUserId?: string) {
    return this.genericRestore({id, connectedUserId, include: { category: true }});
  }

  async count(whereClause?: any): Promise<number> {
    return this.genericCount(whereClause);
  }

  async groupBy(by: any, whereClause?: any, orderBy?: any, skip?: number, take?: number): Promise<any> {
    return this.genericGroupBy({by, whereClause, orderBy, skip, take});
  }
}
