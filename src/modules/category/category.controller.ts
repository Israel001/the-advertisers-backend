import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryQuery, CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { StoreGuard } from 'src/guards/store-guard';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageInterceptor } from 'src/lib/image.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private service: CategoryService) {}

  @Post(':id/subCategory')
  @UseGuards(JwtAuthGuard, StoreGuard)
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
    return this.service.createSubCategory(id, body);
  }

  @Get()
  fetch(@Query() query: CategoryQuery) {
    return this.service.fetchMainCategories(query.pagination, query.search);
  }

  @Get(':id/all-sub-categories')
  fetchAllSubCategories(@Param('id', ParseIntPipe) id: number) {
    return this.service.fetchAllSubCategories(id);
  }

  @Get('all-main-categories')
  fetchAllMainCategories() {
    return this.service.fetchAllMainCategories();
  }

  @Get(':id/sub-categories')
  fetchSubCategories(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: CategoryQuery,
  ) {
    return this.service.fetchSubCategories(id, query.pagination, query.search);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, StoreGuard)
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
    return this.service.updateSubCategory(id, body);
  }
}
