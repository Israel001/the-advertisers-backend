import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsBooleanString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from 'src/base/dto';

export class ProductFilter {
  @IsOptional()
  @IsBooleanString()
  outOfStock: string;

  @IsOptional()
  @IsNumberString()
  minPrice: string;

  @IsOptional()
  @IsNumberString()
  maxPrice: string;

  @IsOptional()
  @IsNumberString()
  avgRating: string;

  @IsOptional()
  @IsNumberString()
  storeId: string;

  @IsOptional()
  @IsBooleanString()
  published: string;
}

export class ProductQuery {
  @ValidateNested()
  @Type(() => ProductFilter)
  @IsOptional()
  filter?: ProductFilter;

  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  outOfStock: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  published: boolean;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  discountPrice: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  attributes: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoryId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  mainCategoryId: number;

  @IsString()
  brand: string;

  featuredImage: string;

  images: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseInt(value))
  quantity: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  outOfStock: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  published: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  discountPrice: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  attributes: string;

  featuredImage: string;

  images: string;
}
