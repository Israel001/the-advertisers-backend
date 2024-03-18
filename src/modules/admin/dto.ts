import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { PaginationInput } from "src/base/dto";
import { IsValidDate } from "src/tools/date-validator";

export class AdminLoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class CreateMainCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  featuredImage: string;
}

export class UpdateMainCategoryDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  featuredImage: string;
}

export class CustomerFilter {
  @IsOptional()
  @IsValidDate()
  startDate?: Date;

  @IsOptional()
  @IsValidDate()
  endDate?: Date;
}

export class GeneralQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}

export class CustomerQuery {
  @ValidateNested()
  @Type(() => CustomerFilter)
  @IsOptional()
  filter?: CustomerFilter;

  @IsOptional()
  @IsString()
  search?: string;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}