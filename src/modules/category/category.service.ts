import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MainCategory, SubCategory } from './category.entity';
import { Like, Not, Repository } from 'typeorm';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { PaginationInput } from 'src/base/dto';
import { OrderDir } from 'src/types';
import { buildResponseDataWithPagination } from 'src/utils';
import fs from 'fs';
import path, { dirname } from 'path';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(MainCategory)
    private readonly mainCategoryRepository: Repository<MainCategory>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) { }
  
  private logger = new Logger(CategoryService.name);

  async createMainCategory(category: CreateCategoryDto) {
    const categoryModel = this.mainCategoryRepository.create({ ...category });
    return this.mainCategoryRepository.save(categoryModel);
  }

  async createSubCategory(mainCategoryId: number, category: CreateCategoryDto) {
    const mainCategoryExists = await this.mainCategoryRepository.findOneBy({
      id: mainCategoryId,
    });
    if (!mainCategoryExists)
      throw new NotFoundException('Main category does not exist');
    const categoryExists = await this.subCategoryRepository.findOneBy({
      name: category.name,
    });
    if (categoryExists)
      throw new ConflictException(
        `Category with name: ${category.name} already exists`,
      );
    const categoryModel = this.subCategoryRepository.create({
      ...category,
      mainCategory: { id: mainCategoryId },
    });
    return this.subCategoryRepository.save(categoryModel);
  }

  async updateSubCategory(categoryId: number, category: UpdateCategoryDto) {
    const subCategoryExists = await this.subCategoryRepository.findOneBy({
      id: categoryId,
    });
    if (!subCategoryExists)
      throw new NotFoundException('Subcategory does not exist');
    const duplicateExists = await this.subCategoryRepository.findOneBy({
      id: Not(categoryId),
      name: category.name,
    });
    if (duplicateExists)
      throw new ConflictException('Category name cannot be duplicate');
    if (
      category.featuredImage &&
      category.featuredImage !== subCategoryExists.featuredImage
    ) {
      try {
        fs.unlinkSync(
          path.join(
            dirname(__dirname),
            '..',
            '..',
            '..',
            'images',
            subCategoryExists.featuredImage,
          ),
        );
      } catch (error) {
        this.logger.log(`Error occurred while deleting file: ${error}`);
      }
    }
    const categoryModel = this.subCategoryRepository.create({
      id: categoryId,
      ...category,
    });
    return this.subCategoryRepository.save(categoryModel);
  }

  async getMainCategoryById(id: number) {
    return this.mainCategoryRepository.findOneBy({ id });
  }

  async getSubCategoryById(id: number) {
    return this.subCategoryRepository.findOneBy({ id });
  }

  async fetchMainCategories(pagination: PaginationInput, search: string) {
    const { page = 1, limit = 20 } = pagination;
    const totalCategories = await this.mainCategoryRepository.countBy({
      ...(search ? { name: Like(`%${search}%`) } : {}),
    });
    const mainCategories = await this.mainCategoryRepository.find({
      where: {
        ...(search ? { name: Like(`%${search}%`) } : {}),
      },
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(mainCategories, totalCategories, {
      page,
      limit,
    });
  }

  async fetchSubCategories(
    mainCategoryId: number,
    pagination: PaginationInput,
    search: string,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const totalCategories = await this.subCategoryRepository.countBy({
      mainCategory: { id: mainCategoryId },
      ...(search ? { name: Like(`%${search}%`) } : {}),
    });
    const subCategories = await this.subCategoryRepository.find({
      where: {
        mainCategory: { id: mainCategoryId },
        ...(search ? { name: Like(`%${search}%`) } : {}),
      },
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(subCategories, totalCategories, {
      page,
      limit,
    });
  }
}
