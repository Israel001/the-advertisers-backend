import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthConfig } from 'src/config/types/jwt-auth.config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer, OTP, StoreUsers } from '../users/users.entity';
import { Repository } from 'typeorm';
import { SharedService } from '../shared/shared.service';
import { ConfigService } from '@nestjs/config';
import { IAuthContext, OTPActionType, UserType } from 'src/types';
import {
  ChangePasswordDto,
  NewResetPasswordDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from './auth.dto';
import { nanoid } from 'nanoid';
import { generateOtp } from 'src/utils';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly jwtConfig: JwtAuthConfig;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(StoreUsers)
    private readonly storeUserRepository: Repository<StoreUsers>,
    @InjectRepository(OTP) private readonly otpRepository: Repository<OTP>,
    private readonly sharedService: SharedService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<JwtAuthConfig>('jwtAuthConfig');
  }

  async login(user: any) {
    if (user.pinId) return user;
    const payload = {
      email: user.email || user.contactEmail,
      id: user.id,
      name: user.fullName,
      phone: user.phone,
      type: user.type,
      psp: user.psp,
      role: user.role,
    };
    switch (user.type) {
      case UserType.CUSTOMER:
        const customerUserModel = this.customerRepository.create({
          id: user.id,
          lastLoggedIn: new Date(),
        });
        this.customerRepository.save(customerUserModel);
        break;
      case UserType.STORE:
        const storeUserModel = this.storeUserRepository.create({
          id: user.id,
          lastLoggedIn: new Date(),
        });
        this.storeUserRepository.save(storeUserModel);
        break;
    }
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async verifyOtp({
    otp,
    pinId,
    userId,
    otpActionType,
    userType,
  }: VerifyOtpDto) {
    const otpInDb = await this.otpRepository.findOneBy({ pinId });
    if (!otpInDb) throw new NotFoundException('Pin ID does not exist');
    if (otpInDb.otp !== otp) throw new UnauthorizedException('Invalid OTP');
    if (otpInDb.expiredAt !== null)
      throw new UnauthorizedException('OTP has expired');
    const diffMs = new Date().valueOf() - new Date(otpInDb.createdAt).valueOf();
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    if (diffMins >= 10) {
      await this.otpRepository.save({ id: otpInDb.id, expiredAt: new Date() });
      throw new UnauthorizedException('OTP has expired');
    }
    await this.otpRepository.save({ id: otpInDb.id, expiredAt: new Date() });
    switch (otpActionType) {
      case OTPActionType.VERIFY_ACCOUNT:
        switch (userType) {
          case UserType.CUSTOMER:
            await this.customerRepository.save({
              id: userId,
              verified: true,
            });
            break;
          case UserType.STORE:
            await this.storeUserRepository.save({ id: userId, verified: true });
            break;
        }
        break;
      case OTPActionType.RESET_PASSWORD:
        const payload = { id: userId, type: userType };
        return this.jwtService.sign(payload, {
          expiresIn: 600,
          secret: this.jwtConfig.resetPwdSecretKey,
        });
    }
    return true;
  }

  async sendOtp({ userId, userType, otpActionType }: SendOtpDto) {
    const pinId = nanoid();
    const otp = generateOtp();
    let templateCode: string, subject: string;
    switch (otpActionType) {
      case OTPActionType.RESET_PASSWORD:
        templateCode = 'reset_password_otp';
        subject = 'Reset Password OTP';
        break;
      case OTPActionType.VERIFY_ACCOUNT:
        templateCode = 'signup_otp';
        subject = 'Account OTP Verification';
        break;
    }
    const user =
      userType === UserType.CUSTOMER
        ? await this.customerRepository.findOneBy({ id: userId })
        : await this.storeUserRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User does not exist');
    const firstname =
      userType === UserType.CUSTOMER
        ? (user as Customer).fullName.split(' ')[0]
        : (user as StoreUsers).name.split(' ')[0];
    await this.sharedService.sendOtp(otp, {
      templateCode,
      subject,
      to: user.email,
      data: { firstname, otp, year: new Date().getFullYear() },
    });
    const otpModel = this.otpRepository.create({
      otp,
      pinId,
    });
    this.otpRepository.save(otpModel);
    return pinId;
  }

  async initiateResetPassword({ emailOrPhone, userType }: ResetPasswordDto) {
    let user: Customer | StoreUsers;
    const conditions = [
      { email: emailOrPhone },
      {
        phone:
          (!emailOrPhone.includes('@') &&
            this.sharedService
              .validatePhoneNumber(emailOrPhone)
              .substring(1)) ||
          '',
      },
    ];
    if (userType == UserType.CUSTOMER) {
      user = await this.customerRepository.findOneBy(conditions);
    } else {
      user = await this.storeUserRepository.findOneBy(conditions);
    }
    if (!user) throw new NotFoundException('User not found');
    const pinId = nanoid();
    const otp = generateOtp();
    await this.sharedService.sendOtp(otp, {
      templateCode: 'reset_password_otp',
      subject: 'Reset Password OTP',
      data: {
        firstname:
          user.type === UserType.CUSTOMER
            ? (user as Customer).fullName.split(' ')[0]
            : (user as StoreUsers).name.split(' ')[0],
        otp,
        year: new Date().getFullYear(),
      },
      to: user.email,
    });
    const otpModel = this.otpRepository.create({
      otp,
      pinId,
    });
    this.otpRepository.save(otpModel);
    return { pinId, userId: user.id, userType: user.type };
  }

  async changePassword(
    { oldPassword, newPassword }: ChangePasswordDto,
    { phone, type }: IAuthContext,
  ) {
    const user = await this.usersService.findByEmailOrPhone(phone, type as any);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch)
      throw new BadRequestException('Current password is incorrect');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    if (user.type === UserType.CUSTOMER) {
      return await this.customerRepository.update(
        { id: user.id },
        { password: hashedPassword },
      );
    } else if (user.type === UserType.STORE) {
      return await this.storeUserRepository.update(
        { id: user.id },
        { password: hashedPassword },
      );
    }
  }

  async resetPassword({ password }: NewResetPasswordDto, token: string) {
    let response: any;
    try {
      response = this.jwtService.verify(token, {
        secret: this.jwtConfig.resetPwdSecretKey,
      });
    } catch (error) {
      throw new UnauthorizedException(
        'Reset password token has expired. Kindly restart the process',
      );
    }
    if (!response.id)
      throw new UnauthorizedException(
        'Kindly provide a valid access token to reset your password',
      );
    const { type, id } = response;
    const user =
      type == UserType.CUSTOMER
        ? await this.customerRepository.findOneBy({ id })
        : await this.storeUserRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    const hashedPassword = await bcrypt.hash(password, 12);
    return type == UserType.CUSTOMER
      ? this.customerRepository.save({
          id: user.id,
          password: hashedPassword,
        })
      : this.storeUserRepository.save({
          id: user.id,
          password: hashedPassword,
        });
  }

  async validateUser(
    emailOrPhone: string,
    password: string,
    type: UserType,
  ): Promise<any> {
    const user: Customer | StoreUsers =
      await this.usersService.findByEmailOrPhone(emailOrPhone, type);
    if (!user) throw new NotFoundException('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      if (user.deletedAt)
        throw new ForbiddenException('This account is disabled');
      if (!user.verified) {
        const pinId = nanoid();
        const otp = generateOtp();
        await this.sharedService.sendOtp(otp, {
          templateCode: 'signup_otp',
          subject: 'Account OTP Verification',
          data: {
            firstname:
              user.type === UserType.CUSTOMER
                ? (user as Customer).fullName.split(' ')[0]
                : (user as StoreUsers).name.split(' ')[0],
            otp,
            year: new Date().getFullYear(),
          },
          to: user.email,
        });
        const otpModel = this.otpRepository.create({ otp, pinId });
        this.otpRepository.save(otpModel);
        return { pinId, id: user.id };
      }
      if (
        type === UserType.STORE &&
        (user as StoreUsers).invited &&
        !user.lastLoggedIn
      ) {
        const diffMs =
          new Date().valueOf() - new Date(user.updatedAt).valueOf();
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
        if (diffMins >= 10) {
          const generatedPassword = nanoid();
          const hashedPassword = await bcrypt.hash(generatedPassword, 12);
          const storeUserModel = this.storeUserRepository.create({
            id: user.id,
            password: hashedPassword,
          });
          await this.storeUserRepository.save(storeUserModel);
          this.sharedService.sendEmail({
            templateCode: 'invite_user',
            to: user.email,
            subject: '',
            data: {
              firstname: (user as StoreUsers).name.split(' ')[0],
              store: (user as StoreUsers).store.storeName,
              password: generatedPassword,
            },
          });
          throw new ForbiddenException('Password has expired');
        }
      }
      return user;
    }
    throw new UnauthorizedException('Invalid details');
  }
}
