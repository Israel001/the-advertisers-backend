import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Addresses,
  Cart,
  Customer,
  OTP,
  Roles,
  Store,
  StoreUsers,
  Wishlist,
} from './users.entity';
import { Like, Repository } from 'typeorm';
import { Lga } from 'src/entities/lga.entity';
import { State } from 'src/entities/state.entity';
import { SharedService } from '../shared/shared.service';
import { nanoid } from 'nanoid';
import { IAuthContext, OrderDir, UserRoles, UserType } from 'src/types';
import * as bcrypt from 'bcryptjs';
import {
  CreateAddressDto,
  CreateCustomerDto,
  CreateStoreDto,
  InviteUserDto,
  UpdateAddressDto,
  UpdateCustomerDto,
  UpdateStoreDto,
} from './users.dto';
import { buildResponseDataWithPagination, generateOtp } from 'src/utils';
import { Order } from '../order/order.entity';
import { Reviews } from '../products/products.entity';
import { PaginationInput } from 'src/base/dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreUsers)
    private readonly storeUserRepository: Repository<StoreUsers>,
    @InjectRepository(Roles) private readonly roleRepository: Repository<Roles>,
    // @InjectRepository(OTP) private readonly otpRepository: Repository<OTP>,
    @InjectRepository(Lga) private readonly lgaRepository: Repository<Lga>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Addresses)
    private readonly addressRepository: Repository<Addresses>,
    @InjectRepository(Reviews)
    private readonly reviewRepository: Repository<Reviews>,
    private readonly sharedService: SharedService,
  ) {}

  async updateStore(id: number, body: UpdateStoreDto) {
    const store = await this.storeRepository.findOneBy({ id });
    if (!store) throw new NotFoundException('Store not found');
    const storeModel = this.storeRepository.create({
      id,
      ...body,
    });
    return this.storeRepository.save(storeModel);
  }

  async updateCustomer(id: number, body: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOneBy({ id });
    if (!customer) throw new NotFoundException('Customer not found');
    const customerModel = this.customerRepository.create({
      id,
      ...(body.fullName ? { fullName: body.fullName } : {}),
      ...(body.phone ? { phone: body.phone } : {}),
      ...(body.email ? { email: body.email } : {}),
    });
    return this.customerRepository.save(customerModel);
  }

  async createStore(user: CreateStoreDto) {
    user.storeName = user.storeName.trim();
    const phoneNumber = this.sharedService.validatePhoneNumber(
      user.contactPhone,
    );
    user.contactPhone = phoneNumber.substring(1);
    const [existingStore, existingStoreUser] = await Promise.all([
      this.storeRepository.findOne({ where: { storeName: user.storeName } }),
      this.storeUserRepository.findOne({
        where: [{ email: user.contactEmail }, { phone: user.contactPhone }],
      }),
    ]);
    if (existingStore) {
      throw new ConflictException(
        `Store name: ${user.storeName} is already taken`,
      );
    }
    if (existingStoreUser) {
      if (existingStoreUser.email === user.contactEmail) {
        throw new ConflictException(
          `User with email: ${user.contactEmail} already exists`,
        );
      }
      if (existingStoreUser.phone === user.contactPhone) {
        throw new ConflictException(
          `User with phone: ${user.contactPhone.substring(3)} already exists`,
        );
      }
    }
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const state = await this.stateRepository.findOne({
      where: { id: user.stateId },
    });
    const storeModel = this.storeRepository.create({
      storeName: user.storeName,
      contactName: user.contactName,
      contactPhone: user.contactPhone,
      contactEmail: user.contactEmail,
      state: { id: user.stateId },
      street: user.street,
      landmark: user.landmark,
      houseNo: user.houseNo,
      address: `${user.houseNo ? `${user.houseNo}, ` : ''}${user.street}, ${
        user.landmark ? `${user.landmark}, ` : ''
      }${state.name}`,
    });
    // const pinId = nanoid();
    // const otp = generateOtp();
    // await this.sharedService.sendOtp(otp, {
    //   templateCode: 'signup_otp',
    //   subject: 'Account OTP Verification',
    //   data: {
    //     firstname: user.contactName.split(' ')[0],
    //     otp,
    //     year: new Date().getFullYear(),
    //   },
    //   to: user.contactEmail,
    // });
    // const otpModel = this.otpRepository.create({ otp, pinId });
    // this.otpRepository.save(otpModel);
    const store = await this.storeRepository.save(storeModel);
    const ownerRole = await this.roleRepository.findOne({
      where: { name: UserRoles.Owner },
    });
    const userModel = this.storeUserRepository.create({
      name: user.contactName,
      phone: user.contactPhone,
      email: user.contactEmail,
      password: hashedPassword,
      type: UserType.STORE,
      verified: true,
      invited: false,
      store: { id: store.id },
      role: { id: ownerRole.id },
    });
    return this.storeUserRepository.save(userModel);
    // return { pinId, id: userInDB.id };
  }

  async deleteAddress(id: number, { userId }: IAuthContext) {
    const addressExists = await this.addressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!addressExists) throw new NotFoundException('Address not found');
    if (addressExists.customer.id !== userId)
      throw new UnauthorizedException('Not authorized to delete this address');
    if (addressExists.isMainAddress)
      throw new ForbiddenException('Not allowed to delete main address');
    return this.addressRepository.softDelete({ id });
  }

  async setAsMainAddress(id: number, { userId }: IAuthContext) {
    const addressExists = await this.addressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!addressExists) throw new NotFoundException('Address not found');
    if (addressExists.customer.id !== userId)
      throw new UnauthorizedException('Not authorized to update this address');
    if (addressExists.isMainAddress) return;
    const previousMainAddress = await this.addressRepository.findOneBy({
      customer: { id: userId },
      isMainAddress: true,
    });
    if (previousMainAddress) {
      await this.addressRepository.save(
        this.addressRepository.create({
          id: previousMainAddress.id,
          isMainAddress: false,
        }),
      );
    }
    await this.addressRepository.save(
      this.addressRepository.create({
        id: addressExists.id,
        isMainAddress: true,
      }),
    );
  }

  async updateAddress(
    id: number,
    address: UpdateAddressDto,
    { userId }: IAuthContext,
  ) {
    const addressExists = await this.addressRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!addressExists) throw new NotFoundException('Address not found');
    if (addressExists.customer.id !== userId)
      throw new UnauthorizedException('Not authorized to update this address');
    const state = await this.stateRepository.findOne({
      where: { id: address.stateId },
    });
    const addressModel = this.addressRepository.create({
      id,
      ...address,
      state: { id: address.stateId },
      name: address.name,
      street: address.street,
      landmark: address.landmark,
      houseNo: address.houseNo,
      address: `${address.houseNo ? `${address.houseNo}` : ''}, ${
        address.street
      }, ${address.landmark ? `${address.landmark},` : ''}, ${state.name}`,
    });
    await this.addressRepository.save(addressModel);
  }

  async createNewAddress(address: CreateAddressDto, { userId }: IAuthContext) {
    const addressCount = await this.addressRepository.findBy({
      customer: { id: userId },
    });
    if (addressCount.length >= 4)
      throw new ForbiddenException('Not allowed to have more than 4 addresses');
    const state = await this.stateRepository.findOne({
      where: { id: address.stateId },
    });
    const addressModel = this.addressRepository.create({
      customer: { id: userId },
      name: address.name,
      state: { id: address.stateId },
      street: address.street,
      landmark: address.landmark,
      houseNo: address.houseNo,
      address: `${address.houseNo ? `${address.houseNo}` : ''}, ${
        address.street
      }, ${address.landmark ? `${address.landmark},` : ''}, ${state.name}`,
    });
    await this.addressRepository.save(addressModel);
  }

  async createCustomer(user: CreateCustomerDto) {
    const phoneNumber = this.sharedService.validatePhoneNumber(user.phone);
    user.phone = phoneNumber.substring(1);
    const [existingUser] = await Promise.all([
      this.customerRepository.findOne({
        where: [{ email: user.email }, { phone: user.phone }],
      }),
    ]);
    if (existingUser) {
      if (existingUser.email === user.email) {
        throw new ConflictException(
          `User with email: ${user.email} already exist`,
        );
      }
      if (existingUser.phone === user.phone) {
        throw new ConflictException(
          `User with phone: ${user.phone.substring(3)} already exist`,
        );
      }
    }
    const hashedPassword = await bcrypt.hash(user.password, 12);
    // const pinId = nanoid();
    // const otp = generateOtp();
    // await this.sharedService.sendOtp(otp, {
    //   templateCode: 'signup_otp',
    //   subject: 'Account OTP Verification',
    //   data: {
    //     firstname: user.fullName.split(' ')[0],
    //     otp,
    //     year: new Date().getFullYear(),
    //   },
    //   to: user.email,
    // });
    // const otpModel = this.otpRepository.create({ otp, pinId });
    // this.otpRepository.save(otpModel);
    // const lga = await this.lgaRepository.findOne({ where: { id: user.lgaId } });
    const state = await this.stateRepository.findOne({
      where: { id: user.stateId },
    });
    const userModel = this.customerRepository.create({
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      password: hashedPassword,
      type: UserType.CUSTOMER,
      verified: true, // should be false but set to true for now
    });
    const customer = await this.customerRepository.save(userModel);
    const addressModel = this.addressRepository.create({
      customer: { id: customer.id },
      state: { id: user.stateId },
      street: user.street,
      landmark: user.landmark,
      houseNo: user.houseNo,
      address: `${user.houseNo ? `${user.houseNo}, ` : ''}${user.street}, ${
        user.landmark ? `${user.landmark}, ` : ''
      }${state.name}`,
    });
    await this.addressRepository.save(addressModel);
    return customer;
    // const userInDB = await this.customerRepository.save(userModel);
    // return { pinId, id: userInDB.id };
  }

  async findByEmailOrPhone(
    emailOrPhone: string,
    type: UserType = UserType.CUSTOMER,
  ): Promise<Customer | StoreUsers> {
    let username: string;
    try {
      username = this.sharedService
        .validatePhoneNumber(emailOrPhone)
        .substring(1);
    } catch (error) {
      username = emailOrPhone;
    } finally {
      if (type === UserType.CUSTOMER) {
        return this.customerRepository.findOneBy([
          { email: username },
          { phone: username },
        ]);
      }
      if (type === UserType.STORE) {
        const storeUser = await this.storeUserRepository.findOneBy([
          { email: username },
          { phone: username },
        ]);
        if (!storeUser) return;
        return storeUser;
      }
    }
  }

  async fetchRoles() {
    return this.roleRepository.find();
  }

  async getUserDetails(
    { userId, type, store }: IAuthContext,
    pagination: PaginationInput,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const userInDB =
      type === UserType.CUSTOMER
        ? await this.customerRepository.findOneBy({ id: userId })
        : await this.storeUserRepository.findOneBy({ id: userId });
    if (type === UserType.STORE) {
      const totalOrders = await this.orderRepository.countBy({
        stores: Like(`%${store.id}%`),
      });
      const userOrders = await this.orderRepository.find({
        where: { stores: Like(`%${store.id}%`) },
        order: { createdAt: OrderDir.DESC },
        skip: limit * (page - 1),
        take: limit,
      });
      userInDB['orders'] = buildResponseDataWithPagination(
        userOrders,
        totalOrders,
        {
          page,
          limit,
        },
      );
    }
    if (type === UserType.CUSTOMER) {
      const totalOrders = await this.orderRepository.countBy({
        customer: { id: userId },
      });
      const userCart = await this.cartRepository.findOneBy({
        customer: { id: userId },
      });
      const userWishlist = await this.wishlistRepository.findOneBy({
        customer: { id: userId },
      });
      const userOrders = await this.orderRepository.find({
        where: { customer: { id: userId } },
        order: { createdAt: OrderDir.DESC },
        skip: limit * (page - 1),
        take: limit,
      });
      const userAddresses = await this.addressRepository.findBy({
        customer: { id: userId },
      });
      const userReviews = await this.reviewRepository.findBy({
        customer: { id: userId },
      });
      userInDB['cart'] = userCart ? JSON.parse(userCart.data) : [];
      userInDB['wishlist'] = userWishlist ? JSON.parse(userWishlist.data) : [];
      userInDB['orders'] = buildResponseDataWithPagination(
        userOrders,
        totalOrders,
        {
          page,
          limit,
        },
      );
      userInDB['addresses'] = userAddresses;
      userInDB['reviews'] = userReviews;
    }
    return userInDB;
  }

  async inviteUser(user: InviteUserDto, { store }: IAuthContext) {
    const phoneNumber = this.sharedService.validatePhoneNumber(user.phone);
    user.phone = phoneNumber.substring(1);
    const [existingStoreUser, existingCustomer] = await Promise.all([
      this.storeUserRepository.findOneBy([
        { email: user.email },
        { phone: user.phone },
      ]),
      this.customerRepository.findOneBy([
        { email: user.email },
        { phone: user.phone },
      ]),
    ]);
    let userInDB: StoreUsers;
    if (existingStoreUser) {
      if (existingStoreUser.deletedAt) {
        const storeUserModel = this.storeUserRepository.create({
          id: existingStoreUser.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          type: UserType.STORE,
          verified: true,
          deletedAt: null,
          store: { id: store.id },
        });
        userInDB = await this.storeUserRepository.save(storeUserModel);
      } else {
        if (existingStoreUser.email === user.email)
          throw new ConflictException(
            `User with email: ${user.email} already exists`,
          );
        if (existingStoreUser.phone === user.phone)
          throw new ConflictException(
            `User with phone: ${user.phone.substring(3)} already exists`,
          );
      }
    }
    if (existingCustomer) {
      if (existingCustomer.email === user.email)
        throw new ConflictException(
          `User with email: ${user.email} already exists`,
        );
      if (existingCustomer.phone === user.phone)
        throw new ConflictException(
          `User with phone: ${user.phone.substring(3)} already exists`,
        );
    }
    const generatedPassword = nanoid();
    const hashedPassword = await bcrypt.hash(generatedPassword, 12);
    if (!userInDB) {
      const role = await this.roleRepository.findOneBy({
        name: UserRoles.User,
      });
      const storeUserModel = this.storeUserRepository.create({
        email: user.email,
        name: user.name,
        phone: user.phone,
        type: UserType.STORE,
        password: hashedPassword,
        verified: true,
        invited: true,
        store: { id: store.id },
        role: { id: role.id },
      });
      userInDB = await this.storeUserRepository.save(storeUserModel);
    }
    this.sharedService.sendEmail({
      templateCode: 'invite_user',
      to: user.email,
      subject: 'Invitation to The Advertisers',
      data: {
        firstname: user.name.split(' ')[0],
        store: store.storeName,
        password: generatedPassword,
      },
    });
  }

  async removeUser(userId: number) {
    const storeUserModel = this.storeUserRepository.create({
      id: userId,
      deletedAt: new Date(),
    });
    await this.storeUserRepository.save(storeUserModel);
    const userInfo = await this.storeUserRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    this.sharedService.sendEmail({
      templateCode: 'remove_user',
      to: userInfo.email,
      subject: 'Account Deactivation',
      data: {
        firstname: userInfo.name.split(' ')[0],
        store: userInfo.store.storeName,
      },
    });
    return true;
  }

  async changeUserRole(
    userId: number,
    roleId: number,
    { userId: authUserId }: IAuthContext,
  ) {
    const storeUser = await this.storeUserRepository.findOneBy({
      id: userId,
    });
    const role = await this.roleRepository.findOneBy({ id: roleId });
    if (userId === authUserId)
      throw new ForbiddenException('Cannot update your own role');
    if (!storeUser)
      throw new NotFoundException('User does not have a role before');
    if (!storeUser.lastLoggedIn)
      throw new ForbiddenException('Cannot change role for an inactive user');
    if (role.name === UserRoles.Owner)
      throw new ForbiddenException('Cannot make user an owner');
    const storeUserModel = this.storeUserRepository.create({
      id: storeUser.id,
      role: { id: roleId },
    });
    await this.storeUserRepository.save(storeUserModel);
    this.sharedService.sendEmail({
      templateCode: 'change_user_role',
      to: storeUser.email,
      subject: 'User Role Update',
      data: {
        firstname: storeUser.name.split(' ')[0],
        store: storeUser.store.storeName,
        role: role.name,
      },
    });
    return true;
  }

  async getStoreUsers({ store }: IAuthContext) {
    return this.storeUserRepository.findBy({ store: { id: store.id } });
  }

  async saveWishlist(wishlistData: string, { userId }: IAuthContext) {
    const wishlistExists = await this.wishlistRepository.findOneBy({
      customer: { id: userId },
    });
    const wishlistModel = this.wishlistRepository.create({
      ...(wishlistExists ? { id: wishlistExists.id } : {}),
      data: wishlistData,
      customer: { id: userId },
    });
    return this.wishlistRepository.save(wishlistModel);
  }

  async saveCart(cartData: string, { userId }: IAuthContext) {
    const cartExists = await this.cartRepository.findOneBy({
      customer: { id: userId },
    });
    const cartModel = this.cartRepository.create({
      ...(cartExists ? { id: cartExists.id } : {}),
      data: cartData,
      customer: { id: userId },
    });
    return this.cartRepository.save(cartModel);
  }
}
