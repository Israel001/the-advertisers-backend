import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @Length(1, 150)
  @IsOptional()
  fullName: string;

  @IsNumberString()
  @Length(1, 15)
  @IsOptional()
  phone: string;

  @IsNumber()
  @IsOptional()
  stateId: number;

  @IsNumber()
  @IsOptional()
  lgaId: number;
}

export class CreateCustomerDto {
  @IsString()
  @Length(1, 150)
  fullName: string;

  @IsNumberString()
  @Length(1, 15)
  phone: string;

  @IsEmail()
  email: string;

  @IsNumber()
  stateId: number;

  @IsNumber()
  lgaId: number;

  @IsString()
  street: string;

  @IsString()
  houseNo: string;

  @IsString()
  @IsOptional()
  landmark: string;

  @IsString()
  password: string;
}

export class UpdateStoreDto {
  @IsString()
  @Length(1, 200)
  @IsOptional()
  storeName: string;

  @IsString()
  @Length(1, 150)
  @IsOptional()
  contactName: string;

  @IsString()
  @Length(1, 15)
  @IsOptional()
  contactPhone: string;

  @IsEmail()
  @Length(1, 50)
  @IsOptional()
  contactEmail: string;

  @IsNumber()
  @IsOptional()
  stateId: number;

  @IsNumber()
  @IsOptional()
  lgaId: number;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  houseNo: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  landmark: string;
}

export class CreateStoreDto {
  @IsString()
  @Length(1, 200)
  storeName: string;

  @IsString()
  @Length(1, 150)
  contactName: string;

  @IsString()
  @Length(1, 15)
  contactPhone: string;

  @IsEmail()
  @Length(1, 50)
  contactEmail: string;

  @IsString()
  @Length(1, 50)
  password: string;

  @IsNumber()
  stateId: number;

  @IsNumber()
  lgaId: number;

  @IsString()
  @Length(1, 50)
  street: string;

  @IsString()
  houseNo: string;

  @IsString()
  @Length(1, 50)
  landmark: string;
}

export class InviteUserDto {
  @IsString()
  @Length(1, 150)
  name: string;

  @IsString()
  @Length(1, 15)
  phone: string;

  @IsString()
  @Length(1, 50)
  email: string;
}
