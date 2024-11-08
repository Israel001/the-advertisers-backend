import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminJwtAuthGuard } from './guards/jwt-auth-guard';
import { AllowUnauthorizedRequest } from 'src/decorators/unauthorized.decorator';
import { AdminLocalAuthGuard } from './guards/local-auth-guard';
import * as dtos from './dto';
import { AdminService } from './admin.service';
import { UpdateCustomerDto, UpdateStoreDto } from '../users/users.dto';
import {
  CreateProductDto,
  ProductQuery,
  UpdateProductDto,
} from '../products/products.dto';
import { ProductsService } from '../products/products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { ImageInterceptor } from 'src/lib/image.interceptor';
import { OrderQuery, UpdateOrderDto } from '../order/order.dto';
import { OrderService } from '../order/order.service';
import { IAuthContext, OrderStatus } from 'src/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../category/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store, StoreUsers } from '../users/users.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AdminRole } from 'src/decorators/admin_roles.decorator';
import { AdminRoleGuard } from 'src/modules/admin/guards/role-guard';
import { Request } from 'express';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly productService: ProductsService,
    private readonly orderService: OrderService,
    private readonly categoryService: CategoryService,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreUsers)
    private readonly storeUserRepository: Repository<StoreUsers>,
    private readonly userService: UsersService,
  ) {}

  @Get('roles')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  fetchRoles() {
    return this.service.fetchRoles();
  }

  @Post('deactivate-customer/:id')
  @AdminRole({ roles: ['Super Admin'] })
  deactivateCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.service.deactivateCustomer(id);
  }

  @Post('activate-customer/:id')
  @AdminRole({ roles: ['Super Admin'] })
  activateCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.service.activateCustomer(id);
  }

  @Put('edit-customer/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  editCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCustomerDto,
  ) {
    return this.userService.updateCustomer(id, body);
  }

  @Get()
  @AdminRole({
    roles: ['Super Admin', 'Admin', 'Editor', 'User', 'Simple User'],
  })
  getHello(): string {
    return 'Welcome to The-Advertisers Admin!!!';
  }

  @Get('fetch-admins')
  @AdminRole({ roles: ['Super Admin', 'Delivery Agent'] })
  fetchAdmins(@Query() query: dtos.GeneralQuery) {
    return this.service.fetchAdmins(query.search, query.pagination);
  }

  @Post()
  @AdminRole({ roles: ['Super Admin'] })
  createAdmin(
    @Body()
    body: {
      fullName: string;
      email: string;
      password: string;
      roleId: number;
      phone: string;
    },
  ) {
    return this.service.createAdmin(body);
  }

  @Put(':id')
  @AdminRole({ roles: ['Super Admin'] })
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      fullName: string;
      password: string;
      roleId: number;
    },
  ) {
    return this.service.updateAdmin(id, body);
  }

  @Post('category/:id/subCategory')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'featuredImage', maxCount: 1 }], {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
      storage: diskStorage({
        destination: './images/',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${nanoid()}.${
              file.originalname.split('.')[
                file.originalname.split('.').length - 1
              ]
            }`,
          ),
      }),
    }),
    new ImageInterceptor(),
  )
  createSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateCategoryDto,
  ) {
    return this.categoryService.createSubCategory(id, body);
  }

  @Put('category/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'featuredImage', maxCount: 1 }], {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
      storage: diskStorage({
        destination: './images/',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${nanoid()}.${
              file.originalname.split('.')[
                file.originalname.split('.').length - 1
              ]
            }`,
          ),
      }),
    }),
    new ImageInterceptor(),
  )
  updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoryService.updateSubCategory(id, body);
  }

  @Post('main-category')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'featuredImage', maxCount: 1 }], {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
      storage: diskStorage({
        destination: './images/',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${nanoid()}.${
              file.originalname.split('.')[
                file.originalname.split('.').length - 1
              ]
            }`,
          ),
      }),
    }),
    new ImageInterceptor(),
  )
  createMainCategory(@Body() body: dtos.CreateMainCategoryDto) {
    return this.service.createMainCategory(body);
  }

  @Put('main-category/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'featuredImage', maxCount: 1 }], {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
      storage: diskStorage({
        destination: './images/',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${nanoid()}.${
              file.originalname.split('.')[
                file.originalname.split('.').length - 1
              ]
            }`,
          ),
      }),
    }),
    new ImageInterceptor(),
  )
  updateMainCategory(
    @Body() body: dtos.UpdateMainCategoryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.updateMainCategory(body, id);
  }

  @Delete(':id')
  @AdminRole({ roles: ['Super Admin'] })
  deleteAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteAdmin(id);
  }

  @Delete('main-category/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  deleteMainCategory(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteMainCategory(id);
  }

  @Delete('sub-category/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteSubCategory(id);
  }

  @Get('get-slider')
  @AllowUnauthorizedRequest()
  getSlider() {
    return this.service.getSlider();
  }

  @Post('upload-slider')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'slider', maxCount: 1 }], {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) =>
        file.mimetype.includes('image')
          ? cb(null, true)
          : cb(new BadRequestException('Only images are allowed'), false),
      storage: diskStorage({
        destination: './images/',
        filename: (_req, file, cb) =>
          cb(
            null,
            `${nanoid()}.${
              file.originalname.split('.')[
                file.originalname.split('.').length - 1
              ]
            }`,
          ),
      }),
    }),
    new ImageInterceptor(),
  )
  uploadSlider(@Body() { slider }: { slider: string }) {
    return this.service.uploadSlider(slider);
  }

  @Post('auth/login')
  @AllowUnauthorizedRequest()
  @UseGuards(AdminLocalAuthGuard)
  login(@Body() _body: dtos.AdminLoginDTO, @Req() req: any) {
    return this.service.login(req.user);
  }

  @Get('customers')
  @AdminRole({
    roles: ['Super Admin', 'Admin', 'Editor', 'User', 'Simple User'],
  })
  fetchCustomers(@Query() query: dtos.CustomerQuery) {
    return this.service.fetchCustomers(
      query.pagination,
      query.filter,
      query.search,
    );
  }

  @Get('categories')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor', 'User'] })
  fetchCategories(@Query() query: dtos.GeneralQuery) {
    return this.service.fetchCategories(query.search, query.pagination);
  }

  @Get('main-categories')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor', 'User'] })
  fetchMainCategories(@Query() query: dtos.GeneralQuery) {
    return this.service.fetchMainCategories(query.search, query.pagination);
  }

  @Get('all-main-categories')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor', 'User'] })
  fetchAllMainCategories() {
    return this.service.fetchAllMainCategories();
  }

  @Get('main-categories/:id/categories')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor', 'User'] })
  fetchSubCategories(@Param('id', ParseIntPipe) id: number) {
    return this.service.fetchSubCategories(id);
  }

  @Get('stores')
  @AdminRole({
    roles: ['Super Admin', 'Admin', 'Editor', 'User', 'Simple User'],
  })
  fetchStores(@Query() query: dtos.CustomerQuery) {
    return this.service.fetchStores(
      query.pagination,
      query.filter,
      query.search,
    );
  }

  @Get('products')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor', 'User'] })
  fetchProducts(@Query() query: ProductQuery) {
    return this.productService.fetchProducts(
      query.pagination,
      query.filter,
      query.search,
      true,
      false,
    );
  }

  @Get('products/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor', 'User'] })
  getProductDetail(@Param('id', ParseIntPipe) id: number) {
    return this.productService.fetchProductById(id);
  }

  @Get('orders')
  @AdminRole({
    roles: [
      'Super Admin',
      'Admin',
      'Editor',
      'User',
      'Simple User',
      'Delivery Agent',
    ],
  })
  fetchOrders(@Query() query: OrderQuery, @Req() request: Request) {
    return this.orderService.fetchOrders(
      query.pagination,
      query.filter,
      request.user as any,
    );
  }

  @Put('update-order-product-status/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  updateOrderProductStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateOrderDto,
    @Req() request: Request,
  ) {
    return this.service.updateOrderProductStatus(id, body, request.user as any);
  }

  @Put('order/:id/:status')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', new ParseEnumPipe(OrderStatus))
    status: OrderStatus,
  ) {
    return this.service.updateOrderStatus(id, status);
  }

  @Post('order/:id/collect-product-from-seller')
  @AdminRole({ roles: ['Delivery Agent'] })
  collectProductFromSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body('products') products: number[],
    @Body('storeId') storeId: number,
    @Req() request: Request,
  ) {
    return this.service.updateOrderProductStatus(
      id,
      {
        status: 'PRODUCT_COLLECTED_FROM_SELLER_BY_DELIVERY_AGENT',
        storeId,
        products,
      },
      request.user as any,
    );
  }

  @Post('order/:id/drop-product-at-distribution-center')
  @AdminRole({ roles: ['Delivery Agent'] })
  dropProductAtDistributionCenter(
    @Param('id', ParseIntPipe) id: number,
    @Body('products') products: number[],
    @Body('storeId') storeId: number,
    @Req() request: Request,
  ) {
    return this.service.updateOrderProductStatus(
      id,
      {
        status: 'PRODUCT_DROPPED_AT_DISTRIBUTION_CENTER_BY_DELIVERY_AGENT',
        storeId,
        products,
      },
      request.user as any,
    );
  }

  @Get('deliveries')
  @AdminRole({ roles: ['Delivery Agent'] })
  fetchDeliveries(@Req() request: Request) {
    return this.service.fetchDeliveries(request.user as any);
  }

  @Post('order/:id/assign-to-agent/:agentId')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  assignOrderToAgent(
    @Param('id', ParseIntPipe) id: number,
    @Param('agentId', ParseIntPipe) agentId: number,
  ) {
    return this.service.assignOrderToAgent(id, agentId);
  }

  @Post('order/:id/store/:storeId/assign-to-agent/:agentId')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  assignStoreToAgent(
    @Param('id', ParseIntPipe) id: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('agentId', ParseIntPipe) agentId: number,
    @Req() request: Request,
  ) {
    return this.service.assignStoreToAgent(
      id,
      storeId,
      agentId,
      request.user as any,
    );
  }

  @Post('product')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'featuredImage', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        limits: { fileSize: 1000000 * 1024 * 1024 }, // 100MB
        fileFilter: (_req, file, cb) =>
          file.mimetype.includes('image')
            ? cb(null, true)
            : cb(new BadRequestException('Only images are allowed'), false),
        storage: diskStorage({
          destination: './images/',
          filename: (_req, file, cb) =>
            cb(
              null,
              `${nanoid()}.${
                file.originalname.split('.')[
                  file.originalname.split('.').length - 1
                ]
              }`,
            ),
        }),
      },
    ),
    new ImageInterceptor(),
  )
  async createProduct(@Body() body: CreateProductDto) {
    const store = await this.storeRepository.findOneBy({
      storeName: 'The Advertisers',
    });
    let storeUser: StoreUsers;
    if (!store) {
      storeUser = await this.userService.createStore({
        storeName: 'The Advertisers',
        contactName: 'Sunny Ikotun',
        contactPhone: '07043863019',
        contactEmail: 's.ikotun@the-advertisers.com',
        password: 'Password1234#',
        stateId: 1,
        street: 'The Advertisers Street',
      });
    }
    if (!storeUser) {
      storeUser = await this.storeUserRepository.findOneBy({
        store,
      });
    }
    return this.productService.createProduct(body, {
      store,
      userId: storeUser.id,
    } as IAuthContext);
  }

  @Put('product/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'featuredImage', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        fileFilter: (_req, file, cb) =>
          file.mimetype.includes('image')
            ? cb(null, true)
            : cb(new BadRequestException('Only images are allowed'), false),
        storage: diskStorage({
          destination: './images/',
          filename: (_req, file, cb) =>
            cb(
              null,
              `${nanoid()}.${
                file.originalname.split('.')[
                  file.originalname.split('.').length - 1
                ]
              }`,
            ),
        }),
      },
    ),
    new ImageInterceptor(),
  )
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
  ) {
    return this.productService.updateProduct(id, body, {} as any);
  }

  @Delete('product/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin'] })
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }

  @Get('customer/:id')
  @AdminRole({
    roles: ['Super Admin', 'Admin', 'Editor', 'User', 'Simple User'],
  })
  getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getCustomerById(id);
  }

  @Post('store/:id/deactivate')
  @AdminRole({ roles: ['Super Admin'] })
  deactivateStore(@Param('id', ParseIntPipe) id: number) {
    return this.service.deactivateStore(id);
  }

  @Post('store/:id/activate')
  @AdminRole({ roles: ['Super Admin'] })
  activateStore(@Param('id', ParseIntPipe) id: number) {
    return this.service.activateStore(id);
  }

  @Put('store/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStoreDto,
  ) {
    return this.service.updateStore(id, body);
  }

  @Put('customer/:id')
  @AdminRole({ roles: ['Super Admin', 'Admin', 'Editor'] })
  updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCustomerDto,
  ) {
    return this.service.updateCustomer(id, body);
  }
}
