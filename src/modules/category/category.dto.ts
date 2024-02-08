import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { PaginationInput } from 'src/base/dto';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  featuredImage: string;
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
  
  featuredImage: string;
}

export class CategoryQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}
