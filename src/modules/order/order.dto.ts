import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from 'src/base/dto';
import { IsValidDate } from 'src/tools/date-validator';
import { OrderStatus } from 'src/types';

export class CreateOrderDto {
  @IsString()
  details: string;

  @IsNumber()
  paymentId: number;

  @IsString()
  stores: string;
}

export class UpdateOrderDto {
  @IsNumber()
  storeId: number;

  @IsArray()
  products: number[];

  @IsString()
  status: string;
}

export class OrderFilter {
  @IsOptional()
  @IsValidDate()
  startDate?: Date;

  @IsOptional()
  @IsValidDate()
  endDate?: Date;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class OrderQuery {
  @ValidateNested()
  @Type(() => OrderFilter)
  @IsOptional()
  filter?: OrderFilter;

  @ValidateNested()
  @Type(() => PaginationInput)
  pagination?: PaginationInput;
}
