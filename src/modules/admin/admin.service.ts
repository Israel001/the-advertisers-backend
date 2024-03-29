import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminUser, Slider } from './admin.entities';
import { IAdminAuthContext, OrderDir, OrderStatus } from 'src/types';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { PaginationInput } from 'src/base/dto';
import {
  CreateMainCategoryDto,
  CustomerFilter,
  UpdateMainCategoryDto,
} from './dto';
import { Customer, Store, StoreUsers } from '../users/users.entity';
import { UpdateCustomerDto, UpdateStoreDto } from '../users/users.dto';
import { Products } from '../products/products.entity';
import { Order } from '../order/order.entity';
import { buildResponseDataWithPagination } from 'src/utils';
import fs from 'fs';
import path, { dirname } from 'path';
import { MainCategory, SubCategory } from '../category/category.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminUserRepository: Repository<AdminUser>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreUsers)
    private readonly storeUsersRepository: Repository<StoreUsers>,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,
    @InjectRepository(MainCategory)
    private readonly mainCategoryRepository: Repository<MainCategory>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
    private readonly jwtService: JwtService,
  ) {}

  async getSlider() {
    const latestSlider = await this.sliderRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });
    return latestSlider.image;
  }

  async createMainCategory(category: CreateMainCategoryDto) {
    const duplicateExists = await this.mainCategoryRepository.findOneBy({
      name: category.name,
    });
    if (duplicateExists)
      throw new ConflictException(
        `Category with name: ${category.name} already exists`,
      );
    const catModel = this.mainCategoryRepository.create({ ...category });
    return this.mainCategoryRepository.save(catModel);
  }

  async deleteMainCategory(id: number) {
    const categoryExists = await this.mainCategoryRepository.findOneBy({ id });
    if (!categoryExists) throw new NotFoundException('Category does not exist');
    if (categoryExists.featuredImage) {
      fs.unlinkSync(
        path.join(
          dirname(__dirname),
          '..',
          '..',
          '..',
          'images',
          categoryExists.featuredImage,
        ),
      );
    }
    const catModel = this.mainCategoryRepository.create({
      id,
      deletedAt: new Date(),
    });
    return this.mainCategoryRepository.save(catModel);
  }

  async deleteSubCategory(id: number) {
    const categoryExists = await this.subCategoryRepository.findOneBy({ id });
    if (!categoryExists) throw new NotFoundException('Category does not exist');
    if (categoryExists.featuredImage) {
      fs.unlinkSync(
        path.join(
          dirname(__dirname),
          '..',
          '..',
          '..',
          'images',
          categoryExists.featuredImage,
        ),
      );
    }
    const catModel = this.subCategoryRepository.create({
      id,
      deletedAt: new Date(),
    });
    return this.subCategoryRepository.save(catModel);
  }

  async updateMainCategory(category: UpdateMainCategoryDto, id: number) {
    const categoryExists = await this.mainCategoryRepository.findOneBy({ id });
    if (!categoryExists) throw new NotFoundException('Category does not exist');
    const duplicateExists = await this.mainCategoryRepository.findOneBy({
      id: Not(id),
      name: category.name,
    });
    if (duplicateExists)
      throw new ConflictException(
        `Category with name: ${category.name} already exists`,
      );
    if (
      category.featuredImage &&
      category.featuredImage !== categoryExists.featuredImage
    ) {
      fs.unlinkSync(
        path.join(
          dirname(__dirname),
          '..',
          '..',
          '..',
          'images',
          categoryExists.featuredImage,
        ),
      );
    }
    const catModel = this.mainCategoryRepository.create({ id, ...category });
    return this.mainCategoryRepository.save(catModel);
  }

  async uploadSlider(slider: string) {
    const latestSlider = await this.sliderRepository.findOne({
      where: {},
      order: { id: 'DESC' },
    });
    if (latestSlider && latestSlider?.image && latestSlider?.image !== slider) {
      fs.unlinkSync(
        path.join(
          dirname(__dirname),
          '..',
          '..',
          '..',
          'images',
          latestSlider.image,
        ),
      );
    }
    const sliderModel = this.sliderRepository.create({
      ...(latestSlider ? { id: latestSlider.id } : {}),
      image: slider,
    });
    return this.sliderRepository.save(sliderModel);
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');
    const orderModel = this.orderRepository.create({
      id,
      status,
    });
    return this.orderRepository.save(orderModel);
  }

  async deleteProduct(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    const productModel = this.productsRepository.create({
      id,
      deletedAt: new Date(),
    });
    return this.productsRepository.save(productModel);
  }

  async activateStore(id: number) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) throw new NotFoundException('Store not found');
    const storeModel = this.storeRepository.create({
      id,
      deletedAt: null,
    });
    await this.storeRepository.save(storeModel);
    const storeUsers = await this.storeUsersRepository.find({
      where: { store: { id } },
    });
    const storeProducts = await this.productsRepository.find({
      where: { store: { id } },
    });
    const promises = [];
    for (const user of storeUsers) {
      const storeUserModel = this.storeUsersRepository.create({
        id: user.id,
        deletedAt: null,
      });
      promises.push(this.storeUsersRepository.save(storeUserModel));
    }
    for (const product of storeProducts) {
      const productModel = this.productsRepository.create({
        id: product.id,
        published: true,
      });
      promises.push(this.productsRepository.save(productModel));
    }
    await Promise.all(promises);
  }

  async deactivateStore(id: number) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) throw new NotFoundException('Store not found');
    const storeModel = this.storeRepository.create({
      id,
      deletedAt: new Date(),
    });
    await this.storeRepository.save(storeModel);
    const storeUsers = await this.storeUsersRepository.find({
      where: { store: { id } },
    });
    const storeProducts = await this.productsRepository.find({
      where: { store: { id } },
    });
    const promises = [];
    for (const user of storeUsers) {
      const storeUserModel = this.storeUsersRepository.create({
        id: user.id,
        deletedAt: new Date(),
      });
      promises.push(this.storeUsersRepository.save(storeUserModel));
    }
    for (const product of storeProducts) {
      const productModel = this.productsRepository.create({
        id: product.id,
        published: false,
      });
      promises.push(this.productsRepository.save(productModel));
    }
    await Promise.all(promises);
  }

  async deactivateCustomer(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('Customer not found');
    const customerModel = this.customerRepository.create({
      id,
      deletedAt: new Date(),
    });
    return this.customerRepository.save(customerModel);
  }

  async activateCustomer(id: number) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('Customer not found');
    const customerModel = this.customerRepository.create({
      id,
      deletedAt: null,
    });
    return this.customerRepository.save(customerModel);
  }

  async updateStore(id: number, body: UpdateStoreDto) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) throw new NotFoundException('Store not found');
    const storeModel = this.storeRepository.create({
      id,
      ...body,
    });
    return this.storeRepository.save(storeModel);
  }

  async updateCustomer(id: number, body: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('Customer not found');
    const customerModel = this.customerRepository.create({
      id,
      ...body,
    });
    return this.customerRepository.save(customerModel);
  }

  async getCustomerById(id: number) {
    return this.customerRepository.findOneBy({ id });
  }

  async fetchStores(
    pagination: PaginationInput,
    filter: CustomerFilter,
    search: string,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const baseConditions = {
      ...(filter?.startDate
        ? { createdAt: MoreThanOrEqual(filter?.startDate) }
        : {}),
      ...(filter?.endDate
        ? { createdAt: LessThanOrEqual(filter?.endDate) }
        : {}),
    };
    const allConditions = [
      {
        ...baseConditions,
        ...(search ? { storeName: Like(`%${search}%`) } : {}),
      },
    ];
    const totalStores = await this.storeRepository.countBy(allConditions);
    const stores = await this.storeRepository.find({
      where: allConditions,
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(stores, totalStores, {
      page,
      limit,
    });
  }

  async fetchCategories(search: string) {
    // const { page = 1, limit = 20 } = pagination;
    const allConditions = search
      ? [
          {
            ...(search ? { name: Like(`%${search}%`) } : {}),
          },
          {
            ...(search ? { description: Like(`%${search}%`) } : {}),
          },
        ]
      : {};
    const categories = await this.subCategoryRepository.find({
      where: allConditions,
      order: {
        createdAt: OrderDir.DESC,
      },
    });
    return categories;
  }

  async fetchSubCategories(id: number) {
    return this.subCategoryRepository.findBy({ mainCategory: { id } });
  }

  async fetchMainCategories(search: string) {
    const allConditions = search
      ? [
          {
            ...(search ? { name: Like(`%${search}%`) } : {}),
          },
          {
            ...(search ? { description: Like(`%${search}%`) } : {}),
          },
        ]
      : {};
    const categories = await this.mainCategoryRepository.find({
      where: allConditions,
      order: {
        createdAt: OrderDir.DESC,
      },
    });
    return categories;
  }

  async fetchCustomers(
    pagination: PaginationInput,
    filter: CustomerFilter,
    search: string,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const baseConditions = {
      ...(filter?.startDate
        ? { createdAt: MoreThanOrEqual(filter?.startDate) }
        : {}),
      ...(filter?.endDate
        ? { createdAt: LessThanOrEqual(filter?.endDate) }
        : {}),
    };
    const allConditions = [
      {
        ...baseConditions,
        ...(search ? { fullName: Like(`%${search}%`) } : {}),
      },
      {
        ...baseConditions,
        ...(search ? { phone: Like(`%${search}%`) } : {}),
      },
      {
        ...baseConditions,
        ...(search ? { email: Like(`%${search}%`) } : {}),
      },
    ];
    const totalCustomers = await this.customerRepository.countBy(allConditions);
    const customers = await this.customerRepository.find({
      where: allConditions,
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(customers, totalCustomers, {
      page,
      limit,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) return user;
    throw new UnauthorizedException('Invalid details');
  }

  async findUserByEmail(email: string) {
    return this.adminUserRepository.findOne({
      where: { email },
    });
  }

  async login(user: AdminUser) {
    const payload: IAdminAuthContext = {
      userId: user.id,
      name: user.fullName,
      email: user.email,
    };
    const userInfo = await this.findUserByEmail(user.email);
    delete userInfo.password;
    delete userInfo.createdAt;
    delete userInfo.updatedAt;
    return {
      accessToken: this.jwtService.sign(payload),
      user: userInfo,
    };
  }
}
