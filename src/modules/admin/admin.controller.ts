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
import { OrderQuery } from '../order/order.dto';
import { OrderService } from '../order/order.service';
import { IAuthContext, OrderStatus } from 'src/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../category/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../category/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store, StoreUsers } from '../users/users.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Controller('/admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminJwtAuthGuard)
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

  @Get()
  getHello(): string {
    return 'Welcome to The-Advertisers Admin!!!';
  }

  @Post('category/:id/subCategory')
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

  @Put(':id')
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

  @Post('/main-category')
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

  @Put('/main-category/:id')
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

  @Delete('/main-category/:id')
  deleteMainCategory(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteMainCategory(id);
  }

  @Delete('/sub-category/:id')
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteSubCategory(id);
  }

  @Get('/get-slider')
  @AllowUnauthorizedRequest()
  getSlider() {
    return this.service.getSlider();
  }

  @Post('/upload-slider')
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

  @Post('/auth/login')
  @AllowUnauthorizedRequest()
  @UseGuards(AdminLocalAuthGuard)
  login(@Body() _body: dtos.AdminLoginDTO, @Req() req: any) {
    return this.service.login(req.user);
  }

  @Get('/customers')
  fetchCustomers(@Query() query: dtos.CustomerQuery) {
    return this.service.fetchCustomers(
      query.pagination,
      query.filter,
      query.search,
    );
  }

  @Get('/categories')
  fetchCategories(@Query() query: dtos.GeneralQuery) {
    return this.service.fetchCategories(query.search);
  }

  @Get('/main-categories')
  fetchMainCategories(@Query() query: dtos.GeneralQuery) {
    return this.service.fetchMainCategories(query.search);
  }

  @Get('/main-categories/:id/categories')
  fetchSubCategories(@Param('id', ParseIntPipe) id: number) {
    return this.service.fetchSubCategories(id);
  }

  @Get('/stores')
  fetchStores(@Query() query: dtos.CustomerQuery) {
    return this.service.fetchStores(
      query.pagination,
      query.filter,
      query.search,
    );
  }

  @Get('/products')
  fetchProducts(@Query() query: ProductQuery) {
    return this.productService.fetchProducts(
      query.pagination,
      query.filter,
      query.search,
      true,
      true,
    );
  }

  @Get('/orders')
  fetchOrders(@Query() query: OrderQuery) {
    return this.orderService.fetchOrders(
      query.pagination,
      query.filter,
      {} as any,
    );
  }

  @Put('/order/:id/:status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status', new ParseEnumPipe(OrderStatus))
    status: OrderStatus,
  ) {
    return this.service.updateOrderStatus(id, status);
  }

  @Post('/product')
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

  @Put('/product/:id')
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

  @Delete('/product/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }

  @Get('/customer/:id')
  getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getCustomerById(id);
  }

  @Put('/customer/:id/deactivate')
  deactivateCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.service.deactivateCustomer(id);
  }

  @Put('/customer/:id/activate')
  activateCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.service.activateCustomer(id);
  }

  @Put('/store/:id/deactivate')
  deactivateStore(@Param('id', ParseIntPipe) id: number) {
    return this.service.deactivateStore(id);
  }

  @Put('/store/:id/activate')
  activateStore(@Param('id', ParseIntPipe) id: number) {
    return this.service.activateStore(id);
  }

  @Put('/store/:id')
  updateStore(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStoreDto,
  ) {
    return this.service.updateStore(id, body);
  }

  @Put('/customer/:id')
  updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCustomerDto,
  ) {
    return this.service.updateCustomer(id, body);
  }
}
