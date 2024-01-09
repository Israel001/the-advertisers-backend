import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SmtpConfig } from 'src/config/types/smtp.config';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { Repository } from 'typeorm';
import phone from 'phone';
import { IEmailDto } from 'src/types';
import mailer from 'nodemailer-promise';
import { replacer } from 'src/utils';

@Injectable()
export class SharedService {
  private readonly smtpConfig: SmtpConfig;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(NotificationTemplates)
    private readonly notificationTemplateRepository: Repository<NotificationTemplates>,
  ) {
    this.smtpConfig = this.configService.get<SmtpConfig>('smtpConfig');
  }

  validatePhoneNumber(phoneNo: string) {
    const { isValid, phoneNumber } = phone(phoneNo, {
      country: 'NG',
    });
    if (!isValid)
      throw new BadRequestException(
        'Phone number must be a valid nigeria phone number',
      );
    return phoneNumber;
  }

  async sendEmail(email: IEmailDto) {
    const sendMail = mailer.config({
      host: this.smtpConfig.host,
      port: this.smtpConfig.port,
      secure: true,
      from: 'WasteNG <no-reply@waste.ng>',
      auth: {
        user: this.smtpConfig.username,
        pass: this.smtpConfig.password,
      },
    });
    const notificationTemplate =
      await this.notificationTemplateRepository.findOne({
        where: {
          code: email.templateCode,
        },
      });
    if (!notificationTemplate)
      throw new NotFoundException(
        `Notification template: ${email.templateCode} does not exist`,
      );
    email.html = email.data
      ? replacer(0, Object.entries(email.data), notificationTemplate.body)
      : notificationTemplate.body;
    delete email.templateCode;
    if (!email.bcc) email.bcc = 'admin@waste.ng';
    if (!email.from) email.from = 'WasteNG <no-reply@waste.ng>';
    sendMail(email);
  }

  async sendOtp(otp: string, { templateCode, subject, data, to }: IEmailDto) {
    if (to) {
      await this.sendEmail({
        templateCode,
        to,
        subject,
        data,
      });
    }

    return otp;
  }
}
