import { Injectable } from '@nestjs/common';
import { INotificationTemplatesSeed, ISeeder } from '../seeder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTemplates } from '../../entities/notification-templates.entity';
import { Repository } from 'typeorm';
import { seederRunner } from '../shared';

@Injectable()
export default class NotificationTemplatesSeed implements ISeeder {
  private templatesData: INotificationTemplatesSeed[] = [
    {
      code: 'reset_password_otp',
      body: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <body>
    <table cellspacing="0" width="100%">
      <tr>
        <td></td>
        <td width="800" style="padding: 2rem; background: #f2f2f2">
          <div
            style="background: white; text-align: center; padding: 3rem 2rem"
          >
            <a href="https://waste.ng">
              <img
                style="height: 100px"
                alt="WasteNG Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1687015607/wasteng-logo-4_emw5ix.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1 style="font-weight: 500; font-size: 24px; line-height: 29.05px">
              Hello {{firstname}},
            </h1>
            <div
              style="
                font-weight: 400;
                font-size: 16px;
                line-height: 19.36px;
                margin-top: 2rem;
              "
            >
              <span style="font-size: 20px"
                >Here is your One-time Password</span
              >
              <p style="font-weight: bold; font-size: 32px">{{otp}}</p>
              <p style="color: red">It will expire within 10 minutes</p>
            </div>
            <div
              style="
                font-weight: 400;
                font-size: 16px;
                line-height: 19.36px;
                margin-top: 2rem;
              "
            >
              <i>If you didn't request this, please ignore this email.</i>
            </div>
            <hr
              style="margin: 3rem 0; border: none; border-top: 1px solid black"
            />
            <div
              style="
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
                font-weight: 400;
                line-height: 14.52px;
              "
            >
              <span style="display: block"
                >Copyright (C) {{year}} The-advertisers received. All rights
                reserved.</span
              >
            </div>
            <div
              style="
                margin-top: 1rem;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
                font-weight: 400;
                line-height: 14.52px;
              "
            >
              <span style="display: block">Our mailing address is:</span>
              <span style="display: block"
                >40b Isale Eko Avenue, Dolphin Estate, Ikoyi</span
              >
              <span>Lagos, Nigeria</span>
            </div>
          </div>
        </td>
        <td></td>
      </tr>
    </table>
  </body>
</html>
`,
    },
    {
      code: 'signup_otp',
      body: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <body>
    <table cellspacing="0" width="100%">
      <tr>
        <td></td>
        <td width="800" style="padding: 2rem; background: #f2f2f2">
          <div
            style="background: white; text-align: center; padding: 3rem 2rem"
          >
            <a href="https://waste.ng">
              <img
                style="height: 100px"
                alt="WasteNG Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1687015607/wasteng-logo-4_emw5ix.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1 style="font-weight: 500; font-size: 24px; line-height: 29.05px">
              Hello {{firstname}},
            </h1>
            <div
              style="
                font-weight: 400;
                font-size: 16px;
                line-height: 19.36px;
                margin-top: 2rem;
              "
            >
              <span style="font-size: 20px"
                >Here is your One-time Password</span
              >
              <p style="font-weight: bold; font-size: 32px">{{otp}}</p>
              <p style="color: red">It will expire within 10 minutes</p>
            </div>
            <div
              style="
                font-weight: 400;
                font-size: 16px;
                line-height: 19.36px;
                margin-top: 2rem;
              "
            >
              <i>If you didn't request this, please ignore this email.</i>
            </div>
            <hr
              style="margin: 3rem 0; border: none; border-top: 1px solid black"
            />
            <div
              style="
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
                font-weight: 400;
                line-height: 14.52px;
              "
            >
              <span style="display: block"
                >Copyright (C) {{year}} The-advertisers received. All rights
                reserved.</span
              >
            </div>
            <div
              style="
                margin-top: 1rem;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.6);
                font-weight: 400;
                line-height: 14.52px;
              "
            >
              <span style="display: block">Our mailing address is:</span>
              <span style="display: block"
                >40b Isale Eko Avenue, Dolphin Estate, Ikoyi</span
              >
              <span>Lagos, Nigeria</span>
            </div>
          </div>
        </td>
        <td></td>
      </tr>
    </table>
  </body>
</html>
`,
    },
  ];

  constructor(
    @InjectRepository(NotificationTemplates)
    private notificationTemplateRepo: Repository<NotificationTemplates>,
  ) {}

  async run(): Promise<boolean> {
    return seederRunner({
      templatesData: this.templatesData,
      notificationTemplateRepo: this.notificationTemplateRepo,
    });
  }
}
