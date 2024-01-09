import { Roles, Store } from './modules/users/users.entity';

export interface RoleDecoratorOptionsInterface {
  roles: string[];
}

export enum UserType {
  CUSTOMER = 'CUSTOMER',
  STORE = 'STORE',
}

export interface IEmailDto {
  templateCode: string;
  to?: string;
  subject: string;
  from?: string;
  bcc?: string;
  html?: string;
  data?: any;
}

export enum UserRoles {
  Owner = 'Owner',
  Admin = 'Admin',
  User = 'User',
}

export enum OTPActionType {
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export interface IAuthContext {
  email: string;
  userId: number;
  name: string;
  phone: string;
  type: string;
  store: Store;
  role: Roles;
}
