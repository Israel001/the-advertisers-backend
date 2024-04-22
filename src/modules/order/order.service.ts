import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Order, Payment } from './order.entity';
import { CreateOrderDto, OrderFilter } from './order.dto';
import {
  Currencies,
  IAuthContext,
  OrderDir,
  OrderStatus,
  PaymentType,
} from 'src/types';
import { PaginationInput } from 'src/base/dto';
import { buildResponseDataWithPagination } from 'src/utils';
import axios from 'axios';
import { PaystackConfig } from 'src/config/types/paystack.config';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  private readonly paystackConfig: PaystackConfig;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService,
  ) {
    this.paystackConfig =
      this.configService.get<PaystackConfig>('paystackConfig');
  }

  async verifyTransaction(transactionId: string, amount: number) {
    const paymentExists = await this.paymentRepository.findOne({
      where: { transactionId: transactionId.toString() },
    });
    if (paymentExists) throw new ConflictException('Duplicate payment');
    const transResponse = await axios
      .get(
        `${this.paystackConfig.baseUrl}/transaction/verify/${encodeURIComponent(
          transactionId,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackConfig.secretKey}`,
          },
        },
      )
      .catch((error) => {
        console.log(error.response);
        throw error;
      });
    const data = transResponse.data.data;
    if (
      data.status.toLowerCase() !== 'success' ||
      +data.amount / 100 !== amount
    ) {
      const paymentModel = this.paymentRepository.create({
        transactionId: transactionId.toString(),
        metadata: JSON.stringify(data),
        type: PaymentType.INCOMING,
        amount,
        channel: data.channel,
        status: data.status,
        currencies: Currencies.NGN,
      });
      await this.paymentRepository.save(paymentModel);
      throw new NotAcceptableException('Transaction is not valid');
    }
    const paymentModel = this.paymentRepository.create({
      transactionId: transactionId.toString(),
      metadata: JSON.stringify(data),
      type: PaymentType.INCOMING,
      amount,
      channel: data.channel,
      status: data.status,
      currencies: Currencies.NGN,
    });
    return this.paymentRepository.save(paymentModel);
  }

  async fetchOrders(
    pagination: PaginationInput,
    filter: OrderFilter,
    { userId, store }: IAuthContext,
  ) {
    const { page = 1, limit = 20 } = pagination;
    const conditions = {
      ...(userId && !store ? { customer: { id: userId } } : {}),
      ...(store ? { store: { id: store } } : {}),
      ...(filter?.status ? { status: filter?.status } : {}),
      ...(filter?.startDate
        ? { createdAt: MoreThanOrEqual(filter?.startDate) }
        : {}),
      ...(filter?.endDate
        ? { createdAt: LessThanOrEqual(filter?.endDate) }
        : {}),
    };
    const totalOrders = await this.orderRepository.countBy(conditions);
    const orders = await this.orderRepository.find({
      where: conditions,
      order: {
        [pagination.orderBy || 'createdAt']:
          pagination.orderDir || OrderDir.DESC,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return buildResponseDataWithPagination(orders, totalOrders, {
      page,
      limit,
    });
  }

  async createOrder(order: CreateOrderDto, { userId }: IAuthContext) {
    const payment = await this.paymentRepository.findOneBy({
      id: order.paymentId,
    });
    if (!payment)
      throw new NotFoundException('Provided payment does not exist');
    if (!payment.status.toLowerCase().includes('success')) {
      throw new NotAcceptableException('Provided payment is not valid');
    }
    const existingOrder = await this.orderRepository.findOneBy({
      payment: { id: order.paymentId },
    });
    if (existingOrder)
      throw new ConflictException('Order with same payment already exists');
    const orderModel = this.orderRepository.create({
      customer: { id: userId },
      details: order.details,
      payment: { id: order.paymentId },
      status: OrderStatus.PENDING,
      reference: uuidv4(),
    });
    return this.orderRepository.save(orderModel);
  }
}
