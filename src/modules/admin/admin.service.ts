import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminRoles, AdminUser, Slider } from './admin.entities';
import { IAdminAuthContext, OrderDir, OrderStatus } from 'src/types';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IsNull,
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
import { UpdateOrderDto } from '../order/order.dto';

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
    @InjectRepository(AdminRoles)
    private readonly adminRoleRepository: Repository<AdminRoles>,
    private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger(AdminService.name);

  async fetchRoles() {
    return this.adminRoleRepository.find();
  }

  async deleteAdmin(id: number) {
    return this.adminUserRepository.delete({ id });
  }

  async createAdmin(user: {
    fullName: string;
    email: string;
    password: string;
    roleId: number;
    phone: string;
  }) {
    const roleExists = await this.adminRoleRepository.findOneBy({
      id: user.roleId,
    });
    if (!roleExists) throw new NotFoundException('Role does not exist');
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const userModel = this.adminUserRepository.create({
      fullName: user.fullName,
      email: user.email,
      password: hashedPassword,
      role: { id: user.roleId },
      phone: user.phone,
    });
    return this.adminUserRepository.save(userModel);
  }

  async updateAdmin(
    id: number,
    user: {
      fullName: string;
      password: string;
      roleId: number;
    },
  ) {
    const roleExists = await this.adminRoleRepository.findOneBy({
      id: user.roleId,
    });
    if (!roleExists) throw new NotFoundException('Role does not exist');
    let hashedPassword = '';
    if (user.password) hashedPassword = await bcrypt.hash(user.password, 12);
    const userModel = this.adminUserRepository.create({
      id,
      ...(user.fullName ? { fullName: user.fullName } : {}),
      ...(user.password ? { password: hashedPassword } : {}),
      ...(user.roleId ? { role: { id: user.roleId } } : {}),
    });
    return this.adminUserRepository.save(userModel);
  }

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
    // if (categoryExists.featuredImage) {
    //   try {
    //     fs.unlinkSync(
    //       path.join(
    //         dirname(__dirname),
    //         '..',
    //         '..',
    //         '..',
    //         'images',
    //         categoryExists.featuredImage,
    //       ),
    //     );
    //   } catch (error) {
    //     this.logger.log(`Error occurred while deleting file: ${error}`);
    //   }
    // }
    const catModel = this.mainCategoryRepository.create({
      id,
      deletedAt: new Date(),
    });
    const subCategoriesToDelete = await this.subCategoryRepository.findBy({
      mainCategory: { id },
    });
    const productsToDelete = await this.productsRepository.findBy({
      mainCategory: { id },
    });
    const deletePromises = [];
    for (const cat of subCategoriesToDelete) {
      deletePromises.push(
        this.subCategoryRepository.save({ id: cat.id, deletedAt: new Date() }),
      );
    }
    for (const prod of productsToDelete) {
      deletePromises.push(
        this.productsRepository.save({ id: prod.id, deletedAt: new Date() }),
      );
    }
    return this.mainCategoryRepository.save(catModel);
  }

  async deleteSubCategory(id: number) {
    const categoryExists = await this.subCategoryRepository.findOneBy({ id });
    if (!categoryExists) throw new NotFoundException('Category does not exist');
    // if (categoryExists.featuredImage) {
    //   try {
    //     fs.unlinkSync(
    //       path.join(
    //         dirname(__dirname),
    //         '..',
    //         '..',
    //         '..',
    //         'images',
    //         categoryExists.featuredImage,
    //       ),
    //     );
    //   } catch (error) {
    //     this.logger.log(`Error occurred while deleting file: ${error}`);
    //   }
    // }
    const catModel = this.subCategoryRepository.create({
      id,
      deletedAt: new Date(),
    });
    const productsToDelete = await this.productsRepository.findBy({
      category: { id },
    });
    const deletePromises = [];
    for (const prod of productsToDelete) {
      deletePromises.push(
        this.productsRepository.save({ id: prod.id, deletedAt: new Date() }),
      );
    }
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
      try {
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
      } catch (error) {
        this.logger.log(`Error occurred while deleting file: ${error}`);
      }
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
      try {
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
      } catch (error) {
        this.logger.log(`Error occurred while deleting file: ${error}`);
      }
    }
    const sliderModel = this.sliderRepository.create({
      ...(latestSlider ? { id: latestSlider.id } : {}),
      image: slider,
    });
    return this.sliderRepository.save(sliderModel);
  }

  async updateOrderProductStatus(id: number, body: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');
    const orderDetails = JSON.parse(order.details);
    orderDetails.cart = orderDetails.cart.map((c) => {
      if (body.products.includes(c.id)) {
        c.status = body.status;
      }
      return c;
    });
    await this.orderRepository.save(
      this.orderRepository.create({
        id,
        details: JSON.stringify(orderDetails),
      }),
    );
  }

  async updateOrderStatus(id: number, status: OrderStatus) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');
    if (status === OrderStatus.PACKED_AND_READY_TO_PICKUP) {
      // SEND INFORMATION TO CUSTOMER THAT ORDER IS READY FOR PICKUP AT DISTRIBUTION CENTER ADDRESS AND PHONE NUMBER TO CALL
    }
    const orderModel = this.orderRepository.create({
      id,
      status,
    });
    return this.orderRepository.save(orderModel);
  }

  async assignOrderToAgent(id: number, agentId: number) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');
    const deliveryAgent = await this.adminUserRepository.findOneBy({
      id: agentId,
    });
    if (!deliveryAgent) throw new NotFoundException('Delivery agent not found');
    return this.orderRepository.save(
      this.orderRepository.create({
        id,
        adminUser: { id: agentId },
      }),
    );
  }

  async assignStoreToAgent(
    id: number,
    storeId: number,
    agentId: number,
    { adminUserId }: IAdminAuthContext,
  ) {
    const order = await this.orderRepository.findOneBy({ id });
    if (!order) throw new NotFoundException('Order not found');

    const deliveryAgent = await this.adminUserRepository.findOneBy({
      id: agentId,
    });
    if (!deliveryAgent) throw new NotFoundException('Delivery agent not found');

    const orderDetails = JSON.parse(order.details);
    orderDetails.cart = orderDetails.cart.map((c) => {
      if (c.storeId === storeId) {
        c.adminUserId = adminUserId;
        c.status = 'Assigned to Courier';
        c.agentId = agentId;
        c.agentPhone = deliveryAgent.phone;
        c.agentName = deliveryAgent.fullName;
      }
      return c;
    });

    await this.orderRepository.save(
      this.orderRepository.create({
        id,
        details: JSON.stringify(orderDetails),
      }),
    );

    return {
      message: 'Agent successfully assigned to the store',
      updatedOrderDetails: orderDetails,
    };
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
    const store = await this.storeRepository.findOne({
      where: { id },
      withDeleted: true,
    });
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
    const customer = await this.customerRepository.findOne({
      where: { id },
      withDeleted: true,
    });
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
      createdAt: Not(IsNull()),
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
      withDeleted: true,
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(stores, totalStores, {
      page,
      limit,
    });
  }

  async fetchAdmins(search: string, pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
    const allConditions = search
      ? [
          { ...(search ? { fullName: Like(`%${search}%`) } : {}) },
          { ...(search ? { email: Like(`%${search}%`) } : {}) },
        ]
      : {};
    const totalAdminUsers = await this.adminUserRepository.countBy(
      allConditions,
    );
    const adminUsers = await this.adminUserRepository.find({
      where: allConditions,
      order: {
        createdAt: OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(adminUsers, totalAdminUsers, {
      page,
      limit,
    });
  }

  async fetchCategories(search: string, pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
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
    const totalCategories = await this.subCategoryRepository.countBy(
      allConditions,
    );
    const categories = await this.subCategoryRepository.find({
      where: allConditions,
      order: {
        createdAt: OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(categories, totalCategories, {
      page,
      limit,
    });
  }

  async fetchAllMainCategories() {
    return this.mainCategoryRepository.findBy({});
  }

  async fetchSubCategories(id: number) {
    return this.subCategoryRepository.findBy({ mainCategory: { id } });
  }

  async fetchMainCategories(search: string, pagination: PaginationInput) {
    const { page = 1, limit = 20 } = pagination;
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
    const totalCategories = await this.mainCategoryRepository.countBy(
      allConditions,
    );
    const categories = await this.mainCategoryRepository.find({
      where: allConditions,
      order: {
        createdAt: OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(categories, totalCategories, {
      page,
      limit,
    });
  }

  async fetchCustomers(
    pagination: PaginationInput,
    filter: CustomerFilter,
    search: string,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const baseConditions = {
      createdAt: Not(IsNull()),
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
      withDeleted: true,
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
      userId: 0,
      name: user.fullName,
      email: user.email,
      role: user.role,
      adminUserId: user.id,
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
