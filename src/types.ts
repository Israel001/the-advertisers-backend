import { AdminRoles } from './modules/admin/admin.entities';
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
  adminUserId?: any;
}

export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PaymentType {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

export enum Currencies {
  NGN = 'NGN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PACKED_AND_READY_TO_SEND = 'PACKED_AND_READY_TO_SEND',
  PACKED_AND_READY_TO_PICKUP = 'PACKED_AND_READY_TO_PICKUP',
  PICKED_UP = 'PICKED_UP',
  SENT_FOR_DELIVERY = 'SENT_FOR_DELIVERY',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export enum PaymentProviderType {
  MONNIFY = 'MONNIFY',
}

export interface IAdminAuthContext {
  name: string;
  email: string;
  userId: number;
  store?: any;
  adminUserId: number;
  role: AdminRoles;
}
