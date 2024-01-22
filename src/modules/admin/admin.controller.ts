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
import { ProductQuery, UpdateProductDto } from '../products/products.dto';
import { ProductsService } from '../products/products.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { ImageInterceptor } from 'src/lib/image.interceptor';
import { OrderQuery } from '../order/order.dto';
import { OrderService } from '../order/order.service';
import { OrderStatus } from 'src/types';

@Controller('/admin')
@UseGuards(AdminJwtAuthGuard)
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly productService: ProductsService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  getHello(): string {
    return 'Welcome to The-Advertisers Admin!!!';
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
