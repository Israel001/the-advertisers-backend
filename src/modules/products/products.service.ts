import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateProductDto,
  CreateReviewDto,
  ProductFilter,
  UpdateProductDto,
  UpdateReviewDto,
} from './products.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products, Reviews } from './products.entity';
import {
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { IAuthContext, OrderDir } from 'src/types';
import { PaginationInput } from 'src/base/dto';
import fs from 'fs';
import path, { dirname } from 'path';
import {
  buildResponseDataWithPagination,
  underscoreKeysToCamelCase,
} from 'src/utils';
import { MainCategory, SubCategory } from '../category/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    @InjectRepository(MainCategory)
    private readonly mainCategoryRepository: Repository<MainCategory>,
    @InjectRepository(Reviews)
    private readonly reviewRepository: Repository<Reviews>,
  ) {}

  private logger = new Logger(ProductsService.name);

  async fetchTopSellingProducts() {
    return this.productRepository.query(
      `SELECT * FROM products WHERE published = '1' AND deleted_at IS NULL ORDER BY RAND() LIMIT 4`,
    );
  }

  async fetchPopularSales() {
    return this.productRepository.query(
      `SELECT * FROM products WHERE published = '1' AND deleted_at IS NULL ORDER BY RAND() LIMIT 4`,
    );
  }

  async fetchRandomCategories() {
    return this.productRepository.query(
      `SELECT * FROM sub_categories WHERE deleted_at IS NULL ORDER BY RAND() LIMIT 12`,
    );
  }

  async fetchStoreProductById(id: number, storeId: number) {
    const product = await this.productRepository.findOne({
      where: { id, store: { id: storeId } },
      relations: ['category', 'mainCategory', 'store'],
    });
    if (!product) throw new NotFoundException('Product not found');
    const reviews = await this.reviewRepository.findOneBy({
      product: { id },
    });
    product['reviews'] = reviews;
    return product;
  }

  async fetchProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id, published: true },
      relations: ['category', 'mainCategory', 'store'],
    });
    const totalProductInStore = await this.productRepository.countBy({
      store: { id: product?.store?.id },
    });
    product['totalProductInStore'] = totalProductInStore;
    const otherProducts = await this.productRepository.query(
      `SELECT * FROM products ORDER BY RAND() LIMIT 8`,
    );
    const relatedProducts = await this.productRepository.query(
      `SELECT * FROM products ORDER BY RAND() LIMIT 4`,
    );
    const reviews = await this.reviewRepository.findOneBy({
      product: { id },
    });
    product['otherProducts'] = otherProducts;
    product['relatedProducts'] = relatedProducts;
    product['reviews'] = reviews;
    return product;
  }

  async fetchProducts(
    pagination: PaginationInput,
    filter: ProductFilter,
    search: string,
    showUnpublishedProducts: boolean = false,
    removePagination: boolean = false,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const baseConditions = {
      id: MoreThan(0),
      ...(showUnpublishedProducts ? {} : { published: true }),
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
      ...(filter?.mainCategoryId
        ? { mainCategory: { id: parseInt(filter?.mainCategoryId) } }
        : {}),
    };
    const allConditions = [
      {
        ...baseConditions,
        ...(search ? { name: Like(`%${search}%`) } : {}),
      },
      {
        ...baseConditions,
        ...(search ? { description: Like(`%${search}%`) } : {}),
      },
      {
        ...baseConditions,
        ...(search ? { brand: Like(`%${search}%`) } : {}),
      },
      {
        ...baseConditions,
        ...(search ? { category: { name: Like(`%${search}%`) } } : {}),
      },
      {
        ...baseConditions,
        ...(search ? { mainCategory: { name: Like(`%${search}%`) } } : {}),
      },
    ];
    console.log(allConditions);
    const totalProducts = await this.productRepository.countBy(
      allConditions.length ? allConditions : {},
    );
    const products = await this.productRepository.find({
      ...(allConditions.length ? { where: allConditions } : {}),
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      relations: ['store'],
      ...(removePagination ? {} : { skip: limit * (page - 1), take: limit }),
    });
    return buildResponseDataWithPagination(products, totalProducts, {
      page,
      limit,
    });
  }

  async updateProduct(
    id: number,
    product: UpdateProductDto,
    { userId, store }: IAuthContext,
  ) {
    const productExists = await this.productRepository.findOne({
      where: {
        id,
        ...(store ? { store: { id: store.id } } : {}),
      },
      relations: ['store'],
    });
    if (!productExists) throw new NotFoundException('Product does not exist');
    const duplicateExists = await this.productRepository.findOneBy({
      id: Not(id),
      name: product.name,
      store: { id: productExists.store.id },
    });
    if (duplicateExists)
      throw new BadRequestException('Product name cannot be duplicate');
    if (
      product.featuredImage &&
      product.featuredImage !== productExists.featuredImage
    ) {
      try {
        fs.unlinkSync(
          path.join(
            dirname(__dirname),
            '..',
            '..',
            '..',
            'images',
            productExists.featuredImage,
          ),
        );
      } catch (error) {
        this.logger.log(`Error occurred while deleting file: ${error}`);
      }
    }
    if (product.images && product.images.split(',').length) {
      for (const oldImage of productExists.images.split(',')) {
        try {
          fs.unlinkSync(
            path.join(dirname(__dirname), '..', '..', 'images', oldImage),
          );
        } catch (error) {
          this.logger.log(`Error occurred while deleting file: ${error}`);
        }
      }
    }
    const productModel = this.productRepository.create({
      id,
      ...product,
      ...(userId ? { lastUpdatedBy: { id: userId } } : {}),
    });
    return this.productRepository.save(productModel);
  }

  async deleteReview(id: number, { userId }: IAuthContext) {
    const reviewExists = await this.reviewRepository.findOneBy({ id });
    if (!reviewExists) throw new NotFoundException('Review not found');
    if (reviewExists.customer.id !== userId)
      throw new UnauthorizedException(
        'You are not authorized to delete this review',
      );
    await this.reviewRepository.softDelete({ id });
  }

  async updateReview(
    id: number,
    review: UpdateReviewDto,
    { userId }: IAuthContext,
  ) {
    const reviewExists = await this.reviewRepository.findOneBy({ id });
    if (!reviewExists) throw new NotFoundException('Review not found');
    if (reviewExists.customer.id !== userId)
      throw new UnauthorizedException(
        'You are not authorized to edit this review',
      );
    const reviewModel = this.reviewRepository.create({
      id,
      ...review,
    });
    await this.reviewRepository.save(reviewModel);
  }

  async createReview(review: CreateReviewDto, { userId }: IAuthContext) {
    const productExists = await this.productRepository.findOneBy({
      id: review.productId,
    });
    if (!productExists) throw new NotFoundException('Product not found');
    const reviewModel = this.reviewRepository.create({
      product: { id: review.productId },
      title: review.title,
      description: review.description,
      rating: review.rating,
      customer: { id: userId },
    });
    await this.reviewRepository.save(reviewModel);
  }

  async createProduct(
    product: CreateProductDto,
    { store, userId }: IAuthContext,
  ) {
    const productExists = await this.productRepository.findOneBy({
      name: product.name,
      store: { id: store.id },
    });
    if (productExists)
      throw new BadRequestException('Product name cannot be duplicate');
    const subCategoryExists = await this.subCategoryRepository.findOneBy({
      id: product.categoryId,
    });
    if (!subCategoryExists)
      throw new NotFoundException('Sub category does not exist');
    const mainCategoryExists = await this.mainCategoryRepository.findOneBy({
      id: product.mainCategoryId,
    });
    if (!mainCategoryExists)
      throw new NotFoundException('Main category does not exist');
    const productModel = this.productRepository.create({
      ...product,
      category: { id: product.categoryId },
      mainCategory: { id: product.mainCategoryId },
      store: store,
      createdBy: { id: userId },
    });
    return this.productRepository.save(productModel);
  }

  async deleteProduct(id: number, { userId, store }: IAuthContext) {
    const productExists = await this.productRepository.findOneBy({
      id,
      store: { id: store.id },
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
