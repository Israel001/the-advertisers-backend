import {
  IsEmail,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateAddressDto {
  @IsNumber()
  @IsOptional()
  stateId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  houseNo: string;

  @IsString()
  @IsOptional()
  landmark: string;
}

export class UpdateCustomerDto {
  @IsString()
  @Length(1, 150)
  @IsOptional()
  fullName: string;

  @IsNumberString()
  @Length(1, 15)
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;
}

export class CreateAddressDto {
  @IsNumber()
  stateId: number;

  @IsString()
  name: string;

  @IsString()
  street: string;

  @IsString()
  @IsOptional()
  houseNo: string;

  @IsString()
  @IsOptional()
  landmark: string;
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

  @IsString()
  street: string;

  @IsString()
  @IsOptional()
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

  @IsString()
  @IsOptional()
  street: string;

  @IsString()
  @IsOptional()
  houseNo: string;

  @IsString()
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

  @IsString()
  street: string;

  @IsString()
  @IsOptional()
  houseNo?: string;

  @IsString()
  @IsOptional()
  landmark?: string;
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
