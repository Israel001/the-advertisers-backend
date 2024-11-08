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
    {
      code: 'agent_update_order',
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
            <a href="https://the-advertisers.com">
              <img
                style="height: 100px"
                alt="The Advertisers Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1705646018/test_prlgw8.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1
              style="
                font-weight: 500;
                font-size: 24px;
                line-height: 29.05px;
                margin-top: 2rem;
              "
            >
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
                >Delivery Agent "{{agentName}}" updated the order
                "{{referenceNo}}" status for store "{{storeName}}" products to:
                "{{orderStatus}}"</span
              >
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
      code: 'assign_store_to_agent',
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
            <a href="https://the-advertisers.com">
              <img
                style="height: 100px"
                alt="The Advertisers Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1705646018/test_prlgw8.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1
              style="
                font-weight: 500;
                font-size: 24px;
                line-height: 29.05px;
                margin-top: 2rem;
              "
            >
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
                >A pickup task has been assigned to you</span
              >
            </div>
            <p>Store Name: {{storeName}}</p>
            <p>Phone number: {{storeContact}}</p>
            <p>Address: {{storeAddress}}</p>
            <p>
              Kindly login into the <a href="{{adminLink}}">admin portal</a> and
              confirm the products you are to receive.
            </p>
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
      code: 'order_packed_and_ready_to_pickup',
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
            <a href="https://the-advertisers.com">
              <img
                style="height: 100px"
                alt="The Advertisers Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1705646018/test_prlgw8.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1
              style="
                font-weight: 500;
                font-size: 24px;
                line-height: 29.05px;
                margin-top: 2rem;
              "
            >
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
                >Order with reference number "{{referenceNo}}" is packed and
                ready to be picked up</span
              >
              <p>Address: {{centerAddress}}</p>
              <p>Phone Number: {{centerContact}}</p>
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
      code: 'order_picked_up',
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
            <a href="https://the-advertisers.com">
              <img
                style="height: 100px"
                alt="The Advertisers Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1705646018/test_prlgw8.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1
              style="
                font-weight: 500;
                font-size: 24px;
                line-height: 29.05px;
                margin-top: 2rem;
              "
            >
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
                >This email is to notify you that your order with reference
                number "{{referenceNo}}" has been picked up from the
                distribution center.</span
              >
              <p>
                Please if you have any issue regarding this order, kindly reach
                out to us
              </p>
              <p>Thank you for shopping with us.</p>
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
      code: 'seller_update_order',
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
            <a href="https://the-advertisers.com">
              <img
                style="height: 100px"
                alt="The Advertisers Logo"
                src="https://res.cloudinary.com/dyrn5jw78/image/upload/v1705646018/test_prlgw8.png"
                decoding="async"
                data-nimg="intrinsic"
              />
            </a>
            <h1
              style="
                font-weight: 500;
                font-size: 24px;
                line-height: 29.05px;
                margin-top: 2rem;
              "
            >
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
                >Seller "{{storeName}}" updated the order "{{referenceNo}}"
                status for their products to: "{{orderStatus}}"</span
              >
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
