import {
  BadRequestException,
  Injectable,
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
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { IAuthContext, OrderDir } from 'src/types';
import { PaginationInput } from 'src/base/dto';
import fs from 'fs';
import path, { dirname } from 'path';
import { buildResponseDataWithPagination } from 'src/utils';
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

  async fetchTopSellingProducts() {
    return this.productRepository.query(
      `SELECT * FROM products ORDER BY RAND() LIMIT 4`,
    );
  }

  async fetchPopularSales() {
    return this.productRepository.query(
      `SELECT * FROM products ORDER BY RAND() LIMIT 3`,
    );
  }

  async fetchRandomCategories() {
    return this.productRepository.query(
      `SELECT * FROM sub_categories ORDER BY RAND() LIMIT 12`,
    );
  }

  async fetchProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'mainCategory', 'store'],
    });
    const totalProductInStore = await this.productRepository.countBy({
      store: { id: product.store.id },
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
    const totalProducts = await this.productRepository.countBy(allConditions);
    const products = await this.productRepository.find({
      where: allConditions,
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
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
      store,
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
