import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDto,
  ProductFilter,
  UpdateProductDto,
} from './products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './products.entity';
import {
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { IAuthContext, OrderDir } from 'src/types';
import { PaginationInput } from 'src/base/dto';
import fs from 'fs';
import path, { dirname } from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  async fetchProducts(
    pagination: PaginationInput,
    filter: ProductFilter,
    search: string,
    showUnpublishedProducts: boolean = false,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const baseConditions = {
      ...(filter?.published && showUnpublishedProducts
        ? { published: filter?.published === 'true' }
        : { published: true }),
      ...(filter?.outOfStock
        ? { outOfStock: filter?.outOfStock === 'true' }
        : {}),
      ...(filter?.minPrice
        ? { discountPrice: MoreThanOrEqual(parseFloat(filter?.minPrice)) }
        : {}),
      ...(filter?.maxPrice
        ? { discountPrice: LessThanOrEqual(parseFloat(filter?.maxPrice)) }
        : {}),
      ...(filter?.avgRating ? { avgRating: parseInt(filter?.avgRating) } : {}),
      ...(filter?.storeId ? { store: { id: parseInt(filter?.storeId) } } : {}),
    };
    return this.productRepository.find({
      where: [
        {
          ...baseConditions,
          ...(search ? { name: Like(`%${search}%`) } : {}),
        },
        {
          ...baseConditions,
          ...(search ? { description: Like(`%${search}%`) } : {}),
        },
      ],
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
  }

  async updateProduct(
    id: number,
    product: UpdateProductDto,
    { userId, store }: IAuthContext,
  ) {
    const productExists = await this.productRepository.findOneBy({
      id,
      ...(store ? { store } : {}),
    });
    if (!productExists) throw new NotFoundException('Product does not exist');
    const duplicateExists = await this.productRepository.findOneBy({
      id: Not(id),
      name: product.name,
      store: productExists.store,
    });
    if (duplicateExists)
      throw new BadRequestException('Product name cannot be duplicate');
    if (
      product.featuredImage &&
      product.featuredImage !== productExists.featuredImage
    ) {
      fs.unlinkSync(
        path.join(
          dirname(__dirname),
          '..',
          '..',
          'images',
          productExists.featuredImage,
        ),
      );
    }
    if (product.images && product.images.split(',').length) {
      for (const oldImage of productExists.images.split(',')) {
        fs.unlinkSync(
          path.join(dirname(__dirname), '..', '..', 'images', oldImage),
        );
      }
    }
    const productModel = this.productRepository.create({
      id,
      ...product,
      ...(userId ? { lastUpdatedBy: { id: userId } } : {}),
    });
    return this.productRepository.save(productModel);
  }

  async createProduct(
    product: CreateProductDto,
    { store, userId }: IAuthContext,
  ) {
    const productExists = await this.productRepository.findOneBy({
      name: product.name,
      store,
    });
    if (productExists)
      throw new BadRequestException('Product name cannot be duplicate');
    const productModel = this.productRepository.create({
      ...product,
      store: store,
      createdBy: { id: userId },
    });
    return this.productRepository.save(productModel);
  }

  async deleteProduct(id: number, { userId, store }: IAuthContext) {
    const productExists = await this.productRepository.findOneBy({
      id,
      store,
    });
    if (!productExists) throw new NotFoundException('Product does not exist');
    const productModel = this.productRepository.create({
      id,
      deletedAt: new Date(),
      lastUpdatedBy: { id: userId },
    });
    return this.productRepository.save(productModel);
  }
}
