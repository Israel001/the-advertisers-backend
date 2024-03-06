import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  ProductQuery,
  UpdateProductDto,
} from './products.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { StoreGuard } from 'src/guards/store-guard';
import { RoleGuard } from 'src/guards/role-guard';
import { Role } from 'src/decorators/roles.decorator';
import { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageInterceptor } from 'src/lib/image.interceptor';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { IAuthContext } from 'src/types';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/top-selling')
  fetchTopSellingProducts() {
    return this.productsService.fetchTopSellingProducts();
  }

  @Get('/popular-sales')
  fetchPopularSales() {
    return this.productsService.fetchPopularSales();
  }

  @Get('/random-categories')
  fetchRandomCategories() {
    return this.productsService.fetchRandomCategories();
  }

  @Get()
  fetch(@Query() query: ProductQuery) {
    return this.productsService.fetchProducts(
      query.pagination,
      query.filter,
      query.search,
    );
  }

  @Get(':id')
  fetchById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.fetchProductById(id);
  }

  @Get('store-products')
  @UseGuards(JwtAuthGuard, StoreGuard)
  fetchStoreProducts(@Query() query: ProductQuery, @Req() request: Request) {
    const { store } = request.user as IAuthContext;
    query.filter.storeId = store.id.toString();
    return this.productsService.fetchProducts(
      query.pagination,
      query.filter,
      query.search,
      true,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, StoreGuard)
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDto,
    @Req() request: Request,
  ) {
    return this.productsService.updateProduct(id, body, request.user as any);
  }

  @Post()
  @UseGuards(JwtAuthGuard, StoreGuard, RoleGuard)
  @Role({ roles: ['owner', 'admin'] })
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
  create(@Body() body: CreateProductDto, @Req() request: Request) {
    return this.productsService.createProduct(body, request.user as any);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, StoreGuard, RoleGuard)
  @Role({ roles: ['owner', 'admin'] })
  delete(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.productsService.deleteProduct(id, request.user as any);
  }
}
